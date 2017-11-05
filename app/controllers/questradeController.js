const Questrade = require('questrade');
const fixerController = require('./fixerController.js');

var exports = (module.exports = {});

exports.dashboard = function(req, res) {
  // https://www.npmjs.com/package/questrade
  var qt = new Questrade(process.env.QT_KEY);

  function isUp(stock) {
    if (parseFloat(stock.openPnl) > 0) {
      return true;
    }
    return false;
  }

  function calcProfitOrLoss(stock) {
    var profitOrLoss =
      (stock.openQuantity * stock.currentPrice -
        stock.openQuantity * parseFloat(stock.averageEntryPrice)) /
      (stock.openQuantity * parseFloat(stock.averageEntryPrice));
    if (profitOrLoss < 100) {
      return (profitOrLoss * 100).toFixed(2);
    } else {
      return (profitOrLoss - 100).toFixed(2);
    }
  }

  // Object to pass to template
  var qtstocks = {
    title: 'QT Stock Watch: Dashboard'
  };

  qt.on('ready', function() {
    qt.getPositions(function(err, balances) {
      if (err) {
        console.error('Error while trying to getPositions()', err);
        res.status(500).render('500', {
          messages: { error: 'Failed to connect to Questrade API.' }
        });
        return false;
      }

      balances.positions.forEach(function callback(stock, i) {
        stock.isUp = isUp(stock);
        stock.percentPnl = calcProfitOrLoss(stock);

        stock.currentPrice = stock.currentPrice.toFixed(2);
        stock.openPnl = parseFloat(stock.openPnl).toFixed(2);
        stock.averageEntryPrice = parseFloat(stock.averageEntryPrice).toFixed(
          2
        );
      }); // end foreach

      qtstocks.positions = balances.positions;

      var lookupSymbols = [];
      balances.positions.forEach(function(stock, i) {
        lookupSymbols.push(stock.symbol);
      });

      qt.getSymbols(lookupSymbols, function(err, symbols) {
        if (err) {
          console.error('Error while trying to getSymbols()', err);
          res.status(500).render('500', {
            messages: { error: 'Failed to connect to Questrade API.' }
          });
          return false;
        }

        qtstocks.positions.forEach(function(symbol, i) {
          // All the properties of `additionalStockData` can be seen here:
          // http://www.questrade.com/api/documentation/rest-operations/market-calls/symbols-id
          symbol.additionalStockData = symbols[symbol.symbol];

          if (symbol.additionalStockData.currency == 'CAD') {
            symbol.isCanadian = true;
          }
          if (symbol.additionalStockData.currency == 'USD') {
            symbol.isAmerican = true;
          }
          if (symbol.additionalStockData.exDate) {
            symbol.additionalStockData.exDate = symbol.additionalStockData.exDate.split(
              'T'
            )[0];
          }
        });

        fixerController.getCadExchangeRate(function(err, cadExchangeRate) {
          if (err) {
            console.error(
              'Error while trying to connect to the Fixer API.',
              err
            );
            res.status(500).render('500', {
              messages: { error: 'Failed to connect to the Fixer.io API.' }
            });
            return false;
          }

          var totalCurrentPortfolioValue = 0;

          qtstocks.positions.forEach(function(stock, i) {
            if (stock.isAmerican) {
              totalCurrentPortfolioValue =
                totalCurrentPortfolioValue +
                stock.openQuantity * stock.currentPrice * cadExchangeRate;
              stock.totalCadValue =
                stock.openQuantity * stock.currentPrice * cadExchangeRate;
            }
            if (stock.isCanadian) {
              totalCurrentPortfolioValue =
                totalCurrentPortfolioValue +
                stock.openQuantity * stock.currentPrice;
              stock.totalCadValue = stock.openQuantity * stock.currentPrice;
            }
          });

          qtstocks.totalPortfolioValueCad = totalCurrentPortfolioValue;

          // Now, calc the percentage of the whole portfolio
          qtstocks.positions.forEach(function(stock, i) {
            stock.percentageTotalCad = (stock.totalCadValue /
              qtstocks.totalPortfolioValueCad *
              100
            ).toFixed(2);
          });

          // Make an array for use on the front-end
          qtstocks.googlePieChartData = [
            ['Stock', 'Percentage of Portfolio CAD']
          ];
          qtstocks.positions.forEach(function(stock, i) {
            qtstocks.googlePieChartData.push([
              stock.symbol,
              parseFloat(stock.percentageTotalCad)
            ]);
          });

          qtstocks.googlePieChartData = JSON.stringify(
            qtstocks.googlePieChartData
          );

          // console.log('qtstocks', qtstocks);
          res.render('dashboard', qtstocks);
        });
      }); // qt.getSymbols()
    }); // qt.getPositions()
  }); // qt.on('ready')

  qt.on('error', function(err) {
    console.error('Problem with the Questrade API.', err);

    var error_msg = null;
    if (err.details.message == 'login_failed') {
      error_msg = 'Failed to log into Questrade.';
    }

    res.status(500).render('500', {
      messages: {
        error: error_msg
      }
    });
  }); // qt.on('error')
}; // exports.dashboard

exports.singleStock = function(req, res) {
  var qt = new Questrade(process.env.QT_KEY);

  qt.on('ready', function() {
    qt.getSymbol(req.params.stockSymbol.toUpperCase(), function(err, symbol) {
      if (err) {
        console.error(
          'User attempted to search for a stock that does not exist.',
          err
        );

        var error_msg = 'Error while searching for stock.';

        if (err.message == 'symbol_not_found') {
          error_msg = 'Symbol not found in the Questrade database.';
        }

        res.status(404).render('404', {
          messages: {
            error: error_msg,
            what: 'Stock'
          }
        });
        return null;
      }

      var singleSymbol = symbol;

      singleSymbol.symbolCapitalized = singleSymbol.symbol.toUpperCase();
      singleSymbol.title = 'QT Stock Watch | ' + singleSymbol.symbolCapitalized;
      singleSymbol.description =
        singleSymbol.description.charAt(0).toUpperCase() +
        singleSymbol.description.slice(1).toLowerCase() +
        '.';
      if (singleSymbol.currency == 'CAD') {
        singleSymbol.isCanadian = true;
      }
      if (singleSymbol.currency == 'USD') {
        singleSymbol.isAmerican = true;
      }
      if (singleSymbol.dividendDate) {
        singleSymbol.dividendDate = singleSymbol.dividendDate.split('T')[0];
      }
      if (singleSymbol.exDate) {
        singleSymbol.exDate = singleSymbol.exDate.split('T')[0];
      }

      res.render('singleStock', singleSymbol);
    });
  });

  qt.on('error', function(err) {
    console.error(
      'Problem encountered while connecting with the Questrade API.',
      err
    );

    res.status(500).render('500', {
      messages: {
        error: 'Problem encountered while connecting with the Questrade API.'
      }
    });
  });
};

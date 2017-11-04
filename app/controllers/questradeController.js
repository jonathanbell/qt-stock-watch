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
    title: 'DASHBOARD BRO'
  };

  qt.on('ready', function() {
    qt.getPositions(function(err, balances) {
      if (err) {
        console.error('Error while trying to getPositions():', err);
        res.status(404).render('404', {
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
        if (err) console.error(err); // TODO: handle this better

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
        });

        fixerController.getCadExchangeRate(function(err, cadExchangeRate) {
          // TODO: handle this better
          if (err) console.error('ERROR connecting to the Fixer API :/', err);

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
    // TODO: Show the 500 error page
    console.error('PROBLEM with the Questrade API.');
  });
}; // exports.dashboard

exports.singleStock = function(req, res) {
  var qt = new Questrade(process.env.QT_KEY);

  qt.on('ready', function() {
    res.render('singleStock', { stockSymbol: req.params.stockSymbol });
  });

  qt.on('error', function(err) {
    // TODO: Show the 500 error page
    console.error('PROBLEM with the Questrade API.');
  });
};

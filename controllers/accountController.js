const fetch = require('node-fetch');

const getPrimaryAccountNumber = async (req, res) => {
  const accountsResponse = await fetch(`${req.api_server}v1/accounts`, {
    headers: {
      Authorization: `${req.token_type} ${req.access_token}`
    }
  }).catch(error => {
    console.error('Error while getting user accounts:', error);
    throw new Error(error);
  });

  console.log(
    // TODO: remove me later
    `Requested: ${req.api_server}v1/accounts ${req.token_type} ${
      req.access_token
    }`
  );

  if (accountsResponse.status >= 300) {
    console.error(
      `Bad HTTP status from https://login.questrade.com/oauth2/token. HTTP status: ${
        accountsResponse.status
      }`
    );
  }

  const accounts = await accountsResponse.json();

  let primaryAccount = '';
  accounts.accounts.forEach(account => {
    if (account.isPrimary) {
      primaryAccount = account.number;
    }
  });

  return primaryAccount;
};

const getStocksByIds = async (req, res, ids) => {
  const symbolsResponse = await fetch(
    `${req.api_server}v1/symbols?ids=${ids}`,
    {
      headers: {
        Authorization: `${req.token_type} ${req.access_token}`
      }
    }
  ).catch(error => {
    console.error('Error while getting symbols by IDs:', error);
    throw new Error(error);
  });

  const symbols = await symbolsResponse.json();

  return symbols;
};

const makeSymbolIdString = stocks => {
  let ids = '';
  stocks.forEach((stock, index) => {
    ids += `${stock.symbolId}${index < stocks.length - 1 ? ',' : ''}`;
  });
  return ids;
};

const getPositions = async (req, res) => {
  const primaryAccount = await getPrimaryAccountNumber(req, res);

  const positionsResponse = await fetch(
    `${req.api_server}v1/accounts/${primaryAccount}/positions`,
    {
      headers: {
        Authorization: `${req.token_type} ${req.access_token}`
      }
    }
  ).catch(error => {
    console.error('Error while getting positions:', error);
    throw new Error(error);
  });

  const positions = await positionsResponse.json();

  const ids = makeSymbolIdString(positions.positions);

  const symbols = await getStocksByIds(req, res, ids);

  let positionsEnhanced = positions.positions;

  positionsEnhanced.forEach(position => {
    symbols.symbols.forEach(symbol => {
      if (symbol.symbolId === position.symbolId) {
        // Add additional data from our call to `getStocksByIds`
        position.dividend = symbol.dividend;
        position.currency = symbol.currency;
        position.listingExchange = symbol.listingExchange;

        // Calc the percentage profit/loss
        let openCost = position.openQuantity * position.averageEntryPrice;
        let currentCost = position.openQuantity * position.currentPrice;
        let percentageStr = '';
        let percentage = (1 - currentCost / openCost) * 100;
        if (percentage < 0) {
          percentageStr += percentage.toFixed(2).substring(1) + '%';
          percentageStr = '+' + percentageStr;
        } else {
          percentageStr += '-';
          percentageStr += percentage.toFixed(2) + '%';
        }
        position.percentagePnl = percentageStr;
      }
    });

    // Convert current american stock values to CAD
    if (position.currency === 'USD') {
      position.currentValCad =
        position.currentMarketValue * process.env.USD_EXCHANGE;
    } else {
      position.currentValCad = position.currentMarketValue;
    }
  });

  return positionsEnhanced;
};

const getAccountPositionsWithPercentages = async (req, res) => {
  const positions = await getPositions(req, res);

  let totalValue = 0;
  positions.forEach(position => {
    totalValue += position.currentValCad;
  });

  positions.forEach(position => {
    position.percentageOfAccount = (position.currentValCad / totalValue) * 100;
  });

  return positions;
};

exports.getPrimaryAccountPositions = async (req, res) => {
  const positions = await getAccountPositionsWithPercentages(req, res);
  res.json(positions);
};

exports.searchSymbol = async (req, res) => {
  const searchResponse = await fetch(
    `${req.api_server}v1/symbols/search?prefix=${req.params.prefix}`,
    {
      headers: {
        Authorization: `${req.token_type} ${req.access_token}`
      }
    }
  ).catch(error => {
    console.error('Error while searching symbols:', error);
    throw new Error(error);
  });

  const symbols = await searchResponse.json();

  if (symbols.symbols.length) {
    const ids = makeSymbolIdString(symbols.symbols);
    const stocks = await getStocksByIds(req, res, ids);
    res.json(stocks.symbols);
  } else {
    res.json([]);
  }
};

exports.getWatchlistStocks = async (req, res) => {
  if (!req.user) {
    // TODO: Handle this better
    res.json([]);
  }

  if (!req.user.watchlist.length) {
    res.json([]);
  }

  let ids = '';
  req.user.watchlist.forEach((symbolId, index) => {
    ids += `${symbolId}${index < req.user.watchlist.length - 1 ? ',' : ''}`;
  });

  const stocks = await getStocksByIds(req, res, ids);
  res.json(stocks.symbols);
};

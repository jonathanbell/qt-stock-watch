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
    // remove me
    `Requested: ${req.api_server}v1/accounts ${req.token_type} ${
      req.access_token
    }`
  );

  // if (response.status >= 300) {
  //   console.error(
  //     `Bad HTTP status from https://login.questrade.com/oauth2/token. HTTP status: ${
  //       res.status
  //     }`
  //   );
  //   return next();
  // }

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

  let ids = '';
  positions.positions.forEach((position, index) => {
    ids += `${position.symbolId}${
      index < positions.positions.length - 1 ? ',' : ''
    }`;
  });

  const symbols = await getStocksByIds(req, res, ids);

  let positionsEnhanced = positions.positions;

  positionsEnhanced.forEach(position => {
    symbols.symbols.forEach(symbol => {
      if (symbol.symbolId === position.symbolId) {
        position.currency = symbol.currency;
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

  res.json(symbols.symbols);
};

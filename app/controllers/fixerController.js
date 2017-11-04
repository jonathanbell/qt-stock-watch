const request = require('request');

var exports = (module.exports = {});

exports.getCadExchangeRate = function(cb) {
  request(
    {
      method: 'GET',
      uri: 'http://api.fixer.io/latest', // See: http://fixer.io/
      qs: {
        base: 'USD',
        symbols: 'CAD' // Comma seperated list, please.
      },
      json: true,
      headers: {
        'Accept-Charset': 'utf-8',
        'User-Agent': 'qt-stock-watch'
      }
    },
    function(err, response, body) {
      return cb(err, body.rates.CAD);
    }
  );
};

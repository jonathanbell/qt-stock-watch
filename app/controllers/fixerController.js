const request = require('request');

var exports = (module.exports = {});

exports.getCadExchangeRate = function(cb) {
  return 1.5;
  request(
    {
      method: 'GET',
      uri: 'https://api.fixer.io/latest', // See: http://fixer.io/
      qs: {
        base: 'USD',
        symbols: 'CAD' // comma seperated list
      },
      json: true,
      headers: {
        'Accept-Charset': 'utf-8',
        'User-Agent': 'qt-stock-watch'
      }
    },
    function(err, response, body) {
      console.log(err, body.rates);
      return cb(err, body.rates.CAD);
    }
  );
};

const fetch = require('node-fetch');

exports.test = (req, res) => {
  res.send({
    express: `Helloooooo From Express! ${
      req.access_token ? req.access_token : 'req.access_token is not set.'
    }`
  });
};

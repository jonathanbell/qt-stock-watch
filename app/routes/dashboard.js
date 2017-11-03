var questradeController = require('../controllers/questradeController.js');

module.exports = function(app) {
  function getQt(req, res, next) {
    return next();
    console.log('PROBLEM -- here.');
  }

  app.get('/', questradeController.dashboard);
};

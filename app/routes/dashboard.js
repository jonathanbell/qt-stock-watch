var questradeController = require('../controllers/questradeController.js');

module.exports = function(app) {
  // This function is not in use right now.
  // One day, this app may have a signin area.
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/signin');
  }

  app.get('/', questradeController.dashboard);
  app.get('/stock/:stockSymbol', questradeController.singleStock);
};

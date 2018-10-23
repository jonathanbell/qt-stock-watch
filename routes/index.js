const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const accountController = require('../controllers/accountController');
const { catchErrors } = require('../handlers/errorHandlers');

// API calls

router.get(
  '/api/v1/positions',
  catchErrors(authController.getQuesttradeAuthorizationToken),
  catchErrors(accountController.getPrimaryAccountPositions)
);

router.get(
  '/api/v1/symbols/search/:prefix',
  catchErrors(authController.getQuesttradeAuthorizationToken),
  catchErrors(accountController.searchSymbol)
);

router.get('/api/hello-again', (req, res) => {
  res.send({ express: 'Hello AGAIN From Express!' });
});

if (process.env.NODE_ENV === 'production') {
  router.get('/api/hello-from-prod', (req, res) => {
    res.send({ express: 'Hello from prod!' });
  });
  // Handle React routing, return all requests to React app
  router.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

module.exports = router;

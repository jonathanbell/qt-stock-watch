const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const accountController = require('../controllers/accountController');
const { catchErrors } = require('../handlers/errorHandlers');

/**
 * API Calls (basically the only thing we are using Express for..)
 */

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

/**
 * OAuth callbacks - not complete
 */
router.post(
  '/catch-qt-authorization',
  catchErrors(authController.getInitialQtOauth)
);

/**
 * Handle React routing: return all requests to the React app.
 */

// If we are not in production, then we proxy requests to create-react-app
// through Express - see `package.json` under `../client` directory.
if (process.env.NODE_ENV === 'production') {
  router.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

module.exports = router;

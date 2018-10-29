const mongoose = require('mongoose');
const Auth = mongoose.model('Auth');
// https://github.com/Automattic/mongoose/issues/6880
mongoose.set('useFindAndModify', false);
const fetch = require('node-fetch');
const moment = require('moment');
moment().format();

exports.getQuesttradeAuthorizationToken = async (req, res, next) => {
  // 1. Check if we need to update the refresh token

  const qtClient = await Auth.findOne({
    client_id: process.env.QT_CONSUMER_KEY
  });

  if (!qtClient) {
    res.json({
      error: 'Cannot find Questtrade authorization details in database.'
    });
  }

  const accessTokenExipry = moment(qtClient.updated).add(
    // Subtract 50% from possible expiry time, just to be sure.
    qtClient.expires_in - qtClient.expires_in * 0.5,
    'seconds'
  );

  if (accessTokenExipry.isAfter(moment())) {
    req.access_token = qtClient.access_token;
    req.api_server = qtClient.api_server;
    req.token_type = qtClient.token_type;
    // console.log('Access token expires:', accessTokenExipry);
    // console.log('Time now:', moment());
    // console.log('Old oAuth token is still valid:', req.access_token);
    return next();
  }

  // 2. Request a new access_token using our current refresh_token

  // Use the current refresh token to request a new auth token.
  const response = await fetch('https://login.questrade.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `grant_type=refresh_token&refresh_token=${qtClient.refresh_token}`
  }).catch(error => {
    console.error(
      'Error while refreshing the Questrade auth and refresh tokens:',
      error
    );
    throw new Error(error);
  });

  if (response.status >= 300) {
    console.error(
      `Bad HTTP status from https://login.questrade.com/oauth2/token. HTTP status: ${
        response.status
      }`
    );
    return next();
  }

  // New authorization data
  const newAuth = await response.json();

  // 3. Update the access token by re-writing it to the DB

  newAuth.updated = Date.now();
  const newAuthKeys = await Auth.findOneAndUpdate(
    { client_id: process.env.QT_CONSUMER_KEY },
    newAuth,
    {
      new: true,
      // If the document isn't found, create a new one via `upsert` option:
      // https://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
      upsert: true,
      setDefaultsOnInsert: true
    }
  );

  req.access_token = newAuthKeys.access_token;
  req.api_server = newAuthKeys.api_server;
  req.token_type = newAuthKeys.token_type;

  // console.log(
  //   'Got new oAuth access_token from Questrade: ',
  //   req.access_token,
  //   newAuthKeys
  // );

  next();
};

exports.getInitialQtOauth = async (req, res, next) => {
  // TODO: ---------------------------------------------------------------------
  // Following the "Implicit Grant OAuth flow" here: https://www.questrade.com/api/documentation/authorization
  // *IF* the configuration options do not exist ALREADY in the database (need to remove them upon app de-authorization):
  // 1. Register a personal application with Questrade and get a API consumer key (aka client_id)
  // 2. Be sure to add `https://your-applications-url.com/catch-qt-authorization` as your callback URL
  // 3. Add your client ID to your `.env` file as the `QT_CONSUMER_KEY` value
  // 4. Now send GET request to `https://login.questrade.com/oauth2/authorize?client_id=${process.env.QT_CONSUMER_KEY}&response_type=token&redirect_uri=https://${req.hostname}/catch-qt-authorization`
  // 5. React will handle the GET request to `/catch-qt-authorization` and parse the URL for its "hash" values (URL will look something like this: `https://qt-stock-watch.now.sh/#access_token=XXX&refresh_token=XXX&token_type=Bearer&expires_in=1800&api_server=https://api02.iq.questrade.com/`)
  // 6. React will then send a POST request to `/catch-qt-authorization` with the new `access_token`, `refresh_token`, and `expires_in` values.
  // 7. Node will accept the values and check if they already exist. If they do, return an error via JSON. Otherwise Node will set them for the first time.
};

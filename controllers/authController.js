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
    res.json({ error: 'we all got problems..' });
  }

  const accessTokenExipry = moment(qtClient.updated).add(
    // Subtract 3 minutes from possible expiry time, just to be sure.
    qtClient.expires_in - 180,
    'seconds'
  );

  if (accessTokenExipry.isBefore(moment(new Date()))) {
    req.access_token = qtClient.access_token;
    req.api_server = qtClient.api_server;
    req.token_type = qtClient.token_type;
    console.log('Old oAuth token is still valid:', req.access_token);
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
        res.status
      }`
    );
    return next();
  }

  // New authorization data
  const newAuth = await response.json();

  // 3. Update the access token by re-writing it to the DB

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

  console.log(
    'Got new oAuth access_token from Questrade: ',
    req.access_token,
    newAuthKeys
  );

  next();
};

// exports.test = (req, res) => {
//   res.send({
//     express: `Helloooooo From Express! ${
//       req.access_token ? req.access_token : 'req.access_token is not set.'
//     }`
//   });
// };

exports.getInitialQtOauth = async (req, res, next) => {
  // https://login.questrade.com/oauth2/authorize

  // https://login.questrade.com/oauth2/authorize?client_id=E8EVxQBewzmPAdMcgACJsTs1lNtY7Q&response_type=code&redirect_uri=https://qt-stock-watch.now.sh
  //res.redirect(`https://login.questrade.com/oauth2/authorize?client_id=${process.env.QT_CONSUMER_KEY}&response_type=code&redirect_uri=http://localhost:3001`)

  const authCode = req.query.code;

  // now send POST request to
  // https://login.questrade.com/oauth2/token?client_id=E8EVxQBewzmPAdMcgACJsTs1lNtY7Q&code=j2v4WWcB-DLSAPAYBPLvL6TMZrzgYpfM0&grant_type=authorization_code&redirect_uri=https://qt-stock-watch.now.sh

  ////////////////////

  // https://login.questrade.com/oauth2/authorize?client_id=E8EVxQBewzmPAdMcgACJsTs1lNtY7Q&response_type=token&redirect_uri=https://qt-stock-watch.now.sh

  // https://qt-stock-watch.now.sh/#access_token=rydkigC7sAPiJ6LQLZjgk3Ex6MitdXJa0&refresh_token=R0aGyWGbKy0AISuRcnKR6IBe93q3c-_U0&token_type=Bearer&expires_in=1800&api_server=https://api02.iq.questrade.com/
};

// exports.isLoggedIn = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     // Yup! : )
//     return next();
//   }
//   req.flash(
//     'error',
//     'You must be logged in to do that. Please login or <a href="/become-a-blizzard-tester">signup</a>.'
//   );
//   res.redirect('/login');
// };

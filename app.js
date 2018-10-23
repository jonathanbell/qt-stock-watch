const express = require('express');
const path = require('path');

const routes = require('./routes/index');
const helpers = require('./helpers');
const errorHandlers = require('./handlers/errorHandlers');

const app = express();

// Mustache - this is kinda silly rn.
// We are only using express to serve our JSON API at the moment so none of
// these templates should ever get served (unless we hit a development error).
const mustacheExpress = require('mustache-express');
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', './views');

// Serve any static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
}
if (process.env.NODE_ENV === 'development') {
  app.use(express.static(path.join(__dirname + 'client/public')));
}

// Pass this stuff to *all requests*
// These methods and values will be available on the `res` object.
app.use((req, res, next) => {
  res.locals.helpers = helpers;
  res.locals.currentPath = req.path;
  next();
});

// Attempt to limit access to our API
app.use((req, res, next) => {
  // If the request doesn't come from blizzardjudge.com or from the Zeit deployment URL:
  // if (req.hostname !== process.env.APPHOST && req.hostname !== 'localhost') {
  //   // Redirect to blizzardjudge.com keeping the pathname and querystring intact.
  //   return res.redirect(`https://${process.env.APPHOST}${req.originalUrl}`);
  // }

  console.log('req.hostname:', req.hostname);
  // return error code and message?

  next();
});

// Handle all of our own (middleware) routes
app.use('/', routes);

// Uh oh.. Routes above^^^ didn't work. Probably a 404.
app.use(errorHandlers.notFound);

// Really bad error... : |
if (process.env.NODE_ENV === 'development') {
  // Development error handler
  app.use(errorHandlers.developmentErrors);
} else {
  // Production error handler
  app.use(errorHandlers.productionErrors);
}

module.exports = app;

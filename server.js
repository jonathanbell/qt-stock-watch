// Express
const express = require('express');
const app = express();
app.use(express.static('public'));

var PORT = process.env.PORT || 3000;

// .env file support
const env = require('dotenv').load();

// Mustache
const mustacheExpress = require('mustache-express');
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', './app/views');

// Routes
const questradeRoute = require('./app/routes/dashboard.js')(app);

// Handle favicon.ico requests
app.get('/favicon.ico', function(req, res) {
  res.sendStatus(204); // https://stackoverflow.com/a/35408810/1171790
});

// Handle 404 - Keep this as the last route to be registered
app.use(function(req, res, next) {
  res.status(404).render('404');
});

app.listen(PORT, function(err) {
  if (err) {
    console.error('Error while starting QT Stock Watch.', err);
  } else {
    console.log('Site is listening on port ' + PORT + '.');
  }
});

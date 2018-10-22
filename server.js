require('dotenv').config({ path: '.env.development' });
const mongoose = require('mongoose');
mongoose.connect(
  process.env.DATABASE,
  { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;

// Log database errors to the console.
mongoose.connection.on('error', err => {
  console.error(`Database connection error: ${err.message}`);
});

// Import mongoDB models:
require('./models/Auth');

// Require our Express app
const app = require('./app');
const port = process.env.PORT || 5000;

// Start the app
const server = app.listen(port, () => {
  console.log(`Express is listening on port ${server.address().port}`);
});

//app.listen(port, () => console.log(`Listening on port ${port}`));

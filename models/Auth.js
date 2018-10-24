const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authSchema = new Schema({
  client_id: {
    type: String,
    default: process.env.QT_CONSUMER_KEY
  },
  updated: {
    type: Date,
    default: Date.now()
  },
  access_token: String,
  token_type: {
    type: String,
    default: 'Bearer'
  },
  refresh_token: String,
  api_server: {
    type: String,
    default: 'https://api02.iq.questrade.com/'
  },
  expires_in: Number
});

authSchema.pre('save', async function(next) {
  // Filter data you need to here
  //this.updated = Date.now();
  next();
});

module.exports = mongoose.model('Auth', authSchema);

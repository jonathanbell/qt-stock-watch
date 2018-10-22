const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authSchema = new Schema({
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
    default: 'https://api01.iq.questrade.com'
  }
});

authSchema.pre('save', async function(next) {
  // Filter data here
  //this.name = xss(this.name);
  next();
});

module.exports = mongoose.model('Auth', authSchema);

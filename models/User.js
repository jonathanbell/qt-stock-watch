const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// https://github.com/Automattic/mongoose/issues/6890
mongoose.set('useCreateIndex', true);

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
    default: process.env.USER_EMAIL
  },
  watchlist: [{ type: String }]
});

module.exports = mongoose.model('User', userSchema);

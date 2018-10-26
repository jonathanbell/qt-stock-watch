const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.getUser = async (req, res, next) => {
  const user = await User.findOne({ email: 'jonathanbell.ca@gmail.com' });

  if (!user) {
    throw Error(
      'Unable to get your user. Probably and issue with the database connection.'
    );
  }

  req.user = user;

  next();
};

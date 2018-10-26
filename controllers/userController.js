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

exports.removeSymbolFromWatchlist = async (req, res) => {
  const user = await User.findOne({ email: 'jonathanbell.ca@gmail.com' });

  if (!user) {
    throw Error(
      'Unable to get your user while removing item from watchlist. Probably and issue with the database connection.'
    );
  }

  const watchlist = user.watchlist.filter(
    symbol => symbol !== req.params.symbolId
  );

  const newUser = await User.findOneAndUpdate(
    { email: 'jonathanbell.ca@gmail.com' },
    { watchlist },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  );

  res.json(newUser.watchlist);
};

exports.addSymbolToWatchlist = async (req, res) => {
  const user = await User.findOne({ email: 'jonathanbell.ca@gmail.com' });

  if (!user) {
    throw Error(
      'Unable to get your user while attempting to add item to user watchlist. Probably and issue with the database connection.'
    );
  }

  let watchlist = user.watchlist;
  if (!watchlist.includes(req.params.symbolId)) {
    watchlist.push(req.params.symbolId);
  }

  const newUser = await User.findOneAndUpdate(
    { email: 'jonathanbell.ca@gmail.com' },
    { watchlist },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  );

  res.json(newUser.watchlist);
};

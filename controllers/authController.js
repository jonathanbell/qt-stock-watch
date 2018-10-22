const mongoose = require('mongoose');
const Auth = mongoose.model('Auth');

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    // Yup! : )
    return next();
  }
  req.flash(
    'error',
    'You must be logged in to do that. Please login or <a href="/become-a-blizzard-tester">signup</a>.'
  );
  res.redirect('/login');
};

exports.update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    req.flash('error', 'Your password reset token is invalid or has expired.');
    return res.redirect('/login');
  }

  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);

  // Setting these values to `undefined` will remove these fields from the user
  // in the DB.
  user.resetPasswordToken = undefined;
  user.passwordResetExpires = undefined;

  const updatedUser = await user.save();
  await req.login(updatedUser);
  req.flash('success', 'Your password has been reset. You are now logged in.');
  res.redirect('/');
};

exports.test = (req, res) => {
  res.send({ express: 'Helloooooo From Express' });
};

const md5 = require('md5');

// Get a Gravatar
exports.gravatar = email => {
  const hash = md5(email);
  return `https://gravatar.com/avatar/${hash}?s=200&d=identicon`;
};

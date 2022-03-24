const User = require('../models/user.model');
const authUtil = require('../util/authentication');

function getSignup (req, res) {
  res.render('customer/auth/signup');
}

async function signup (req, res) {
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.city,
    req.body.postal
  );

  await user.signup();

  res.redirect('/login');
}

function getLogin (req, res) {
  res.render('customer/auth/login');
}

async function login (req, res) {
  const user = new User(req.body.email, req.body.password);
  const existingUser = await user.getUserSameEmail();

  if (!existingUser) {
    res.redirect('/login');
    return;
  }

  const matchedPassword = await user.hasMatchingPassword(existingUser.password);

  if (!matchedPassword) {
    res.redirect('/login');
    return;
  }

  authUtil.createUserSession(req, existingUser, () => {
    res.redirect('/');
  });
}

module.exports = {
  getSignup: getSignup,
  signup: signup,
  getLogin: getLogin,
  login: login
};

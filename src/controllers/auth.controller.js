const User = require('../models/user.model');
const authUtil = require('../util/authentication');

function getSignup (req, res) {
  res.render('customer/auth/signup');
}

async function signup (req, res, next) {
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.city,
    req.body.postal
  );

  try {
    await user.signup();
  } catch (e) {
    next(e);
    return;
  }

  res.redirect('/login');
}

function getLogin (req, res) {
  res.render('customer/auth/login');
}

async function login (req, res, next) {
  const user = new User(req.body.email, req.body.password);

  let existingUser;
  try {
    existingUser = await user.getUserSameEmail();
  } catch (e) {
    next(e);
    return;
  }

  if (!existingUser) {
    res.redirect('/login');
    return;
  }

  let matchedPassword;
  try {
    matchedPassword = await user.hasMatchingPassword(existingUser.password);
  } catch (e) {
    next(e);
    return;
  }

  if (!matchedPassword) {
    res.redirect('/login');
    return;
  }

  authUtil.createUserSession(req, existingUser, () => {
    res.redirect('/');
  });
}

function logout (req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect('login');
}

module.exports = {
  getSignup: getSignup,
  signup: signup,
  getLogin: getLogin,
  login: login,
  logout: logout
};

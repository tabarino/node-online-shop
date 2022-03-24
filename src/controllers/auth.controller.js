const User = require('../models/user.model');
const authUtil = require('../util/authentication');
const userDetailsAreValid = require('../util/validation');
const sessionFlash = require('../util/session-flash');

function getSignup (req, res) {
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: '',
      confirmEmail: '',
      password: '',
      fullname: '',
      street: '',
      city: '',
      postal: ''
    }
  }
  res.render('customer/auth/signup', { inputData: sessionData });
}

async function signup (req, res, next) {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body['confirm-email'],
    password: req.body.password,
    fullname: req.body.fullname,
    street: req.body.street,
    city: req.body.city,
    postal: req.body.postal
  }

  if (!userDetailsAreValid(enteredData)) {
    sessionFlash.flashDataToSession(req, {
      errorMessage: 'Please check your input. Password must be at least 6 characters long!',
      ...enteredData
    }, () => {
      res.redirect('/signup');
    });
    return;
  }

  const user = new User(
    enteredData.email,
    enteredData.password,
    enteredData.fullname,
    enteredData.street,
    enteredData.city,
    enteredData.postal
  );

  try {
    const existingUser = await user.isAlreadyCreated();
    if (existingUser) {
      sessionFlash.flashDataToSession(req, {
        errorMessage: 'User exists already! Try logging in instead!',
        ...enteredData
      }, () => {
        res.redirect('/signup');
      });
      return;
    }
    await user.signup();
  } catch (e) {
    next(e);
    return;
  }

  res.redirect('/login');
}

function getLogin (req, res) {
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: '',
      password: '',
    }
  }
  res.render('customer/auth/login', { inputData: sessionData });
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

  const sessionErrorData = {
    errorMessage: 'Invalid credentials! Please double check you email and password!',
    email: user.email,
    password: user.password
  };

  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, () => {
      res.redirect('/login');
    });
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
    sessionFlash.flashDataToSession(req, sessionErrorData, () => {
      res.redirect('/login');
    });
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

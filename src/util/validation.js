function isEmpty (value) {
  return (!value || value.trim() === '');
}

function userCredentialsAreValid (email, password) {
  return (email && email.includes('@') &&
    password && password.trim().length >= 6);
}

function emailIsConfirmed (email, confirmEmail) {
  return email === confirmEmail;
}

function userDetailsAreValid (userData) {
  return (
    emailIsConfirmed(userData.email, userData.confirmEmail) &&
    userCredentialsAreValid(userData.email, userData.password) &&
    !isEmpty(userData.fullname) &&
    !isEmpty(userData.street) &&
    !isEmpty(userData.city) &&
    !isEmpty(userData.postal)
  );
}

module.exports = userDetailsAreValid;

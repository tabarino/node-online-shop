const { add } = require("nodemon/lib/rules");

function addCsrfToken (req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
}

module.exports = addCsrfToken;

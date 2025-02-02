function flashMessages(req, res, next) {
  res.locals.flashSignUpError = req.flash("SignUpError");
  res.locals.flashInfo = req.flash("flashInfo");
  res.locals.flashError = req.flash("flashError");
  res.locals.flashSignUp = req.flash("flashSignUp");
  next();
}

module.exports = flashMessages;

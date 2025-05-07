function isAuthenticated(req, res, next) {
  if (req.session.user) {
    console.log("isAuthenticated");
    next();
  } else {
    res.render("loginOrSignUp");
  }
}

module.exports = isAuthenticated;

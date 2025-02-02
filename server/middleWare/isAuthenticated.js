function isAuthenticated(req, res, next) {
  if (req.session.user) {
    console.log("yes");
    next();
  } else {
    res.render("loginOrSignUp");
  }
}

module.exports = isAuthenticated;

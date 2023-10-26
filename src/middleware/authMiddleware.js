const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  req.flash("error_msg", "You are not authenticated")
  res.redirect('/login');
}

const checkUserActivation = (req, res, next) => {
  if (req.session.user) {
    if (!req.session.user.isActive) {
      return res.redirect('/contact-admin');
    }
    return next();
  } else {
    return res.redirect('/login');
  }
};

export { isAuthenticated, checkUserActivation }




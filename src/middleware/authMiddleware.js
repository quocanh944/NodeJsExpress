const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    console.log('isAuthenticated')
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

const isFirstLogined = (req, res, next) => {
  if (req.session.user && req.session.user.isFirstLogin) {
    return res.redirect('/user/set-password');
  }
  return next();
}

const checkFirstLogin = (req, res, next) => {
  if (req.session.user && req.session.user.isFirstLogin) {
    return next(); // Cho phép tiếp tục xử lý yêu cầu
  }
  return res.redirect('/');
}

const authorization = (req, res, next) => {
  const { user } = req.session;

  if (user && user.role) {
    if (user.role === "ADMIN") {
      return next();
    }
    return res.redirect('/');
  }
}




export { isAuthenticated, checkUserActivation, isFirstLogined, checkFirstLogin, authorization }




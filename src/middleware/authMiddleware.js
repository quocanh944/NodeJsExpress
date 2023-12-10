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

const authorization = (allowedRoles) => {
  return (req, res, next) => {
    const { user } = req.session;

    if (user && allowedRoles.includes(user.role)) {
      return next();
    }

    if (user && user.role === 'SALE') {
      return res.redirect('/sale-specific-page');
    }

    return res.redirect('/login');
  };
};

const requireRole = (roles) => {
  return (req, res, next) => {
    const { user } = req.session;

    if (user && roles.includes(user.role)) {
      return next();
    }

    return res.status(403).send('Access Denied: You do not have permission to access this page.');
  };
};


const checkUserBlocked = (req, res, next) => {
  const { user } = req.session;

  if (user && user.isLocked) {
    return res.status(403).send('Your account is blocked. Please contact the administrator.');
  }

  next();
}


export { isAuthenticated, checkUserActivation, isFirstLogined, checkFirstLogin, authorization, checkUserBlocked, requireRole }




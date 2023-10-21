const isAuthenticated = (req, res, next) => {
  try {
    if (req.session && req.session.user) {
      return next();
    }
    res.redirect('/login');
  } catch (error) {
    res.status(401).send('You are not authenticated');
  }
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




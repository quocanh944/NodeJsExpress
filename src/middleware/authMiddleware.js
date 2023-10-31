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
  // Nếu không thỏa mãn điều kiện, có thể xử lý chuyển hướng hoặc xử lý khác ở đây
  return res.redirect('/'); // Ví dụ: Chuyển hướng về trang chính
}

export { isAuthenticated, checkUserActivation, isFirstLogined, checkFirstLogin }




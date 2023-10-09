const renderPage = (res, viewName, data = {}) => {
    res.render(viewName, data);
}

// Một hàm trả về lỗi thông qua trang EJS
const renderError = (res, statusCode, errorMessage) => {
    res.status(statusCode).render('errorPage', { message: errorMessage });
}

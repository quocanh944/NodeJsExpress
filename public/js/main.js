document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.nav-link').forEach(function (element) {
    element.addEventListener('click', function (e) {
      e.preventDefault(); // Ngăn chặn hành động mặc định của thẻ a
      var href = this.getAttribute('href');

      // Sử dụng Fetch API để thực hiện AJAX request
      fetch(href)
        .then(response => response.text())
        .then(data => {
          console.log(data)
          // Chèn dữ liệu đã nhận được vào trong main-content
          // document.querySelector('#main-content').innerHTML = data;

          // Sử dụng HTML5 History API để thay đổi URL mà không cần tải lại trang
          history.pushState({}, '', href);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    });
  });
});


window.addEventListener('popstate', function (event) {
  // Lấy nội dung cho URL hiện tại và cập nhật nội dung
  fetch(document.location.pathname)
    .then(response => response.text())
    .then(data => {
      console.log(data)
      // document.querySelector('#main-content').innerHTML = data;
    })
    .catch(error => {
      console.error('Error fetching data on back:', error);
    });
});

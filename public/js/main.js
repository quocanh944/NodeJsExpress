document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.getElementById('logoutButton');

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      // Gửi yêu cầu đăng xuất bằng Axios khi nút đăng xuất được nhấn
      axios.get('/logout')
        .then((response) => {
          // Xử lý phản hồi từ máy chủ (ví dụ: chuyển hướng hoặc hiển thị thông báo đăng xuất thành công)
          console.log(response)
          location.reload()
        })
        .catch((error) => {
          // Xử lý lỗi nếu có
          console.log(error)
        });
    });
  }
});

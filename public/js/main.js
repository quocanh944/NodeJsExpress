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


const currentPath = window.location.pathname;
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach((link) => {
  const href = link.getAttribute('href');
  if (currentPath === href) {
    link.classList.add('active');
  }
});



function markAsRead(element) {
  const notificationId = element.getAttribute('data-notification-id');

  axios.post('/notification/mark-as-read/' + notificationId)
    .then(response => {
      console.log('Notification marked as read');

      // Giảm số lượng thông báo chưa đọc và cập nhật UI
      unreadNotificationsCount--;
      updateNotificationBadge();

      // Tùy chỉnh thêm: thay đổi trạng thái của item thông báo nếu cần
      element.closest('.notification-item').classList.add('read');
    })
    .catch(error => {
      console.error('Error marking notification as read:', error);
    });
}


function deleteNotification(element) {
  const notificationId = element.getAttribute('data-notification-id');
  // Gửi yêu cầu tới back-end
  axios.delete('/notification/delete/' + notificationId)
    .then(response => {
      console.log('Notification deleted');
      location.reload()
      // Cập nhật UI hoặc thông báo cho người dùng
    })
    .catch(error => {
      console.error('Error deleting notification:', error);
    });
}


function deleteAllNotifications() {
  axios.delete('/notification/delete-all')
    .then(response => {
      console.log('All notifications deleted');
      // Cập nhật UI hoặc thông báo cho người dùng
    })
    .catch(error => {
      console.error('Error deleting all notifications:', error);
    });
}


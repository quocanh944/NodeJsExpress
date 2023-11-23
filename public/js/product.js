var userIdToDelete;

$(() => {
  $('#productTable').DataTable();
})
// Xem ảnh preview khi tạo sản phẩm
function preview() {
  try {
    frame.src = URL.createObjectURL(event.target.files[0]);
  } catch (error) {
    clearImage();
  }
}

function clearImage() {
  document.getElementById('formFile').value = null;
  frame.src = "./public/images/productImagePlaceholder.webp";
}

// Gọi hàm này sau khi loadUsers để cập nhật phân trang
function openDrawerForCreate() {
  document.body.classList.add('drawer-open');
}

function closeDrawer() {
  document.body.classList.remove('drawer-open');
}

function deleteProduct(productId, productName) {
  userIdToDelete = productId;
  $('#productModalName').html(productName);
  var confirmModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
  confirmModal.show();
}

document.getElementById('confirmDeleteButton').addEventListener('click', function () {
  axios
    .delete(`/user/delete/${userIdToDelete}`)
    .then(function (response) {
      if (response.data.success) {
        console.log('Người dùng đã bị xóa', response.data.message);
        loadUsers(1);
      } else {
        console.error('Lỗi xóa người dùng', response.data.message);
      }
    })
    .catch(function (error) {
      console.error('Lỗi kết nối đến server', error);
    });

  var confirmModal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
  confirmModal.hide();
});

function toggleBlocked(checkboxElement) {
  const userId = checkboxElement.dataset.userid;
  const isLocked = checkboxElement.checked;
  console.log(userId, isLocked);

  axios.post(`/user/block/${userId}`, { isLocked }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      console.log('Status updated:', response.data);
      loadUsers(1);
      showMessage(response.data.message || 'Trạng thái người dùng đã được cập nhật.');
    })
    .catch(error => {
      console.error('Error updating status:', error);
      const errorMessage = error.response ? error.response.data.message : 'Có lỗi xảy ra khi cập nhật trạng thái.';
      showMessage(errorMessage);
    });


}

function showMessage(message, duration = 3000) {
  const notificationContainer = document.getElementById('notificationContainer');

  // Tạo và cấu hình phần tử thông báo
  const messageElement = document.createElement('div');
  messageElement.classList.add('notification-message');

  // Thêm icon (ví dụ: icon thông báo)
  const icon = document.createElement('i');
  icon.classList.add('fas', 'fa-info-circle', 'notification-icon');
  messageElement.appendChild(icon);

  // Thêm nội dung thông báo
  const text = document.createElement('span');
  text.textContent = message;
  messageElement.appendChild(text);

  // Thêm thông báo vào container và áp dụng hiệu ứng
  notificationContainer.appendChild(messageElement);
  setTimeout(() => {
    notificationContainer.style.top = '20px'; // Di chuyển thông báo vào màn hình
  }, 100);

  // Loại bỏ thông báo sau một khoảng thời gian
  setTimeout(() => {
    notificationContainer.style.top = '-100px'; // Di chuyển thông báo ra khỏi màn hình
    setTimeout(() => {
      notificationContainer.removeChild(messageElement);
    }, 500); // Đợi cho hiệu ứng hoàn thành trước khi loại bỏ phần tử
  }, duration);
}

function openEditDrawer(productId) {

  // axios.get(`/user/edit/${userId}`)
  //   .then(response => {
  //     const user = response.data.user;
  //     document.querySelector('.drawer-content').innerHTML = `
  //           <div class="form-group">
  //             <div class="mb-3">
  //               <label for="editEmail" class="form-label">Email</label>
  //               <input type="email" class="form-control" id="editEmail" value="${user.email || ''}" required>
  //             </div>
  //             <div class="mb-3">
  //               <label for="editFullName" class="form-label">Full Name</label>
  //               <input type="text" class="form-control" id="editFullName" value="${user.fullName || ''}" required>
  //             </div>
  //             <div class="mb-3">
  //               <label for="editGender" class="form-label">Gender</label>
  //               <select class="form-select" id="editGender">
  //                 <option value="" ${!user.gender ? 'selected' : ''}>Select Gender</option>
  //                 <option value="male" ${user.gender === 'male' ? 'selected' : ''}>Male</option>
  //                 <option value="female" ${user.gender === 'female' ? 'selected' : ''}>Female</option>
  //               </select>
  //             </div>
  //             <div class="mb-3">
  //               <label for="editPhoneNumber" class="form-label">Phone Number</label>
  //               <input type="tel" class="form-control" id="editPhoneNumber" value="${user.phoneNumber || ''}">
  //             </div>
  //             <div class="mb-3">
  //               <label for="editBirthday" class="form-label">Birthday</label>
  //               <input type="date" class="form-control" id="editBirthday" value="${user.birthday || ''}">
  //             </div>
  //             <div class="mb-3 form-check">
  //               <input type="checkbox" class="form-check-input" id="editIsActive" ${user.isActive ? 'checked' : ''}>
  //               <label class="form-check-label" for="editIsActive">Is Active</label>
  //             </div>
  //             <div class="mb-3 form-check">
  //               <input type="checkbox" class="form-check-input" id="editIsLocked" ${user.isLocked ? 'checked' : ''}>
  //               <label class="form-check-label" for="editIsLocked">Is Locked</label>
  //             </div>
  //             <div class="mb-3">
  //               <label for="editRole" class="form-label">Role</label>
  //               <select class="form-select" id="editRole">
  //                 <option value="ADMIN" ${user.role === 'ADMIN' ? 'selected' : ''}>Admin</option>
  //                 <option value="SALE" ${user.role === 'SALE' ? 'selected' : ''}>Sale</option>
  //               </select>
  //             </div>
  //             <button id="btnUpdateUser" class="btn btn-primary">Update User</button>
  //           </div>
  //     `;

  //     document.querySelector("#btnUpdateUser").onclick = () => {
  //       const email = document.querySelector('#editEmail').value;
  //       const fullName = document.querySelector('#editFullName').value;
  //       const gender = document.querySelector('#editGender').value;
  //       const phoneNumber = document.querySelector('#editPhoneNumber').value;
  //       const birthday = document.querySelector('#editBirthday').value;
  //       const isActive = document.querySelector('#editIsActive').checked;
  //       const isLocked = document.querySelector('#editIsLocked').checked;
  //       const role = document.querySelector('#editRole').value;

  //       // Tạo đối tượng JSON
  //       const userData = {
  //         email,
  //         fullName,
  //         gender,
  //         phoneNumber,
  //         birthday,
  //         isActive,
  //         isLocked,
  //         role
  //       };

  //       console.log(userData)

  //       axios.post(`/user/update/${userId}`, userData, {
  //         headers: {
  //           'Content-Type': 'application/json'
  //         }
  //       })
  //         .then(response => {
  //           if (response.status === 200) {
  //             console.log('User updated successfully:', response.data);
  //             loadUsers(1)
  //             document.body.classList.remove('drawer-open');
  //           } else {
  //             alert('Cập nhật người dùng không thành công. Vui lòng thử lại sau.');
  //           }
  //         })
  //         .catch(error => {
  //           console.error('Error updating user:', error);
  //           alert('Có lỗi xảy ra khi cập nhật người dùng. Vui lòng thử lại sau.');
  //         });
  //     }

  //     document.querySelector('.drawer-header h5').textContent = 'Edit User';
  //     document.body.classList.add('drawer-open');
  //   })
  //   .catch(error => {
  //     console.error('Error:', error);
  //   });
}




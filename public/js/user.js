var userIdToDelete;

function showSpinner() {
  $('.spinner-border').show();
}

function hideSpinner() {
  $('.spinner-border').hide();
}


function loadUsers() {
  if ($.fn.DataTable.isDataTable('#usersTable')) {
    $('#usersTable').DataTable().clear().destroy();
  }
  showSpinner();
  axios.get(`/user/api`)
    .then(response => {
      console.log(response)
      const users = response.data;

      const usersTableBody = document.getElementById('usersTableBody');
      usersTableBody.innerHTML = "";

      var element = document.getElementById('someElement');
      var resendActivationRequestExists = JSON.parse(element.getAttribute('data-resend-activation'))

      if (users) {
        users.forEach((user, index) => {

          console.log(user)
          const showResendButton = resendActivationRequestExists.includes(user._id);
          const resendButtonClass = user.isActive ? 'btn-secondary disabled' : (showResendButton ? 'btn-info' : 'btn-secondary');

          usersTableBody.innerHTML += `
          <tr>
            <td>${index + 1}</td>
            <td>${user.email}</td>
            <td>${user.fullName}</td>
            <td>${user.role}</td>
            <td>${user.isActive ? '<span class="badge bg-success">Active</span>' : '<span class="badge bg-danger">Not Active</span>'}</td>
            <td>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="blockedSwitch=" data-userid=${user._id} ${user.isLocked ? 'checked' : ''} onchange="toggleBlocked(this)">
                <label class="form-check-label" for="blockedSwitch${user._id}"></label>
              </div>
            </td>
            <td>
              <div class="btn-group" role="group" aria-label="User Actions">
                <button type="button" class="btn btn-primary" onclick="openEditDrawer('${user._id}')">
                  <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="btn btn-danger" onclick="deleteUser('${user._id}')">
                  <i class="fas fa-trash-alt"></i>
                </button>
               <button type="button" class="btn ${resendButtonClass}" onclick="resendActivationEmail('${user._id}')" ${user.isActive ? 'disabled' : ''}>
                <i class="fas fa-redo-alt"></i>
               </button>
              </div>
            </td>
          </tr>
        `;
        });
      }
      $('#usersTable').DataTable({
        searching: true,
        ordering: true,
        columnDefs: [
          { orderable: false, targets: 6 }
        ]
      });
      hideSpinner()
    })
    .catch(error => console.error('Error loading users:', error));
}

document.addEventListener('DOMContentLoaded', () => {

  loadUsers()
})




function resendActivationEmail(userId) {
  fetch(`/user/resend-activation/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      toastr.success(data.message, 'Success');
      loadUsers(1);
    })
    .catch(error => {
      toastr.error('Error: ' + error.message, 'Error');
    });
}


function openDrawerForCreate() {
  document.querySelector('.drawer-header h5').textContent = 'Register New User';

  document.querySelector('.drawer-content').innerHTML = `
        <form id="registrationForm" action="/user/register" method="post">
          <!-- Full Name Field -->
          <div class="mb-3">
            <label for="fullName" class="form-label">Full Name</label>
            <input type="text" class="form-control" id="fullName" name="fullName" required>
          </div>

          <!-- Email Field -->
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" name="email" required>
          </div>

          <button type="submit" class="btn btn-primary">Register</button>
        </form>
      `;
  document.body.classList.add('drawer-open');
}


function closeDrawer() {
  document.body.classList.remove('drawer-open');
}

function deleteUser(userId) {
  userIdToDelete = userId;

  var confirmModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
  confirmModal.show();
}

document.getElementById('confirmDeleteButton').addEventListener('click', function () {
  axios
    .delete(`/user/delete/${userIdToDelete}`)
    .then(function (response) {
      if (response.data.success) {
        toastr.success(response.data.message, 'Deleted');
        loadUsers();
      } else {
        toastr.error(response.data.message, 'Error');
      }
    })
    .catch(function (error) {
      toastr.error('Error connecting to the server', 'Error');
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


function openEditDrawer(userId) {
  axios.get(`/user/edit/${userId}`)
    .then(response => {
      const user = response.data.user;
      document.querySelector('.drawer-content').innerHTML = `
            <div class="form-group">
              <div class="mb-3">
                <label for="editEmail" class="form-label">Email</label>
                <input type="email" class="form-control" id="editEmail" value="${user.email || ''}" required>
              </div>
              <div class="mb-3">
                <label for="editFullName" class="form-label">Full Name</label>
                <input type="text" class="form-control" id="editFullName" value="${user.fullName || ''}" required>
              </div>
              <div class="mb-3">
                <label for="editGender" class="form-label">Gender</label>
                <select class="form-select" id="editGender">
                  <option value="" ${!user.gender ? 'selected' : ''}>Select Gender</option>
                  <option value="male" ${user.gender === 'male' ? 'selected' : ''}>Male</option>
                  <option value="female" ${user.gender === 'female' ? 'selected' : ''}>Female</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="editPhoneNumber" class="form-label">Phone Number</label>
                <input type="tel" class="form-control" id="editPhoneNumber" value="${user.phoneNumber || ''}">
              </div>
              <div class="mb-3">
                <label for="editBirthday" class="form-label">Birthday</label>
                <input type="date" class="form-control" id="editBirthday" value="${user.birthday || ''}">
              </div>
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="editIsActive" ${user.isActive ? 'checked' : ''}>
                <label class="form-check-label" for="editIsActive">Is Active</label>
              </div>
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="editIsLocked" ${user.isLocked ? 'checked' : ''}>
                <label class="form-check-label" for="editIsLocked">Is Locked</label>
              </div>
              <div class="mb-3">
                <label for="editRole" class="form-label">Role</label>
                <select class="form-select" id="editRole">
                  <option value="ADMIN" ${user.role === 'ADMIN' ? 'selected' : ''}>Admin</option>
                  <option value="SALE" ${user.role === 'SALE' ? 'selected' : ''}>Sale</option>
                </select>
              </div>
              <button id="btnUpdateUser" class="btn btn-primary">Update User</button>
            </div>
      `;

      document.querySelector("#btnUpdateUser").onclick = () => {
        const email = document.querySelector('#editEmail').value;
        const fullName = document.querySelector('#editFullName').value;
        const gender = document.querySelector('#editGender').value;
        const phoneNumber = document.querySelector('#editPhoneNumber').value;
        const birthday = document.querySelector('#editBirthday').value;
        const isActive = document.querySelector('#editIsActive').checked;
        const isLocked = document.querySelector('#editIsLocked').checked;
        const role = document.querySelector('#editRole').value;

        // Tạo đối tượng JSON
        const userData = {
          email,
          fullName,
          gender,
          phoneNumber,
          birthday,
          isActive,
          isLocked,
          role
        };

        axios.post(`/user/update/${userId}`, userData, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(response => {
            if (response.status === 200) {
              toastr.success('User updated successfully.', 'Updated');
              loadUsers(1);
              document.body.classList.remove('drawer-open');
            } else {
              toastr.error('User update failed. Please try again later.', 'Error');
            }
          })
          .catch(error => {
            toastr.error('An error occurred while updating user. Please try again later.', 'Error');
          });
      }

      document.querySelector('.drawer-header h5').textContent = 'Edit User';
      document.body.classList.add('drawer-open');
    })
    .catch(error => {
      console.error('Error:', error);
    });
}




var userIdToDelete;

document.addEventListener('DOMContentLoaded', function () {
  loadUsers(1);
})


function loadUsers(page = 1) {
  const limit = 5;
  axios.get(`/user/api?page=${page}&limit=${limit}`)
    .then(response => {
      const users = response.data.users;
      const totalPages = response.data.totalPages;
      const startIndex = (page - 1) * limit;

      const usersTableBody = document.getElementById('usersTableBody');
      usersTableBody.innerHTML = '';

      var element = document.getElementById('someElement');
      var resendActivationRequestExists = JSON.parse(element.getAttribute('data-resend-activation'))

      users.forEach((user, index) => {
        const userNumber = startIndex + index + 1;
        const showResendButton = resendActivationRequestExists.includes(user._id);
        const resendButtonClass = user.isActive ? 'btn-secondary disabled' : (showResendButton ? 'btn-info' : 'btn-secondary');

        usersTableBody.innerHTML += `
          <tr>
            <td>${userNumber}</td>
            <td>${user.email}</td>
            <td>${user.fullName}</td>
            <td>${user.role}</td>
            <td>${user.isActive ? '<span class="badge bg-success">Active</span>' : '<span class="badge bg-danger">Not Active</span>'}</td>
            <td>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="blockedSwitch${user._id}" ${user.isLocked ? 'checked' : ''} onchange="toggleBlocked(this)">
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

      // Cập nhật phân trang
      createPagination(totalPages, page);
    })
    .catch(error => console.error('Error loading users:', error));
}

function resendActivationEmail(userId) {
  fetch(`/user/resend-activation/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      const modalBody = document.querySelector('#resendEmailModal .modal-body');
      modalBody.innerHTML = data.message;

      // Hiển thị modal
      var modal = new bootstrap.Modal(document.getElementById('resendEmailModal'));
      modal.show();

      loadUsers(1);
    })
    .catch(error => {
      const modalBody = document.querySelector('#resendEmailModal .modal-body');
      modalBody.innerHTML = 'Error: ' + error.message;

      // Hiển thị modal
      var modal = new bootstrap.Modal(document.getElementById('resendEmailModal'));
      modal.show();
    });
}



function createPagination(totalPages, currentPage) {
  const paginationUl = document.getElementById('pagination');
  paginationUl.innerHTML = ''; // Xóa nội dung hiện tại

  // Nút "Previous"
  paginationUl.innerHTML += `
    <li class="page-item ${currentPage > 1 ? '' : 'disabled'}">
      <span class="page-link" onclick="${currentPage > 1 ? `loadUsers(${currentPage - 1})` : ''}">Previous</span>
    </li>
  `;

  // Số trang
  for (let i = 1; i <= totalPages; i++) {
    paginationUl.innerHTML += `
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <span class="page-link" onclick="loadUsers(${i})">${i}</span>
      </li>
    `;
  }

  // Nút "Next"
  paginationUl.innerHTML += `
    <li class="page-item ${currentPage < totalPages ? '' : 'disabled'}">
      <span class="page-link" onclick="${currentPage < totalPages ? `loadUsers(${currentPage + 1})` : ''}">Next</span>
    </li>
  `;
}

// Gọi hàm này sau khi loadUsers để cập nhật phân trang



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

function toggleBlocked(checkbox) {
  const isLocked = checkbox.checked;
  let id = checkbox.id.replace('blockedSwitch', '');

  axios.post(`/user/toggle-block/${id}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    body: { isLocked }
  })
    .then(response => {
      console.log('Status updated:', response.data);
      loadUsers(1);
    })
    .catch(error => {
      console.error('Error updating status:', error);
    });
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

        console.log(userData)

        axios.post(`/user/update/${userId}`, userData, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(response => {
            if (response.status === 200) {
              console.log('User updated successfully:', response.data);
              loadUsers(1)
              document.body.classList.remove('drawer-open');
            } else {
              alert('Cập nhật người dùng không thành công. Vui lòng thử lại sau.');
            }
          })
          .catch(error => {
            console.error('Error updating user:', error);
            alert('Có lỗi xảy ra khi cập nhật người dùng. Vui lòng thử lại sau.');
          });
      }

      document.querySelector('.drawer-header h5').textContent = 'Edit User';
      document.body.classList.add('drawer-open');
    })
    .catch(error => {
      console.error('Error:', error);
    });
}




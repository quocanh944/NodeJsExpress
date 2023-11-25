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
  $('.drawer-content').html(`
      <form id="formDrawer" method="post" enctype="multipart/form-data">
				<div class="mb-3 text-center w-50 m-auto">
					<img id="frame" src="./public/images/productImagePlaceholder.webp" class="img-fluid" />
				</div>

				<div class="mb-3">
					<label for="formFile" class="form-label">Product Thumbnail</label>
					<input class="form-control" name="image" type="file" id="formFile" onchange="preview()">
				</div>
				<div class="mb-3">
					<label for="productName" class="form-label">Product Name</label>
					<input type="text" class="form-control" id="productName" name="productName" required>
				</div>

				<div class="mb-3">
					<label for="barcode" class="form-label">Barcode</label>
					<input type="text" class="form-control" id="barcode" name="barcode" required>
				</div>

				<div class="mb-3">
					<label for="importPrice" class="form-label">Import Price</label>
					<input type="number" class="form-control" id="importPrice" name="importPrice" required>
				</div>

				<div class="mb-3">
					<label for="retailPrice" class="form-label">Retail Price</label>
					<input type="number" class="form-control" id="retailPrice" name="retailPrice" required>
				</div>

				<div class="mb-3">
					<label for="category" class="form-label">Category</label>
					<input type="text" class="form-control" id="category" name="category" required>
				</div>

				<div class="mb-3">
					<label for="inventory" class="form-label">Inventory</label>
					<input type="number" class="form-control" id="inventory" name="inventory" required>
				</div>

				<button type="submit" class="btn btn-primary">Create Product</button>
			</form>
  `);
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

  axios.get(`/product/${productId}`)
    .then(response => {
      const { product, error, message } = response.data;
      console.log({ product, error, message });
      $('.drawer-content').html(`
        <form id="formDrawer" action="/product/edit/${product._id}" method="post" enctype="multipart/form-data">
          <input type="hidden" name="_method" value="PUT">
          <div class="mb-3 text-center w-50 m-auto">
            <img id="frame" src="${product.thumbnailUrl}" class="img-fluid" />
          </div>

          <div class="mb-3">
            <label for="formFile" class="form-label">Product Thumbnail</label>
            <input class="form-control" name="image" type="file" id="formFile" onchange="preview()">
          </div>
          <div class="mb-3">
            <label for="productName" class="form-label">Product Name</label>
            <input type="text" value="${product.productName}" class="form-control" id="productName" name="productName" required>
          </div>

          <div class="mb-3">
            <label for="barcode" class="form-label">Barcode</label>
            <input type="text" value="${product.barcode}" class="form-control" id="barcode" name="barcode" required>
          </div>

          <div class="mb-3">
            <label for="importPrice" class="form-label">Import Price</label>
            <input type="number" value="${product.importPrice}" class="form-control" id="importPrice" name="importPrice" required>
          </div>

          <div class="mb-3">
            <label for="retailPrice" class="form-label">Retail Price</label>
            <input type="number" value="${product.retailPrice}" class="form-control" id="retailPrice" name="retailPrice" required>
          </div>

          <div class="mb-3">
            <label for="category" class="form-label">Category</label>
            <input type="text" value="${product.category}" class="form-control" id="category" name="category" required>
          </div>

          <div class="mb-3">
            <label for="inventory" class="form-label">Inventory</label>
            <input type="number" value="${product.inventory}" class="form-control" id="inventory" name="inventory" required>
          </div>

          <button type="submit" class="btn btn-primary">Update Product</button>
        </form>
      `);
      document.body.classList.add('drawer-open');

      // document.querySelector('.drawer-header h5').textContent = 'Edit User';
      // document.body.classList.add('drawer-open');
    })
    .catch(error => {
      console.error('Error:', error);
    });
}



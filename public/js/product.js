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
  frame.src = "/public/images/productImagePlaceholder.webp";
}

// Gọi hàm này sau khi loadUsers để cập nhật phân trang
function openDrawerForCreate() {
  $('.drawer-content').html(`
      <form id="formDrawer" method="post" enctype="multipart/form-data">
				<div class="mb-3 text-center w-50 m-auto">
					<img id="frame" src="/public/images/productImagePlaceholder.webp" class="img-fluid" />
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

				<button type="submit" class="btn btn-dark text-white">Create Product</button>
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
  $('#formDeleteProduct').prop('action', '/product/delete/' + productId)
  var confirmModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
  confirmModal.show();
}

function openEditDrawer(productId) {

  axios.get(`/product/${productId}`)
    .then(response => {
      const { product, error, message } = response.data;
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

          <button type="submit" class="btn btn-dark text-white">Update Product</button>
        </form>
      `);
      document.body.classList.add('drawer-open');

    })
    .catch(error => {
      console.error('Error:', error);
    });
}



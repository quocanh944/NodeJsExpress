var userIdToDelete;

function showSpinner() {
  $('.spinner-border').show();
}

function hideSpinner() {
  $('.spinner-border').hide();
}


function loadCustomers() {
  if ($.fn.DataTable.isDataTable('#customersTable')) {
    $('#customersTable').DataTable().clear().destroy();
  }
  showSpinner();
  axios.get(`/customer/api`)
    .then(response => {
      const customers = response.data;

      const customersTableBody = document.getElementById('customersTableBody');
      customersTableBody.innerHTML = "";

      if (customers) {
        customers.forEach((customer, index) => {
          customersTableBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${customer.fullName}</td>
                <td>${customer.phoneNumber}</td>
                <td>${customer.address}</td>
                <td>
                  <!-- Thêm các nút hành động ở đây -->
                  <button onclick="showPreview('${customer._id}')" class="btn btn-dark text-white" data-toggle="tooltip" title="Preview Customer">
                    <i class="fa fa-eye"></i>
                  </button>
                  <a href="/customer/${customer._id}">
                    <button class="btn btn-primary" data-toggle="tooltip" title="View Details">
                      <i class="fa fa-angle-double-right"></i>
                    </button>
                  </a>
                </td>
              </tr>
          `;
        });
      }
      $('#customersTable').DataTable({
        searching: true,
        ordering: true,
        columnDefs: [
          { orderable: false, targets: 4 }
        ]
      });
      hideSpinner()
    })
    .catch(error => console.error('Error loading customers:', error));
}

function showPreview(id) {

  axios.get(`/customer/api/${id}`)
    .then(res => {
      setModalContent(res.data)
    })
    .catch(err => {
      console.log(err)
    })
}

function setModalContent(customerData) {
  let html = `
      <div class="card p-0">
        <div class="card-image">
          <img
            src="https://st.depositphotos.com/1003593/2504/i/450/depositphotos_25042169-stock-photo-customer-concept.jpg"
            alt="${customerData.fullName}">
        </div>
        <div class="card-content d-flex flex-column align-items-center text-dark">
          <h4 class="pt-2">${customerData.fullName}</h4>
          <h5>Customer</h5>
          <ul class="social-icons d-flex">
            <li data-toggle="tooltip" title="Phone Number"><span class="fas fa-phone-alt"></span> ${customerData.phoneNumber}</li>
            <li data-toggle="tooltip" title="Address"><span class="fas fa-home"></span> ${customerData.address}</li>
            <li data-toggle="tooltip" title="Total Products Bought"><span class="fas fa-shopping-cart"></span> ${customerData.totalProductsBought}</li>
            <li data-toggle="tooltip" title="Total Spent"><span class="fas fa-dollar-sign"></span> $${customerData.totalSpent}</li>
          </ul>

        </div>
      </div>
    `;

  // Hiển thị modal với nội dung mới
  const modalBody = document.querySelector('#previewCustomer .modal-content');
  modalBody.innerHTML = html;
  $('#previewCustomer').modal('show');
}

document.addEventListener('DOMContentLoaded', () => {

  loadCustomers()
})

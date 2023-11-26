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
      console.log(response)
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
                  <button onclick="viewCustomerDetails('${customer._id}')" class="btn btn-primary">View</button>
                </td>
              </tr>
          `;
        });
      }
      $('#customersTable').DataTable({
        searching: true,
        ordering: true,
        columnDefs: [
          { orderable: false, targets: 6 }
        ]
      });
      hideSpinner()
    })
    .catch(error => console.error('Error loading customers:', error));
}

function viewCustomerDetails(id) {
  console.log(id)
}

document.addEventListener('DOMContentLoaded', () => {

  loadCustomers()
})






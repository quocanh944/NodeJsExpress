document.addEventListener('DOMContentLoaded', function () {
  loadCustomers()
});


function loadCustomers() {
  axios.get('/customer/api')
    .then(response => {
      const customers = response.data;
      console.log(customers)
      const customerContainer = document.getElementById('customerCards');
      customerContainer.innerHTML = '';

      customers.forEach(customer => {
        const customerCard = `
          <div class="card">
            <img src="path/to/avatar.jpg" class="card-img-top" alt="Avatar">
            <div class="card-body">
              <h5 class="card-title">${customer.fullName}</h5>
              <p class="card-text">${customer.phoneNumber}</p>
              <button onclick="viewCustomerDetails('${customer._id}')" class="btn btn-primary">View Details</button>
            </div>
          </div>
        `;
        customerContainer.innerHTML += customerCard;
      });
    })
    .catch(error => {
      console.error('Error loading customers:', error);
    });
}

function viewCustomerDetails(customerId) {
  axios.get(`/customers/api/${customerId}`)
    .then(response => {
      const customer = response.data;
      // Hiển thị chi tiết của khách hàng, có thể thông qua modal hoặc một trang chi tiết
      console.log(customer); // Thay thế bằng cách xử lý dữ liệu thực tế
    })
    .catch(error => {
      console.error('Error fetching customer details:', error);
    });
}



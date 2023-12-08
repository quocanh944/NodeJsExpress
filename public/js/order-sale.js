function showSpinner() {
    $('.spinner-border').show();
}

function hideSpinner() {
    $('.spinner-border').hide();
}

function loadOrders() {
    if ($.fn.DataTable.isDataTable('#orderTable')) {
        $('#orderTable').DataTable().clear().destroy();
    }
    showSpinner();
    axios.get(`/order/getListOrder`)
        .then(response => {
            console.log(response)
            const orders = response.data;

            const orderTableBody = document.getElementById('orderTableBody');
            orderTableBody.innerHTML = "";

            if (orders) {
                orders.forEach((order, index) => {
                    orderTableBody.innerHTML += `
              <tr>
                <td>${index + 1}</td>
                <td>${new Date(order.purchaseDate).toLocaleDateString()}</td>
                <td>${order.totalProduct}</td>
                <td>${order.totalAmount}</td>
                <td>${order.discount}</td>
                <td>${order.finalAmount}</td>
                <td>${order.moneyReceived}</td>
                <td>${order.moneyBack}</td>
                <td>
                  <!-- Add action buttons here -->
                  <button onclick="viewOrderDetails('${order.orderId}')" class="btn btn-primary" data-toggle="tooltip" title="View Details">
                    <i class="fa fa-angle-double-right"></i>
                  </button>
                </td>
              </tr>
            `;
                });
            }
            $('#orderTable').DataTable({
                searching: true,
                ordering: true,
                columnDefs: [
                    { orderable: false, targets: 8 }
                ]
            });
            hideSpinner()
        })
        .catch(error => console.error('Error loading orders:', error));
}

function viewOrderDetails(id) {
    axios.get(`/order/getOrderDetail/${id}`)
      .then(response => {
        const orderDetails = response.data;
        let tableContent = `
          <table class="table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Image</th>
                <th>Retail Price</th>
                <th>Quantity</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>`;
  
        orderDetails.forEach(detail => {
          tableContent += `
            <tr>
              <td>${detail.productName}</td>
              <td><img src="${detail.thumbnailUrl}" alt="${detail.productName}" style="width: 100px; height: 100px;"></td>
              <td>$${detail.retailPrice}</td>
              <td>${detail.quantity}</td>
              <td>$${detail.totalPrice}</td>
            </tr>`;
        });
  
        tableContent += `</tbody></table>`;
        document.querySelector('#orderDetailsModal .modal-body').innerHTML = tableContent;
        $('#orderDetailsModal').modal('show');
      })
      .catch(error => console.error('Error loading order details:', error));
  }
  


document.addEventListener('DOMContentLoaded', () => {
    loadOrders()
})

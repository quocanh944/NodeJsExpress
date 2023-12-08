function showSpinner() {
    $('.spinner-border').show();
}

function hideSpinner() {
    $('.spinner-border').hide();
}

async function addToTable(data) {
    const s = await data.map(async (order, index) => {
        return `
        <tr>
          <td>${index + 1}</td>
          <td data-order="${(new Date(order.purchaseDate)).getTime()}">${new Date(order.purchaseDate).toLocaleDateString()}</td>
          <td>${order.totalProduct}</td>
          <td data-order="${order.totalAmount}">${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.totalAmount)}</td>
          <td>${order.discount}</td>
          <td data-order="${order.finalAmount}">${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.finalAmount)}</td>
          <td data-order="${order.moneyReceived}">${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.moneyReceived)}</td>
          <td data-order="${order.moneyBack}">${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.moneyBack)}</td>
          <td>
            <!-- Add action buttons here -->
            <button onclick="viewOrderDetails('${order.orderId}')" class="btn btn-primary" data-toggle="tooltip" title="View Details">
              <i class="fa fa-angle-double-right"></i>
            </button>
          </td>
        </tr>
      `
    })
    return s
}

async function loadOrders() {
    if ($.fn.DataTable.isDataTable('#orderTable')) {
        $('#orderTable').DataTable().clear().destroy();
    }
    showSpinner();
    try {
        const res = await axios.get(`/order/getListOrder`)  // Adjust the endpoint as needed
        const orders = res.data;

        const orderTableBody = document.getElementById('orderTableBody');

        const s = await addToTable(orders)
        
        Promise.all(s).then((values) => {
            orderTableBody.innerHTML = values.join("");
            $('#orderTable').DataTable({
                searching: true,
                ordering: true,
                columnDefs: [
                    { orderable: false, targets: 8 }
                ]
            });
        })
        hideSpinner()
    } catch (error) {
        console.error('Error loading orders:', error)
    }

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
    let alreadyLoaded = false;
    $("#navOrderHistory").click(async () => {
        if (!alreadyLoaded) {
            alreadyLoaded = true;
            await loadOrders()
        }
    })
})

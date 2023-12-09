$(function () {
  function cb(start, end) {
    console.log(start, end)
    $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    loadCustomerOrders(start, end);
  }

  $('#reportrange').daterangepicker({
    startDate: moment().startOf('day'),
    endDate: moment().endOf('day'),
    ranges: {
      'Today': [moment().startOf('day'), moment().endOf('day')],
      'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')]
    }
  }, cb);

  cb(moment().startOf('day'), moment().endOf('day'));
});

function showSpinner() {
  $('.spinner-border').show();
}

function hideSpinner() {
  $('.spinner-border').hide();
}


function loadCustomerOrders(start, end) {
  const url = window.location.href;
  const segments = url.split('/');
  const customerID = segments[segments.length - 1];

  if (customerID) {
    // Khởi tạo lại DataTable
    if ($.fn.DataTable.isDataTable('#ordersTable')) {
      $('#ordersTable').DataTable().clear().destroy();
    }
    showSpinner();
    axios.get(`/order/api/${customerID}`, {
      params: {
        startDate: start?.format('YYYY-MM-DD'),
        endDate: end?.format('YYYY-MM-DD')
      }
    })
      .then(response => {
        const orders = response.data;
        const ordersTableBody = document.getElementById('ordersTableBody');
        ordersTableBody.innerHTML = ""; // Xóa dữ liệu cũ

        orders.forEach(order => {
          const purchaseDate = moment(order.purchaseDate).format("MMMM Do YYYY, h:mm:ss a");
          order.products.forEach(product => {
            ordersTableBody.innerHTML += `
              <tr>
                <td><img src="${product.productId.thumbnailUrl}" style="width: 50px; height: 50px;"></td>
                <td>${product.productId.productName}</td>
                <td>${product.productId.retailPrice}</td>
                <td>${product.productId.category}</td>
                <td data-order="${(new Date(order.purchaseDate)).getTime()}">${new Date(order.purchaseDate).toLocaleDateString()}</td>
              </tr>
            `;
          });
        });

        $('#ordersTable').DataTable({
          searching: true,
          ordering: true,
        });

        hideSpinner();
      })
      .catch(error => {
        console.error('Error loading orders:', error);
        hideSpinner();
      });
  }
}

function loadCustomerInfo() {
  const url = window.location.href;
  const segments = url.split('/');
  const customerID = segments[segments.length - 1];

  if (customerID) {
    axios.get(`/customer/api/${customerID}`)
      .then(response => {
        const customer = response.data;
        setFormContent(customer)
      })
      .catch(error => console.error('Error loading customer:', error));
  }
}

function setFormContent(customer) {
  const customerName = document.getElementById('customerName');
  const customerPhone = document.getElementById('customerPhone');
  const customerAddress = document.getElementById('customerAddress');

  customerName.value = customer.fullName;
  customerPhone.value = customer.phoneNumber;
  customerAddress.value = customer.address;
}


document.addEventListener('DOMContentLoaded', () => {
  loadCustomerInfo()
})

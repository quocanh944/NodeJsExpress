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

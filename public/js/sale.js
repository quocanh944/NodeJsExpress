async function fetchData(url, method = 'GET', body = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Error in fetch request: ${response.statusText}`);
    return response.json();
}

function makeMatchingLettersBold(string, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return string.replace(regex, '<b>$1</b>');
}

function formatMoney(money) {
    return money.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
}

const productSearchInput = document.getElementById("productSearchInput");
const productSearchResults = document.getElementById("productSearchResults");
const customerSearchInput = document.getElementById("customerSearchInput");
const customerSearchResults = document.getElementById("customerSearchResults");
const totalAmountEl = document.getElementById('totalAmount');
const discountInput = document.getElementById('discount');
const finalAmountEl = document.getElementById('finalAmount');
const cartDiv = document.getElementById('cart');
const phoneNumber = document.getElementById('phoneNumber');
const fullName = document.getElementById('fullName');
const address = document.getElementById('address');
const checkoutButton = document.getElementById('checkoutButton');
const amountReceived = document.getElementById('amountReceived');
const changeAmount = document.getElementById('changeAmount');

let products = [];
let customerId_;

let newCustomer = false;

// Event Listeners and Initializers
window.onload = () => {
    fetchData(`/cart/get`).then(displayCart);
    discountInput.value = 0;
    changeAmount.textContent = "$0";
};

productSearchInput.addEventListener('input', () => searchProduct(productSearchInput.value));
customerSearchInput.addEventListener('input', () => searchCustomer(customerSearchInput.value));
amountReceived.addEventListener('input', () => changeAmount.textContent = formatMoney(amountReceived.value - finalAmountEl.textContent.replace(/[$,]/g, "")));

checkoutButton.addEventListener('click', processCheckout);

document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');
  
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        // Gửi yêu cầu đăng xuất bằng Axios khi nút đăng xuất được nhấn
        fetch('/logout')
          .then((response) => {
            // Xử lý phản hồi từ máy chủ (ví dụ: chuyển hướng hoặc hiển thị thông báo đăng xuất thành công)
            console.log(response)
            location.reload()
          })
          .catch((error) => {
            // Xử lý lỗi nếu có
            console.log(error)
          });
      });
    }
  });
  

// Function Declarations
async function searchProduct(value) {
    if (!value) {
        productSearchResults.innerHTML = "";
        return;
    }
    try {
        const data = await fetchData(`/product/search?query=${value}`);
        displayProductSearch(data, value);
    } catch (error) {
        console.error("Error loading product data:", error);
    }
}

async function searchCustomer(value) {
    if (!value) {
        customerSearchResults.innerHTML = "";
        return;
    }
    try {
        const data = await fetchData(`/customer/search?query=${value}`);
        displayCustomerSearch(data, value);
    } catch (error) {
        console.error("Error loading customer data:", error);
    }
}

function displayProductSearch(results, query) {
    // Xóa kết quả tìm kiếm cũ
    productSearchResults.innerHTML = "";

    var html = '<ul class="list-group">';
    if (results.length > 0) {
        results.forEach(product => {
            productText = makeMatchingLettersBold(product.productName, query);
            if (product.inventory < 1) {
                html += `
                <li class="list-group-item list-group-item-action disabled">
                    <div style="display: flex; align-items: center;">
                        <img src="${product.thumbnailUrl}" alt="${product.productName}" style="width: 50px; height: 50px; margin-right: 10px;">
                        <div>
                            <div>${productText}</div>
                            <div>${product.barcode}</div>
                            <div>Inventory: ${product.inventory}</div>
                        </div>
                    </div>
                </li>`;
            } else {
                html += `
                <li class="list-group-item list-group-item-action" onclick="addProductToCart('${product._id}')">
                    <div style="display: flex; align-items: center;">
                        <img src="${product.thumbnailUrl}" alt="${product.productName}" style="width: 50px; height: 50px; margin-right: 10px;">
                        <div>
                            <div>${productText}</div>
                            <div>${product.barcode}</div>
                            <div>Inventory: ${product.inventory}</div>
                        </div>
                    </div>
                </li>`;
            }
        });
    } else {
        html += '<li class="list-group-item list-group-item-action disabled">Không tìm thấy sản phẩm nào.</li>';
    }
    html += '</ul>';
    productSearchResults.innerHTML = html;
}

function displayCustomerSearch(results, query) {
    // Xóa kết quả tìm kiếm cũ
    customerSearchResults.innerHTML = "";

    var html = '<ul class="list-group">';
    if (results.length > 0) {
        results.forEach(customer => {
            phoneText = makeMatchingLettersBold(customer.phoneNumber, query)
            html += `<li class="list-group-item list-group-item-action" onclick="addCustomerToForm('${customer.phoneNumber}')"" >
                  ${phoneText}<br>${customer.fullName}
              </li>`;
        });
    } else {
        html += `<li class="list-group-item list-group-item-action" onclick="addNewCustomer('${query}')"" >No phone numbers found (Click to add new).</li>`;
    }
    html += '</ul>';
    customerSearchResults.innerHTML = html
}

async function fetchDataCart(productID) {
    try {
        await fetchData(`/cart/addProduct/${productID}`, 'POST');
        const cart = await fetchData(`/cart/get`);
        displayCart(cart);
    } catch (error) {
        console.error("Error adding product to cart:", error);
    }
}

async function addProductToCart(productId) {
    productSearchInput.value = "";
    productSearchResults.innerHTML = "";
    await fetchDataCart(productId);
}

async function addCustomerToForm(phone) {
    customerSearchInput.value = "";
    customerSearchResults.innerHTML = "";
    try {
        const data = await fetchData(`/customer/getByPhone?phone=${phone}`);
        customerId_ = data._id;
        phoneNumber.value = data.phoneNumber;
        fullName.value = data.fullName;
        address.value = data.address;
    } catch (error) {
        console.error("Error fetching customer data:", error);
    }
}

function addNewCustomer(phone) {
    phoneNumber.value = phone;
    customerSearchInput.value = "";
    customerSearchResults.innerHTML = "";
    newCustomer = true;
}

function deleteItem(item, listItem, data) {
    fetch(`/cart/delete?cartItemId=${item.cartItemId}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                // Remove the item from the data array
                const index = data.findIndex(p => p.cartItemId === item.cartItemId);
                if (index !== -1) {
                    data.splice(index, 1);
                }

                // Remove the item from the products array
                const productsIndex = products.findIndex(p => p.productId === item.productId);
                if (productsIndex !== -1) {
                    products.splice(productsIndex, 1);
                }

                // Update the UI
                listItem.remove();
                updateTotalAmount(data);
                calculateFinalAmount();
            } else {
                console.error('Failed to delete product.');
            }
        })
        .catch(error => console.error(error));
}

function updateQuantity(item, listItem, data, newQuantity) {
    fetch(`/cart/edit?cartItemId=${item.cartItemId}&quantity=${newQuantity}`, { method: 'PUT' })
        .then(response => {
            if (response.ok) {
                // Update the quantity in the data array
                const index = data.findIndex(p => p.cartItemId === item.cartItemId);
                if (index !== -1) {
                    data[index].quantity = newQuantity;
                    data[index].totalPrice = data[index].retailPrice * newQuantity;
                }

                // Update the products array
                const productsIndex = products.findIndex(p => p.productId === item.productId);
                if (productsIndex !== -1) {
                    products[productsIndex].quantity = newQuantity;
                    products[productsIndex].totalPrice = data[index].totalPrice;
                }

                // Update the UI
                const totalDiv = listItem.querySelector('.total-price');
                totalDiv.textContent = `Total: $${data[index].totalPrice}`;

                updateTotalAmount(data);
                calculateFinalAmount();
            } else {
                console.error('Failed to update product quantity.');
            }
        })
        .catch(error => console.error(error));
}

function displayCart(data) {
    cartDiv.innerHTML = ''; // Clear existing cart contents

    const listGroup = document.createElement('div');
    listGroup.className = 'list-group';
    listGroup.style.maxHeight = '436px';
    listGroup.style.overflowY = 'auto';

    let totalAmount = 0;

    data.forEach(item => {
        // Update products array without duplicates
        const index = products.findIndex(p => p.productId === item.productId);
        const productData = { productId: item.productId, productName: item.productName, quantity: item.quantity, totalPrice: item.retailPrice * item.quantity };
        if (index !== -1) {
            products[index] = productData;
        } else {
            products.push(productData);
        }

        totalAmount += item.retailPrice * item.quantity;

        // Create list item
        const listItem = document.createElement('div');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

        // Product Name and Quantity
        listItem.innerHTML = `
            <div>
                <h5 style="width: 250px;">${item.productName}</h5>
                <label>
                    Quantity: 
                    <input type="number" class="form-control ml-2 d-inline-block" value="${item.quantity}" min="1" max="${item.quantity}" style="width: 80px;">
                </label>
            </div>
            <div style="width: 100px;">Price: $${item.retailPrice}</div>
            <div class="total-price ml-2 d-block" style="width: 100px; font-weight: bold;">Total: $${item.retailPrice * item.quantity}</div>
        `;

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteItem(item, listItem, data);
        listItem.appendChild(deleteBtn);

        listGroup.appendChild(listItem);

        // Attach event listener to quantity input
        const quantityInput = listItem.querySelector('input[type="number"]');
        quantityInput.addEventListener('change', (event) => {
            console.log(item.inventory);
            if (event.target.value > item.inventory) {
                toastr.error('Error: Not enough products', 'Error');
                quantityInput.value = item.inventory;
                return;
            } else {
                updateQuantity(item, listItem, data, event.target.value)
            }

        });
    });

    cartDiv.appendChild(listGroup);
    totalAmountEl.textContent = formatMoney(totalAmount);
    updateTotalAmount(data);
    calculateFinalAmount();
}

function calculateFinalAmount() {
    const totalAmount = parseFloat(totalAmountEl.textContent.replace(/[$,]/g, ""));
    const discount = parseFloat(discountInput.value) || 0;
    const discountedAmount = (totalAmount * discount) / 100;
    const finalAmount = totalAmount - discountedAmount;
    finalAmountEl.textContent = formatMoney(finalAmount);
}

function updateTotalAmount(data) {
    let totalAmount = data.reduce((sum, item) => sum + item.retailPrice * item.quantity, 0);
    totalAmountEl.textContent = formatMoney(totalAmount);
}

function clearTableInvoice() {
    const tableBody = document.getElementById('productsTable').getElementsByTagName('tbody')[0];
    while (tableBody.rows.length > 0) {
        tableBody.deleteRow(0);
    }
}

function clearCart() {
    clearTableInvoice();
    cartDiv.innerHTML = '';
    products = [];
    totalAmountEl.textContent = `$0`;
    discountInput.value = 0;
    finalAmountEl.textContent = `$0`;
    phoneNumber.value = '';
    fullName.value = '';
    address.value = '';
    amountReceived.value = '';
    changeAmount.textContent = '$0';
    fetchData('/cart/clear', 'DELETE').catch(error => console.error('Error clearing cart:', error));
}

async function printInvoice() {
    document.getElementById('phoneNumberInv').textContent = phoneNumber.value;
    document.getElementById('fullNameInv').textContent = fullName.value;
    document.getElementById('addressInv').textContent = address.value;
    document.getElementById('totalAmountInv').textContent = totalAmountEl.textContent;
    document.getElementById('discountInv').textContent = discountInput.value;
    document.getElementById('finalAmountInv').textContent = finalAmountEl.textContent;
    document.getElementById('amountReceivedInv').textContent = amountReceived.value;
    document.getElementById('changeAmountInv').textContent = changeAmount.textContent;
    products.forEach(product => {
        const table = document.getElementById('productsTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow(table.rows.length);

        newRow.insertCell(0).innerHTML = product.productName;
        newRow.insertCell(1).innerHTML = product.quantity;
        newRow.insertCell(2).innerHTML = product.totalPrice;
    })



    const { jsPDF } = window.jspdf;
    function downloadPDF() {
        const invoice = document.querySelector('.invoice');

        html2canvas(invoice, {
            onclone: (clonedDocument) => {
                const clonedInvoice = clonedDocument.querySelector('.invoice');
                // Modify the cloned invoice as needed
                clonedInvoice.style.display = 'block';
            }
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');

            // Get image dimensions
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            // Create a PDF that matches the dimensions of the image
            // Convert dimensions from pixels to millimeters for jsPDF (1 pixel = 0.264583 mm)
            const pdfWidth = imgWidth * 0.264583;
            const pdfHeight = imgHeight * 0.264583;

            // Initialize jsPDF with image dimensions portrait
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [pdfWidth, pdfHeight]
            });

            // Add image to PDF
            pdf.addImage(imgData, 'PNG', 5, 0, pdfWidth, pdfHeight);
            pdf.save('invoice.pdf');
        });
    }

    downloadPDF();
}

async function processCheckout() {
    if (products.length == 0) {
        toastr.error("Error: There are no products in the cart.", "Error");
        return; 
    }
    if (!fullName.value || !address.value) { 
        toastr.error("Error: Missing customer infomation.", "Error");
        return; 
    }
    if (!amountReceived.value) { 
        toastr.error("Error: Missing Amout Received.", "Error");
        return; 
    }
    if (parseFloat(changeAmount.textContent.replace(/[$,]/g, "")) < 0) { 
        toastr.error("Error: The amount received is not enough for payment.", "Error");
        return;
    }

    if (newCustomer) {
        const dataCustomer = {
            phoneNumber: phoneNumber.value,
            fullName: fullName.value,
            address: address.value,
        }
        console.log(dataCustomer)
        const response = await fetchData('customer/add', 'POST', dataCustomer);
        newCustomer = false;
    }

    if (fullName.value && address.value && amountReceived.value && products.length != 0) {
        await printInvoice();
        //Remove productName
        const productsToCheckout = products.map(({ productName, ...rest }) => rest);
        const data = {
            customerId: customerId_,
            products: productsToCheckout,
            totalAmount: parseFloat(totalAmountEl.textContent.replace(/[$,]/g, "")),
            discount: parseFloat(discountInput.value),
            finalAmount: parseFloat(finalAmountEl.textContent.replace(/[$,]/g, "")),
            moneyReceived: parseFloat(amountReceived.value),
            moneyBack: parseFloat(changeAmount.textContent.replace(/[$,]/g, ""))
        };

        try {
            const responseData = await fetchData('order/add', 'POST', data);
            console.log('Checkout successful:', responseData);
            clearCart();
        } catch (error) {
            console.error('Checkout error:', error);
        }
    }
}
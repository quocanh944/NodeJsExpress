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

// Event Listeners and Initializers
window.onload = () => fetchData(`/cart/get`).then(displayCart);

productSearchInput.addEventListener('input', () => searchProduct(productSearchInput.value));
customerSearchInput.addEventListener('input', () => searchCustomer(customerSearchInput.value));

checkoutButton.addEventListener('click', processCheckout);

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
            html += `
                <li class="list-group-item list-group-item-action" onclick="addProductToCart('${product._id}')">
                    <div style="display: flex; align-items: center;">
                        <img src="${product.thumbnailUrl}" alt="${product.productName}" style="width: 50px; height: 50px; margin-right: 10px;">
                        <div>
                            <div>${productText}</div>
                            <div>${product.barcode}</div>
                        </div>
                    </div>
                </li>`;
        });
    } else {
        html += '<a href="#" class="list-group-item list-group-item-action disabled">Không tìm thấy sản phẩm nào.</a>';
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
        html += '<a href="#" class="list-group-item list-group-item-action disabled ">Không tìm thấy (Bấm vào để thêm mới SĐT).</a>';
    }
    html += '</ul>';
    customerSearchResults.innerHTML = html
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

async function fetchDataCart(productID) {
    try {
        await fetchData(`/cart/addProduct/${productID}`, 'POST');
        const cart = await fetchData(`/cart/get`);
        displayCart(cart);
    } catch (error) {
        console.error("Error adding product to cart:", error);
    }
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
    listGroup.style.maxHeight = '360px';
    listGroup.style.overflowY = 'auto';

    let totalAmount = 0;

    data.forEach(item => {
        // Update products array without duplicates
        const index = products.findIndex(p => p.productId === item.productId);
        const productData = { productId: item.productId, quantity: item.quantity, totalPrice: item.retailPrice * item.quantity };
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
                    <input type="number" class="form-control ml-2 d-inline-block" value="${item.quantity}" min="1" style="width: 80px;">
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
        quantityInput.addEventListener('change', (event) => updateQuantity(item, listItem, data, event.target.value));
    });

    cartDiv.appendChild(listGroup);
    totalAmountEl.textContent = `$${totalAmount.toFixed(2)}`;
    updateTotalAmount(data);
    calculateFinalAmount();
}

function calculateFinalAmount() {
    const totalAmount = parseFloat(totalAmountEl.textContent.replace('$', ''));
    const discount = parseFloat(discountInput.value) || 0;
    const discountedAmount = (totalAmount * discount) / 100;
    const finalAmount = totalAmount - discountedAmount;
    finalAmountEl.textContent = formatMoney(finalAmount);
}

function updateTotalAmount(data) {
    let totalAmount = data.reduce((sum, item) => sum + item.retailPrice * item.quantity, 0);
    totalAmountEl.textContent = `$${totalAmount.toFixed(2)}`;
}

function clearCart() {
    cartDiv.innerHTML = '';
    products = [];
    totalAmountEl.textContent = `$0`;
    discountInput.value = 0;
    finalAmountEl.textContent = `$0`;
    phoneNumber.value = '';
    fullName.value = '';
    address.value = '';
    amountReceived.value = '';
    changeAmount.value = '';
    fetchData('/cart/clear', 'DELETE').catch(error => console.error('Error clearing cart:', error));
}

async function processCheckout() {
    const data = {
        customerId: customerId_,
        products: products,
        totalAmount: parseFloat(totalAmountEl.textContent.replace('$', '')),
        moneyReceived: parseFloat(amountReceived.value),
        moneyBack: parseFloat(changeAmount.value)
    };

    try {
        const responseData = await fetchData('order/add', 'POST', data);
        console.log('Checkout successful:', responseData);
        clearCart();
    } catch (error) {
        console.error('Checkout error:', error);
    }
}

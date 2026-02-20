// 1. Always pull fresh data from localStorage to keep UI in sync
const cartItemsBadge = document.getElementById('cart-count');

function updateBadge() {
    const currentCart = JSON.parse(localStorage.getItem('coffeeCart')) || [];
    // Sum up all quantities: item A (2) + item B (1) = 3 total items
    let totalItems = currentCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    if (cartItemsBadge) {
        cartItemsBadge.innerText = totalItems > 0 ? totalItems : "";
    }
}

// 2. Add Item Logic (Now handles Quantity correctly)
function selectAndRedirect(name, price, desc) {
    let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];
    
    // Check if item already exists in the list
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1; // Increase quantity if found
    } else {
        cart.push({ name, price, desc, quantity: 1 }); // Add new with qty 1
    }
    
    localStorage.setItem('coffeeCart', JSON.stringify(cart));
    updateBadge();
    console.log("Added:", name);
}

// 3. The Checkout Display (Fixing the missing buttons)
function loadOrder() {
    const container = document.getElementById('display-list');
    if (!container) return; 

    const cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];
    container.innerHTML = ""; 
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = "<h3>Your cart is empty.</h3>";
        document.getElementById('total-val').innerText = "Total: ₹0";
        // Hide payment section if empty
        const paySection = document.querySelector('.payment-section');
        if(paySection) paySection.style.display = 'none';
        return;
    }

    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-card';
        
        const itemTotal = item.price * (item.quantity || 1);
        total += itemTotal;

        // UPDATED HTML: Added the - / + buttons and the bin icon
        itemDiv.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>₹${item.price} each</small>
                </div>
                <div class="quantity-controls" style="display:flex; align-items:center; gap:10px;">
                    <button onclick="changeQuantity(${index}, -1)" style="cursor:pointer;">-</button>
                    <span>${item.quantity || 1}</span>
                    <button onclick="changeQuantity(${index}, 1)" style="cursor:pointer;">+</button>
                </div>
                <div style="display:flex; align-items:center; gap:15px;">
                    <strong>₹${itemTotal}</strong>
                    <button onclick="removeItem(${index})" style="background:none; border:none; cursor:pointer;">🗑️</button>
                </div>
            </div>
        `;
        container.appendChild(itemDiv);
    });

    document.getElementById('total-val').innerText = "Total: ₹" + total;
}

// 4. Handlers (Fixed to call loadOrder to refresh the UI)
function changeQuantity(index, delta) {
    let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];
    
    // Safety check: ensure quantity exists
    if (!cart[index].quantity) cart[index].quantity = 1;
    
    cart[index].quantity += delta;

    if (cart[index].quantity < 1) {
        return removeItem(index); 
    }

    localStorage.setItem('coffeeCart', JSON.stringify(cart));
    loadOrder();   // Refresh the list
    updateBadge(); // Refresh the navbar badge
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];
    cart.splice(index, 1); 
    localStorage.setItem('coffeeCart', JSON.stringify(cart));
    loadOrder();
    updateBadge();
}

// 5. Payment logic
function processPayment(event) {
    event.preventDefault();
    const checkedMethod = document.querySelector('input[name="pay-method"]:checked');
    if (!checkedMethod) return alert("Please select a payment method");

    const method = checkedMethod.value;
    localStorage.removeItem('coffeeCart');
    alert("Order Placed Successfully via " + method + "!");
    window.location.href = 'index.html';
}

// Initial Run
updateBadge();
if (document.getElementById('display-list')) {
    loadOrder();
}
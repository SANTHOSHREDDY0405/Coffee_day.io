let total = 0;
const selectedList = document.getElementById('selected-items-list');
const totalPriceElement = document.getElementById('total-price');

function addItem(name, price, description) {
    // Remove the "empty" message if it exists
    const emptyMsg = document.querySelector('.empty-msg');
    if (emptyMsg) emptyMsg.remove();

    // Create a new div for the selected item
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('selected-item-card');
    
    itemDiv.innerHTML = `
        <div class="item-header">
            <strong>${name}</strong>
            <span>₹${price}</span>
        </div>
        <p>${description}</p>
    `;

    // Add to the container
    selectedList.appendChild(itemDiv);

    // Update total price
    total += price;
    totalPriceElement.innerText = `₹${total}`;
}
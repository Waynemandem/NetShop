document.addEventListener('DOMContentLoaded', async () => {
    const cartContent = document.getElementById('cart-content');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartContent.innerHTML = '<p style="text-align: center;">Your cart is empty.</p>';
        return;
    }

    try {
        // Fetch product details for items in cart
        // In a real app, we might send IDs to backend to get details in one go, or store details in cart (not ideal for price updates)
        // Here we'll fetch all products and filter (inefficient but works for small scale) or fetch individually
        // Better: Fetch all products once (since we have a getAll endpoint) and map.

        const response = await Api.get('/products');
        const allProducts = response.data;

        let total = 0;
        const cartItems = cart.map(item => {
            const product = allProducts.find(p => p.id === item.productId);
            if (!product) return null;

            const itemTotal = product.price * item.quantity;
            total += itemTotal;

            return {
                ...product,
                quantity: item.quantity,
                itemTotal
            };
        }).filter(item => item !== null);

        renderCart(cartItems, total);

    } catch (error) {
        console.error('Error loading cart:', error);
        cartContent.innerHTML = '<p style="text-align: center; color: red;">Failed to load cart items.</p>';
    }
});

function renderCart(items, total) {
    const cartContent = document.getElementById('cart-content');

    const rows = items.map(item => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <img src="${item.image || 'https://via.placeholder.com/60'}" class="cart-item-img" alt="${item.name}">
                    <span>${item.name}</span>
                </div>
            </td>
            <td>$${item.price}</td>
            <td>${item.quantity}</td>
            <td>$${item.itemTotal.toFixed(2)}</td>
            <td>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
            </td>
        </tr>
    `).join('');

    cartContent.innerHTML = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
        <div class="cart-summary">
            <div class="cart-total">Total: $${total.toFixed(2)}</div>
            <a href="checkout.html" class="btn">Proceed to Checkout</a>
        </div>
    `;
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update badge
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    if (window.NavbarAPI) {
        window.NavbarAPI.updateCartBadge(totalItems);
    }

    // Reload page to refresh cart
    window.location.reload();
}

document.addEventListener('DOMContentLoaded', async () => {
    const productGrid = document.getElementById('product-grid');

    try {
        // Fetch products from API
        const response = await Api.get('/products');
        const products = response.data;

        if (products.length === 0) {
            productGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">No products found.</p>';
            return;
        }

        // Render products
        productGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image || 'https://via.placeholder.com/300'}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">$${product.price}</div>
                    <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading products:', error);
        productGrid.innerHTML = '<p style="text-align:center; color:red; grid-column: 1/-1;">Failed to load products.</p>';
    }
});

// Simple cart logic for now
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ productId, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // Calculate total items
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Update Navbar Badge via API
    if (window.NavbarAPI) {
        window.NavbarAPI.updateCartBadge(totalItems);
    }

    alert('Product added to cart!');
}

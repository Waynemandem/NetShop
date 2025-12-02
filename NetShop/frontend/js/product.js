document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('product-container');
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        container.innerHTML = '<p style="text-align: center; color: red;">Product not found.</p>';
        return;
    }

    try {
        const response = await Api.get(`/products/${productId}`);
        const product = response.data;

        document.title = `${product.name} - NetShop`;

        container.innerHTML = `
            <div class="product-details-container">
                <div class="product-gallery">
                    <img src="${product.image || 'https://via.placeholder.com/500'}" alt="${product.name}" class="product-image-large">
                </div>
                <div class="product-info-large">
                    <h1>${product.name}</h1>
                    <div class="product-price-large">$${product.price}</div>
                    <p class="product-description">${product.description || 'No description available.'}</p>
                    
                    <div class="action-buttons">
                        <input type="number" id="qty" class="qty-input" value="1" min="1">
                        <button class="btn" onclick="addToCart('${product.id}')">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;

    } catch (error) {
        console.error('Error loading product:', error);
        container.innerHTML = '<p style="text-align: center; color: red;">Failed to load product details.</p>';
    }
});

function addToCart(productId) {
    const qty = parseInt(document.getElementById('qty').value) || 1;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += qty;
    } else {
        cart.push({ productId, quantity: qty });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    if (window.NavbarAPI) {
        window.NavbarAPI.updateCartBadge(totalItems);
    }

    alert('Product added to cart!');
}

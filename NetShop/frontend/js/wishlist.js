document.addEventListener('DOMContentLoaded', async () => {
    const wishlistContent = document.getElementById('wishlist-content');

    // Check auth
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    loadWishlist();

    async function loadWishlist() {
        try {
            const response = await Api.get('/wishlist');
            const products = response.data;

            if (products.length === 0) {
                wishlistContent.innerHTML = '<p style="text-align: center;">Your wishlist is empty.</p>';
                return;
            }

            wishlistContent.innerHTML = `
                <div class="wishlist-grid">
                    ${products.map(product => `
                        <div class="wishlist-card">
                            <button class="remove-wishlist-btn" onclick="removeFromWishlist('${product.id}')" title="Remove">
                                <i class="fas fa-times"></i>
                            </button>
                            <img src="${product.image || 'https://via.placeholder.com/200'}" class="wishlist-img" alt="${product.name}">
                            <div class="wishlist-info">
                                <h4>${product.name}</h4>
                                <p style="color: var(--primary-color); font-weight: bold;">$${product.price}</p>
                                <button class="btn" style="width: 100%; margin-top: 0.5rem; font-size: 0.9rem;" onclick="moveToCart('${product.id}')">Add to Cart</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

        } catch (error) {
            console.error('Error loading wishlist:', error);
            wishlistContent.innerHTML = '<p style="text-align: center; color: red;">Failed to load wishlist.</p>';
        }
    }

    window.removeFromWishlist = async (productId) => {
        try {
            await Api.delete(`/wishlist/${productId}`);
            loadWishlist();
        } catch (error) {
            alert('Error removing item');
        }
    };

    window.moveToCart = (productId) => {
        // Simple add to cart logic (reused)
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ productId, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));

        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        if (window.NavbarAPI) {
            window.NavbarAPI.updateCartBadge(totalItems);
        }

        alert('Added to cart!');
    };
});

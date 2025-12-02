document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const categoryLinks = document.querySelectorAll('.filter-link');
    const sortSelect = document.getElementById('sort-select');
    const pageTitle = document.getElementById('page-title');

    let currentCategory = '';
    let currentSort = 'newest';
    let searchQuery = '';

    // Check URL params for search
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('search')) {
        searchQuery = urlParams.get('search');
        pageTitle.textContent = `Search results for "${searchQuery}"`;
    }

    // Initial Load
    fetchProducts();

    // Category Filter
    categoryLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Update active state
            categoryLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Update state
            currentCategory = link.dataset.category;
            searchQuery = ''; // Clear search when changing category
            pageTitle.textContent = currentCategory ? `${currentCategory} Products` : 'All Products';

            fetchProducts();
        });
    });

    // Sort Filter
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        fetchProducts();
    });

    async function fetchProducts() {
        productGrid.innerHTML = '<p>Loading...</p>';

        try {
            let endpoint = `/products?sort=${currentSort}`;
            if (currentCategory) {
                endpoint += `&category=${encodeURIComponent(currentCategory)}`;
            }
            if (searchQuery) {
                endpoint += `&search=${encodeURIComponent(searchQuery)}`;
            }

            const response = await Api.get(endpoint);
            const products = response.data;

            if (products.length === 0) {
                productGrid.innerHTML = '<p>No products found.</p>';
                return;
            }

            renderProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            productGrid.innerHTML = '<p style="color:red">Failed to load products.</p>';
        }
    }

    function renderProducts(products) {
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
    }
});

// Reuse addToCart from home.js (should be in a shared utils file ideally, but duplicating for now or assuming global)
function addToCart(productId) {
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

    alert('Product added to cart!');
}

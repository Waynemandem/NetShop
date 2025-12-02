document.addEventListener('DOMContentLoaded', async () => {
    const productList = document.getElementById('product-list');
    const productForm = document.getElementById('product-form');
    const modal = document.getElementById('product-modal');
    const logoutBtn = document.getElementById('logout-btn');

    // Check auth (simplified, ideally check role)
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        });
    }

    // Load Products
    loadProducts();

    async function loadProducts() {
        try {
            const response = await Api.get('/products');
            const products = response.data;

            productList.innerHTML = products.map(p => `
                <tr>
                    <td>${p.id.substring(0, 8)}...</td>
                    <td>${p.name}</td>
                    <td>$${p.price}</td>
                    <td>${p.category}</td>
                    <td>
                        <button class="action-btn edit-btn" onclick="editProduct('${p.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteProduct('${p.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    // Form Submit
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('product-id').value;
        const data = {
            name: document.getElementById('p-name').value,
            price: parseFloat(document.getElementById('p-price').value),
            category: document.getElementById('p-category').value,
            description: document.getElementById('p-description').value,
            image: document.getElementById('p-image').value
        };

        try {
            if (id) {
                await Api.put(`/products/${id}`, data);
            } else {
                await Api.post('/products', data);
            }
            closeModal();
            loadProducts();
        } catch (error) {
            alert('Error saving product: ' + error.message);
        }
    });

    // Global functions for inline onclick
    window.openModal = () => {
        document.getElementById('product-form').reset();
        document.getElementById('product-id').value = '';
        document.getElementById('modal-title').textContent = 'Add Product';
        modal.classList.add('active');
    };

    window.closeModal = () => {
        modal.classList.remove('active');
    };

    window.editProduct = async (id) => {
        try {
            const response = await Api.get(`/products/${id}`);
            const p = response.data;

            document.getElementById('product-id').value = p.id;
            document.getElementById('p-name').value = p.name;
            document.getElementById('p-price').value = p.price;
            document.getElementById('p-category').value = p.category;
            document.getElementById('p-description').value = p.description || '';
            document.getElementById('p-image').value = p.image || '';

            document.getElementById('modal-title').textContent = 'Edit Product';
            modal.classList.add('active');
        } catch (error) {
            alert('Error loading product details');
        }
    };

    window.deleteProduct = async (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await Api.delete(`/products/${id}`);
                loadProducts();
            } catch (error) {
                alert('Error deleting product');
            }
        }
    };
});

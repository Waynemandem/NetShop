document.addEventListener('DOMContentLoaded', async () => {
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const ordersList = document.getElementById('orders-list');
    const logoutBtn = document.getElementById('logout-btn');

    // Check auth
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        });
    }

    try {
        // Fetch user profile
        const userRes = await Api.get('/auth/me');
        const user = userRes.data;

        userName.textContent = user.name;
        userEmail.textContent = user.email;

        // Fetch orders
        const ordersRes = await Api.get('/orders/myorders');
        const orders = ordersRes.data;

        if (orders.length === 0) {
            ordersList.innerHTML = '<p>No orders found.</p>';
            return;
        }

        ordersList.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <span>Order ID: ${order.id.substring(0, 8)}...</span>
                    <span>${new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>Total: $${order.totalPrice}</strong>
                        <p style="font-size: 0.9rem; color: var(--text-light);">${order.orderItems.length} items</p>
                    </div>
                    <span class="order-status">${order.status}</span>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading dashboard:', error);
        if (error.message.includes('authorized')) {
            window.location.href = 'login.html';
        }
        ordersList.innerHTML = '<p style="color: red;">Failed to load orders.</p>';
    }
});

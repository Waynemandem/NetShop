// DOM Elements
const accountNav = document.querySelector('.account-nav');
const accountSections = document.querySelectorAll('.account-section');
const ordersFilter = document.querySelector('.orders-filter');
const orderList = document.querySelector('.order-list');
const wishlistGrid = document.querySelector('.wishlist-grid');
const addressesList = document.querySelector('.addresses-list');
const returnList = document.querySelector('.return-list');
const sellerOrdersTable = document.querySelector('.seller-orders-table tbody');

// Modals
const addressModal = document.getElementById('addressModal');
const returnModal = document.getElementById('returnModal');
const closeModalButtons = document.querySelectorAll('.close-modal');
const addressForm = document.getElementById('addressForm');
const returnForm = document.getElementById('returnForm');
const addAddressBtn = document.querySelector('.add-address-btn');

// Navigation
accountNav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        
        // Update URL hash
        window.location.hash = targetId;
        
        // Update active states
        accountNav.querySelectorAll('a').forEach(link => {
            link.classList.remove('active');
        });
        e.target.classList.add('active');
        
        accountSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetId) {
                section.classList.add('active');
                // Load section data
                loadSectionData(targetId);
            }
        });
    }
});

// Hash Change Handler
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1) || 'orders';
    const targetLink = accountNav.querySelector(`a[href="#${hash}"]`);
    if (targetLink) {
        targetLink.click();
    }
});

// Orders Filter
ordersFilter.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        ordersFilter.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        loadOrders(e.target.textContent.toLowerCase());
    }
});

// Modal Controls
closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        addressModal.style.display = 'none';
        returnModal.style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target === addressModal || e.target === returnModal) {
        addressModal.style.display = 'none';
        returnModal.style.display = 'none';
    }
});

// Add Address Button
if (addAddressBtn) {
    addAddressBtn.addEventListener('click', () => {
        addressModal.style.display = 'block';
        addressForm.reset();
        addressForm.dataset.mode = 'add';
    });
}

// Form Submissions
addressForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
        id: addressForm.dataset.addressId || Date.now().toString(),
        name: document.getElementById('addressName').value,
        fullName: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value,
        street: document.getElementById('street').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value,
        isDefault: document.getElementById('defaultAddress').checked
    };

    saveAddressToDb(formData).then(() => {
        addressModal.style.display = 'none';
        loadAddresses();
        toast.success('Address saved successfully');
    }).catch(error => {
        toast.error('Failed to save address');
        console.error(error);
    });
});

returnForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
        id: Date.now().toString(),
        orderId: returnForm.dataset.orderId,
        product: returnForm.dataset.product,
        reason: document.getElementById('returnReason').value,
        details: document.getElementById('returnDetails').value,
        status: 'submitted',
        date: new Date().toISOString()
    };

    saveReturnToDb(formData).then(() => {
        returnModal.style.display = 'none';
        loadReturns();
        toast.success('Return request submitted successfully');
    }).catch(error => {
        toast.error('Failed to submit return request');
        console.error(error);
    });
});

// Load Section Data
function loadSectionData(section) {
    switch (section) {
        case 'orders':
            loadOrders('all');
            break;
        case 'wishlist':
            loadWishlist();
            break;
        case 'addresses':
            loadAddresses();
            break;
        case 'returns':
            loadReturns();
            break;
        case 'seller':
            loadSellerDashboard();
            break;
    }
}

// Orders Management
async function loadOrders(filter = 'all') {
    try {
        let orders = await getOrders();
        
        if (filter !== 'all') {
            orders = orders.filter(order => order.status === filter);
        }
        
        if (orders.length === 0) {
            orderList.innerHTML = createEmptyState('No orders found', 'fas fa-box');
            return;
        }

        orderList.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <h3>Order #${order.id}</h3>
                    <span class="order-date">${formatDate(order.date)}</span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="item-details">
                                <h4>${item.name}</h4>
                                <p>Quantity: ${item.quantity}</p>
                                <p>Price: $${item.price.toFixed(2)}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="order-footer">
                    <p class="order-total">Total: $${order.total.toFixed(2)}</p>
                    <div class="order-actions">
                        <button class="track-btn" onclick="trackOrder('${order.id}')">
                            <i class="fas fa-truck"></i> Track Order
                        </button>
                        ${order.status === 'delivered' ? `
                            <button class="return-btn" onclick="initiateReturn('${order.id}')">
                                <i class="fas fa-undo"></i> Return
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        toast.error('Failed to load orders');
        console.error(error);
    }
}

// Wishlist Management
async function loadWishlist() {
    try {
        const items = await getWishlist();
        
        if (items.length === 0) {
            wishlistGrid.innerHTML = createEmptyState('Your wishlist is empty', 'fas fa-heart');
            return;
        }

        wishlistGrid.innerHTML = items.map(item => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${item.image}" alt="${item.name}">
                    <button class="remove-wishlist" onclick="removeFromWishlist('${item.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="product-info">
                    <h3>${item.name}</h3>
                    <p class="price">$${item.price.toFixed(2)}</p>
                    <button class="add-to-cart" onclick="addToCart('${item.id}')">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        toast.error('Failed to load wishlist');
        console.error(error);
    }
}

// Address Management
async function loadAddresses() {
    try {
        const addresses = await getAddresses();
        
        if (addresses.length === 0) {
            addressesList.innerHTML = createEmptyState('No addresses saved', 'fas fa-map-marker-alt');
            return;
        }

        addressesList.innerHTML = addresses.map(address => `
            <div class="address-card ${address.isDefault ? 'default' : ''}">
                ${address.isDefault ? '<span class="default-badge">Default</span>' : ''}
                <h3>${address.name}</h3>
                <p>${address.fullName}</p>
                <p>${address.street}</p>
                <p>${address.city}, ${address.state} ${address.zipCode}</p>
                <p>${address.phone}</p>
                <div class="address-actions">
                    <button class="edit-address" onclick="editAddress('${address.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    ${!address.isDefault ? `
                        <button class="make-default" onclick="makeDefaultAddress('${address.id}')">
                            Set as Default
                        </button>
                    ` : ''}
                    ${!address.isDefault ? `
                        <button class="remove-address" onclick="removeAddress('${address.id}')">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        toast.error('Failed to load addresses');
        console.error(error);
    }
}

// Returns Management
async function loadReturns() {
    try {
        const returns = await getReturns();
        
        if (returns.length === 0) {
            returnList.innerHTML = createEmptyState('No return requests', 'fas fa-undo');
            return;
        }

        returnList.innerHTML = returns.map(returnItem => `
            <div class="return-card">
                <div class="return-status-timeline">
                    <div class="status-step ${getStatusClass(returnItem.status, 'submitted')}">
                        Submitted
                    </div>
                    <div class="status-step ${getStatusClass(returnItem.status, 'approved')}">
                        Approved
                    </div>
                    <div class="status-step ${getStatusClass(returnItem.status, 'shipped')}">
                        Shipped
                    </div>
                    <div class="status-step ${getStatusClass(returnItem.status, 'received')}">
                        Received
                    </div>
                    <div class="status-step ${getStatusClass(returnItem.status, 'refunded')}">
                        Refunded
                    </div>
                </div>
                <div class="order-items">
                    <div class="order-item">
                        <img src="${returnItem.product.image}" alt="${returnItem.product.name}">
                        <div class="item-details">
                            <h4>${returnItem.product.name}</h4>
                            <p>Order #${returnItem.orderId}</p>
                            <p>Return Reason: ${returnItem.reason}</p>
                            <p>Status: ${capitalizeFirst(returnItem.status)}</p>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        toast.error('Failed to load returns');
        console.error(error);
    }
}

// Seller Dashboard
async function loadSellerDashboard() {
    try {
        const orders = await getSellerOrders();
        
        if (orders.length === 0) {
            sellerOrdersTable.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <i class="fas fa-store"></i>
                        <p>No orders yet</p>
                    </td>
                </tr>
            `;
            return;
        }

        sellerOrdersTable.innerHTML = orders.map(order => `
            <tr>
                <td>#${order.id}</td>
                <td>${order.customer.name}</td>
                <td>${formatDate(order.date)}</td>
                <td>$${order.total.toFixed(2)}</td>
                <td>
                    <select class="order-status-select" onchange="updateOrderStatus('${order.id}', this.value)">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td>
                    <button onclick="viewOrderDetails('${order.id}')" class="action-btn">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            </tr>
        `).join('');

        // Update dashboard stats
        updateSellerStats(orders);
    } catch (error) {
        toast.error('Failed to load seller dashboard');
        console.error(error);
    }
}

// Helper Functions
function createEmptyState(message, icon) {
    return `
        <div class="empty-state">
            <i class="${icon}"></i>
            <p>${message}</p>
            <button class="add-to-cart" onclick="window.location.href='shop.html'">
                Continue Shopping
            </button>
        </div>
    `;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getStatusClass(currentStatus, step) {
    const statusOrder = ['submitted', 'approved', 'shipped', 'received', 'refunded'];
    return statusOrder.indexOf(currentStatus) >= statusOrder.indexOf(step) ? 'active' : '';
}

// Update Seller Stats
function updateSellerStats(orders) {
    const stats = {
        totalSales: orders.reduce((sum, order) => sum + order.total, 0),
        totalOrders: orders.length,
        activeProducts: new Set(orders.flatMap(order => order.items.map(item => item.id))).size,
        customers: new Set(orders.map(order => order.customer.id)).size
    };

    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = 
        `$${stats.totalSales.toFixed(2)}`;
    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = 
        stats.totalOrders;
    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = 
        stats.activeProducts;
    document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = 
        stats.customers;
}

// Event Handler Functions
function editAddress(addressId) {
    getAddresses().then(addresses => {
        const address = addresses.find(addr => addr.id === addressId);
        if (address) {
            document.getElementById('addressName').value = address.name;
            document.getElementById('fullName').value = address.fullName;
            document.getElementById('phone').value = address.phone;
            document.getElementById('street').value = address.street;
            document.getElementById('city').value = address.city;
            document.getElementById('state').value = address.state;
            document.getElementById('zipCode').value = address.zipCode;
            document.getElementById('defaultAddress').checked = address.isDefault;
            
            addressForm.dataset.addressId = addressId;
            addressForm.dataset.mode = 'edit';
            addressModal.style.display = 'block';
        }
    });
}

function removeAddress(addressId) {
    if (confirm('Are you sure you want to remove this address?')) {
        const store = getStore(STORES.ADDRESSES);
        store.delete(addressId).then(() => {
            loadAddresses();
            toast.success('Address removed successfully');
        }).catch(error => {
            toast.error('Failed to remove address');
            console.error(error);
        });
    }
}

function initiateReturn(orderId) {
    getOrders().then(orders => {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            returnForm.dataset.orderId = orderId;
            returnForm.dataset.product = JSON.stringify(order.items[0]); // For simplicity, using first item
            returnModal.style.display = 'block';
        }
    });
}

function trackOrder(orderId) {
    // Implement order tracking functionality
    toast.info('Order tracking feature coming soon');
}

function viewOrderDetails(orderId) {
    // Implement order details view
    window.location.href = `order-details.html?id=${orderId}`;
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Load initial section based on hash or default to orders
    const hash = window.location.hash.substring(1) || 'orders';
    const targetLink = accountNav.querySelector(`a[href="#${hash}"]`);
    if (targetLink) {
        targetLink.click();
    }
});
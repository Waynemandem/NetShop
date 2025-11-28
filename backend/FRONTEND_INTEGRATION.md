# Frontend Integration Guide

This document explains how to integrate the NetShop frontend with the backend API.

## 📡 API Base URL

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

For production, update to your deployed backend URL.

---

## 🔐 Authentication

### Store Token

After login/register, store the JWT token:

```javascript
// After successful login
const response = await fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { data } = await response.json();
localStorage.setItem('token', data.token);
localStorage.setItem('user', JSON.stringify(data.user));
```

### Include Token in Requests

Include the token in Authorization header for all protected endpoints:

```javascript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
};

fetch(`${API_BASE_URL}/cart`, { 
  method: 'GET',
  headers 
});
```

### Create API Client Helper

```javascript
// api.js
class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = options.headers || this.getHeaders();

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API Error');
      }

      return data.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  getProfile() {
    return this.request('/auth/me');
  }

  // Product endpoints
  getProducts(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/products?${params}`);
  }

  getProduct(id) {
    return this.request(`/products/${id}`);
  }

  // Cart endpoints
  getCart() {
    return this.request('/cart');
  }

  addToCart(productId, quantity = 1) {
    return this.request('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    });
  }

  updateCartItem(productId, quantity) {
    return this.request(`/cart/items/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
  }

  removeFromCart(productId) {
    return this.request(`/cart/items/${productId}`, {
      method: 'DELETE'
    });
  }

  // Order endpoints
  createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  getOrders(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/orders?${params}`);
  }

  getOrder(id) {
    return this.request(`/orders/${id}`);
  }
}

const api = new APIClient('http://localhost:5000/api');
export default api;
```

---

## 🛒 Shopping Flow

### 1. Browse Products

```javascript
// Get products with filters
const products = await api.getProducts({
  page: 1,
  limit: 10,
  search: 'nike',
  category: 'shoes',
  sortBy: 'price',
  order: 'asc'
});

// Render products
products.data.products.forEach(product => {
  console.log(`${product.name} - ₦${product.price}`);
});
```

### 2. Add to Cart

```javascript
// Add item to cart
const cart = await api.addToCart('product_id', 2);

console.log(`Cart total: ₦${cart.totalAmount}`);
console.log(`Items: ${cart.items.length}`);
```

### 3. View Cart

```javascript
// Get current cart
const cart = await api.getCart();

cart.items.forEach(item => {
  console.log(`${item.product.name} x ${item.quantity} = ₦${item.price * item.quantity}`);
});

console.log(`Total: ₦${cart.totalAmount}`);
```

### 4. Checkout

```javascript
// Create order
const order = await api.createOrder({
  shippingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    street: '123 Main St',
    city: 'Lagos',
    state: 'Lagos',
    country: 'Nigeria',
    zipCode: '100001',
    phone: '+234-123-456-7890'
  },
  billingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    street: '123 Main St',
    city: 'Lagos',
    state: 'Lagos',
    country: 'Nigeria',
    zipCode: '100001'
  },
  paymentMethod: 'credit_card'
});

console.log(`Order created: ${order.orderNumber}`);
```

---

## 📝 Update Frontend to Use Backend

### Replace netshop_core_fixed.js with API calls

**Old (Frontend):**
```javascript
// OLD: Cart calculation done in frontend
let cartTotal = 0;
cart.forEach(item => {
  const itemTotal = item.price * item.quantity;
  cartTotal += itemTotal;
});
```

**New (Backend):**
```javascript
// NEW: Backend calculates and returns totals
const cart = await api.getCart();
const cartTotal = cart.totalAmount; // Already calculated
```

### Replace Product Search

**Old:**
```javascript
// OLD: Filter products in frontend
const results = shopProducts.filter(p =>
  p.name.toLowerCase().includes(search.toLowerCase())
);
```

**New:**
```javascript
// NEW: Server-side search
const results = await api.getProducts({ search });
```

### Replace Order Processing

**Old:**
```javascript
// OLD: Create order in frontend
const order = {
  items: cart,
  total: calculateTotal(),
  // ... other fields
};
localStorage.setItem('orders', JSON.stringify([order]));
```

**New:**
```javascript
// NEW: Server creates and stores order
const order = await api.createOrder({
  shippingAddress: {...},
  billingAddress: {...},
  paymentMethod: 'credit_card'
});
// Order is persisted in MongoDB
```

---

## 🔄 Update Existing Frontend Files

### Update home.js

```javascript
import api from './api.js';

// Get featured products from backend
async function loadFeaturedProducts() {
  try {
    const { products } = await api.getProducts({
      limit: 6,
      // TODO: Add isFeatured filter when implemented
    });
    renderProducts(products);
  } catch (error) {
    console.error('Error loading products:', error);
  }
}
```

### Update shop.js

```javascript
import api from './api.js';

// Already receives search from navbar
const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('search');

if (searchQuery) {
  // Use backend search instead of frontend filter
  const results = await api.getProducts({ search: searchQuery });
  renderProducts(results.products);
}
```

### Update cart.js

```javascript
import api from './api.js';

// Get cart from backend
async function loadCart() {
  try {
    const cart = await api.getCart();
    renderCart(cart);
  } catch (error) {
    if (error.message === 'Not authorized') {
      redirectToLogin();
    }
  }
}

// Update quantity
async function updateQty(productId, newQty) {
  await api.updateCartItem(productId, newQty);
  loadCart();
}
```

### Update checkout.js

```javascript
import api from './api.js';

// Create order from backend
async function processCheckout(formData) {
  try {
    const order = await api.createOrder({
      shippingAddress: formData.shipping,
      billingAddress: formData.billing,
      paymentMethod: formData.paymentMethod
    });

    // Redirect to success page
    window.location.href = `order-success.html?orderNumber=${order.orderNumber}`;
  } catch (error) {
    showError(error.message);
  }
}
```

---

## 📊 Error Handling

### Handle Authentication Errors

```javascript
async function makeRequest(endpoint, options) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login.html';
      return;
    }

    if (response.status === 403) {
      // User not authorized
      showError('You do not have permission for this action');
      return;
    }

    if (!response.ok) {
      throw new Error(data.message || 'API Error');
    }

    return data.data;
  } catch (error) {
    console.error('Request failed:', error);
    showError(error.message);
  }
}
```

### Validate Server Responses

```javascript
function validateProduct(product) {
  return (
    product._id &&
    product.name &&
    typeof product.price === 'number' &&
    product.price > 0
  );
}

const products = await api.getProducts();
const validProducts = products.filter(validateProduct);
```

---

## 💾 State Management

### Using localStorage

```javascript
// Store user data
function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

function clearUser() {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}

// Check if authenticated
function isAuthenticated() {
  return !!localStorage.getItem('token');
}

// Get current user
function getCurrentUser() {
  return getUser();
}
```

### Update Navbar with User Info

```javascript
import { getCurrentUser, isAuthenticated } from './auth.js';

function updateNavbarUser() {
  if (isAuthenticated()) {
    const user = getCurrentUser();
    document.getElementById('userMenu').innerHTML = `
      <span>Hello, ${user.firstName}!</span>
      <a href="#" onclick="logout()">Logout</a>
    `;
  }
}

async function logout() {
  clearUser();
  window.location.href = '/home.html';
}
```

---

## 🎨 Frontend Components Integration

### Product Card Component

```javascript
function createProductCard(product) {
  return `
    <div class="product-card">
      <img src="${product.images[0]?.url}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="brand">${product.brand}</p>
      <p class="price">₦${product.price}</p>
      ${product.averageRating ? `
        <div class="rating">
          ⭐ ${product.averageRating}/5 (${product.totalReviews} reviews)
        </div>
      ` : ''}
      <button onclick="addToCart('${product._id}')">Add to Cart</button>
    </div>
  `;
}
```

### Cart Item Component

```javascript
function createCartItem(item) {
  return `
    <div class="cart-item">
      <img src="${item.product.images[0]?.url}" alt="${item.product.name}">
      <div class="details">
        <h4>${item.product.name}</h4>
        <p>₦${item.price} x ${item.quantity}</p>
      </div>
      <input type="number" value="${item.quantity}" 
             onchange="updateQty('${item.product._id}', this.value)">
      <button onclick="removeFromCart('${item.product._id}')">Remove</button>
    </div>
  `;
}
```

---

## 🧪 Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] Products load correctly
- [ ] Search works
- [ ] Filtering works
- [ ] Sorting works
- [ ] Add to cart works
- [ ] Update quantity works
- [ ] Remove from cart works
- [ ] Checkout works
- [ ] Order created successfully
- [ ] Error messages display
- [ ] Authentication errors handled
- [ ] Token refresh works
- [ ] Logout clears data

---

## 🚀 Production Deployment

### Update API Base URL

```javascript
// development.js
export const API_BASE_URL = 'http://localhost:5000/api';

// production.js
export const API_BASE_URL = 'https://api.netshop.com/api';

// index.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### Environment Variables

Create `.env` in frontend root:
```
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_ENV=production
```

---

## 📚 Additional Resources

- **API Documentation:** See `API_DOCS.md`
- **Backend README:** See `backend/README.md`
- **Backend Summary:** See `BACKEND_SUMMARY.md`
- **Example Requests:** See `API_DOCS.md` examples section

---

## 💡 Tips

1. **Always include error handling** for API calls
2. **Validate responses** before rendering
3. **Show loading states** while fetching
4. **Handle network timeouts** gracefully
5. **Store token securely** (not in plain localStorage for sensitive data)
6. **Log errors** for debugging
7. **Test all flows** before deployment
8. **Update CORS_ORIGIN** when deploying frontend

---

**Ready to integrate!** 🎉

For questions or issues, refer to the comprehensive API_DOCS.md file.

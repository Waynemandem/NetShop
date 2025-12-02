# Frontend Integration Guide

Complete guide for connecting your NetShop frontend to the Node.js + Express + MongoDB backend.

## 📋 Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Environment Configuration](#environment-configuration)
3. [Architecture Overview](#architecture-overview)
4. [Service Layer](#service-layer)
5. [React Hooks](#react-hooks)
6. [Component Examples](#component-examples)
7. [Error Handling](#error-handling)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## 🚀 Setup Instructions

### Step 1: Create Frontend Structure

Your frontend should have the following structure (already created):

```
NetShop/
├── src/
│   ├── services/
│   │   ├── api.js              # Base API configuration
│   │   ├── authService.js      # Authentication methods
│   │   ├── productService.js   # Product methods
│   │   ├── cartService.js      # Cart methods
│   │   └── orderService.js     # Order methods
│   ├── hooks/
│   │   ├── useAuth.js          # Auth hook
│   │   ├── useProducts.js      # Products hook
│   │   ├── useCart.js          # Cart hook
│   │   └── useOrders.js        # Orders hook
│   ├── examples/
│   │   ├── ProductListComponent.jsx
│   │   ├── CartPageComponent.jsx
│   │   └── LoginComponent.jsx
│   └── INTEGRATION_GUIDE.js
├── .env.example                 # Environment template
└── .env                         # Your actual env vars
```

### Step 2: Configure Environment Variables

Create a `.env` file in your frontend root directory:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Development
VITE_API_BASE_URL=http://localhost:5000/api

# Production
# VITE_API_BASE_URL=https://your-backend-domain.com/api
```

### Step 3: Start Backend Server

Before testing frontend integration:

```bash
cd backend
npm install
npm run dev
```

Backend will run at: `http://localhost:5000`

### Step 4: Verify Frontend .env

Make sure your frontend's `.env` file has:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🔧 Environment Configuration

### Understanding VITE_API_BASE_URL

The `VITE_` prefix is required for Vite to expose environment variables to the browser at runtime.

### How It Works

1. **Development:**
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

2. **Production:**
   ```env
   VITE_API_BASE_URL=https://api.example.com/api
   ```
   - Frontend: https://example.com
   - Backend: https://api.example.com

### Verify Configuration

In your browser console:

```javascript
console.log(import.meta.env.VITE_API_BASE_URL)
// Should output: http://localhost:5000/api
```

---

## 🏗️ Architecture Overview

### Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                 React Components                        │
│  (ProductList, Cart, Checkout, etc.)                   │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│              React Hooks (Custom)                       │
│  (useAuth, useProducts, useCart, useOrders)            │
│  - Manage state (loading, error, data)                 │
│  - Expose methods to components                        │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│            Service Layer                                │
│  (authService, productService, cartService, etc.)      │
│  - Call backend APIs                                   │
│  - Handle authentication token                         │
│  - Parse responses                                     │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│              API Base Layer (api.js)                    │
│  - Centralized fetch configuration                     │
│  - Error handling                                      │
│  - Authorization header injection                      │
│  - 401 redirect handling                               │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼ HTTP/CORS
┌─────────────────────────────────────────────────────────┐
│          Backend REST API                               │
│  (Node.js + Express + MongoDB)                         │
│  - Validates requests                                  │
│  - Processes business logic                            │
│  - Returns JSON responses                              │
└─────────────────────────────────────────────────────────┘
```

### Separation of Concerns

- **Components**: UI rendering only
- **Hooks**: State management and API orchestration
- **Services**: API endpoint methods
- **API Base**: HTTP configuration and error handling

---

## 📡 Service Layer

### api.js - Base Configuration

```javascript
// Core configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper: Get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Core function: API calls
export const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    mode: 'cors', // Enable CORS
    ...options,
  });

  // Handle 401 - Redirect to login
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  // Handle errors
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
};
```

### Services Structure

Each service file exports functions for API calls:

```javascript
// authService.js
export const login = (email, password) => 
  apiPost('/auth/login', { email, password }, false);

export const register = (userData) => 
  apiPost('/auth/register', userData, false);

export const getCurrentUser = () => 
  apiGet('/auth/me', true);

// productService.js
export const getProducts = (options) => {
  // Build query string and call GET /products
};

// cartService.js
export const addToCart = (productId, quantity) => 
  apiPost('/cart', { productId, quantity }, true);

// orderService.js
export const createOrder = (orderData) => 
  apiPost('/orders', orderData, true);
```

---

## 🎣 React Hooks

### useAuth Hook

```javascript
const { user, login, register, logout, error, loading } = useAuth();

// Methods
await login(email, password);
await register(userData);
logout();
```

### useProducts Hook

```javascript
const { products, getProducts, searchProducts, error, loading } = useProducts();

// Methods with options
await getProducts({ page: 1, limit: 10, search: 'laptop' });
await searchProducts('iPhone');
```

### useCart Hook

```javascript
const { items, totals, addToCart, removeFromCart, applyCoupon } = useCart();

// Methods
await addToCart(productId, quantity);
await removeFromCart(itemId);

// Totals from backend (no calculation needed)
console.log(totals.subtotal);
console.log(totals.taxAmount);
console.log(totals.totalAmount);
```

### useOrders Hook

```javascript
const { orders, createOrder, getOrders, cancelOrder } = useOrders();

// Methods
await createOrder({ shippingAddress: '...' });
await getOrders();
await cancelOrder(orderId);
```

---

## 💻 Component Examples

### Example 1: Simple Login Form

```jsx
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      window.location.href = '/dashboard';
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Example 2: Product List with Filtering

```jsx
import { useProducts } from '../hooks/useProducts';

function ProductList() {
  const { products, getProducts, loading } = useProducts();

  useEffect(() => {
    getProducts({
      page: 1,
      limit: 20,
      sortBy: 'price',
      order: 'asc',
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.map(p => (
        <div key={p._id}>
          <h3>{p.name}</h3>
          <p>${p.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 3: Shopping Cart Display

```jsx
import { useCart } from '../hooks/useCart';

function ShoppingCart() {
  const { items, totals, removeFromCart } = useCart();

  return (
    <div>
      <h2>Cart ({items.length} items)</h2>
      
      {items.map(item => (
        <div key={item._id}>
          <p>{item.productId.name} x {item.quantity}</p>
          <button onClick={() => removeFromCart(item._id)}>
            Remove
          </button>
        </div>
      ))}

      {/* Totals calculated by backend */}
      <h3>Total: ${totals.totalAmount.toFixed(2)}</h3>
    </div>
  );
}
```

---

## ⚠️ Error Handling

### Automatic Error Handling

The API layer automatically handles:

1. **401 Unauthorized**
   - Clears localStorage
   - Redirects to /login
   
2. **Network Errors**
   - Throws error with message
   - Caught by hook state
   
3. **Backend Errors**
   - Extracts message from response
   - Returns as error message

### Manual Error Handling

```javascript
const { products, error, clearError } = useProducts();

try {
  await getProducts();
} catch (err) {
  console.error(err.message);
  // Show error to user
  alert(err.message);
}

// Clear error when done
clearError();
```

### Error Properties

```javascript
// Error object structure
{
  message: 'Product not found',
  statusCode: 404,
  data: {
    message: 'Product not found',
    error: 'NOT_FOUND'
  }
}
```

---

## ✅ Best Practices

### 1. Always Check Loading State

```javascript
if (loading) return <div>Loading...</div>;
```

### 2. Display Error Messages

```javascript
{error && <div className="error">{error}</div>}
```

### 3. Use localStorage Carefully

Token is automatically managed:

```javascript
// ✅ DON'T manually manage token
// localStorage.setItem('token', response.data.token);

// ✅ DO let services handle it
const { login } = useAuth();
await login(email, password); // Token saved automatically
```

### 4. Never Duplicate Business Logic

```javascript
// ❌ WRONG - Calculating totals in frontend
const total = items.reduce((sum, item) => {
  return sum + (item.price * item.quantity * 1.1); // Tax
}, 0);

// ✅ RIGHT - Getting totals from backend
const { totals } = useCart();
console.log(totals.totalAmount); // Already calculated
```

### 5. Use Proper Async/Await

```javascript
// ✅ Proper error handling
try {
  await productService.getProducts();
} catch (err) {
  setError(err.message);
}

// ❌ Avoid unhandled promise rejections
productService.getProducts(); // Error ignored!
```

### 6. Clean Up on Unmount

```javascript
useEffect(() => {
  getCart();
}, []);
```

---

## 🐛 Troubleshooting

### Issue: CORS Error

**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**:
- Ensure backend has CORS enabled
- Check VITE_API_BASE_URL is correct
- Verify mode: 'cors' in api.js

### Issue: 401 Unauthorized Loop

**Error**: Constantly redirected to /login

**Solution**:
- Check token is being stored: `localStorage.getItem('token')`
- Verify token is not expired
- Check backend JWT_SECRET matches

### Issue: Blank Response

**Error**: API returns 200 but no data

**Solution**:
- Check response structure matches service expectations
- Verify backend returns `{ data: {...} }` format
- Check console for parsing errors

### Issue: Token Not Sent

**Error**: Backend says "unauthorized" but user is logged in

**Solution**:
- Verify `getAuthHeaders()` is being called
- Check token key in localStorage (should be 'token')
- Ensure Authorization header format: `Bearer ${token}`

### Issue: VITE_API_BASE_URL Not Working

**Error**: `import.meta.env.VITE_API_BASE_URL` is undefined

**Solution**:
- Stop and restart dev server: `npm run dev`
- Verify .env file exists in project root
- Check variable name starts with `VITE_`
- Rebuild to load env vars

---

## 📊 Testing the Integration

### Test Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] .env file configured with VITE_API_BASE_URL
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can view products list
- [ ] Can add items to cart
- [ ] Cart totals update correctly
- [ ] Can create order
- [ ] Can view order history
- [ ] Logout clears token and redirects

### Manual Testing with cURL

```bash
# Test backend health
curl http://localhost:5000/health

# Test API endpoint
curl http://localhost:5000/api/products

# Test with auth
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/cart
```

---

## 🔐 Security Considerations

1. **Token Storage**: Stored in localStorage (suitable for SPAs)
2. **Token Expiry**: Implement refresh logic if needed
3. **HTTPS**: Always use HTTPS in production
4. **CORS**: Configure CORS_ORIGIN in backend .env
5. **Input Validation**: Backend validates all requests

---

## 📝 API Endpoints Reference

| Method | Endpoint | Auth Required | Purpose |
|--------|----------|---------------|---------|
| POST | /auth/register | No | Create account |
| POST | /auth/login | No | Login user |
| GET | /auth/me | Yes | Get profile |
| PUT | /auth/profile | Yes | Update profile |
| GET | /products | No | List products |
| POST | /cart | Yes | Add to cart |
| POST | /orders | Yes | Create order |
| GET | /orders | Yes | View orders |

See backend `API_DOCS.md` for complete list.

---

## 🎓 Next Steps

1. Review component examples in `src/examples/`
2. Test each hook individually
3. Update your existing components to use hooks
4. Remove old frontend localStorage logic
5. Deploy when ready

---

**For support**, check the backend `BACKEND_SUMMARY.md` or review the service files for usage details.

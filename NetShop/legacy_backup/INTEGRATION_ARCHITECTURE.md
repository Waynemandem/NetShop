# 🎯 Complete Integration Overview

Visual guide to your NetShop frontend-backend integration.

---

## 📊 Architecture Diagram

```
┌────────────────────────────────────────────────────────────┐
│                   REACT COMPONENTS                          │
│         (ProductList, Cart, Checkout, etc.)                │
└───────────────────────┬────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────┐
│                  REACT HOOKS (Custom)                      │
│  useAuth  │  useProducts  │  useCart  │  useOrders       │
│  • State management (user, loading, error)                 │
│  • Easy methods (login, getProducts, addToCart, etc.)     │
└───────────────────────┬────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────┐
│                  SERVICE LAYER (api.*)                     │
│  authService │ productService │ cartService │ orderService│
│  • API method wrappers (fetch calls)                       │
│  • Handle request/response format                         │
└───────────────────────┬────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────┐
│              API BASE LAYER (api.js)                       │
│  • Centralized fetch configuration                        │
│  • Authorization header injection                         │
│  • Error handling (401, 404, 500, etc.)                   │
│  • CORS support (mode: 'cors')                            │
└───────────────────────┬────────────────────────────────────┘
                        │ HTTP Requests
                        │ JSON + Bearer Token
                        ▼
┌────────────────────────────────────────────────────────────┐
│         BACKEND REST API (Node.js + Express)              │
│  /api/auth     /api/products     /api/cart     /api/orders│
│  • Validates requests                                      │
│  • Processes business logic                                │
│  • Returns JSON + HTTP status                              │
└────────────────────────────────────────────────────────────┘
```

---

## 🗂️ File Organization

```
src/
├── services/                          ← API Methods
│   ├── api.js                        ← Base configuration
│   ├── authService.js                ← User auth methods
│   ├── productService.js             ← Product methods
│   ├── cartService.js                ← Cart methods
│   └── orderService.js               ← Order methods
│
├── hooks/                             ← React State Management
│   ├── useAuth.js                    ← Auth state + methods
│   ├── useProducts.js                ← Product state + methods
│   ├── useCart.js                    ← Cart state + methods
│   └── useOrders.js                  ← Order state + methods
│
├── examples/                          ← Component Examples
│   ├── LoginComponent.jsx
│   ├── ProductListComponent.jsx
│   └── CartPageComponent.jsx
│
└── [Your existing components here]
```

---

## 🔄 Data Flow Example

### User Authentication Flow

```
1. User fills login form
              │
              ▼
2. Component calls: login(email, password)
              │
              ▼
3. Hook (useAuth) receives call
   - Sets loading: true
   - Sets error: null
              │
              ▼
4. Hook calls: authService.login()
              │
              ▼
5. Service builds request:
   POST /auth/login
   { email, password }
              │
              ▼
6. apiPost() in api.js:
   - Constructs URL
   - Adds headers
   - Makes fetch call
              │
              ▼
7. Backend receives request
   - Validates credentials
   - Generates JWT token
   - Returns response
              │
              ▼
8. Frontend receives response:
   { token, user }
              │
              ▼
9. Service stores token:
   localStorage.setItem('token', token)
              │
              ▼
10. Hook updates state:
    - Sets user: userData
    - Sets loading: false
    - Sets error: null
              │
              ▼
11. Component re-renders
    - Displays user info
    - Redirects to dashboard
```

---

## 📋 Feature Matrix

| Feature | Service | Hook | Auto? |
|---------|---------|------|-------|
| User Registration | ✅ authService | ✅ useAuth | N/A |
| User Login | ✅ authService | ✅ useAuth | ✅ (token stored) |
| User Logout | ✅ authService | ✅ useAuth | ✅ (localStorage cleared) |
| Get Profile | ✅ authService | ✅ useAuth | N/A |
| Update Profile | ✅ authService | ✅ useAuth | N/A |
| Get Products | ✅ productService | ✅ useProducts | N/A |
| Search Products | ✅ productService | ✅ useProducts | N/A |
| Filter Products | ✅ productService | ✅ useProducts | N/A |
| Get Product Detail | ✅ productService | ✅ useProducts | N/A |
| Add Review | ✅ productService | ✅ useProducts | N/A |
| Get Cart | ✅ cartService | ✅ useCart | N/A |
| Add to Cart | ✅ cartService | ✅ useCart | N/A |
| Remove from Cart | ✅ cartService | ✅ useCart | N/A |
| Clear Cart | ✅ cartService | ✅ useCart | N/A |
| Apply Coupon | ✅ cartService | ✅ useCart | N/A |
| Create Order | ✅ orderService | ✅ useOrders | N/A |
| Get Orders | ✅ orderService | ✅ useOrders | N/A |
| Get Order Detail | ✅ orderService | ✅ useOrders | N/A |
| Cancel Order | ✅ orderService | ✅ useOrders | N/A |

---

## 🔐 Authentication Flow

```
┌─ User opens app
│
├─ Check localStorage for token?
│  ├─ YES: User logged in (skip login page)
│  └─ NO: Show login page
│
├─ User enters credentials
│
├─ Call: login(email, password)
│
├─ Service sends to backend:
│  POST /api/auth/login
│  { email, password }
│
├─ Backend validates and returns:
│  { token: "JWT...", user: {...} }
│
├─ Service stores in localStorage:
│  localStorage.setItem('token', 'JWT...')
│
├─ Hook updates user state
│
├─ Component redirects to dashboard
│
├─ Subsequent requests include token:
│  Authorization: Bearer JWT...
│
└─ On 401 response:
   ├─ Clear localStorage
   └─ Redirect to login
```

---

## 🛒 Shopping Flow

```
┌─ User browses products
│
├─ Component calls: getProducts({ page: 1 })
│  ▼
│  Hook calls service
│  ▼
│  Service fetches from backend
│  ▼
│  Hook updates state: products = [...]
│  ▼
│  Component re-renders with products
│
├─ User clicks "Add to Cart"
│
├─ Component calls: addToCart(productId, qty)
│  ▼
│  Service posts to backend
│  ▼
│  Backend validates stock + adds item
│  ▼
│  Backend calculates totals
│  ▼
│  Backend returns updated cart
│  ▼
│  Hook updates cart state
│  ▼
│  Component re-renders with new cart
│
├─ User proceeds to checkout
│
├─ Component calls: createOrder(...)
│  ▼
│  Service posts to backend
│  ▼
│  Backend validates stock
│  ▼
│  Backend reduces inventory
│  ▼
│  Backend creates order
│  ▼
│  Backend clears user cart
│  ▼
│  Backend returns order details
│  ▼
│  Hook updates state
│  ▼
│  Component shows success page
│
└─ User views orders
   ▼
   Component calls: getOrders()
   ▼
   Service fetches from backend
   ▼
   Hook updates state
   ▼
   Component displays orders
```

---

## ✅ Request/Response Pattern

All API calls follow this pattern:

```
REQUEST:
─────────────────────────────────────
POST /api/auth/login
Authorization: Bearer {token}  ← Automatic
Content-Type: application/json ← Automatic
{ 
  email: "user@example.com",
  password: "pass123"
}

RESPONSE:
─────────────────────────────────────
Status: 200 OK
Content-Type: application/json
{
  success: true,
  statusCode: 200,
  message: "Login successful",
  data: {
    token: "eyJhbGc...",
    user: { ... }
  }
}

HOOK UPDATES:
─────────────────────────────────────
user = response.data.user
loading = false
error = null
token stored in localStorage
```

---

## 🧠 State Management Pattern

Each hook manages:

```javascript
// State
const [data, setData] = useState(initialValue);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// Methods
const fetchData = async (options) => {
  try {
    setLoading(true);
    setError(null);
    const response = await service.method(options);
    setData(response.data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

// Return
return {
  data,
  loading,
  error,
  fetchData,
  clearError,
};
```

---

## 🔌 Backend Integration Points

Your frontend connects to these backend endpoints:

```
Authentication (6)
├── POST /api/auth/register
├── POST /api/auth/login
├── GET /api/auth/me
├── PUT /api/auth/profile
├── PUT /api/auth/change-password
└── POST /api/auth/refresh

Products (6)
├── GET /api/products
├── GET /api/products/:id
├── POST /api/products (admin)
├── PUT /api/products/:id (admin)
├── DELETE /api/products/:id (admin)
└── POST /api/products/:id/reviews

Cart (6)
├── GET /api/cart
├── POST /api/cart
├── PUT /api/cart/:itemId
├── DELETE /api/cart/:itemId
├── DELETE /api/cart
└── POST /api/cart/coupon

Orders (7)
├── POST /api/orders
├── GET /api/orders
├── GET /api/orders/:id
├── PUT /api/orders/:id/cancel
├── PUT /api/orders/:id/status (admin)
├── PUT /api/orders/:id/payment (admin)
└── GET /api/orders/admin/all (admin)

Total: 25 endpoints
```

---

## 🎯 Component Integration Pattern

```jsx
// 1. Import hook
import { useAuth } from './hooks/useAuth';

// 2. Use in component
function MyComponent() {
  const { user, login, logout, loading, error } = useAuth();
  
  // 3. Display state
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  // 4. Call methods on user action
  const handleLogin = async () => {
    try {
      await login(email, password);
      // Success - hook handles redirect
    } catch (err) {
      // Error - already in hook state
    }
  };
  
  // 5. Render UI
  return (
    <>
      {user ? (
        <p>Welcome {user.firstName}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </>
  );
}
```

---

## 📈 Error Handling Flow

```
Backend returns error
        │
        ▼
api.js catches it
        │
        ├─ 401? → Clear localStorage → Redirect to login
        │
        ├─ Extract error message
        │
        ▼
Service throws error
        │
        ▼
Hook catches in try/catch
        │
        ├─ Sets error state
        │
        └─ Re-throws for component
        │
        ▼
Component can:
├─ Display error message
├─ Show retry button
└─ User action clears error
```

---

## 🔄 Token Management

```
LOGIN:
├─ User provides credentials
├─ Backend returns token
└─ localStorage.setItem('token', token)

STORAGE:
├─ Token persists on page refresh
└─ Token readable by getAuthHeaders()

USAGE:
├─ Every authenticated request includes token
│  Authorization: Bearer {token}
└─ Injected automatically by api.js

EXPIRATION:
├─ Backend returns 401
├─ Frontend catches 401
├─ Clears localStorage
└─ Redirects to login

LOGOUT:
└─ localStorage.removeItem('token')
```

---

## 🚀 Deployment Checklist

```
FRONTEND:
├─ Build: npm run build
├─ Update .env for production URL
└─ Deploy built files

BACKEND:
├─ Update CORS_ORIGIN in .env
├─ Set strong JWT_SECRET
├─ Configure production database
└─ Deploy

VERIFICATION:
├─ Test login/logout
├─ Test product browsing
├─ Test cart operations
├─ Test order creation
└─ Monitor for errors
```

---

## 📞 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| CORS Error | Check VITE_API_BASE_URL, backend CORS enabled |
| 401 Loop | Check token in localStorage, backend JWT_SECRET |
| No data | Check network tab, backend returning data? |
| Slow load | Check pagination, limit products |
| State not updating | Check setState in hook, component re-render |
| Token lost on refresh | localStorage should persist token |

---

## 🎓 Learning Path

1. **Understand**: Architecture diagram (above)
2. **Read**: FRONTEND_SETUP_GUIDE.md
3. **Reference**: FRONTEND_QUICK_REFERENCE.md
4. **See Examples**: src/examples/
5. **Review Code**: src/services/ & src/hooks/
6. **Implement**: Your components
7. **Test**: Verify all flows
8. **Deploy**: Go live!

---

**Integration Version**: 1.0
**Status**: ✅ COMPLETE
**Ready**: YES
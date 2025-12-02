# Frontend Integration - Quick Reference

Fast lookup for common integration tasks.

## 🔧 Quick Setup (5 minutes)

```bash
# 1. Create .env file
cp .env.example .env

# 2. Edit .env (set your backend URL)
VITE_API_BASE_URL=http://localhost:5000/api

# 3. Start dev server
npm run dev

# 4. Test in browser console
console.log(import.meta.env.VITE_API_BASE_URL)
```

## 📦 File Structure

```
src/
├── services/           # API methods
│   ├── api.js         # Base fetch config
│   ├── authService.js
│   ├── productService.js
│   ├── cartService.js
│   └── orderService.js
├── hooks/             # React hooks
│   ├── useAuth.js
│   ├── useProducts.js
│   ├── useCart.js
│   └── useOrders.js
└── examples/          # Component examples
    ├── LoginComponent.jsx
    ├── ProductListComponent.jsx
    └── CartPageComponent.jsx
```

## 💡 Common Usage Patterns

### Authentication

```javascript
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <p>Please login</p>;
  }
  
  return <p>Welcome, {user.firstName}!</p>;
}
```

### Fetch Products

```javascript
import { useProducts } from '../hooks/useProducts';

function ProductsPage() {
  const { products, getProducts, loading } = useProducts();
  
  useEffect(() => {
    getProducts({ page: 1, limit: 20 });
  }, []);
  
  if (loading) return <div>Loading...</div>;
  return products.map(p => <ProductCard key={p._id} {...p} />);
}
```

### Shopping Cart

```javascript
import { useCart } from '../hooks/useCart';

function CartPage() {
  const { items, totals, addToCart, removeFromCart } = useCart();
  
  return (
    <>
      {items.map(item => (
        <CartItem 
          key={item._id} 
          item={item}
          onRemove={() => removeFromCart(item._id)}
        />
      ))}
      <Total amount={totals.totalAmount} />
    </>
  );
}
```

### Orders

```javascript
import { useOrders } from '../hooks/useOrders';

function Orders() {
  const { orders, getOrders, createOrder } = useOrders();
  
  useEffect(() => {
    getOrders();
  }, []);
  
  return orders.map(order => <OrderCard key={order._id} {...order} />);
}
```

## 📊 Hook Reference

### useAuth()

```javascript
{
  user,              // Current user object
  loading,           // Boolean
  error,             // Error message string
  isAuthenticated,   // Boolean
  login(email, password),
  register(userData),
  getCurrentUser(),
  updateProfile(data),
  changePassword(current, newPwd),
  logout(),
  clearError(),
}
```

### useProducts()

```javascript
{
  products,          // Array of products
  currentProduct,    // Single product
  loading,           // Boolean
  error,             // Error string
  pagination,        // { total, page, limit, pages }
  getProducts(options),
  getProduct(id),
  createProduct(data),
  updateProduct(id, data),
  deleteProduct(id),
  addReview(id, review),
  searchProducts(query),
  getProductsByCategory(catId),
  getInStockProducts(),
  clearError(),
}
```

### useCart()

```javascript
{
  cart,              // Full cart object
  items,             // Array of items
  loading,           // Boolean
  error,             // Error string
  totals,            // { subtotal, tax, discount, totalAmount }
  getCart(),
  addToCart(productId, qty),
  updateCartItem(itemId, qty),
  removeFromCart(itemId),
  clearCart(),
  applyCoupon(code),
  getCartCount(),
  clearError(),
}
```

### useOrders()

```javascript
{
  orders,            // Array of orders
  currentOrder,      // Single order
  loading,           // Boolean
  error,             // Error string
  pagination,        // { total, page, limit, pages }
  getOrders(options),
  getOrder(id),
  createOrder(data),
  cancelOrder(id, reason),
  getOrdersByStatus(status),
  getAllOrders(options),
  updateOrderStatus(id, status),
  clearError(),
}
```

## 🔌 API Endpoints

### Auth
```
POST   /auth/register
POST   /auth/login
GET    /auth/me
PUT    /auth/profile
PUT    /auth/change-password
POST   /auth/refresh
```

### Products
```
GET    /products?page=1&limit=10&search=...&sortBy=price
GET    /products/:id
POST   /products (admin/seller)
PUT    /products/:id (admin/seller)
DELETE /products/:id (admin/seller)
POST   /products/:id/reviews
```

### Cart
```
GET    /cart
POST   /cart
PUT    /cart/:itemId
DELETE /cart/:itemId
DELETE /cart
POST   /cart/coupon
```

### Orders
```
POST   /orders
GET    /orders
GET    /orders/:id
PUT    /orders/:id/cancel
GET    /orders/admin/all (admin)
PUT    /orders/:id/status (admin)
PUT    /orders/:id/payment (admin)
```

## ⚡ Common Tasks

### Add Product to Cart

```javascript
const { addToCart } = useCart();

const handleAddCart = async (productId) => {
  try {
    await addToCart(productId, 1);
    alert('Added to cart!');
  } catch (err) {
    alert('Error: ' + err.message);
  }
};
```

### Search Products

```javascript
const { searchProducts } = useProducts();

const handleSearch = async (query) => {
  if (query.trim()) {
    await searchProducts(query, 20);
  }
};
```

### Checkout

```javascript
const { createOrder } = useOrders();
const { clearCart } = useCart();

const handleCheckout = async () => {
  try {
    const order = await createOrder({
      shippingAddress: '123 Main St',
    });
    await clearCart();
    window.location.href = '/order-success';
  } catch (err) {
    alert('Checkout failed: ' + err.message);
  }
};
```

### Filter Products

```javascript
const { getProducts } = useProducts();

// By category
await getProducts({ category: 'electronics' });

// By price range
await getProducts({ minPrice: 100, maxPrice: 500 });

// Sorted
await getProducts({ sortBy: 'price', order: 'asc' });

// Combined
await getProducts({
  search: 'laptop',
  minPrice: 500,
  maxPrice: 2000,
  sortBy: 'price',
  page: 1,
  limit: 20,
});
```

## 🐛 Error Handling

```javascript
try {
  await login(email, password);
} catch (err) {
  console.error('Login failed:', err.message);
  // Display to user
  setErrorMessage(err.message);
}
```

## 🔐 Authentication Flow

```
1. User clicks login
2. login() called → Backend validates → Returns token + user
3. Token stored in localStorage automatically
4. Subsequent requests include Authorization header
5. If token expires (401) → Auto redirect to /login
```

## ✅ Checklist

- [ ] .env file created with VITE_API_BASE_URL
- [ ] Backend running on http://localhost:5000
- [ ] Can import hooks in components
- [ ] Can fetch products
- [ ] Can login/logout
- [ ] Can add items to cart
- [ ] Can view cart totals
- [ ] Can place order
- [ ] Errors display properly
- [ ] 401 redirects to login

## 📚 Example Components

Full examples available in:
- `src/examples/LoginComponent.jsx`
- `src/examples/ProductListComponent.jsx`
- `src/examples/CartPageComponent.jsx`

## 🎯 Next Steps

1. Review `FRONTEND_SETUP_GUIDE.md` for detailed setup
2. Copy example components to your project
3. Replace hardcoded data with API calls
4. Remove old localStorage logic
5. Test thoroughly
6. Deploy!

---

**Need help?** Check `FRONTEND_SETUP_GUIDE.md` or review service files for details.

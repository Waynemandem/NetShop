/**
 * FRONTEND INTEGRATION SETUP GUIDE
 * 
 * This file explains how to integrate your frontend with the NetShop backend API
 */

// ============================================================================
// STEP 1: ENVIRONMENT CONFIGURATION
// ============================================================================

/**
 * Create or update your .env file in the root of your frontend project:
 * 
 * .env
 * ----
 * VITE_API_BASE_URL=http://localhost:5000/api
 * 
 * For production:
 * VITE_API_BASE_URL=https://yourdomain.com/api
 * 
 * The VITE_ prefix is required for Vite to expose env vars to the browser
 */

// ============================================================================
// STEP 2: IMPORT STATEMENTS
// ============================================================================

/**
 * In any component where you need to use the backend API:
 * 
 * // For hooks (Recommended - use these in React components)
 * import { useAuth } from './src/hooks/useAuth';
 * import { useProducts } from './src/hooks/useProducts';
 * import { useCart } from './src/hooks/useCart';
 * import { useOrders } from './src/hooks/useOrders';
 * 
 * // For direct service access (if needed outside of components)
 * import * as authService from './src/services/authService';
 * import * as productService from './src/services/productService';
 * import * as cartService from './src/services/cartService';
 * import * as orderService from './src/services/orderService';
 */

// ============================================================================
// STEP 3: EXAMPLE USAGE IN COMPONENTS
// ============================================================================

/**
 * Example 1: Product List Component with Search and Filtering
 */
const ProductListExample = () => {
  const { products, loading, error, getProducts, searchProducts } = useProducts();

  const handleLoadProducts = async () => {
    try {
      // Get products with filtering
      await getProducts({
        page: 1,
        limit: 20,
        sortBy: 'price',
        order: 'asc',
      });
    } catch (err) {
      console.error('Error loading products:', err);
    }
  };

  const handleSearch = async (query) => {
    try {
      await searchProducts(query, 10);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={handleLoadProducts}>Load Products</button>
      <input 
        type="text" 
        placeholder="Search..." 
        onChange={(e) => handleSearch(e.target.value)}
      />
      <ul>
        {products.map(product => (
          <li key={product._id}>
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * Example 2: Shopping Cart Component
 */
const ShoppingCartExample = () => {
  const { items, totals, loading, error, addToCart, removeFromCart } = useCart();

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      alert('Item added to cart!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      await removeFromCart(itemId);
      alert('Item removed from cart');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (loading) return <div>Updating cart...</div>;

  return (
    <div>
      <h2>Your Cart ({items.length} items)</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      
      {items.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          <ul>
            {items.map(item => (
              <li key={item._id}>
                <span>{item.productId.name} x {item.quantity}</span>
                <button onClick={() => handleRemoveFromCart(item._id)}>Remove</button>
              </li>
            ))}
          </ul>
          
          <div style={{borderTop: '1px solid #ccc', paddingTop: '10px'}}>
            <p>Subtotal: ${totals.subtotal.toFixed(2)}</p>
            <p>Discount: -${totals.discountAmount.toFixed(2)}</p>
            <p>Tax: ${totals.taxAmount.toFixed(2)}</p>
            <h3>Total: ${totals.totalAmount.toFixed(2)}</h3>
          </div>
        </>
      )}
    </div>
  );
};

/**
 * Example 3: Order Checkout Component
 */
const CheckoutExample = () => {
  const { createOrder, loading, error } = useOrders();
  const [shippingAddress, setShippingAddress] = useCart();

  const handleCheckout = async () => {
    try {
      const orderData = {
        shippingAddress: shippingAddress,
        paymentMethod: 'credit_card',
      };
      
      const response = await createOrder(orderData);
      alert(`Order created! Order Number: ${response.data.orderNumber}`);
      window.location.href = '/order-success';
    } catch (err) {
      alert('Checkout error: ' + err.message);
    }
  };

  if (loading) return <div>Processing order...</div>;

  return (
    <div>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <input 
        type="text" 
        placeholder="Shipping Address"
        value={shippingAddress}
        onChange={(e) => setShippingAddress(e.target.value)}
      />
      <button onClick={handleCheckout}>Place Order</button>
    </div>
  );
};

/**
 * Example 4: Login Form Component
 */
const LoginFormExample = () => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      alert('Login successful!');
      window.location.href = '/dashboard';
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  };

  if (loading) return <div>Logging in...</div>;

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <input 
        type="email" 
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input 
        type="password" 
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

/**
 * Example 5: User Profile Component
 */
const UserProfileExample = () => {
  const { user, updateProfile, loading, error } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({ firstName, lastName, phone });
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <input 
        type="text" 
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
      />
      <input 
        type="text" 
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
      />
      <input 
        type="tel" 
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone"
      />
      <button onClick={handleUpdateProfile}>Update Profile</button>
    </div>
  );
};

// ============================================================================
// STEP 4: AUTHENTICATION FLOW
// ============================================================================

/**
 * Typical authentication flow:
 * 
 * 1. User registers or logs in
 * 2. Backend returns JWT token and user data
 * 3. Token is automatically stored in localStorage
 * 4. Token is automatically included in all authenticated requests
 * 5. If token expires (401 response), user is redirected to login
 * 
 * Service files automatically handle:
 * - Reading token from localStorage
 * - Adding Authorization header
 * - Handling 401 redirects
 * - Error messages from backend
 */

// ============================================================================
// STEP 5: ERROR HANDLING
// ============================================================================

/**
 * All service methods throw errors with these properties:
 * - error.message: Human-readable error message
 * - error.statusCode: HTTP status code (if available)
 * - error.data: Full error response from backend (if available)
 * 
 * Example:
 * try {
 *   await productService.getProducts();
 * } catch (err) {
 *   console.log(err.message);        // "Product not found"
 *   console.log(err.statusCode);     // 404
 *   console.log(err.data);           // Full error object from backend
 * }
 */

// ============================================================================
// STEP 6: REMOVING OLD FRONTEND LOGIC
// ============================================================================

/**
 * Things to DELETE from your frontend code:
 * 
 * ❌ localStorage calculations for cart totals
 * ❌ Manual price calculations with tax/discount
 * ❌ Frontend-based stock checking
 * ❌ Client-side order validation
 * ❌ Hard-coded product data
 * ❌ Manual authorization checks
 * 
 * These are now handled by the backend!
 * The frontend only needs to:
 * ✅ Call service methods
 * ✅ Display data
 * ✅ Handle UI state
 */

// ============================================================================
// STEP 7: API ENDPOINTS REFERENCE
// ============================================================================

/**
 * AUTHENTICATION
 * POST   /auth/register          - Register new user
 * POST   /auth/login             - Login user
 * GET    /auth/me                - Get current user (requires token)
 * PUT    /auth/profile           - Update profile (requires token)
 * PUT    /auth/change-password   - Change password (requires token)
 * POST   /auth/refresh           - Refresh token (requires token)
 * 
 * PRODUCTS
 * GET    /products               - Get all products (with filters)
 * GET    /products/:id           - Get single product
 * POST   /products               - Create product (admin/seller only)
 * PUT    /products/:id           - Update product (admin/seller only)
 * DELETE /products/:id           - Delete product (admin/seller only)
 * POST   /products/:id/reviews   - Add review to product (requires token)
 * 
 * CART
 * GET    /cart                   - Get user's cart (requires token)
 * POST   /cart                   - Add item to cart (requires token)
 * PUT    /cart/:itemId           - Update cart item (requires token)
 * DELETE /cart/:itemId           - Remove cart item (requires token)
 * DELETE /cart                   - Clear cart (requires token)
 * POST   /cart/coupon            - Apply coupon (requires token)
 * 
 * ORDERS
 * POST   /orders                 - Create order (requires token)
 * GET    /orders                 - Get user's orders (requires token)
 * GET    /orders/:id             - Get order details (requires token)
 * PUT    /orders/:id/cancel      - Cancel order (requires token)
 * PUT    /orders/:id/status      - Update status (admin only)
 * PUT    /orders/:id/payment     - Update payment (admin only)
 * GET    /orders/admin/all       - Get all orders (admin only)
 */

export const INTEGRATION_GUIDE = 'Refer to this file for setup and usage information';

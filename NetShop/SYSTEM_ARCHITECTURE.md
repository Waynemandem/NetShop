# Shop Product System Architecture 🏗️

## System Overview Diagram

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                        SHOP PRODUCTS SYSTEM ARCHITECTURE                     ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE LAYER                                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │  Product 1  │  │  Product 2  │  │  Product 3  │  │  Product 4  │       │
│  │   Card      │  │   Card      │  │   Card      │  │   Card      │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │  Product 5  │  │  Product 6  │  │  Product 7  │  │  Product 8  │       │
│  │   Card      │  │   Card      │  │   Card      │  │   Card      │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                                              │
│  ┌────────────────────┐  ┌──────────────┐  ┌──────────────┐                │
│  │ Category Filter    │  │ Sort By      │  │ Search Bar   │                │
│  │ [All Categories]   │  │ [Price Low]  │  │ [Search...]  │                │
│  └────────────────────┘  └──────────────┘  └──────────────┘                │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌──────────────────────────────────────────────────────────────────────────────┐
│                          INTERACTION LAYER                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Events:                                                                     │
│  • Click "Add to Cart"      → addToCart(product)                            │
│  • Click "Buy Now"          → addToCart() + navigate                        │
│  • Click Card               → navigate to product detail                    │
│  • Select Category          → filterByCategory(cat)                         │
│  • Select Sort              → sortProducts(sort)                            │
│  • Search Query             → searchProducts(query)                         │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌──────────────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LOGIC LAYER                              │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────┐            │
│  │  shop.js - Main Product Controller                         │            │
│  │                                                             │            │
│  │  • renderProducts(products)   - Display cards             │            │
│  │  • handleAddToCart()           - Add item to cart         │            │
│  │  • handleBuyNow()              - Add + Navigate           │            │
│  │  • handleFilterChange()        - Apply category filter    │            │
│  │  • handleSortChange()          - Apply sorting            │            │
│  │  • handleSearch()              - Filter by search         │            │
│  │                                                             │            │
│  └─────────────────────────────────────────────────────────────┘            │
│                             ↓↓↓                                             │
│  ┌─────────────────────────────────────────────────────────────┐            │
│  │  netshop_core_fixed.js - Business Logic                   │            │
│  │                                                             │            │
│  │  ┌──────────────────────────────────────────────┐          │            │
│  │  │ ProductManager                               │          │            │
│  │  │ • getProducts()      - Fetch all products    │          │            │
│  │  │ • filterByCategory() - Filter by category    │          │            │
│  │  │ • sort()             - Sort products         │          │            │
│  │  │ • search()           - Search products       │          │            │
│  │  │ • getProductById()   - Get single product    │          │            │
│  │  └──────────────────────────────────────────────┘          │            │
│  │                                                             │            │
│  │  ┌──────────────────────────────────────────────┐          │            │
│  │  │ CartManager                                  │          │            │
│  │  │ • addItem(product)   - Add to cart           │          │            │
│  │  │ • removeItem(id)     - Remove from cart      │          │            │
│  │  │ • getCart()          - Get cart items        │          │            │
│  │  │ • updateQuantity()   - Update item qty       │          │            │
│  │  └──────────────────────────────────────────────┘          │            │
│  │                                                             │            │
│  │  ┌──────────────────────────────────────────────┐          │            │
│  │  │ ToastManager                                 │          │            │
│  │  │ • success(msg)       - Show success msg      │          │            │
│  │  │ • error(msg)         - Show error msg        │          │            │
│  │  │ • info(msg)          - Show info msg         │          │            │
│  │  └──────────────────────────────────────────────┘          │            │
│  │                                                             │            │
│  └─────────────────────────────────────────────────────────────┘            │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌──────────────────────────────────────────────────────────────────────────────┐
│                        DATA PERSISTENCE LAYER                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐ │
│  │   localStorage      │  │  IndexedDB (Images) │  │  Session Storage    │ │
│  │                     │  │                     │  │                     │ │
│  │ • shopProducts      │  │ • productImages     │  │ • tempData          │ │
│  │ • cartItems         │  │ • imageCache        │  │ • sessionCart       │ │
│  │ • userInfo          │  │ • imageTimestamps   │  │                     │ │
│  │ • wishlist          │  │                     │  │                     │ │
│  │ • orders            │  │                     │  │                     │ │
│  │                     │  │                     │  │                     │ │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘ │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER ACTION                                       │
│                                                                             │
│  Click "Add to Cart" on Product Card                                       │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                      EVENT LISTENER TRIGGERED                              │
│                                                                             │
│  cartBtn.addEventListener('click', (e) => {                                │
│    e.stopPropagation();                                                    │
│    NetShop.CartManager.addItem(product);                                   │
│  })                                                                        │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CART MANAGER PROCESSES                                 │
│                                                                             │
│  addItem(product) {                                                        │
│    1. Get existing cart from localStorage                                  │
│    2. Check if product already in cart                                     │
│    3. If yes: increment quantity                                           │
│       If no: add new item                                                  │
│    4. Save updated cart to localStorage                                    │
│    5. Update cart badge                                                    │
│    6. Show success toast                                                   │
│  }                                                                         │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DATA PERSISTED                                         │
│                                                                             │
│  localStorage['cartItems'] = [                                             │
│    { id: 1, name: "Nike Air", qty: 1, price: 120 },                       │
│    { id: 2, name: "Adidas", qty: 2, price: 140 }                          │
│  ]                                                                         │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                       UI UPDATED                                            │
│                                                                             │
│  • Cart badge shows "1"                                                    │
│  • Toast notification: "✓ Added to cart"                                   │
│  • Button ripple effect                                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Interaction Diagram

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                          PRODUCT DISPLAY FLOW                                 │
└───────────────────────────────────────────────────────────────────────────────┘

Page Load
   │
   └─→ DOMContentLoaded Event
        │
        └─→ [1] Get product-grid element
             │
             └─→ [2] Initialize ImageManager
                  │
                  └─→ [3] Load products from ProductManager
                       │
                       ├─→ Check localStorage['shopProducts']
                       │
                       └─→ If empty: Use DEFAULT_PRODUCTS
                            │
                            └─→ [4] Call renderProducts()
                                 │
                                 ├─→ For each product:
                                 │   ├─→ Create card element
                                 │   ├─→ Load/fetch image
                                 │   ├─→ Set up event listeners
                                 │   └─→ Calculate discount
                                 │
                                 └─→ Append all to grid
                                      │
                                      └─→ [5] Setup Event Listeners
                                           │
                                           ├─→ Category Filter
                                           ├─→ Sort Dropdown
                                           ├─→ Search Handler
                                           └─→ Button Handlers


┌───────────────────────────────────────────────────────────────────────────────┐
│                        PRODUCT FILTERING FLOW                                 │
└───────────────────────────────────────────────────────────────────────────────┘

User Changes Category Filter
   │
   └─→ categoryFilter.addEventListener('change')
        │
        └─→ Get selected value
             │
             └─→ ProductManager.filterByCategory(category)
                  │
                  ├─→ If category === 'all': Return all products
                  │
                  └─→ Else: Filter by p.category === category
                       │
                       └─→ Return filtered array
                            │
                            └─→ renderProducts(filtered)
                                 │
                                 └─→ Clear grid
                                      │
                                      └─→ Generate new cards
                                           │
                                           └─→ Append to grid


┌───────────────────────────────────────────────────────────────────────────────┐
│                          PRODUCT SORTING FLOW                                 │
└───────────────────────────────────────────────────────────────────────────────┘

User Changes Sort Dropdown
   │
   └─→ sortBy.addEventListener('change')
        │
        └─→ Get sort value
             │
             ├─→ If 'priceLow': Sort by price ascending
             ├─→ If 'priceHigh': Sort by price descending
             ├─→ If 'latest': Reverse order
             └─→ If 'default': Don't sort
                  │
                  └─→ renderProducts(sorted)
                       │
                       └─→ Grid updates with sorted products
```

---

## State Management Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     APPLICATION STATE FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

LOCAL STATE (Memory)
│
├─ currentFilter: 'all' | 'men' | 'women' | 'electronics' | 'accessories'
├─ currentSort: 'default' | 'priceLow' | 'priceHigh' | 'latest'
├─ displayedProducts: Product[]
├─ selectedProduct: Product | null
└─ isLoading: boolean

    ↓ (saved to)

PERSISTENT STATE (localStorage)
│
├─ shopProducts: Product[]              ← Master product list
├─ cartItems: CartItem[]                ← Shopping cart
├─ userInfo: UserObject                 ← User data
├─ wishlist: Product[]                  ← Favorited products
├─ recentlyViewed: Product[]            ← Recently viewed
└─ orders: Order[]                      ← Order history

    ↓ (accessed by)

SESSION STATE (IndexedDB - optional)
│
├─ productImages: Blob[]                ← Cached images
├─ imageCache: Map<ProductId, Blob>     ← Image storage
└─ tempData: any                        ← Temporary data


┌─────────────────────────────────────────────────────────────────────────────┐
│                    STATE TRANSITIONS                                        │
└─────────────────────────────────────────────────────────────────────────────┘

Initial State
   │
   └─→ Load products
        │
        ├─→ Render all products
        │
        └─→ Wait for user input

       ↓↓↓

Filter/Sort Selected
   │
   └─→ Apply filter/sort
        │
        ├─→ Recalculate displayedProducts
        │
        └─→ Re-render grid

       ↓↓↓

Product Added to Cart
   │
   └─→ CartManager.addItem()
        │
        ├─→ Update cartItems in localStorage
        ├─→ Update cart badge
        │
        └─→ Show notification

       ↓↓↓

Product Card Clicked
   │
   └─→ Save to selectedProduct
        │
        ├─→ Save to localStorage
        │
        └─→ Navigate to product.html
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING STRATEGY                                  │
└─────────────────────────────────────────────────────────────────────────────┘

ERROR OCCURS
   │
   ├─→ [Try-Catch] Captures error
   │   │
   │   └─→ Log to console with [Shop] prefix
   │       │
   │       └─→ Provide context (function name, error message)
   │
   ├─→ [Error Analysis] Determines error type
   │   │
   │   ├─→ If DOM element missing:
   │   │   └─→ Exit gracefully, show message in console
   │   │
   │   ├─→ If data unavailable:
   │   │   └─→ Use fallback data
   │   │
   │   ├─→ If image load fails:
   │   │   └─→ Show SVG placeholder
   │   │
   │   ├─→ If cart action fails:
   │   │   └─→ Show error toast to user
   │   │
   │   └─→ If filter/sort fails:
   │       └─→ Retry or show all products
   │
   └─→ [Recovery] Continues operation
       │
       ├─→ Show user-friendly message
       ├─→ Log technical details to console
       │
       └─→ Keep UI responsive and usable


┌─────────────────────────────────────────────────────────────────────────────┐
│                    ERROR SCENARIOS HANDLED                                  │
└─────────────────────────────────────────────────────────────────────────────┘

1. Grid element not found
   → Logged to console, exit gracefully

2. ProductManager unavailable
   → Use fallback products array

3. Image load fails
   → Show SVG placeholder image

4. Add to cart fails
   → Show error toast, log to console

5. Filter/sort fails
   → Fallback to unfiltered/unsorted

6. localStorage quota exceeded
   → Clear old data, try again, show error

7. Missing product fields
   → Use defaults (price: 0, rating: 0)

8. Null/undefined values
   → Check with ? operator, provide defaults

9. Promise rejection
   → Catch block handles, logs error

10. Event handler error
    → Try-catch wraps all handlers
```

---

## Performance Optimization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PERFORMANCE STRATEGIES                                   │
└─────────────────────────────────────────────────────────────────────────────┘

RENDERING OPTIMIZATION
│
├─ Document Fragments
│  └─→ Build cards in memory
│  └─→ Append all at once (1 reflow)
│  └─→ Not 1 reflow per card
│
├─ Lazy Loading
│  └─→ Images load="lazy"
│  └─→ Images load on demand
│  └─→ Reduces initial load
│
├─ Promise.all()
│  └─→ Parallel image processing
│  └─→ Not sequential
│  └─→ Faster total time
│
└─ CSS Grid
   └─→ Automatic layout
   └─→ No JavaScript positioning
   └─→ GPU accelerated


MEMORY OPTIMIZATION
│
├─ Minimal State
│  └─→ Only necessary data in memory
│  └─→ Products in localStorage, not duplicated
│
├─ Event Delegation
│  └─→ Single listener per event type
│  └─→ Not listener per card
│
├─ Cleanup
│  └─→ Remove old cards before re-render
│  └─→ innerHTML = "" clears all
│
└─ Efficient Filters
   └─→ Array.filter() = native
   └─→ No complex loops
   └─→ O(n) complexity


NETWORK OPTIMIZATION
│
├─ Lazy Image Loading
│  └─→ Images load on demand
│  └─→ Placeholder shown first
│
├─ Fallback SVG
│  └─→ No external CDN fallback
│  └─→ Data URL embedded
│
└─ localStorage
   └─→ No API calls
   └─→ Instant data access
   └─→ Works offline
```

---

## Browser Compatibility

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BROWSER SUPPORT MATRIX                                   │
└─────────────────────────────────────────────────────────────────────────────┘

MODERN BROWSERS (Full Support)
│
├─ Chrome 90+          ✅ All features
├─ Firefox 88+         ✅ All features
├─ Safari 14+          ✅ All features
├─ Edge 90+            ✅ All features
│
└─ Mobile Browsers
   ├─ Chrome Mobile    ✅ All features
   ├─ Safari iOS       ✅ All features
   ├─ Firefox Mobile   ✅ All features
   └─ Samsung Internet ✅ All features


REQUIRED BROWSER FEATURES
│
├─ CSS Grid            ✅ Responsive layout
├─ CSS Flexbox         ✅ Button layouts
├─ CSS Gradients       ✅ Color effects
├─ CSS Variables       ✅ Theme colors
│
├─ ES6+ JavaScript
│  ├─ const/let        ✅ Modern variables
│  ├─ Arrow functions  ✅ Callback handlers
│  ├─ Promises         ✅ Async operations
│  ├─ async/await      ✅ Promise syntax
│  └─ Template literals ✅ String building
│
├─ DOM APIs
│  ├─ querySelector    ✅ Element selection
│  ├─ addEventListener ✅ Event binding
│  ├─ createElement    ✅ Card creation
│  └─ appendChild      ✅ DOM insertion
│
├─ Web APIs
│  ├─ localStorage     ✅ Data persistence
│  ├─ IndexedDB        ✅ Image storage (optional)
│  ├─ Fetch API        ✅ If using backend
│  └─ URLSearchParams  ✅ URL parsing
│
└─ Browser Events
   ├─ DOMContentLoaded ✅ Page ready
   ├─ click            ✅ Button clicks
   ├─ change           ✅ Select changes
   └─ input            ✅ Search input


POLYFILL NEEDED (For IE11 - Not Recommended)
│
├─ Promise polyfill
├─ fetch polyfill
├─ CSS Grid fallback
│
└─ Recommendation: Use modern browsers only
   (IE11 is end-of-life)
```

---

## Database Schema (localStorage)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DATA STRUCTURE                                           │
└─────────────────────────────────────────────────────────────────────────────┘

shopProducts: [
  {
    id: string              // Unique identifier
    name: string            // Product name (required)
    brandName: string       // Brand/manufacturer
    category: string        // Category for filtering
    price: number           // Current price (required)
    oldPrice?: number       // Original price (optional)
    discount?: number       // Discount percentage (optional)
    image: string           // Image filename or URL
    rating?: number         // Star rating (1-5, default 0)
    hasImage?: boolean      // Is image in IndexedDB
    createdAt?: timestamp   // Creation date
    updatedAt?: timestamp   // Last update
  }
]

cartItems: [
  {
    id: string              // Product ID
    name: string            // Product name
    price: number           // Unit price
    quantity: number        // Number of items
    image: string           // Product image
    addedAt: timestamp      // When added to cart
  }
]

userInfo: {
  name: string
  email: string
  phone: string
  address: string
  city: string
  zipCode: string
  country: string
}

wishlist: [
  {
    id: string
    name: string
    image: string
    price: number
  }
]

recentlyViewed: [
  {
    id: string
    name: string
    viewedAt: timestamp
  }
]

orders: [
  {
    id: string
    items: CartItem[]
    total: number
    status: 'pending' | 'shipped' | 'delivered'
    createdAt: timestamp
  }
]
```

---

## API Integration Points (Future)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BACKEND API ENDPOINTS                                    │
└─────────────────────────────────────────────────────────────────────────────┘

(These are placeholders for future backend integration)

GET /api/products
  └─→ Fetch all products
  ├─ Request: none
  └─ Response: { products: Product[] }

GET /api/products?category=men
  └─→ Fetch by category
  ├─ Request: category query param
  └─ Response: { products: Product[] }

GET /api/products/:id
  └─→ Fetch single product
  ├─ Request: product ID
  └─ Response: { product: Product }

POST /api/cart/add
  └─→ Add to cart (if backend-managed)
  ├─ Request: { productId, quantity }
  └─ Response: { cart: CartItem[] }

GET /api/cart
  └─→ Get cart items
  ├─ Request: none
  └─ Response: { cart: CartItem[] }

POST /api/orders
  └─→ Create order
  ├─ Request: { items: CartItem[], userId, address }
  └─ Response: { order: Order }

GET /api/orders/:userId
  └─→ Get user orders
  ├─ Request: user ID
  └─ Response: { orders: Order[] }

POST /api/wishlist/add
  └─→ Add to wishlist
  ├─ Request: { productId }
  └─ Response: { wishlist: Product[] }
```

---

## File Dependencies

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DEPENDENCY GRAPH                                         │
└─────────────────────────────────────────────────────────────────────────────┘

shop.html
├─→ Depends On:
│   ├─ netshop.css         (styling)
│   ├─ navbar.css          (navbar styling)
│   ├─ navbar.html         (navbar component)
│   │
│   ├─ db.js               (storage initialization)
│   ├─ netshop_core_fixed.js (core managers)
│   ├─ toast.js            (notifications)
│   ├─ shop.js             (product logic)
│   ├─ navbar.js           (navbar logic)
│   │
│   ├─ FontAwesome 6.0      (icons)
│   └─ favicon              (browser icon)
│
├─ References:
│   ├─ cart.html           (navigation)
│   ├─ product.html        (product details)
│   ├─ netshop.html        (home)
│   └─ categories.html     (categories)
│
└─ Data:
    ├─ localStorage['shopProducts']
    ├─ localStorage['cartItems']
    ├─ localStorage['userInfo']
    └─ IndexedDB['productImages']


shop.js
├─→ Imports/Uses:
│   ├─ NetShop.ProductManager
│   ├─ NetShop.CartManager
│   ├─ NetShop.ToastManager
│   ├─ NetShop.Utils
│   ├─ NetShop.ImageManager
│   │
│   └─ DOM Elements:
│       ├─ #product-grid
│       ├─ #categoryFilter
│       └─ #sortBy
│
└─ Exports:
    └─ (none - IIFE pattern)


netshop_core_fixed.js
├─→ Imports/Uses:
│   ├─ localStorage
│   ├─ IndexedDB (optional)
│   └─ DOM events
│
└─ Exports:
    ├─ NetShop.ProductManager
    ├─ NetShop.CartManager
    ├─ NetShop.ToastManager
    ├─ NetShop.Utils
    ├─ NetShop.ImageManager
    └─ NetShop.SearchManager
```

---

**Last Updated:** November 2025
**Status:** ✅ Architecture Documented
**Complexity:** Low (Simple, Maintainable)
**Scalability:** Supports 100+ products, 1000+ localStorage size

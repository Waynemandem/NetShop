# Product Card Reference Guide 📋

## Visual Card Layout

```
╔═══════════════════════════════════════════════════════════════════╗
║                      PRODUCT CARD STRUCTURE                       ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  ┌─────────────────────────────────────────────────────────────┐ ║
║  │                                                             │ ║
║  │              CARD MEDIA (Image Container)                  │ ║
║  │                                                             │ ║
║  │   ┌─────────────────────────────────────────────────┐     │ ║
║  │   │                                                 │     │ ║
║  │   │   [Product Image loaded with lazy loading]     │     │ ║
║  │   │   - object-fit: contain                        │     │ ║
║  │   │   - max-height: 160px                          │     │ ║
║  │   │   - Placeholder SVG on error                   │     │ ║
║  │   │                                                 │     │ ║
║  │   └─────────────────────────────────────────────────┘     │ ║
║  │   ┌───────────────┐                                       │ ║
║  │   │ -20% OFF      │ ← Discount Badge (if available)       │ ║
║  │   │ Red gradient  │                                       │ ║
║  │   └───────────────┘                                       │ ║
║  │                                                             │ ║
║  └─────────────────────────────────────────────────────────────┘ ║
║                                                                   ║
║  ┌─────────────────────────────────────────────────────────────┐ ║
║  │                     CARD BODY (Content)                     │ ║
║  │                                                             │ ║
║  │  Nike                 ← Brand Name (gray, 12px)            │ ║
║  │                                                             │ ║
║  │  Nike Air Sneakers    ← Product Name (bold, 14px, 2 lines) │ ║
║  │  with Cushioning      (text-clamp: 2 lines max)           │ ║
║  │                                                             │ ║
║  │  ₦12,500  ₦15,000     ← Price Row                          │ ║
║  │  (red)    (strikethrough gray)                             │ ║
║  │                                                             │ ║
║  │  ⭐⭐⭐⭐☆ (4/5)      ← Star Rating (yellow stars)            │ ║
║  │                                                             │ ║
║  │  ┌──────────────────┬──────────────────┐                   │ ║
║  │  │ 🛒 Add to Cart   │ ⚡ Buy Now      │                   │ ║
║  │  │ (white outline)  │ (purple gradient)│                   │ ║
║  │  └──────────────────┴──────────────────┘                   │ ║
║  │                                                             │ ║
║  └─────────────────────────────────────────────────────────────┘ ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## Responsive Behavior

### Desktop View (>1024px)
```
┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐
│  Product   │  │  Product   │  │  Product   │  │  Product   │
│    1       │  │    2       │  │    3       │  │    4       │
└────────────┘  └────────────┘  └────────────┘  └────────────┘
┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐
│  Product   │  │  Product   │  │  Product   │  │  Product   │
│    5       │  │    6       │  │    7       │  │    8       │
└────────────┘  └────────────┘  └────────────┘  └────────────┘
```
**4 columns, 220px min-width, 20px gap**

### Tablet View (768-1024px)
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Product    │  │   Product    │  │   Product    │
│      1       │  │      2       │  │      3       │
└──────────────┘  └──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Product    │  │   Product    │  │   Product    │
│      4       │  │      5       │  │      6       │
└──────────────┘  └──────────────┘  └──────────────┘
```
**3 columns**

### Mobile View (<768px)
```
┌─────────────┐  ┌─────────────┐
│  Product 1  │  │  Product 2  │
└─────────────┘  └─────────────┘
┌─────────────┐  ┌─────────────┐
│  Product 3  │  │  Product 4  │
└─────────────┘  └─────────────┘
```
**2 columns, 15px gap**

---

## Color Scheme

### Brand Colors
| Element | Color | RGB | Hex |
|---------|-------|-----|-----|
| Primary (Buy Now) | Purple | 122, 26, 255 | #7a1aff |
| Secondary (Price) | Red | 230, 0, 0 | #e60000 |
| Discount Badge | Orange-Red | 255, 61, 0 | #ff3d00 |
| Brand Text | Gray | 102, 102, 102 | #666666 |
| Rating Stars | Gold | 255, 180, 0 | #ffb400 |

### Backgrounds
| Element | Color | RGB | Hex |
|---------|-------|-----|-----|
| Card Background | White | 255, 255, 255 | #ffffff |
| Hover Background | Light Gray | 250, 250, 250 | #fafafa |
| Border Color | Light Gray | 230, 230, 230 | #e6e6e6 |
| Text Primary | Dark Gray | 17, 17, 17 | #111111 |

---

## Typography

### Font Sizes
| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Brand Name | 12px | Regular | #666 |
| Product Name | 14px | Bold (600) | #111 |
| Price | 16px | Bold (800) | #e60000 |
| Old Price | 13px | Regular | #777 |
| Button Text | 13px | Bold (700) | Varies |
| Rating | 13px | Regular | #ffb400 |

---

## Button Specifications

### "Add to Cart" Button
- **Background:** White (#ffffff)
- **Border:** 1px solid #e6e6e6
- **Text Color:** #222222
- **Padding:** 8px 10px
- **Border Radius:** 6px
- **Icon:** Shopping cart (fa-shopping-cart)
- **Hover:** 
  - Background → #fafafa
  - Border → #ddd
  - Transform: translateY(-2px)
  - Transition: 0.3s ease

### "Buy Now" Button
- **Background:** Linear gradient (90deg, #7a1aff, #4b00ff)
- **Text Color:** White (#ffffff)
- **Padding:** 8px 10px
- **Border Radius:** 6px
- **Icon:** Lightning bolt (fa-bolt)
- **Hover:**
  - Transform: translateY(-2px)
  - Box shadow: 0 6px 16px rgba(122, 26, 255, 0.3)
  - Transition: 0.3s ease

---

## Shadow Effects

### Card Shadow (Normal)
```css
box-shadow: 0 6px 18px rgba(20, 20, 40, 0.06);
```

### Card Shadow (Hover)
```css
box-shadow: 0 18px 40px rgba(20, 20, 40, 0.12);
```

### Discount Badge Shadow
```css
box-shadow: 0 6px 18px rgba(255, 60, 60, 0.12);
```

### Buy Now Button Shadow (Hover)
```css
box-shadow: 0 6px 16px rgba(122, 26, 255, 0.3);
```

---

## Spacing

### Card Spacing
| Property | Value |
|----------|-------|
| Card Gap | 20px (desktop), 15px (mobile) |
| Card Padding | 10px |
| Grid Padding | 20px |

### Card Body Spacing
| Property | Value |
|----------|-------|
| Gap between elements | 6px |
| Padding left/right | 4px |
| Button Gap | 8px |
| Button Top Margin | 6px |

---

## Animation Effects

### Card Hover Animation
```css
transform: translateY(-6px);
transition: transform 0.14s ease, box-shadow 0.14s ease;
```

### Button Hover Animation
```css
transform: translateY(-2px);
transition: all 0.3s ease;
```

### Image Loading
```css
loading: "lazy"  /* Lazy load images for performance */
```

---

## HTML Structure

### Complete Card HTML
```html
<div class="product-card">
  <!-- CARD MEDIA (Image + Badge) -->
  <div class="card-media">
    <img src="product.jpg" alt="Nike Air Sneakers" loading="lazy">
    <div class="discount-badge">20% OFF</div>
  </div>

  <!-- CARD BODY (Content) -->
  <div class="card-body">
    <!-- Brand Name -->
    <p class="brandName">Nike</p>

    <!-- Product Name -->
    <p class="product-name">Nike Air Sneakers</p>

    <!-- Price Row -->
    <div class="price-row">
      <span class="product-price">₦12,500</span>
      <span class="old-price">₦15,000</span>
    </div>

    <!-- Rating -->
    <div class="rating">
      <i class="fa-solid fa-star"></i>
      <i class="fa-solid fa-star"></i>
      <i class="fa-solid fa-star"></i>
      <i class="fa-solid fa-star"></i>
      <i class="fa-regular fa-star"></i>
    </div>

    <!-- Buttons -->
    <div class="card-buttons">
      <button class="cart-btn">
        <i class="fas fa-shopping-cart"></i>
        Add to Cart
      </button>
      <button class="buy-btn">
        <i class="fas fa-bolt"></i>
        Buy Now
      </button>
    </div>
  </div>
</div>
```

---

## CSS Classes Reference

```css
/* Main Container */
.product-grid           /* Grid layout for all cards */

/* Card Container */
.product-card           /* Individual product card */
.product-card:hover     /* Hover state with lift effect */

/* Media Section */
.card-media             /* Image container */
.card-media img         /* Product image */
.discount-badge         /* Discount percentage badge */

/* Body Section */
.card-body              /* Main content area */
.brandName              /* Brand/manufacturer name */
.product-name           /* Product title */
.price-row              /* Container for prices */
.product-price          /* Current/sale price (red) */
.old-price              /* Original price (strikethrough) */
.rating                 /* Star rating container */
.rating i               /* Individual star icon */

/* Buttons */
.card-buttons           /* Button container */
.card-buttons .cart-btn /* Add to Cart button */
.card-buttons .buy-btn  /* Buy Now button */
.card-buttons i         /* Icons inside buttons */
```

---

## JavaScript Integration

### Product Object Example
```javascript
{
  id: "nike-air-sneakers",
  name: "Nike Air Sneakers",
  brandName: "Nike",
  category: "men",
  price: 120,
  oldPrice: 150,
  discount: 20,
  image: "nike1.jpeg",
  rating: 4
}
```

### Rendering Function
```javascript
async function renderProducts(products) {
  shopGrid.innerHTML = "";
  
  if (!products || products.length === 0) {
    shopGrid.innerHTML = '<div>No products found.</div>';
    return;
  }

  const fragment = document.createDocumentFragment();
  
  await Promise.all(products.map(async product => {
    const card = createProductCard(product);
    fragment.appendChild(card);
  }));

  shopGrid.appendChild(fragment);
}
```

### Event Handlers
```javascript
// Add to Cart
cartBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  NetShop.CartManager.addItem(product);
});

// Buy Now
buyBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  NetShop.CartManager.addItem(product);
  window.location.href = 'cart.html';
});

// View Details
card.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') return;
  NetShop.Utils.safeSet("selectedProduct", product);
  window.location.href = "product.html";
});
```

---

## Mobile Optimization

### Touch Targets
- Button minimum height: 44px (mobile friendly)
- Tap target spacing: 8px minimum gap

### Responsive Images
- Lazy loading enabled
- Max-width: 100%
- Object-fit: contain
- Fallback placeholder on error

### Text Readability
- Product name: 14px on desktop, 13px on mobile
- No text smaller than 12px
- High contrast: dark text on light background

---

## Performance Considerations

### Image Loading
- `loading="lazy"` for deferred loading
- SVG placeholder on error
- Promise.all for parallel rendering

### Memory Usage
- Document fragments reduce reflows
- No inline event listeners (delegation)
- Proper cleanup on re-renders

### Rendering Performance
- CSS Grid auto-layout
- Hardware-accelerated transforms
- Transition delays under 300ms

---

## Accessibility

### ARIA Labels
```html
<img alt="Nike Air Sneakers" loading="lazy">
<button type="button">Add to Cart</button>
```

### Keyboard Navigation
- Buttons are keyboard accessible
- Proper focus states
- Tab order logical

### Screen Reader Support
- Alt text for images
- Button labels descriptive
- Semantic HTML structure

---

## Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Mobile Safari | 14+ | ✅ Full |
| Chrome Mobile | 90+ | ✅ Full |

**Required Features:**
- CSS Grid
- CSS Flexbox
- CSS Gradients
- ES6+ JavaScript (Promise, async/await)
- LocalStorage API
- Fetch API

---

## Testing Scenarios

### Load Testing
- [ ] 6-10 products load correctly
- [ ] 50+ products load without lag
- [ ] Images load with lazy loading
- [ ] No console errors

### Interaction Testing
- [ ] Buttons clickable on desktop
- [ ] Buttons clickable on mobile
- [ ] Hover effects work
- [ ] Cards navigate to product detail

### Filter/Sort Testing
- [ ] Category filter works
- [ ] Sort by price works
- [ ] Sort newest works
- [ ] Multiple filters work together

### Responsive Testing
- [ ] Desktop layout correct (4 cols)
- [ ] Tablet layout correct (3 cols)
- [ ] Mobile layout correct (2 cols)
- [ ] Images scale properly
- [ ] Text readable on all sizes

---

## Customization Guide

### Change Card Width
```css
.product-grid {
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  /* Change 220px to your desired width */
}
```

### Change Colors
```css
:root {
  --primary-color: #7a1aff;
  --price-color: #e60000;
  --rating-color: #ffb400;
}
```

### Change Card Styling
```css
.product-card {
  border-radius: 12px;  /* Round corners more */
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);  /* Different shadow */
}
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Nov 2025 | Initial product card design and styling |
| 1.1 | Nov 2025 | Enhanced buttons with icons, improved hover effects |

---

**Last Updated:** November 2025
**Status:** ✅ Production Ready

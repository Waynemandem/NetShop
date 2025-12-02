# Shop Products Troubleshooting Guide 🔧

## Quick Diagnostic Checklist

Open your browser's Developer Tools (F12) and check:

```
✓ Check 1: Console Logs
  └─ Look for [Shop] prefix logs
  └─ Should see: "Product grid found, initializing..."
  └─ Should see: "Loaded X products from ProductManager"

✓ Check 2: No Red Errors
  └─ Red text in console = errors
  └─ Note the error message and file:line number
  └─ See "Common Errors" section below

✓ Check 3: Network Tab
  └─ All .js files loaded successfully (200 status)
  └─ CSS files loaded (no 404 errors)
  └─ Image files loading (may show 404 if missing)

✓ Check 4: Elements Inspector
  └─ Right-click product card
  └─ Select "Inspect"
  └─ Check for .product-card elements
  └─ Verify HTML structure matches reference
```

---

## Common Issues & Solutions

### ❌ Issue 1: Products Not Showing

**Symptom:** Empty grid, no products visible

**Solution Steps:**
1. Open console (F12 → Console tab)
2. Look for `[Shop]` logs
3. Check for error messages

**If you see:** `"Product grid container not found!"`
- HTML element with `id="product-grid"` is missing
- **Fix:** Add to shop.html:
  ```html
  <div class="product-grid" id="product-grid"></div>
  ```

**If you see:** `"ProductManager is not defined"`
- netshop_core_fixed.js didn't load
- **Fix:** Check that this script loads in `<head>`:
  ```html
  <script defer src="netshop_core_fixed.js"></script>
  ```

**If you see:** `"Products rendered successfully" with 0 products`
- No products in localStorage
- **Fix:**
  ```javascript
  // In browser console:
  localStorage.setItem('shopProducts', JSON.stringify([
    { brandName: "Nike", name: "Nike Air", category: "men", price: 120, image: "nike1.jpeg" }
  ]));
  // Reload page
  ```

---

### ❌ Issue 2: Images Not Loading

**Symptom:** Gray boxes instead of product images, or "No Image" placeholder

**Solution Steps:**
1. Check image filenames in code
2. Verify files exist in NetShop folder
3. Check file permissions

**Common Causes:**
- Image filename doesn't match (e.g., `Nike1.jpeg` vs `nike1.jpeg`)
- File doesn't exist in folder
- Incorrect image path

**Fix:**
```javascript
// Update in netshop_core_fixed.js DEFAULT_PRODUCTS:
{ brandName: "Nike", name: "Nike Air", image: "correct-filename.jpg" }
```

**Verify Images Exist:**
1. Open NetShop folder
2. Look for: nike1.jpeg, adidas.jpeg, puma1.jpg, etc.
3. If missing, copy images to NetShop folder

---

### ❌ Issue 3: Buttons Not Working

**Symptom:** Click "Add to Cart" but nothing happens

**Solution Steps:**
1. Open console (F12)
2. Click "Add to Cart" button
3. Check for error messages

**Common Causes:**
- NetShop.CartManager not loaded
- Toast notifications not working
- localStorage quota exceeded

**Check if loaded:**
```javascript
// In browser console:
console.log(NetShop.CartManager);  // Should show object, not undefined
console.log(localStorage);          // Should work
```

**If CartManager undefined:**
- `db.js` or `netshop_core_fixed.js` didn't load
- **Fix:** Check these are in `<head>` with `defer`:
  ```html
  <script defer src="db.js"></script>
  <script defer src="netshop_core_fixed.js"></script>
  ```

**If localStorage quota exceeded:**
```javascript
// In browser console:
// Clear old data:
localStorage.clear();
// Reload page
```

---

### ❌ Issue 4: Filter/Sort Not Working

**Symptom:** Select filter but products don't change

**Solution Steps:**
1. Open console
2. Select a filter option
3. Check for error messages

**Check:**
```javascript
// In browser console:
console.log(document.getElementById('categoryFilter'));  // Should be element
console.log(NetShop.ProductManager.filterByCategory('men'));  // Should return products
```

**If element is null:**
- Filter dropdown HTML is missing
- **Fix:** Add to shop.html:
  ```html
  <select id="categoryFilter">
    <option value="all">All Categories</option>
    <option value="men">Men</option>
  </select>
  ```

**If ProductManager missing:**
- Same as "Issue 1" above

---

### ❌ Issue 5: Mobile View Broken

**Symptom:** Products overlap or don't display correctly on phone

**Solution Steps:**
1. Open DevTools (F12)
2. Click mobile device icon (or Ctrl+Shift+M)
3. Select "iPhone 12" or "Galaxy S21"
4. Reload page

**Common Causes:**
- CSS media queries not working
- Navbar overlapping content
- Grid columns misconfigured

**Check CSS:**
```css
/* Mobile should be 2 columns */
@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

**If navbar overlapping:**
- Add to body or main:
  ```css
  main, body {
    padding-top: 50px;  /* Navbar height */
  }
  ```

---

### ❌ Issue 6: Script Errors in Console

**Symptom:** Red errors in console preventing page from loading

**Common Error Messages:**

#### Error: "Cannot read property 'addEventListener' of null"
```
→ An HTML element doesn't exist
→ Check HTML has correct ID: id="product-grid"
```

#### Error: "ImageManager is not available"
```
→ db.js didn't load
→ Check: <script defer src="db.js"></script>
```

#### Error: "fetch is not defined"
```
→ Very old browser (IE 11)
→ Need polyfill or use modern browser
```

#### Error: "localStorage is full"
```
→ Browser storage limit reached
→ Run in console: localStorage.clear()
```

---

## Verification Script

Copy this into browser console to verify everything is loaded:

```javascript
console.log('=== Shop Diagnostics ===');

// Check 1: Grid exists
const grid = document.getElementById('product-grid');
console.log('✓ Grid element:', grid ? 'FOUND' : 'MISSING');

// Check 2: NetShop loaded
console.log('✓ NetShop object:', window.NetShop ? 'LOADED' : 'MISSING');

// Check 3: ProductManager
console.log('✓ ProductManager:', NetShop?.ProductManager ? 'LOADED' : 'MISSING');

// Check 4: CartManager
console.log('✓ CartManager:', NetShop?.CartManager ? 'LOADED' : 'MISSING');

// Check 5: Products available
const products = NetShop?.ProductManager?.getProducts?.();
console.log(`✓ Products: ${products?.length || 0} found`);

// Check 6: localStorage
console.log('✓ localStorage:', localStorage ? 'AVAILABLE' : 'BLOCKED');

// Check 7: FontAwesome
const faElement = document.querySelector('[class*="fa-"]');
console.log('✓ FontAwesome:', faElement ? 'LOADED' : 'CHECK');

// Check 8: CSS loaded
const computed = getComputedStyle(document.querySelector('.product-grid') || document.body);
console.log('✓ CSS:', computed.display ? 'LOADED' : 'CHECK');

console.log('=== End Diagnostics ===');
```

**Expected Output:**
```
=== Shop Diagnostics ===
✓ Grid element: FOUND
✓ NetShop object: LOADED
✓ ProductManager: LOADED
✓ CartManager: LOADED
✓ Products: 6 found
✓ localStorage: AVAILABLE
✓ FontAwesome: LOADED
✓ CSS: LOADED
=== End Diagnostics ===
```

---

## File Checklist

Verify these files exist in NetShop folder:

```
✓ REQUIRED FILES:
  └─ shop.html              (main page)
  └─ shop.js                (product rendering logic)
  └─ netshop.css            (product card styles)
  └─ navbar.css             (navbar styles)
  └─ netshop_core_fixed.js  (core managers)
  └─ db.js                  (database/storage)
  └─ toast.js               (notifications)
  └─ navbar.js              (navbar logic)

✓ IMAGE FILES (at least one):
  └─ nike1.jpeg
  └─ adidas.jpeg
  └─ puma1.jpg
  └─ etc.

✓ DOCUMENTATION:
  └─ SHOP_PRODUCTS_FIX.md   (this fix explanation)
  └─ PRODUCT_CARD_REFERENCE.md (design reference)
```

---

## Step-by-Step Debugging

### Step 1: Check HTML
```html
<!-- Does shop.html have this? -->
<div class="product-grid" id="product-grid"></div>

<!-- Does it have these scripts? -->
<script defer src="db.js"></script>
<script defer src="netshop_core_fixed.js"></script>
<script defer src="shop.js"></script>
```

### Step 2: Check Scripts Load
```javascript
// In browser console:
console.log(NetShop);  // Should show object
console.log(NetShop.ProductManager);  // Should show object
```

### Step 3: Check Data
```javascript
// In browser console:
const products = NetShop.ProductManager.getProducts();
console.log('Products:', products);  // Should show array
```

### Step 4: Test Rendering
```javascript
// In browser console:
const grid = document.getElementById('product-grid');
console.log('Grid HTML:', grid.innerHTML);  // Should show product cards
```

### Step 5: Test Events
```javascript
// Add a test product
const testProduct = {
  name: 'Test Product',
  brandName: 'Test Brand',
  price: 100,
  category: 'men',
  image: ''
};

// Try adding to cart
NetShop.CartManager.addItem(testProduct);
// Should see "Added to cart" notification
```

---

## Performance Issues

### Symptom: Page Loads Slowly

**Check:**
1. How many products? (should be fine up to 100)
2. Are images large? (100+KB images slow loading)
3. Bandwidth issue? (check Network tab in DevTools)

**Solutions:**
- Reduce product image file sizes
- Use lazy loading (already enabled)
- Check image count in DEFAULT_PRODUCTS

### Symptom: Clicking Card is Slow

**Cause:** Image data processing taking time

**Solution:**
- Images are being processed asynchronously
- Wait a moment before clicking multiple cards
- Or disable ImageManager if not needed

---

## Testing on Different Browsers

### Chrome/Edge
- Open DevTools (F12)
- Test responsive (Ctrl+Shift+M)
- Check console for errors

### Firefox
- Open DevTools (F12)
- Check Console tab
- Test Responsive Design Mode (Ctrl+Shift+M)

### Safari
- Preferences → Advanced → Show Develop menu
- Develop → Show Web Inspector (Cmd+Option+I)
- Responsive Design Mode (Cmd+Option+R)

---

## Reset & Reload

If stuck, try complete reset:

```javascript
// In browser console:
// 1. Clear all storage
localStorage.clear();
sessionStorage.clear();

// 2. Reload page
location.reload();

// 3. Wait 5 seconds for scripts to load
// Then check console
```

---

## Getting Help

When reporting an issue, include:

1. **Error message from console** (copy exact text)
2. **Browser and version** (e.g., Chrome 120)
3. **Device type** (desktop/mobile)
4. **Steps to reproduce** (what you did before error)
5. **Screenshot of console** (F12 → Console tab)

**Example:**
```
Error: Cannot read property 'getProducts' of undefined
Browser: Chrome 120
Device: Desktop Windows 11
Steps: 1. Opened shop.html 2. Waited 3 seconds 3. Products didn't load
```

---

## Advanced Debugging

### Enable Full Console Logging
```javascript
// Add to top of shop.js temporarily:
window.DEBUG_SHOP = true;

// Then search for console.log calls with [Shop] prefix
```

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Look for:
   - Red entries = failed (404, 500, etc)
   - Yellow entries = slow (>2s)
   - Green entries = good (200 status)

### Check Memory
1. Open DevTools (F12)
2. Go to Performance tab
3. Click record
4. Interact with page (filter, sort)
5. Stop recording
6. Look for janky areas or long main thread blocks

### Check CSS
1. Open DevTools (F12)
2. Right-click product card
3. Select "Inspect"
4. Check "Styles" panel
5. Look for red X marks (failed CSS rules)

---

## Quick Fixes (Copy-Paste)

### Fix 1: Products Show "Loading..." Forever
```javascript
// In browser console:
localStorage.setItem('shopProducts', JSON.stringify([
  {
    id: "nike-air",
    brandName: "Nike",
    name: "Nike Air Sneakers",
    category: "men",
    price: 120,
    image: "nike1.jpeg",
    oldPrice: 150
  }
]));
location.reload();
```

### Fix 2: Cart Button Not Working
```javascript
// In browser console:
window.NetShop.CartManager.addItem({
  name: 'Test',
  price: 100
});
// If this works, issue is with product object
```

### Fix 3: Images Not Showing
```javascript
// In browser console:
// Check if ImageManager is causing issues
localStorage.setItem('useImageManager', 'false');
location.reload();
```

---

## Version Information

**Current Versions:**
- shop.js: v1.0 (enhanced with error handling)
- netshop_core_fixed.js: ProductManager v1.0
- netshop.css: Product cards v1.1 (icon support)

**Last Updated:** November 2025

---

## Still Having Issues?

1. ✅ Run diagnostics script above
2. ✅ Check file checklist
3. ✅ Review "Common Issues" section
4. ✅ Check browser console for [Shop] logs
5. ✅ Try complete reset (localStorage.clear())

**If still stuck:** Share the console output and error messages with the development team.

---

**Status:** ✅ Production Ready with Comprehensive Troubleshooting Guide

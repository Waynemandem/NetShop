# Reusable Navbar Component - Setup Guide

## 📋 Overview

The navbar is now a fully reusable, self-contained component that can be copied into any page. It requires minimal setup and has zero dependencies.

---

## 🚀 Quick Start

### Step 1: Copy the Navbar Markup
Copy this HTML block and paste it at the **top of your `<body>` tag**:

```html
<header class="app-navbar" role="banner">
    <div class="navbar-container">
        <a href="netshop.html" class="navbar-logo" aria-label="NetShop Home">
            <i class="fas fa-shopping-bag"></i>
            <span class="navbar-brand">NetShop</span>
        </a>

        <!-- Mobile Menu Toggle Button -->
        <button class="navbar-hamburger" aria-label="Toggle menu" aria-expanded="false" type="button">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        </button>

        <!-- Navigation Links -->
        <nav class="navbar-menu" aria-label="Main navigation">
            <ul class="navbar-list">
                <li><a href="netshop.html" class="navbar-link">Home</a></li>
                <li><a href="shop.html" class="navbar-link">Shop</a></li>
                <li><a href="categories.html" class="navbar-link">Categories</a></li>
                <li><a href="orders.html" class="navbar-link">Orders</a></li>
                <li><a href="Contact.html" class="navbar-link">Contact</a></li>
            </ul>
        </nav>

        <!-- Action Icons (Cart, Orders, Profile) -->
        <div class="navbar-actions">
            <a href="cart.html" class="navbar-action-btn navbar-action-cart" aria-label="View cart">
                <i class="fas fa-shopping-cart"></i>
                <span class="navbar-badge">0</span>
            </a>
            <a href="orders.html" class="navbar-action-btn navbar-action-orders" aria-label="View orders">
                <i class="fas fa-box"></i>
            </a>
            <button class="navbar-action-btn navbar-action-profile" aria-label="Profile menu" type="button">
                <i class="fas fa-user"></i>
            </button>
        </div>
    </div>
</header>
```

### Step 2: Include CSS & JS in `<head>`

In your HTML file's `<head>` tag, add:

```html
<link rel="stylesheet" href="navbar.css">
<script defer src="navbar.js"></script>
```

### Step 3: Done!

Your page now has a fully functional, responsive navbar. No additional code needed.

---

## 🎯 Features

✅ **Fully Responsive** — Desktop nav, tablet hamburger, mobile slide-in menu  
✅ **Copy-Paste Ready** — Works on any page without modifications  
✅ **No Dependencies** — Pure HTML/CSS/JS, auto-initializes  
✅ **Accessible** — ARIA labels, keyboard navigation (Escape key)  
✅ **Active Link Highlighting** — Auto-detects current page  
✅ **Cart Badge** — Reads/updates from localStorage  
✅ **Mobile-First** — 50px compact navbar on mobile  
✅ **Zero Conflicts** — All CSS is scoped, won't interfere with page styles  

---

## 🔧 Advanced Usage

### Programmatic Control

After the navbar loads, use the `NavbarAPI` to control it:

```javascript
// Close mobile menu
NavbarAPI.closeMobileMenu();

// Open mobile menu
NavbarAPI.openMobileMenu();

// Update cart badge
NavbarAPI.updateCartBadge(5);

// Get navbar element
const navbar = NavbarAPI.getNavbar();
```

### Update Cart Badge from Other Scripts

From any page:

```javascript
// Set cart count in localStorage
localStorage.setItem('cartCount', '3');

// Trigger navbar update
window.dispatchEvent(new Event('cartUpdated'));
// OR use the API directly:
NavbarAPI.updateCartBadge(3);
```

### Customize Navigation Links

Edit the `navbar-list` in the HTML to match your page structure:

```html
<ul class="navbar-list">
    <li><a href="netshop.html" class="navbar-link">Home</a></li>
    <li><a href="shop.html" class="navbar-link">Shop</a></li>
    <!-- Add more links as needed -->
</ul>
```

---

## 🎨 Styling Customization

All navbar colors are CSS variables in `navbar.css`. Override them in your page's CSS:

```css
:root {
    --navbar-bg: #ffffff;           /* Navbar background */
    --navbar-border: #e5e7eb;       /* Border color */
    --navbar-text: #1f2937;         /* Text color */
    --navbar-hover: #f8f9fb;        /* Hover background */
    --navbar-primary: #6a00d9;      /* Primary color (logo, hover) */
    --navbar-secondary: #ff6b35;    /* Secondary color (badge) */
    --navbar-height: 50px;          /* Navbar height */
}
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| **1024px+** | Desktop: Full horizontal nav, all action buttons visible |
| **768px - 1024px** | Tablet: Hamburger hidden, nav visible, compact spacing |
| **480px - 768px** | Mobile: Hamburger visible, nav in slide-in menu (50px height) |
| **< 480px** | Small phone: Compact everything, minimal spacing |

---

## ✅ Integration Checklist

- [ ] Navbar HTML pasted at top of `<body>` tag
- [ ] `navbar.css` linked in `<head>`
- [ ] `navbar.js` loaded with `defer` in `<head>`
- [ ] FontAwesome 6.0+ loaded before navbar
- [ ] Navigation links point to correct pages
- [ ] Cart link points to `cart.html`
- [ ] Orders link points to `orders.html`
- [ ] Test on desktop, tablet, and mobile
- [ ] Test mobile hamburger toggle
- [ ] Test active link highlighting

---

## 🐛 Troubleshooting

### Navbar styles not applying
- Ensure `navbar.css` is loaded before other stylesheets
- Check CSS file path is correct
- Clear browser cache

### Hamburger not working on mobile
- Ensure `navbar.js` is loaded after navbar HTML
- Check browser console for errors
- Verify viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`

### Links not highlighting on current page
- Verify page filenames match href attributes (e.g., `netshop.html`, `shop.html`)
- Check that href paths don't include directories for local files

### Cart badge not updating
- Ensure cart count is stored in localStorage: `localStorage.setItem('cartCount', '5')`
- Or use API: `NavbarAPI.updateCartBadge(5)`

---

## 📝 Files

| File | Purpose |
|---|---|
| `navbar.html` | Copy-paste markup snippet |
| `navbar.css` | All navbar styling (scoped, isolated) |
| `navbar.js` | Self-contained initialization & interactions |

---

## 🎉 That's it!

Your navbar is now reusable across all pages. For questions or customization needs, refer to the code comments in each file.

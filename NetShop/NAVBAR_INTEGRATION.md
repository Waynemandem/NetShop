# Reusable Navbar - Integration Guide

## 📋 Overview

The navbar component is now fully reusable and can be added to any page in your project. This guide shows you exactly how to integrate it.

---

## ✅ 3-Step Integration

### Step 1: Add Navbar HTML to Your Page

Copy this HTML block to the **top of your `<body>` tag**:

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

### Step 2: Link CSS & JS Files

In your HTML file's `<head>` tag, add:

```html
<!-- FontAwesome (required for icons) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<!-- Navbar CSS (must come before other stylesheets) -->
<link rel="stylesheet" href="navbar.css">

<!-- Your page-specific CSS -->
<link rel="stylesheet" href="yourpage.css">

<!-- Navbar JS (must have defer attribute) -->
<script defer src="navbar.js"></script>
```

### Step 3: Adjust Body Padding

Since the navbar is fixed, add padding to your body:

```html
<body style="padding-top: 50px;">
    <!-- Your content here -->
</body>
```

Or in your CSS:

```css
body {
    padding-top: 50px;
}
```

---

## 📝 Template - Copy & Paste

Here's a complete page template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Page Title - NetShop</title>
    
    <!-- FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <!-- Navbar CSS (BEFORE your page CSS) -->
    <link rel="stylesheet" href="navbar.css">
    
    <!-- Your page CSS -->
    <link rel="stylesheet" href="style.css">
    
    <!-- Navbar JS -->
    <script defer src="navbar.js"></script>
</head>
<body>
    <!-- NAVBAR (copy-paste from Step 1) -->
    <header class="app-navbar" role="banner">
        <!-- ... navbar HTML ... -->
    </header>

    <!-- YOUR PAGE CONTENT -->
    <main>
        <h1>Your Content Here</h1>
    </main>

    <!-- YOUR SCRIPTS -->
    <script src="your-script.js"></script>
</body>
</html>
```

---

## 🔍 Pages Already Updated

✅ `dashboard.html` — Uses reusable navbar  
✅ `shop-example.html` — Example of navbar on a shop page  

---

## 📄 Pages to Update (Next Steps)

Apply navbar to these pages:
- [ ] `netshop.html` — Home page
- [ ] `shop.html` — Shop page
- [ ] `categories.html` — Categories page
- [ ] `orders.html` — Orders page
- [ ] `cart.html` — Cart page
- [ ] `checkout.html` — Checkout page
- [ ] `product.html` — Product page
- [ ] `contact.html` — Contact page
- [ ] `account.html` — Account page

---

## 🎯 Key Points

1. **Order of CSS**: Always load `navbar.css` **before** your page-specific CSS
2. **FontAwesome**: Must be loaded before navbar.css for icons to work
3. **Body padding**: Add `padding-top: 50px` to prevent content from hiding under navbar
4. **File paths**: All href attributes (Home, Shop, etc.) point to the root directory
5. **Mobile first**: Navbar automatically adapts to all screen sizes

---

## ⚙️ Customization

### Change Navigation Links

Edit the `navbar-list` in your HTML:

```html
<ul class="navbar-list">
    <li><a href="page1.html" class="navbar-link">Link 1</a></li>
    <li><a href="page2.html" class="navbar-link">Link 2</a></li>
    <!-- Add or remove links as needed -->
</ul>
```

### Change Navbar Colors

Override CSS variables in your page's CSS:

```css
:root {
    --navbar-primary: #6a00d9;      /* Logo & hover color */
    --navbar-secondary: #ff6b35;    /* Badge color */
    --navbar-bg: #ffffff;           /* Background */
    --navbar-text: #1f2937;         /* Text color */
}
```

### Hide Navbar on Specific Pages

Add to your page CSS:

```css
.app-navbar {
    display: none;
}

body {
    padding-top: 0 !important;
}
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Icons not showing | Ensure FontAwesome 6.0+ is loaded in `<head>` |
| Navbar styles breaking | Check that `navbar.css` loads before other stylesheets |
| Mobile menu not working | Verify `navbar.js` has `defer` attribute |
| Content hiding under navbar | Add `padding-top: 50px` to body |
| Links not highlighting | Ensure page filename matches href (e.g., `shop.html` not `/shop/`) |
| Navbar appearing twice | Remove old navbar markup if page had one before |

---

## 📊 File Structure

```
NetShop/
├── navbar.html          ← Copy-paste markup
├── navbar.css           ← Reusable styles
├── navbar.js            ← Reusable interactions
├── NAVBAR_SETUP.md      ← Quick reference
├── dashboard.html       ✅ Already integrated
├── shop-example.html    ✅ Example page
└── [other pages]        ← Waiting for integration
```

---

## 🚀 Next: Apply to All Pages

For each page, follow these steps:

1. Open the page HTML file
2. Add navbar markup at top of `<body>`
3. Add `navbar.css` link in `<head>` (before other CSS)
4. Add `navbar.js` script in `<head>` (with defer)
5. Add `padding-top: 50px` to body
6. Test navbar functionality

---

## 💬 Need Help?

- Check `NAVBAR_SETUP.md` for detailed feature list
- Review `shop-example.html` for complete working example
- Look at `dashboard.html` for real-world integration
- Check browser console for any JavaScript errors

---

## ✨ That's It!

The navbar is now reusable across your entire site. Enjoy consistent navigation across all pages! 🎉

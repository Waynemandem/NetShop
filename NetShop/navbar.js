/**
 * ===================================
 * REUSABLE NAVBAR COMPONENT - navbar.js
 * 
 * Self-contained, zero dependencies
 * Auto-initializes on any page
 * ===================================
 */

(function initNavbar() {
    'use strict';

    // Get navbar elements
    const navbar = document.querySelector('.app-navbar');
    if (!navbar) return; // Exit if navbar not found

    const hamburger = navbar.querySelector('.navbar-hamburger');
    const menu = navbar.querySelector('.navbar-menu');
    const navLinks = navbar.querySelectorAll('.navbar-list a');
    const cartBadge = navbar.querySelector('.navbar-badge');

    // ===== HAMBURGER MENU TOGGLE =====
    if (hamburger && menu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            menu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                menu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                hamburger.classList.remove('active');
                menu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (menu.classList.contains('active') && 
                !navbar.contains(e.target)) {
                hamburger.classList.remove('active');
                menu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ===== ACTIVE LINK HIGHLIGHTING =====
    const currentPath = window.location.pathname.split('/').pop() || 'netshop.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href').split('/').pop();
        if (href === currentPath || 
            (currentPath === '' && href === 'netshop.html')) {
            link.classList.add('active');
        }
    });

    // ===== CART BADGE UPDATES =====
    function updateCartBadge() {
        if (cartBadge) {
            const cartCount = localStorage.getItem('cartCount') || '0';
            cartBadge.textContent = cartCount;
        }
    }

    // Update badge on load
    updateCartBadge();

    // Listen for custom events to update badge
    window.addEventListener('cartUpdated', updateCartBadge);

    // ===== PROFILE MENU BUTTON (OPTIONAL) =====
    const profileBtn = navbar.querySelector('.navbar-action-profile');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            // Placeholder for profile dropdown/modal
            console.log('Profile menu clicked');
            // You can add a profile dropdown here
        });
    }

    // ===== PUBLIC API =====
    // Allow other scripts to interact with navbar
    window.NavbarAPI = {
        closeMobileMenu() {
            if (hamburger) hamburger.classList.remove('active');
            if (menu) menu.classList.remove('active');
            if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
        },
        openMobileMenu() {
            if (hamburger) hamburger.classList.add('active');
            if (menu) menu.classList.add('active');
            if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
        },
        updateCartBadge(count) {
            localStorage.setItem('cartCount', count);
            updateCartBadge();
        },
        getNavbar() {
            return navbar;
        }
    };
})();

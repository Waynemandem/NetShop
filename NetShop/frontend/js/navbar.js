/**
 * ===================================
 * REUSABLE NAVBAR COMPONENT - navbar.js
 * ===================================
 */

(function initNavbar() {
    'use strict';

    const navbar = document.querySelector('.app-navbar');
    if (!navbar) return;

    const hamburger = navbar.querySelector('.navbar-hamburger');
    const menu = navbar.querySelector('.navbar-menu');
    const navLinks = navbar.querySelectorAll('.navbar-list a');
    const cartBadge = navbar.querySelector('.navbar-badge');

    // Toggle Mobile Menu
    if (hamburger && menu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            menu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
        });

        // Close when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                menu.classList.remove('active');
            });
        });
    }

    // Active Link Highlighting
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href').split('/').pop();
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Cart Badge
    function updateCartBadge() {
        if (cartBadge) {
            const cartCount = localStorage.getItem('cartCount') || '0';
            cartBadge.textContent = cartCount;
            if (cartCount === '0') {
                cartBadge.style.display = 'none';
            } else {
                cartBadge.style.display = 'flex';
            }
        }
    }

    updateCartBadge();
    window.addEventListener('cartUpdated', updateCartBadge);

    // Search
    const searchForm = navbar.querySelector('#navbarSearchForm');
    const searchInput = navbar.querySelector('#navbarSearchInput');

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
            }
        });
    }

    // Public API
    window.NavbarAPI = {
        updateCartBadge: (count) => {
            localStorage.setItem('cartCount', count);
            updateCartBadge();
        }
    };
})();

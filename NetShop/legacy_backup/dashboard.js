/**
 * Dashboard.js - Modern Dashboard Controller
 * Handles section navigation, stat animations, mobile menu, and dynamic content
 */

class Dashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.renderInitialContent();
        this.animateStats();
        this.updateDate();
    }

    setupElements() {
        // Header & Mobile Menu
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        this.mobileNav = document.querySelector('.mobile-nav');

        // Sidebar Navigation
        this.sidebarNavItems = document.querySelectorAll('.sidebar-nav-item');

        // Sections
        this.sections = document.querySelectorAll('.dashboard-section');

        // Stats
        this.statCards = document.querySelectorAll('.stat-value');

        // Footer
        this.yearDisplay = document.getElementById('yearDisplay');
    }

    setupEventListeners() {
        // Mobile Menu Toggle
        this.mobileMenuToggle?.addEventListener('click', () => this.toggleMobileMenu());

        // Close mobile menu when clicking a link
        document.querySelectorAll('.mobile-nav-list a').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Sidebar Navigation
        this.sidebarNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.switchSection(section);
            });
        });

        // Close menus on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.mobileNav?.classList.contains('active') && 
                !this.mobileNav.contains(e.target) && 
                !this.mobileMenuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Handle logout
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                window.location.href = 'login.html';
            });
        }
    }

    toggleMobileMenu() {
        this.mobileMenuToggle.classList.toggle('active');
        this.mobileNav?.classList.toggle('active');
    }

    closeMobileMenu() {
        this.mobileMenuToggle?.classList.remove('active');
        this.mobileNav?.classList.remove('active');
    }

    switchSection(sectionId) {
        // Update active section
        this.sections.forEach(sec => sec.classList.remove('active'));
        document.getElementById(sectionId)?.classList.add('active');

        // Update sidebar nav
        this.sidebarNavItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === sectionId) {
                item.classList.add('active');
            }
        });

        this.currentSection = sectionId;

        // Re-animate stats if switching back to dashboard
        if (sectionId === 'dashboard') {
            setTimeout(() => this.animateStats(), 100);
        }
    }

    renderInitialContent() {
        // Set current year in footer
        this.yearDisplay.textContent = new Date().getFullYear();

        // Set user name
        const userName = document.getElementById('userName');
        if (userName) {
            userName.textContent = 'John';
        }

        // Update profile info if user is logged in
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            const userName = document.querySelector('.user-name');
            const userEmail = document.querySelector('.user-email');
            if (userName) userName.textContent = userData.name || 'User Name';
            if (userEmail) userEmail.textContent = userData.email || 'user@email.com';
            if (document.getElementById('userName')) {
                document.getElementById('userName').textContent = (userData.name || 'User').split(' ')[0];
            }
        }
    }

    animateStats() {
        this.statCards.forEach(card => {
            const targetValue = parseInt(card.dataset.value) || 0;
            const isPrice = card.parentElement.querySelector('.stat-label')?.textContent.includes('Spent');
            const isCurrency = isPrice || card.textContent.includes('₦');

            this.countUpAnimation(card, targetValue, isCurrency);
        });
    }

    countUpAnimation(element, endValue, isCurrency = false) {
        const duration = 1000; // 1 second
        const start = Date.now();
        const startValue = 0;

        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - start) / duration, 1);
            const currentValue = Math.floor(startValue + (endValue - startValue) * progress);

            if (isCurrency) {
                element.textContent = '₦' + currentValue.toLocaleString('en-NG');
            } else {
                element.textContent = currentValue.toLocaleString('en-NG');
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    updateDate() {
        const dateElement = document.getElementById('currentDate');
        if (dateElement) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const today = new Date().toLocaleDateString('en-US', options);
            dateElement.textContent = today;
        }
    }
}

// Initialize Dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();

    // Smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
            }
        });
    });
});
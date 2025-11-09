// Load the common header
document.addEventListener('DOMContentLoaded', function() {
    // Load header from netshop.js
    if (typeof loadHeader === 'function') {
        loadHeader();
    }

    // Mobile sidebar functionality
    const sidebar = document.querySelector('.dashboard-sidebar');
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'toggle-sidebar';
    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.appendChild(toggleBtn);

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('show');
        // Update toggle button icon
        const icon = toggleBtn.querySelector('i');
        if (sidebar.classList.contains('show')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target) && sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
            toggleBtn.querySelector('i').className = 'fas fa-bars';
        }
    });

    // Update profile info if user is logged in
    const userProfile = document.querySelector('.profile-info');
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userProfile) {
        userProfile.querySelector('h3').textContent = userData.name || 'User Name';
        userProfile.querySelector('p').textContent = userData.email || 'user@email.com';
    }

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

    // Active link highlighting
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-item');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop()) {
            link.classList.add('active');
        }
    });
});

// Update dashboard stats
function updateDashboardStats() {
    // This function can be expanded based on your needs
    const orderCount = localStorage.getItem('orderCount') || 0;
    const wishlistCount = localStorage.getItem('wishlistCount') || 0;
    
    // Update stats if elements exist
    const statsElements = {
        'total-orders': orderCount,
        'wishlist-items': wishlistCount
    };

    for (const [id, value] of Object.entries(statsElements)) {
        const element = document.querySelector(`#${id}`);
        if (element) {
            element.textContent = value;
        }
    }
}

// Call stats update when page loads
updateDashboardStats();
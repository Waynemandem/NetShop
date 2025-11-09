// Countdown Timer
function updateCountdown() {
    const now = new Date();
    const endTime = new Date();
    endTime.setHours(23, 59, 59); // End of day

    const diff = endTime - now;
    if (diff <= 0) {
        // Reset to 24 hours if past midnight
        endTime.setDate(endTime.getDate() + 1);
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Update all countdown displays
    document.querySelectorAll('.countdown .hours').forEach(el => el.textContent = String(hours).padStart(2, '0'));
    document.querySelectorAll('.countdown .minutes').forEach(el => el.textContent = String(minutes).padStart(2, '0'));
    document.querySelectorAll('.countdown .seconds').forEach(el => el.textContent = String(seconds).padStart(2, '0'));
    
    document.querySelectorAll('.countdown .time').forEach(el => {
        el.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    });
}

// Recently Viewed Products
function addToRecentlyViewed(product) {
    if (!product) return;
    
    let recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    
    // Remove if already exists
    recent = recent.filter(p => p.id !== product.id);
    
    // Add to front
    recent.unshift(product);
    
    // Keep only last 6
    recent = recent.slice(0, 6);
    
    localStorage.setItem('recentlyViewed', JSON.stringify(recent));
    renderRecentlyViewed();
}

async function renderRecentlyViewed() {
    const container = document.getElementById('recent-products');
    if (!container) return;

    const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    if (recent.length === 0) {
        container.closest('.recently-viewed').style.display = 'none';
        return;
    }

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();

    for (const product of recent) {
        const card = document.createElement('div');
        card.className = 'product-card mini';
        
        let imageData = product.image || '';
        if (product.hasImage && window.ImageDB) {
            try {
                imageData = await ImageDB.getImage(product.id) || product.image || '';
            } catch (err) {
                console.warn('Failed to load image for recent product:', err);
            }
        }

        card.innerHTML = `
            <div class="card-media">
                <img src="${imageData}" alt="${product.name}">
            </div>
            <div class="card-body">
                <p class="product-name">${product.name}</p>
                <span class="product-price">₦${Number(product.price).toLocaleString()}</span>
            </div>
        `;

        card.addEventListener('click', () => {
            localStorage.setItem('selectedProduct', JSON.stringify(product));
            window.location.href = 'product.html';
        });

        fragment.appendChild(card);
    }

    container.appendChild(fragment);
    container.closest('.recently-viewed').style.display = 'block';
}

// Help Center Dropdown
document.addEventListener('DOMContentLoaded', () => {
    const helpBtn = document.getElementById('help-btn');
    const helpDropdown = document.getElementById('help-dropdown');
    const closeHelp = document.querySelector('.close-help');

    if (helpBtn && helpDropdown) {
        helpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            helpDropdown.classList.toggle('show');
        });
    }

    if (closeHelp) {
        closeHelp.addEventListener('click', () => {
            helpDropdown.classList.remove('show');
        });
    }

    // Close help dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (helpDropdown?.classList.contains('show') && 
            !helpDropdown.contains(e.target) && 
            !helpBtn?.contains(e.target)) {
            helpDropdown.classList.remove('show');
        }
    });

    // Newsletter Form
    const subscribeForm = document.querySelector('.subscribe-form');
    subscribeForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        if (email) {
            if (typeof showToast === 'function') {
                showToast('Thank you for subscribing! 📧', 'success');
            } else {
                alert('Thank you for subscribing!');
            }
            e.target.reset();
        }
    });

    // Start countdown timer
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Initialize recently viewed
    renderRecentlyViewed();
});

// Track product views for recently viewed section
if (window.location.pathname.includes('product.html')) {
    const product = JSON.parse(localStorage.getItem('selectedProduct') || 'null');
    if (product) {
        addToRecentlyViewed(product);
    }
}
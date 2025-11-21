// orders.js - FIXED VERSION
// Properly displays order history with view and download buttons

document.addEventListener('DOMContentLoaded', () => {
  console.log('[Orders] Page loaded');
    
  // Safe parse helper
  const safeParse = (k, fallback = null) => {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : fallback;
    } catch(e) {
      console.error('[Orders] Parse error:', e);
      return fallback;
    }
  };

  // Get orders
  const orders = safeParse('orders', []) || [];
  console.log('[Orders] Found', orders.length, 'orders');

  const container = document.getElementById('orders-list');
  if (!container) {
    console.error('[Orders] Container #orders-list not found');
    return;
  }

  container.innerHTML = '';

  // Empty state
  if (!orders || orders.length === 0) {
    container.innerHTML = `
      <div class="orders-empty">
        <i class="fas fa-box-open"></i>
        <h3>No Orders Yet</h3>
        <p>You haven't placed any orders. Start shopping now!</p>
        <a href="shop.html" class="continue-btn">
          <i class="fas fa-shopping-bag"></i>
          Go to Shop
        </a>
      </div>
    `;
    return;
  }

  // Create orders list
  const list = document.createElement('div');
  list.className = 'orders-list';

  // Sort orders: newest first
  const sortedOrders = [...orders].reverse();

  sortedOrders.forEach(order => {
    const card = document.createElement('div');
    card.className = 'order-card';

    // Format date
    let dateStr = 'Unknown date';
    try {
      dateStr = new Date(order.createdAt).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch(e) {
      console.warn('[Orders] Date parse error:', e);
    }

    // Format status
    const status = order.status || 'pending';
    const statusClass = `order-status ${status}`;
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);

    // Calculate total
    const total = Number(order.total) || 0;
    const itemCount = (order.items || []).length;

    // Build card HTML
    card.innerHTML = `
      <div class="order-header">
        <div class="order-id">
          <i class="fas fa-receipt"></i>
          <strong>${order.id}</strong>
        </div>
        <span class="${statusClass}">${statusText}</span>
      </div>
      
      <div class="order-body">
        <div class="order-info">
          <p>
            <i class="far fa-calendar"></i>
            <span>${dateStr}</span>
          </p>
          <p>
            <i class="fas fa-box"></i>
            <span>${itemCount} item${itemCount !== 1 ? 's' : ''}</span>
          </p>
          <p class="order-total">
            <i class="fas fa-money-bill-wave"></i>
            <strong>₦${total.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</strong>
          </p>
        </div>
        
        <div class="order-items-preview">
          ${(order.items || []).slice(0, 3).map(item => `
            <img src="${item.image || 'placeholder.jpg'}" 
                 alt="${item.name}" 
                 title="${item.name}"
                 class="order-item-thumb">
          `).join('')}
          ${itemCount > 3 ? `<span class="more-items">+${itemCount - 3} more</span>` : ''}
        </div>
      </div>
      
      <div class="order-footer">
        <button class="order-btn view-btn" data-order-id="${order.id}">
          <i class="fas fa-eye"></i>
          View Details
        </button>
        <button class="order-btn download-btn" data-order-id="${order.id}">
          <i class="fas fa-download"></i>
          Download Receipt
        </button>
      </div>
    `;

    list.appendChild(card);
  });

  container.appendChild(list);

  // ═══════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ═══════════════════════════════════════════════════════════════

  // View button
  container.addEventListener('click', (e) => {
    const viewBtn = e.target.closest('.view-btn');
    if (viewBtn) {
      const orderId = viewBtn.dataset.orderId;
      console.log('[Orders] View order:', orderId);
      window.location.href = `order-success.html?orderId=${encodeURIComponent(orderId)}`;
      return;
    }

    // Download button
    const downloadBtn = e.target.closest('.download-btn');
    if (downloadBtn) {
      const orderId = downloadBtn.dataset.orderId;
      console.log('[Orders] Download receipt:', orderId);
      
      // Open order success page in new tab (where download is handled)
      window.open(`order-success.html?orderId=${encodeURIComponent(orderId)}`, '_blank');
      
      if (window.toast) {
        window.toast.info('Opening receipt page...');
      }
      return;
    }
  });

  console.log('[Orders] Rendered', sortedOrders.length, 'orders');
});

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════

const style = document.createElement('style');
style.textContent = `
  .orders-page {
    max-width: 1200px;
    margin: 40px auto;
    padding: 0 20px;
  }
  
  .orders-empty {
    text-align: center;
    padding: 80px 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  
  .orders-empty i {
    font-size: 5rem;
    color: #ddd;
    margin-bottom: 20px;
  }
  
  .orders-empty h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: #333;
  }
  
  .orders-empty p {
    color: #666;
    margin-bottom: 30px;
  }
  
  .continue-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #a4161a;
    color: white;
    padding: 12px 30px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s;
  }
  
  .continue-btn:hover {
    background: #7a0f13;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(164, 22, 26, 0.3);
  }
  
  .orders-list {
    display: grid;
    gap: 20px;
  }
  
  .order-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    overflow: hidden;
    transition: all 0.3s;
  }
  
  .order-card:hover {
    box-shadow: 0 6px 20px rgba(0,0,0,0.12);
    transform: translateY(-2px);
  }
  
  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: #f8f9fa;
    border-bottom: 1px solid #eee;
  }
  
  .order-id {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.1rem;
    color: #333;
  }
  
  .order-id i {
    color: #a4161a;
  }
  
  .order-status {
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: capitalize;
  }
  
  .order-status.pending {
    background: #fff3cd;
    color: #856404;
  }
  
  .order-status.processing {
    background: #cce5ff;
    color: #004085;
  }
  
  .order-status.confirmed {
    background: #d4edda;
    color: #155724;
  }
  
  .order-status.shipped {
    background: #d1ecf1;
    color: #0c5460;
  }
  
  .order-status.delivered {
    background: #d4edda;
    color: #155724;
  }
  
  .order-status.cancelled {
    background: #f8d7da;
    color: #721c24;
  }
  
  .order-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    gap: 20px;
    flex-wrap: wrap;
  }
  
  .order-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .order-info p {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
    color: #666;
    font-size: 0.95rem;
  }
  
  .order-info i {
    width: 20px;
    text-align: center;
    color: #999;
  }
  
  .order-total {
    color: #a4161a !important;
    font-size: 1.1rem !important;
  }
  
  .order-items-preview {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  
  .order-item-thumb {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 6px;
    border: 2px solid #f0f0f0;
  }
  
  .more-items {
    background: #f0f0f0;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 0.85rem;
    color: #666;
  }
  
  .order-footer {
    display: flex;
    gap: 10px;
    padding: 15px 20px;
    background: #fafafa;
    border-top: 1px solid #eee;
  }
  
  .order-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .view-btn {
    background: #a4161a;
    color: white;
  }
  
  .view-btn:hover {
    background: #7a0f13;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(164, 22, 26, 0.3);
  }
  
  .download-btn {
    background: white;
    color: #a4161a;
    border: 2px solid #a4161a;
  }
  
  .download-btn:hover {
    background: #a4161a;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(164, 22, 26, 0.2);
  }
  
  @media (max-width: 768px) {
    .order-body {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .order-footer {
      flex-direction: column;
    }
    
    .order-btn {
      width: 100%;
    }
    
    .order-items-preview {
      width: 100%;
      justify-content: flex-start;
    }
  }
`;
document.head.appendChild(style);
// order-success.js - FIXED VERSION
// Properly loads order details and enables PDF download

document.addEventListener('DOMContentLoaded', () => {
  console.log('[OrderSuccess] Page loaded');

  // Get order ID from URL
  const qs = new URLSearchParams(window.location.search);
  const orderId = qs.get('orderId');
  
  console.log('[OrderSuccess] Order ID:', orderId);

  // Safe parse helper
  const safeParse = (k, fallback = null) => {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : fallback;
    } catch(e) {
      console.error('[OrderSuccess] Parse error:', e);
      return fallback;
    }
  };

  // Get all orders
  const orders = safeParse('orders', []) || [];
  console.log('[OrderSuccess] Total orders found:', orders.length);

  // Find the order
  let order = null;
  if (orderId) {
    order = orders.find(o => o.id === orderId);
  }
  
  // If not found, use most recent order
  if (!order && orders.length > 0) {
    order = orders[orders.length - 1];
    console.log('[OrderSuccess] Using most recent order');
  }

  // DOM elements
  const idEl = document.getElementById('order-id');
  const statusEl = document.getElementById('order-status');
  const summaryEl = document.getElementById('order-summary');
  const downloadBtn = document.getElementById('download-receipt');

  // Format price helper
  function formatPrice(n) {
    const num = Number(n) || 0;
    try {
      return num.toLocaleString('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } catch(e) {
      return num.toFixed(2);
    }
  }

  // If no order found
  if (!order) {
    console.warn('[OrderSuccess] No order found');
    if (idEl) idEl.textContent = 'Order: Not found';
    if (statusEl) statusEl.textContent = 'Status: —';
    if (summaryEl) {
      summaryEl.innerHTML = `
        <div class="checkout-empty">
          <i class="fas fa-box-open"></i>
          <h3>No Order Found</h3>
          <p>We couldn't find your order. Please check your order history.</p>
          <a href="orders.html" class="continue-btn">View Orders</a>
        </div>
      `;
    }
    if (downloadBtn) downloadBtn.disabled = true;
    return;
  }

  console.log('[OrderSuccess] Order found:', order);

  // Display order info
  if (idEl) idEl.textContent = `Order: ${order.id}`;
  if (statusEl) {
    const status = order.status || 'confirmed';
    statusEl.textContent = `Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`;
    statusEl.className = `order-status ${status}`;
  }

  // Calculate totals
  let subtotal = 0;
  const items = order.items || [];
  
  items.forEach(item => {
    const qty = Number(item.quantity) || 1;
    const price = Number(item.price) || 0;
    subtotal += price * qty;
  });

  const deliveryFee = Number(order.deliveryFee) || 1200;
  const total = Number(order.total) || (subtotal + deliveryFee);

  // Render order items
  if (summaryEl) {
    const list = document.createElement('div');
    list.className = 'order-success-list';

    if (items.length === 0) {
      list.innerHTML = '<p style="text-align:center; padding:20px;">No items in this order.</p>';
    } else {
      items.forEach(item => {
        const qty = Number(item.quantity) || 1;
        const price = Number(item.price) || 0;
        const lineTotal = price * qty;

        const row = document.createElement('div');
        row.className = 'os-item';
        row.innerHTML = `
          <div class="os-left">
            <img src="${item.image || 'placeholder.jpg'}" alt="${item.name || ''}" width="64" height="64">
          </div>
          <div class="os-right">
            <div class="os-name">
              ${item.name || 'Product'} 
              <span class="os-qty">× ${qty}</span>
            </div>
            <div class="os-price">₦${formatPrice(lineTotal)}</div>
          </div>
        `;
        list.appendChild(row);
      });
    }

    // Footer with totals
    const footer = document.createElement('div');
    footer.className = 'os-footer';
    footer.innerHTML = `
      <div class="os-breakdown">
        <p><span>Subtotal:</span> <span>₦${formatPrice(subtotal)}</span></p>
        <p><span>Delivery Fee:</span> <span>₦${formatPrice(deliveryFee)}</span></p>
        <hr>
        <h3><span>Total:</span> <span>₦${formatPrice(total)}</span></h3>
      </div>
      <div class="os-customer-info">
        <h4>Delivery Details</h4>
        <p><strong>Name:</strong> ${order.customer?.name || 'N/A'}</p>
        <p><strong>Phone:</strong> ${order.customer?.phone || 'N/A'}</p>
        <p><strong>Address:</strong> ${order.customer?.address || 'N/A'}</p>
        <p><strong>City:</strong> ${order.customer?.city || 'N/A'}</p>
        <p><strong>Payment:</strong> ${order.paymentMethod || 'N/A'}</p>
      </div>
    `;

    summaryEl.innerHTML = '';
    summaryEl.appendChild(list);
    summaryEl.appendChild(footer);
  }

  // ═══════════════════════════════════════════════════════════════
  // PDF DOWNLOAD - FIXED
  // ═══════════════════════════════════════════════════════════════

  if (downloadBtn) {
    downloadBtn.disabled = false;
    
    downloadBtn.addEventListener('click', async () => {
      console.log('[OrderSuccess] Download button clicked');
      
      // Prepare receipt HTML
      const receiptHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Receipt ${order.id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 20px auto;
              padding: 20px;
            }
            h2 { color: #a4161a; margin-bottom: 10px; }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              padding: 10px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            th { background: #f5f5f5; }
            .total-row {
              font-weight: bold;
              font-size: 1.2em;
              border-top: 2px solid #333;
            }
            .info-section {
              margin: 20px 0;
              padding: 15px;
              background: #f9f9f9;
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          <h2>NetShop - Order Receipt</h2>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Status:</strong> ${order.status || 'Confirmed'}</p>
          
          <hr>
          
          <h3>Items</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => {
                const qty = Number(item.quantity) || 1;
                const price = Number(item.price) || 0;
                const lineTotal = price * qty;
                return `
                  <tr>
                    <td>${item.name}</td>
                    <td>${qty}</td>
                    <td>₦${formatPrice(price)}</td>
                    <td>₦${formatPrice(lineTotal)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" align="right">Subtotal:</td>
                <td>₦${formatPrice(subtotal)}</td>
              </tr>
              <tr>
                <td colspan="3" align="right">Delivery Fee:</td>
                <td>₦${formatPrice(deliveryFee)}</td>
              </tr>
              <tr class="total-row">
                <td colspan="3" align="right">Total:</td>
                <td>₦${formatPrice(total)}</td>
              </tr>
            </tfoot>
          </table>
          
          <div class="info-section">
            <h3>Delivery Information</h3>
            <p><strong>Name:</strong> ${order.customer?.name || 'N/A'}</p>
            <p><strong>Phone:</strong> ${order.customer?.phone || 'N/A'}</p>
            <p><strong>Address:</strong> ${order.customer?.address || 'N/A'}</p>
            <p><strong>City:</strong> ${order.customer?.city || 'N/A'}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod || 'N/A'}</p>
          </div>
          
          <p style="text-align: center; margin-top: 40px; color: #999;">
            Thank you for shopping with NetShop!
          </p>
        </body>
        </html>
      `;

      // Try jsPDF first
      try {
        if (window.jspdf && window.jspdf.jsPDF) {
          console.log('[OrderSuccess] Using jsPDF');
          
          const { jsPDF } = window.jspdf;
          const doc = new jsPDF();
          
          let y = 20;
          
          // Title
          doc.setFontSize(18);
          doc.setTextColor(164, 22, 26);
          doc.text('NetShop - Order Receipt', 14, y);
          
          y += 10;
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(`Order ID: ${order.id}`, 14, y);
          
          y += 6;
          doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 14, y);
          
          y += 6;
          doc.text(`Status: ${order.status || 'Confirmed'}`, 14, y);
          
          y += 10;
          doc.line(14, y, 196, y);
          
          y += 8;
          doc.setFontSize(12);
          doc.text('Items', 14, y);
          
          y += 8;
          doc.setFontSize(10);
          
          // Items
          items.forEach(item => {
            const qty = Number(item.quantity) || 1;
            const price = Number(item.price) || 0;
            const lineTotal = price * qty;
            
            doc.text(`${item.name} x${qty}`, 14, y);
            doc.text(`₦${formatPrice(lineTotal)}`, 160, y, { align: 'right' });
            
            y += 6;
            
            if (y > 270) {
              doc.addPage();
              y = 20;
            }
          });
          
          y += 4;
          doc.line(14, y, 196, y);
          
          y += 8;
          doc.text('Subtotal:', 14, y);
          doc.text(`₦${formatPrice(subtotal)}`, 160, y, { align: 'right' });
          
          y += 6;
          doc.text('Delivery Fee:', 14, y);
          doc.text(`₦${formatPrice(deliveryFee)}`, 160, y, { align: 'right' });
          
          y += 8;
          doc.setFontSize(12);
          doc.setFont(undefined, 'bold');
          doc.text('Total:', 14, y);
          doc.text(`₦${formatPrice(total)}`, 160, y, { align: 'right' });
          
          // Save PDF
          doc.save(`NetShop-Receipt-${order.id}.pdf`);
          
          if (window.toast) {
            window.toast.success('Receipt downloaded successfully!');
          }
          return;
        }
      } catch (error) {
        console.warn('[OrderSuccess] jsPDF failed:', error);
      }

      // Fallback: Print window
      console.log('[OrderSuccess] Using print fallback');
      
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Popup blocked! Please allow popups to download receipt.');
        return;
      }
      
      printWindow.document.write(receiptHtml);
      printWindow.document.close();
      
      // Wait for content to load, then print
      printWindow.onload = () => {
        printWindow.print();
      };
    });
  }
});

// Add styles for order success page
const style = document.createElement('style');
style.textContent = `
  .order-success-list {
    margin: 20px 0;
  }
  
  .os-item {
    display: flex;
    gap: 15px;
    padding: 15px;
    border-bottom: 1px solid #eee;
    align-items: center;
  }
  
  .os-item:last-child {
    border-bottom: none;
  }
  
  .os-left img {
    border-radius: 8px;
    object-fit: cover;
    border: 1px solid #ddd;
  }
  
  .os-right {
    flex: 1;
  }
  
  .os-name {
    font-weight: 600;
    margin-bottom: 5px;
    color: #333;
  }
  
  .os-qty {
    color: #999;
    font-weight: normal;
    font-size: 0.9em;
  }
  
  .os-price {
    color: #a4161a;
    font-weight: 700;
    font-size: 1.1em;
  }
  
  .os-footer {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 2px solid #ddd;
  }
  
  .os-breakdown {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  .os-breakdown p {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    font-size: 15px;
  }
  
  .os-breakdown hr {
    border: none;
    border-top: 1px solid #ddd;
    margin: 15px 0;
  }
  
  .os-breakdown h3 {
    display: flex;
    justify-content: space-between;
    font-size: 1.3em;
    color: #a4161a;
    margin: 10px 0 0 0;
  }
  
  .os-customer-info {
    background: #f5f5f5;
    padding: 15px;
    border-radius: 8px;
  }
  
  .os-customer-info h4 {
    margin-top: 0;
    margin-bottom: 10px;
    color: #333;
  }
  
  .os-customer-info p {
    margin: 5px 0;
    font-size: 14px;
  }
  
  .checkout-empty {
    text-align: center;
    padding: 60px 20px;
  }
  
  .checkout-empty i {
    font-size: 4rem;
    color: #ccc;
    margin-bottom: 20px;
  }
  
  .checkout-empty h3 {
    margin-bottom: 10px;
  }
  
  .checkout-empty p {
    color: #666;
    margin-bottom: 25px;
  }
`;
document.head.appendChild(style);
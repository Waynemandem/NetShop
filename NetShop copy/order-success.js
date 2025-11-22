document.addEventListener('DOMContentLoaded', () => {
  const qs = new URLSearchParams(window.location.search);
  const orderId = qs.get('orderId');
  const safeParse = (k, fallback = null) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch(e){return fallback;} };

  const orders = safeParse('orders', []) || [];
  let order = null;
  if (orderId) order = orders.find(o => o.id === orderId) || null;
  if (!order) order = orders.length ? orders[orders.length - 1] : null;

  const idEl = document.getElementById('order-id');
  const statusEl = document.getElementById('order-status');
  const summaryEl = document.getElementById('order-summary');
  const downloadBtn = document.getElementById('download-receipt');

  function formatPrice(n){ const num = Number(n) || 0; try{return num.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});}catch(e){return num.toFixed(2);} }

  if (!order) {
    idEl.textContent = 'Order: not found';
    statusEl.textContent = 'Status: —';
    summaryEl.innerHTML = '<p>No order found. You can view your orders history.</p>';
    downloadBtn.disabled = true;
    return;
  }

  idEl.textContent = `Order: ${order.id}`;
  statusEl.textContent = `Status: ${order.status || 'unknown'}`;

  // render items
  const list = document.createElement('div');
  list.className = 'order-success-list';
  let subtotal = 0;
  (order.items || []).forEach(it => {
    const row = document.createElement('div');
    row.className = 'os-item';
    const qty = Number(it.quantity) || 1;
    const price = Number(it.price) || 0;
    const line = price * qty;
    subtotal += line;
    row.innerHTML = `<div class="os-left"><img src="${it.image||''}" alt="${it.name||''}" width="48" height="48"></div><div class="os-right"><div class="os-name">${it.name||''} <span class="os-qty">× ${qty}</span></div><div class="os-price">₦${formatPrice(line)}</div></div>`;
    list.appendChild(row);
  });

  const fees = Number(order.deliveryFee) || 0;
  const total = Number(order.total) || (subtotal + fees);

  const footer = document.createElement('div');
  footer.className = 'os-footer';
  footer.innerHTML = `<p>Subtotal: ₦${formatPrice(subtotal)}</p><p>Delivery: ₦${formatPrice(fees)}</p><h3>Total: ₦${formatPrice(total)}</h3>`;

  summaryEl.appendChild(list);
  summaryEl.appendChild(footer);

  // receipt generation (use jsPDF if available, else open printable window)
  downloadBtn.addEventListener('click', async () => {
    const receiptHtml = `
      <h2>NetShop Receipt</h2>
      <p>Order: ${order.id}</p>
      <p>Date: ${new Date(order.createdAt).toLocaleString()}</p>
      <hr>
      ${order.items.map(it => `<div>${it.name} × ${it.quantity} — ₦${formatPrice((Number(it.price)||0)*(Number(it.quantity)||1))}</div>`).join('')}
      <hr>
      <p>Subtotal: ₦${formatPrice(subtotal)}</p>
      <p>Delivery: ₦${formatPrice(fees)}</p>
      <h3>Total: ₦${formatPrice(total)}</h3>
    `;

    // try jsPDF
    try {
      if (window.jspdf && window.jspdf.jsPDF) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let y = 10;
        doc.setFontSize(14);
        doc.text('NetShop Receipt', 14, y);
        y += 8;
        doc.setFontSize(10);
        doc.text(`Order: ${order.id}`, 14, y); y += 6;
        doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 14, y); y += 8;
        order.items.forEach(it => {
          const qty = Number(it.quantity)||1; const price = Number(it.price)||0; const line = (price*qty).toFixed(2);
          doc.text(`${it.name} x${qty} — ₦${Number(line).toLocaleString()}`, 14, y);
          y += 6;
          if (y > 270) { doc.addPage(); y = 10; }
        });
        y += 4;
        doc.text(`Subtotal: ₦${formatPrice(subtotal)}`, 14, y); y += 6;
        doc.text(`Delivery: ₦${formatPrice(fees)}`, 14, y); y += 6;
        doc.setFontSize(12);
        doc.text(`Total: ₦${formatPrice(total)}`, 14, y);
        doc.save(`${order.id}-receipt.pdf`);
        return;
      }
    } catch (e) {
      console.warn('jspdf failed', e);
    }

    // fallback: open printable window
    const w = window.open('', '_blank');
    if (!w) return alert('Popup blocked — please allow popups to download receipt.');
    w.document.write(`<html><head><title>Receipt ${order.id}</title><link rel="stylesheet" href="netshop.css"></head><body>${receiptHtml}<script>window.print();</script></body></html>`);
    w.document.close();
  });

});

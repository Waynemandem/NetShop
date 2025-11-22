document.addEventListener('DOMContentLoaded', () => {
  const safeParse = (k, fallback = null) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch(e){return fallback;} };
  const orders = safeParse('orders', []) || [];
  const container = document.getElementById('orders-list');
  container.innerHTML = '';

  if (!orders || orders.length === 0) {
    container.innerHTML = '<p>No orders yet. Place one from the shop!</p>';
    return;
  }

  const list = document.createElement('div');
  list.className = 'orders-list';

  orders.slice().reverse().forEach(o => {
    const card = document.createElement('div');
    card.className = 'order-card';
    const date = new Date(o.createdAt).toLocaleString();
    card.innerHTML = `
      <div class="oc-head"><strong>${o.id}</strong> <span class="oc-status">${o.status||'—'}</span></div>
      <div class="oc-body">
        <div>Placed: ${date}</div>
        <div>Items: ${ (o.items||[]).length }</div>
        <div>Total: ₦${ (Number(o.total)||0).toLocaleString() }</div>
      </div>
      <div class="oc-actions">
        <a href="order-success.html?orderId=${encodeURIComponent(o.id)}"><button>View</button></a>
        <button class="download" data-id="${o.id}">Download</button>
      </div>
    `;
    list.appendChild(card);
  });

  container.appendChild(list);

  // delegated download handling
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('button.download');
    if (!btn) return;
    const id = btn.dataset.id;
    const order = orders.find(x => x.id === id);
    if (!order) return alert('Order not found');
    // reuse order-success generation by opening page
    window.open(`order-success.html?orderId=${encodeURIComponent(id)}`, '_blank');
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const orderContainer = document.getElementById("order-items");
  const subtotalEl = document.getElementById("subtotal-price");
  const deliveryFeeEl = document.getElementById("delivery-fee");
  const totalEl = document.getElementById("total-price");
  const form = document.getElementById("checkout-form");
  const placeBtn = document.getElementById("place-order");

  const safeParse = (k, fallback = null) => {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  };
  const safeSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.warn('safeSet', e); } };

  const cart = safeParse('cart', []) || [];

  function formatPrice(n) {
    const num = Number(n) || 0;
    try { return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
    catch (e) { return num.toFixed(2); }
  }

  const DELIVERY_FEE = (() => {
    // try parse displayed fee, fallback to 1200
    const text = (deliveryFeeEl && deliveryFeeEl.textContent) ? deliveryFeeEl.textContent.replace(/[^0-9.]/g, '') : '';
    const v = parseFloat(text);
    return Number.isFinite(v) ? v : 1200;
  })();

  function renderOrderItems() {
    orderContainer.innerHTML = '';
    if (!cart || cart.length === 0) {
      orderContainer.innerHTML = '<p>Your cart is empty.</p>';
      subtotalEl.textContent = `₦${formatPrice(0)}`;
      totalEl.textContent = `₦${formatPrice(0)}`;
      deliveryFeeEl.textContent = `₦${formatPrice(DELIVERY_FEE)}`;
      placeBtn.disabled = true;
      return;
    }

    let subtotal = 0;
    cart.forEach(item => {
      const qty = Number(item.quantity) || 1;
      const price = Number(item.price) || 0;
      const line = price * qty;
      subtotal += line;

      const row = document.createElement('div');
      row.className = 'checkout-item';
      row.innerHTML = `
        <div class="checkout-item-left">
          <img src="${item.image || ''}" alt="${item.name || ''}" width="64" height="64">
        </div>
        <div class="checkout-item-right">
          <div class="ci-name">${item.name || ''} <span class="ci-qty">× ${qty}</span></div>
          <div class="ci-price">₦${formatPrice(line)}</div>
        </div>
      `;
      orderContainer.appendChild(row);
    });

    const total = subtotal + DELIVERY_FEE;
    subtotalEl.textContent = `₦${formatPrice(subtotal)}`;
    deliveryFeeEl.textContent = `₦${formatPrice(DELIVERY_FEE)}`;
    totalEl.textContent = `₦${formatPrice(total)}`;
    placeBtn.disabled = false;
  }

  renderOrderItems();

  // Basic validation
  function validateForm(values) {
    if (!values.name || values.name.trim().length < 2) return { ok: false, field: 'name', msg: 'Please enter your full name.' };
    if (!values.phone || !/^\+?[0-9]{7,15}$/.test(values.phone.trim())) return { ok: false, field: 'phone', msg: 'Please enter a valid phone number.' };
    if (!values.address || values.address.trim().length < 6) return { ok: false, field: 'address', msg: 'Please enter a delivery address.' };
    if (!values.city || values.city.trim().length < 2) return { ok: false, field: 'city', msg: 'Please enter your city.' };
    if (!values.paymentMethod) return { ok: false, field: 'payment-method', msg: 'Please select a payment method.' };
    return { ok: true };
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name')?.value || '';
    const phone = document.getElementById('phone')?.value || '';
    const address = document.getElementById('address')?.value || '';
    const city = document.getElementById('city')?.value || '';
    const paymentMethod = document.getElementById('payment-method')?.value || '';

    const values = { name, phone, address, city, paymentMethod };
    const valid = validateForm(values);
    if (!valid.ok) {
      // prefer toast if available
      if (typeof window.showToast === 'function') window.showToast(valid.msg, 'error');
      else alert(valid.msg);
      const el = document.getElementById(valid.field) || document.getElementById(valid.field.replace('-', '_'));
      if (el) el.focus();
      return;
    }

    // Place order (simulate)
    placeBtn.disabled = true;
    placeBtn.textContent = 'Placing order...';

    const subtotal = cart.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0);
    const total = subtotal + DELIVERY_FEE;

    const order = {
      id: `ORD-${Date.now()}`,
      items: cart,
      customer: { name: name.trim(), phone: phone.trim(), address: address.trim(), city: city.trim() },
      paymentMethod,
      subtotal,
      deliveryFee: DELIVERY_FEE,
      total,
      createdAt: new Date().toISOString()
    };

    // mark initial status as processing and persist
    order.status = 'processing';
    const orders = safeParse('orders', []) || [];
    orders.push(order);
    safeSet('orders', orders);

    // clear cart immediately
    try { localStorage.removeItem('cart'); } catch (e) { /* ignore */ }

    if (typeof window.showToast === 'function') window.showToast('Order placed — processing 🎉', 'success');
    else alert('Order placed successfully');

    // Simulate server-side processing and confirmation, then redirect to success page with orderId
    setTimeout(() => {
      // update order status to confirmed
      const stored = safeParse('orders', []) || [];
      const idx = stored.findIndex(o => o.id === order.id);
      if (idx >= 0) {
        stored[idx].status = 'confirmed';
        stored[idx].confirmedAt = new Date().toISOString();
        safeSet('orders', stored);
      }
      // redirect to success page showing order summary and receipt/download
      window.location.href = `order-success.html?orderId=${encodeURIComponent(order.id)}`;
    }, 900);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const cartContainer = document.getElementById('cart-container');
  const checkoutBtn = document.getElementById('checkout-btn');

  const safeParse = (k) => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch (e) { return []; } };
  const safeSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.warn('localStorage set failed', e); } };

  let cart = safeParse('cart');

  function updateCartCount() {
    const el = document.getElementById('cart-count') || document.querySelector('.cart-count');
    if (!el) return;
    const totalItems = cart.reduce((s, it) => s + (it.quantity || 0), 0);
    el.textContent = totalItems;
  }

  // Format number to currency-style string with two decimals and thousands separators
  function formatPrice(v) { 
    const n = Number(v);
    if (isNaN(n)) return '0.00';
    try {
      return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } catch (e) {
      return n.toFixed(2);
    }
  }

  function renderEmpty() {
    cartContainer.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'cart-empty';

    const p = document.createElement('p');
    p.textContent = 'Your cart is empty 😢';
    p.style.marginBottom = '12px';

    const hint = document.createElement('p');
    hint.textContent = 'Looks like you haven\'t added anything yet.';
    hint.style.margin = '0 0 16px 0';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'continue-btn';
    btn.textContent = 'Continue shopping';
    btn.addEventListener('click', () => { window.location.href = 'shop.html'; });

    wrap.appendChild(p);
    wrap.appendChild(hint);
    wrap.appendChild(btn);
    cartContainer.appendChild(wrap);
    if (checkoutBtn) checkoutBtn.disabled = true;
  }

  function renderCart() {
    cartContainer.innerHTML = '';
    if (!cart || cart.length === 0) return renderEmpty();

    const list = document.createElement('div');
    list.className = 'cart-list';

    let total = 0;
    cart.forEach((item, index) => {
      const priceNum = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      total += priceNum * qty;

      const row = document.createElement('div');
      row.className = 'cart-item';

      const img = document.createElement('img');
      img.src = item.image || '';
      img.alt = item.name || 'Product';
      img.width = 80;
      img.height = 80;

      const info = document.createElement('div');
      info.className = 'cart-info';

      const h3 = document.createElement('h3');
      h3.textContent = item.name || '';

      const p = document.createElement('p');
      p.className = 'cart-line-price';
      p.textContent = `$${formatPrice(priceNum)} × `;

      const qtySpan = document.createElement('span');
      qtySpan.className = 'cart-quantity';
      qtySpan.textContent = qty;

      const controls = document.createElement('div');

      const minus = document.createElement('button');
      minus.className = 'qty-btn';
      minus.dataset.index = index;
      minus.dataset.action = 'minus';
      minus.type = 'button';
      minus.textContent = '−';

      const plus = document.createElement('button');
      plus.className = 'qty-btn';
      plus.dataset.index = index;
      plus.dataset.action = 'plus';
      plus.type = 'button';
      plus.textContent = '+';

      const remove = document.createElement('button');
      remove.className = 'remove-btn';
      remove.dataset.index = index;
      remove.type = 'button';
      remove.textContent = 'Remove';

      controls.appendChild(minus);
      controls.appendChild(plus);
      controls.appendChild(remove);

      p.appendChild(qtySpan);
      info.appendChild(h3);
      info.appendChild(p);
      info.appendChild(controls);

      row.appendChild(img);
      row.appendChild(info);
      list.appendChild(row);
    });

    const totalDiv = document.createElement('div');
    totalDiv.className = 'cart-total';
    totalDiv.innerHTML = `<h2>Total: $${formatPrice(total)}</h2>`;

    cartContainer.appendChild(list);
    cartContainer.appendChild(totalDiv);
    if (checkoutBtn) checkoutBtn.disabled = false;
  }

  function persistCart() {
    safeSet('cart', cart);
    updateCartCount();
  }

  // initial render
  renderCart();
  updateCartCount();

  // Delegated click handling for qty and remove
  cartContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const idx = Number(btn.dataset.index);
    if (Number.isNaN(idx)) return;

    if (btn.classList.contains('qty-btn')) {
      const action = btn.dataset.action;
      if (action === 'plus') cart[idx].quantity = (cart[idx].quantity || 0) + 1;
      if (action === 'minus' && (cart[idx].quantity || 0) > 1) cart[idx].quantity -= 1;
      persistCart();
      renderCart();
      return;
    }

    if (btn.classList.contains('remove-btn')) {
      const ok = confirm('Remove this item from the cart?');
      if (!ok) return;
      cart.splice(idx, 1);
      persistCart();
      renderCart();
      return;
    }
  });

  // Checkout button
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (!cart || cart.length === 0) {
        alert('Your cart is empty!');
        return;
      }
      window.location.href = 'checkout.html';
    });
  }
});
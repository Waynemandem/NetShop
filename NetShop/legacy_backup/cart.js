// cart.js - CLEANED VERSION
// Removed duplicate functions now in netshop_core_fixed.js

document.addEventListener('DOMContentLoaded', () => {
  // ═══════════════════════════════════════════════════════════════
  // DOM ELEMENTS
  // ═══════════════════════════════════════════════════════════════
  const cartContainer = document.getElementById('cart-container');
  const checkoutBtn = document.getElementById('checkout-btn');

  // ═══════════════════════════════════════════════════════════════
  // DELETED - Now in netshop_core_fixed.js:
  // - safeParse()
  // - safeSet()
  // - updateCartCount()
  // - formatPrice()
  // ═══════════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════════
  // RENDER EMPTY CART
  // ═══════════════════════════════════════════════════════════════
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
    btn.addEventListener('click', () => {
      window.location.href = 'shop.html';
    });

    wrap.appendChild(p);
    wrap.appendChild(hint);
    wrap.appendChild(btn);
    cartContainer.appendChild(wrap);
    
    if (checkoutBtn) checkoutBtn.disabled = true;
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER CART
  // ═══════════════════════════════════════════════════════════════
  function renderCart() {
    cartContainer.innerHTML = '';
    
    // Get cart from Core Manager
    const cart = NetShop.CartManager.getCart(); // USE CORE

    if (!cart || cart.length === 0) {
      return renderEmpty();
    }

    const list = document.createElement('div');
    list.className = 'cart-list';

    let total = 0;
    
    cart.forEach((item, index) => {
      const priceNum = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      total += priceNum * qty;

      const row = document.createElement('div');
      row.className = 'cart-item';

      // Image
      const img = document.createElement('img');
      img.src = item.image || '';
      img.alt = item.name || 'Product';
      img.width = 80;
      img.height = 80;

      // Info section
      const info = document.createElement('div');
      info.className = 'cart-info';

      const h3 = document.createElement('h3');
      h3.textContent = item.name || '';

      const p = document.createElement('p');
      p.className = 'cart-line-price';
      p.textContent = `₦${NetShop.Utils.formatPrice(priceNum)} × `; // USE CORE

      const qtySpan = document.createElement('span');
      qtySpan.className = 'cart-quantity';
      qtySpan.textContent = qty;
      p.appendChild(qtySpan);

      // Controls
      const controls = document.createElement('div');

      const minus = document.createElement('button');
      minus.className = 'qty-btn';
      minus.dataset.itemId = item.id || item.name;
      minus.dataset.action = 'minus';
      minus.type = 'button';
      minus.textContent = '−';

      const plus = document.createElement('button');
      plus.className = 'qty-btn';
      plus.dataset.itemId = item.id || item.name;
      plus.dataset.action = 'plus';
      plus.type = 'button';
      plus.textContent = '+';

      const remove = document.createElement('button');
      remove.className = 'remove-btn';
      remove.dataset.itemId = item.id || item.name;
      remove.type = 'button';
      remove.textContent = 'Remove';

      controls.appendChild(minus);
      controls.appendChild(plus);
      controls.appendChild(remove);

      info.appendChild(h3);
      info.appendChild(p);
      info.appendChild(controls);

      row.appendChild(img);
      row.appendChild(info);
      list.appendChild(row);
    });

    // Total
    const totalDiv = document.createElement('div');
    totalDiv.className = 'cart-total';
    totalDiv.innerHTML = `<h2>Total: ₦${NetShop.Utils.formatPrice(total)}</h2>`; // USE CORE

    cartContainer.appendChild(list);
    cartContainer.appendChild(totalDiv);
    
    if (checkoutBtn) checkoutBtn.disabled = false;
  }

  // ═══════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ═══════════════════════════════════════════════════════════════
  
  // Delegated click handling for quantity and remove buttons
  cartContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn || !btn.dataset.itemId) return;

    const itemId = btn.dataset.itemId;

    // Quantity buttons
    if (btn.classList.contains('qty-btn')) {
      const cart = NetShop.CartManager.getCart();
      const item = cart.find(i => i.id === itemId || i.name === itemId);
      
      if (!item) return;

      const action = btn.dataset.action;
      let newQty = item.quantity || 1;

      if (action === 'plus') {
        newQty += 1;
      } else if (action === 'minus' && newQty > 1) {
        newQty -= 1;
      }

      NetShop.CartManager.updateQuantity(itemId, newQty); // USE CORE
      renderCart();
      return;
    }

    // Remove button
    if (btn.classList.contains('remove-btn')) {
      const ok = confirm('Remove this item from the cart?');
      if (!ok) return;
      
      NetShop.CartManager.removeItem(itemId); // USE CORE
      renderCart();
      return;
    }
  });

  // Checkout button
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const cart = NetShop.CartManager.getCart(); // USE CORE
      
      if (!cart || cart.length === 0) {
        NetShop.Utils.showError('Your cart is empty!'); // USE CORE
        return;
      }
      
      window.location.href = 'checkout.html';
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // INITIAL RENDER
  // ═══════════════════════════════════════════════════════════════
  renderCart();
});
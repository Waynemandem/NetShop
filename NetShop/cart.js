document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-container");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];



  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty 😢</p>";
    return;
  }

  let total = 0;
  cartContainer.innerHTML = "";

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-info">
        <h3>${item.name}</h3>
        <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
        <div>
          <button class="qty-btn" data-action="minus" data-index="${index}">−</button>
          <button class="qty-btn" data-action="plus" data-index="${index}">+</button>
          <button class="remove-btn" data-index="${index}">Remove</button>
        </div>
      </div>
    `;
    cartContainer.appendChild(div);
  });




  const totalDiv = document.createElement("div");
  totalDiv.className = "cart-total";
  totalDiv.innerHTML = `<h2>Total: $${total.toFixed(2)}</h2>`;
  cartContainer.appendChild(totalDiv);

  // Event delegation for quantity buttons
  cartContainer.addEventListener("click", e => {
    if (e.target.classList.contains("qty-btn")) {
      const i = e.target.dataset.index;
      const action = e.target.dataset.action;
      if (action === "plus") cart[i].quantity += 1;
      if (action === "minus" && cart[i].quantity > 1) cart[i].quantity -= 1;
      localStorage.setItem("cart", JSON.stringify(cart));
      location.reload();
    }

    if (e.target.classList.contains("remove-btn")) {
      const i = e.target.dataset.index;
      cart.splice(i, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      location.reload();
    }
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.getElementById("checkout-btn");

  checkoutBtn.addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Go to checkout page
    window.location.href = "checkout.html";
  });
});

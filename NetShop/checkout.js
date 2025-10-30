document.addEventListener("DOMContentLoaded", () => {
  const orderContainer = document.getElementById("order-items");
  const orderTotalElement = document.getElementById("order-total");
  const form = document.getElementById("checkout-form");

  // Load cart items
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;

  if (cart.length === 0) {
    orderContainer.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cart.forEach(item => {
      const div = document.createElement("div");
      div.innerHTML = `
        <p><strong>${item.name}</strong> × ${item.quantity}</p>
        <p>₦${item.price * item.quantity}</p>
      `;
      orderContainer.appendChild(div);
      total += item.price * item.quantity;
    });
  }

  orderTotalElement.textContent = total.toLocaleString();

  // Handle form submission
  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("fullname").value;
    const address = document.getElementById("address").value;
    const phone = document.getElementById("phone").value;

    if (!name || !address || !phone) {
      alert("Please fill in all fields.");
      return;
    }

    alert(`Thank you ${name}! Your order has been placed successfully.`);
    localStorage.removeItem("cart");
    window.location.href = "order-success.html";
  });
});

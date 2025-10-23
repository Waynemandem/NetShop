// product.js

document.addEventListener("DOMContentLoaded", () => {
  const productData = JSON.parse(localStorage.getItem("selectedProduct"));

  if (!productData) {
    // If there's no saved product, send back to shop
    window.location.href = "shop.html";
    return;
  }

  // Get HTML elements
  const productImage = document.getElementById("product-image");
  const productName = document.getElementById("product-name");
  const productBrand = document.getElementById("product-brand");
  const productCategory = document.getElementById("product-category");
  const productPrice = document.getElementById("product-price");

  // Fill content dynamically
  productImage.src = productData.image;
  productImage.alt = productData.name;
  productName.textContent = productData.name;
  productBrand.textContent = `Brand: ${productData.brand}`;
  productCategory.textContent = `Category: ${productData.category}`;
  productPrice.textContent = `$${productData.price}`;

  // Add button actions
  document.getElementById("add-to-cart").addEventListener("click", () => {
    if (typeof showToast === "function") {
      showToast(`${productData.name} added to cart 🛒`, "success");
    } else {
      alert(`${productData.name} added to cart 🛒`);
    }
  });

  document.getElementById("buy-now").addEventListener("click", () => {
    if (typeof showToast === "function") {
      showToast(`Proceeding to buy ${productData.name} 💳`, "success");
    } else {
      alert(`Proceeding to buy ${productData.name} 💳`);
    }
  });
});



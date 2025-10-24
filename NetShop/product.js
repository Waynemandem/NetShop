// new product.js

document.addEventListener("DOMContentLoaded", () => {
  const productData = JSON.parse(localStorage.getItem("selectedProduct"));

  if (!productData) {
    window.location.href = "shop.html";
    return;
  }

  const productImage = document.getElementById("product-image");
  const productName = document.getElementById("product-name");
  const productBrand = document.getElementById("product-brand");
  const productCategory = document.getElementById("product-category");
  const productPrice = document.getElementById("product-price");

  productImage.src = productData.image;
  productImage.alt = productData.name;
  productName.textContent = productData.name;
  productBrand.textContent = `Brand: ${productData.brand}`;
  productCategory.textContent = `Category: ${productData.category}`;
  productPrice.textContent = `${productData.price}`;

  document.getElementById("add-to-cart").addEventListener("click", () => {
    typeof showToast === "function"
      ? showToast(`${productData.name} added to cart 🛒`)
      : alert(`${productData.name} added to cart 🛒`);
  });

  document.getElementById("buy-now").addEventListener("click", () => {
    typeof showToast === "function"
      ? showToast(`Proceeding to buy ${productData.name} 💳`)
      : alert(`Proceeding to buy ${productData.name} 💳`);
  });
});

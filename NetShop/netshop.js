// script.js
const bar = document.getElementByIdef




const products = [
  {
    brandName: "Nike",
    name: "Nike Air Sneakers",
    price: "$120",
    image: "nike1.jpeg"
  },
  {
    brandName: "Adidas",
    name: "Adidas Ultraboost",
    price: "$140",
    image: "adidas.jpeg"
  },
  {
    brandName: "Puma",
    name: "Puma Classic",
    price: "$100",
    image: "puma1.jpg"
  },
  {
    brandName: "New Balance",
    name: "New Balance 550",
    price: "$110",
    image: "newBalance.jpeg"
  },
    {
    brandName: "Vans",
    name: "Converse All Star",
    price: "$99.99",
    image: "ConverseAllStar.jpeg"
  },
  {
    brandName: "Nike",
    name:"nike stack",
    price:"$130",
    image:"nikestack.jpeg"
  }
];

const productGrid = document.getElementById("productGrid");


// toast container
const toastContainer = document.getElementById("toastContainer");

// Function to show toast notification
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.classList.add("toast", type);
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}


// Render products
productGrid.innerHTML = ""; // Clear loading text
products.forEach(product => {
  const card = document.createElement("div");
  card.classList.add("product-card");

  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <p class="brandName">${product.brandName}</p>
    <p class="product-name">${product.name}</p>
    <p class="product-price">${product.price}</p>
    <div class="card-buttons">
      <button class="buy-btn">Buy Now</button>
      <button class="cart-btn">Add to Cart</button>
    </div>
  `;

  productGrid.appendChild(card);
}); 
// Add event listeners for buttons

// Handle button clicks
  document.addEventListener("click", e => {
    if (e.target.classList.contains("cart-btn")) {
      const name = e.target.closest(".product-card").querySelector(".product-name").textContent;
      showToast(`${name} added to cart 🛒`, "success");
    }
    if (e.target.classList.contains("buy-btn")) {
      const name = e.target.closest(".product-card").querySelector(".product-name").textContent;
      showToast(`Proceeding to buy ${name} 💳`, "success");
    }
  });


  const products2 = [
    {
      brandName: "Big 4",
      name: "rema swag",
      price: "499.99",
      image: "starboy.jpg"
    },
    {
     brandName: "africon",
     name: "africa",
     price: "$199.99",
     image: "ConverseAllStar.jpeg"
    },
    {
      brandName: "Wayne real estates",
      name: "4 bedroom House",
      price: "$31,000,000",
      image: "mistressHome.jpg"
    },
    {
      brandName: "Big 4",
      name: "Suit",
      price: "$310",
      image: "suit.jpg"
    },
    {
      brandName: "Big 4",
      name: "Track suit",
      price: "$350",
      image: "tracktech.jpg"
    },
    {
      brandName: "Big 4",
      name: "Sharp Fit",
      price: "$310.99",
      image: "sharpfit.jpg"
    },
    {
      brandName:"Big 4",
      name: "Cloth Collection",
      price: "699.99",
      image:"tops&bottom.jpg"
    },
    {
      brandName:"Big 4",
      name: "Shoe Collection",
      price: "999.99",
      image:"shoes.jpg"
    },
    {
      brandName:"Big 4",
      name: "Jogger and shoes",
      price: "699.99",
      image:"track&shoe.jpg"
    }
  ];


  // Render products1
productGrid2.innerHTML = ""; // Clear loading text
products2.forEach(product2 => {
  const card2 = document.createElement("div");
  card2.classList.add("product-card2");

  card2.innerHTML = `
    <img src="${product2.image}" alt="${product2.name}">
    <p class="brandName">${product2.brandName}</p>
    <p class="product2-name">${product2.name}</p>
    <p class="product2-price">${product2.price}</p>
    <div class="card-buttons">
      <button class="buy-btn">Buy Now</button>
      <button class="cart-btn">Add to Cart</button>
    </div>
  `;

  productGrid2.appendChild(card2);
}); 


// for banner

const promos = [
  { image: "iphone-promo.jpg", title: "New Arrivals", subtitle: "Fresh styles for 2025", link: "#" },
  { image: "food-banner.jpg", title: "Flash Sale", subtitle: "Up to 50% off", link: "#" },
  { image: "banner3.jpg", title: "Trending Now", subtitle: "Hot picks of the week", link: "#" },

];

const promoSection = document.getElementById("promo-section");

promos.forEach(({ image, title, subtitle, button, link }) => {
  const promo = document.createElement("div");
  promo.classList.add("promo-card");
  promo.href = link;
  promo.innerHTML = `
    <img src="${image}" alt="${title}">
    <div class="promo-overlay">
      ${title}
      <span>${subtitle}</span>
      <a href="${link}" class="promo-button">Shop Now</a>
    </div>
  `;
  promoSection.appendChild(promo);
});


// catergory section


const categories = [
  { image: "crocs.jpg", name: "Unisex Foot Wear", link: "#" },
  { image: "perfume.jpg", name: "Hygiene and self Care  ", link: "#" },
  { image: "nikestyle.jpg", name: "Nike", link: "#" },
  { image: "iphone-promo.jpg", name: "Tech Gadgets", link: "#" },
  { image: "mistressHome.jpg", name: "Home & Living", link: "#" },
  { image: "burger.jpg", name: "Fast Food ", link: "#" },
  { image: "Menclothing.jpg", name: "Men's Clothing", link: "#"},
  { image: "", name: "Woman's Clothing", link: "#"}
];

const categoryGrid = document.getElementById("category-grid");

categories.forEach(({ image, name, link }) => {
  const card = document.createElement("a");
  card.classList.add("category-card");
  card.href = link;
  card.innerHTML = `
    <img src="${image}" alt="${name}">
    <div class="category-info">${name}</div>
  `;
  categoryGrid.appendChild(card);
});


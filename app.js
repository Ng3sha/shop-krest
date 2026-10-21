document.addEventListener("DOMContentLoaded", function () {
  // Search Toggle
  const searchToggle = document.getElementById("searchToggle");
  const searchDropdown = document.getElementById("searchDropdown");

  if (searchToggle && searchDropdown) {
    searchToggle.addEventListener("click", function () {
      searchDropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", function (event) {
      if (
        !searchToggle.contains(event.target) &&
        !searchDropdown.contains(event.target)
      ) {
        searchDropdown.classList.add("hidden");
      }
    });
  }

  // Cart Toggle
  const cartToggle = document.getElementById("cartToggle");
  const cartDropdown = document.getElementById("cartDropdown");

  if (cartToggle && cartDropdown) {
    cartToggle.addEventListener("click", function () {
      cartDropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", function (event) {
      if (
        !cartToggle.contains(event.target) &&
        !cartDropdown.contains(event.target)
      ) {
        cartDropdown.classList.add("hidden");
      }
    });
  }

  // Mobile Menu Toggle
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Mobile Shop Menu Toggle
  const mobileShopToggle = document.getElementById("mobileShopToggle");
  const mobileShopMenu = document.getElementById("mobileShopMenu");

  if (mobileShopToggle && mobileShopMenu) {
    mobileShopToggle.addEventListener("click", function () {
      mobileShopMenu.classList.toggle("hidden");
    });
  }
  }); 

  // Global State & Elements
const productCategorySelect = document.getElementById("product-categories");
const productContainer = document.getElementById("products");
let cart = [];

// 1. Load Categories into Dropdown Select Options
async function productsCategories() {
  try {
    const response = await fetch("https://dummyjson.com/products/category-list");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const categories = await response.json();
    
    // Clear and build an initial default choice option
    productCategorySelect.innerHTML = `<option value="">All Categories</option>`; 

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      // Capitalize first letter natively for presentation clean up
      option.style.textTransform = "capitalize"; 
      
      productCategorySelect.appendChild(option);
    });
  } catch (error) {
    console.log("Something went wrong loading categories:", error);
  }
}

// 2. Listen for 'change' events on the parent dropdown instead of 'click' on options
productCategorySelect.addEventListener("change", (event) => {
  const selectedCategory = event.target.value;
  fetchProducts(selectedCategory); // Refreshes grid feed
});

// 3. Fetch and Render Products
async function fetchProducts(categoryName = "") {
  try {
    productContainer.innerHTML = "<p>Loading products...</p>";
    
    let url = categoryName 
      ? `https://dummyjson.com/products/category/${categoryName}`
      : "https://dummyjson.com/products";

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    const items = data.products;

    productContainer.innerHTML = "";
    
    if (!items || items.length === 0) {
      productContainer.innerHTML = "<p>No products found in this category.</p>";
      return;
    }

    items.forEach((item) => {
      const card = document.createElement("div");
      card.innerHTML = `
        <div class="border border-amber-700 p-2.5 rounded-md mb-4 bg-white">
          <p class="font-bold text-xs text-amber-800 uppercase">${item.category}</p>
          <img class="object-contain my-2" src="${item.thumbnail}" alt="${item.title}" width="100">
          <p><strong>${item.title}</strong></p>
          <p class="text-sm text-gray-600">Description: ${item.description}</p>
          <div class="flex justify-between items-center mt-3">
            <p>Name: $${person.name}</p>
            <button 
              data-id="${item.id}" 
              data-title="${item.title}" 
              data-price="${item.price}" 
              class="add-cart-btn w-40 h-10 bg-amber-700 text-white rounded-2xl hover:bg-amber-800 transition-all">
              Add to cart
            </button>
          </div>
        </div>
      `;
      productContainer.appendChild(card);
    });
  } catch (error) {
    console.log("Something went wrong loading products:", error);
    productContainer.innerHTML = "<p>Error loading items.</p>";
  }
}

// 4. Cart Event Delegation 
productContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("add-cart-btn")) {
    const btn = event.target;
    const product = {
      id: parseInt(btn.getAttribute("data-id")),
      title: btn.getAttribute("data-title"),
      price: parseFloat(btn.getAttribute("data-price"))
    };
    addToCart(product);
  }
});

function addToCart(product) {
  const targetItem = cart.find(item => item.id === product.id);
  if (targetItem) {
    targetItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  console.log("Current Cart:", cart);
}

// Initialize
productsCategories();
fetchProducts(); 


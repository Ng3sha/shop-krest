 // Fetch Product categories
const productCategorySelect = document.getElementById("productCategories");
const productContainer = document.getElementById("products");
const productMap = new Map();

async function productsCategories() {
  try {
    const response = await fetch("https://dummyjson.com/products/category-list");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const categories = await response.json();
    productCategorySelect.innerHTML = `<option value="">All Categories</option>`; 

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      option.style.textTransform = "capitalize"; 
      
      productCategorySelect.appendChild(option);
    });
  } catch (error) {
    console.log("Something went wrong loading categories:", error);
  }
}

productCategorySelect.addEventListener("change", (event) => {
  const selectedCategory = event.target.value;

  if (selectedCategory === "") {
    fetchProducts();
  } else {
    fetchProducts(selectedCategory);
  }
});

//  Fetch and Render Products
async function fetchProducts(categoryName = "") {
  try {
    productContainer.innerHTML = ""
    let url = categoryName 
      ? `https://dummyjson.com/products/category/${categoryName}`
      : "https://dummyjson.com/products";

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    const items = data.products;

    productContainer.innerHTML = "";

    items.forEach((item) => {
      productMap.set(item.id, item);
      const card = document.createElement("div");
      card.innerHTML = `
        <div class="border border-gray-100 shadow p-2.5 rounded-md max-h-130 bg-white transition-all duration-500 hover:scale-105">
          <p class="font-bold text-xs text-amber-800 uppercase">${item.category}</p>
          <div class="flex justify-center">
            <img class="object-contain my-2 w-full max-h-60" src="${item.thumbnail}" alt="${item.title}" width="100">
          </div>
          <p><strong>${item.title}</strong></p>
          <p class="lg:text-sm text-xs text-gray-600 ">Description: ${item.description}</p>
          <div class="flex justify-between items-center mt-3">
          <p class="font-bold">Price: $${item.price}</p>
            <button 
              data-id="${item.id}" 
              data-title="${item.title}" 
              data-price="${item.price}" 
              class="add-cart-btn xl:px-6 md:px-4 xl:py-2 py-1 bg-amber-700 text-white rounded-2xl hover:bg-amber-800 transition-all">
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

// Initialize
productsCategories();
fetchProducts(); 

const viewAllProducts = document.getElementById("allproducts")

viewAllProducts.addEventListener("click", () =>{
  fetchAllProducts()
})
async function fetchAllProducts() {
  try {
     productContainer.innerHTML = ""    
    const response = await fetch("https://dummyjson.com/products?limit=0");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const data = await response.json();
    const productList = await data.products;
    productContainer.innerHTML = ""
  console.log(data)
    productList.forEach((item) => {
      productMap.set(item.id, item);
      const card = document.createElement("div");
      card.innerHTML = `
        <div class="border border-gray-100 shadow p-2.5 rounded-md max-h-130 bg-white transition-all duration-500 hover:scale-105">
          <p class="font-bold text-xs text-amber-800 uppercase">${item.category}</p>
          <img class="object-contain my-2 w-full max-h-60" src="${item.thumbnail}" alt="${item.title}" width="100">
          <p><strong>${item.title}</strong></p>
          <p class="lg:text-sm text-xs text-gray-600 ">Description: ${item.description}</p>
          <div class="flex justify-between items-center mt-3">
          <p class="font-bold">Price: $${item.price}</p>
            <button 
              data-id="${item.id}" 
              data-title="${item.title}" 
              data-price="${item.price}" 
              class="add-cart-btn xl:px-6 md:px-4 xl:py-2 py-1 bg-amber-700 text-white rounded-2xl hover:bg-amber-800 transition-all">
              Add to cart
            </button>
          </div>
        </div>
      `;
      productContainer.appendChild(card);
    });
   
  } catch (error) {
    console.error(error.message)
  }
};
fetchAllProducts()



// CART VARIABLES
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartToggle = document.getElementById("cartToggle");
const cartDropdown = document.getElementById("cartDropdown");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cartTotal");
const clearCart = document.getElementById("clearCart");
const closeCart = document.getElementById("closeCart");


// ADD TO CART
productContainer.addEventListener("click", (event) => {

  const button = event.target.closest(".add-cart-btn");

  if (!button) return;

  const id = Number(button.dataset.id);

  const product = productMap.get(id);

  if (!product) {
    console.log("Product not found:", id);
    return;
  }

  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: 1
    });
  }

  updateCart();

  cartDropdown.classList.remove("hidden");

});


// RENDER CART
function renderCart() {

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p class="text-center text-gray-400 py-6">
        Your cart is empty.
      </p>
    `;
    return;
  }

  cart.forEach(item => {

    const div = document.createElement("div");

    div.className = "flex gap-3 items-center border-b py-3";

    const image = document.createElement("img");
    image.src = item.thumbnail;
    image.alt = item.title;
    image.className = "w-16 h-16 object-contain";

    const details = document.createElement("div");
    details.className = "flex-1 min-w-0";

    const title = document.createElement("h4");
    title.className = "font-semibold text-sm truncate";
    title.textContent = item.title;

    const price = document.createElement("p");
    price.className = "text-amber-700 text-sm";
    price.textContent = `$${item.price.toFixed(2)}`;

    const controls = document.createElement("div");
    controls.className = "flex items-center gap-3 mt-2";

    const minus = document.createElement("button");
    minus.textContent = "-";
    minus.className = "bg-gray-200 px-2 rounded";
    minus.addEventListener("click", () => changeQuantity(item.id, -1));

    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.className = "bg-gray-200 px-2 rounded";
    plus.addEventListener("click", () => changeQuantity(item.id, 1));

    controls.append(minus, quantity, plus);
    details.append(title, price, controls);

    const remove = document.createElement("button");
    remove.textContent = "X";
    remove.className = "text-red-500 font-bold";
    remove.addEventListener("click", () => deleteItem(item.id));

    div.append(image, details, remove);

    cartItems.appendChild(div);

  });

}


// CHANGE QUANTITY
function changeQuantity(id, amount) {

  const item = cart.find(item => item.id === id);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    deleteItem(id);
    return;
  }

  updateCart();

}


// DELETE SINGLE ITEM
function deleteItem(id) {

  cart = cart.filter(item => item.id !== id);

  updateCart();

}


// DELETE ALL ITEMS
clearCart.addEventListener("click", () => {

  cart = [];

  updateCart();

});


// UPDATE CART
function updateCart() {

  const count = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  cartCount.textContent = count;

  cartTotal.textContent = `$${total.toFixed(2)}`;

  localStorage.setItem("cart", JSON.stringify(cart));

  renderCart();

}


// OPEN CART
cartToggle.addEventListener("click", () => {
  cartDropdown.classList.toggle("hidden");
});


// CLOSE CART
closeCart.addEventListener("click", () => {
  cartDropdown.classList.add("hidden");
});


// INITIALIZE
updateCart();



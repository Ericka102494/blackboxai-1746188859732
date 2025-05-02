// Sample product data
const products = [
  {
    id: 1,
    name: "Mystic Forest",
    price: 15.0,
    description: "A beautiful digital illustration of a mystic forest.",
    image: "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350"
  },
  {
    id: 2,
    name: "Abstract AI Art",
    price: 20.0,
    description: "An abstract AI-generated artwork with vibrant colors.",
    image: "https://images.pexels.com/photos/207983/pexels-photo-207983.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350"
  },
  {
    id: 3,
    name: "Cityscape at Dusk",
    price: 18.0,
    description: "A digital painting of a cityscape at dusk with warm tones.",
    image: "https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350"
  }
];

// Utility to get product by ID
function getProductById(id) {
  return products.find(p => p.id === id);
}

// Cart management using localStorage
const CART_KEY = "digitalArtStoreCart";

function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(productId) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  saveCart(cart);
  alert("Added to cart!");
  updateCartCount();
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  renderCartItems();
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartLinks = document.querySelectorAll('a[href="cart.html"] i.fas.fa-shopping-cart');
  cartLinks.forEach(icon => {
    const parent = icon.parentElement;
    let badge = parent.querySelector(".cart-count-badge");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "cart-count-badge absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center";
      parent.style.position = "relative";
      parent.appendChild(badge);
    }
    badge.textContent = count;
    if (count === 0) {
      badge.style.display = "none";
    } else {
      badge.style.display = "flex";
    }
  });
}

// Render product detail page
function renderProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const product = getProductById(id);
  const container = document.getElementById("product-detail");
  if (!product) {
    container.innerHTML = "<p class='text-center text-red-600'>Product not found.</p>";
    return;
  }
  container.innerHTML = `
    <div class="md:flex md:space-x-8">
      <img src="${product.image}" alt="${product.name}" class="w-full md:w-1/2 rounded-lg object-cover" />
      <div class="mt-6 md:mt-0 md:flex-1">
        <h1 class="text-3xl font-bold mb-4">${product.name}</h1>
        <p class="text-indigo-600 text-2xl font-semibold mb-4">$${product.price.toFixed(2)}</p>
        <p class="mb-6">${product.description}</p>
        <button onclick="addToCart(${product.id})" class="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition">Add to Cart</button>
      </div>
    </div>
  `;
}

// Render cart page items
function renderCartItems() {
  const cart = getCart();
  const container = document.getElementById("cart-items");
  const summary = document.getElementById("cart-summary");
  if (!container || !summary) return;

  if (cart.length === 0) {
    container.innerHTML = "<p class='text-center text-gray-500'>Your cart is empty.</p>";
    summary.classList.add("hidden");
    return;
  }

  let total = 0;
  let html = "<ul class='space-y-4'>";
  cart.forEach(item => {
    const product = getProductById(item.id);
    if (!product) return;
    const itemTotal = product.price * item.quantity;
    total += itemTotal;
    html += `
      <li class="flex items-center space-x-4 border-b pb-4">
        <img src="${product.image}" alt="${product.name}" class="w-24 h-24 object-cover rounded" />
        <div class="flex-1">
          <h2 class="font-semibold text-lg">${product.name}</h2>
          <p class="text-indigo-600 font-bold">$${product.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}</p>
        </div>
        <button onclick="removeFromCart(${product.id})" class="text-red-600 hover:text-red-800" aria-label="Remove ${product.name} from cart">
          <i class="fas fa-trash-alt fa-lg"></i>
        </button>
      </li>
    `;
  });
  html += "</ul>";
  container.innerHTML = html;
  document.getElementById("cart-total").textContent = total.toFixed(2);
  summary.classList.remove("hidden");
}

// Checkout button handler
function setupCheckout() {
  const checkoutBtn = document.getElementById("checkout-btn");
  if (!checkoutBtn) return;
  checkoutBtn.addEventListener("click", () => {
    alert("Checkout functionality is not implemented in this demo.");
  });
}

// Initialize page
function init() {
  updateCartCount();
  if (document.getElementById("product-detail")) {
    renderProductDetail();
  }
  if (document.getElementById("cart-items")) {
    renderCartItems();
    setupCheckout();
  }
}

document.addEventListener("DOMContentLoaded", init);

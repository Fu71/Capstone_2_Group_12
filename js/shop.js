// ==========================
// API
// ==========================

// Thay bằng link MockAPI của bạn
const BASE_URL = "https://6a1efb5cb79eec0d6cf061d6.mockapi.io/api/Product";

// ==========================
// Global Variables
// ==========================

let productList = [];
let cart = [];

// ==========================
// DOM
// ==========================

const productContainer = document.getElementById("productList");
const filterSelect = document.getElementById("filterType");

// ==========================
// Get Products
// ==========================

async function getProducts() {
  try {
    const response = await axios.get(BASE_URL);

    productList = response.data.map((item) => {
      return new Product(
        item.id,
        item.name,
        item.price,
        item.screen,
        item.backCamera,
        item.frontCamera,
        item.img || item.image,
        item.description,
        item.type,
      );
    });

    renderProducts(productList);
  } catch (error) {
    console.log(error);
  }
}

// ==========================
// Render Products
// ==========================

function renderProducts(products) {
  let html = "";

  products.forEach((product) => {
    html += `

<div class="bg-white rounded-xl shadow hover:shadow-xl transition duration-300 overflow-hidden">

    <img
        src="${product.img}"
        alt="${product.name}"
        class="w-full h-64 object-cover">

    <div class="p-4">

        <h2 class="text-xl font-bold">

            ${product.name}

        </h2>

        <p class="text-gray-500 mt-2">

            ${product.description}

        </p>

        <div class="mt-3 space-y-1">

            <p>

                <strong>Screen:</strong>
                ${product.screen}

            </p>

            <p>

                <strong>Back Camera:</strong>
                ${product.backCamera}

            </p>

            <p>

                <strong>Front Camera:</strong>
                ${product.frontCamera}

            </p>

        </div>

        <div class="flex justify-between items-center mt-5">

            <span class="text-red-600 text-2xl font-bold">

                $${product.price}

            </span>

            <button
                onclick="addToCart('${product.id}')"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">

                Thêm

            </button>

        </div>

    </div>

</div>

`;
  });

  productContainer.innerHTML = html;

  if (typeof initFlowbite === "function") {
    initFlowbite();
  }
}

// ==========================
// Filter
// ==========================

filterSelect.addEventListener("change", function () {
  const value = this.value;

  if (value === "all") {
    renderProducts(productList);

    return;
  }

  const result = productList.filter((product) => {
    return product.type.toLowerCase() === value.toLowerCase();
  });

  renderProducts(result);
});

// ==========================
// Cart DOM
// ==========================

const cartContainer = document.getElementById("cartList");
const totalPrice = document.getElementById("totalPrice");
const cartCount = document.getElementById("cartCount");

// ==========================
// Add To Cart
// ==========================

function addToCart(id) {
  const product = productList.find((item) => item.id == id);

  if (!product) return;

  const index = cart.findIndex((item) => item.id == id);

  if (index === -1) {
    cart.push(new CartItem(product));
  } else {
    cart[index].quantity++;
  }

  saveCart();

  renderCart();
}

// ==========================
// Render Cart
// ==========================

function renderCart() {
  let html = "";

  cart.forEach((item) => {
    html += `

<div class="border rounded-lg p-3 mb-4">

    <div class="flex gap-3">

        <img
            src="${item.img}"
            class="w-20 h-20 object-cover rounded">

        <div class="flex-1">

            <h3 class="font-bold">

                ${item.name}

            </h3>

            <p class="text-red-600">

                $${item.price}

            </p>

            <div class="flex items-center gap-2 mt-2">

                <button
                    onclick="decreaseQuantity('${item.id}')"
                    class="bg-gray-300 w-8 h-8 rounded">

                    -

                </button>

                <span>

                    ${item.quantity}

                </span>

                <button
                    onclick="increaseQuantity('${item.id}')"
                    class="bg-blue-600 text-white w-8 h-8 rounded">

                    +

                </button>

            </div>

        </div>

        <button
            onclick="removeItem('${item.id}')"
            class="text-red-600">

            <i class="fa-solid fa-trash"></i>

        </button>

    </div>

</div>

`;
  });

  cartContainer.innerHTML = html;

  updateBadge();

  updateTotal();
}

// ==========================
// Increase
// ==========================

function increaseQuantity(id) {
  const item = cart.find((product) => product.id == id);

  if (!item) return;

  item.quantity++;

  saveCart();

  renderCart();
}

// ==========================
// Decrease
// ==========================

function decreaseQuantity(id) {
  const item = cart.find((product) => product.id == id);

  if (!item) return;

  item.quantity--;

  if (item.quantity <= 0) {
    removeItem(id);

    return;
  }

  saveCart();

  renderCart();
}

// ==========================
// Remove
// ==========================

function removeItem(id) {
  cart = cart.filter((item) => item.id != id);

  saveCart();

  renderCart();
}

// ==========================
// Total Price
// ==========================

function updateTotal() {
  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  totalPrice.innerHTML = "$" + total.toLocaleString();
}

// ==========================
// Badge
// ==========================

function updateBadge() {
  const quantity = cart.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  cartCount.innerHTML = quantity;
}

// ==========================
// LOCAL STORAGE
// ==========================

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
  const data = localStorage.getItem("cart");

  if (data) {
    cart = JSON.parse(data);
  }
}

// ==========================
// CHECKOUT
// ==========================

const checkoutBtn = document.getElementById("checkoutBtn");

checkoutBtn.addEventListener("click", function () {
  if (cart.length === 0) {
    alert("Giỏ hàng trống!");
    return;
  }

  cart = [];

  saveCart();

  renderCart();

  showToast();
});

// ==========================
// TOAST
// ==========================

function showToast() {
  const toast = document.getElementById("toast-success");

  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2000);
}

// ==========================
// INIT APP
// ==========================

function init() {
  loadCart();

  renderCart();

  getProducts();
}

// ==========================
// RUN APP
// ==========================

init();

// ==========================
// Init
// ==========================

getProducts();

addToCart();

renderCart();

updateBadge();

increase();

decrease();

remove();

calcTotal();

saveLocalStorage();

loadLocalStorage();

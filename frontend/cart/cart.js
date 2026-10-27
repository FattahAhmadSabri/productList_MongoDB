const API_URL = "http://localhost:4000";

const cartList = document.getElementById("cartList");
const message = document.getElementById("message");
const itemCount = document.getElementById("itemCount");
const subtotalElement = document.getElementById("subtotal");
const totalElement = document.getElementById("total");
const checkoutBtn = document.getElementById("checkoutBtn");
const refreshBtn = document.getElementById("refreshBtn");
const logoutBtn = document.getElementById("logoutBtn");

const token = sessionStorage.getItem("token");

let cartItems = [];

if (!token) {
  window.location.href = "../index.html";
}

const headers = {
  Authorization: `Bearer ${token}`,
};

function formatPrice(price) {
  return `₹${Number(price).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function showMessage(text, type = "") {
  message.textContent = text;
  message.className = `message ${type}`;
}

// Load cart items
async function getCart() {
  try {
    cartList.innerHTML = '<p class="empty-state">Loading your cart...</p>';

    const response = await axios.get(`${API_URL}/cart`, {
      headers,
    });

    const result = response.data.data;

    cartItems = Array.isArray(result.data)
      ? result.data
      : Array.isArray(result.data?.items)
        ? result.data.items
        : Array.isArray(result)
          ? result
          : [];

    displayCart();
    showMessage("");
  } catch (error) {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("token");
      window.location.href = "../index.html";
      return;
    }

    cartList.innerHTML =
      '<p class="empty-state">Unable to load cart items.</p>';

    showMessage(
      error.response?.data?.message || "Failed to load cart.",
      "error",
    );
  }
}

// Display cart items
function displayCart() {
  cartList.innerHTML = "";

  if (cartItems.length === 0) {
    cartList.innerHTML = `
      <div class="empty-state">
        <h3>Your cart is empty</h3>
        <p>Add some products to get started.</p>
      </div>
    `;
  }

  let subtotal = 0;
  let totalQuantity = 0;

  cartItems.forEach((item) => {
    const product = typeof item.productId === "object" ? item.productId : null;

    if (!product) return;

    const quantity = Number(item.quantity) || 1;
    const price = Number(item.price ?? product.price) || 0;
    const lineTotal = price * quantity;

    subtotal += lineTotal;
    totalQuantity += quantity;

    const article = document.createElement("article");
    article.className = "cart-item";

    const image = document.createElement("img");
    image.className = "cart-image";
    image.alt = product.title || "Product";
    image.src = product.imageUrl || product.image || "";
    image.onerror = () => {
      image.onerror = null;
      image.src = "https://placehold.co/200x200?text=No+Image";
    };

    const details = document.createElement("div");

    const title = document.createElement("h3");
    title.className = "cart-title";
    title.textContent = product.title || "Product";

    const priceElement = document.createElement("p");
    priceElement.className = "cart-price";
    priceElement.textContent = formatPrice(price);

    const quantityControls = document.createElement("div");
    quantityControls.className = "quantity-controls";

    const decreaseBtn = document.createElement("button");
    decreaseBtn.className = "quantity-btn";
    decreaseBtn.textContent = "−";
    decreaseBtn.disabled = quantity <= 1;
    decreaseBtn.setAttribute("aria-label", "Decrease quantity");

    decreaseBtn.addEventListener("click", () => {
      updateQuantity(product._id, "decrease");
    });

    const quantityText = document.createElement("span");
    quantityText.className = "quantity";
    quantityText.textContent = quantity;

    const increaseBtn = document.createElement("button");
    increaseBtn.className = "quantity-btn";
    increaseBtn.textContent = "+";
    increaseBtn.setAttribute("aria-label", "Increase quantity");

    increaseBtn.addEventListener("click", () => {
      updateQuantity(product._id, "increase");
    });

    quantityControls.append(decreaseBtn, quantityText, increaseBtn);

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Remove";

    removeBtn.addEventListener("click", () => {
      removeFromCart(product._id);
    });

    details.append(title, priceElement, quantityControls, removeBtn);

    const lineTotalElement = document.createElement("div");
    lineTotalElement.className = "line-total";
    lineTotalElement.textContent = formatPrice(lineTotal);

    article.append(image, details, lineTotalElement);
    cartList.appendChild(article);
  });

  itemCount.textContent = totalQuantity;
  subtotalElement.textContent = formatPrice(subtotal);
  totalElement.textContent = formatPrice(subtotal);

  checkoutBtn.disabled = cartItems.length === 0;
}

// Increase or decrease quantity
async function updateQuantity(productId, action) {
  try {
    await axios.patch(`${API_URL}/cart/${productId}`, { action }, { headers });

    await getCart();
  } catch (error) {
    showMessage(
      error.response?.data?.message || "Unable to update quantity.",
      "error",
    );
  }
}

// Remove an item from cart
async function removeFromCart(productId) {
  try {
    await axios.delete(`${API_URL}/cartproduct/${productId}`, {
      headers,
    });

    showMessage("Product removed from cart.", "success");
    await getCart();
  } catch (error) {
    showMessage(
      error.response?.data?.message || "Unable to remove product.",
      "error",
    );
  }
}

// Refresh cart
refreshBtn.addEventListener("click", getCart);

// Checkout placeholder
checkoutBtn.addEventListener("click", () => {
  if (cartItems.length === 0) return;

  // Update this path to match your actual checkout page.
  window.location.href = "../order/order.html";
});

// Logout
logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem("token");
  window.location.href = "../index.html";
});

// Initial load
if (token) {
  getCart();
}

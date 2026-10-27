const API_URL = "http://localhost:4000";

const token = sessionStorage.getItem("token");

const orderItems = document.getElementById("orderItems");
const itemCount = document.getElementById("itemCount");
const subtotalElement = document.getElementById("subtotal");
const totalElement = document.getElementById("total");
const placeOrderBtn = document.getElementById("placeOrderBtn");
const message = document.getElementById("message");

let cartItems = [];
let isPlacingOrder = false;

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

async function loadCart() {
  try {
    const response = await axios.get(`${API_URL}/cart`, {
      headers,
    });

    const result = response.data;

    cartItems = Array.isArray(result.data) ? result.data : [];

    renderOrder();
  } catch (error) {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("token");
      window.location.href = "../index.html";
      return;
    }

    showMessage(
      error.response?.data?.message || "Unable to load cart.",
      "error",
    );

    orderItems.textContent = "Could not load your cart items.";
  }
}

function renderOrder() {
  orderItems.innerHTML = "";

  if (cartItems.length === 0) {
    orderItems.innerHTML =
      '<p class="empty-state">Your cart is empty. Add products before checkout.</p>';

    itemCount.textContent = "0";
    subtotalElement.textContent = formatPrice(0);
    totalElement.textContent = formatPrice(0);
    placeOrderBtn.disabled = true;
    return;
  }

  let subtotal = 0;
  let quantityTotal = 0;

  cartItems.forEach((item) => {
    const product = typeof item.productId === "object" ? item.productId : null;

    const quantity = Number(item.quantity) || 1;
    const price = Number(item.price) || 0;
    const lineTotal = price * quantity;

    subtotal += lineTotal;
    quantityTotal += quantity;

    const row = document.createElement("div");
    row.className = "order-item";

    const details = document.createElement("div");

    const name = document.createElement("p");
    name.className = "product-name";
    name.textContent = product?.title || "Product";

    const info = document.createElement("p");
    info.className = "product-info";
    info.textContent = `${formatPrice(price)} × ${quantity}`;

    details.append(name, info);

    const amount = document.createElement("span");
    amount.className = "product-total";
    amount.textContent = formatPrice(lineTotal);

    row.append(details, amount);
    orderItems.appendChild(row);
  });

  itemCount.textContent = quantityTotal;
  subtotalElement.textContent = formatPrice(subtotal);
  totalElement.textContent = formatPrice(subtotal);
  placeOrderBtn.disabled = false;
}

placeOrderBtn.addEventListener("click", async () => {
  if (isPlacingOrder || cartItems.length === 0) return;

  try {
    isPlacingOrder = true;
    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = "Placing Order...";
    showMessage("");

    // Assumes your backend route is POST /order.
    const response = await axios.post(`${API_URL}/order`, {}, { headers });

    showMessage(
      response.data.message || "Order placed successfully!",
      "success",
    );

    orderItems.innerHTML =
      '<p class="empty-state">Your order has been placed successfully.</p>';

    itemCount.textContent = "0";
    subtotalElement.textContent = formatPrice(0);
    totalElement.textContent = formatPrice(0);
  } catch (error) {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("token");
      window.location.href = "../index.html";
      return;
    }

    showMessage(
      error.response?.data?.message || "Unable to place order.",
      "error",
    );
  } finally {
    isPlacingOrder = false;
    placeOrderBtn.textContent = "Place Order";
    placeOrderBtn.disabled = cartItems.length === 0;
  }
});

loadCart();

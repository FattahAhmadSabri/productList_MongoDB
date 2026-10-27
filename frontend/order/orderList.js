const API_URL = "http://localhost:4000";

const ordersList = document.getElementById("ordersList");
const message = document.getElementById("message");
const refreshBtn = document.getElementById("refreshBtn");
const logoutBtn = document.getElementById("logoutBtn");

const token = sessionStorage.getItem("token");

if (!token) {
  window.location.href = "../index.html";
}

const headers = {
  Authorization: `Bearer ${token}`,
};

function formatPrice(price) {
  return `₹${Number(price || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date) {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function showMessage(text, type = "") {
  message.textContent = text;
  message.className = `message ${type}`;
}

async function getOrders() {
  ordersList.innerHTML = '<p class="empty-state">Loading your orders...</p>';

  try {
    const response = await axios.get(`${API_URL}/order`, {
      headers,
    });

    const result = response.data;
    const orders = Array.isArray(result.data) ? result.data : [];

    displayOrders(orders);
    showMessage("");
  } catch (error) {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("token");
      window.location.href = "../index.html";
      return;
    }

    ordersList.innerHTML =
      '<p class="empty-state">Unable to load your orders.</p>';

    showMessage(
      error.response?.data?.message || "Failed to fetch orders.",
      "error",
    );
  }
}

function displayOrders(orders) {
  ordersList.innerHTML = "";

  if (orders.length === 0) {
    ordersList.innerHTML = `
      <div class="empty-state">
        <h3>No orders yet</h3>
        <p>Your orders will appear here after you place an order.</p>
      </div>
    `;
    return;
  }

  orders.forEach((order) => {
    const product =
      order.productId && typeof order.productId === "object"
        ? order.productId
        : null;

    const quantity = Number(order.quantity) || 1;
    const price = Number(order.price) || 0;
    const status = order.status || "pending";

    const card = document.createElement("article");
    card.className = "order-card";

    const top = document.createElement("div");
    top.className = "order-top";

    const orderInfo = document.createElement("div");

    const orderId = document.createElement("p");
    orderId.className = "order-id";
    orderId.textContent = `Order ID: ${order._id}`;

    const date = document.createElement("p");
    date.className = "order-date";
    date.textContent = `Placed on: ${formatDate(order.createdAt)}`;

    orderInfo.append(orderId, date);

    const statusBadge = document.createElement("span");
    statusBadge.className = `status ${status}`;
    statusBadge.textContent = status;

    top.append(orderInfo, statusBadge);

    const details = document.createElement("div");
    details.className = "order-details";

    const productInfo = document.createElement("div");

    const productName = document.createElement("p");
    productName.className = "product-name";
    productName.textContent = product?.title || "Product details unavailable";

    const productDescription = document.createElement("p");
    productDescription.className = "product-info";
    productDescription.textContent = `Quantity: ${quantity} · Unit price: ${formatPrice(price)}`;

    productInfo.append(productName, productDescription);

    const orderPrice = document.createElement("p");
    orderPrice.className = "order-price";
    orderPrice.textContent = formatPrice(price * quantity);

    details.append(productInfo, orderPrice);
    card.append(top, details);
    ordersList.appendChild(card);
  });
}

refreshBtn.addEventListener("click", getOrders);

logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem("token");
  window.location.href = "../index.html";
});

if (token) {
  getOrders();
}

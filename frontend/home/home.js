const API_URL = "http://localhost:4000";

const productList = document.getElementById("productList");
const searchInput = document.getElementById("searchInput");
const message = document.getElementById("message");
const logoutBtn = document.getElementById("logoutBtn");

const token = sessionStorage.getItem("token");

let products = [];

// Check whether the user is logged in
if (!token) {
  window.location.href = "login.html";
}

// Get products from the backend
async function getProducts() {
  try {
    message.textContent = "Loading products...";

    const response = await axios.get(`${API_URL}/product`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = response.data;

    // Supports either an array or { data: [...] }
    products = Array.isArray(result) ? result : result.data;

    if (!Array.isArray(products)) {
      throw new Error("Invalid product response from server.");
    }

    message.textContent = "";
    displayProducts(products);
  } catch (error) {
    message.textContent =
      error.response?.data?.message ||
      error.message ||
      "Unable to load products.";

    message.className = "message error";
    productList.innerHTML = "";
  }
}

// Display product cards
function displayProducts(productData) {
  productList.innerHTML = "";

  if (productData.length === 0) {
    productList.innerHTML = '<p class="empty-state">No products found.</p>';
    return;
  }

  productData.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const image = document.createElement("img");
    image.className = "product-image";
    image.alt = product.title || "Product image";
    image.src = product.imageUrl || product.image || "";
    image.onerror = () => {
      image.onerror = null;
      image.src = "https://placehold.co/400x300?text=No+Image";
    };

    const details = document.createElement("div");
    details.className = "product-details";

    const title = document.createElement("h2");
    title.className = "product-title";
    title.textContent = product.title || "Untitled product";

    const description = document.createElement("p");
    description.className = "product-description";
    description.textContent =
      product.description || "No description available.";

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = `₹${Number(product.price).toLocaleString("en-IN")}`;

    const button = document.createElement("button");
    button.className = "add-cart-btn";
    button.textContent = "Add to Cart";

    button.addEventListener("click", () => {
      addToCart(product._id, button);
    });

    details.append(title, description, price, button);
    card.append(image, details);
    productList.appendChild(card);
  });
}

// Search products by title
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredProducts = products.filter((product) =>
    (product.title || "").toLowerCase().includes(searchTerm),
  );

  displayProducts(filteredProducts);
});

// Add product to cart
async function addToCart(productId, button) {
  try {
    button.disabled = true;
    button.textContent = "Adding...";

    const response = await axios.post(
      `${API_URL}/cart`,
      { productId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    message.textContent = response.data.message || "Product added to cart!";

    message.className = "message success";
  } catch (error) {
    message.textContent =
      error.response?.data?.message || "Unable to add product to cart.";

    message.className = "message error";

    // Invalid or expired token
    if (error.response?.status === 401) {
      sessionStorage.removeItem("token");
      window.location.href = "login.html";
    }
  } finally {
    button.disabled = false;
    button.textContent = "Add to Cart";
  }
}

// Logout
logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem("token");
  window.location.href = "login.html";
});

// Load products when the page opens
if (token) {
  getProducts();
}

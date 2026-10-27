const API_URL = "http://localhost:4000";

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const loginBtn = document.getElementById("loginBtn");

document.querySelectorAll(".toggle-password").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.target);
    const isPassword = input.type === "password";

    input.type = isPassword ? "text" : "password";
    button.textContent = isPassword ? "Hide" : "Show";
  });
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  message.className = "message";
  message.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    message.textContent = "Please enter your email and password.";
    message.className = "message error";
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = "Signing in...";

  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    const result = response.data;

    if (result.success === false) {
      throw new Error(result.message || "Login failed.");
    }

    const token =
      result.token ||
      result.data?.token ||
      result.accessToken ||
      result.data?.accessToken;

    if (!token) {
      throw new Error("Login succeeded, but no token was received.");
    }

    sessionStorage.setItem("token", token);

    message.textContent = result.message || "Login successful!";
    message.className = "message success";

    window.location.href = "home/home.html";
  } catch (error) {
    message.textContent =
      error.response?.data?.message ||
      error.message ||
      "Unable to connect to the server.";

    message.className = "message error";
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "Sign in";
  }
});

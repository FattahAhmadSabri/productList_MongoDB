const API_URL = "http://localhost:4000";

const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");
const registerBtn = document.getElementById("registerBtn");

document.querySelectorAll(".toggle-password").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.target);
    const isPassword = input.type === "password";

    input.type = isPassword ? "text" : "password";
    button.textContent = isPassword ? "Hide" : "Show";
  });
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  message.className = "message";
  message.textContent = "";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    message.textContent = "Please fill in all fields.";
    message.className = "message error";
    return;
  }

  if (password.length < 8) {
    message.textContent = "Password must contain at least 8 characters.";
    message.className = "message error";
    return;
  }

  registerBtn.disabled = true;
  registerBtn.textContent = "Creating account...";

  try {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
    });

    const result = await response.json();

    if (!response.ok || result.success === false) {
      throw new Error(result.message || "Registration failed.");
    }

    message.textContent = result.message || "Account created successfully!";
    message.className = "message success";

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  } catch (error) {
    message.textContent = error.message || "Unable to connect to the server.";
    message.className = "message error";
  } finally {
    registerBtn.disabled = false;
    registerBtn.textContent = "Create account";
  }
});

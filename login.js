const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const rememberCheckbox = document.getElementById("remember");

// Load saved username/password if Remember Me was checked
window.onload = () => {
  const remembered = JSON.parse(localStorage.getItem("rememberMe"));
  if (remembered) {
    usernameInput.value = remembered.username;
    passwordInput.value = remembered.password;
    rememberCheckbox.checked = true;
  }
};

// Login submit
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  const users = JSON.parse(localStorage.getItem("users")) || {};

  // ✅ Validate against stored users
  if (users[username] && users[username].password === password) {
    // Save current user (important for dashboard)
    localStorage.setItem("currentUser", username);

    // Save Remember Me info if checked
    if (rememberCheckbox.checked) {
      localStorage.setItem(
        "rememberMe",
        JSON.stringify({ username: username, password: password })
      );
    } else {
      localStorage.removeItem("rememberMe");
    }

    alert("Login successful! 🎉");
    // Redirect to dashboard
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid username or password!");
  }
});

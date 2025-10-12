const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const rememberCheckbox = document.getElementById("remember");

// Toast Message Function 
function showMessage(message, success = true) {
  const box = document.getElementById("message-box");

  // If message box doesn’t exist 
  if (!box) return;

  box.textContent = message;
  box.style.backgroundColor = success ? "#4CAF50" : "#f44336"; 
  box.style.display = "block";

  // Hide after 3 seconds
  setTimeout(() => {
    box.style.display = "none";
  }, 3000);
}


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
  e.preventDefault(); // Stop page reload

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  const users = JSON.parse(localStorage.getItem("users")) || {};

  //  Validate against stored users
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

    // alert with custom message
    showMessage("Login successful! 🎉", true);

    // Redirect after short delay
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);
  } else {
    // alert with custom error message
    showMessage("Invalid username or password!", false);
  }
});
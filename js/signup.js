const signupForm = document.getElementById("signupForm");

// Toast Message Function 
function showMessage(message, success = true) {
  const box = document.getElementById("message-box");

  if (!box) return;

  box.textContent = message;
  box.style.backgroundColor = success ? "#4CAF50" : "#f44336"; 
  box.style.display = "block";

  // Hide after 3 seconds
  setTimeout(() => {
    box.style.display = "none";
  }, 3000);
}

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  // Validation
  if (!username || !email || !password || !confirmPassword) {
    showMessage("Please fill all fields", false); 
    return;
  }

  if (password !== confirmPassword) {
    showMessage("Passwords do not match!", false); 
    return;
  }

  // Store in localStorage
  const users = JSON.parse(localStorage.getItem("users")) || {};
  users[username] = { email: email, password: password };
  localStorage.setItem("users", JSON.stringify(users));

  // Success toast
  showMessage("Signup successful! 🎉", true);

  signupForm.reset();

  // Redirect after a short delay so user sees the toast
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
});
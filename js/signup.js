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

  // Regex patterns
  const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/; // 3–16 chars, letters/numbers/underscore
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  // At least 8 chars, 1 uppercase, 1 number, 1 special char

  // Validation
  if (!username || !email || !password || !confirmPassword) {
    showMessage("Please fill all fields", false);
    return;
  }

  if (!usernameRegex.test(username)) {
    showMessage("Username must be 3–16 characters (letters, numbers, or underscores)", false);
    return;
  }

  if (!emailRegex.test(email)) {
    showMessage("Please enter a valid email address", false);
    return;
  }

  if (!passwordRegex.test(password)) {
    showMessage("Password must be 8+ chars, include 1 uppercase, 1 number, and 1 special symbol", false);
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

  // Redirect after a short delay
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
});

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (!username || !email || !password || !confirmPassword) {
    alert("Please fill all fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // ✅ Store in localStorage
  const users = JSON.parse(localStorage.getItem("users")) || {}; // get existing users
  users[username] = { email: email, password: password };        // save new user
  localStorage.setItem("users", JSON.stringify(users));

  alert("Signup successful! 🎉");

  signupForm.reset();

  // Redirect to login page
  window.location.href = "login.html";
});

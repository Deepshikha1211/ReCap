// ======== Elements ========
const usernameDisplay = document.getElementById("username");
const toast = document.getElementById("toast");
const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");

// ======== Toast ========
function showToast(message, type = "success") {
  toast.textContent = message;
  toast.className = type;
  toast.style.display = "block";
  setTimeout(() => (toast.style.display = "none"), 2000);
}

// ======== On Load ========
window.onload = () => {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }
  usernameDisplay.textContent = currentUser;

  loadDashboardData();
  showToast(`Welcome back, ${currentUser}! 🎉`);
};

// ======== Dashboard Data ========
function loadDashboardData() {
  const flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
  const learnedCount = flashcards.filter(f => f.learned).length;

  document.getElementById("totalFlashcards").textContent = flashcards.length;
  document.getElementById("learnedFlashcards").textContent = learnedCount;
  document.getElementById("recentActivity").textContent =
    flashcards.length > 0
      ? `Last added: ${flashcards[flashcards.length - 1].question}`
      : "No activity yet";

  const percent = flashcards.length
    ? Math.round((learnedCount / flashcards.length) * 100)
    : 0;
  progressFill.style.width = percent + "%";
  progressPercent.textContent = percent + "%";
}

// ======== Search ========
document.getElementById("searchInput").addEventListener("input", e => {
  const query = e.target.value.toLowerCase();
  showToast(`Searching for "${query}"`, "success");
});

// ======== Sidebar Menu ========
document.getElementById("menuDashboard").onclick = () =>
  showToast("You're already on Dashboard!");
document.getElementById("menuCreate").onclick = () => {
  showToast("Opening flashcard creator...", "success");
  setTimeout(() => (window.location.href = "create.html"), 1200);
};
document.getElementById("menuView").onclick = () => {
  showToast("Opening flashcard list...", "success");
  setTimeout(() => (window.location.href = "view.html"), 1200);
};
document.getElementById("menuLogout").onclick = () => {
  localStorage.removeItem("currentUser");
  showToast("Logging out...", "error");
  setTimeout(() => (window.location.href = "login.html"), 1500);
};

// ======== Elements ========
const usernameDisplay = document.getElementById("username");
const toast = document.getElementById("toast");
const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");
const totalFlashcardsEl = document.getElementById("totalFlashcards");
const learnedFlashcardsEl = document.getElementById("learnedFlashcards");
const recentActivityEl = document.getElementById("recentActivity");

// ======== Toast Notification ========
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

  updateDashboard();
  showToast(`Welcome back, ${currentUser}! 🎉`);
};

// ======== UPDATE DASHBOARD DATA ========
function updateDashboard() {
  const folders = JSON.parse(localStorage.getItem("folders")) || {};

  let totalFlashcards = 0;
  let learnedFlashcards = 0;
  let recentQuestion = "No activity yet";
  let recentTime = 0;

  Object.keys(folders).forEach(folderName => {
    const flashcards = folders[folderName];

    totalFlashcards += flashcards.length;
    learnedFlashcards += flashcards.filter(f => f.learned).length;

    // Most recent flashcard (if we ever store timestamps)
    flashcards.forEach(f => {
      if (f.createdAt && f.createdAt > recentTime) {
        recentTime = f.createdAt;
        recentQuestion = f.question;
      }
    });
  });

  // Update dashboard stats
  totalFlashcardsEl.textContent = totalFlashcards;
  learnedFlashcardsEl.textContent = learnedFlashcards;
  recentActivityEl.textContent =
    totalFlashcards > 0 ? `Last added: ${recentQuestion}` : "No activity yet";

  const percent =
    totalFlashcards === 0
      ? 0
      : Math.round((learnedFlashcards / totalFlashcards) * 100);

  progressFill.style.width = percent + "%";
  progressPercent.textContent = percent + "%";
}


// ======== SIDEBAR MENU ========
document.getElementById("menuDashboard").onclick = () =>
  showToast("You're already on Dashboard!");

document.getElementById("menuCreate").onclick = () => {
  showToast("Opening flashcard creator...", "success");
  setTimeout(() => (window.location.href = "create.html"), 1000);
};

document.getElementById("menuView").onclick = () => {
  showToast("Opening flashcard list...", "success");
  setTimeout(() => (window.location.href = "view.html"), 1000);
};

document.getElementById("menuLogout").onclick = () => {
  localStorage.removeItem("currentUser");
  showToast("Logging out...", "error");
  setTimeout(() => (window.location.href = "login.html"), 1000);
};

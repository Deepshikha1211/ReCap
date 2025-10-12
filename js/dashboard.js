// ======== Elements ========
const usernameDisplay = document.getElementById("username");
const toast = document.getElementById("toast");
const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");
const totalFlashcardsEl = document.getElementById("totalFlashcards");
const learnedFlashcardsEl = document.getElementById("learnedFlashcards");
const recentActivityEl = document.getElementById("recentActivity");

const currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
  window.location.href = "index.html";
}
usernameDisplay.textContent = currentUser;

// ======== Toast Notification ========
function showToast(message, type = "success") {
  toast.textContent = message;
  toast.className = type;
  toast.style.display = "block";
  setTimeout(() => (toast.style.display = "none"), 2000);
}

// ======== UPDATE DASHBOARD DATA ========
function updateDashboard() {
  const folders = JSON.parse(localStorage.getItem("folders_" + currentUser)) || {};

  let totalFlashcards = 0;
  let learnedFlashcards = 0;
  let recentQuestion = "No activity yet";
  let recentTime = 0;

  Object.keys(folders).forEach(folderName => {
    const flashcards = folders[folderName];

    totalFlashcards += flashcards.length;
    learnedFlashcards += flashcards.filter(f => f.learned).length;

    flashcards.forEach(f => {
      if (f.createdAt && f.createdAt > recentTime) {
        recentTime = f.createdAt;
        recentQuestion = f.question;
      }
    });
  });

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

// ======== On Load ========
window.onload = () => {
  updateDashboard();
  showToast(`Welcome back, ${currentUser}! 🎉`);
};

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
  setTimeout(() => (window.location.href = "index.html"), 1000);
};

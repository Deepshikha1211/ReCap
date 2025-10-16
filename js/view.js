const foldersContainer = document.getElementById("foldersContainer");
const flashcardsSection = document.getElementById("flashcardsSection");
const flashcardsContainer = document.getElementById("flashcardsContainer");
const backToFolders = document.getElementById("backToFolders");
const folderTitle = document.getElementById("folderTitle");
const searchInput = document.getElementById("searchInput");

const currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
  window.location.href = "index.html";
}

let currentFolderName = null;

// ====== Escape HTML to prevent broken layout ======
function escapeHTML(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ================== SHOW FOLDERS ==================
function renderFolders() {
  const folders = JSON.parse(localStorage.getItem("folders_" + currentUser)) || {};
  foldersContainer.innerHTML = "";

  if (Object.keys(folders).length === 0) {
    foldersContainer.innerHTML = `<p style="text-align:center;">No folders yet. Create some from the <b>Create Flashcard</b> page!</p>`;
    return;
  }

  Object.keys(folders).forEach(folder => {
    const div = document.createElement("div");
    div.className = "folder-card";
    div.innerHTML = `<i class="fas fa-folder"></i><h3>${escapeHTML(folder)}</h3>`;
    div.onclick = () => openFolder(folder);
    foldersContainer.appendChild(div);
  });
}

// ================== OPEN FOLDER ==================
function openFolder(folderName) {
  currentFolderName = folderName;
  folderTitle.textContent = folderName;
  foldersContainer.style.display = "none";
  flashcardsSection.style.display = "block";
  renderFlashcards();
}

// ================== SHOW FLASHCARDS ==================
function renderFlashcards(filter = "") {
  const data = JSON.parse(localStorage.getItem("folders_" + currentUser)) || {};
  const flashcards = data[currentFolderName] || [];

  const filtered = flashcards
    .map((f, i) => ({ ...f, index: i }))
    .filter(f => f.question.toLowerCase().includes(filter.toLowerCase()));

  flashcardsContainer.innerHTML = "";

  if (filtered.length === 0) {
    flashcardsContainer.innerHTML = "<p>No flashcards found in this folder.</p>";
    return;
  }

  filtered.forEach(f => {
    const card = document.createElement("div");
    card.className = "flashcard";
    const learnedStyle = f.learned ? 'style="box-shadow: 0 0 10px #2ecc71;"' : "";

    card.innerHTML = `
      <div class="flashcard-inner" ${learnedStyle}>
        <div class="flashcard-front">${escapeHTML(f.question)}</div>
        <div class="flashcard-back">${escapeHTML(f.answer)}</div>
      </div>
      <div class="card-actions">
        <button class="learn-btn" data-index="${f.index}"><i class="fas fa-check"></i></button>
        <button class="delete-btn" data-index="${f.index}"><i class="fas fa-trash"></i></button>
      </div>
    `;

    // Flip card on click
    card.querySelector(".flashcard-inner").onclick = () => card.classList.toggle("flipped");

    // Delete button
    card.querySelector(".delete-btn").onclick = (e) => {
      e.stopPropagation();
      const btn = e.target.closest("button");
      if (!btn) return;
      deleteFlashcard(Number(btn.dataset.index));
    };

    // Mark as learned
    card.querySelector(".learn-btn").onclick = (e) => {
      e.stopPropagation();
      const btn = e.target.closest("button");
      if (!btn) return;
      markLearned(Number(btn.dataset.index));
    };

    flashcardsContainer.appendChild(card);
  });
}

// ================== DELETE FLASHCARD ==================
function deleteFlashcard(index) {
  const data = JSON.parse(localStorage.getItem("folders_" + currentUser)) || {};
  data[currentFolderName].splice(index, 1);
  localStorage.setItem("folders_" + currentUser, JSON.stringify(data));
  renderFlashcards(searchInput.value);
}

// ================== MARK LEARNED ==================
function markLearned(index) {
  const data = JSON.parse(localStorage.getItem("folders_" + currentUser)) || {};
  data[currentFolderName][index].learned = true;
  localStorage.setItem("folders_" + currentUser, JSON.stringify(data));
  renderFlashcards(searchInput.value);
}

// ================== SEARCH ==================
searchInput.addEventListener("input", (e) => {
  if (currentFolderName) renderFlashcards(e.target.value);
});

// ================== BACK TO FOLDERS ==================
backToFolders.onclick = () => {
  flashcardsSection.style.display = "none";
  foldersContainer.style.display = "grid";
  searchInput.value = "";
  currentFolderName = null;
};

// ================== QUIZ MODE ==================
const startQuizBtn = document.getElementById("startQuizBtn");
const quizModal = document.getElementById("quizModal");
const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const quizFeedback = document.getElementById("quizFeedback");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");
const closeQuizBtn = document.getElementById("closeQuizBtn");

let currentQuestionIndex = 0;
let questions = [];
let quizCards = [];

// Start quiz
startQuizBtn.addEventListener("click", () => {
  const data = JSON.parse(localStorage.getItem("folders_" + currentUser)) || {};
  const flashcards = data[currentFolderName] || [];

  if (flashcards.length === 0) {
    alert("No flashcards available for quiz!");
    return;
  }

  // Build questions
  questions = flashcards.map(card => ({
    question: card.question,
    correct: card.answer
  }));

  quizCards = flashcards;
  currentQuestionIndex = 0;
  document.body.classList.add("quiz-active");
  quizModal.style.display = "flex";
  showQuestion();
});

function showQuestion() {
  const q = questions[currentQuestionIndex];
  quizFeedback.textContent = "";
  quizOptions.innerHTML = "";
  quizQuestion.textContent = q.question;

  // Generate 3 random wrong answers
  const wrongAnswers = quizCards
    .map(c => c.answer)
    .filter(ans => ans !== q.correct)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const options = [...wrongAnswers, q.correct].sort(() => 0.5 - Math.random());

  options.forEach(opt => {
    const div = document.createElement("div");
    div.classList.add("quiz-option");
    div.textContent = opt;
    div.addEventListener("click", () => checkAnswer(div, q.correct));
    quizOptions.appendChild(div);
  });

  nextQuestionBtn.style.display = "none";
}

function checkAnswer(selected, correctAnswer) {
  const allOptions = document.querySelectorAll(".quiz-option");
  allOptions.forEach(opt => opt.style.pointerEvents = "none");

  if (selected.textContent === correctAnswer) {
    selected.classList.add("correct");
    quizFeedback.textContent = "✅ Correct!";
  } else {
    selected.classList.add("wrong");
    quizFeedback.textContent = `❌ Wrong! Correct: ${correctAnswer}`;
  }

  nextQuestionBtn.style.display = "inline-block";
}

nextQuestionBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex >= questions.length) {
    quizFeedback.textContent = "🎉 Quiz Completed!";
    quizOptions.innerHTML = "";
    nextQuestionBtn.style.display = "none";
  } else {
    showQuestion();
  }
});

closeQuizBtn.addEventListener("click", () => {
  quizModal.style.display = "none";
  document.body.classList.remove("quiz-active");
});



// Initialize folders on page load
renderFolders();

const foldersContainer = document.getElementById("foldersContainer");
const flashcardsSection = document.getElementById("flashcardsSection");
const flashcardsContainer = document.getElementById("flashcardsContainer");
const backToFolders = document.getElementById("backToFolders");
const folderTitle = document.getElementById("folderTitle");
const searchInput = document.getElementById("searchInput");

let currentFolder = null;

// ================== SHOW FOLDERS ==================
function renderFolders() {
  const folders = JSON.parse(localStorage.getItem("folders")) || {};
  foldersContainer.innerHTML = "";

  if (Object.keys(folders).length === 0) {
    foldersContainer.innerHTML = `<p style="text-align:center;">No folders yet. Create some from the <b>Create Flashcard</b> page!</p>`;
    return;
  }

  Object.keys(folders).forEach(folder => {
    const div = document.createElement("div");
    div.className = "folder-card";
    div.innerHTML = `<i class="fas fa-folder"></i><h3>${folder}</h3>`;
    div.onclick = () => openFolder(folder);
    foldersContainer.appendChild(div);
  });
}

// ================== OPEN FOLDER ==================
function openFolder(folderName) {
  currentFolder = folderName;
  folderTitle.textContent = folderName;
  foldersContainer.style.display = "none";
  flashcardsSection.style.display = "block";
  renderFlashcards();
}

// ================== SHOW FLASHCARDS OF SELECTED FOLDER ==================
function renderFlashcards(filter = "") {
  const data = JSON.parse(localStorage.getItem("folders")) || {};
  const flashcards = data[currentFolder] || [];

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
        <div class="flashcard-front">${f.question}</div>
        <div class="flashcard-back">${f.answer}</div>
      </div>
      <div class="card-actions">
        <button class="learn-btn" data-index="${f.index}"><i class="fas fa-check"></i></button>
        <button class="delete-btn" data-index="${f.index}"><i class="fas fa-trash"></i></button>
      </div>
    `;

    card.querySelector(".flashcard-inner").onclick = () => card.classList.toggle("flipped");

    // Delete & Learn buttons
    card.querySelector(".delete-btn").onclick = (e) => {
      e.stopPropagation();
      deleteFlashcard(e.target.closest("button").dataset.index);
    };
    card.querySelector(".learn-btn").onclick = (e) => {
      e.stopPropagation();
      markLearned(e.target.closest("button").dataset.index);
    };

    flashcardsContainer.appendChild(card);
  });
}

// ================== DELETE FLASHCARD ==================
function deleteFlashcard(index) {
  const data = JSON.parse(localStorage.getItem("folders")) || {};
  data[currentFolder].splice(Number(index), 1);
  localStorage.setItem("folders", JSON.stringify(data));
  renderFlashcards(searchInput.value);
}

// ================== MARK LEARNED ==================
function markLearned(index) {
  const data = JSON.parse(localStorage.getItem("folders")) || {};
  data[currentFolder][index].learned = true;
  localStorage.setItem("folders", JSON.stringify(data));
  renderFlashcards(searchInput.value);
}

// ================== SEARCH LISTENER ==================
searchInput.addEventListener("input", (e) => {
  if (currentFolder) renderFlashcards(e.target.value);
});

// ================== BACK TO FOLDERS ==================
backToFolders.onclick = () => {
  flashcardsSection.style.display = "none";
  foldersContainer.style.display = "grid";
  searchInput.value = "";
  currentFolder = null;
};

// ================== INITIAL LOAD ==================
renderFolders();

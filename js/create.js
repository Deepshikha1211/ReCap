const folderSelect = document.getElementById("folderSelect");
const questionInput = document.getElementById("question");
const answerInput = document.getElementById("answer");
const saveBtn = document.getElementById("saveBtn");
const addFolderBtn = document.getElementById("addFolderBtn");
const newFolderInput = document.getElementById("newFolder");

const previewFront = document.getElementById("previewFront");
const previewBack = document.getElementById("previewBack");
const previewCard = document.getElementById("previewCard");

// ========== LOAD FOLDERS INTO DROPDOWN ==========
function loadFolders() {
  const data = JSON.parse(localStorage.getItem("folders")) || {};
  folderSelect.innerHTML = `<option value="">-- Choose Folder --</option>`;

  Object.keys(data).forEach(folder => {
    const option = document.createElement("option");
    option.value = folder;
    option.textContent = folder;
    folderSelect.appendChild(option);
  });
}

loadFolders();

// ========== ADD NEW FOLDER ==========
addFolderBtn.addEventListener("click", () => {
  const folderName = newFolderInput.value.trim();
  if (!folderName) {
    alert("Please enter a folder name.");
    return;
  }

  const data = JSON.parse(localStorage.getItem("folders")) || {};
  if (data[folderName]) {
    alert("Folder already exists!");
    return;
  }

  data[folderName] = [];
  localStorage.setItem("folders", JSON.stringify(data));
  newFolderInput.value = "";
  alert(`Folder "${folderName}" created!`);
  loadFolders();
  folderSelect.value = folderName; // auto-select new folder
});

// ========== LIVE PREVIEW ==========
questionInput.addEventListener("input", () => {
  previewFront.textContent = questionInput.value || "Question will appear here";
});

answerInput.addEventListener("input", () => {
  previewBack.textContent = answerInput.value || "Answer will appear here";
});

// ========== FLIP PREVIEW CARD ==========
previewCard.addEventListener("click", () => {
  previewCard.classList.toggle("flipped");
});

// ========== SAVE FLASHCARD ==========
saveBtn.addEventListener("click", () => {
  const folderName = folderSelect.value;
  const question = questionInput.value.trim();
  const answer = answerInput.value.trim();

  if (!folderName) return alert("Please select a folder.");
  if (!question || !answer) return alert("Please fill both Question and Answer.");

  const data = JSON.parse(localStorage.getItem("folders")) || {};

  data[folderName].push({
    question,
    answer,
    learned: false,
    createdAt: Date.now() // ← add this timestamp
  });

  localStorage.setItem("folders", JSON.stringify(data));

  alert(`Flashcard added to "${folderName}"!`);
  questionInput.value = "";
  answerInput.value = "";
  previewFront.textContent = "Question will appear here";
  previewBack.textContent = "Answer will appear here";
  previewCard.classList.remove("flipped");
});


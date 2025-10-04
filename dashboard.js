// ========== ON PAGE LOAD ==========
window.onload = () => {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }
  document.getElementById("username").textContent = currentUser;
  updateDashboard();
  document.getElementById("flashcardsContainer").style.display = "none"; // hide initially
};

// ========== UPDATE DASHBOARD STATS ==========
function updateDashboard() {
  const flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
  document.getElementById("totalFlashcards").textContent = flashcards.length;
  document.getElementById("recentActivity").textContent =
    flashcards.length > 0
      ? "Last added: " + flashcards[flashcards.length-1].question
      : "No activity yet";
}

// ========== MODAL HANDLERS ==========
const modal = document.getElementById("flashcardModal");
const closeBtn = document.querySelector(".modal .close");

document.getElementById("createFlashcard").onclick = () => {
  modal.style.display = "flex";  
  document.getElementById("flashcardsContainer").style.display = "none";
};
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if(e.target===modal) modal.style.display="none"; };

// ========== SAVE FLASHCARD ==========
document.getElementById("saveFlashcard").onclick = () => {
  const question = document.getElementById("questionInput").value.trim();
  const answer = document.getElementById("answerInput").value.trim();
  if(!question || !answer){ alert("Please enter both question and answer!"); return; }

  const flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
  flashcards.push({ question, answer, learned:false });
  localStorage.setItem("flashcards", JSON.stringify(flashcards));

  document.getElementById("questionInput").value = "";
  document.getElementById("answerInput").value = "";
  modal.style.display = "none";
  updateDashboard();
};

// ========== RENDER FLASHCARDS ==========
function renderFlashcards() {
  const flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
  const container = document.getElementById("flashcardsContainer");
  container.innerHTML = "";
  if(flashcards.length===0){ container.innerHTML="<p>No flashcards yet. Create one!</p>"; return; }

  flashcards.forEach((f,i)=>{
    const card = document.createElement("div");
    card.className = "flashcard";
    if(f.learned) card.style.opacity="0.6";

  card.innerHTML = `
  <div class="flashcard-inner">
    <div class="flashcard-front">
      <h4>Q${i+1}: ${f.question}</h4>
    </div>
    <div class="flashcard-back">
      <h4>Answer</h4>
      <p>${f.answer}</p>
    </div>
  </div>
  <div class="buttons-container">
    <button class="delete-btn" data-index="${i}"><i class="fas fa-trash"></i> Delete</button>
    <button class="learn-btn" data-index="${i}">Mark as Learned</button>
  </div>
`;


    card.querySelector(".flashcard-inner").onclick = () => card.classList.toggle("flipped");
    card.querySelector(".delete-btn").onclick = (e) => deleteFlashcardUI(e.target.closest("button").dataset.index);
    card.querySelector(".learn-btn").onclick = (e) => markLearned(e.target.closest("button").dataset.index);
    container.appendChild(card);
  });
}

// ========== DELETE ==========
function deleteFlashcardUI(index){
  const flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
  flashcards.splice(index,1);
  localStorage.setItem("flashcards",JSON.stringify(flashcards));
  updateDashboard();
  renderFlashcards();
}

// ========== MARK LEARNED ==========
function markLearned(index){
  const flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
  flashcards[index].learned = true;
  localStorage.setItem("flashcards",JSON.stringify(flashcards));
  renderFlashcards();
}

// ========== LOGOUT ==========
function logout(){
  localStorage.removeItem("currentUser");
  window.location.href="login.html";
}

// ========== MENU HANDLERS ==========
document.getElementById("menuCreate").onclick = () => {
  modal.style.display = "flex";  
  document.getElementById("flashcardsContainer").style.display="none";
};

document.getElementById("menuView").onclick = () => {
  renderFlashcards();
  document.getElementById("flashcardsContainer").style.display="grid";
};

document.getElementById("menuLogout").onclick = logout;

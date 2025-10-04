const flashcardsContainer = document.getElementById("flashcardsContainer");
const searchInput = document.getElementById("searchInput");

function renderFlashcards(filter = "") {
  const flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
  const filtered = flashcards.filter(f => f.question.toLowerCase().includes(filter.toLowerCase()));

  flashcardsContainer.innerHTML = "";

  if (filtered.length === 0) {
    flashcardsContainer.innerHTML = "<p>No flashcards found.</p>";
    return;
  }

  filtered.forEach((f, i) => {
    const card = document.createElement("div");
    card.className = "flashcard";
    card.innerHTML = `
      <div class="flashcard-inner">
        <div class="flashcard-front">${f.question}</div>
        <div class="flashcard-back">${f.answer}</div>
      </div>
      <div class="card-actions">
        <button class="learn-btn" data-index="${i}"><i class="fas fa-check"></i> Learned</button>
        <button class="delete-btn" data-index="${i}"><i class="fas fa-trash"></i> Delete</button>
      </div>
    `;

    // flip card on click
    card.querySelector(".flashcard-inner").onclick = () => card.classList.toggle("flipped");

    // delete / mark learned
    card.querySelector(".delete-btn").onclick = (e) => deleteFlashcard(e.target.closest("button").dataset.index);
    card.querySelector(".learn-btn").onclick = (e) => markLearned(e.target.closest("button").dataset.index);

    flashcardsContainer.appendChild(card);
  });
}

function deleteFlashcard(index) {
  const flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
  flashcards.splice(index, 1);
  localStorage.setItem("flashcards", JSON.stringify(flashcards));
  renderFlashcards();
}

function markLearned(index) {
  const flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
  flashcards[index].learned = true;
  localStorage.setItem("flashcards", JSON.stringify(flashcards));
  renderFlashcards();
}

searchInput.addEventListener("input", (e) => renderFlashcards(e.target.value));
renderFlashcards();

// Display logged-in username
window.onload = () => {
  const remembered = JSON.parse(localStorage.getItem("rememberMe"));
  const username = remembered ? remembered.username : "User";
  document.getElementById("username").textContent = username;

  // Load flashcards count from localStorage
  const flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
  document.getElementById("totalFlashcards").textContent = flashcards.length;

  // Show last flashcard added as recent activity
  if (flashcards.length > 0) {
    document.getElementById("recentActivity").textContent =
      "Last added: " + flashcards[flashcards.length - 1].question;
  }
};

// Example buttons functionality
document.getElementById("createFlashcard").onclick = () => {
  const question = prompt("Enter flashcard question:");
  const answer = prompt("Enter flashcard answer:");

  if (!question || !answer) return;

  const flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
  flashcards.push({ question, answer });
  localStorage.setItem("flashcards", JSON.stringify(flashcards));

  alert("Flashcard created!");
  location.reload();
};

document.getElementById("viewFlashcards").onclick = () => {
  const flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
  if (flashcards.length === 0) {
    alert("No flashcards yet!");
    return;
  }

  let list = "Your flashcards:\n\n";
  flashcards.forEach((f, i) => {
    list += `${i + 1}. Q: ${f.question} | A: ${f.answer}\n`;
  });
  alert(list);
};

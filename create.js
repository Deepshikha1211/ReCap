const questionInput = document.getElementById("question");
    const answerInput = document.getElementById("answer");
    const saveBtn = document.getElementById("saveBtn");

    const previewFront = document.getElementById("previewFront");
    const previewBack = document.getElementById("previewBack");
    const previewCard = document.getElementById("previewCard");

    // Live preview
    questionInput.addEventListener("input", () => {
      previewFront.textContent = questionInput.value || "Question will appear here";
    });

    answerInput.addEventListener("input", () => {
      previewBack.textContent = answerInput.value || "Answer will appear here";
    });

    // Flip preview card
    previewCard.addEventListener("click", () => {
      previewCard.classList.toggle("flipped");
    });

    // Save flashcard
    saveBtn.addEventListener("click", () => {
      const question = questionInput.value.trim();
      const answer = answerInput.value.trim();
      if(!question || !answer) { alert("Please fill both Question and Answer."); return; }

      const flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
      flashcards.push({ question, answer, learned: false });
      localStorage.setItem("flashcards", JSON.stringify(flashcards));

      alert("Flashcard saved!");
      questionInput.value = "";
      answerInput.value = "";
      previewFront.textContent = "Question will appear here";
      previewBack.textContent = "Answer will appear here";
      previewCard.classList.remove("flipped");
    });
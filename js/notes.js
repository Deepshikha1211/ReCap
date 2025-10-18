// ======== Elements ========
const saveNoteBtn = document.getElementById("saveNote");
const noteInput = document.getElementById("noteInput");
const notesList = document.getElementById("notesList");

// ======== Check Logged-In User ========
const currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
  window.location.href = "index.html"; // redirect to login if not logged in
}

// ======== Load Notes for Current User ========
let notes = JSON.parse(localStorage.getItem("notes_" + currentUser)) || [];

// ======== Save Notes to localStorage ========
function saveNotes() {
  localStorage.setItem("notes_" + currentUser, JSON.stringify(notes));
}

// ======== Render Notes ========
function renderNotes() {
  notesList.innerHTML = "";

  if (notes.length === 0) {
    notesList.innerHTML = `<p style="color:#888;">No notes yet. Start by adding one!</p>`;
    return;
  }

  notes.forEach((note, index) => {
    const noteCard = document.createElement("div");
    noteCard.className = "note-card";
    noteCard.innerHTML = `
      <p>${note}</p>
      <button onclick="deleteNote(${index})"><i class="fas fa-trash"></i></button>
    `;
    notesList.appendChild(noteCard);
  });
}

// ======== Delete Note ========
function deleteNote(index) {
  notes.splice(index, 1);
  saveNotes();   // save updated notes for current user
  renderNotes();
}

// ======== Add New Note ========
saveNoteBtn.addEventListener("click", () => {
  const noteText = noteInput.value.trim();
  if (noteText === "") return;

  notes.push(noteText);
  saveNotes();   // save new note under current user
  noteInput.value = "";
  renderNotes();
});

// ======== Initial Render ========
renderNotes();

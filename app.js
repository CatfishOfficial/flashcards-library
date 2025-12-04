const deckSelect = document.getElementById("deckSelect");
let cards = [];
let index = 0;
let showingFront = true;

async function loadDeckList() {
  const res = await fetch("categories.json");
  const categories = await res.json();

  deckSelect.innerHTML = "";

  categories.decks.forEach(deck => {
    const option = document.createElement("option");
    option.value = deck.file;
    option.textContent = deck.name;
    deckSelect.appendChild(option);
  });

  loadDeck(deckSelect.value);
}

async function loadDeck(file) {
  const res = await fetch(file);
  const deck = await res.json();
  cards = deck.cards;
  index = 0;
  showingFront = true;
  renderCard();
}

deckSelect.addEventListener("change", () => loadDeck(deckSelect.value));

document.getElementById("prevBtn").onclick = () => {
  index = (index - 1 + cards.length) % cards.length;
  showingFront = true;
  renderCard();
};

document.getElementById("nextBtn").onclick = () => {
  index = (index + 1) % cards.length;
  showingFront = true;
  renderCard();
};

document.getElementById("flipBtn").onclick = () => {
  showingFront = !showingFront;
  renderCard();
};

function renderCard() {
  const cardElem = document.getElementById("flashcard");
  if (!cards.length) {
    cardElem.textContent = "No cards loaded";
    return;
  }
  cardElem.textContent = showingFront ? cards[index].front : cards[index].back;
}

loadDeckList();
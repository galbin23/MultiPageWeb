
let cards = [];
let currentIndex = 0;
let results = [];
let flipped = false;

function saveCards() {
  localStorage.setItem('flashcards', JSON.stringify(cards));
}

function loadCards() {
  const stored = localStorage.getItem('flashcards');
  if (stored) {
    cards = JSON.parse(stored);
  } else {
    cards = [{ front: 'Example Question', back: 'Example Term' }];
    saveCards();
  }
}

function renderCard() {
  const counter = document.getElementById('card-counter');
  const wrap = document.getElementById('flashcard-wrap');
  const flashcard = document.getElementById('flashcard');
  const cardControls = document.getElementById('card-controls');
  const markControls = document.getElementById('mark-controls');
  const frontText = document.getElementById('card-front-text');
  const backText = document.getElementById('card-back-text');

  if (cards.length === 0) {
    counter.textContent = 'No cards yet. Add some below.';
    wrap.style.display = 'none';
    cardControls.style.display = 'none';
    markControls.style.display = 'none';
    return;
  }

  wrap.style.display = 'block';
  cardControls.style.display = 'flex';
  markControls.style.display = 'flex';

  counter.textContent = `Card ${currentIndex + 1} of ${cards.length}`;
  frontText.textContent = cards[currentIndex].front;
  backText.textContent = cards[currentIndex].back;

  flipped = false;
  flashcard.classList.remove('is-flipped');
}

function renderScore() {
  const got = results.filter(r => r === 'got').length;
  const missed = results.filter(r => r === 'missed').length;
  const scoreDisplay = document.getElementById('score-display');

  scoreDisplay.innerHTML = `
    <p>Good work! You got <strong>${got} out of ${cards.length}</strong>.</p>
    <button class="btn" id="resetBtn">Study Again</button>
  `;

  document.getElementById('resetBtn').addEventListener('click', resetStudy);
  document.getElementById('flashcard-wrap').style.display = 'none';
  document.getElementById('card-controls').style.display = 'none';
  document.getElementById('mark-controls').style.display = 'none';
  document.getElementById('card-counter').textContent = '';
}

function renderCardList() {
  const list = document.getElementById('card-list');
  list.innerHTML = '';

  cards.forEach((card, index) => {
    const li = document.createElement('li');
    li.className = 'card-list-item';
    li.innerHTML = `
      <span><strong>${card.front}</strong> — ${card.back}</span>
      <button class="btn btn-delete" data-index="${index}">Delete</button>
    `;
    list.appendChild(li);
  });
}

function flipCard() {
  if (cards.length === 0) return;
  flipped = !flipped;
  document.getElementById('flashcard').classList.toggle('is-flipped', flipped);
}

function nextCard() {
  if (cards.length === 0) return;
  currentIndex = (currentIndex + 1) % cards.length;
  renderCard();
}

function prevCard() {
  if (cards.length === 0) return;
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  renderCard();
}

function markCard(result) {
  if (cards.length === 0) return;
  results[currentIndex] = result;

  const nextUnreviewed = findNextUnreviewed();
  if (nextUnreviewed !== -1) {
    currentIndex = nextUnreviewed;
    renderCard();
  } else {
    renderScore();
  }
}

function findNextUnreviewed() {
  for (let i = 1; i <= cards.length; i++) {
    const idx = (currentIndex + i) % cards.length;
    if (results[idx] === null) return idx;
  }
  return -1;
}

function addCard(front, back) {
  cards.push({ front, back });
  results.push(null);
  saveCards();
  renderCard();
  renderCardList();
}

function deleteCard(index) {
  cards.splice(index, 1);
  results.splice(index, 1);
  if (currentIndex >= cards.length) {
    currentIndex = Math.max(0, cards.length - 1);
  }
  saveCards();
  renderCard();
  renderCardList();
}

function resetStudy() {
  results = cards.map(() => null);
  currentIndex = 0;
  document.getElementById('score-display').innerHTML = '';
  renderCard();
}

function setupListeners() {
  const wrap = document.getElementById('flashcard-wrap');
  wrap.addEventListener('click', flipCard);
  wrap.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') flipCard();
  });

  document.getElementById('flipBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    flipCard();
  });
  document.getElementById('prevBtn').addEventListener('click', prevCard);
  document.getElementById('nextBtn').addEventListener('click', nextCard);
  document.getElementById('gotBtn').addEventListener('click', () => markCard('got'));
  document.getElementById('missedBtn').addEventListener('click', () => markCard('missed'));

  document.getElementById('add-card-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const front = document.getElementById('front-input').value.trim();
    const back = document.getElementById('back-input').value.trim();
    const error = document.getElementById('form-error');

    if (!front || !back) {
      error.textContent = 'Both fields are required.';
      return;
    }

    const duplicate = cards.some(c => c.front.toLowerCase() === front.toLowerCase());
    if (duplicate) {
      error.textContent = 'That card already exists';
      return;
    }

    error.textContent = '';
    addCard(front, back);
    e.target.reset();
  });

  document.getElementById('card-list').addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
      deleteCard(parseInt(e.target.dataset.index));
    }
  });
}

function init() {
  loadCards();
  results = cards.map(() => null);
  renderCard();
  renderCardList();
  setupListeners();
}

init();

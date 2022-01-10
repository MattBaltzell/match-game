"use strict";

// DOM SELECTORS
const gridDOM = document.querySelector(".grid");
const heading1 = document.querySelector(".heading-1");
const btnPlayAgain = document.getElementById("btn");
const personalBest = document.querySelector(".personal-best");
const scoreDisplay = document.querySelector(".score");

// GAMEPLAY VARIABLES & CARD CLASS
const cardDeck = [];
let domCards;
let selections = 0;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

class Card {
  constructor(id, value) {
    this.id = id;
    this.value = value;
  }

  static htmlFn(id, value) {
    return `<div class="card" id="card-${id}" data-value="${value}" data-matched="0">
              <div class="card-inner">
                <div class="card-side card-side__front"></div>
                <div class="card-side card-side__back">${value}</div>
              </div>
            </div>`;
  }
}

// Using this variable to prevent clicking too quickly and breaking the game
let checking = false;

// GAME LOGIC
setTimeout(() => {
  grid.innerHTML = "";
}, 750);

const checkMatch = function () {
  const selectedCards = domCards.filter((el) => {
    return el.classList.contains("flip") && el.dataset.matched == 0;
  });
  if (selectedCards[0].dataset.value !== selectedCards[1].dataset.value) {
    setTimeout(function () {
      score += 1;
      displayScore();
      unflipUnmatched();
      checking = false;
    }, 600);
  } else if (
    selectedCards[0].dataset.value === selectedCards[1].dataset.value
  ) {
    selectedCards.forEach((el) => {
      el.dataset.matched = 1;
    });
    checkWin();
    checking = false;
  }
  selections = 0;
};

// FUNCTIONS
const init = function () {
  highScore
    ? personalBest.classList.remove("hidden")
    : personalBest.classList.add("hidden");
  displayScore();
  displayPersonalBest();
  unflipAll();
  setTimeout(function () {
    heading1.textContent = "Match the Cards!";
    btnPlayAgain.classList.add("hidden");
    shuffleDeck(cardDeck);
    dealCards();
    domCards = Array.from(gridDOM.querySelectorAll(".card"));
    addFlipListeners();
  }, 750);
};

const cardGenerator = function (num) {
  for (let i = 1; i <= num; i++) {
    cardDeck.push(new Card(`${i}`, i <= num / 2 ? i : i - num / 2));
  }
};

const shuffleDeck = function (arr) {
  let currentIndex = arr.length,
    randomIndex;
  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex],
    ];
  }
  return arr;
};

const dealCards = function () {
  gridDOM.innerHTML = "";
  cardDeck.forEach((el) => {
    gridDOM.insertAdjacentHTML("afterbegin", Card.htmlFn(el.id, el.value));
  });
};

const cardFlipHandler = function (e) {
  e.preventDefault();
  if (checking) return;
  if (!e.target.classList.contains("card-side")) return;
  if (e.target.classList.contains("card-side__back")) return;

  checking = true;

  e.target.closest(".card").classList.add("flip");

  setTimeout(function () {
    selections += 1;
    selections === 2 ? checkMatch() : (checking = false);
  }, 300);
};

const unflipUnmatched = function () {
  domCards.forEach(
    (el) => el.dataset.matched == 0 && el.classList.remove("flip")
  );
};

const unflipAll = function () {
  !domCards || domCards.forEach((el) => el.classList.remove("flip"));
};

const updateScore = function () {
  if (!highScore || score < highScore) {
    highScore = score;
  }
  localStorage.setItem("highScore", highScore);
};

const displayScore = function () {
  scoreDisplay.textContent = `Mistakes: ${score}`;
};

const displayPersonalBest = function () {
  personalBest.textContent = `Personal Best: ${highScore} Mistakes`;
};

const win = function () {
  btnPlayAgain.classList.remove("hidden");
  heading1.textContent = "YOU WIN!";
  updateScore();
  displayPersonalBest();
  score = 0;
};

const checkWin = function () {
  const flipped = domCards.filter((el) => el.classList.contains("flip"));
  if (flipped.length === domCards.length) {
    win();
  }
};

// EVENT LISTENERS
const addFlipListeners = function () {
  gridDOM.addEventListener("click", cardFlipHandler);
};

btnPlayAgain.addEventListener("click", function (e) {
  e.preventDefault();
  init();
});

// START GAME
cardGenerator(16);
init();

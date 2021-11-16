"use strict";

const gridDOM = document.querySelector("#grid");
const heading1 = document.querySelector(".heading-1");
const btnPlayAgain = document.getElementById("btn");
const personalBest = document.querySelector(".personal-best");
const scoreDisplay = document.querySelector(".score");

setTimeout(() => {
  grid.innerHTML = "";
}, 750);

class Card {
  constructor(id, value) {
    this.id = id;
    this.value = value;
    this.html = `<div class="card" id="card-${this.id}" data-value="${this.value}" data-matched="0">
    <div class="card-inner">
      <div class="card-side card-side__front"></div>
      <div class="card-side card-side__back">${this.value}</div>
    </div>
  </div>`;
  }
}

const cardDeck = [];

const cardGenerator = (num) => {
  for (let i = 1; i <= num; i++) {
    cardDeck.push(new Card(`${i}`, i <= num / 2 ? i : i - num / 2));
  }
};

cardGenerator(16);

let domCards;

// GAMEPLAY VARIABLES
let selections = 0;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

// GAME LOGIC
const checkMatch = () => {
  let selectedCards = domCards.filter((el) => {
    return el.classList.contains("flip") && el.dataset.matched == 0;
  });
  if (selectedCards[0].dataset.value !== selectedCards[1].dataset.value) {
    console.log("No MATCH!!!!");
    setTimeout(() => {
      score += 1;
      displayScore();
      unflipUnmatched();
    }, 600);
  } else if (
    selectedCards[0].dataset.value === selectedCards[1].dataset.value
  ) {
    console.log("MATCH!!!!");
    selectedCards.forEach((el) => {
      el.dataset.matched = 1;
    });
    checkWin();
  }

  selections = 0;
};

// FUNCTIONS
const displayScore = () => (scoreDisplay.textContent = `Mistakes: ${score}`);
const displayPersonalBest = () =>
  (personalBest.textContent = `Personal Best: ${highScore} Mistakes`);

const shuffleDeck = (arr) => {
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

const dealCards = () => {
  gridDOM.innerHTML = "";
  cardDeck.forEach((el) => {
    gridDOM.insertAdjacentHTML("afterbegin", el.html);
  });
};

const cardFlipHandler = (e) => {
  if (e.target.parentElement.parentElement.classList.contains("flip")) {
    null;
  } else {
    e.target.parentElement.parentElement.classList.add("flip");
    setTimeout(() => {
      selections += 1;
      selections === 2 ? checkMatch() : null;
    }, 0);
  }
};

const unflipUnmatched = () => {
  domCards.forEach((el) => {
    el.dataset.matched == 0 ? el.classList.remove("flip") : null;
  });
};

const unflipAll = () => {
  !domCards ? null : domCards.forEach((el) => el.classList.remove("flip"));
};

const addFlipListeners = () => {
  domCards.forEach((el) => {
    el.addEventListener("click", cardFlipHandler);
  });
};

btnPlayAgain.addEventListener("click", (e) => {
  e.preventDefault();
  init();
});

const checkWin = () => {
  const flipped = domCards.filter((el) => el.classList.contains("flip"));
  if (flipped.length === domCards.length) {
    btnPlayAgain.classList.remove("hidden");
    heading1.textContent = "YOU WIN!";
    if (!highScore || score < highScore) {
      highScore = score;
    }
    localStorage.setItem("highScore", highScore);
    displayPersonalBest();
    score = 0;
  }
};

const init = () => {
  highScore
    ? personalBest.classList.remove("hidden")
    : personalBest.classList.add("hidden");
  displayScore();
  displayPersonalBest();
  unflipAll();
  setTimeout(() => {
    heading1.textContent = "Match the Cards!";
    btnPlayAgain.classList.add("hidden");
    shuffleDeck(cardDeck);
    dealCards();
    domCards = [...gridDOM.childNodes];
    addFlipListeners();
  }, 750);
};

init();

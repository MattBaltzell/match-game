"use strict";

const gridDOM = document.querySelector("#grid");
const heading1 = document.querySelector(".heading-1");
const btnPlayAgain = document.getElementById("btn");

setTimeout(() => {
  grid.innerHTML = "";
}, 750);

class Card {
  constructor(id, value) {
    this.id = id;
    this.value = value;
    this.html = `<div class="card" id="card-${this.id}" data-value="${this.value}" data-matched="0">
    <div class="card-inner">
      <div class="card-side card-side__front"><p>* * * * *<br>* * * * *<br>* * * * *<br>* * * * *<br>* * * * *<br>* * * * *</p></div>
      <div class="card-side card-side__back">${this.value}</div>
    </div>
  </div>`;
  }
}

const card1 = new Card("1", 1);
const card2 = new Card("2", 2);
const card3 = new Card("3", 3);
const card4 = new Card("4", 4);
const card5 = new Card("5", 5);
const card6 = new Card("6", 6);
const card7 = new Card("7", 1);
const card8 = new Card("8", 2);
const card9 = new Card("9", 3);
const card10 = new Card("10", 4);
const card11 = new Card("11", 5);
const card12 = new Card("12", 6);

const cardDeck = [
  card1,
  card2,
  card3,
  card4,
  card5,
  card6,
  card7,
  card8,
  card9,
  card10,
  card11,
  card12,
];

let domCards;

// GAMEPLAY VARIABLES
let selections = 0;
let score = 0;

// GAME LOGIC
const checkMatch = () => {
  let selectedCards = domCards.filter((el) => {
    return el.classList.contains("flip") && el.dataset.matched == 0;
  });
  if (selectedCards[0].dataset.value !== selectedCards[1].dataset.value) {
    console.log("No MATCH!!!!");
    setTimeout(() => {
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
    selections += 1;
    selections === 2 ? checkMatch() : null;
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
  }
};

const init = () => {
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

const RANDOM_QUOTE_API_URL = "https://thetypingcat.com/api/tests";
const quoteDisplayElement = document.getElementById("quoteDisplay");
const quoteInputElement = document.getElementById("quoteInput");
const timerElement = document.getElementById("timer");
const result = document.getElementById("result");

let start = 0;
let timerControl;
let score1 = 0;
let score = 0;

quoteInputElement.addEventListener("input", () => {
  score1 = 0;
  if (start == 0) {
    timerElement.innerText = 1;
    startTimer();
  }
  start = start + 1;
  const arrayQuote = quoteDisplayElement.querySelectorAll("span");
  const arrayValue = quoteInputElement.value.split("");
  let correct = true;
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
      score1 += 1;
    } else {
      characterSpan.classList.remove("correct");
      characterSpan.classList.add("incorrect");
      correct = false;
    }
  });

  if (correct) {
    score += score1;
    score1 = 0;
    renderNewQuote();
  }
});

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then(response => response.json())
    .then(data => data.json.fixtures);
}

async function renderNewQuote() {
  let quote = await getRandomQuote();
  quote = filterData(quote);
  quoteDisplayElement.innerText = "";
  quote.split("").forEach(character => {
    const characterSpan = document.createElement("span");
    characterSpan.innerHTML = character;
    quoteDisplayElement.appendChild(characterSpan);
  });
  quoteInputElement.value = null;
}

let startTime;

function startTimer() {
  result.visible = false;
  startTime = new Date();
  timerControl = setInterval(() => {
    let time;
    time = getTimerTime();
    timerElement.innerText = time;
    if (time === 60) stopTimer();
  }, 1000);
}

function stopTimer() {
  score += score1;
  clearInterval(timerControl);
  // start=0;
  quoteInputElement.disabled = true;
  result.visible = true;
  result.innerHTML = `<h2>Your speed is ${score} CPM.</h2>`;
  score = 0;
}

function getTimerTime() {
  const time = Math.floor((new Date() - startTime) / 1000);
  return time + 1;
}

function filterData(quote) {
  quote = quote.slice(22, 540);
  quote = quote.replace(/[^a-zA-Z ]/g, " ");
  quote = quote.replace(/  +/g, ' ');
  quote = quote+".";
  return quote;
}

renderNewQuote();


const letterBox = document.getElementById("letter");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const form = document.getElementById("word-form");
const currentLetterSpan = document.getElementById("current-letter");
const timerSpan = document.getElementById("timer");
const resultDiv = document.getElementById("result");
const nextRoundBtn = document.getElementById("next-round");
const playerSetup = document.getElementById("player-setup");
const startGameBtn = document.getElementById("start-game");
const playerNameInput = document.getElementById("player-name");
const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score");
const leaderboardList = document.getElementById("leaderboard-list");

let interval, timer, currentLetter = "A";
let playerName = "", score = 0;
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Sample Data
const validAnimals = ["ALLIGATOR","BEAR","CAT","DOG","ELEPHANT","FLAMINGO","GIRAFFE","HORSE","IGUANA","JAGUAR","KANGAROO","LION","MONKEY","NARWHAL","OWL","PENGUIN","QUAIL","RABBIT","SNAKE","TIGER","URIAL","VULTURE","WOLF","XERUS","YAK","ZEBRA"];
const validCountries = ["ARGENTINA","BRAZIL","CANADA","DENMARK","EGYPT","FRANCE","GERMANY","HAITI","INDIA","JAMAICA","KENYA","LIBYA","MEXICO","NIGERIA","OMAN","PERU","QATAR","RUSSIA","SPAIN","THAILAND","UGANDA","VENEZUELA","WALES","YEMEN","ZAMBIA"];
const validCities = ["ATLANTA","BERLIN","CAIRO","DUBLIN","EDINBURGH","FLORENCE","GEORGETOWN","HOUSTON","ISTANBUL","JAKARTA","KINGSTON","LAGOS","MIAMI","NAIROBI","OSLO","PARIS","QUITO","ROME","SEOUL","TOKYO","ULAN BATOR","VALENCIA","WARSAW","XALAPA","YOKOHAMA","ZURICH"];

startGameBtn.onclick = () => {
  playerName = playerNameInput.value.trim();
  if (!playerName) {
    alert("Please enter your name to start.");
    return;
  }
  playerSetup.classList.add("hidden");
  gameArea.classList.remove("hidden");
  score = 0;
  updateScore();
};

startBtn.onclick = () => {
  startBtn.disabled = true;
  stopBtn.disabled = false;
  resultDiv.textContent = "";
  form.classList.add("hidden");
  nextRoundBtn.classList.add("hidden");

  interval = setInterval(() => {
    const randIndex = Math.floor(Math.random() * letters.length);
    currentLetter = letters[randIndex];
    letterBox.textContent = currentLetter;
  }, 100);
};

stopBtn.onclick = () => {
  clearInterval(interval);
  stopBtn.disabled = true;

  currentLetterSpan.textContent = currentLetter;
  form.classList.remove("hidden");

  let timeLeft = 30;
  timerSpan.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timerSpan.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      validateForm(true);
    }
  }, 1000);
};

form.onsubmit = (e) => {
  e.preventDefault();
  clearInterval(timer);
  validateForm(false);
};

nextRoundBtn.onclick = () => {
  startBtn.disabled = false;
  stopBtn.disabled = true;
  resultDiv.textContent = "";
  form.reset();
};

function updateScore() {
  scoreDisplay.textContent = score;
}

function updateLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("abcLeaderboard") || "[]");
  leaderboard.push({ name: playerName, score });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard.splice(5); // Keep top 5

  localStorage.setItem("abcLeaderboard", JSON.stringify(leaderboard));

  leaderboardList.innerHTML = "";
  leaderboard.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.name}: ${entry.score}`;
    leaderboardList.appendChild(li);
  });
}

function validateForm(timeout) {
  const boy = document.getElementById("boy").value.trim().toUpperCase();
  const girl = document.getElementById("girl").value.trim().toUpperCase();
  const animal = document.getElementById("animal").value.trim().toUpperCase();
  const place = document.getElementById("place").value.trim().toUpperCase();

  const startsWith = word => word.startsWith(currentLetter);
  const animalOk = validAnimals.includes(animal) && startsWith(animal);
  const placeOk = (validCountries.includes(place) || validCities.includes(place)) && startsWith(place);

  let roundScore = 0;

  if (timeout) {
    resultDiv.textContent = "⏱️ Time's up! You lost!";
  } else {
    if (startsWith(boy)) roundScore += 10;
    if (startsWith(girl)) roundScore += 10;
    if (animalOk) roundScore += 10;
    if (placeOk) roundScore += 10;

    score += roundScore;
    updateScore();

    if (roundScore === 40) {
      resultDiv.textContent = "🎉 Perfect! +40 points!";
    } else {
      resultDiv.textContent = `✅ You scored ${roundScore}/40 this round.`;
    }
  }

  updateLeaderboard();
  nextRoundBtn.classList.remove("hidden");
  form.classList.add("hidden");
}

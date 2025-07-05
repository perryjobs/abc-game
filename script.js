// DOM elements
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
const resetBtn = document.getElementById("reset-game");
const soundToggle = document.getElementById("sound-toggle");

// Audio
const clickSound = document.getElementById("click-sound");
const winSound = document.getElementById("win-sound");
const loseSound = document.getElementById("lose-sound");
const bgMusic = document.getElementById("bg-music");

// Variables
let interval, timer;
let currentLetter = "A";
let playerName = "";
let score = 0;
let soundEnabled = true;
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Sample Data
const validAnimals = ["ALLIGATOR", "BEAR", "CAT", "DOG", "ELEPHANT", "FLAMINGO", "GIRAFFE", "HORSE", "IGUANA", "JAGUAR", "KANGAROO", "LION", "MONKEY", "NARWHAL", "OWL", "PENGUIN", "QUAIL", "RABBIT", "SNAKE", "TIGER", "URIAL", "VULTURE", "WOLF", "XERUS", "YAK", "ZEBRA"];
const validCountries = ["ARGENTINA", "BRAZIL", "CANADA", "DENMARK", "EGYPT", "FRANCE", "GERMANY", "HAITI", "INDIA", "JAMAICA", "KENYA", "LIBYA", "MEXICO", "NIGERIA", "OMAN", "PERU", "QATAR", "RUSSIA", "SPAIN", "THAILAND", "UGANDA", "VENEZUELA", "WALES", "YEMEN", "ZAMBIA"];
const validCities = ["ATLANTA", "BERLIN", "CAIRO", "DUBLIN", "EDINBURGH", "FLORENCE", "GEORGETOWN", "HOUSTON", "ISTANBUL", "JAKARTA", "KINGSTON", "LAGOS", "MIAMI", "NAIROBI", "OSLO", "PARIS", "QUITO", "ROME", "SEOUL", "TOKYO", "ULAN BATOR", "VALENCIA", "WARSAW", "XALAPA", "YOKOHAMA", "ZURICH"];

// Start Game Button
startGameBtn.onclick = () => {
  playerName = playerNameInput.value.trim();
  if (!playerName) {
    alert("Please enter your name to start.");
    return;
  }

  playerSetup.classList.add("hidden");
  gameArea.classList.remove("hidden");
  document.getElementById("top-controls").classList.remove("hidden");

  score = 0;
  updateScore();

  if (soundEnabled) bgMusic.play();
};

// Start Letter Spinner
startBtn.onclick = () => {
  if (soundEnabled) clickSound.play();

  startBtn.disabled = true;
  stopBtn.disabled = false;
  resultDiv.textContent = "";
  resultDiv.className = "result";
  form.classList.add("hidden");
  nextRoundBtn.classList.add("hidden");

  interval = setInterval(() => {
    const randIndex = Math.floor(Math.random() * letters.length);
    currentLetter = letters[randIndex];
    letterBox.textContent = currentLetter;
  }, 100);
};

// Stop Spinner and Show Input Form
stopBtn.onclick = () => {
  if (soundEnabled) clickSound.play();

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
      validateForm(true); // timed out
    }
  }, 1000);
};

// Handle Form Submit
form.onsubmit = (e) => {
  e.preventDefault();
  clearInterval(timer);
  validateForm(false);
};

// Next Round Button
nextRoundBtn.onclick = () => {
  startBtn.disabled = false;
  stopBtn.disabled = true;
  form.reset();
  resultDiv.textContent = "";
  resultDiv.className = "result";
  nextRoundBtn.classList.add("hidden");
};

// Reset Game Button
resetBtn.onclick = () => {
  location.reload();
};

// Sound Toggle
soundToggle.onchange = () => {
  soundEnabled = soundToggle.checked;
  if (!soundEnabled) {
    bgMusic.pause();
  } else {
    bgMusic.play();
  }
};

// Validate Form Answers
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
    resultDiv.className = "result fail";
    if (soundEnabled) loseSound.play();
  } else {
    if (startsWith(boy)) roundScore += 10;
    if (startsWith(girl)) roundScore += 10;
    if (animalOk) roundScore += 10;
    if (placeOk) roundScore += 10;

    score += roundScore;
    updateScore();

    if (roundScore === 40) {
      resultDiv.textContent = "🎉 Perfect! +40 points!";
      resultDiv.className = "result success";
      if (soundEnabled) winSound.play();
    } else if (roundScore > 0) {
      resultDiv.textContent = `✅ You scored ${roundScore}/40 this round.`;
      resultDiv.className = "result success";
      if (soundEnabled) clickSound.play();
    } else {
      resultDiv.textContent = `❌ Invalid answers. 0 points.`;
      resultDiv.className = "result fail";
      if (soundEnabled) loseSound.play();
    }
  }

  updateLeaderboard();
  form.classList.add("hidden");
  nextRoundBtn.classList.remove("hidden");
}

// Update Score Display
function updateScore() {
  scoreDisplay.textContent = score;
}

// Update Leaderboard
function updateLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("abcLeaderboard") || "[]");
  leaderboard.push({ name: playerName, score });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard.splice(5); // top 5 only

  localStorage.setItem("abcLeaderboard", JSON.stringify(leaderboard));

  leaderboardList.innerHTML = "";
  leaderboard.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.name}: ${entry.score}`;
    leaderboardList.appendChild(li);
  });
}

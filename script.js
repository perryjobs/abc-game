const letterBox = document.getElementById("letter");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const form = document.getElementById("word-form");
const currentLetterSpan = document.getElementById("current-letter");
const timerSpan = document.getElementById("timer");
const resultDiv = document.getElementById("result");

let interval;
let timer;
let currentLetter = "A";
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

startBtn.onclick = () => {
  startBtn.disabled = true;
  stopBtn.disabled = false;
  resultDiv.textContent = "";
  form.classList.add("hidden");

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
      validateForm(true); // timeout = true
    }
  }, 1000);
};

form.onsubmit = (e) => {
  e.preventDefault();
  clearInterval(timer);
  validateForm(false);
};

function validateForm(timeout) {
  const boy = document.getElementById("boy").value.trim().toUpperCase();
  const girl = document.getElementById("girl").value.trim().toUpperCase();
  const animal = document.getElementById("animal").value.trim().toUpperCase();
  const place = document.getElementById("place").value.trim().toUpperCase();

  if (timeout) {
    resultDiv.textContent = "⏱️ Time's up! You lost!";
  } else if (
    boy.startsWith(currentLetter) &&
    girl.startsWith(currentLetter) &&
    animal.startsWith(currentLetter) &&
    place.startsWith(currentLetter)
  ) {
    resultDiv.textContent = "🎉 You win!";
  } else {
    resultDiv.textContent = "❌ Incorrect entries. You lose!";
  }

  startBtn.disabled = false;
  form.reset();
  form.classList.add("hidden");
}

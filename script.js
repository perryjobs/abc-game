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
// Sample data (can be expanded)
const validAnimals = ["ALLIGATOR", "BEAR", "CAT", "DOG", "ELEPHANT", "FLAMINGO", "GIRAFFE", "HORSE", "IGUANA", "JAGUAR", "KANGAROO", "LION", "MONKEY", "NARWHAL", "OWL", "PENGUIN", "QUAIL", "RABBIT", "SNAKE", "TIGER", "URIAL", "VULTURE", "WOLF", "XERUS", "YAK", "ZEBRA"];
const validCountries = ["ARGENTINA", "BRAZIL", "CANADA", "DENMARK", "EGYPT", "FRANCE", "GERMANY", "HAITI", "INDIA", "JAMAICA", "KENYA", "LIBYA", "MEXICO", "NIGERIA", "OMAN", "PERU", "QATAR", "RUSSIA", "SPAIN", "THAILAND", "UGANDA", "VENEZUELA", "WALES", "YEMEN", "ZAMBIA"];
const validCities = ["ATLANTA", "BERLIN", "CAIRO", "DUBLIN", "EDINBURGH", "FLORENCE", "GEORGETOWN", "HOUSTON", "ISTANBUL", "JAKARTA", "KINGSTON", "LAGOS", "MIAMI", "NAIROBI", "OSLO", "PARIS", "QUITO", "ROME", "SEOUL", "TOKYO", "ULAN BATOR", "VALENCIA", "WARSAW", "XALAPA", "YOKOHAMA", "ZURICH"];

function validateForm(timeout) {
  const boy = document.getElementById("boy").value.trim().toUpperCase();
  const girl = document.getElementById("girl").value.trim().toUpperCase();
  const animal = document.getElementById("animal").value.trim().toUpperCase();
  const place = document.getElementById("place").value.trim().toUpperCase();

  const startsWithLetter = word => word.startsWith(currentLetter);

  const animalOk = validAnimals.includes(animal) && startsWithLetter(animal);
  const placeOk = (validCountries.includes(place) || validCities.includes(place)) && startsWithLetter(place);

  if (timeout) {
    resultDiv.textContent = "⏱️ Time's up! You lost!";
  } else if (
    startsWithLetter(boy) &&
    startsWithLetter(girl) &&
    animalOk &&
    placeOk
  ) {
    resultDiv.textContent = "🎉 You win!";
  } else {
    resultDiv.textContent = "❌ Invalid answers. Try again!";
  }

  startBtn.disabled = false;
  form.reset();
  form.classList.add("hidden");
}

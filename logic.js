let history = [];
let balance = parseFloat(localStorage.getItem("balance")) || 1000;

function updateBalanceDisplay() {
  document.getElementById("balance").textContent = balance.toFixed(2) + " 💰";
  localStorage.setItem("balance", balance);
}

function addResult(value) {
  if (history.length >= 5) history.shift();
  history.push(value);
  displayPattern();
  analyzePattern();
}

function displayPattern() {
  const patternDisplay = document.getElementById("patternDisplay");
  patternDisplay.innerHTML = history.map(val => {
    if (val === 'B') return '<span style="color:#c0392b;">🟥 B</span>';
    if (val === 'P') return '<span style="color:#2980b9;">🔵 P</span>';
    if (val === 'T') return '<span style="color:#27ae60;">🟢 T</span>';
    return val;
  }).join(' ');
}

function analyzePattern() {
  const prediction = document.getElementById("prediction");
  const patternType = document.getElementById("patternType");

  if (history.length < 5) {
    prediction.textContent = "NEXT: -";
    patternType.textContent = "";
    return;
  }

  const [a, b, c, d, e] = history;
  let guess = "-";
  let type = "غير معروف";
  let confidence = 50;

  if (a === b && b === c && c === d && d === e) {
    guess = a;
    type = "Streak";
    confidence = 90;
  } else if (a !== b && b !== c && c !== d && d !== e) {
    guess = e === 'B' ? 'P' : 'B';
    type = "Ping-Pong";
    confidence = 75;
  } else if (a === b && c === d) {
    guess = e === 'B' ? 'P' : 'B';
    type = "Double";
    confidence = 70;
  }

  patternType.textContent = "نمط: " + type;
  prediction.textContent = "NEXT: " + (
    guess === 'B' ? "BANKER" :
    guess === 'P' ? "PLAYER" :
    guess === 'T' ? "TIE" : "-"
  ) + " (" + confidence + "%)";
}

function reset() {
  history = [];
  displayPattern();
  document.getElementById("prediction").textContent = "NEXT: -";
  document.getElementById("patternType").textContent = "";
}

function resetBalance() {
  balance = 1000;
  updateBalanceDisplay();
}

window.onload = updateBalanceDisplay;

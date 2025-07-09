function predict() {
  const input = document.getElementById("historyInput").value.trim().toLowerCase();
  const count = parseInt(document.getElementById("roundCount").value);
  const entries = input.split(",").map(e => e.trim()).filter(e => e);
  const lastRounds = entries.slice(-count);

  let stats = { player: 0, banker: 0, tie: 0 };
  lastRounds.forEach(r => {
    if (r.startsWith("p")) stats.player++;
    else if (r.startsWith("b")) stats.banker++;
    else if (r.startsWith("t")) stats.tie++;
  });

  const total = lastRounds.length || 1;
  const result = {
    player: ((stats.player / total) * 100).toFixed(1),
    banker: ((stats.banker / total) * 100).toFixed(1),
    tie: ((stats.tie / total) * 100).toFixed(1),
  };

  document.getElementById("predictionText").innerHTML =
    `🔮 ${lang === 'ar' ? 'التوقعات' : 'Predictions'}:<br>
     👤 Player: ${result.player}%<br>
     🏦 Banker: ${result.banker}%<br>
     🤝 Tie: ${result.tie}%`;

  document.getElementById("soundEffect").play();
  speakPrediction(result);

  const ctx = document.getElementById("chartCanvas").getContext("2d");
  if (window.predChart) window.predChart.destroy();
  window.predChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Player', 'Banker', 'Tie'],
      datasets: [{
        data: [stats.player, stats.banker, stats.tie],
        backgroundColor: ['#007BFF', '#DC3545', '#28A745']
      }]
    }
  });

  const barHTML = `
    <div class="bar player" style="width: ${result.player}%">👤 ${result.player}%</div>
    <div class="bar banker" style="width: ${result.banker}%">🏦 ${result.banker}%</div>
    <div class="bar tie" style="width: ${result.tie}%">🤝 ${result.tie}%</div>
  `;
  document.getElementById("barContainer").innerHTML = barHTML;
}

let lang = localStorage.getItem("lang") || "en";
function setLang(l) {
  lang = l;
  localStorage.setItem("lang", l);
  document.getElementById("instruction").innerText = l === "ar" ? "📋 أدخل نتائج الجولات (Player, Banker, Tie)" : "Enter the results (Player, Banker, Tie)";
  document.getElementById("roundLabel").innerText = l === "ar" ? "عدد الجولات لتحليلها:" : "Rounds to analyze:";
  document.getElementById("predictBtn").innerText = l === "ar" ? "🔮 حساب التوقع" : "Predict";
}

function updateDisplay() {
  const history = JSON.parse(localStorage.getItem('baccaratHistory')) || [];
  const displayText = history.map(r => {
    if (r === 'P') return '🔵';
    if (r === 'B') return '🔴';
    if (r === 'T') return '🟢';
  }).join(' ');
  document.getElementById('historyDisplay').innerText = "جميع الجولات: " + displayText;

  const totalRounds = history.length;
  const count = { P: 0, B: 0, T: 0 };
  history.forEach(r => { if (count[r] !== undefined) count[r]++; });

  const statsHTML = `
    <table class="results-table">
      <tr>
        <th>عدد الجولات</th>
        <th class="player-text">لاعب</th>
        <th class="banker-text">مصرفي</th>
        <th class="tie-text">تعادل</th>
      </tr>
      <tr>
        <td>${totalRounds}</td>
        <td class="player-text">${count.P} (${((count.P/totalRounds)*100).toFixed(1)}%)</td>
        <td class="banker-text">${count.B} (${((count.B/totalRounds)*100).toFixed(1)}%)</td>
        <td class="tie-text">${count.T} (${((count.T/totalRounds)*100).toFixed(1)}%)</td>
      </tr>
    </table>
  `;
  document.getElementById('aiStats').innerHTML = statsHTML;
}

// خاصية نطق النتائج بالصوت
function speakPrediction(result) {
  const speech = new SpeechSynthesisUtterance();
  speech.lang = lang === 'ar' ? 'ar-MA' : 'en-US';
  if (lang === 'ar') {
    speech.text = `التوقعات هي: اللاعب بنسبة ${result.player} في المئة، المصرفي بنسبة ${result.banker} في المئة، والتعادل بنسبة ${result.tie} في المئة`;
  } else {
    speech.text = `Predictions are: Player ${result.player} percent, Banker ${result.banker} percent, Tie ${result.tie} percent`;
  }
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
}

window.onload = () => {
  setLang(lang);
  updateDisplay(); // تحديث العرض عند تحميل الصفحة
};

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

window.onload = () => {
  setLang(lang);
};


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

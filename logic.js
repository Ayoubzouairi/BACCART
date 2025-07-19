 let history = [];
let balance = 0;
let balanceHistory = [0];
let lang = 'ar-MA';
let chart;

// تهيئة التطبيق عند التحميل
document.addEventListener('DOMContentLoaded', function() {
  loadTheme();
  loadLanguage();
  initChart();
  document.getElementById('langSelect').addEventListener('change', changeLanguage);
});

function initChart() {
  const ctx = document.getElementById('chart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'الرصيد',
        data: [],
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        borderColor: 'gold',
        borderWidth: 2,
        pointBackgroundColor: 'gold',
        pointRadius: 4,
        fill: true,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return 'الرصيد: ' + context.raw.toFixed(2) + ' درهم';
            }
          }
        }
      },
      scales: {
        y: { 
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value + ' درهم';
            }
          }
        }
      }
    }
  });
}

function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

function loadTheme() {
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
  }
}

function changeLanguage() {
  lang = document.getElementById('langSelect').value;
  localStorage.setItem('lang', lang);
  updateUI();
}

function loadLanguage() {
  const savedLang = localStorage.getItem('lang') || 'ar-MA';
  document.getElementById('langSelect').value = savedLang;
  lang = savedLang;
}

function calculateProfit(betOn, outcome, amount) {
  if (!amount || amount <= 0) return 0;
  
  if (betOn === outcome) {
    if (betOn === 'P') return amount * 1; // لاعب 1:1
    if (betOn === 'B') return amount * 0.95; // مصرفي مع خصم 5%
    if (betOn === 'T') return amount * 8; // تعادل 8:1
  }
  
  // في حالة الخسارة
  if (betOn !== 'T' && outcome !== 'T') {
    return -amount;
  }
  
  // في حالة التعادل لا يوجد ربح أو خسارة
  return 0;
}

function showNotification(message, type) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = 'notification ' + type + '-notification';
  notification.style.opacity = '1';
  
  setTimeout(() => {
    notification.style.opacity = '0';
  }, 3000);
}

function updateBalance(profit, betOn, outcome, amount) {
  const oldBalance = balance;
  balance += profit;
  balanceHistory.push(balance);
  document.getElementById('balanceValue').textContent = balance.toFixed(2);
  
  // إضافة تأثير للرصيد
  document.getElementById('balanceDisplay').classList.add('balance-pulse');
  setTimeout(() => {
    document.getElementById('balanceDisplay').classList.remove('balance-pulse');
  }, 500);
  
  // عرض إشعار الفوز/الخسارة
  const isArabic = lang === 'ar-MA';
  
  if (profit > 0) {
    const winMessage = isArabic ? 
      `🎉 فوز! ربحت ${profit.toFixed(2)} درهم` : 
      `🎉 Win! You earned ${profit.toFixed(2)} MAD`;
    showNotification(winMessage, 'win');
  } else if (profit < 0) {
    const lossMessage = isArabic ? 
      `💔 خسارة! خسرت ${Math.abs(profit).toFixed(2)} درهم` : 
      `💔 Loss! You lost ${Math.abs(profit).toFixed(2)} MAD`;
    showNotification(lossMessage, 'loss');
  } else if (outcome === 'T' && betOn === 'T') {
    const tieMessage = isArabic ? 
      `🤝 تعادل! المبلغ ${amount.toFixed(2)} درهم مسترد` : 
      `🤝 Tie! ${amount.toFixed(2)} MAD returned`;
    showNotification(tieMessage, 'tie');
  }
  
  updateChart();
}

function updateChart() {
  chart.data.labels = balanceHistory.map((_, i) => i);
  chart.data.datasets[0].data = balanceHistory;
  chart.update();
}

function addResult(result) {
  const betAmountInput = document.getElementById('betAmount');
  const betAmount = parseFloat(betAmountInput.value) || 0;
  betAmountInput.value = '';
  
  history.push(result);
  
  // تحديد نوع الرهان بناءً على الزر الذي تم الضغط عليه
  const betOn = event.target.classList.contains('player') ? 'P' : 
               event.target.classList.contains('banker') ? 'B' : 'T';
  
  const profit = calculateProfit(betOn, result, betAmount);
  updateBalance(profit, betOn, result, betAmount);
  
  updateDisplay();
  updatePredictions();
}

function updateDisplay() {
  const displayText = history.map(r => {
    if (r === 'P') return '🔵';
    if (r === 'B') return '🔴';
    if (r === 'T') return '🟢';
  }).join(' ');
  
  const isArabic = lang === 'ar-MA';
  document.getElementById('historyDisplay').innerText = isArabic ? 
    "جميع الجولات: " + displayText : 
    "All rounds: " + displayText;

  const totalRounds = history.length;
  const count = { P: 0, B: 0, T: 0 };
  history.forEach(r => { if (count[r] !== undefined) count[r]++; });

  const statsHTML = `
    <table class="results-table">
      <tr>
        <th>${isArabic ? 'عدد الجولات' : 'Rounds'}</th>
        <th class="player-text">${isArabic ? 'لاعب' : 'Player'}</th>
        <th class="banker-text">${isArabic ? 'مصرفي' : 'Banker'}</th>
        <th class="tie-text">${isArabic ? 'تعادل' : 'Tie'}</th>
      </tr>
      <tr>
        <td>${totalRounds}</td>
        <td class="player-text">${count.P} (${((count.P/totalRounds)*100).toFixed(1)}%)</td>
        <td class="banker-text">${count.B} (${((count.B/totalRounds)*100).toFixed(1)}%)</td>
        <td class="tie-text">${count.T} (${((count.T/totalRounds)*100).toFixed(1)}%)</td>
      </tr>
    </table>
  `;
  document.getElementById('statsResult').innerHTML = statsHTML;
}

function updatePredictions() {
  const prediction = advancedPredict(history);
  displayPrediction(prediction);
}

function advancedPredict(history) {
  if (history.length < 3) {
    return {
      P: 33.3,
      B: 33.3,
      T: 33.3
    };
  }

  const lastFive = history.slice(-5);
  const lastTen = history.length >= 10 ? history.slice(-10) : lastFive;
  
  const freq5 = { P: 0, B: 0, T: 0 };
  const freq10 = { P: 0, B: 0, T: 0 };
  
  lastFive.forEach(r => freq5[r]++);
  lastTen.forEach(r => freq10[r]++);
  
  const percent5 = {
    P: (freq5.P / 5) * 100,
    B: (freq5.B / 5) * 100,
    T: (freq5.T / 5) * 100
  };
  
  const percent10 = {
    P: (freq10.P / lastTen.length) * 100,
    B: (freq10.B / lastTen.length) * 100,
    T: (freq10.T / lastTen.length) * 100
  };
  
  const weightedAvg = {
    P: (percent5.P * 0.6 + percent10.P * 0.4),
    B: (percent5.B * 0.6 + percent10.B * 0.4),
    T: (percent5.T * 0.6 + percent10.T * 0.4)
  };
  
  const total = weightedAvg.P + weightedAvg.B + weightedAvg.T;
  return {
    P: (weightedAvg.P / total * 100),
    B: (weightedAvg.B / total * 100),
    T: (weightedAvg.T / total * 100)
  };
}

function displayPrediction(prediction) {
  const isArabic = lang === 'ar-MA';
  
  document.querySelector('.player-bar').style.width = `${prediction.P}%`;
  document.querySelector('.banker-bar').style.width = `${prediction.B}%`;
  document.querySelector('.tie-bar').style.width = `${prediction.T}%`;
  
  document.getElementById('playerProb').textContent = `${prediction.P.toFixed(1)}%`;
  document.getElementById('bankerProb').textContent = `${prediction.B.toFixed(1)}%`;
  document.getElementById('tieProb').textContent = `${prediction.T.toFixed(1)}%`;
}

function updateUI() {
  const isArabic = lang === 'ar-MA';
  
  document.title = 'BACCARAT SPEED';
  document.querySelector('h1').textContent = 'BACCARAT SPEED';
  document.querySelector('.bet-amount-container label').textContent = isArabic ? '💰 مبلغ الرهان بالدرهم' : '💰 Bet Amount (MAD)';
  document.querySelector('#betAmount').placeholder = isArabic ? 'أدخل المبلغ (اختياري)' : 'Enter amount (optional)';
  document.querySelector('p').textContent = isArabic ? '📲 اختر نتيجة الجولة:' : '📲 Select round result:';
  document.querySelector('.player').innerHTML = isArabic ? '🔵 اللاعب <div class="bet-odds">1:1</div>' : '🔵 Player <div class="bet-odds">1:1</div>';
  document.querySelector('.banker').innerHTML = isArabic ? '🔴 المصرفي <div class="bet-odds">0.95:1</div>' : '🔴 Banker <div class="bet-odds">0.95:1</div>';
  document.querySelector('.tie').innerHTML = isArabic ? '🟢 تعادل <div class="bet-odds">8:1</div>' : '🟢 Tie <div class="bet-odds">8:1</div>';
  document.querySelector('.prediction-title').textContent = isArabic ? '📊 تنبؤات متقدمة' : '📊 Advanced Predictions';
  document.querySelectorAll('.probability-item span')[0].textContent = isArabic ? 'لاعب' : 'Player';
  document.querySelectorAll('.probability-item span')[2].textContent = isArabic ? 'مصرفي' : 'Banker';
  document.querySelectorAll('.probability-item span')[4].textContent = isArabic ? 'تعادل' : 'Tie';
  document.querySelector('#balanceDisplay').innerHTML = isArabic ? '💵 الرصيد: <span id="balanceValue">0</span> درهم' : '💵 Balance: <span id="balanceValue">0</span> MAD';
  document.querySelector('.reset').textContent = isArabic ? '🔄 إعادة تعيين' : '🔄 Reset';
  
  if (history.length > 0) {
    updateDisplay();
    updatePredictions();
  }
}

function resetData() {
  const isArabic = lang === 'ar-MA';
  const confirmMsg = isArabic ? 
    "هل أنت متأكد من أنك تريد إعادة تعيين جميع البيانات؟" : 
    "Are you sure you want to reset all data?";
  
  if (confirm(confirmMsg)) {
    history = [];
    balance = 0;
    balanceHistory = [0];
    updateChart();
    document.getElementById('predictionBars').innerHTML = `
      <div class="prediction-bar player-bar" style="width:33%">P</div>
      <div class="prediction-bar banker-bar" style="width:34%">B</div>
      <div class="prediction-bar tie-bar" style="width:33%">T</div>
    `;
    document.getElementById('playerProb').textContent = '33%';
    document.getElementById('bankerProb').textContent = '34%';
    document.getElementById('tieProb').textContent = '33%';
    document.getElementById('statsResult').innerText = '';
    document.getElementById('historyDisplay').innerText = '';
    document.getElementById('balanceValue').textContent = '0';
    document.getElementById('betAmount').value = '';
  }
}

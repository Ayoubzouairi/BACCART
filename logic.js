let history = [];
let currentStreak = { type: null, count: 0 };
let lang = 'ar-MA';
let markovModel = { P: { P: 0, B: 0, T: 0 }, B: { P: 0, B: 0, T: 0 }, T: { P: 0, B: 0, T: 0 } };

// أنماط شائعة في الكازينوهات الحية
const COMMON_CASINO_PATTERNS = [
  {
    name: { 'ar-MA': 'التنين الطويل', 'en-US': 'Long Dragon' },
    description: {
      'ar-MA': '6 أو أكثر من النتائج المتتالية لنفس الجانب (لاعب/مصرفي)',
      'en-US': '6 or more consecutive results for the same side (Player/Banker)'
    },
    example: 'PPPPPPP أو BBBBBBB'
  },
  {
    name: { 'ar-MA': 'نمط متعرج', 'en-US': 'Zigzag Pattern' },
    description: {
      'ar-MA': 'تناوب منتظم بين اللاعب والمصرفي',
      'en-US': 'Regular alternation between Player and Banker'
    },
    example: 'PBPBPB أو BPBPBP'
  },
  {
    name: { 'ar-MA': '3 تعادلات', 'en-US': '3 Ties' },
    description: {
      'ar-MA': '3 تعادلات أو أكثر في آخر 10 جولات',
      'en-US': '3 or more Ties in last 10 rounds'
    },
    example: 'T..T..T أو TTT'
  },
  {
    name: { 'ar-MA': '8 لاعب/مصرفي', 'en-US': '8 Player/Banker' },
    description: {
      'ar-MA': '8 أو أكثر من نفس النتيجة في آخر 10 جولات',
      'en-US': '8 or more of same result in last 10 rounds'
    },
    example: 'PPPPPPPP أو BBBBBBBB'
  },
  {
    name: { 'ar-MA': 'نمط التعادل المزدوج', 'en-US': 'Double Tie Pattern' },
    description: {
      'ar-MA': 'تعادلان متتاليان يتبعهما نتيجة ثالثة',
      'en-US': 'Two consecutive ties followed by a third result'
    },
    example: 'TTB أو TTP'
  }
];

// إنشاء عنصر الإشعارات
const notificationContainer = document.createElement('div');
notificationContainer.className = 'notification-container';
document.body.appendChild(notificationContainer);

document.addEventListener('DOMContentLoaded', function() {
  checkTimeForTheme();
  loadTheme();
  loadLanguage();
  document.getElementById('langSelect').addEventListener('change', changeLanguage);
  updateCommonPatterns();
});

function checkTimeForTheme() {
  const hour = new Date().getHours();
  const isDayTime = hour >= 6 && hour < 18;
  if (isDayTime && !document.body.classList.contains('light-mode')) {
    toggleTheme();
  } else if (!isDayTime && document.body.classList.contains('light-mode')) {
    toggleTheme();
  }
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
  updateCommonPatterns();
}

function loadLanguage() {
  const savedLang = localStorage.getItem('lang') || 'ar-MA';
  document.getElementById('langSelect').value = savedLang;
  lang = savedLang;
}

function showNotification(type, message) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  const icon = type === 'win' ? '🎉' : type === 'lose' ? '💥' : '🔄';
  
  notification.innerHTML = `
    <div>
      <span class="notification-icon">${icon}</span>
      <span>${message}</span>
    </div>
    <button class="close-notification" onclick="this.parentElement.remove()">×</button>
  `;
  
  notificationContainer.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 5000);
}

function showEffect(type) {
  const effect = document.createElement('div');
  effect.className = `${type}-effect`;
  document.body.appendChild(effect);
  
  setTimeout(() => {
    effect.remove();
  }, 2000);
}

function applyPercentageBasedEffect(type) {
  const button = document.querySelector(`.${type}`);
  if (!button) return;

  // الحصول على النسبة المئوية الحالية
  let percentage = 0;
  switch (type) {
    case 'player': 
      percentage = parseFloat(document.getElementById('playerProb').textContent); 
      break;
    case 'banker': 
      percentage = parseFloat(document.getElementById('bankerProb').textContent); 
      break;
    case 'tie': 
      percentage = parseFloat(document.getElementById('tieProb').textContent); 
      break;
  }

  // إضافة تأثير النسبة المئوية
  const percentageBadge = document.createElement('div');
  percentageBadge.className = 'percentage-badge';
  percentageBadge.textContent = `${percentage.toFixed(0)}%`;
  button.appendChild(percentageBadge);

  // إضافة تأثير الزر
  button.classList.add('effect-active', 'button-effect', 'active');

  // إزالة التأثير بعد الانتهاء
  setTimeout(() => {
    button.classList.remove('effect-active', 'active');
    setTimeout(() => {
      percentageBadge.remove();
    }, 1000);
  }, 1000);
}

function updateCommonPatterns() {
  const container = document.getElementById('casinoPatterns');
  container.innerHTML = '';
  
  COMMON_CASINO_PATTERNS.forEach(pattern => {
    const patternElement = document.createElement('div');
    patternElement.className = 'pattern-item';
    patternElement.innerHTML = `
      <div class="pattern-name">${pattern.name[lang] || pattern.name['en-US']}</div>
      <div class="pattern-desc">${pattern.description[lang] || pattern.description['en-US']}</div>
      <div class="pattern-example">${lang === 'ar-MA' ? 'مثال:' : 'Example:'} ${pattern.example}</div>
    `;
    container.appendChild(patternElement);
  });
}

function updateLast5Analysis() {
  const last5 = history.slice(-5);
  const container = document.getElementById('last5Results');
  
  if (last5.length === 0) {
    container.innerHTML = lang === 'ar-MA' ? 
      '<div style="text-align:center;padding:10px;">⏳ لا توجد بيانات كافية لتحليل آخر 5 جولات</div>' : 
      '<div style="text-align:center;padding:10px;">⏳ Not enough data for last 5 rounds analysis</div>';
    return;
  }
  
  let html = '<div class="last5-grid">';
  last5.forEach((result, index) => {
    html += `<div class="last5-cell last5-${result}">${result}</div>`;
  });
  html += '</div>';
  
  const counts = { P: 0, B: 0, T: 0 };
  last5.forEach(r => counts[r]++);
  
  html += `<div style="margin-top:15px;">
    <div class="trend-item">
      <span class="player-text">${lang === 'ar-MA' ? 'لاعب' : 'Player'}</span>
      <span class="trend-value">${counts.P}/5 (${(counts.P/5*100).toFixed(0)}%)</span>
    </div>
    <div class="trend-item">
      <span class="banker-text">${lang === 'ar-MA' ? 'مصرفي' : 'Banker'}</span>
      <span class="trend-value">${counts.B}/5 (${(counts.B/5*100).toFixed(0)}%)</span>
    </div>
    <div class="trend-item">
      <span class="tie-text">${lang === 'ar-MA' ? 'تعادل' : 'Tie'}</span>
      <span class="trend-value">${counts.T}/5 (${(counts.T/5*100).toFixed(0)}%)</span>
    </div>
  </div>`;
  
  container.innerHTML = html;
}

function updateBigRoad() {
  const bigRoadElement = document.getElementById('bigRoad');
  bigRoadElement.innerHTML = '';
  
  let row = 0;
  let col = 0;
  const maxRows = 6;

  const filteredHistory = history.filter(result => result !== 'T');

  for (let i = 0; i < filteredHistory.length; i++) {
    const result = filteredHistory[i];
    
    if (i > 0 && result === filteredHistory[i - 1]) {
      row++;
      if (row >= maxRows) {
        row = 0;
        col++;
      }
    } else {
      row = 0;
      if (i > 0) col++;
    }

    const cell = document.createElement('div');
    cell.className = `big-road-cell big-road-${result}`;
    cell.textContent = result === 'P' ? 'P' : 'B';
    cell.style.gridColumn = col + 1;
    cell.style.gridRow = row + 1;
    bigRoadElement.appendChild(cell);
  }
}

function updateDerivativeRoads() {
  const filteredHistory = history.filter(r => r !== 'T');
  updateBigEyeRoad(filteredHistory);
  updateSmallRoad(filteredHistory);
}

function updateBigEyeRoad(history) {
  const bigEyeRoad = document.getElementById('bigEyeRoad');
  bigEyeRoad.innerHTML = '';
  let matrix = [[]];
  let row = 0;

  for (let i = 1; i < history.length; i++) {
    if (i >= 2 && history[i] === history[i - 2]) {
      matrix[row].push(history[i]);
    } else {
      row++;
      matrix[row] = [history[i]];
    }
  }

  renderRoad(matrix, bigEyeRoad);
}

function updateSmallRoad(history) {
  const smallRoad = document.getElementById('smallRoad');
  smallRoad.innerHTML = '';
  let matrix = [[]];
  let row = 0;

  for (let i = 2; i < history.length; i++) {
    if (i >= 3 && history[i] === history[i - 3]) {
      matrix[row].push(history[i]);
    } else {
      row++;
      matrix[row] = [history[i]];
    }
  }

  renderRoad(matrix, smallRoad);
}

function renderRoad(matrix, container) {
  matrix.forEach((row, rowIndex) => {
    row.forEach((result, colIndex) => {
      const cell = document.createElement('div');
      cell.className = `road-cell road-${result}`;
      cell.style.gridColumn = colIndex + 1;
      cell.style.gridRow = rowIndex + 1;
      container.appendChild(cell);
    });
  });
}

function updateMarkovModel() {
  markovModel = { P: { P: 0, B: 0, T: 0 }, B: { P: 0, B: 0, T: 0 }, T: { P: 0, B: 0, T: 0 } };
  
  for (let i = 0; i < history.length - 1; i++) {
    const from = history[i];
    const to = history[i + 1];
    markovModel[from][to]++;
  }

  for (const from in markovModel) {
    const total = Object.values(markovModel[from]).reduce((a, b) => a + b, 0);
    for (const to in markovModel[from]) {
      markovModel[from][to] = total > 0 ? (markovModel[from][to] / total) * 100 : 33.3;
    }
  }
}

function detectDragon(history) {
  const last15 = history.slice(-15);
  const streaks = { P: 0, B: 0 };
  let currentStreak = { type: last15[0], count: 1 };

  for (let i = 1; i < last15.length; i++) {
    if (last15[i] === currentStreak.type && last15[i] !== 'T') {
      currentStreak.count++;
    } else {
      if (currentStreak.count > streaks[currentStreak.type]) {
        streaks[currentStreak.type] = currentStreak.count;
      }
      currentStreak = { type: last15[i], count: 1 };
    }
  }

  return {
    dragon: streaks.P >= 6 ? 'P' : streaks.B >= 6 ? 'B' : null,
    length: Math.max(streaks.P, streaks.B)
  };
}

function updateChart() {
  const ctx = document.getElementById('statsChart').getContext('2d');
  const last20 = history.slice(-20);
  const counts = { P: 0, B: 0, T: 0 };
  last20.forEach(r => counts[r]++);

  if (window.statsChart) {
    window.statsChart.destroy();
  }

  window.statsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [lang === 'ar-MA' ? 'لاعب' : 'Player', 
               lang === 'ar-MA' ? 'مصرفي' : 'Banker', 
               lang === 'ar-MA' ? 'تعادل' : 'Tie'],
      datasets: [{
        label: lang === 'ar-MA' ? 'آخر 20 جولة' : 'Last 20 Rounds',
        data: [counts.P, counts.B, counts.T],
        backgroundColor: ['#007BFF', '#DC3545', '#28A745']
      }]
    },
    options: { 
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function addResult(result) {
  history.push(result);
  
  const lastRecommendation = generateBetRecommendation();
  let notificationShown = false;
  
  if (lastRecommendation.recommendation !== 'none' && history.length > 1) {
    if (result === lastRecommendation.recommendation) {
      const message = lang === 'ar-MA' 
        ? `فوز! ${lastRecommendation.message}` 
        : `Win! ${lastRecommendation.message}`;
      showNotification('win', message);
      showEffect('win');
      applyPercentageBasedEffect(result === 'P' ? 'player' : result === 'B' ? 'banker' : 'tie');
      notificationShown = true;
    } else if (result !== 'T' && lastRecommendation.recommendation !== 'T') {
      const message = lang === 'ar-MA' 
        ? `خسارة! ${lastRecommendation.message}` 
        : `Lose! ${lastRecommendation.message}`;
      showNotification('lose', message);
      showEffect('lose');
      applyPercentageBasedEffect(result === 'P' ? 'player' : 'banker');
      notificationShown = true;
    }
  }
  
  if (!notificationShown && result === 'T') {
    const message = lang === 'ar-MA' ? 'تعادل!' : 'Tie!';
    showNotification('tie', message);
    showEffect('tie');
    applyPercentageBasedEffect('tie');
  }
  
  if (currentStreak.type === result) {
    currentStreak.count++;
  } else {
    currentStreak.type = result;
    currentStreak.count = 1;
  }
  
  updateMarkovModel();
  updateDisplay();
  updateBigRoad();
  updateDerivativeRoads();
  updateTrendsAndStreaks();
  updatePredictions();
  generateAdvice();
  showRecommendation();
  updateChart();
  updateLast5Analysis();
}

function updateDisplay() {
  const displayText = history.map(r => {
    if (r === 'P') return '🔵';
    if (r === 'B') return '🔴';
    if (r === 'T') return '🟢';
  }).join(' ');
  document.getElementById('historyDisplay').innerText =

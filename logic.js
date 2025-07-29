// حالة التطبيق
const AppState = {
  history: [],
  currentStreak: { type: null, count: 0 },
  lang: 'ar-MA',
  markovModel: { P: { P: 0, B: 0, T: 0 }, B: { P: 0, B: 0, T: 0 }, T: { P: 0, B: 0, T: 0 } },
  statsChart: null
};

// حالة عداد الجلسة (الإضافة الجديدة)
const SessionTimer = {
  startTime: null,
  timerInterval: null,
  isPaused: false,
  totalSeconds: 0,
  warningThreshold: 30 * 60, // 30 دقيقة بالثواني
  alertThreshold: 60 * 60    // 60 دقيقة بالثواني
};

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

// ======== دوال عداد الجلسة الجديدة ======== //
function startSessionTimer() {
  if (!SessionTimer.startTime) {
    SessionTimer.startTime = new Date();
    SessionTimer.timerInterval = setInterval(updateSessionTimer, 1000);
    createTimerElement();
  }
}

function createTimerElement() {
  const timerElement = document.createElement('div');
  timerElement.id = 'sessionTimer';
  timerElement.className = 'session-timer';
  timerElement.textContent = '00:00:00';
  document.body.appendChild(timerElement);
}

function updateSessionTimer() {
  if (!SessionTimer.isPaused) {
    SessionTimer.totalSeconds++;
    updateTimerDisplay();
    checkSessionAlerts();
  }
}

function updateTimerDisplay() {
  const hours = Math.floor(SessionTimer.totalSeconds / 3600);
  const minutes = Math.floor((SessionTimer.totalSeconds % 3600) / 60);
  const seconds = SessionTimer.totalSeconds % 60;
  
  const timerElement = document.getElementById('sessionTimer');
  if (timerElement) {
    timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

function checkSessionAlerts() {
  const lang = AppState.lang;
  
  if (SessionTimer.totalSeconds === SessionTimer.warningThreshold) {
    showSessionAlert(
      lang === 'ar-MA' ? 'تنبيه الاستراحة' : 'Break Reminder',
      lang === 'ar-MA' ? 'لقد استخدمت التطبيق لمدة 30 دقيقة. نوصي بأخذ استراحة قصيرة!' : 
                         'You have used the app for 30 minutes. Consider taking a short break!',
      'warning'
    );
  }
  
  if (SessionTimer.totalSeconds === SessionTimer.alertThreshold) {
    showSessionAlert(
      lang === 'ar-MA' ? 'تحذير مهم' : 'Important Alert',
      lang === 'ar-MA' ? 'لقد استخدمت التطبيق لمدة ساعة كاملة. يوصى بإيقاف الجلسة الآن.' : 
                         'You have been using the app for a full hour. It is recommended to stop the session now.',
      'danger',
      true
    );
  }
}

function showSessionAlert(title, message, type, showPauseButton = false) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `session-alert session-${type}`;
  
  alertDiv.innerHTML = `
    <div class="alert-header">
      <span class="alert-icon">${type === 'warning' ? '⚠️' : '🚨'}</span>
      <h3>${title}</h3>
    </div>
    <p>${message}</p>
    <div class="alert-buttons">
      ${showPauseButton ? 
        `<button class="pause-session" onclick="pauseSessionTimer()">
          ${AppState.lang === 'ar-MA' ? 'إيقاف مؤقت' : 'Pause'}
        </button>` : ''
      }
      <button class="dismiss-alert" onclick="this.parentElement.remove()">
        ${AppState.lang === 'ar-MA' ? 'حسناً' : 'OK'}
      </button>
    </div>
  `;
  
  document.body.appendChild(alertDiv);
  setTimeout(() => alertDiv.classList.add('show'), 100);
}

function pauseSessionTimer() {
  SessionTimer.isPaused = true;
  showNotification(
    'info',
    AppState.lang === 'ar-MA' ? 'تم إيقاف الجلسة مؤقتاً' : 'Session paused'
  );
}

function resetSessionTimer() {
  clearInterval(SessionTimer.timerInterval);
  SessionTimer.startTime = null;
  SessionTimer.totalSeconds = 0;
  SessionTimer.isPaused = false;
  const timerElement = document.getElementById('sessionTimer');
  if (timerElement) timerElement.remove();
}

// ======== الدوال الأصلية (محفوظة بالكامل) ======== //
function initializeApp() {
  createNotificationContainer();
  setupEventListeners();
  checkTimeForTheme();
  loadTheme();
  loadLanguage();
  updateCommonPatterns();
  startSessionTimer(); // بدء عداد الجلسة
}

function createNotificationContainer() {
  const notificationContainer = document.createElement('div');
  notificationContainer.className = 'notification-container';
  document.body.appendChild(notificationContainer);
}

function setupEventListeners() {
  document.getElementById('langSelect').addEventListener('change', changeLanguage);
}

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
  AppState.lang = document.getElementById('langSelect').value;
  localStorage.setItem('lang', AppState.lang);
  updateUI();
  updateCommonPatterns();
}

function loadLanguage() {
  const savedLang = localStorage.getItem('lang') || 'ar-MA';
  document.getElementById('langSelect').value = savedLang;
  AppState.lang = savedLang;
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
  
  document.querySelector('.notification-container').appendChild(notification);
  
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

function showHighProbabilityEffect(type) {
  const effect = document.createElement('div');
  effect.className = `high-prob-effect high-prob-${type.toLowerCase()}`;
  document.body.appendChild(effect);
  
  setTimeout(() => {
    effect.remove();
  }, 2000);
}

function applyButtonEffect(type) {
  const button = document.querySelector(`.${type}`);
  if (!button) return;
  
  const effectClass = 
    type === 'player' ? 'jump-effect' : 
    type === 'banker' ? 'shake-effect' : 
    'spin-effect';
  
  button.classList.add(effectClass);
  
  setTimeout(() => {
    button.classList.remove(effectClass);
  }, 1000);
}

function updateCommonPatterns() {
  const container = document.getElementById('casinoPatterns');
  container.innerHTML = '';
  
  COMMON_CASINO_PATTERNS.forEach(pattern => {
    const patternElement = document.createElement('div');
    patternElement.className = 'pattern-item';
    patternElement.innerHTML = `
      <div class="pattern-name">${pattern.name[AppState.lang] || pattern.name['en-US']}</div>
      <div class="pattern-desc">${pattern.description[AppState.lang] || pattern.description['en-US']}</div>
      <div class="pattern-example">${AppState.lang === 'ar-MA' ? 'مثال:' : 'Example:'} ${pattern.example}</div>
    `;
    container.appendChild(patternElement);
  });
}

function updateLast5Analysis() {
  const last5 = AppState.history.slice(-5);
  const container = document.getElementById('last5Results');
  
  if (last5.length === 0) {
    container.innerHTML = AppState.lang === 'ar-MA' ? 
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
      <span class="player-text">${AppState.lang === 'ar-MA' ? 'لاعب' : 'Player'}</span>
      <span class="trend-value">${counts.P}/5 (${(counts.P/5*100).toFixed(0)}%)</span>
    </div>
    <div class="trend-item">
      <span class="banker-text">${AppState.lang === 'ar-MA' ? 'مصرفي' : 'Banker'}</span>
      <span class="trend-value">${counts.B}/5 (${(counts.B/5*100).toFixed(0)}%)</span>
    </div>
    <div class="trend-item">
      <span class="tie-text">${AppState.lang === 'ar-MA' ? 'تعادل' : 'Tie'}</span>
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

  const filteredHistory = AppState.history.filter(result => result !== 'T');

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
  const filteredHistory = AppState.history.filter(r => r !== 'T');
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
  AppState.markovModel = { P: { P: 0, B: 0, T: 0 }, B: { P: 0, B: 0, T: 0 }, T: { P: 0, B: 0, T: 0 } };
  
  for (let i = 0; i < AppState.history.length - 1; i++) {
    const from = AppState.history[i];
    const to = AppState.history[i + 1];
    AppState.markovModel[from][to]++;
  }

  for (const from in AppState.markovModel) {
    const total = Object.values(AppState.markovModel[from]).reduce((a, b) => a + b, 0);
    for (const to in AppState.markovModel[from]) {
      AppState.markovModel[from][to] = total > 0 ? (AppState.markovModel[from][to] / total) * 100 : 33.3;
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
  const last20 = AppState.history.slice(-20);
  const counts = { P: 0, B: 0, T: 0 };
  last20.forEach(r => counts[r]++);

  if (AppState.statsChart) {
    AppState.statsChart.destroy();
  }

  AppState.statsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [AppState.lang === 'ar-MA' ? 'لاعب' : 'Player', 
               AppState.lang === 'ar-MA' ? 'مصرفي' : 'Banker', 
               AppState.lang === 'ar-MA' ? 'تعادل' : 'Tie'],
      datasets: [{
        label: AppState.lang === 'ar-MA' ? 'آخر 20 جولة' : 'Last 20 Rounds',
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
  AppState.history.push(result);
  
  const lastRecommendation = generateBetRecommendation();
  let notificationShown = false;
  
  if (lastRecommendation.recommendation !== 'none' && AppState.history.length > 1) {
    if (result === lastRecommendation.recommendation) {
      const message = AppState.lang === 'ar-MA' 
        ? `فوز! ${lastRecommendation.message}` 
        : `Win! ${lastRecommendation.message}`;
      showNotification('win', message);
      showEffect('win');
      applyButtonEffect(result === 'P' ? 'player' : result === 'B' ? 'banker' : 'tie');
      notificationShown = true;
    } else if (result !== 'T' && lastRecommendation.recommendation !== 'T') {
      const message = AppState.lang === 'ar-MA' 
        ? `خسارة! ${lastRecommendation.message}` 
        : `Lose! ${lastRecommendation.message}`;
      showNotification('lose', message);
      showEffect('lose');
      applyButtonEffect(result === 'P' ? 'player' : 'banker');
      notificationShown = true;
    }
  }
  
  if (!notificationShown && result === 'T') {
    const message = AppState.lang === 'ar-MA' ? 'تعادل!' : 'Tie!';
    showNotification('tie', message);
    showEffect('tie');
    applyButtonEffect('tie');
  }
  
  if (AppState.currentStreak.type === result) {
    AppState.currentStreak.count++;
  } else {
    AppState.currentStreak.type = result;
    AppState.currentStreak.count = 1;
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
  const displayText = AppState.history.map(r => {
    if (r === 'P') return '🔵';
    if (r === 'B') return '🔴';
    if (r === 'T') return '🟢';
  }).join(' ');
  document.getElementById('historyDisplay').innerText = (AppState.lang === 'ar-MA' ? "جميع الجولات: " : "All rounds: ") + displayText;

  const totalRounds = AppState.history.length;
  const count = { P: 0, B: 0, T: 0 };
  AppState.history.forEach(r => { if (count[r] !== undefined) count[r]++; });

  const statsHTML = `
    <table class="results-table">
      <tr>
        <th>${AppState.lang === 'ar-MA' ? 'عدد الجولات' : 'Rounds'}</th>
        <th class="player-text">${AppState.lang === 'ar-MA' ? 'لاعب' : 'Player'}</th>
        <th class="banker-text">${AppState.lang === 'ar-MA' ? 'مصرفي' : 'Banker'}</th>
        <th class="tie-text">${AppState.lang === 'ar-MA' ? 'تعادل' : 'Tie'}</th>
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

function detectAdvancedPatterns(fullHistory) {
  if (fullHistory.length < 5) return [];
  
  const patterns = [];
  const recentHistory = fullHistory.slice(-15).join('');
  const fullHistoryStr = fullHistory.join('');

  const patternDefinitions = [
    {
      name: 'Dragon',
      regex: /(P{6,}|B{6,})$/,
      description: {
        ar: 'سلسلة طويلة من نفس النتيجة',
        en: 'Long streak of same result'
      },
      baseConfidence: 0.9
    },
    // ... [بقية الأنماط]
  ];

  // ... [كود اكتشاف الأنماط]
}

function advancedPredict(history) {
  // ... [كود التنبؤ المتقدم]
}

function generateBetRecommendation() {
  // ... [كود توليد التوصية]
}

function buildRecommendationMessage(type, confidence, patterns) {
  // ... [كود بناء الرسالة]
}

function showRecommendation() {
  // ... [كود عرض التوصية]
}

function updatePredictions() {
  // ... [كود تحديث التنبؤات]
}

function displayPrediction(prediction) {
  // ... [كود عرض التنبؤ]
}

function generateAdvice() {
  // ... [كود توليد النصيحة]
}

function updateTrendsAndStreaks() {
  // ... [كود تحديث الاتجاهات]
}

function updateUI() {
  // ... [كود تحديث الواجهة]
}

function resetData() {
  const isArabic = AppState.lang === 'ar-MA';
  const confirmMsg = isArabic ? 
    "هل أنت متأكد من أنك تريد إعادة تعيين جميع البيانات؟" : 
    "Are you sure you want to reset all data?";
  
  if (confirm(confirmMsg)) {
    AppState.history = [];
    AppState.currentStreak = { type: null, count: 0 };
    AppState.markovModel = { P: { P: 0, B: 0, T: 0 }, B: { P: 0, B: 0, T: 0 }, T: { P: 0, B: 0, T: 0 } };
    resetSessionTimer();
    updateBigRoad();
    document.getElementById('bigEyeRoad').innerHTML = '';
    document.getElementById('smallRoad').innerHTML = '';
    if (AppState.statsChart) {
      AppState.statsChart.destroy();
      AppState.statsChart = null;
    }
    document.getElementById('predictionResult').innerHTML = `
      <div class="prediction-title">${isArabic ? '📊 تنبؤات متقدمة' : '📊 Advanced Predictions'}</div>
      <div id="predictionBars" class="prediction-bars">
        <div class="prediction-bar player-bar" style="width:33%">P</div>
        <div class="prediction-bar banker-bar" style="width:34%">B</div>
        <div class="prediction-bar tie-bar" style="width:33%">T</div>
      </div>
      <div class="probability-display">
        <div class="probability-item">
          <span class="player-text">${isArabic ? 'لاعب' : 'Player'}</span>
          <span id="playerProb" class="probability-value player-text">33%</span>
        </div>
        <div class="probability-item">
          <span class="banker-text">${isArabic ? 'مصرفي' : 'Banker'}</span>
          <span id="bankerProb" class="probability-value banker-text">34%</span>
        </div>
        <div class="probability-item">
          <span class="tie-text">${isArabic ? 'تعادل' : 'Tie'}</span>
          <span id="tieProb" class="probability-value tie-text">33%</span>
        </div>
      </div>
    `;
    document.getElementById('statsResult').innerText = '';
    document.getElementById('aiStats').innerText = '';
    document.getElementById('aiAdvice').innerText = '';
    document.getElementById('historyDisplay').innerText = '';
    document.getElementById('trendsContent').innerHTML = '';
    document.getElementById('recommendation').innerHTML = '';
    document.getElementById('last5Results').innerHTML = '';
  }
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initializeApp);

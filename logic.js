// حالة التطبيق
const AppState = {
  history: [],
  currentStreak: { type: null, count: 0 },
  lang: 'ar-MA',
  markovModel: { P: { P: 0, B: 0, T: 0 }, B: { P: 0, B: 0, T: 0 }, T: { P: 0, B: 0, T: 0 } },
  statsChart: null,
  sessionTimer: null,
  sessionStartTime: null,
  sessionActive: false
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

// تهيئة التطبيق
function initializeApp() {
  createNotificationContainer();
  setupEventListeners();
  checkTimeForTheme();
  loadTheme();
  loadLanguage();
  updateCommonPatterns();
  startSessionTimer();
}

// إنشاء عنصر الإشعارات
function createNotificationContainer() {
  const notificationContainer = document.createElement('div');
  notificationContainer.className = 'notification-container';
  document.body.appendChild(notificationContainer);
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
  document.getElementById('langSelect').addEventListener('change', changeLanguage);
}

// التحقق من الوقت لتحديد الثيم
function checkTimeForTheme() {
  const hour = new Date().getHours();
  const isDayTime = hour >= 6 && hour < 18;
  if (isDayTime && !document.body.classList.contains('light-mode')) {
    toggleTheme();
  } else if (!isDayTime && document.body.classList.contains('light-mode')) {
    toggleTheme();
  }
}

// تبديل الثيم
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// تحميل الثيم
function loadTheme() {
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
  }
}

// تغيير اللغة
function changeLanguage() {
  AppState.lang = document.getElementById('langSelect').value;
  localStorage.setItem('lang', AppState.lang);
  updateUI();
  updateCommonPatterns();
}

// تحميل اللغة
function loadLanguage() {
  const savedLang = localStorage.getItem('lang') || 'ar-MA';
  document.getElementById('langSelect').value = savedLang;
  AppState.lang = savedLang;
}

// بدء عداد الجلسة
function startSessionTimer() {
  if (AppState.sessionTimer) {
    clearTimeout(AppState.sessionTimer);
  }
  
  AppState.sessionStartTime = Date.now();
  AppState.sessionActive = true;
  
  // تنبيه بعد 15 دقيقة (900000 مللي ثانية)
  AppState.sessionTimer = setTimeout(() => {
    showSessionAlert();
  }, 900000);
}

// عرض تنبيه الجلسة
function showSessionAlert() {
  const isArabic = AppState.lang === 'ar-MA';
  const message = isArabic ? 
    'لقد استخدمت التطبيق لمدة 15 دقيقة. هل تريد أخذ استراحة؟' : 
    'You have been using the app for 15 minutes. Do you want to take a break?';
  
  const alertDiv = document.createElement('div');
  alertDiv.className = 'session-alert';
  alertDiv.innerHTML = `
    <div class="session-alert-content">
      <p>${message}</p>
      <div class="session-alert-buttons">
        <button class="session-alert-button continue">${isArabic ? 'متابعة' : 'Continue'}</button>
        <button class="session-alert-button break">${isArabic ? 'استراحة' : 'Take Break'}</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(alertDiv);
  
  // إضافة مستمعي الأحداث للأزرار
  alertDiv.querySelector('.continue').addEventListener('click', () => {
    alertDiv.remove();
    startSessionTimer();
  });
  
  alertDiv.querySelector('.break').addEventListener('click', () => {
    alertDiv.remove();
    AppState.sessionActive = false;
    showNotification('info', isArabic ? 'خذ استراحة! عد لاحقاً.' : 'Take a break! Come back later.');
  });
}

// عرض الإشعار
function showNotification(type, message) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  const icon = type === 'win' ? '🎉' : type === 'lose' ? '💥' : 'ℹ️';
  
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

// عرض التأثير البصري
function showEffect(type) {
  const effect = document.createElement('div');
  effect.className = `${type}-effect`;
  document.body.appendChild(effect);
  
  setTimeout(() => {
    effect.remove();
  }, 2000);
}

// عرض تأثير نسبة عالية
function showHighProbabilityEffect(type) {
  const effect = document.createElement('div');
  effect.className = `high-prob-effect high-prob-${type.toLowerCase()}`;
  document.body.appendChild(effect);
  
  setTimeout(() => {
    effect.remove();
  }, 2000);
}

// تطبيق تأثير على الزر
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

// تحديث الأنماط الشائعة
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

// تحليل آخر 5 جولات
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

// تحديث Big Road
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

// تحديث الطرق المشتقة
function updateDerivativeRoads() {
  const filteredHistory = AppState.history.filter(r => r !== 'T');
  updateBigEyeRoad(filteredHistory);
  updateSmallRoad(filteredHistory);
}

// تحديث Big Eye Road
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

// تحديث Small Road
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

// عرض الطريق
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

// تحديث نموذج ماركوف
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

// اكتشاف Dragon
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

// تحديث الرسم البياني
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

// إضافة نتيجة جديدة
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

// تحديث العرض
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

// اكتشاف الأنماط المتقدمة
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
    {
      name: 'ZigZag',
      regex: /(PB){3,}$|(BP){3,}$/,
      description: {
        ar: 'نمط متعرج متكرر',
        en: 'Repeated zigzag pattern'
      },
      baseConfidence: 0.8
    },
    {
      name: '5P/5B',
      regex: /PPPPP$|BBBBB$/,
      description: {
        ar: '5 نتائج متتالية متشابهة',
        en: '5 consecutive same results'
      },
      baseConfidence: 0.85
    },
    {
      name: '3T+',
      regex: /TTT$/,
      description: {
        ar: '3 تعادلات متتالية',
        en: '3 consecutive ties'
      },
      baseConfidence: 0.75
    },
    {
      name: 'Last5Player',
      regex: /PPPPP$/,
      description: {
        ar: '5 لاعب متتاليين في آخر 5 جولات',
        en: '5 consecutive Players in last 5 rounds'
      },
      baseConfidence: 0.8
    },
    {
      name: 'Last5Banker',
      regex: /BBBBB$/,
      description: {
        ar: '5 مصرفي متتاليين في آخر 5 جولات',
        en: '5 consecutive Bankers in last 5 rounds'
      },
      baseConfidence: 0.8
    },
    {
      name: 'Alternating5',
      regex: /(PBPBP|BPBPB)$/,
      description: {
        ar: 'تناوب بين اللاعب والمصرفي في آخر 5 جولات',
        en: 'Alternating between Player and Banker in last 5 rounds'
      },
      baseConfidence: 0.7
    }
  ];

  patternDefinitions.forEach(p => {
    const matches = recentHistory.match(p.regex);
    if (matches) {
      const lengthFactor = matches[0].length / 5;
      const confidence = Math.min(0.99, p.baseConfidence * lengthFactor);
      
      patterns.push({
        pattern: p.name,
        description: p.description,
        confidence: confidence,
        length: matches[0].length
      });
    }
  });

  const last5 = fullHistory.slice(-5).join('');
  let historicalMatches = 0;
  for (let i = 0; i < fullHistoryStr.length - 5; i++) {
    if (fullHistoryStr.substr(i, 5) === last5) {
      historicalMatches++;
    }
  }

  if (historicalMatches > 1) {
    patterns.push({
      pattern: 'Historic',
      description: {
        ar: `تكرر النمط ${historicalMatches} مرات سابقاً`,
        en: `Pattern occurred ${historicalMatches} times before`
      },
      confidence: Math.min(0.9, 0.6 + (historicalMatches * 0.1)),
      frequency: historicalMatches
    });
  }

  return patterns.sort((a, b) => b.confidence - a.confidence);
}

// التنبؤ المتقدم
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
  const lastTwenty = history.length >= 20 ? history.slice(-20) : lastTen;
  
  const freq5 = { P: 0, B: 0, T: 0 };
  const freq10 = { P: 0, B: 0, T: 0 };
  const freq20 = { P: 0, B: 0, T: 0 };
  
  lastFive.forEach(r => freq5[r]++);
  lastTen.forEach(r => freq10[r]++);
  lastTwenty.forEach(r => freq20[r]++);
  
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
  
  const percent20 = {
    P: (freq20.P / lastTwenty.length) * 100,
    B: (freq20.B / lastTwenty.length) * 100,
    T: (freq20.T / lastTwenty.length) * 100
  };
  
  let weightedAvg = {
    P: (percent5.P * 0.7 + percent10.P * 0.2 + percent20.P * 0.1),
    B: (percent5.B * 0.7 + percent10.B * 0.2 + percent20.B * 0.1),
    T: (percent5.T * 0.7 + percent10.T * 0.2 + percent20.T * 0.1)
  };
  
  const lastResult = history[history.length - 1];
  if (lastResult) {
    weightedAvg.P = (weightedAvg.P + AppState.markovModel[lastResult].P) / 2;
    weightedAvg.B = (weightedAvg.B + AppState.markovModel[lastResult].B) / 2;
    weightedAvg.T = (weightedAvg.T + AppState.markovModel[lastResult].T) / 2;
  }
  
  const patterns = detectAdvancedPatterns(history);
  patterns.forEach(p => {
    if (p.pattern.includes('P')) {
      weightedAvg.P += 15 * p.confidence;
      weightedAvg.B -= 7 * p.confidence;
      weightedAvg.T -= 8 * p.confidence;
    } else if (p.pattern.includes('B')) {
      weightedAvg.B += 15 * p.confidence;
      weightedAvg.P -= 7 * p.confidence;
      weightedAvg.T -= 8 * p.confidence;
    } else if (p.pattern.includes('T')) {
      weightedAvg.T += 20 * p.confidence;
      weightedAvg.P -= 10 * p.confidence;
      weightedAvg.B -= 10 * p.confidence;
    }
  });
  
  const dragon = detectDragon(history);
  if (dragon.dragon) {
    weightedAvg[dragon.dragon] += 20 * (dragon.length / 10);
    weightedAvg[dragon.dragon === 'P' ? 'B' : 'P'] -= 15 * (dragon.length / 10);
    weightedAvg.T -= 5 * (dragon.length / 10);
  }
  
  weightedAvg.P = Math.max(5, weightedAvg.P);
  weightedAvg.B = Math.max(5, weightedAvg.B);
  weightedAvg.T = Math.max(5, weightedAvg.T);
  
  const total = weightedAvg.P + weightedAvg.B + weightedAvg.T;
  return {
    P: (weightedAvg.P / total * 100),
    B: (weightedAvg.B / total * 100),
    T: (weightedAvg.T / total * 100)
  };
}

// توليد توصية الرهان
function generateBetRecommendation() {
  if (AppState.history.length < 5) {
    return {
      recommendation: "none",
      confidence: 0,
      message: AppState.lang === 'ar-MA' ? 
        "غير كافي من البيانات للتوصية" : 
        "Not enough data for recommendation"
    };
  }

  const prediction = advancedPredict(AppState.history);
  const patterns = detectAdvancedPatterns(AppState.history);
  const strongestPrediction = Object.entries(prediction).reduce((a, b) => 
    a[1] > b[1] ? a : b
  );

  if (strongestPrediction[1] >= 65) {
    const recType = strongestPrediction[0];
    const confidence = Math.min(95, strongestPrediction[1] * 1.1);
    
    return {
      recommendation: recType,
      confidence: confidence,
      message: buildRecommendationMessage(recType, confidence, patterns)
    };
  } else if (patterns.length > 0 && patterns[0].confidence >= 0.75) {
    const pattern = patterns[0];
    const recType = pattern.pattern.includes('P') ? 'P' : 
                   pattern.pattern.includes('B') ? 'B' : 'T';
    
    return {
      recommendation: recType,
      confidence: pattern.confidence * 100,
      message: buildRecommendationMessage(recType, pattern.confidence * 100, patterns)
    };
  }

  return {
    recommendation: "none",
    confidence: 0,
    message: AppState.lang === 'ar-MA' ?
      "لا توجد توصية واضحة حالياً" :
      "No clear recommendation at this time"
  };
}

// بناء رسالة التوصية
function buildRecommendationMessage(type, confidence, patterns) {
  const typeName = AppState.lang === 'ar-MA' ? 
    (type === 'P' ? 'اللاعب' : type === 'B' ? 'المصرفي' : 'التعادل') :
    (type === 'P' ? 'Player' : type === 'B' ? 'Banker' : 'Tie');

  let reason = '';
  
  if (patterns.length > 0) {
    const patternDesc = patterns[0].description[AppState.lang] || patterns[0].description.en;
    reason = AppState.lang === 'ar-MA' ?
      `بسبب النمط: ${patternDesc} (ثقة ${Math.round(confidence)}%)` :
      `Due to pattern: ${patternDesc} (${Math.round(confidence)}% confidence)`;
  } else {
    reason = AppState.lang === 'ar-MA' ?
      `بسبب التكرار التاريخي (ثقة ${Math.round(confidence)}%)` :
      `Due to historical frequency (${Math.round(confidence)}% confidence)`;
  }

  return AppState.lang === 'ar-MA' ?
    `توصية: ${typeName} - ${reason}` :
    `Recommend: ${typeName} - ${reason}`;
}

// عرض التوصية
function showRecommendation() {
  const recommendation = generateBetRecommendation();
  const recommendationElement = document.getElementById('recommendation');
  
  recommendationElement.innerHTML = `
    <div class="recommendation-box ${recommendation.recommendation}">
      <h3>${AppState.lang === 'ar-MA' ? 'توصية التحليل' : 'Analysis Recommendation'}</h3>
      <p>${recommendation.message}</p>
      ${recommendation.confidence > 0 ? `
        <div class="confidence-meter">
          <div class="confidence-bar" style="width: ${recommendation.confidence}%"></div>
          <span>${Math.round(recommendation.confidence)}%</span>
        </div>
      ` : ''}
    </div>
  `;
}

// تحديث التنبؤات
function updatePredictions() {
  const prediction = advancedPredict(AppState.history);
  displayPrediction(prediction);
}

// عرض التنبؤ
function displayPrediction(prediction) {
  const isArabic = AppState.lang === 'ar-MA';
  const threshold = 55.7;
  
  // إزالة الفئات السابقة
  document.querySelectorAll('.prediction-bar').forEach(bar => {
    bar.classList.remove('high-prob');
  });
  document.querySelectorAll('.probability-value').forEach(el => {
    el.classList.remove('high');
  });

  // تحديث الأشرطة والقيم
  document.querySelector('.player-bar').style.width = `${prediction.P}%`;
  document.querySelector('.banker-bar').style.width = `${prediction.B}%`;
  document.querySelector('.tie-bar').style.width = `${prediction.T}%`;
  
  document.getElementById('playerProb').textContent = `${prediction.P.toFixed(1)}%`;
  document.getElementById('bankerProb').textContent = `${prediction.B.toFixed(1)}%`;
  document.getElementById('tieProb').textContent = `${prediction.T.toFixed(1)}%`;

  // تطبيق تأثيرات النسب العالية
  if (prediction.P >= threshold) {
    document.querySelector('.player-bar').classList.add('high-prob');
    document.getElementById('playerProb').classList.add('high');
    showHighProbabilityEffect('player');
  }
  if (prediction.B >= threshold) {
    document.querySelector('.banker-bar').classList.add('high-prob');
    document.getElementById('bankerProb').classList.add('high');
    showHighProbabilityEffect('banker');
  }
  if (prediction.T >= threshold) {
    document.querySelector('.tie-bar').classList.add('high-prob');
    document.getElementById('tieProb').classList.add('high');
    showHighProbabilityEffect('tie');
  }
  
  const statsHTML = `
    <span class="player-text">🔵 ${isArabic ? 'لاعب' : 'Player'}: ${prediction.P.toFixed(1)}%</span> | 
    <span class="banker-text">🔴 ${isArabic ? 'مصرفي' : 'Banker'}: ${prediction.B.toFixed(1)}%</span> | 
    <span class="tie-text">🟢 ${isArabic ? 'تعادل' : 'Tie'}: ${prediction.T.toFixed(1)}%</span>
  `;
  
  document.getElementById('statsResult').innerHTML = statsHTML;
}

// توليد النصيحة
function generateAdvice() {
  const isArabic = AppState.lang === 'ar-MA';
  
  if (AppState.history.length < 3) {
    document.getElementById('aiAdvice').innerHTML = isArabic ? 
      "⏳ انتظر المزيد من الجولات لتحليل الأنماط..." : 
      "⏳ Wait for more rounds to analyze patterns...";
    return;
  }

  const patterns = detectAdvancedPatterns(AppState.history);
  let patternAdvice = "";
  
  if (patterns.length > 0) {
    const strongestPattern = patterns[0];
    patternAdvice = isArabic ?
      `🔍 النمط الأقوى: ${strongestPattern.pattern} (ثقة ${Math.round(strongestPattern.confidence * 100)}%)` :
      `🔍 Strongest pattern: ${strongestPattern.pattern} (${Math.round(strongestPattern.confidence * 100)}% confidence)`;
  }

  document.getElementById('aiAdvice').innerHTML = patternAdvice;
}

// تحديث الاتجاهات والمتتاليات
function updateTrendsAndStreaks() {
  const isArabic = AppState.lang === 'ar-MA';
  
  if (AppState.history.length < 3) {
    document.getElementById('trendsContent').innerHTML = isArabic ? 
      `<div style="text-align:center;padding:10px;">⏳ انتظر المزيد من الجولات لتحليل الاتجاهات...</div>` : 
      `<div style="text-align:center;padding:10px;">⏳ Wait for more rounds to analyze trends...</div>`;
    return;
  }

  const lastSeven = AppState.history.slice(-7);
  const counts = { P: 0, B: 0, T: 0 };
  lastSeven.forEach(r => counts[r]++);
  
  const trendsHTML = `
    <div style="margin-bottom: 15px;">
      <h4 style="margin-bottom: 10px;color:gold;">${isArabic ? 'اتجاهات آخر 7 جولات' : 'Last 7 Rounds Trends'}</h4>
      
      <div class="trend-item">
        <span class="player-text">${isArabic ? 'لاعب' : 'Player'}</span>
        <span class="trend-value">${counts.P}/${lastSeven.length} (${Math.round(counts.P/lastSeven.length*100)}%)</span>
      </div>
      
      <div class="trend-item">
        <span class="banker-text">${isArabic ? 'مصرفي' : 'Banker'}</span>
        <span class="trend-value">${counts.B}/${lastSeven.length} (${Math.round(counts.B/lastSeven.length*100)}%)</span>
      </div>
      
      <div class="trend-item">
        <span class="tie-text">${isArabic ? 'تعادل' : 'Tie'}</span>
        <span class="trend-value">${counts.T}/${lastSeven.length} (${Math.round(counts.T/lastSeven.length*100)}%)</span>
      </div>
    </div>
  `;
  
  document.getElementById('trendsContent').innerHTML = trendsHTML;
}

// تحديث واجهة المستخدم
function updateUI() {
  const isArabic = AppState.lang === 'ar-MA';
  
  document.title = isArabic ? 'BACCARAT SPEED ANALYZER' : 'BACCARAT SPEED ANALYZER';
  document.querySelector('h1').innerHTML = 
    '<span class="logo-b">BACCARAT</span> <span class="logo-s">SPEED</span> <span class="logo-rest">ANALYZER</span>';
  document.querySelector('p').textContent = isArabic ? '📲 اختر نتيجة الجولة:' : '📲 Select round result:';
  document.querySelector('.player').innerHTML = isArabic ? '🔵 اللاعب' : '🔵 Player';
  document.querySelector('.banker').innerHTML = isArabic ? '🔴 المصرفي' : '🔴 Banker';
  document.querySelector('.tie').innerHTML = isArabic ? '🟢 تعادل' : '🟢 Tie';
  document.querySelector('.prediction-title').textContent = isArabic ? '📊 تنبؤات متقدمة' : '📊 Advanced Predictions';
  document.querySelectorAll('.probability-item span')[0].textContent = isArabic ? 'لاعب' : 'Player';
  document.querySelectorAll('.probability-item span')[2].textContent = isArabic ? 'مصرفي' : 'Banker';
  document.querySelectorAll('.probability-item span')[4].textContent = isArabic ? 'تعادل' : 'Tie';
  document.querySelectorAll('.reset')[0].textContent = isArabic ? '🔄 إعادة تعيين' : '🔄 Reset';
  document.querySelector('.big-road-container h2').textContent = isArabic ? 'Big Road (الميجورك)' : 'Big Road';
  document.querySelectorAll('.road-container h3')[0].textContent = isArabic ? 'Big Eye Road' : 'Big Eye Road';
  document.querySelectorAll('.road-container h3')[1].textContent = isArabic ? 'Small Road' : 'Small Road';
  document.querySelector('.last5-analysis h3').textContent = isArabic ? 'تحليل آخر 5 جولات' : 'Last 5 Rounds Analysis';
  document.querySelector('.common-patterns h3').textContent = isArabic ? 'الأنماط الشائعة في الكازينو' : 'Common Casino Patterns';
  
  if (AppState.history.length > 0) {
    updateDisplay();
    updatePredictions();
    generateAdvice();
    updateTrendsAndStreaks();
    showRecommendation();
    updateChart();
    updateLast5Analysis();
  }
}

// إعادة تعيين البيانات
function resetData() {
  const isArabic = AppState.lang === 'ar-MA';
  const confirmMsg = isArabic ? 
    "هل أنت متأكد من أنك تريد إعادة تعيين جميع البيانات؟" : 
    "Are you sure you want to reset all data?";
  
  if (confirm(confirmMsg)) {
    AppState.history = [];
    AppState.currentStreak = { type: null, count: 0 };
    AppState.markovModel = { P: { P: 0, B: 0, T: 0 }, B: { P: 0, B: 0, T: 0 }, T: { P: 0, B: 0, T: 0 } };
    
    // إعادة تعيين عداد الجلسة
    if (AppState.sessionTimer) {
      clearTimeout(AppState.sessionTimer);
    }
    startSessionTimer();
    
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

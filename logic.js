// حالة التطبيق الموسعة
const AppState = {
  history: [],
  currentStreak: { type: null, count: 0 },
  lang: 'ar-MA',
  markovModel: { P: { P: 0, B: 0, T: 0 }, B: { P: 0, B: 0, T: 0 }, T: { P: 0, B: 0, T: 0 }},
  statsChart: null,
  advancedModel: null,
  useAdvancedModel: false,
  modelPerformance: { basic: 0, advanced: 0 },
  lastPredictions: []
};

// تهيئة التطبيق
async function initializeApp() {
  createNotificationContainer();
  setupEventListeners();
  loadTheme();
  loadLanguage();
  loadHistory();
  updateWinStats();
  
  if (AppState.history.length > 30) {
    await initializeModels();
  }
  updateUI();
}

// تحميل التاريخ من localStorage
function loadHistory() {
  const savedHistory = localStorage.getItem('baccaratHistory');
  if (savedHistory) {
    AppState.history = JSON.parse(savedHistory);
    updateMarkovModel();
  }
}

// حفظ التاريخ إلى localStorage
function saveHistory() {
  localStorage.setItem('baccaratHistory', JSON.stringify(AppState.history));
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
  document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);
  document.querySelector('.player').addEventListener('click', () => addResult('P'));
  document.querySelector('.banker').addEventListener('click', () => addResult('B'));
  document.querySelector('.tie').addEventListener('click', () => addResult('T'));
  document.querySelector('.reset').addEventListener('click', resetData);
  document.getElementById('toggleModelBtn').addEventListener('click', toggleAdvancedModel);
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
}

// تحميل اللغة
function loadLanguage() {
  const savedLang = localStorage.getItem('lang') || 'ar-MA';
  document.getElementById('langSelect').value = savedLang;
  AppState.lang = savedLang;
}

// إضافة نتيجة جديدة
async function addResult(result) {
  AppState.history.push(result);
  saveHistory();
  
  // تحديث النموذج والواجهة
  updateMarkovModel();
  updateDisplay();
  updateBigRoad();
  updateDerivativeRoads();
  updateTrendsAndStreaks();
  await updatePredictions();
  updateWinStats();
  
  // عرض الإشعار
  const message = AppState.lang === 'ar-MA' ? 
    `تم تسجيل نتيجة: ${result === 'P' ? 'لاعب' : result === 'B' ? 'مصرفي' : 'تعادل'}` :
    `Recorded result: ${result === 'P' ? 'Player' : result === 'B' ? 'Banker' : 'Tie'}`;
  
  showNotification('info', message);
}

// تحديث إحصائيات الفوز
function updateWinStats() {
  const counts = { P: 0, B: 0, T: 0 };
  AppState.history.forEach(r => counts[r]++);
  
  const total = AppState.history.length || 1;
  
  document.getElementById('playerWins').textContent = counts.P;
  document.getElementById('bankerWins').textContent = counts.B;
  document.getElementById('tieWins').textContent = counts.T;
  
  document.getElementById('playerWinPercent').textContent = `${((counts.P / total) * 100).toFixed(1)}%`;
  document.getElementById('bankerWinPercent').textContent = `${((counts.B / total) * 100).toFixed(1)}%`;
  document.getElementById('tieWinPercent').textContent = `${((counts.T / total) * 100).toFixed(1)}%`;
}

// تحديث العرض
function updateDisplay() {
  const displayText = AppState.history.map(r => {
    if (r === 'P') return '🔵';
    if (r === 'B') return '🔴';
    if (r === 'T') return '🟢';
  }).join(' ');
  
  document.getElementById('historyDisplay').textContent = 
    (AppState.lang === 'ar-MA' ? "جميع الجولات: " : "All rounds: ") + displayText;

  const totalRounds = AppState.history.length;
  const counts = { P: 0, B: 0, T: 0 };
  AppState.history.forEach(r => counts[r]++);

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
        <td class="player-text">${counts.P} (${totalRounds > 0 ? ((counts.P/totalRounds)*100).toFixed(1) : 0}%)</td>
        <td class="banker-text">${counts.B} (${totalRounds > 0 ? ((counts.B/totalRounds)*100).toFixed(1) : 0}%)</td>
        <td class="tie-text">${counts.T} (${totalRounds > 0 ? ((counts.T/totalRounds)*100).toFixed(1) : 0}%)</td>
      </tr>
    </table>
  `;
  document.getElementById('aiStats').innerHTML = statsHTML;
}

// تحديث نموذج ماركوف
function updateMarkovModel() {
  AppState.markovModel = { P: { P: 0, B: 0, T: 0 }, B: { P: 0, B: 0, T: 0 }, T: { P: 0, B: 0, T: 0 }};
  
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

// التنبؤ باستخدام نموذج ماركوف الأساسي
function basicMarkovPredict() {
  if (AppState.history.length < 1) {
    return { P: 33.3, B: 33.3, T: 33.3 };
  }

  const lastResult = AppState.history[AppState.history.length - 1];
  return AppState.markovModel[lastResult] || { P: 33.3, B: 33.3, T: 33.3 };
}

// تحديث التنبؤات
async function updatePredictions() {
  const prediction = basicMarkovPredict();
  displayPrediction(prediction);
}

// عرض التنبؤ
function displayPrediction(prediction) {
  document.querySelector('.player-bar').style.width = `${prediction.P}%`;
  document.querySelector('.banker-bar').style.width = `${prediction.B}%`;
  document.querySelector('.tie-bar').style.width = `${prediction.T}%`;
  
  document.getElementById('playerProb').textContent = `${prediction.P.toFixed(1)}%`;
  document.getElementById('bankerProb').textContent = `${prediction.B.toFixed(1)}%`;
  document.getElementById('tieProb').textContent = `${prediction.T.toFixed(1)}%`;
  
  const statsHTML = AppState.lang === 'ar-MA' ? 
    `🔵 لاعب: ${prediction.P.toFixed(1)}% | 🔴 مصرفي: ${prediction.B.toFixed(1)}% | 🟢 تعادل: ${prediction.T.toFixed(1)}%` :
    `🔵 Player: ${prediction.P.toFixed(1)}% | 🔴 Banker: ${prediction.B.toFixed(1)}% | 🟢 Tie: ${prediction.T.toFixed(1)}%`;
  
  document.getElementById('statsResult').textContent = statsHTML;
}

// تبديل النموذج المتقدم
function toggleAdvancedModel() {
  AppState.useAdvancedModel = !AppState.useAdvancedModel;
  document.getElementById('modelStatus').textContent = 
    AppState.lang === 'ar-MA' ? 
    `النموذج الحالي: ${AppState.useAdvancedModel ? 'المتقدم' : 'الأساسي'}` :
    `Current model: ${AppState.useAdvancedModel ? 'Advanced' : 'Basic'}`;
  
  showNotification('info', AppState.lang === 'ar-MA' ?
    `تم التبديل إلى النموذج ${AppState.useAdvancedModel ? 'المتقدم' : 'الأساسي'}` :
    `Switched to ${AppState.useAdvancedModel ? 'advanced' : 'basic'} model`);
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
    cell.textContent = result;
    cell.style.gridColumn = col + 1;
    cell.style.gridRow = row + 1;
    bigRoadElement.appendChild(cell);
  }
}

// تحديث الطرق المشتقة
function updateDerivativeRoads() {
  const filteredHistory = AppState.history.filter(r => r !== 'T');
  updateRoad('bigEyeRoad', filteredHistory, 2);
  updateRoad('smallRoad', filteredHistory, 3);
  updateRoad('cockroachRoad', filteredHistory, 4);
}

function updateRoad(elementId, history, step) {
  const roadElement = document.getElementById(elementId);
  roadElement.innerHTML = '';
  
  let matrix = [[]];
  let row = 0;

  for (let i = step - 1; i < history.length; i++) {
    if (i >= step && history[i] === history[i - step]) {
      matrix[row].push(history[i]);
    } else {
      row++;
      matrix[row] = [history[i]];
    }
  }

  renderRoad(matrix, roadElement);
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

// تحديث الاتجاهات والمتتاليات
function updateTrendsAndStreaks() {
  if (AppState.history.length < 1) {
    document.getElementById('trendsContent').innerHTML = 
      AppState.lang === 'ar-MA' ? 'لا توجد بيانات كافية' : 'Not enough data';
    return;
  }

  const lastFive = AppState.history.slice(-5);
  const counts = { P: 0, B: 0, T: 0 };
  lastFive.forEach(r => counts[r]++);

  const trendsHTML = `
    <div class="trend-item">
      <span class="player-text">${AppState.lang === 'ar-MA' ? 'لاعب' : 'Player'}</span>
      <span class="trend-value">${counts.P}</span>
    </div>
    <div class="trend-item">
      <span class="banker-text">${AppState.lang === 'ar-MA' ? 'مصرفي' : 'Banker'}</span>
      <span class="trend-value">${counts.B}</span>
    </div>
    <div class="trend-item">
      <span class="tie-text">${AppState.lang === 'ar-MA' ? 'تعادل' : 'Tie'}</span>
      <span class="trend-value">${counts.T}</span>
    </div>
  `;
  
  document.getElementById('trendsContent').innerHTML = trendsHTML;
}

// إعادة تعيين البيانات
function resetData() {
  const confirmMsg = AppState.lang === 'ar-MA' ? 
    "هل أنت متأكد من أنك تريد إعادة تعيين جميع البيانات؟" : 
    "Are you sure you want to reset all data?";
  
  if (confirm(confirmMsg)) {
    AppState.history = [];
    saveHistory();
    updateMarkovModel();
    updateDisplay();
    updateBigRoad();
    updateDerivativeRoads();
    updateTrendsAndStreaks();
    updatePredictions();
    updateWinStats();
    
    showNotification('info', AppState.lang === 'ar-MA' ? 
      'تم إعادة تعيين جميع البيانات' : 'All data has been reset');
  }
}

// عرض الإشعار
function showNotification(type, message) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  const icon = type === 'info' ? 'ℹ️' : '⚠️';
  
  notification.innerHTML = `
    <div>
      <span class="notification-icon">${icon}</span>
      <span>${message}</span>
    </div>
    <button class="close-notification">×</button>
  `;
  
  const container = document.querySelector('.notification-container');
  container.appendChild(notification);
  
  notification.querySelector('.close-notification').addEventListener('click', () => {
    notification.remove();
  });
  
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// تحديث واجهة المستخدم
function updateUI() {
  const isArabic = AppState.lang === 'ar-MA';
  
  document.querySelector('h1').innerHTML = 
    '<span class="logo-b">BACCARAT</span> <span class="logo-s">PRO</span> <span class="logo-rest">ANALYZER</span>';
  document.querySelector('p').textContent = isArabic ? '📲 اختر نتيجة الجولة:' : '📲 Select round result:';
  document.querySelector('.player').textContent = isArabic ? '🔵 اللاعب' : '🔵 Player';
  document.querySelector('.banker').textContent = isArabic ? '🔴 المصرفي' : '🔴 Banker';
  document.querySelector('.tie').textContent = isArabic ? '🟢 تعادل' : '🟢 Tie';
  document.querySelector('.reset').textContent = isArabic ? '🔄 إعادة تعيين' : '🔄 Reset';
  document.querySelector('.prediction-title').textContent = isArabic ? '📊 تنبؤات متقدمة' : '📊 Advanced Predictions';
  document.querySelectorAll('.probability-item span')[0].textContent = isArabic ? 'لاعب' : 'Player';
  document.querySelectorAll('.probability-item span')[2].textContent = isArabic ? 'مصرفي' : 'Banker';
  document.querySelectorAll('.probability-item span')[4].textContent = isArabic ? 'تعادل' : 'Tie';
  document.querySelector('.big-road-container h2').textContent = isArabic ? 'Big Road (الميجورك)' : 'Big Road';
  document.querySelector('.win-stats h3').textContent = isArabic ? '📈 إحصائيات الفوز' : '📈 Win Statistics';
  document.querySelectorAll('.stat-title')[0].textContent = isArabic ? '🔵 اللاعب' : '🔵 Player';
  document.querySelectorAll('.stat-title')[1].textContent = isArabic ? '🔴 المصرفي' : '🔴 Banker';
  document.querySelectorAll('.stat-title')[2].textContent = isArabic ? '🟢 تعادل' : '🟢 Tie';
  
  updateDisplay();
  updatePredictions();
  updateTrendsAndStreaks();
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initializeApp);

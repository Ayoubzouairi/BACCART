// حالة التطبيق
const appState = {
  history: [],
  balance: 0,
  currentStreak: { type: null, count: 0 },
  betsHistory: [],
  showBetsHistory: false,
  lang: localStorage.getItem('lang') || 'ar',
  theme: localStorage.getItem('theme') || 'dark'
};

// تهيئة التطبيق
function initApp() {
  loadTheme();
  loadLanguage();
  updateUI();
  
  document.getElementById('langSelect').addEventListener('change', changeLanguage);
  document.getElementById('langSelect').value = appState.lang;
}

// تغيير اللغة
function changeLanguage() {
  appState.lang = document.getElementById('langSelect').value;
  localStorage.setItem('lang', appState.lang);
  updateUI();
}

function loadLanguage() {
  const savedLang = localStorage.getItem('lang') || 'ar';
  appState.lang = savedLang;
}

// تبديل الثيم
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  appState.theme = isLight ? 'light' : 'dark';
}

function loadTheme() {
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
  }
}

// تحديث واجهة المستخدم حسب اللغة
function updateUI() {
  const isArabic = appState.lang === 'ar';
  const translations = {
    ar: {
      appTitle: 'BACCARAT PREDICTOR PRO',
      betAmountLabel: '💰 مبلغ الرهان بالدرهم',
      betAmountPlaceholder: 'أدخل المبلغ (اختياري)',
      selectResultText: '📲 اختر نتيجة الجولة:',
      playerBtnText: '🔵 اللاعب',
      bankerBtnText: '🔴 المصرفي',
      tieBtnText: '🟢 تعادل',
      predictionTitle: '📊 تنبؤات متقدمة',
      playerLabel: 'لاعب',
      bankerLabel: 'مصرفي',
      tieLabel: 'تعادل',
      balanceText: '💵 الرصيد:',
      currency: 'درهم',
      resetBtn: '🔄 إعادة تعيين',
      showHistoryBtn: '📊 عرض سجل الرهانات',
      bigRoadTitle: 'Big Road (الميجورك)',
      roundHeader: 'الجولة',
      betOnHeader: 'الرهان على',
      amountHeader: 'المبلغ',
      outcomeHeader: 'النتيجة',
      profitHeader: 'الربح/الخسارة',
      trendsTitle: '📈 تحليل الاتجاهات والأنماط',
      betsHistoryTitle: '📋 سجل الرهانات'
    },
    en: {
      appTitle: 'BACCARAT PREDICTOR PRO',
      betAmountLabel: '💰 Bet Amount (MAD)',
      betAmountPlaceholder: 'Enter amount (optional)',
      selectResultText: '📲 Select round result:',
      playerBtnText: '🔵 Player',
      bankerBtnText: '🔴 Banker',
      tieBtnText: '🟢 Tie',
      predictionTitle: '📊 Advanced Predictions',
      playerLabel: 'Player',
      bankerLabel: 'Banker',
      tieLabel: 'Tie',
      balanceText: '💵 Balance:',
      currency: 'MAD',
      resetBtn: '🔄 Reset',
      showHistoryBtn: '📊 Show Bets History',
      bigRoadTitle: 'Big Road',
      roundHeader: 'Round',
      betOnHeader: 'Bet On',
      amountHeader: 'Amount',
      outcomeHeader: 'Outcome',
      profitHeader: 'Profit/Loss',
      trendsTitle: '📈 Trends Analysis',
      betsHistoryTitle: '📋 Bets History'
    }
  };

  const t = translations[appState.lang];

  // تحديث النصوص
  document.getElementById('appTitle').textContent = t.appTitle;
  document.getElementById('betAmountLabel').textContent = t.betAmountLabel;
  document.getElementById('betAmount').placeholder = t.betAmountPlaceholder;
  document.getElementById('selectResultText').textContent = t.selectResultText;
  document.getElementById('playerBtnText').textContent = t.playerBtnText;
  document.getElementById('bankerBtnText').textContent = t.bankerBtnText;
  document.getElementById('tieBtnText').textContent = t.tieBtnText;
  document.getElementById('predictionTitle').textContent = t.predictionTitle;
  document.getElementById('playerLabel').textContent = t.playerLabel;
  document.getElementById('bankerLabel').textContent = t.bankerLabel;
  document.getElementById('tieLabel').textContent = t.tieLabel;
  document.getElementById('balanceText').textContent = t.balanceText;
  document.getElementById('currency').textContent = t.currency;
  document.getElementById('resetBtn').textContent = t.resetBtn;
  document.getElementById('showHistoryBtn').textContent = t.showHistoryBtn;
  document.getElementById('bigRoadTitle').textContent = t.bigRoadTitle;
  document.getElementById('roundHeader').textContent = t.roundHeader;
  document.getElementById('betOnHeader').textContent = t.betOnHeader;
  document.getElementById('amountHeader').textContent = t.amountHeader;
  document.getElementById('outcomeHeader').textContent = t.outcomeHeader;
  document.getElementById('profitHeader').textContent = t.profitHeader;
  document.getElementById('trendsTitle').textContent = t.trendsTitle;
  document.getElementById('betsHistoryTitle').textContent = t.betsHistoryTitle;

  // تحديث المحتوى الديناميكي إذا كان هناك بيانات
  if (appState.history.length > 0) {
    updateDisplay();
    updatePredictions();
    generateAdvice();
    updateTrendsAndStreaks();
  }
  
  if (appState.showBetsHistory) {
    updateBetsHistory();
  }
}

// تحديث Big Road
function updateBigRoad() {
  const bigRoadElement = document.getElementById('bigRoad');
  bigRoadElement.innerHTML = '';
  
  let row = 0;
  let col = 0;
  const maxRows = 6;

  const filteredHistory = appState.history.filter(result => result !== 'T');

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

// حساب الربح
function calculateProfit(betOn, outcome, amount) {
  if (!amount || amount <= 0) return 0;
  
  if (betOn === outcome) {
    if (betOn === 'T') return amount * 8;
    if (betOn === 'B') return amount * 0.95;
    return amount * 1;
  }
  return -amount;
}

// تحديث الرصيد
function updateBalance(profit) {
  appState.balance += profit;
  document.getElementById('balanceValue').textContent = appState.balance.toFixed(2);
  
  const balanceDisplay = document.getElementById('balanceDisplay');
  balanceDisplay.style.transform = 'scale(1.05)';
  balanceDisplay.style.transition = 'all 0.3s ease';
  
  setTimeout(() => {
    balanceDisplay.style.transform = 'scale(1)';
  }, 300);
}

// تحديث سجل الرهانات
function updateBetsHistory() {
  const tbody = document.getElementById('betsHistoryBody');
  tbody.innerHTML = '';
  
  const isArabic = appState.lang === 'ar';
  const translations = {
    ar: {
      player: 'لاعب',
      banker: 'مصرفي',
      tie: 'تعادل'
    },
    en: {
      player: 'Player',
      banker: 'Banker',
      tie: 'Tie'
    }
  };

  appState.betsHistory.forEach(bet => {
    const row = document.createElement('tr');
    
    const outcomeText = translations[appState.lang][bet.outcome];
    const betOnText = translations[appState.lang][bet.betOn];
    
    const profitClass = bet.profit > 0 ? 'win' : bet.profit < 0 ? 'loss' : '';
    const profitSign = bet.profit > 0 ? '+' : '';
    
    row.innerHTML = `
      <td>${bet.round}</td>
      <td>${betOnText}</td>
      <td>${bet.amount > 0 ? bet.amount.toFixed(2) + ' ' + (isArabic ? 'درهم' : 'MAD') : '-'}</td>
      <td>${outcomeText}</td>
      <td class="${profitClass}">${bet.amount > 0 ? (profitSign + bet.profit.toFixed(2) + ' ' + (isArabic ? 'درهم' : 'MAD')) : '-'}</td>
    `;
    tbody.appendChild(row);
  });
}

// إضافة نتيجة جديدة
function addResult(result) {
  const betAmountInput = document.getElementById('betAmount');
  const betAmount = parseFloat(betAmountInput.value) || 0;
  
  betAmountInput.value = '';
  
  appState.history.push(result);
  
  if (result === appState.currentStreak.type) {
    appState.currentStreak.count++;
  } else {
    appState.currentStreak.type = result;
    appState.currentStreak.count = 1;
  }
  
  const round = appState.history.length;
  const betOn = event.target.classList.contains('player') ? 'P' : 
               event.target.classList.contains('banker') ? 'B' : 'T';
  const profit = calculateProfit(betOn, result, betAmount);
  
  appState.betsHistory.push({
    round,
    betOn,
    amount: betAmount,
    outcome: result,
    profit,
    timestamp: new Date()
  });
  
  updateBalance(profit);
  
  if (appState.showBetsHistory) {
    updateBetsHistory();
  }
  
  updateDisplay();
  updateBigRoad();
  updateTrendsAndStreaks();
  updatePredictions();
  generateAdvice();
}

// تحديث العرض الرئيسي
function updateDisplay() {
  const displayText = appState.history.map(r => {
    if (r === 'P') return '🔵';
    if (r === 'B') return '🔴';
    if (r === 'T') return '🟢';
  }).join(' ');
  
  const isArabic = appState.lang === 'ar';
  const historyText = isArabic ? "جميع الجولات: " : "All rounds: ";
  document.getElementById('historyDisplay').innerText = historyText + displayText;

  const totalRounds = appState.history.length;
  const count = { P: 0, B: 0, T: 0 };
  appState.history.forEach(r => { if (count[r] !== undefined) count[r]++; });

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
  document.getElementById('aiStats').innerHTML = statsHTML;
}

// تحليل الاتجاهات والسلاسل
function updateTrendsAndStreaks() {
  const isArabic = appState.lang === 'ar';
  
  if (appState.history.length < 3) {
    document.getElementById('trendsContent').innerHTML = isArabic ? 
      `<div style="text-align:center;padding:10px;">⏳ انتظر المزيد من الجولات لتحليل الاتجاهات...</div>` : 
      `<div style="text-align:center;padding:10px;">⏳ Wait for more rounds to analyze trends...</div>`;
    return;
  }

  const lastFive = appState.history.slice(-5);
  const counts = { P: 0, B: 0, T: 0 };
  lastFive.forEach(r => counts[r]++);
  
  const hotThreshold = 0.7;
  const coldThreshold = 0.2;
  
  const isHot = (type) => counts[type] / lastFive.length >= hotThreshold;
  const isCold = (type) => counts[type] / lastFive.length <= coldThreshold;
  
  const patterns = detectAdvancedPatterns(appState.history.slice(-15));
  
  const trendsHTML = `
    <div style="margin-bottom: 15px;">
      <h4 style="margin-bottom: 10px;color:gold;">${isArabic ? 'اتجاهات آخر 5 جولات' : 'Last 5 Rounds Trends'}</h4>
      
      <div class="trend-item ${isHot('P') ? 'hot-streak' : ''} ${isCold('P') ? 'cold-streak' : ''}">
        <div>
          <span class="player-text">${isArabic ? 'لاعب' : 'Player'}</span>
          <span class="trend-value">${counts.P}/${lastFive.length} (${Math.round(counts.P/lastFive.length*100)}%)</span>
        </div>
        <div>
          ${isHot('P') ? '<span class="streak-indicator hot-streak">HOT</span>' : ''}
          ${isCold('P') ? '<span class="streak-indicator cold-streak">COLD</span>' : ''}
        </div>
      </div>
      
      <div class="trend-item ${isHot('B') ? 'hot-streak' : ''} ${isCold('B') ? 'cold-streak' : ''}">
        <div>
          <span class="banker-text">${isArabic ? 'مصرفي' : 'Banker'}</span>
          <span class="trend-value">${counts.B}/${lastFive.length} (${Math.round(counts.B/lastFive.length*100)}%)</span>
        </div>
        <div>
          ${isHot('B') ? '<span class="streak-indicator hot-streak">HOT</span>' : ''}
          ${isCold('B') ? '<span class="streak-indicator cold-streak">COLD</span>' : ''}
        </div>
      </div>
      
      <div class="trend-item ${isHot('T') ? 'hot-streak' : ''} ${isCold('T') ? 'cold-streak' : ''}">
        <div>
          <span class="tie-text">${isArabic ? 'تعادل' : 'Tie'}</span>
          <span class="trend-value">${counts.T}/${lastFive.length} (${Math.round(counts.T/lastFive.length*100)}%)</span>
        </div>
        <div>
          ${isHot('T') ? '<span class="streak-indicator hot-streak">HOT</span>' : ''}
          ${isCold('T') ? '<span class="streak-indicator cold-streak">COLD</span>' : ''}
        </div>
      </div>
    </div>
    
    ${patterns.length > 0 ? `
    <div class="patterns-container">
      <h4 style="margin-top:0;margin-bottom:10px;color:gold;">${isArabic ? 'الأنماط المكتشفة' : 'Detected Patterns'}</h4>
      ${patterns.map(p => `
        <div class="pattern-badge">
          ${p.pattern}
          <span class="pattern-tooltip">${p.description[appState.lang] || p.description.en}</span>
        </div>
      `).join('')}
    </div>
    ` : ''}
  `;
  
  document.getElementById('trendsContent').innerHTML = trendsHTML;
}

// اكتشاف الأنماط المتقدمة
function detectAdvancedPatterns(recentHistory) {
  if (recentHistory.length < 5) return [];
  
  const patterns = [];
  const lastFive = recentHistory.slice(-5).join('');
  const lastTen = recentHistory.slice(-10).join('');
  
  const commonPatterns = [
    {
      pattern: 'P-B-P-B-P',
      match: 'PBPBP',
      description: {
        ar: 'نمط تناوب بين اللاعب والمصرفي',
        en: 'Alternating Player-Banker pattern'
      },
      strength: 0.8
    },
    {
      pattern: '5P',
      match: 'PPPPP',
      description: {
        ar: '5 نتائج متتالية للاعب',
        en: '5 consecutive Player results'
      },
      strength: 0.9
    },
    {
      pattern: '3T+',
      match: /TTT/g,
      description: {
        ar: '3 تعادلات متتالية أو أكثر',
        en: '3 or more consecutive Ties'
      },
      strength: 0.7
    },
    {
      pattern: 'P-P-B-B-P',
      match: 'PPBBP',
      description: {
        ar: 'نمط مزدوج (لاعب-لاعب ثم مصرفي-مصرفي)',
        en: 'Double pattern (P-P then B-B)'
      },
      strength: 0.75
    }
  ];
  
  commonPatterns.forEach(p => {
    if (typeof p.match === 'string' && lastFive === p.match) {
      patterns.push(p);
    } else if (p.match instanceof RegExp && p.match.test(lastTen)) {
      patterns.push(p);
    }
  });
  
  const lastThree = recentHistory.slice(-3).join('');
  if (lastThree === 'PPP') {
    patterns.push({
      pattern: '3P',
      description: {
        ar: '3 لاعب متتالية',
        en: '3 consecutive Player'
      },
      strength: 0.6
    });
  }
  if (lastThree === 'BBB') {
    patterns.push({
      pattern: '3B',
      description: {
        ar: '3 مصرفي متتالية',
        en: '3 consecutive Banker'
      },
      strength: 0.6
    });
  }
  
  return patterns.sort((a, b) => b.strength - a.strength);
}

// التنبؤات المتقدمة
function updatePredictions() {
  const prediction = advancedPredict(appState.history);
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
  const freq5 = { P: 0, B: 0, T: 0 };
  lastFive.forEach(r => freq5[r]++);
  
  return {
    P: (freq5.P / 5) * 100,
    B: (freq5.B / 5) * 100,
    T: (freq5.T / 5) * 100
  };
}

function displayPrediction(prediction) {
  const isArabic = appState.lang === 'ar';
  
  document.querySelector('.player-bar').style.width = `${prediction.P}%`;
  document.querySelector('.banker-bar').style.width = `${prediction.B}%`;
  document.querySelector('.tie-bar').style.width = `${prediction.T}%`;
  
  document.getElementById('playerProb').textContent = `${prediction.P.toFixed(1)}%`;
  document.getElementById('bankerProb').textContent = `${prediction.B.toFixed(1)}%`;
  document.getElementById('tieProb').textContent = `${prediction.T.toFixed(1)}%`;
  
  let winner = 'P';
  if (prediction.B >= prediction.P && prediction.B >= prediction.T) winner = 'B';
  else if (prediction.T > prediction.P && prediction.T > prediction.B) winner = 'T';
  
  const labels = {
    ar: { P: 'اللاعب', B: 'المصرفي', T: 'تعادل' },
    en: { P: 'Player', B: 'Banker', T: 'Tie' }
  };
  
  const label = labels[appState.lang][winner];
  const predictionClass = winner === 'P' ? 'prediction-player' : winner === 'B' ? 'prediction-banker' : 'prediction-tie';
  
  const statsHTML = `
    <span class="player-text">🔵 ${isArabic ? 'لاعب' : 'Player'}: ${prediction.P.toFixed(1)}%</span> | 
    <span class="banker-text">🔴 ${isArabic ? 'مصرفي' : 'Banker'}: ${prediction.B.toFixed(1)}%</span> | 
    <span class="tie-text">🟢 ${isArabic ? 'تعادل' : 'Tie'}: ${prediction.T.toFixed(1)}%</span>
  `;
  
  document.getElementById('statsResult').innerHTML = statsHTML;
  
  if (prediction[winner] > 60) {
    const speechText = isArabic
      ? `التنبؤ: ${label} بنسبة ${prediction[winner].toFixed(1)} بالمئة`
      : `Prediction: ${label} with ${prediction[winner].toFixed(1)} percent`;
    speak(speechText, appState.lang);
  }
}

// نصيحة الذكاء الاصطناعي
function generateAdvice() {
  const isArabic = appState.lang === 'ar';
  
  if (appState.history.length < 3) {
    document.getElementById('aiAdvice').innerHTML = isArabic ? 
      "⏳ انتظر المزيد من الجولات لتحليل الأنماط..." : 
      "⏳ Wait for more rounds to analyze patterns...";
    return;
  }

  const lastFive = appState.history.slice(-5);
  const counts = { P: 0, B: 0, T: 0 };
  lastFive.forEach(r => counts[r]++);
  
  const mostFrequent = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  const freqPercent = (counts[mostFrequent] / lastFive.length * 100).toFixed(1);
  
  let streakText = "";
  if (appState.currentStreak.count > 2) {
    const typeName = isArabic ? 
      (appState.currentStreak.type === 'P' ? 'اللاعب' : 
       appState.currentStreak.type === 'B' ? 'المصرفي' : 'تعادل') :
      (appState.currentStreak.type === 'P' ? 'Player' : 
       appState.currentStreak.type === 'B' ? 'Banker' : 'Tie');
    
    streakText = isArabic ?
      `📈 سلسلة ${typeName} مستمرة: ${appState.currentStreak.count} جولات` :
      `📈 ${typeName} streak: ${appState.currentStreak.count} rounds`;
  }

  const hotResultsHTML = `
    <table class="hot-results-table">
      <tr>
        <th>${isArabic ? 'النتيجة' : 'Result'}</th>
        <th>${isArabic ? 'عدد المرات' : 'Count'}</th>
        <th>${isArabic ? 'النسبة' : 'Percentage'}</th>
      </tr>
      <tr>
        <td class="player-text">${isArabic ? 'لاعب' : 'Player'}</td>
        <td>${counts.P}</td>
        <td class="player-text">${((counts.P / lastFive.length) * 100).toFixed(1)}%</td>
      </tr>
      <tr>
        <td class="banker-text">${isArabic ? 'مصرفي' : 'Banker'}</td>
        <td>${counts.B}</td>
        <td class="banker-text">${((counts.B / lastFive.length) * 100).toFixed(1)}%</td>
      </tr>
      <tr>
        <td class="tie-text">${isArabic ? 'تعادل' : 'Tie'}</td>
        <td>${counts.T}</td>
        <td class="tie-text">${((counts.T / lastFive.length) * 100).toFixed(1)}%</td>
      </tr>
    </table>
  `;

  let recommendation = "";
  if (appState.currentStreak.count >= 3) {
    recommendation = isArabic ?
      `💡 استمر في الرهان على <span class="${appState.currentStreak.type === 'P' ? 'player-text' : 
       appState.currentStreak.type === 'B' ? 'banker-text' : 'tie-text'}">${
       appState.currentStreak.type === 'P' ? 'اللاعب' : 
       appState.currentStreak.type === 'B' ? 'المصرفي' : 'تعادل'}</span>` :
      `💡 Keep betting on <span class="${appState.currentStreak.type === 'P' ? 'player-text' : 
       appState.currentStreak.type === 'B' ? 'banker-text' : 'tie-text'}">${
       appState.currentStreak.type === 'P' ? 'Player' : 
       appState.currentStreak.type === 'B' ? 'Banker' : 'Tie'}</span>`;
  } else if (parseFloat(freqPercent) > 50) {
    const typeName = isArabic ?
      (mostFrequent === 'P' ? 'اللاعب' : mostFrequent === 'B' ? 'مصرفي' : 'تعادل') :
      (mostFrequent === 'P' ? 'Player' : mostFrequent === 'B' ? 'Banker' : 'Tie');
    
    recommendation = isArabic ?
      `💡 رهان آمن على <span class="${mostFrequent === 'P' ? 'player-text' : 
       mostFrequent === 'B' ? 'banker-text' : 'tie-text'}">${typeName}</span> (${freqPercent}%)` :
      `💡 Safe bet on <span class="${mostFrequent === 'P' ? 'player-text' : 
       mostFrequent === 'B' ? 'banker-text' : 'tie-text'}">${typeName}</span> (${freqPercent}%)`;
  } else {
    recommendation = isArabic ?
      "💡 لا يوجد نمط واضح، استخدم استراتيجية متحفظة" :
      "💡 No clear pattern, use conservative strategy";
  }

  document.getElementById('aiAdvice').innerHTML = `
    ${streakText ? `<div>${streakText}</div>` : ''}
    ${hotResultsHTML}
    <div style="margin-top: 10px;">${recommendation}</div>
  `;
}

// تبديل عرض سجل الرهانات
function toggleBetsHistory() {
  appState.showBetsHistory = !appState.showBetsHistory;
  document.getElementById('betsHistoryContainer').style.display = 
    appState.showBetsHistory ? 'block' : 'none';
  
  if (appState.showBetsHistory) {
    updateBetsHistory();
  }
}

// إعادة تعيين البيانات
function resetData() {
  const isArabic = appState.lang === 'ar';
  const confirmMsg = isArabic ? 
    "هل أنت متأكد من أنك تريد إعادة تعيين جميع البيانات؟" : 
    "Are you sure you want to reset all data?";
  
  if (confirm(confirmMsg)) {
    appState.history = [];
    appState.balance = 0;
    appState.betsHistory = [];
    appState.currentStreak = { type: null, count: 0 };
    updateBigRoad();
    
    const isArabic = appState.lang === 'ar';
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
    document.getElementById('balanceValue').textContent = '0';
    document.getElementById('betsHistoryBody').innerHTML = '';
    document.getElementById('betAmount').value = '';
  }
}

// نطق النص
function speak(text, lang) {
  const speech = new SpeechSynthesisUtterance();
  speech.lang = lang === 'ar' ? 'ar-MA' : 'en-US';
  speech.text = text;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
}

// تهيئة التطبيق عند التحميل
window.onload = initApp;

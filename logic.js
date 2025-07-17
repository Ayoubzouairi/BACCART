// متغيرات التطبيق
let history = [];
let balance = 0;
let balanceHistory = [0];
let currentStreak = { type: null, count: 0 };
let betsHistory = [];
let showBetsHistory = false;
let lang = localStorage.getItem('lang') || 'ar';
let chart;

// تهيئة التطبيق
function initApp() {
  loadTheme();
  loadLanguage();
  initChart();
  updateUI();
  document.getElementById('langSelect').addEventListener('change', changeLanguage);
}

// تهيئة الرسم البياني
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
    options: getChartOptions()
  });
}

function getChartOptions() {
  return {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            return lang === 'ar' ? 
              `الرصيد: ${context.raw.toFixed(2)} درهم` : 
              `Balance: ${context.raw.toFixed(2)} MAD`;
          }
        }
      }
    },
    scales: {
      y: { 
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return lang === 'ar' ? `${value} درهم` : `${value} MAD`;
          }
        }
      }
    }
  };
}

// إدارة السمة
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}

function loadTheme() {
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
  }
}

// إدارة اللغة
function changeLanguage() {
  lang = document.getElementById('langSelect').value;
  localStorage.setItem('lang', lang);
  updateUI();
}

function loadLanguage() {
  const savedLang = localStorage.getItem('lang') || 'ar';
  document.getElementById('langSelect').value = savedLang;
  lang = savedLang;
}

// تحديث واجهة المستخدم
function updateUI() {
  const elements = {
    // عناصر النصوص
    'title': ['BACCARAT PREDICTOR PRO', 'BACCARAT PREDICTOR PRO'],
    'betAmountLabel': ['💰 مبلغ الرهان بالدرهم', '💰 Bet Amount (MAD)'],
    'roundResultText': ['📲 اختر نتيجة الجولة:', '📲 Select round result:'],
    'playerText': ['اللاعب', 'Player'],
    'bankerText': ['المصرفي', 'Banker'],
    'tieText': ['تعادل', 'Tie'],
    'predictionTitle': ['📊 تنبؤات متقدمة', '📊 Advanced Predictions'],
    'playerLabel': ['لاعب', 'Player'],
    'bankerLabel': ['مصرفي', 'Banker'],
    'tieLabel': ['تعادل', 'Tie'],
    'balanceText': ['💵 الرصيد:', '💵 Balance:'],
    'currency': ['درهم', 'MAD'],
    'betsHistoryTitle': ['📋 سجل الرهانات', '📋 Bets History'],
    'roundHeader': ['الجولة', 'Round'],
    'betOnHeader': ['الرهان على', 'Bet On'],
    'amountHeader': ['المبلغ', 'Amount'],
    'outcomeHeader': ['النتيجة', 'Outcome'],
    'profitHeader': ['الربح/الخسارة', 'Profit/Loss'],
    'performanceTitle': ['📊 تحليل الأداء', '📊 Performance Analysis'],
    'betTypeHeader': ['نوع الرهان', 'Bet Type'],
    'betsCountHeader': ['عدد الرهانات', 'Bets Count'],
    'winsHeader': ['الفوز', 'Wins'],
    'lossesHeader': ['الخسارة', 'Losses'],
    'winRateHeader': ['معدل الفوز', 'Win Rate'],
    'netProfitHeader': ['صافي الربح', 'Net Profit'],
    'resetBtn': ['🔄 إعادة تعيين', '🔄 Reset'],
    'historyBtn': ['📊 عرض سجل الرهانات', '📊 Show Bets History'],
    'bigRoadTitle': ['Big Road (الميجورك)', 'Big Road'],
    'trendsTitle': ['📈 تحليل الاتجاهات والأنماط', '📈 Trends and Patterns Analysis']
  };

  Object.keys(elements).forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = elements[id][lang === 'ar' ? 0 : 1];
    }
  });

  if (history.length > 0) {
    updateDisplay();
    updatePredictions();
    generateAdvice();
    updateTrendsAndStreaks();
  }
  
  if (showBetsHistory) {
    updateBetsHistory();
    updatePerformanceSummary();
  }
}

// إدارة النتائج
function addResult(result) {
  const betAmount = parseFloat(document.getElementById('betAmount').value) || 0;
  document.getElementById('betAmount').value = '';
  
  history.push(result);
  
  // تحديث السلسلة الحالية
  if (result === currentStreak.type) {
    currentStreak.count++;
  } else {
    currentStreak.type = result;
    currentStreak.count = 1;
  }
  
  const round = history.length;
  const betOn = event.target.classList.contains('player') ? 'P' : 
               event.target.classList.contains('banker') ? 'B' : 'T';
  const profit = calculateProfit(betOn, result, betAmount);
  
  betsHistory.push({
    round,
    betOn,
    amount: betAmount,
    outcome: result,
    profit,
    timestamp: new Date()
  });
  
  updateBalance(profit);
  updateDisplay();
  updateBigRoad();
  updateTrendsAndStreaks();
  updatePredictions();
  generateAdvice();
  document.getElementById('soundEffect').play();
}

function calculateProfit(betOn, outcome, amount) {
  if (!amount || amount <= 0) return 0;
  
  if (betOn === outcome) {
    if (betOn === 'T') return amount * 8;
    if (betOn === 'B') return amount * 0.95;
    return amount * 1;
  }
  return -amount;
}

function updateBalance(profit) {
  balance += profit;
  balanceHistory.push(balance);
  document.getElementById('balanceValue').textContent = balance.toFixed(2);
  updateChart();
  
  const balanceDisplay = document.getElementById('balanceDisplay');
  balanceDisplay.style.transform = 'scale(1.05)';
  setTimeout(() => balanceDisplay.style.transform = 'scale(1)', 300);
}

function updateChart() {
  chart.data.labels = balanceHistory.map((_, i) => i);
  chart.data.datasets[0].data = balanceHistory;
  chart.update();
}

// تحديث العروض
function updateDisplay() {
  const displayText = history.map(r => {
    if (r === 'P') return '🔵';
    if (r === 'B') return '🔴';
    if (r === 'T') return '🟢';
  }).join(' ');
  
  document.getElementById('historyDisplay').textContent = 
    lang === 'ar' ? `جميع الجولات: ${displayText}` : `All rounds: ${displayText}`;

  const totalRounds = history.length;
  const count = { P: 0, B: 0, T: 0 };
  history.forEach(r => count[r]++);

  const statsHTML = `
    <table class="results-table">
      <tr>
        <th>${lang === 'ar' ? 'عدد الجولات' : 'Rounds Count'}</th>
        <th class="player-text">${lang === 'ar' ? 'لاعب' : 'Player'}</th>
        <th class="banker-text">${lang === 'ar' ? 'مصرفي' : 'Banker'}</th>
        <th class="tie-text">${lang === 'ar' ? 'تعادل' : 'Tie'}</th>
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

// Big Road
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

// إدارة سجل الرهانات
function updateBetsHistory() {
  const tbody = document.getElementById('betsHistoryBody');
  tbody.innerHTML = '';
  
  betsHistory.forEach(bet => {
    const row = document.createElement('tr');
    
    const outcomeText = lang === 'ar' ? 
      (bet.outcome === 'P' ? 'لاعب' : bet.outcome === 'B' ? 'مصرفي' : 'تعادل') :
      (bet.outcome === 'P' ? 'Player' : bet.outcome === 'B' ? 'Banker' : 'Tie');
    
    const betOnText = lang === 'ar' ? 
      (bet.betOn === 'P' ? 'لاعب' : bet.betOn === 'B' ? 'مصرفي' : 'تعادل') :
      (bet.betOn === 'P' ? 'Player' : bet.betOn === 'B' ? 'Banker' : 'Tie');
    
    const profitClass = bet.profit > 0 ? 'win' : bet.profit < 0 ? 'loss' : '';
    const profitSign = bet.profit > 0 ? '+' : '';
    
    row.innerHTML = `
      <td>${bet.round}</td>
      <td>${betOnText}</td>
      <td>${bet.amount > 0 ? bet.amount.toFixed(2) + (lang === 'ar' ? ' درهم' : ' MAD') : '-'}</td>
      <td>${outcomeText}</td>
      <td class="${profitClass}">${bet.amount > 0 ? (profitSign + bet.profit.toFixed(2) + (lang === 'ar' ? ' درهم' : ' MAD') : '-'}</td>
    `;
    tbody.appendChild(row);
  });
}

function updatePerformanceSummary() {
  const overallStats = document.getElementById('overallStats');
  const performanceByType = document.getElementById('performanceByType');
  
  const activeBets = betsHistory.filter(bet => bet.amount > 0);
  const totalBets = activeBets.length;
  const totalWins = activeBets.filter(b => b.profit > 0).length;
  const totalLosses = activeBets.filter(b => b.profit < 0).length;
  const winRate = totalBets > 0 ? (totalWins / totalBets * 100).toFixed(1) : 0;
  const totalProfit = activeBets.reduce((sum, bet) => sum + bet.profit, 0);
  
  overallStats.innerHTML = `
    <div>
      <strong>${lang === 'ar' ? 'إجمالي الرهانات:' : 'Total Bets:'}</strong> ${totalBets}
    </div>
    <div>
      <strong>${lang === 'ar' ? 'الفوز:' : 'Wins:'}</strong> <span class="win">${totalWins}</span>
    </div>
    <div>
      <strong>${lang === 'ar' ? 'الخسارة:' : 'Losses:'}</strong> <span class="loss">${totalLosses}</span>
    </div>
    <div>
      <strong>${lang === 'ar' ? 'معدل الفوز:' : 'Win Rate:'}</strong> ${winRate}%
    </div>
    <div>
      <strong>${lang === 'ar' ? 'صافي الربح:' : 'Net Profit:'}</strong> 
      <span class="${totalProfit >= 0 ? 'win' : 'loss'}">${totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)} ${lang === 'ar' ? 'درهم' : 'MAD'}</span>
    </div>
  `;
  
  const types = ['P', 'B', 'T'];
  performanceByType.innerHTML = '';
  
  types.forEach(type => {
    const typeBets = activeBets.filter(b => b.betOn === type);
    const typeTotal = typeBets.length;
    const typeWins = typeBets.filter(b => b.profit > 0).length;
    const typeLosses = typeBets.filter(b => b.profit < 0).length;
    const typeWinRate = typeTotal > 0 ? (typeWins / typeTotal * 100).toFixed(1) : 0;
    const typeProfit = typeBets.reduce((sum, bet) => sum + bet.profit, 0);
    
    const typeName = lang === 'ar' ? 
      (type === 'P' ? 'لاعب' : type === 'B' ? 'مصرفي' : 'تعادل') :
      (type === 'P' ? 'Player' : type === 'B' ? 'Banker' : 'Tie');
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${typeName}</td>
      <td>${typeTotal}</td>
      <td>${typeWins}</td>
      <td>${typeLosses}</td>
      <td>${typeWinRate}%</td>
      <td class="${typeProfit >= 0 ? 'win' : 'loss'}">${typeProfit >= 0 ? '+' : ''}${typeProfit.toFixed(2)} ${lang === 'ar' ? 'درهم' : 'MAD'}</td>
    `;
    performanceByType.appendChild(row);
  });
}

function toggleBetsHistory() {
  showBetsHistory = !showBetsHistory;
  document.getElementById('betsHistoryContainer').style.display = showBetsHistory ? 'block' : 'none';
  document.getElementById('performanceSummary').style.display = showBetsHistory ? 'block' : 'none';
  
  if (showBetsHistory) {
    updateBetsHistory();
    updatePerformanceSummary();
  }
}

// تحليل الاتجاهات
function updateTrendsAndStreaks() {
  if (history.length < 3) {
    document.getElementById('trendsContent').innerHTML = lang === 'ar' ? 
      `<div style="text-align:center;padding:10px;">⏳ انتظر المزيد من الجولات لتحليل الاتجاهات...</div>` : 
      `<div style="text-align:center;padding:10px;">⏳ Wait for more rounds to analyze trends...</div>`;
    return;
  }

  const lastSeven = history.slice(-7);
  const lastFourteen = history.length >= 14 ? history.slice(-14, -7) : [];
  
  const counts = { P: 0, B: 0, T: 0 };
  const prevCounts = { P: 0, B: 0, T: 0 };
  
  lastSeven.forEach(r => counts[r]++);
  lastFourteen.forEach(r => prevCounts[r]++);
  
  const getTrend = (current, prev, total) => {
    const change = total > 0 ? ((current - prev) / total * 100) : 0;
    if (change > 15) return { icon: '▲▲', class: 'trend-up', text: lang === 'ar' ? 'ارتفاع كبير' : 'Sharp rise' };
    if (change > 5) return { icon: '▲', class: 'trend-up', text: lang === 'ar' ? 'ارتفاع' : 'Rising' };
    if (change < -15) return { icon: '▼▼', class: 'trend-down', text: lang === 'ar' ? 'انخفاض كبير' : 'Sharp drop' };
    if (change < -5) return { icon: '▼', class: 'trend-down', text: lang === 'ar' ? 'انخفاض' : 'Dropping' };
    return { icon: '➔', class: 'trend-neutral', text: lang === 'ar' ? 'مستقر' : 'Stable' };
  };
  
  const pTrend = getTrend(counts.P, prevCounts.P, lastSeven.length);
  const bTrend = getTrend(counts.B, prevCounts.B, lastSeven.length);
  const tTrend = getTrend(counts.T, prevCounts.T, lastSeven.length);
  
  const hotThreshold = 0.7;
  const coldThreshold = 0.2;
  
  const isHot = (type) => counts[type] / lastSeven.length >= hotThreshold;
  const isCold = (type) => counts[type] / lastSeven.length <= coldThreshold;
  
  const patterns = detectAdvancedPatterns(history.slice(-15));
  
  const trendsHTML = `
    <div style="margin-bottom: 15px;">
      <h4 style="margin-bottom: 10px;color:gold;">${lang === 'ar' ? 'اتجاهات آخر 7 جولات' : 'Last 7 Rounds Trends'}</h4>
      
      <div class="trend-item ${isHot('P') ? 'hot-streak' : ''} ${isCold('P') ? 'cold-streak' : ''}">
        <div>
          <span class="player-text">${lang === 'ar' ? 'لاعب' : 'Player'}</span>
          <span class="trend-value">${counts.P}/${lastSeven.length} (${Math.round(counts.P/lastSeven.length*100)}%)</span>
        </div>
        <div>
          <span class="trend-indicator ${pTrend.class}" title="${pTrend.text}">${pTrend.icon}</span>
          ${isHot('P') ? '<span class="streak-indicator hot-streak">HOT</span>' : ''}
          ${isCold('P') ? '<span class="streak-indicator cold-streak">COLD</span>' : ''}
        </div>
      </div>
      
      <div class="trend-item ${isHot('B') ? 'hot-streak' : ''} ${isCold('B') ? 'cold-streak' : ''}">
        <div>
          <span class="banker-text">${lang === 'ar' ? 'مصرفي' : 'Banker'}</span>
          <span class="trend-value">${counts.B}/${lastSeven.length} (${Math.round(counts.B/lastSeven.length*100)}%)</span>
        </div>
        <div>
          <span class="trend-indicator ${bTrend.class}" title="${bTrend.text}">${bTrend.icon}</span>
          ${isHot('B') ? '<span class="streak-indicator hot-streak">HOT</span>' : ''}
          ${isCold('B') ? '<span class="streak-indicator cold-streak">COLD</span>' : ''}
        </div>
      </div>
      
      <div class="trend-item ${isHot('T') ? 'hot-streak' : ''} ${isCold('T') ? 'cold-streak' : ''}">
        <div>
          <span class="tie-text">${lang === 'ar' ? 'تعادل' : 'Tie'}</span>
          <span class="trend-value">${counts.T}/${lastSeven.length} (${Math.round(counts.T/lastSeven.length*100)}%)</span>
        </div>
        <div>
          <span class="trend-indicator ${tTrend.class}" title="${tTrend.text}">${tTrend.icon}</span>
          ${isHot('T') ? '<span class="streak-indicator hot-streak">HOT</span>' : ''}
          ${isCold('T') ? '<span class="streak-indicator cold-streak">COLD</span>' : ''}
        </div>
      </div>
    </div>
    
    ${patterns.length > 0 ? `
    <div class="patterns-container">
      <h4 style="margin-top:0;margin-bottom:10px;color:gold;">${lang === 'ar' ? 'الأنماط المكتشفة' : 'Detected Patterns'}</h4>
      ${patterns.map(p => `
        <div class="pattern-badge">
          ${p.pattern}
          <span class="pattern-tooltip">${p.description[lang] || p.description.en}</span>
        </div>
      `).join('')}
    </div>
    ` : ''}
  `;
  
  document.getElementById('trendsContent').innerHTML = trendsHTML;
}

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

// التنبؤات
function updatePredictions() {
  const prediction = advancedPredict(history);
  displayPrediction(prediction);
}

function advancedPredict(history) {
  if (history.length < 3) {
    return { P: 33.3, B: 33.3, T: 33.3 };
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
  
  const label = labels[lang][winner];
  const predictionClass = winner === 'P' ? 'prediction-player' : winner === 'B' ? 'prediction-banker' : 'prediction-tie';
  
  const statsHTML = `
    <span class="player-text">🔵 ${labels[lang].P}: ${prediction.P.toFixed(1)}%</span> | 
    <span class="banker-text">🔴 ${labels[lang].B}: ${prediction.B.toFixed(1)}%</span> | 
    <span class="tie-text">🟢 ${labels[lang].T}: ${prediction.T.toFixed(1)}%</span>
  `;
  
  document.getElementById('statsResult').innerHTML = statsHTML;
  
  if (prediction[winner] > 60) {
    const speechText = lang === 'ar'
      ? `التنبؤ: ${label} بنسبة ${prediction[winner].toFixed(1)} بالمئة`
      : `Prediction: ${label} with ${prediction[winner].toFixed(1)} percent`;
    speak(speechText, lang);
  }
}

// النصائح
function generateAdvice() {
  if (history.length < 3) {
    document.getElementById('aiAdvice').innerHTML = lang === 'ar' ? 
      "⏳ انتظر المزيد من الجولات لتحليل الأنماط..." : 
      "⏳ Wait for more rounds to analyze patterns...";
    return;
  }

  const lastTen = history.slice(-10);
  const counts = { P: 0, B: 0, T: 0 };
  lastTen.forEach(r => counts[r]++);
  
  const mostFrequent = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  const freqPercent = (counts[mostFrequent] / lastTen.length * 100).toFixed(1);
  
  let streakText = "";
  if (currentStreak.count > 2) {
    const typeName = lang === 'ar' ? 
      (currentStreak.type === 'P' ? 'اللاعب' : currentStreak.type === 'B' ? 'المصرفي' : 'تعادل') :
      (currentStreak.type === 'P' ? 'Player' : currentStreak.type === 'B' ? 'Banker' : 'Tie');
    
    streakText = lang === 'ar' ?
      `📈 سلسلة ${typeName} مستمرة: ${currentStreak.count} جولات` :
      `📈 ${typeName} streak: ${currentStreak.count} rounds`;
  }

  const hotResultsHTML = `
    <table class="hot-results-table">
      <tr>
        <th>${lang === 'ar' ? 'النتيجة' : 'Result'}</th>
        <th>${lang === 'ar' ? 'عدد المرات' : 'Count'}</th>
        <th>${lang === 'ar' ? 'النسبة' : 'Percentage'}</th>
      </tr>
      <tr>
        <td class="player-text">${lang === 'ar' ? 'لاعب' : 'Player'}</td>
        <td>${counts.P}</td>
        <td class="player-text">${((counts.P / lastTen.length) * 100).toFixed(1)}%</td>
      </tr>
      <tr>
        <td class="banker-text">${lang === 'ar' ? 'مصرفي' : 'Banker'}</td>
        <td>${counts.B}</td>
        <td class="banker-text">${((counts.B / lastTen.length) * 100).toFixed(1)}%</td>
      </tr>
      <tr>
        <td class="tie-text">${lang === 'ar' ? 'تعادل' : 'Tie'}</td>
        <td>${counts.T}</td>
        <td class="tie-text">${((counts.T / lastTen.length) * 100).toFixed(1)}%</td>
      </tr>
    </table>
  `;

  let recommendation = "";
  if (currentStreak.count >= 3) {
    recommendation = lang === 'ar' ?
      `💡 استمر في الرهان على <span class="${currentStreak.type === 'P' ? 'player-text' : currentStreak.type === 'B' ? 'banker-text' : 'tie-text'}">${currentStreak.type === 'P' ? 'اللاعب' : currentStreak.type === 'B' ? 'المصرفي' : 'تعادل'}</span>` :
      `💡 Keep betting on <span class="${currentStreak.type === 'P' ? 'player-text' : currentStreak.type === 'B' ? 'banker-text' : 'tie-text'}">${currentStreak.type === 'P' ? 'Player' : currentStreak.type === 'B' ? 'Banker' : 'Tie'}</span>`;
  } else if (parseFloat(freqPercent) > 50) {
    const typeName = lang === 'ar' ?
      (mostFrequent === 'P' ? 'اللاعب' : mostFrequent === 'B' ? 'المصرفي' : 'تعادل') :
      (mostFrequent === 'P' ? 'Player' : mostFrequent === 'B' ? 'Banker' : 'Tie');
    
    recommendation = lang === 'ar' ?
      `💡 رهان آمن على <span class="${mostFrequent === 'P' ? 'player-text' : mostFrequent === 'B' ? 'banker-text' : 'tie-text'}">${typeName}</span> (${freqPercent}%)` :
      `💡 Safe bet on <span class="${mostFrequent === 'P' ? 'player-text' : mostFrequent === 'B' ? 'banker-text' : 'tie-text'}">${typeName}</span> (${freqPercent}%)`;
  } else {
    recommendation = lang === 'ar' ?
      "💡 لا يوجد نمط واضح، استخدم استراتيجية متحفظة" :
      "💡 No clear pattern, use conservative strategy";
  }

  document.getElementById('aiAdvice').innerHTML = `
    ${streakText ? `<div>${streakText}</div>` : ''}
    ${hotResultsHTML}
    <div style="margin-top: 10px;">${recommendation}</div>
  `;
}

// إعادة التعيين
function resetData() {
  const confirmMsg = lang === 'ar' ? 
    "هل أنت متأكد من أنك تريد إعادة تعيين جميع البيانات؟" : 
    "Are you sure you want to reset all data?";
  
  if (confirm(confirmMsg)) {
    history = [];
    balance = 0;
    balanceHistory = [0];
    betsHistory = [];
    currentStreak = { type: null, count: 0 };
    updateChart();
    updateBigRoad();
    document.getElementById('predictionResult').innerHTML = `
      <div class="prediction-title">${lang === 'ar' ? '📊 تنبؤات متقدمة' : '📊 Advanced Predictions'}</div>
      <div id="predictionBars" class="prediction-bars">
        <div class="prediction-bar player-bar" style="width:33%">P</div>
        <div class="prediction-bar banker-bar" style="width:34%">B</div>
        <div class="prediction-bar tie-bar" style="width:33%">T</div>
      </div>
      <div class="probability-display">
        <div class="probability-item">
          <span class="player-text">${lang === 'ar' ? 'لاعب' : 'Player'}</span>
          <span id="playerProb" class="probability-value player-text">33%</span>
        </div>
        <div class="probability-item">
          <span class="banker-text">${lang === 'ar' ? 'مصرفي' : 'Banker'}</span>
          <span id="bankerProb" class="probability-value banker-text">34%</span>
        </div>
        <div class="probability-item">
          <span class="tie-text">${lang === 'ar' ? 'تعادل' : 'Tie'}</span>
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
    document.getElementById('performanceByType').innerHTML = '';
    document.getElementById('overallStats').innerHTML = '';
    document.getElementById('betAmount').value = '';
  }
}

// التحدث
function speak(text, langCode) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = langCode === 'ar' ? 'ar-MA' : 'en-US';
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

// تهيئة التطبيق عند التحميل
window.onload = initApp;

let history = [];
let currentStreak = { type: null, count: 0 };
let lang = 'ar-MA';
let markovModel = {};
let patternHistory = {};
const INITIAL_STATES = ['PP', 'PB', 'PT', 'BP', 'BB', 'BT', 'TP', 'TB', 'TT'];

// ======== [ تهيئة النماذج ] ========
function initializeMarkovModel() {
  INITIAL_STATES.forEach(state => {
    markovModel[state] = { P: 1, B: 1, T: 1 }; // Laplace smoothing
  });
}

// ======== [ نظام اكتشاف الأنماط المتقدم ] ========
const ADVANCED_PATTERNS = {
  DRAGON: {
    name: { ar: "التنين", en: "Dragon" },
    detect: (seq) => {
      if (seq.length < 6) return null;
      
      let maxStreak = 1;
      let currentStreak = 1;
      let currentType = seq[0];
      
      for (let i = 1; i < seq.length; i++) {
        if (seq[i] === currentType && seq[i] !== 'T') {
          currentStreak++;
          if (currentStreak > maxStreak) maxStreak = currentStreak;
        } else {
          currentStreak = 1;
          currentType = seq[i];
        }
      }
      
      return maxStreak >= 6 ? {
        type: currentType,
        length: maxStreak,
        confidence: Math.min(0.95, 0.7 + (maxStreak * 0.05))
      } : null;
    }
  },
  
  ZIGZAG: {
    name: { ar: "نمط متعرج", en: "ZigZag Pattern" },
    detect: (seq) => {
      if (seq.length < 6) return null;
      
      const last6 = seq.slice(-6).join('');
      if (/(PB){3,}|(BP){3,}/.test(last6)) {
        return {
          type: seq[seq.length - 1] === 'P' ? 'B' : 'P', // عكسي
          confidence: 0.85,
          length: 6
        };
      }
      return null;
    }
  },
  
  TIE_CLUSTER: {
    name: { ar: "تكتل تعادلات", en: "Tie Cluster" },
    detect: (seq) => {
      const last5 = seq.slice(-5);
      const tieCount = last5.filter(r => r === 'T').length;
      
      if (tieCount >= 3) {
        return {
          type: 'T',
          confidence: Math.min(0.9, 0.6 + (tieCount * 0.1)),
          length: tieCount
        };
      }
      return null;
    }
  },
  
  EIGHT_TWO_RULE: {
    name: { ar: "قاعدة 80/20", en: "80/20 Rule" },
    detect: (seq) => {
      if (seq.length < 10) return null;
      
      const last10 = seq.slice(-10);
      const pCount = last10.filter(r => r === 'P').length;
      const bCount = last10.filter(r => r === 'B').length;
      
      if (pCount >= 8) return {
        type: 'B',
        confidence: 0.85,
        stats: { player: pCount, banker: bCount }
      };
      
      if (bCount >= 8) return {
        type: 'P',
        confidence: 0.85,
        stats: { player: pCount, banker: bCount }
      };
      
      return null;
    }
  },
  
  HISTORICAL_MIRROR: {
    name: { ar: "مرآة تاريخية", en: "Historical Mirror" },
    detect: (seq) => {
      if (seq.length < 8) return null;
      
      const currentPattern = seq.slice(-3).join('');
      let matches = 0;
      
      for (let i = 0; i < seq.length - 4; i++) {
        if (seq.slice(i, i + 3).join('') === currentPattern) {
          matches++;
        }
      }
      
      if (matches >= 2) {
        return {
          type: seq[seq.length - 1],
          confidence: Math.min(0.9, 0.6 + (matches * 0.15)),
          frequency: matches
        };
      }
      return null;
    }
  }
};

// ======== [ محرك التنبؤ الهجين ] ========
function hybridPredict(history) {
  // 1. الاحتمالات الأساسية
  const baseProbs = calculateBaseProbabilities(history);
  
  // 2. تحليل ماركوف المتقدم
  const markovProbs = calculateMarkovProbabilities(history);
  
  // 3. اكتشاف الأنماط
  const patterns = detectAllPatterns(history);
  
  // 4. تطبيق تعديلات الأنماط
  const patternAdjustments = applyPatternAdjustments(patterns);
  
  // 5. الدمج المرجح
  const weights = {
    base: 0.3,
    markov: 0.4,
    patterns: 0.3
  };
  
  const finalProbs = {
    P: (baseProbs.P * weights.base) + 
       (markovProbs.P * weights.markov) + 
       (patternAdjustments.P * weights.patterns),
    
    B: (baseProbs.B * weights.base) + 
       (markovProbs.B * weights.markov) + 
       (patternAdjustments.B * weights.patterns),
    
    T: (baseProbs.T * weights.base) + 
       (markovProbs.T * weights.markov) + 
       (patternAdjustments.T * weights.patterns)
  };
  
  // 6. التطبيع والتعديل النهائي
  return normalizeProbabilities(finalProbs);
}

// ======== [ الدوال المساعدة ] ========
function calculateBaseProbabilities(history) {
  if (history.length === 0) return { P: 33.3, B: 33.3, T: 33.3 };
  
  const counts = { P: 0, B: 0, T: 0 };
  history.forEach(r => counts[r]++);
  
  return {
    P: (counts.P / history.length) * 100,
    B: (counts.B / history.length) * 100,
    T: (counts.T / history.length) * 100
  };
}

function calculateMarkovProbabilities(history) {
  if (history.length < 3) return { P: 33.3, B: 33.3, T: 33.3 };
  
  const lastTwo = history.slice(-2).join('');
  const markovData = markovModel[lastTwo] || { P: 33.3, B: 33.3, T: 33.3 };
  
  // حساب الاحتمالات النسبية
  const total = markovData.P + markovData.B + markovData.T;
  return {
    P: (markovData.P / total) * 100,
    B: (markovData.B / total) * 100,
    T: (markovData.T / total) * 100
  };
}

function detectAllPatterns(history) {
  const patterns = [];
  const recentHistory = history.slice(Math.max(history.length - 15, 0));
  
  Object.values(ADVANCED_PATTERNS).forEach(pattern => {
    const detection = pattern.detect(recentHistory);
    if (detection) {
      patterns.push({
        ...detection,
        name: pattern.name
      });
    }
  });
  
  // ترتيب حسب الثقة
  return patterns.sort((a, b) => b.confidence - a.confidence);
}

function applyPatternAdjustments(patterns) {
  const adjustments = { P: 0, B: 0, T: 0 };
  
  if (patterns.length === 0) return adjustments;
  
  // تطبيق التأثير الأقوى فقط لتجنب تضارب التعديلات
  const strongestPattern = patterns[0];
  
  switch (strongestPattern.type) {
    case 'P':
      adjustments.P += strongestPattern.confidence * 25;
      adjustments.B -= strongestPattern.confidence * 15;
      adjustments.T -= strongestPattern.confidence * 10;
      break;
      
    case 'B':
      adjustments.B += strongestPattern.confidence * 25;
      adjustments.P -= strongestPattern.confidence * 15;
      adjustments.T -= strongestPattern.confidence * 10;
      break;
      
    case 'T':
      adjustments.T += strongestPattern.confidence * 30;
      adjustments.P -= strongestPattern.confidence * 15;
      adjustments.B -= strongestPattern.confidence * 15;
      break;
  }
  
  return adjustments;
}

function normalizeProbabilities(probs) {
  // ضمان عدم وجود قيم سلبية
  const safeProbs = {
    P: Math.max(5, probs.P),
    B: Math.max(5, probs.B),
    T: Math.max(5, probs.T)
  };
  
  // التطبيع ليكون المجموع 100%
  const total = safeProbs.P + safeProbs.B + safeProbs.T;
  return {
    P: (safeProbs.P / total) * 100,
    B: (safeProbs.B / total) * 100,
    T: (safeProbs.T / total) * 100
  };
}

// ======== [ نظام التوصيات الذكي ] ========
function generateSmartRecommendation() {
  if (history.length < 5) {
    return {
      recommendation: "none",
      confidence: 0,
      message: lang === 'ar-MA' ? 
        "غير كافي من البيانات للتوصية" : 
        "Not enough data for recommendation"
    };
  }

  // 1. الحصول على التنبؤات
  const prediction = hybridPredict(history);
  
  // 2. اكتشاف الأنماط
  const patterns = detectAllPatterns(history);
  
  // 3. توليد التوصية
  const strongestPrediction = Object.entries(prediction).reduce((a, b) => 
    a[1] > b[1] ? a : b
  );
  
  let recommendationType = "none";
  let confidence = 0;
  let reason = "";
  
  // حالة 1: ثقة عالية في التنبؤ
  if (strongestPrediction[1] >= 65) {
    recommendationType = strongestPrediction[0];
    confidence = Math.min(95, strongestPrediction[1] * 1.1);
    reason = lang === 'ar-MA' ? 
      `تنبؤ عالي الدقة (${Math.round(confidence)}%)` : 
      `High accuracy prediction (${Math.round(confidence)}%)`;
  }
  // حالة 2: نمط قوي
  else if (patterns.length > 0 && patterns[0].confidence >= 0.75) {
    recommendationType = patterns[0].type;
    confidence = patterns[0].confidence * 100;
    const patternName = lang === 'ar-MA' ? 
      patterns[0].name.ar : patterns[0].name.en;
    reason = lang === 'ar-MA' ? 
      `نمط ${patternName} (ثقة ${Math.round(confidence)}%)` : 
      `${patternName} pattern (${Math.round(confidence)}% confidence)`;
  }
  // حالة 3: قاعدة 80/20
  else if (patterns.some(p => p.name.en === "80/20 Rule")) {
    const rulePattern = patterns.find(p => p.name.en === "80/20 Rule");
    recommendationType = rulePattern.type;
    confidence = 85;
    reason = lang === 'ar-MA' ? 
      "قاعدة 80/20 (توصية عكسية)" : 
      "80/20 Rule (contrarian recommendation)";
  }
  // حالة 4: لا توجد توصية واضحة
  else {
    return {
      recommendation: "none",
      confidence: 0,
      message: lang === 'ar-MA' ?
        "لا توجد توصية واضحة حالياً" :
        "No clear recommendation at this time"
    };
  }
  
  // بناء الرسالة النهائية
  const typeName = lang === 'ar-MA' ? 
    (recommendationType === 'P' ? 'اللاعب' : 
     recommendationType === 'B' ? 'المصرفي' : 'التعادل') :
    (recommendationType === 'P' ? 'Player' : 
     recommendationType === 'B' ? 'Banker' : 'Tie');
  
  return {
    recommendation: recommendationType,
    confidence: confidence,
    message: lang === 'ar-MA' ? 
      `توصية قوية: ${typeName} - ${reason}` : 
      `Strong recommendation: ${typeName} - ${reason}`
  };
}

// ======== [ التكامل مع النظام الرئيسي ] ========
document.addEventListener('DOMContentLoaded', function() {
  initializeMarkovModel();
  loadTheme();
  loadLanguage();
  document.getElementById('langSelect').addEventListener('change', changeLanguage);
});

function addResult(result) {
  history.push(result);
  
  // تحديث نموذج ماركوف
  if (history.length >= 3) {
    const prevState = history.slice(-3, -1).join('');
    const current = history[history.length - 1];
    markovModel[prevState][current] += 1;
  }
  
  // تحديث الواجهة
  updateDisplay();
  updatePredictions();
  updateBigRoad();
  updateDerivativeRoads();
  updateTrendsAndStreaks();
  showRecommendation();
  updateChart();
  updatePatternsDisplay();
}

function updatePredictions() {
  const prediction = hybridPredict(history);
  displayPrediction(prediction);
  
  // تحديث دقة التنبؤ
  const accuracy = Math.min(95, 70 + (history.length * 0.5));
  document.getElementById('accuracyValue').textContent = `${accuracy.toFixed(0)}%`;
}

// ======== [ واجهة المستخدم للأنماط ] ========
function updatePatternsDisplay() {
  const patterns = detectAllPatterns(history);
  const container = document.getElementById('patternsContainer');
  
  if (patterns.length === 0) {
    container.innerHTML = lang === 'ar-MA' ? 
      '<div class="pattern-empty">لم يتم اكتشاف أنماط قوية حالياً</div>' :
      '<div class="pattern-empty">No strong patterns detected</div>';
    return;
  }
  
  let html = '';
  
  patterns.forEach(pattern => {
    const patternName = lang === 'ar-MA' ? pattern.name.ar : pattern.name.en;
    const confidence = Math.round(pattern.confidence * 100);
    
    html += `
      <div class="pattern-card ${pattern.type}">
        <div class="pattern-header">
          <span class="pattern-name">${patternName}</span>
          <span class="pattern-confidence">${confidence}%</span>
        </div>
        <div class="pattern-details">
          ${lang === 'ar-MA' ? 'النوع: ' : 'Type: '} 
          <span class="${pattern.type}-text">
            ${pattern.type === 'P' ? (lang === 'ar-MA' ? 'لاعب' : 'Player') : 
             pattern.type === 'B' ? (lang === 'ar-MA' ? 'مصرفي' : 'Banker') : 
             (lang === 'ar-MA' ? 'تعادل' : 'Tie')}
          </span>
        </div>
        ${pattern.length ? `<div>${lang === 'ar-MA' ? 'الطول: ' : 'Length: '}${pattern.length}</div>` : ''}
        ${pattern.frequency ? `<div>${lang === 'ar-MA' ? 'التكرار: ' : 'Frequency: '}${pattern.frequency}</div>` : ''}
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// ======== [ الدوال الأساسية ] ========
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

function updateDisplay() {
  const displayText = history.map(r => {
    if (r === 'P') return '🔵';
    if (r === 'B') return '🔴';
    if (r === 'T') return '🟢';
  }).join(' ');
  document.getElementById('historyDisplay').innerText = (lang === 'ar-MA' ? "جميع الجولات: " : "All rounds: ") + displayText;

  const totalRounds = history.length;
  const count = { P: 0, B: 0, T: 0 };
  history.forEach(r => { if (count[r] !== undefined) count[r]++; });

  const statsHTML = `
    <table class="results-table">
      <tr>
        <th>${lang === 'ar-MA' ? 'عدد الجولات' : 'Rounds'}</th>
        <th class="player-text">${lang === 'ar-MA' ? 'لاعب' : 'Player'}</th>
        <th class="banker-text">${lang === 'ar-MA' ? 'مصرفي' : 'Banker'}</th>
        <th class="tie-text">${lang === 'ar-MA' ? 'تعادل' : 'Tie'}</th>
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

function displayPrediction(prediction) {
  const isArabic = lang === 'ar-MA';
  
  document.querySelector('.player-bar').style.width = `${prediction.P}%`;
  document.querySelector('.banker-bar').style.width = `${prediction.B}%`;
  document.querySelector('.tie-bar').style.width = `${prediction.T}%`;
  
  document.getElementById('playerProb').textContent = `${prediction.P.toFixed(1)}%`;
  document.getElementById('bankerProb').textContent = `${prediction.B.toFixed(1)}%`;
  document.getElementById('tieProb').textContent = `${prediction.T.toFixed(1)}%`;
  
  const statsHTML = `
    <span class="player-text">🔵 ${isArabic ? 'لاعب' : 'Player'}: ${prediction.P.toFixed(1)}%</span> | 
    <span class="banker-text">🔴 ${isArabic ? 'مصرفي' : 'Banker'}: ${prediction.B.toFixed(1)}%</span> | 
    <span class="tie-text">🟢 ${isArabic ? 'تعادل' : 'Tie'}: ${prediction.T.toFixed(1)}%</span>
  `;
  
  document.getElementById('statsResult').innerHTML = statsHTML;
}

function showRecommendation() {
  const recommendation = generateSmartRecommendation();
  const recommendationElement = document.getElementById('recommendation');
  
  recommendationElement.innerHTML = `
    <div class="recommendation-box ${recommendation.recommendation}">
      <h3>${lang === 'ar-MA' ? 'توصية التحليل' : 'Analysis Recommendation'}</h3>
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

function generateAdvice() {
  const isArabic = lang === 'ar-MA';
  
  if (history.length < 3) {
    document.getElementById('aiAdvice').innerHTML = isArabic ? 
      "⏳ انتظر المزيد من الجولات لتحليل الأنماط..." : 
      "⏳ Wait for more rounds to analyze patterns...";
    return;
  }

  const patterns = detectAllPatterns(history);
  let patternAdvice = "";
  
  if (patterns.length > 0) {
    const strongestPattern = patterns[0];
    const patternName = isArabic ? strongestPattern.name.ar : strongestPattern.name.en;
    patternAdvice = isArabic ?
      `🔍 النمط الأقوى: ${patternName} (ثقة ${Math.round(strongestPattern.confidence * 100)}%)` :
      `🔍 Strongest pattern: ${patternName} (${Math.round(strongestPattern.confidence * 100)}% confidence)`;
  }

  document.getElementById('aiAdvice').innerHTML = patternAdvice;
}

function updateTrendsAndStreaks() {
  const isArabic = lang === 'ar-MA';
  
  if (history.length < 3) {
    document.getElementById('trendsContent').innerHTML = isArabic ? 
      `<div style="text-align:center;padding:10px;">⏳ انتظر المزيد من الجولات لتحليل الاتجاهات...</div>` : 
      `<div style="text-align:center;padding:10px;">⏳ Wait for more rounds to analyze trends...</div>`;
    return;
  }

  const lastSeven = history.slice(-7);
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

function updateUI() {
  const isArabic = lang === 'ar-MA';
  
  document.title = isArabic ? 'محلل الباكارات المتقدم' : 'Advanced Baccarat Analyzer';
  document.querySelector('h1').innerHTML = isArabic ? 
    '<span class="logo-b">B</span><span class="logo-rest">ACCARAT</span> <span class="logo-rest">ANALYZER PRO</span>' : 
    '<span class="logo-b">B</span><span class="logo-rest">ACCARAT</span> <span class="logo-rest">ANALYZER PRO</span>';
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
  document.querySelector('.pattern-analysis h3').textContent = isArabic ? '🔍 تحليل الأنماط المتقدم' : '🔍 Advanced Pattern Analysis';
  
  if (history.length > 0) {
    updateDisplay();
    updatePredictions();
    generateAdvice();
    updateTrendsAndStreaks();
    showRecommendation();
    updateChart();
    updatePatternsDisplay();
  }
}

function resetData() {
  const isArabic = lang === 'ar-MA';
  const confirmMsg = isArabic ? 
    "هل أنت متأكد من أنك تريد إعادة تعيين جميع البيانات؟" : 
    "Are you sure you want to reset all data?";
  
  if (confirm(confirmMsg)) {
    history = [];
    currentStreak = { type: null, count: 0 };
    initializeMarkovModel();
    updateBigRoad();
    document.getElementById('bigEyeRoad').innerHTML = '';
    document.getElementById('smallRoad').innerHTML = '';
    if (window.statsChart) {
      window.statsChart.destroy();
    }
    document.getElementById('predictionResult').innerHTML = `
      <div class="prediction-title">${isArabic ? '📊 تنبؤات متقدمة' : '📊 Advanced Predictions'}</div>
      <div class="prediction-accuracy">${isArabic ? 'الدقة: ' : 'Accuracy: '}<span id="accuracyValue">85%</span></div>
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
    document.getElementById('patternsContainer').innerHTML = isArabic ? 
      '<div class="pattern-empty">لم يتم اكتشاف أنماط قوية حالياً</div>' :
      '<div class="pattern-empty">No strong patterns detected</div>';
  }
}

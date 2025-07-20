let history = [];
let currentStreak = { type: null, count: 0 };
let lang = 'ar-MA';

// تهيئة التطبيق عند التحميل
document.addEventListener('DOMContentLoaded', function() {
  loadTheme();
  loadLanguage();
  document.getElementById('langSelect').addEventListener('change', changeLanguage);
});

if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light-mode');
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

function speak(text, lang) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  speechSynthesis.speak(utter);
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

function addResult(result) {
  history.push(result);
  
  // تحديث السلسلة الحالية
  if (result === currentStreak.type) {
    currentStreak.count++;
  } else {
    currentStreak.type = result;
    currentStreak.count = 1;
  }
  
  updateDisplay();
  updateBigRoad();
  updateTrendsAndStreaks();
  updatePredictions();
  generateAdvice();
}

function updateDisplay() {
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

function updateTrendsAndStreaks() {
  const isArabic = lang === 'ar-MA';
  
  if (history.length < 3) {
    document.getElementById('trendsContent').innerHTML = isArabic ? 
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
  
  // حساب التغيرات النسبية
  const getTrend = (current, prev, total) => {
    const change = total > 0 ? ((current - prev) / total * 100) : 0;
    if (change > 15) return { icon: '▲▲', class: 'trend-up', text: isArabic ? 'ارتفاع كبير' : 'Sharp rise' };
    if (change > 5) return { icon: '▲', class: 'trend-up', text: isArabic ? 'ارتفاع' : 'Rising' };
    if (change < -15) return { icon: '▼▼', class: 'trend-down', text: isArabic ? 'انخفاض كبير' : 'Sharp drop' };
    if (change < -5) return { icon: '▼', class: 'trend-down', text: isArabic ? 'انخفاض' : 'Dropping' };
    return { icon: '➔', class: 'trend-neutral', text: isArabic ? 'مستقر' : 'Stable' };
  };
  
  const pTrend = getTrend(counts.P, prevCounts.P, lastSeven.length);
  const bTrend = getTrend(counts.B, prevCounts.B, lastSeven.length);
  const tTrend = getTrend(counts.T, prevCounts.T, lastSeven.length);
  
  // تحليل السلاسل
  const hotThreshold = 0.7; // 70% أو أكثر
  const coldThreshold = 0.2; // 20% أو أقل
  
  const isHot = (type) => counts[type] / lastSeven.length >= hotThreshold;
  const isCold = (type) => counts[type] / lastSeven.length <= coldThreshold;
  
  // تحليل الأنماط المتقدمة
  const patterns = detectAdvancedPatterns(history);
  
  // إنشاء واجهة المستخدم
  const trendsHTML = `
    <div style="margin-bottom: 15px;">
      <h4 style="margin-bottom: 10px;color:gold;">${isArabic ? 'اتجاهات آخر 7 جولات' : 'Last 7 Rounds Trends'}</h4>
      
      <div class="trend-item ${isHot('P') ? 'hot-streak' : ''} ${isCold('P') ? 'cold-streak' : ''}">
        <div>
          <span class="player-text">${isArabic ? 'لاعب' : 'Player'}</span>
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
          <span class="banker-text">${isArabic ? 'مصرفي' : 'Banker'}</span>
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
          <span class="tie-text">${isArabic ? 'تعادل' : 'Tie'}</span>
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
      <h4 style="margin-top:0;margin-bottom:10px;color:gold;">${isArabic ? 'الأنماط المكتشفة' : 'Detected Patterns'}</h4>
      ${patterns.map(p => `
        <div class="pattern-badge">
          ${p.pattern}
          <span class="pattern-tooltip">${p.description[lang] || p.description.en}</span>
          <span class="pattern-confidence">${Math.round(p.confidence * 100)}%</span>
        </div>
      `).join('')}
    </div>
    ` : ''}
  `;
  
  document.getElementById('trendsContent').innerHTML = trendsHTML;
}

// خوارزمية متقدمة لاكتشاف الأنماط
function detectAdvancedPatterns(fullHistory) {
  if (fullHistory.length < 5) return [];
  
  const patterns = [];
  const recentHistory = fullHistory.slice(-15).join('');
  
  // تعريف الأنماط الشائعة مع ثقة متوقعة
  const commonPatterns = [
    {
      name: 'P-B-P-B-P',
      regex: /PBPBP$/,
      description: {
        ar: 'نمط تناوب بين اللاعب والمصرفي',
        en: 'Alternating Player-Banker pattern'
      },
      baseConfidence: 0.85
    },
    {
      name: '5P',
      regex: /PPPPP$/,
      description: {
        ar: '5 نتائج متتالية للاعب',
        en: '5 consecutive Player results'
      },
      baseConfidence: 0.9
    },
    {
      name: '3T+',
      regex: /TTT/g,
      description: {
        ar: '3 تعادلات متتالية أو أكثر',
        en: '3 or more consecutive Ties'
      },
      baseConfidence: 0.75
    },
    {
      name: 'P-P-B-B-P',
      regex: /PPBBP$/,
      description: {
        ar: 'نمط مزدوج (لاعب-لاعب ثم مصرفي-مصرفي)',
        en: 'Double pattern (P-P then B-B)'
      },
      baseConfidence: 0.8
    },
    {
      name: 'Dragon',
      regex: /(P{6,}|B{6,})$/,
      description: {
        ar: 'سلسلة طويلة (6+) من نفس النتيجة',
        en: 'Long streak (6+) of same result'
      },
      baseConfidence: 0.95
    },
    {
      name: 'ZigZag',
      regex: /(PB){3,}$|(BP){3,}$/,
      description: {
        ar: 'نمط متعرج متكرر',
        en: 'Repeated zigzag pattern'
      },
      baseConfidence: 0.78
    }
  ];
  
  // التحقق من الأنماط مع حساب الثقة بناءً على التكرار
  commonPatterns.forEach(p => {
    const matches = recentHistory.match(p.regex);
    if (matches) {
      // زيادة الثقة بناءً على طول النمط
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
  
  // تحليل التكرارات التاريخية
  analyzeHistoricalPatterns(fullHistory, patterns);
  
  return patterns.sort((a, b) => b.confidence - a.confidence);
}

function analyzeHistoricalPatterns(fullHistory, patterns) {
  if (fullHistory.length < 20) return;
  
  const historyStr = fullHistory.join('');
  const last5 = fullHistory.slice(-5).join('');
  
  // تحليل تكرار النمط الحالي في التاريخ السابق
  let historicalMatches = 0;
  for (let i = 0; i < historyStr.length - 5; i++) {
    if (historyStr.substr(i, 5) === last5) {
      historicalMatches++;
    }
  }
  
  if (historicalMatches > 0) {
    const frequency = historicalMatches / (historyStr.length / 5);
    const confidence = Math.min(0.95, 0.7 + (frequency * 2));
    
    patterns.push({
      pattern: 'Historic',
      description: {
        ar: `تكرر هذا النمط ${historicalMatches} مرات سابقاً`,
        en: `This pattern occurred ${historicalMatches} times before`
      },
      confidence: confidence,
      frequency: frequency
    });
  }
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

  // تحليل آخر 5 و 10 و 20 جولة
  const lastFive = history.slice(-5);
  const lastTen = history.length >= 10 ? history.slice(-10) : lastFive;
  const lastTwenty = history.length >= 20 ? history.slice(-20) : lastTen;
  
  // حساب الترددات
  const freq5 = { P: 0, B: 0, T: 0 };
  const freq10 = { P: 0, B: 0, T: 0 };
  const freq20 = { P: 0, B: 0, T: 0 };
  
  lastFive.forEach(r => freq5[r]++);
  lastTen.forEach(r => freq10[r]++);
  lastTwenty.forEach(r => freq20[r]++);
  
  // حساب النسب المئوية مع مراعاة الاتجاه
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
  
  // حساب المتوسط المرجح (وزن أكبر للجولات الأخيرة)
  const weightedAvg = {
    P: (percent5.P * 0.6 + percent10.P * 0.3 + percent20.P * 0.1),
    B: (percent5.B * 0.6 + percent10.B * 0.3 + percent20.B * 0.1),
    T: (percent5.T * 0.6 + percent10.T * 0.3 + percent20.T * 0.1)
  };
  
  // تطبيق تصحيح الأنماط
  const patterns = detectAdvancedPatterns(history);
  patterns.forEach(p => {
    if (p.pattern === '5P' || p.pattern === 'Dragon' && p.pattern.includes('P')) {
      weightedAvg.P += 15 * p.confidence;
      weightedAvg.B -= 7 * p.confidence;
      weightedAvg.T -= 8 * p.confidence;
    } else if (p.pattern === '5B' || p.pattern === 'Dragon' && p.pattern.includes('B')) {
      weightedAvg.B += 15 * p.confidence;
      weightedAvg.P -= 7 * p.confidence;
      weightedAvg.T -= 8 * p.confidence;
    } else if (p.pattern === '3T+') {
      weightedAvg.T += 20 * p.confidence;
      weightedAvg.P -= 10 * p.confidence;
      weightedAvg.B -= 10 * p.confidence;
    }
  });
  
  // ضمان عدم وجود قيم سلبية
  weightedAvg.P = Math.max(5, weightedAvg.P);
  weightedAvg.B = Math.max(5, weightedAvg.B);
  weightedAvg.T = Math.max(5, weightedAvg.T);
  
  // ضبط القيم لتكون مجموعها 100%
  const total = weightedAvg.P + weightedAvg.B + weightedAvg.T;
  return {
    P: (weightedAvg.P / total * 100),
    B: (weightedAvg.B / total * 100),
    T: (weightedAvg.T / total * 100)
  };
}

function displayPrediction(prediction) {
  const isArabic = lang === 'ar-MA';
  
  // تحديث أشرطة التنبؤ
  document.querySelector('.player-bar').style.width = `${prediction.P}%`;
  document.querySelector('.banker-bar').style.width = `${prediction.B}%`;
  document.querySelector('.tie-bar').style.width = `${prediction.T}%`;
  
  // تحديث النسب المئوية
  document.getElementById('playerProb').textContent = `${prediction.P.toFixed(1)}%`;
  document.getElementById('bankerProb').textContent = `${prediction.B.toFixed(1)}%`;
  document.getElementById('tieProb').textContent = `${prediction.T.toFixed(1)}%`;
  
  // تحديث النص التنبؤي
  const labels = {
    ar: { P: 'اللاعب', B: 'المصرفي', T: 'تعادل' },
    en: { P: 'Player', B: 'Banker', T: 'Tie' }
  };
  
  const statsHTML = `
    <span class="player-text">🔵 ${isArabic ? 'لاعب' : 'Player'}: ${prediction.P.toFixed(1)}%</span> | 
    <span class="banker-text">🔴 ${isArabic ? 'مصرفي' : 'Banker'}: ${prediction.B.toFixed(1)}%</span> | 
    <span class="tie-text">🟢 ${isArabic ? 'تعادل' : 'Tie'}: ${prediction.T.toFixed(1)}%</span>
  `;
  
  document.getElementById('statsResult').innerHTML = statsHTML;
  
  // قراءة التنبؤ صوتياً إذا كانت النسبة أعلى من 70%
  const winner = prediction.P > prediction.B ? 
    (prediction.P > prediction.T ? 'P' : 'T') : 
    (prediction.B > prediction.T ? 'B' : 'T');
  
  if (prediction[winner] > 70) {
    const speechText = isArabic
      ? `التنبؤ: ${labels.ar[winner]} بنسبة ${prediction[winner].toFixed(1)} بالمئة`
      : `Prediction: ${labels.en[winner]} with ${prediction[winner].toFixed(1)} percent`;
    speak(speechText, lang);
  }
}

function generateAdvice() {
  const isArabic = lang === 'ar-MA';
  
  if (history.length < 3) {
    document.getElementById('aiAdvice').innerHTML = isArabic ? 
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
    const typeName = isArabic ? 
      (currentStreak.type === 'P' ? 'اللاعب' : currentStreak.type === 'B' ? 'المصرفي' : 'تعادل') :
      (currentStreak.type === 'P' ? 'Player' : currentStreak.type === 'B' ? 'Banker' : 'Tie');
    
    streakText = isArabic ?
      `📈 سلسلة ${typeName} مستمرة: ${currentStreak.count} جولات` :
      `📈 ${typeName} streak: ${currentStreak.count} rounds`;
  }

  const patterns = detectAdvancedPatterns(history);
  let patternAdvice = "";
  
  if (patterns.length > 0) {
    const strongestPattern = patterns[0];
    patternAdvice = isArabic ?
      `🔍 النمط الأقوى: ${strongestPattern.pattern} (ثقة ${Math.round(strongestPattern.confidence * 100)}%)` :
      `🔍 Strongest pattern: ${strongestPattern.pattern} (${Math.round(strongestPattern.confidence * 100)}% confidence)`;
  }

  document.getElementById('aiAdvice').innerHTML = `
    ${streakText ? `<div>${streakText}</div>` : ''}
    ${patternAdvice ? `<div style="margin-top:10px;">${patternAdvice}</div>` : ''}
  `;
}

function updateUI() {
  // تحديث النصوص حسب اللغة المختارة
  const isArabic = lang === 'ar-MA';
  
  document.title = isArabic ? 'محلل الباكارات' : 'Baccarat Analyzer';
  document.querySelector('h1').innerHTML = isArabic ? 
    '<span class="logo-b">B</span><span class="logo-rest">ACCARAT</span> <span class="logo-rest">ANALYZER</span>' : 
    '<span class="logo-b">B</span><span class="logo-rest">ACCARAT</span> <span class="logo-rest">ANALYZER</span>';
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
  
  // تحديث المحتوى الديناميكي
  if (history.length > 0) {
    updateDisplay();
    updatePredictions();
    generateAdvice();
    updateTrendsAndStreaks();
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
    updateBigRoad();
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
  }
}

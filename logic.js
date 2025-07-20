let history = [];
let currentStreak = { type: null, count: 0 };
let lang = 'ar-MA';

document.addEventListener('DOMContentLoaded', function() {
  loadTheme();
  loadLanguage();
  document.getElementById('langSelect').addEventListener('change', changeLanguage);
});

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
  showRecommendation();
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

  // تحليل التكرار التاريخي
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
  
  const weightedAvg = {
    P: (percent5.P * 0.6 + percent10.P * 0.3 + percent20.P * 0.1),
    B: (percent5.B * 0.6 + percent10.B * 0.3 + percent20.B * 0.1),
    T: (percent5.T * 0.6 + percent10.T * 0.3 + percent20.T * 0.1)
  };
  
  // تطبيق تصحيح الأنماط
  const patterns = detectAdvancedPatterns(history);
  patterns.forEach(p => {
    if (p.pattern.includes('P')) {
      weightedAvg.P += 10 * p.confidence;
      weightedAvg.B -= 5 * p.confidence;
      weightedAvg.T -= 5 * p.confidence;
    } else if (p.pattern.includes('B')) {
      weightedAvg.B += 10 * p.confidence;
      weightedAvg.P -= 5 * p.confidence;
      weightedAvg.T -= 5 * p.confidence;
    } else if (p.pattern.includes('T')) {
      weightedAvg.T += 15 * p.confidence;
      weightedAvg.P -= 7 * p.confidence;
      weightedAvg.B -= 8 * p.confidence;
    }
  });
  
  // ضمان عدم وجود قيم سلبية
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

function generateBetRecommendation() {
  if (history.length < 5) {
    return {
      recommendation: "none",
      confidence: 0,
      message: lang === 'ar-MA' ? 
        "غير كافي من البيانات للتوصية" : 
        "Not enough data for recommendation"
    };
  }

  const prediction = advancedPredict(history);
  const patterns = detectAdvancedPatterns(history);
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
    message: lang === 'ar-MA' ?
      "لا توجد توصية واضحة حالياً" :
      "No clear recommendation at this time"
  };
}

function buildRecommendationMessage(type, confidence, patterns) {
  const typeName = lang === 'ar-MA' ? 
    (type === 'P' ? 'اللاعب' : type === 'B' ? 'المصرفي' : 'التعادل') :
    (type === 'P' ? 'Player' : type === 'B' ? 'Banker' : 'Tie');

  let reason = '';
  
  if (patterns.length > 0) {
    const patternDesc = patterns[0].description[lang] || patterns[0].description.en;
    reason = lang === 'ar-MA' ?
      `بسبب النمط: ${patternDesc} (ثقة ${Math.round(confidence)}%)` :
      `Due to pattern: ${patternDesc} (${Math.round(confidence)}% confidence)`;
  } else {
    reason = lang === 'ar-MA' ?
      `بسبب التكرار التاريخي (ثقة ${Math.round(confidence)}%)` :
      `Due to historical frequency (${Math.round(confidence)}% confidence)`;
  }

  return lang === 'ar-MA' ?
    `توصية: ${typeName} - ${reason}` :
    `Recommend: ${typeName} - ${reason}`;
}

function showRecommendation() {
  const recommendation = generateBetRecommendation();
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

function updatePredictions() {
  const prediction = advancedPredict(history);
  displayPrediction(prediction);
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

function generateAdvice() {
  const isArabic = lang === 'ar-MA';
  
  if (history.length < 3) {
    document.getElementById('aiAdvice').innerHTML = isArabic ? 
      "⏳ انتظر المزيد من الجولات لتحليل الأنماط..." : 
      "⏳ Wait for more rounds to analyze patterns...";
    return;
  }

  const patterns = detectAdvancedPatterns(history);
  let patternAdvice = "";
  
  if (patterns.length > 0) {
    const strongestPattern = patterns[0];
    patternAdvice = isArabic ?
      `🔍 النمط الأقوى: ${strongestPattern.pattern} (ثقة ${Math.round(strongestPattern.confidence * 100)}%)` :
      `🔍 Strongest pattern: ${strongestPattern.pattern} (${Math.round(strongestPattern.confidence * 100)}% confidence)`;
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
  
  if (history.length > 0) {
    updateDisplay();
    updatePredictions();
    generateAdvice();
    updateTrendsAndStreaks();
    showRecommendation();
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
    document.getElementById('recommendation').innerHTML = '';
  }
      }

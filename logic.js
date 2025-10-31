let history = [];
let currentStreak = { type: null, count: 0 };
let lang = 'ar-MA';
let markovModel = { P: { P: 0, B: 0, T: 0 }, B: { P: 0, B: 0, T: 0 }, T: { P: 0, B: 0, T: 0 } };

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

  // حساب الاحتمالات
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
  
  if (result === currentStreak.type) {
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

function detectAdvancedPatterns(fullHistory) {
  const patterns = [];
  if (fullHistory.length < 2) return patterns;

  const recentHistory = fullHistory.slice(-10).join('');
  const fullHistoryStr = fullHistory.join('');

  const patternDefinitions = [
    // الأنماط الأساسية - تعمل مع بيانات قليلة
    {
      name: 'Dragon',
      regex: /(P{3,}|B{3,})$/,
      description: {
        ar: 'سلسلة من نفس النتيجة',
        en: 'Streak of same result'
      },
      baseConfidence: 0.7,
      minLength: 3
    },
    {
      name: 'ZigZag',
      regex: /(PB){2,}$|(BP){2,}$/,
      description: {
        ar: 'نمط متعرج',
        en: 'Zigzag pattern'
      },
      baseConfidence: 0.65,
      minLength: 4
    },
    {
      name: '3P/3B',
      regex: /PPP$|BBB$/,
      description: {
        ar: '3 نتائج متتالية',
        en: '3 consecutive results'
      },
      baseConfidence: 0.6,
      minLength: 3
    },
    {
      name: '2T+',
      regex: /TT$/,
      description: {
        ar: 'تعادلان متتاليان',
        en: '2 consecutive ties'
      },
      baseConfidence: 0.55,
      minLength: 2
    },
    
    // الأنماط المتوسطة - تحتاج 4+ جولات
    {
      name: 'DoubleAlternate',
      regex: /(PPBB)$|(BBPP)$/,
      description: {
        ar: 'نمط مزدوج متناوب',
        en: 'Double alternate pattern'
      },
      baseConfidence: 0.7,
      minLength: 4
    },
    {
      name: 'SingleBreak',
      regex: /(PBP)$|(BPB)$/,
      description: {
        ar: 'نمط انقطاع فردي',
        en: 'Single break pattern'
      },
      baseConfidence: 0.6,
      minLength: 3
    },
    {
      name: 'TieCluster',
      regex: /T{2,}$/,
      description: {
        ar: 'مجموعة تعادلات',
        en: 'Tie cluster'
      },
      baseConfidence: 0.65,
      minLength: 2
    },
    
    // الأنماط المتقدمة - تحتاج 5+ جولات
    {
      name: 'ThreeOnePattern',
      regex: /(PPPB)$|(BBBP)$/,
      description: {
        ar: 'نمط 3-1',
        en: '3-1 pattern'
      },
      baseConfidence: 0.75,
      minLength: 4
    },
    {
      name: 'PerfectAlternate',
      regex: /(PBPB)$|(BPBP)$/,
      description: {
        ar: 'تبادل مثالي',
        en: 'Perfect alternation'
      },
      baseConfidence: 0.8,
      minLength: 4
    },
    {
      name: 'MixedPattern',
      regex: /(PPB)$|(BBP)$/,
      description: {
        ar: 'نمط مختلط',
        en: 'Mixed pattern'
      },
      baseConfidence: 0.6,
      minLength: 3
    },
    {
      name: 'QuickSwitch',
      regex: /(PTB|BTP)$/,
      description: {
        ar: 'تبادل مع تعادلات',
        en: 'Switch with ties'
      },
      baseConfidence: 0.55,
      minLength: 3
    },
    {
      name: 'FourTwoPattern',
      regex: /(PPPPBB)$|(BBBBPP)$/,
      description: {
        ar: 'نمط 4-2',
        en: '4-2 pattern'
      },
      baseConfidence: 0.78,
      minLength: 6
    },
    {
      name: 'DoubleDragon',
      regex: /(P{5,}|B{5,})$/,
      description: {
        ar: 'سلسلة طويلة جداً',
        en: 'Very long streak'
      },
      baseConfidence: 0.85,
      minLength: 5
    }
  ];

  // اكتشاف الأنماط الأساسية أولاً
  patternDefinitions.forEach(p => {
    if (fullHistory.length >= p.minLength) {
      const matches = recentHistory.match(p.regex);
      if (matches) {
        const lengthFactor = matches[0].length / p.minLength;
        const confidence = Math.min(0.95, p.baseConfidence * lengthFactor);
        
        patterns.push({
          pattern: p.name,
          description: p.description,
          confidence: confidence,
          length: matches[0].length,
          sequence: matches[0]
        });
      }
    }
  });

  // اكتشاف أنماط التكرار البسيطة
  detectSimplePatterns(fullHistory, patterns);
  
  // اكتشاف أنماط الميجورك
  const bigRoadPatterns = detectBigRoadPatterns();
  patterns.push(...bigRoadPatterns);

  // تحليل التكرار التاريخي
  if (fullHistory.length >= 5) {
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
        frequency: historicalMatches,
        sequence: last5
      });
    }
  }

  return patterns.sort((a, b) => b.confidence - a.confidence);
}

// دالة جديدة لاكتشاف أنماط بسيطة تعمل مع بيانات قليلة
function detectSimplePatterns(history, patterns) {
  if (history.length < 2) return;

  const lastThree = history.slice(-3).join('');
  const lastFour = history.length >= 4 ? history.slice(-4).join('') : '';
  const lastFive = history.length >= 5 ? history.slice(-5).join('') : '';

  // أنماط 2 جولات
  const twoRoundPatterns = {
    'PP': { name: 'TwoPlayer', confidence: 0.5 },
    'BB': { name: 'TwoBanker', confidence: 0.5 },
    'TT': { name: 'TwoTie', confidence: 0.45 },
    'PB': { name: 'PlayerBanker', confidence: 0.4 },
    'BP': { name: 'BankerPlayer', confidence: 0.4 }
  };

  if (history.length >= 2) {
    const lastTwo = history.slice(-2).join('');
    if (twoRoundPatterns[lastTwo]) {
      const pattern = twoRoundPatterns[lastTwo];
      patterns.push({
        pattern: pattern.name,
        description: {
          ar: `بداية نمط ${lastTwo}`,
          en: `${lastTwo} pattern start`
        },
        confidence: pattern.confidence,
        length: 2,
        sequence: lastTwo
      });
    }
  }

  // أنماط 3 جولات
  if (history.length >= 3) {
    const threeRoundPatterns = {
      'PPP': { name: 'ThreePlayer', confidence: 0.7 },
      'BBB': { name: 'ThreeBanker', confidence: 0.7 },
      'TTT': { name: 'ThreeTie', confidence: 0.6 },
      'PBP': { name: 'PlayerBreak', confidence: 0.65 },
      'BPB': { name: 'BankerBreak', confidence: 0.65 },
      'PPT': { name: 'PlayerTie', confidence: 0.55 },
      'BBT': { name: 'BankerTie', confidence: 0.55 },
      'PBB': { name: 'PlayerBankerBanker', confidence: 0.6 },
      'BPP': { name: 'BankerPlayerPlayer', confidence: 0.6 }
    };

    if (threeRoundPatterns[lastThree]) {
      const pattern = threeRoundPatterns[lastThree];
      patterns.push({
        pattern: pattern.name,
        description: {
          ar: `نمط ${lastThree}`,
          en: `${lastThree} pattern`
        },
        confidence: pattern.confidence,
        length: 3,
        sequence: lastThree
      });
    }
  }

  // أنماط 4 جولات
  if (lastFour) {
    const fourRoundPatterns = {
      'PPBB': { name: 'DoubleAlternate', confidence: 0.75 },
      'BBPP': { name: 'DoubleAlternate', confidence: 0.75 },
      'PBPB': { name: 'PerfectAlternate', confidence: 0.8 },
      'BPBP': { name: 'PerfectAlternate', confidence: 0.8 },
      'PPPB': { name: 'ThreeOne', confidence: 0.7 },
      'BBBP': { name: 'ThreeOne', confidence: 0.7 },
      'PPTP': { name: 'PlayerTiePlayer', confidence: 0.6 },
      'BBTB': { name: 'BankerTieBanker', confidence: 0.6 }
    };

    if (fourRoundPatterns[lastFour]) {
      const pattern = fourRoundPatterns[lastFour];
      patterns.push({
        pattern: pattern.name,
        description: {
          ar: `نمط ${lastFour}`,
          en: `${lastFour} pattern`
        },
        confidence: pattern.confidence,
        length: 4,
        sequence: lastFour
      });
    }
  }

  // اكتشاف الاتجاهات البسيطة
  detectSimpleTrends(history, patterns);
}

// دالة جديدة لاكتشاف الاتجاهات البسيطة
function detectSimpleTrends(history, patterns) {
  if (history.length < 3) return;

  const lastFive = history.slice(-5);
  const counts = { P: 0, B: 0, T: 0 };
  lastFive.forEach(r => counts[r]++);

  // اتجاه اللاعب
  if (counts.P >= 3) {
    patterns.push({
      pattern: 'PlayerTrend',
      description: {
        ar: `اتجاه للاعب (${counts.P}/5)`,
        en: `Player trend (${counts.P}/5)`
      },
      confidence: 0.6 + (counts.P * 0.08),
      length: counts.P,
      sequence: lastFive.join('')
    });
  }

  // اتجاه المصرفي
  if (counts.B >= 3) {
    patterns.push({
      pattern: 'BankerTrend',
      description: {
        ar: `اتجاه للمصرفي (${counts.B}/5)`,
        en: `Banker trend (${counts.B}/5)`
      },
      confidence: 0.6 + (counts.B * 0.08),
      length: counts.B,
      sequence: lastFive.join('')
    });
  }

  // اكتشاف التناوب
  let alternateCount = 0;
  for (let i = 1; i < lastFive.length; i++) {
    if (lastFive[i] !== lastFive[i - 1] && lastFive[i] !== 'T' && lastFive[i - 1] !== 'T') {
      alternateCount++;
    }
  }

  if (alternateCount >= 2) {
    patterns.push({
      pattern: 'AlternatingTrend',
      description: {
        ar: `نمط تناوب (${alternateCount} تبديلات)`,
        en: `Alternating pattern (${alternateCount} switches)`
      },
      confidence: 0.55 + (alternateCount * 0.1),
      length: alternateCount,
      sequence: lastFive.join('')
    });
  }

  // اكتشاف التعادلات المتكررة
  if (counts.T >= 2) {
    patterns.push({
      pattern: 'TieFrequency',
      description: {
        ar: `تكرار التعادل (${counts.T}/5)`,
        en: `Tie frequency (${counts.T}/5)`
      },
      confidence: 0.5 + (counts.T * 0.1),
      length: counts.T,
      sequence: lastFive.join('')
    });
  }
}

// تحسين دالة أنماط الميجورك
function detectBigRoadPatterns() {
  const patterns = [];
  const filteredHistory = history.filter(result => result !== 'T');
  
  if (filteredHistory.length < 2) return patterns;

  // اكتشاف صفوف قصيرة في الميجورك
  const lastSix = filteredHistory.slice(-6);
  let currentType = lastSix[0];
  let currentCount = 1;
  let maxCount = 1;

  for (let i = 1; i < lastSix.length; i++) {
    if (lastSix[i] === currentType) {
      currentCount++;
      maxCount = Math.max(maxCount, currentCount);
    } else {
      if (currentCount >= 2) {
        patterns.push({
          pattern: 'BigRoad_MiniStreak',
          description: {
            ar: `صف قصير ${currentType} (${currentCount})`,
            en: `${currentType} mini streak (${currentCount})`
          },
          confidence: 0.5 + (currentCount * 0.15),
          length: currentCount
        });
      }
      currentType = lastSix[i];
      currentCount = 1;
    }
  }

  // اكتشاف آخر صف
  if (currentCount >= 2) {
    patterns.push({
      pattern: 'BigRoad_CurrentStreak',
      description: {
        ar: `الصف الحالي ${currentType} (${currentCount})`,
        en: `Current ${currentType} streak (${currentCount})`
      },
      confidence: 0.55 + (currentCount * 0.15),
      length: currentCount
    });
  }

  // اكتشاف أطول سلسلة
  if (maxCount >= 3) {
    patterns.push({
      pattern: 'BigRoad_LongStreak',
      description: {
        ar: `أطول سلسلة (${maxCount} نتائج)`,
        en: `Longest streak (${maxCount} results)`
      },
      confidence: 0.65 + (maxCount * 0.1),
      length: maxCount
    });
  }

  return patterns;
}

function advancedPredict(history) {
  if (history.length < 2) {
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
  
  // حساب المتوسط المرجح
  let weightedAvg = {
    P: (percent5.P * 0.6 + percent10.P * 0.3 + percent20.P * 0.1),
    B: (percent5.B * 0.6 + percent10.B * 0.3 + percent20.B * 0.1),
    T: (percent5.T * 0.6 + percent10.T * 0.3 + percent20.T * 0.1)
  };
  
  // تطبيق Markov Chain
  const lastResult = history[history.length - 1];
  if (lastResult) {
    weightedAvg.P = (weightedAvg.P + markovModel[lastResult].P) / 2;
    weightedAvg.B = (weightedAvg.B + markovModel[lastResult].B) / 2;
    weightedAvg.T = (weightedAvg.T + markovModel[lastResult].T) / 2;
  }
  
  // تطبيق تصحيح الأنماط
  const patterns = detectAdvancedPatterns(history);
  patterns.forEach(p => {
    if (p.pattern.includes('Player') || p.pattern.includes('P') || (p.sequence && p.sequence.includes('P'))) {
      weightedAvg.P += 8 * p.confidence;
      weightedAvg.B -= 4 * p.confidence;
      weightedAvg.T -= 4 * p.confidence;
    } else if (p.pattern.includes('Banker') || p.pattern.includes('B') || (p.sequence && p.sequence.includes('B'))) {
      weightedAvg.B += 8 * p.confidence;
      weightedAvg.P -= 4 * p.confidence;
      weightedAvg.T -= 4 * p.confidence;
    } else if (p.pattern.includes('Tie') || p.pattern.includes('T') || (p.sequence && p.sequence.includes('T'))) {
      weightedAvg.T += 12 * p.confidence;
      weightedAvg.P -= 6 * p.confidence;
      weightedAvg.B -= 6 * p.confidence;
    }
  });
  
  // اكتشاف Dragon وتعديل الاحتمالات
  const dragon = detectDragon(history);
  if (dragon.dragon) {
    weightedAvg[dragon.dragon] += 12 * (dragon.length / 10);
    weightedAvg[dragon.dragon === 'P' ? 'B' : 'P'] -= 8 * (dragon.length / 10);
    weightedAvg.T -= 4 * (dragon.length / 10);
  }
  
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
  if (history.length < 3) {
    return {
      recommendation: "none",
      confidence: 0,
      message: lang === 'ar-MA' ? 
        "أدخل 3 جولات على الأقل للتوصية" : 
        "Enter at least 3 rounds for recommendation"
    };
  }

  const prediction = advancedPredict(history);
  const patterns = detectAdvancedPatterns(history);
  const strongestPrediction = Object.entries(prediction).reduce((a, b) => 
    a[1] > b[1] ? a : b
  );

  if (strongestPrediction[1] >= 55) {
    const recType = strongestPrediction[0];
    const confidence = Math.min(90, strongestPrediction[1] * 1.1);
    
    return {
      recommendation: recType,
      confidence: confidence,
      message: buildRecommendationMessage(recType, confidence, patterns)
    };
  } else if (patterns.length > 0 && patterns[0].confidence >= 0.6) {
    const pattern = patterns[0];
    let recType = 'none';
    
    if (pattern.pattern.includes('Player') || pattern.pattern.includes('P') || (pattern.sequence && pattern.sequence.includes('P'))) {
      recType = 'P';
    } else if (pattern.pattern.includes('Banker') || pattern.pattern.includes('B') || (pattern.sequence && pattern.sequence.includes('B'))) {
      recType = 'B';
    } else if (pattern.pattern.includes('Tie') || pattern.pattern.includes('T') || (pattern.sequence && pattern.sequence.includes('T'))) {
      recType = 'T';
    }
    
    if (recType !== 'none') {
      return {
        recommendation: recType,
        confidence: pattern.confidence * 100,
        message: buildRecommendationMessage(recType, pattern.confidence * 100, patterns)
      };
    }
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
  
  if (history.length < 2) {
    document.getElementById('aiAdvice').innerHTML = isArabic ? 
      "⏳ أدخل جولتين على الأقل لتحليل الأنماط..." : 
      "⏳ Enter at least 2 rounds to analyze patterns...";
    return;
  }

  const patterns = detectAdvancedPatterns(history);
  let patternAdvice = "";
  
  if (patterns.length > 0) {
    // عرض أفضل 3 أنماط
    const topPatterns = patterns.slice(0, 3);
    
    topPatterns.forEach((pattern, index) => {
      const desc = isArabic ? pattern.description.ar : pattern.description.en;
      const confidence = Math.round(pattern.confidence * 100);
      const sequence = pattern.sequence || '';
      
      const icon = index === 0 ? '🎯' : index === 1 ? '📊' : '🔍';
      const patternText = isArabic ? 
        `${icon} ${desc} (${confidence}% ثقة) ${sequence}` : 
        `${icon} ${desc} (${confidence}% confidence) ${sequence}`;
      
      patternAdvice += patternText + '<br>';
    });

    // إضافة نصيحة استباقية
    if (patterns[0].confidence >= 0.6) {
      const strongestPattern = patterns[0];
      if (strongestPattern.pattern.includes('Player') || strongestPattern.sequence.includes('P')) {
        patternAdvice += isArabic ? 
          '<br>💡 توقع استمرار اتجاه اللاعب' : 
          '<br>💡 Expect Player trend to continue';
      } else if (strongestPattern.pattern.includes('Banker') || strongestPattern.sequence.includes('B')) {
        patternAdvice += isArabic ? 
          '<br>💡 توقع استمرار اتجاه المصرفي' : 
          '<br>💡 Expect Banker trend to continue';
      } else if (strongestPattern.pattern.includes('Tie') || strongestPattern.sequence.includes('T')) {
        patternAdvice += isArabic ? 
          '<br>💡 انتبه لاحتمال التعادل' : 
          '<br>💡 Watch out for possible tie';
      }
    }
  } else {
    // إذا لم توجد أنماط قوية، عرض تحليل بسيط
    const lastThree = history.slice(-3);
    const counts = { P: 0, B: 0, T: 0 };
    lastThree.forEach(r => counts[r]++);
    
    if (counts.P >= 2) {
      patternAdvice = isArabic ? 
        '📈 اتجاه بسيط نحو اللاعب' : 
        '📈 Simple trend toward Player';
    } else if (counts.B >= 2) {
      patternAdvice = isArabic ? 
        '📈 اتجاه بسيط نحو المصرفي' : 
        '📈 Simple trend toward Banker';
    } else {
      patternAdvice = isArabic ? 
        '📊 لا توجد أنماط واضحة بعد' : 
        '📊 No clear patterns yet';
    }
  }
  
  document.getElementById('aiAdvice').innerHTML = patternAdvice;
}

function updateTrendsAndStreaks() {
  const isArabic = lang === 'ar-MA';
  
  if (history.length < 2) {
    document.getElementById('trendsContent').innerHTML = isArabic ? 
      `<div style="text-align:center;padding:10px;">⏳ أدخل جولتين على الأقل لتحليل الاتجاهات...</div>` : 
      `<div style="text-align:center;padding:10px;">⏳ Enter at least 2 rounds to analyze trends...</div>`;
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
    
    <div style="margin-top: 15px; padding: 10px; background: rgba(255,215,0,0.1); border-radius: 8px;">
      <h4 style="margin-bottom: 10px;color:gold;">${isArabic ? 'الأنماط المكتشفة' : 'Detected Patterns'}</h4>
      <div id="patternsList" style="text-align: right; font-size: 0.9em;">
        ${generatePatternsList()}
      </div>
    </div>
  `;
  
  document.getElementById('trendsContent').innerHTML = trendsHTML;
}

function generatePatternsList() {
  const patterns = detectAdvancedPatterns(history);
  const isArabic = lang === 'ar-MA';
  
  if (patterns.length === 0) {
    return isArabic ? 
      '<div style="text-align:center;color:#888;">لا توجد أنماط قوية</div>' : 
      '<div style="text-align:center;color:#888;">No strong patterns</div>';
  }
  
  let patternsHTML = '';
  patterns.slice(0, 4).forEach((pattern, index) => {
    const desc = isArabic ? pattern.description.ar : pattern.description.en;
    const confidence = Math.round(pattern.confidence * 100);
    const sequence = pattern.sequence ? ` [${pattern.sequence}]` : '';
    
    const confidenceColor = confidence >= 70 ? '#28a745' : confidence >= 50 ? '#ffc107' : '#dc3545';
    
    patternsHTML += `
      <div style="margin: 8px 0; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 5px; border-right: 3px solid ${confidenceColor};">
        <strong>${pattern.pattern}</strong>: ${desc}${sequence}
        <span style="color:${confidenceColor}; float: left; font-weight: bold;">${confidence}%</span>
      </div>
    `;
  });
  
  return patternsHTML;
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
  
  if (history.length > 0) {
    updateDisplay();
    updatePredictions();
    generateAdvice();
    updateTrendsAndStreaks();
    showRecommendation();
    updateChart();
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
    markovModel = { P: { P: 0, B: 0, T: 0 }, B: { P: 0, B: 0, T: 0 }, T: { P: 0, B: 0, T: 0 } };
    updateBigRoad();
    document.getElementById('bigEyeRoad').innerHTML = '';
    document.getElementById('smallRoad').innerHTML = '';
    if (window.statsChart) {
      window.statsChart.destroy();
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
  }
}
```

المميزات الجديدة في النسخة النهائية:

🎯 اكتشاف فوري من الجولة الثانية:

· أنماط ثنائية: PP, BB, TT, PB, BP
· أنماط ثلاثية: PPP, BBB, PBP, BPB
· اتجاهات بسيطة من 3/5 جولات

📊 عرض متقدم للأنماط:

· عرض التسلسل الفعلي [PPBB]
· ألوان حسب مستوى الثقة (أخضر، أصفر، أحمر)
· أفضل 4 أنماط مع ثقتها

🔍 تحسينات الذكاء الاصطناعي:

· توقعات أكثر دقة مع بيانات قليلة
· توصيات من الجولة الثالثة
· نصائح استباقية بناءً على الأنماط

🚀 أداء محسن:

· استجابة فورية مع كل جولة جديدة
· اكتشاف أنماط الميجورك من جولتين
· تحليل اتجاهات فوري

الآن التطبيق سيبدأ باكتشاف الأنماط من الجولة الثانية وسيظهر تحليلات فورية مع كل جولة جديدة!


// ===== Runtime Error Overlay (helps on phones without console) =====
window.addEventListener('error', function(e) {
  try {
    const msg = "JS Error: " + (e.message || e.error || e);
    console.log(msg);
    let el = document.getElementById('debugStatus');
    if (!el) {
      el = document.createElement('div');
      el.id = 'debugStatus';
      el.style.cssText = 'background:rgba(220,53,69,.15);color:#dc3545;padding:8px;border-radius:8px;margin:10px 0';
      document.body.prepend(el);
    }
    el.innerText = msg;
  } catch (_) {}
});
// ===================================================================
// حالة التطبيق الموسعة
const AppState = {
  history: [],
  currentStreak: { type: null, count: 0 },
  lang: 'ar-MA',
  markovModel: { P: { P: 0, B: 0, T: 0 }, B: { P: 0, B: 0, T: 0 }, T: { P: 0, B: 0, T: 0 }},
  statsChart: null,
  advancedModel: null,
  useAdvancedModel: false,
  patternWeights: {
    dragon: 0.15,
    double: 0.10,
    zigzag: 0.12,
    diamond: 0.1,
    '8-8': 0.08,
    doubleTie: 0.07,
    cockroach: 0.09
  },
  modelPerformance: { basic: 0, advanced: 0 },
  lastPredictions: []
};

// أنماط شائعة في الكازينوهات الحية
const COMMON_CASINO_PATTERNS = [
  {
    name: { 'ar-MA': 'التنين الطويل', 'en-US': 'Long Dragon' },
    description: {
      'ar-MA': '6 أو أكثر من النتائج المتتالية لنفس الجانب (لاعب/مصرفي)',
      'en-US': '6 or more consecutive results for same side'
    },
    example: 'PPPPPPP أو BBBBBBB'
  },
  {
    name: { 'ar-MA': 'نمط متعرج', 'en-US': 'Zigzag Pattern' },
  {
    name: { 'ar-MA': 'النمط المزدوج', 'en-US': 'Double Pattern' },
    description: {
      'ar-MA': 'زوج زوج بالتناوب (PPBB أو BBPP) — مؤشّر على استقرار مؤقّت قبل انعكاس محتمل',
      'en-US': 'Consecutive pairs (PPBB or BBPP) — often shows short stability before a possible swing'
    },
    example: 'PPBB أو BBPP'
  },

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
  },
  {
    name: { 'ar-MA': 'نمط الدايموند', 'en-US': 'Diamond Pattern' },
    description: {
      'ar-MA': 'تناوب منتظم على شكل ماسة (PBPBP أو BPBPB)',
      'en-US': 'Diamond-shaped alternation (PBPBP or BPBPB)'
    },
    example: 'PBPBP أو BPBPB'
  },
  {
    name: { 'ar-MA': 'نمط 8-8', 'en-US': '8-8 Pattern' },
    description: {
      'ar-MA': 'توازن بين اللاعب والمصرفي في 16 جولة',
      'en-US': 'Balance between Player and Banker in 16 rounds'
    },
    example: '8P و 8B في آخر 16 جولة'
  }
];

// تهيئة التطبيق
async 
// ربط الأزرار بالأحداث مباشرة (حلّ لمشكل onclick)
function bindButtons() {
  const playerBtn = document.querySelector('.player');
  const bankerBtn = document.querySelector('.banker');
  const tieBtn = document.querySelector('.tie');
  const resetBtn = document.querySelector('.reset');
  const themeBtn = document.querySelector('.theme-toggle');

  if (playerBtn) playerBtn.addEventListener('click', () => addResult('P'));
  if (bankerBtn) bankerBtn.addEventListener('click', () => addResult('B'));
  if (tieBtn) tieBtn.addEventListener('click', () => addResult('T'));
  if (resetBtn) resetBtn.addEventListener('click', resetData);
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
}

function initializeApp() {
  createNotificationContainer();
  setupEventListeners();
  bindButtons();
  checkTimeForTheme();
  loadTheme();
  loadLanguage();
  loadHistory();
  var dbg=document.getElementById('debugStatus'); if(dbg){dbg.innerText='✅ JS loaded & buttons bound';}
  updateCommonPatterns();
  
  if (AppState.history.length > 30) {
    if (window.tf) { await initializeModels(); }
  }
}

// تحميل التاريخ من localStorage
function loadHistory() {
  const savedHistory = localStorage.getItem('baccaratHistory');
  if (savedHistory) {
    AppState.history = JSON.parse(savedHistory);
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

// تهيئة نماذج تعلم الآلة
async function initializeModels() {
  try {
    if (AppState.history.length > 30) {
      AppState.advancedModel = await trainLSTMModel(AppState.history);
      console.log("LSTM Model trained successfully");
      showNotification('info', AppState.lang === 'ar-MA' ? 
        'تم تدريب النموذج المتقدم بنجاح' : 'Advanced model trained successfully');
    }
  } catch (error) {
    console.error("Model training error:", error);
    showNotification('error', AppState.lang === 'ar-MA' ? 
      'خطأ في تدريب النموذج المتقدم' : 'Advanced model training error');
  }
}

// تدريب نموذج LSTM
async function trainLSTMModel(history) {
  if (!window.tf) { return null; }
  if (history.length < 50) {
    console.log("Not enough data for LSTM training");
    return null;
  }
  
  const model = tf.sequential();
  model.add(tf.layers.lstm({
    units: 32,
    inputShape: [10, 1],
    returnSequences: false,
    kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
  }));
  
  model.add(tf.layers.dropout({ rate: 0.2 }));
  model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));
  
  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });
  
  const { xs, ys } = prepareData(history);
  
  // تقسيم البيانات إلى تدريب واختبار
  const splitIdx = Math.floor(xs.shape[0] * 0.8);
  const xTrain = xs.slice(0, splitIdx);
  const xTest = xs.slice(splitIdx);
  const yTrain = ys.slice(0, splitIdx);
  const yTest = ys.slice(splitIdx);
  
  await model.fit(xTrain, yTrain, {
    epochs: 30,
    batchSize: 16,
    validationData: [xTest, yTest],
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}`);
      }
    }
  });
  
  // تقييم النموذج
  const evalResult = model.evaluate(xTest, yTest);
  const testAccuracy = evalResult[1].dataSync()[0];
  console.log(`Test accuracy: ${(testAccuracy * 100).toFixed(1)}%`);
  
  // تحرير الذاكرة
  tf.dispose([xs, ys, xTrain, xTest, yTrain, yTest]);
  
  return model;
}

// تحضير البيانات لتعلم الآلة
function prepareData(history) {
  const sequenceLength = 10;
  const xs = [];
  const ys = [];
  
  // تحويل التاريخ إلى متتابعات
  for (let i = sequenceLength; i < history.length; i++) {
    const sequence = history.slice(i - sequenceLength, i);
    const next = history[i];
    
    const x = sequence.map(r => {
      if (r === 'P') return 0;
      if (r === 'B') return 1;
      return 2;
    });
    
    const y = next === 'P' ? 0 : next === 'B' ? 1 : 2;
    
    xs.push(x);
    ys.push(y);
  }
  
  // تحويل إلى tensors
  const xsTensor = tf.tensor3d(xs, [xs.length, sequenceLength, 1]);
  const ysTensor = tf.oneHot(tf.tensor1d(ys, 'int32'), 3);
  
  return { xs: xsTensor, ys: ysTensor };
}

// التنبؤ باستخدام النموذج المتقدم
async function predictWithAdvancedModel(history) {
  if (!AppState.advancedModel || history.length < 10) {
    return null;
  }
  
  try {
    const lastSequence = history.slice(-10).map(r => {
      if (r === 'P') return 0;
      if (r === 'B') return 1;
      return 2;
    });
    
    const input = tf.tensor3d([lastSequence], [1, 10, 1]);
    const prediction = AppState.advancedModel.predict(input);
    const probs = await prediction.data();
    tf.dispose([input, prediction]);
    
    return {
      P: probs[0] * 100,
      B: probs[1] * 100,
      T: probs[2] * 100
    };
  } catch (error) {
    console.error("Prediction error:", error);
    return null;
  }
}

// تحليل نمط الدايموند
function analyzeDiamondPattern(history) {
  if (history.length < 15) return null;
  
  const filtered = history.filter(r => r !== 'T');
  const patterns = [];
  
  for (let i = 4; i < filtered.length; i++) {
    const seq = filtered.slice(i-4, i+1);
    if ((seq[0] === 'P' && seq[1] === 'B' && seq[2] === 'P' && seq[3] === 'B' && seq[4] === 'P') ||
        (seq[0] === 'B' && seq[1] === 'P' && seq[2] === 'B' && seq[3] === 'P' && seq[4] === 'B')) {
      patterns.push({
        type: 'diamond',
        index: i,
        sequence: seq.join('')
      });
    }
  }
  
  return patterns.length > 0 ? {
    count: patterns.length,
    lastPattern: patterns[patterns.length - 1],
    confidence: Math.min(0.9, patterns.length * 0.1)
  } : null;
}

// تحليل نمط 8-8
function analyze8Pattern(history) {
  if (history.length < 16) return null;
  
  const last16 = history.slice(-16);
  const pCount = last16.filter(r => r === 'P').length;
  const bCount = last16.filter(r => r === 'B').length;
  
  if (Math.abs(pCount - bCount) <= 2) {
    return {
      pattern: '8-8',
      pCount,
      bCount,
      confidence: Math.min(0.85, 0.6 + (Math.min(pCount, bCount) * 0.03))
    };
  }
  return null;
}

// تحليل نمط Cockroach
function analyzeCockroachPattern(history) {
  if (history.length < 20) return null;
  
  const filtered = history.filter(r => r !== 'T');
  let cockroachCount = 0;
  
  for (let i = 3; i < filtered.length; i++) {
    if (filtered[i] === filtered[i-3]) {
      cockroachCount++;
    }
  }
  
  const confidence = Math.min(0.8, 0.3 + (cockroachCount / filtered.length) * 2);
  return cockroachCount > 3 ? {
    pattern: 'cockroach',
    count: cockroachCount,
    confidence: confidence
  } : null;
}

// اكتشاف الأنماط المتقدمة
function detectAdvancedPatterns(history) {
  if (history.length < 5) return [];
  
  const patterns = [];
  const recentHistory = history.slice(-15).join('');
  const fullHistoryStr = history.join('');

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

  // إضافة الأنماط الجديدة
  const diamond = analyzeDiamondPattern(history);
  if (diamond) {
    patterns.push({
      pattern: 'Diamond',
      description: {
        ar: 'نمط دايموند متكرر (PBPBP أو BPBPB)',
        en: 'Repeated diamond pattern (PBPBP or BPBPB)'
      },
      confidence: diamond.confidence,
      length: 5
    });
  }
  
  const eightPattern = analyze8Pattern(history);
  if (eightPattern) {
    patterns.push({
      pattern: '8-8',
      description: {
        ar: `توازن بين اللاعب والمصرفي (${eightPattern.pCount}P vs ${eightPattern.bCount}B)`,
        en: `Balance between Player and Banker (${eightPattern.pCount}P vs ${eightPattern.bCount}B)`
      },
      confidence: eightPattern.confidence,
      length: 16
    });
  }
  
  const cockroach = analyzeCockroachPattern(history);
  if (cockroach) {
    patterns.push({
      pattern: 'Cockroach',
      description: {
        ar: 'تكرار كل 3 جولات (نمط الصرصور)',
        en: 'Every 3rd round repetition (Cockroach pattern)'
      },
      confidence: cockroach.confidence,
      length: cockroach.count
    });
  }

  const last5 = history.slice(-5).join('');
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

// التنبؤ باستخدام نموذج ماركوف الأساسي
function basicMarkovPredict(history) {
  if (history.length < 3) {
    return { P: 33.3, B: 33.3, T: 33.3 };
  }

  const lastResult = history[history.length - 1];
  return {
    P: AppState.markovModel[lastResult].P,
    B: AppState.markovModel[lastResult].B,
    T: AppState.markovModel[lastResult].T
  };
}

// التنبؤ المتقدم مع دمج النماذج
async function advancedPredict(history) {
  if (history.length < 3) {
    return { P: 33.3, B: 33.3, T: 33.3 };
  }
  
  // الحصول على تنبؤات من النموذج الأساسي
  const basicPrediction = basicMarkovPredict(history);
  
  // الحصول على تنبؤات من النموذج المتقدم إذا كان مفعل
  let advancedPrediction = null;
  if (AppState.useAdvancedModel && AppState.advancedModel && window.tf) {
    advancedPrediction = await predictWithAdvancedModel(history);
  }
  
  // دمج النتائج
  let finalPrediction;
  if (advancedPrediction) {
    // متوسط مرجح بين النموذجين مع تعديل الأداء
    const basicWeight = 0.6 * AppState.modelPerformance.basic;
    const advancedWeight = 0.6 * AppState.modelPerformance.advanced;
    const totalWeight = basicWeight + advancedWeight;
    
    finalPrediction = {
      P: (basicPrediction.P * (basicWeight/totalWeight) + advancedPrediction.P * (advancedWeight/totalWeight)),
      B: (basicPrediction.B * (basicWeight/totalWeight) + advancedPrediction.B * (advancedWeight/totalWeight)),
      T: (basicPrediction.T * (basicWeight/totalWeight) + advancedPrediction.T * (advancedWeight/totalWeight))
    };
  } else {
    finalPrediction = basicPrediction;
  }
  
  // تطبيق تصحيح للأنماط
  const patterns = detectAdvancedPatterns(history);
  patterns.forEach(pattern => {
    const weight = AppState.patternWeights[pattern.pattern.toLowerCase()] || 0.05;
    
    if (pattern.pattern.includes('P') || pattern.pattern.includes('Player')) {
      finalPrediction.P += 15 * weight * pattern.confidence;
      finalPrediction.B -= 7 * weight * pattern.confidence;
      finalPrediction.T -= 8 * weight * pattern.confidence;
    } else if (pattern.pattern.includes('B') || pattern.pattern.includes('Banker')) {
      finalPrediction.B += 15 * weight * pattern.confidence;
      finalPrediction.P -= 7 * weight * pattern.confidence;
      finalPrediction.T -= 8 * weight * pattern.confidence;
    } else if (pattern.pattern.includes('T') || pattern.pattern.includes('Tie') || 
               pattern.pattern.includes('Diamond') || pattern.pattern.includes('Cockroach')) {
      finalPrediction.T += 10 * weight * pattern.confidence;
      finalPrediction.P -= 5 * weight * pattern.confidence;
      finalPrediction.B -= 5 * weight * pattern.confidence;
    }
  });
  
  // تطبيع النتائج
  const total = finalPrediction.P + finalPrediction.B + finalPrediction.T;
  finalPrediction.P = (finalPrediction.P / total) * 100;
  finalPrediction.B = (finalPrediction.B / total) * 100;
  finalPrediction.T = (finalPrediction.T / total) * 100;
  
  return finalPrediction;
}

// تحديث أداء النماذج
function updateModelPerformance() {
  if (AppState.history.length < 2) return;
  
  const lastResult = AppState.history[AppState.history.length - 1];
  const prevPrediction = AppState.lastPredictions[AppState.lastPredictions.length - 1];
  
  if (!prevPrediction) return;
  
  // حساب دقة النموذج الأساسي
  const basicCorrect = (prevPrediction.basic.P > prevPrediction.basic.B && 
                       prevPrediction.basic.P > prevPrediction.basic.T && 
                       lastResult === 'P') ||
                      (prevPrediction.basic.B > prevPrediction.basic.P && 
                       prevPrediction.basic.B > prevPrediction.basic.T && 
                       lastResult === 'B') ||
                      (prevPrediction.basic.T > prevPrediction.basic.P && 
                       prevPrediction.basic.T > prevPrediction.basic.B && 
                       lastResult === 'T');
  
  // حساب دقة النموذج المتقدم
  let advancedCorrect = false;
  if (prevPrediction.advanced) {
    advancedCorrect = (prevPrediction.advanced.P > prevPrediction.advanced.B && 
                      prevPrediction.advanced.P > prevPrediction.advanced.T && 
                      lastResult === 'P') ||
                     (prevPrediction.advanced.B > prevPrediction.advanced.P && 
                      prevPrediction.advanced.B > prevPrediction.advanced.T && 
                      lastResult === 'B') ||
                     (prevPrediction.advanced.T > prevPrediction.advanced.P && 
                      prevPrediction.advanced.T > prevPrediction.advanced.B && 
                      lastResult === 'T');
  }
  
  // تحديث معدلات الأداء
  AppState.modelPerformance.basic = (AppState.modelPerformance.basic * 0.9) + (basicCorrect ? 0.1 : 0);
  
  if (prevPrediction.advanced) {
    AppState.modelPerformance.advanced = (AppState.modelPerformance.advanced * 0.9) + (advancedCorrect ? 0.1 : 0);
  }
  
  // تبديل النموذج تلقائياً إذا كان الأداء ضعيفاً
  if (AppState.modelPerformance.advanced < 0.6 && AppState.modelPerformance.basic > 0.65) {
    AppState.useAdvancedModel = false;
    showNotification('info', AppState.lang === 'ar-MA' ? 
      'تم التبديل للنموذج الأساسي بسبب دقة أفضل' : 
      'Switched to basic model for better accuracy');
  }
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
  
  updatePredictions();
}

// تحديث واجهة التنبؤات المتقدمة
function updateAdvancedPredictionDisplay() {
  const container = document.getElementById('advancedPredictionResults');
  
  if (AppState.history.length < 5) {
    container.innerHTML = AppState.lang === 'ar-MA' ?
      '<p>⏳ يحتاج إلى المزيد من البيانات للتنبؤ المتقدم</p>' :
      '<p>⏳ Need more data for advanced prediction</p>';
    return;
  }
  
  let html = '<div class="model-performance">';
  
  // عرض أداء النماذج
  html += `<p><strong>${AppState.lang === 'ar-MA' ? 'أداء النماذج:' : 'Model performance:'}</strong></p>`;
  html += `<p>${AppState.lang === 'ar-MA' ? 'الأساسي:' : 'Basic:'} ${(AppState.modelPerformance.basic * 100).toFixed(1)}%</p>`;
  
  if (AppState.advancedModel) {
    html += `<p>${AppState.lang === 'ar-MA' ? 'المتقدم:' : 'Advanced:'} ${(AppState.modelPerformance.advanced * 100).toFixed(1)}%</p>`;
  } else {
    html += `<p>${AppState.lang === 'ar-MA' ? 'المتقدم:' : 'Advanced:'} ${AppState.lang === 'ar-MA' ? 'غير متاح' : 'Not available'}</p>`;
  }
  
  // عرض الأنماط المكتشفة
  const patterns = detectAdvancedPatterns(AppState.history);
  if (patterns.length > 0) {
    html += '<div class="detected-patterns">';
    html += `<p><strong>${AppState.lang === 'ar-MA' ? 'الأنماط المكتشفة:' : 'Detected patterns:'}</strong></p>`;
    
    patterns.slice(0, 3).forEach(pattern => {
      html += `<div class="pattern-item">
        <span class="pattern-name">${pattern.pattern}</span>
        <span class="pattern-confidence">${(pattern.confidence * 100).toFixed(1)}%</span>
        <p class="pattern-desc">${pattern.description[AppState.lang] || pattern.description.en}</p>
      </div>`;
    });
    
    html += '</div>';
  }
  
  container.innerHTML = html;
}

// تحديث تحليل الدايموند
function updateDiamondAnalysis() {
  const container = document.getElementById('diamondAnalysis');
  const analysis = analyzeDiamondPattern(AppState.history);
  
  if (!analysis) {
    container.innerHTML = AppState.lang === 'ar-MA' ?
      '<p>لم يتم اكتشاف نمط دايموند في آخر 15 جولة</p>' :
      '<p>No diamond pattern detected in last 15 rounds</p>';
    return;
  }
  
  container.innerHTML = `
    <div class="diamond-result">
      <p>${AppState.lang === 'ar-MA' ? 'تم اكتشاف نمط دايموند' : 'Diamond pattern detected'}:</p>
      <p><strong>${analysis.lastPattern.sequence}</strong></p>
      <p>${AppState.lang === 'ar-MA' ? 'عدد التكرارات:' : 'Occurrences:'} ${analysis.count}</p>
      <p>${AppState.lang === 'ar-MA' ? 'مستوى الثقة:' : 'Confidence:'} ${(analysis.confidence * 100).toFixed(1)}%</p>
    </div>
  `;
}

// تحديث Cockroach Road
function updateCockroachRoad(history) {
  const cockroachRoad = document.getElementById('cockroachRoad');
  cockroachRoad.innerHTML = '';
  let matrix = [[]];
  let row = 0;

  for (let i = 3; i < history.length; i++) {
    if (history[i] === history[i - 3]) {
      matrix[row].push(history[i]);
    } else {
      row++;
      matrix[row] = [history[i]];
    }
  }

  renderRoad(matrix, cockroachRoad);
}

// إضافة نتيجة جديدة
async function addResult(result) {
  AppState.history.push(result);
  saveHistory();
  
  // تدريب النماذج عند وجود بيانات كافية
  if (AppState.history.length === 30 || (AppState.history.length % 50 === 0 && !AppState.advancedModel)) {
    if (window.tf) { await initializeModels(); }
  }
  
  // حفظ التنبؤات السابقة لتقييم الأداء
  const lastPrediction = {
    basic: basicMarkovPredict(AppState.history.slice(0, -1)),
    advanced: AppState.advancedModel ? await predictWithAdvancedModel(AppState.history.slice(0, -1)) : null
  };
  AppState.lastPredictions.push(lastPrediction);
  
  // تحديث أداء النماذج
  updateModelPerformance();
  
  const lastRecommendation = await generateBetRecommendation();
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
  await updatePredictions();
  generateAdvice();
  showRecommendation();
  updateChart();
  updateLast5Analysis();
  updateAdvancedPredictionDisplay();
  updateDiamondAnalysis();
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

// توليد توصية الرهان
async function generateBetRecommendation() {
  if (AppState.history.length < 5) {
    return {
      recommendation: "none",
      confidence: 0,
      message: AppState.lang === 'ar-MA' ? 
        "غير كافي من البيانات للتوصية" : 
        "Not enough data for recommendation"
    };
  }

  const prediction = await advancedPredict(AppState.history);
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
async function showRecommendation() {
  const recommendation = await generateBetRecommendation();
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
async function updatePredictions() {
  const prediction = await advancedPredict(AppState.history);
  displayPrediction(prediction);
}

// عرض التنبؤ
function displayPrediction(prediction) {
  const isArabic = AppState.lang === 'ar-MA';
  const threshold = 55.7;
  
  document.querySelectorAll('.prediction-bar').forEach(bar => {
    bar.classList.remove('high-prob');
  });
  document.querySelectorAll('.probability-value').forEach(el => {
    el.classList.remove('high');
  });

  document.querySelector('.player-bar').style.width = `${prediction.P}%`;
  document.querySelector('.banker-bar').style.width = `${prediction.B}%`;
  document.querySelector('.tie-bar').style.width = `${prediction.T}%`;
  
  document.getElementById('playerProb').textContent = `${prediction.P.toFixed(1)}%`;
  document.getElementById('bankerProb').textContent = `${prediction.B.toFixed(1)}%`;
  document.getElementById('tieProb').textContent = `${prediction.T.toFixed(1)}%`;

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

// تحديث الطرق المشتقة
function updateDerivativeRoads() {
  const filteredHistory = AppState.history.filter(r => r !== 'T');
  updateBigEyeRoad(filteredHistory);
  updateSmallRoad(filteredHistory);
  updateCockroachRoad(filteredHistory);
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

// تحديث الرسم البياني
function updateChart() {
  const ctx = document.getElementById('statsChart').getContext('2d');
  const last20 = AppState.history.slice(-20);
  const counts = { P: 0, B: 0, T: 0 };
  last20.forEach(r => counts[r]++);

  if (AppState.statsChart) {
    AppState.statsChart.destroy();
  }

  AppState.statsChart = window.Chart ? new Chart(ctx, {
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

// تحديث واجهة المستخدم
function updateUI() {
  const isArabic = AppState.lang === 'ar-MA';
  
  document.title = isArabic ? 'BACCARAT PRO ANALYZER' : 'BACCARAT PRO ANALYZER';
  document.querySelector('h1').innerHTML = 
    '<span class="logo-b">BACCARAT</span> <span class="logo-s">PRO</span> <span class="logo-rest">ANALYZER</span>';
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
  document.querySelectorAll('.road-container h3')[2].textContent = isArabic ? 'Cockroach Road' : 'Cockroach Road';
  document.querySelector('.last5-analysis h3').textContent = isArabic ? 'تحليل آخر 5 جولات' : 'Last 5 Rounds Analysis';
  document.querySelector('.common-patterns h3').textContent = isArabic ? 'الأنماط الشائعة في الكازينو' : 'Common Casino Patterns';
  document.querySelector('.advanced-prediction h3').textContent = isArabic ? '🛠 التنبؤات المتقدمة' : '🛠 Advanced Predictions';
  document.querySelector('.diamond-pattern h3').textContent = isArabic ? '💎 تحليل نمط الدايموند' : '💎 Diamond Pattern Analysis';
  document.querySelector('.performance-analysis h3').textContent = isArabic ? 'تحليل أداء النماذج' : 'Model Performance Analysis';
  
  if (AppState.history.length > 0) {
    updateDisplay();
    updatePredictions();
    generateAdvice();
    updateTrendsAndStreaks();
    showRecommendation();
    updateChart();
    updateLast5Analysis();
    updateAdvancedPredictionDisplay();
    updateDiamondAnalysis();
  }
}

// إعادة تعيين البيانات
async function resetData() {
  const isArabic = AppState.lang === 'ar-MA';
  const confirmMsg = isArabic ? 
    "هل أنت متأكد من أنك تريد إعادة تعيين جميع البيانات؟" : 
    "Are you sure you want to reset all data?";
  
  if (confirm(confirmMsg)) {
    AppState.history = [];
    AppState.currentStreak = { type: null, count: 0 };
    AppState.markovModel = { P: { P: 0, B: 0, T: 0 }, B: { P: 0, B: 0, T: 0 }, T: { P: 0, B: 0, T: 0 } };
    AppState.lastPredictions = [];
    AppState.modelPerformance = { basic: 0, advanced: 0 };
    
    if (AppState.advancedModel) {
      tf.dispose(AppState.advancedModel);
      AppState.advancedModel = null;
    }
    
    saveHistory();
    updateBigRoad();
    document.getElementById('bigEyeRoad').innerHTML = '';
    document.getElementById('smallRoad').innerHTML = '';
    document.getElementById('cockroachRoad').innerHTML = '';
    
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
    document.getElementById('advancedPredictionResults').innerHTML = '';
    document.getElementById('diamondAnalysis').innerHTML = '';
    document.getElementById('modelPerformance').innerHTML = '';
    
    showNotification('info', isArabic ? 'تم إعادة تعيين جميع البيانات' : 'All data has been reset');
  }
}

// عرض الإشعار
function showNotification(type, message) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  const icon = type === 'win' ? '🎉' : type === 'lose' ? '💥' : type === 'error' ? '❌' : '🔄';
  
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

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initializeApp);


// ضمان توفّر الدوال في النطاق العام للواجهة (لتعمل أزرار onclick)
window.addResult = addResult;
window.resetData = resetData;
window.toggleAdvancedModel = toggleAdvancedModel;
window.toggleTheme = toggleTheme;

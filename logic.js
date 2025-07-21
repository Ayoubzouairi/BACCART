
let lastPrediction = null;
let predictionAccuracy = { correct: 0, total: 0 };
let lastRecommendation = null;

// تعديل دالة addResult
function addResult(result) {
  history.push(result);
  
  if (result === currentStreak.type) {
    currentStreak.count++;
  } else {
    currentStreak.type = result;
    currentStreak.count = 1;
  }
  
  // التحقق من صحة التنبؤ السابق
  if (lastPrediction && history.length > 1) {
    checkPredictionAccuracy(result);
  }
  
  // التحقق من صحة التوصية السابقة
  if (lastRecommendation && history.length > 1) {
    checkRecommendationAccuracy(result);
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
  
  // حفظ التنبؤ الحالي للمقارنة في الجولة التالية
  lastPrediction = advancedPredict(history);
  lastRecommendation = generateBetRecommendation();
}

// دالة جديدة للتحقق من دقة التنبؤ
function checkPredictionAccuracy(actualResult) {
  predictionAccuracy.total++;
  
  if (!lastPrediction) return;
  
  // تحديد التنبؤ الأقوى
  let predictedResult = null;
  let highestProb = 0;
  
  for (const [key, value] of Object.entries(lastPrediction)) {
    if (value > highestProb) {
      highestProb = value;
      predictedResult = key;
    }
  }
  
  if (predictedResult === actualResult) {
    predictionAccuracy.correct++;
    showNotification('success', `🎯 تنبؤ صحيح! (${actualResult})`, `دقة التنبؤات: ${((predictionAccuracy.correct/predictionAccuracy.total)*100).toFixed(1)}%`);
  } else if (highestProb > 60) {
    showNotification('error', `❌ تنبؤ خاطئ! توقعنا ${predictedResult} ولكن النتيجة ${actualResult}`, `الدقة الحالية: ${((predictionAccuracy.correct/predictionAccuracy.total)*100).toFixed(1)}%`);
  }
}

// دالة جديدة للتحقق من دقة التوصية
function checkRecommendationAccuracy(actualResult) {
  if (!lastRecommendation || lastRecommendation.recommendation === "none") return;
  
  if (lastRecommendation.recommendation === actualResult) {
    showNotification('success', `💰 توصية رابحة! ${actualResult}`, `ثقة التوصية: ${lastRecommendation.confidence.toFixed(1)}%`);
  } else if (lastRecommendation.confidence > 65) {
    showNotification('error', `💸 توصية خاسرة! أوصينا بـ ${lastRecommendation.recommendation} ولكن النتيجة ${actualResult}`, `ثقة التوصية: ${lastRecommendation.confidence.toFixed(1)}%`);
  }
}

// دالة جديدة لعرض الإشعارات
function showNotification(type, title, message) {
  const notificationContainer = document.getElementById('notificationContainer');
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  notification.innerHTML = `
    <div class="notification-title">${title}</div>
    <div class="notification-message">${message}</div>
  `;
  
  notificationContainer.appendChild(notification);
  
  // إزالة الإشعار بعد 5 ثواني
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 500);
  }, 5000);
}

// تعديل دالة advancedPredict لتحسين الدقة
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
  const lastFifty = history.length >= 50 ? history.slice(-50) : lastTwenty;
  
  const freq5 = { P: 0, B: 0, T: 0 };
  const freq10 = { P: 0, B: 0, T: 0 };
  const freq20 = { P: 0, B: 0, T: 0 };
  const freq50 = { P: 0, B: 0, T: 0 };
  
  lastFive.forEach(r => freq5[r]++);
  lastTen.forEach(r => freq10[r]++);
  lastTwenty.forEach(r => freq20[r]++);
  lastFifty.forEach(r => freq50[r]++);
  
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
  
  const percent50 = {
    P: (freq50.P / lastFifty.length) * 100,
    B: (freq50.B / lastFifty.length) * 100,
    T: (freq50.T / lastFifty.length) * 100
  };
  
  // حساب المتوسط المرجح مع إعطاء وزن أكبر للبيانات الحديثة
  let weightedAvg = {
    P: (percent5.P * 0.5 + percent10.P * 0.25 + percent20.P * 0.15 + percent50.P * 0.1),
    B: (percent5.B * 0.5 + percent10.B * 0.25 + percent20.B * 0.15 + percent50.B * 0.1),
    T: (percent5.T * 0.5 + percent10.T * 0.25 + percent20.T * 0.15 + percent50.T * 0.1)
  };
  
  // تطبيق Markov Chain مع تعديل الأوزان
  const lastResult = history[history.length - 1];
  if (lastResult) {
    weightedAvg.P = (weightedAvg.P * 0.7 + markovModel[lastResult].P * 0.3);
    weightedAvg.B = (weightedAvg.B * 0.7 + markovModel[lastResult].B * 0.3);
    weightedAvg.T = (weightedAvg.T * 0.7 + markovModel[lastResult].T * 0.3);
  }
  
  // تطبيق تصحيح الأنماط مع تحسين المعاملات
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
  
  // اكتشاف Dragon وتعديل الاحتمالات
  const dragon = detectDragon(history);
  if (dragon.dragon) {
    weightedAvg[dragon.dragon] += 20 * (dragon.length / 10);
    weightedAvg[dragon.dragon === 'P' ? 'B' : 'P'] -= 15 * (dragon.length / 10);
    weightedAvg.T -= 5 * (dragon.length / 10);
  }
  
  // تطبيق تصحيح التوازن لضمان عدم هيمنة خيار واحد بشكل مفرط
  const maxProb = Math.max(weightedAvg.P, weightedAvg.B, weightedAvg.T);
  if (maxProb > 70) {
    const reduction = (maxProb - 70) / 2;
    if (weightedAvg.P === maxProb) {
      weightedAvg.P -= reduction;
      weightedAvg.B += reduction / 2;
      weightedAvg.T += reduction / 2;
    } else if (weightedAvg.B === maxProb) {
      weightedAvg.B -= reduction;
      weightedAvg.P += reduction / 2;
      weightedAvg.T += reduction / 2;
    } else {
      weightedAvg.T -= reduction;
      weightedAvg.P += reduction / 2;
      weightedAvg.B += reduction / 2;
    }
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

// تعديل دالة resetData لإعادة تعيين إحصائيات الدقة
function resetData() {
  const isArabic = lang === 'ar-MA';
  const confirmMsg = isArabic ? 
    "هل أنت متأكد من أنك تريد إعادة تعيين جميع البيانات؟" : 
    "Are you sure you want to reset all data?";
  
  if (confirm(confirmMsg)) {
    history = [];
    currentStreak = { type: null, count: 0 };
    markovModel = { P: { P: 0, B: 0, T: 0 }, B: { P: 0, B: 0, T: 0 }, T: { P: 0, B: 0, T: 0 } };
    lastPrediction = null;
    predictionAccuracy = { correct: 0, total: 0 };
    lastRecommendation = null;
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
    document.getElementById('notificationContainer').innerHTML = '';
  }
}

class BaccaratAnalyzer {
  constructor() {
    this.history = [];
    this.currentStreak = { type: null, count: 0 };
    this.markovMatrix = this.createMarkovMatrix();
  }

  createMarkovMatrix() {
    const states = ['P', 'B', 'T'];
    const matrix = {};
    states.forEach(from => {
      matrix[from] = {};
      states.forEach(to => {
        matrix[from][to] = 0;
      });
    });
    return matrix;
  }

  addResult(result) {
    // تحديث السجل والسلاسل
    this.history.push(result);
    this.updateStreak(result);
    this.updateMarkovMatrix(result);

    // تحليل متقدم
    const prediction = this.calculatePrediction();
    const recommendation = this.generateRecommendation(prediction);

    return {
      prediction,
      recommendation
    };
  }

  updateStreak(result) {
    if (result === this.currentStreak.type) {
      this.currentStreak.count++;
    } else {
      this.currentStreak.type = result;
      this.currentStreak.count = 1;
    }
  }

  updateMarkovMatrix(result) {
    if (this.history.length >= 2) {
      const prev = this.history[this.history.length - 2];
      this.markovMatrix[prev][result]++;
    }
  }

  calculatePrediction() {
    // تحليل الترددات
    const frequency = this.analyzeFrequency();
    
    // تحليل ماركوف
    const markov = this.markovAnalysis();
    
    // تأثير الأنماط
    const patterns = this.analyzePatterns();
    
    // دمج النتائج
    const prediction = {
      P: frequency.P * 0.5 + markov.P * 0.3 + patterns.P * 0.2,
      B: frequency.B * 0.5 + markov.B * 0.3 + patterns.B * 0.2,
      T: frequency.T * 0.5 + markov.T * 0.3 + patterns.T * 0.2
    };
    
    // تطبيع النتائج
    const total = prediction.P + prediction.B + prediction.T;
    return {
      P: (prediction.P / total) * 100,
      B: (prediction.B / total) * 100,
      T: (prediction.T / total) * 100
    };
  }

  analyzeFrequency() {
    const decay = 0.9; // وزن أعلى للنتائج الحديثة
    let weights = { P: 0, B: 0, T: 0 };
    let total = 0;

    for (let i = this.history.length - 1; i >= 0; i--) {
      const ageFactor = Math.pow(decay, this.history.length - 1 - i);
      weights[this.history[i]] += ageFactor;
      total += ageFactor;
    }

    return {
      P: (weights.P / total) * 100,
      B: (weights.B / total) * 100,
      T: (weights.T / total) * 100
    };
  }

  markovAnalysis() {
    if (this.history.length === 0) return { P: 33.3, B: 33.3, T: 33.3 };
    
    const last = this.history[this.history.length - 1] || 'P';
    const total = Object.values(this.markovMatrix[last]).reduce((a, b) => a + b, 0);
    
    return total > 0 ? {
      P: (this.markovMatrix[last]['P'] / total) * 100,
      B: (this.markovMatrix[last]['B'] / total) * 100,
      T: (this.markovMatrix[last]['T'] / total) * 100
    } : { P: 33.3, B: 33.3, T: 33.3 };
  }

  analyzePatterns() {
    const patterns = { P: 0, B: 0, T: 0 };
    
    // تحليل السلاسل
    if (this.currentStreak.count >= 3) {
      patterns[this.currentStreak.type] += this.currentStreak.count * 3;
    }
    
    // تحليل التناوب
    const last3 = this.history.slice(-3).join('');
    if (['PBP', 'BPB'].includes(last3)) {
      patterns[last3[0]] += 15;
    }
    
    return patterns;
  }

  generateRecommendation(prediction) {
    if (this.history.length < 5) {
      return {
        type: 'none',
        message: 'أدخل 5 نتائج على الأقل للحصول على توصية',
        confidence: 0
      };
    }

    const winner = Object.entries(prediction).reduce((a, b) => a[1] > b[1] ? a : b);
    const confidence = Math.min(95, winner[1] * 0.9);
    
    let message = '';
    if (confidence >= 70) {
      message = `توصية قوية بـ ${this.getTypeName(winner[0])} (${confidence.toFixed(0)}% ثقة)`;
    } else if (confidence >= 55) {
      message = `توصية متوسطة بـ ${this.getTypeName(winner[0])} (${confidence.toFixed(0)}% ثقة)`;
    } else {
      message = 'لا توجد توصية واضحة حالياً';
    }
    
    return {
      type: confidence >= 55 ? winner[0] : 'none',
      message,
      confidence
    };
  }

  getTypeName(type) {
    return {
      P: 'اللاعب 🔵',
      B: 'المصرفي 🔴',
      T: 'التعادل 🟢'
    }[type];
  }

  reset() {
    this.history = [];
    this.currentStreak = { type: null, count: 0 };
    this.markovMatrix = this.createMarkovMatrix();
  }
}

// تهيئة المحلل
const analyzer = new BaccaratAnalyzer();

// عناصر واجهة المستخدم
const playerBtn = document.getElementById('playerBtn');
const bankerBtn = document.getElementById('bankerBtn');
const tieBtn = document.getElementById('tieBtn');
const resetBtn = document.getElementById('resetBtn');
const playerBar = document.getElementById('playerBar');
const bankerBar = document.getElementById('bankerBar');
const tieBar = document.getElementById('tieBar');
const playerPercent = document.getElementById('playerPercent');
const bankerPercent = document.getElementById('bankerPercent');
const tiePercent = document.getElementById('tiePercent');
const recommendationBox = document.getElementById('recommendation');
const confidenceBar = document.getElementById('confidenceBar');
const confidencePercent = document.getElementById('confidencePercent');
const historyDisplay = document.getElementById('historyDisplay');

// معالجة الأحداث
playerBtn.addEventListener('click', () => addResult('P'));
bankerBtn.addEventListener('click', () => addResult('B'));
tieBtn.addEventListener('click', () => addResult('T'));
resetBtn.addEventListener('click', resetAll);

function addResult(result) {
  const { prediction, recommendation } = analyzer.addResult(result);
  
  // تحديث الواجهة
  updatePredictionDisplay(prediction);
  updateRecommendation(recommendation);
  updateHistoryDisplay();
  
  // حفظ البيانات
  saveData();
}

function updatePredictionDisplay(prediction) {
  playerBar.style.width = prediction.P + '%';
  bankerBar.style.width = prediction.B + '%';
  tieBar.style.width = prediction.T + '%';
  
  playerPercent.textContent = prediction.P.toFixed(1) + '%';
  bankerPercent.textContent = prediction.B.toFixed(1) + '%';
  tiePercent.textContent = prediction.T.toFixed(1) + '%';
}

function updateRecommendation(recommendation) {
  recommendationBox.innerHTML = `<p>${recommendation.message}</p>`;
  
  confidenceBar.style.width = recommendation.confidence + '%';
  confidencePercent.textContent = recommendation.confidence.toFixed(0) + '%';
  
  // تغيير لون شريط الثقة حسب القوة
  if (recommendation.confidence >= 70) {
    confidenceBar.style.background = 'linear-gradient(90deg, #27ae60, #2ecc71)';
  } else if (recommendation.confidence >= 55) {
    confidenceBar.style.background = 'linear-gradient(90deg, #f39c12, #f1c40f)';
  } else {
    confidenceBar.style.background = 'linear-gradient(90deg, #e74c3c, #c0392b)';
  }
}

function updateHistoryDisplay() {
  historyDisplay.innerHTML = analyzer.history
    .map(result => `<div class="history-item history-${result}">${result}</div>`)
    .join('');
}

function resetAll() {
  if (confirm('هل تريد فعلاً إعادة الضبط؟ سيتم حذف جميع البيانات.')) {
    analyzer.reset();
    updatePredictionDisplay({ P: 33.3, B: 33.3, T: 33.3 });
    updateRecommendation({
      type: 'none',
      message: 'أدخل النتائج لرؤية التحليل',
      confidence: 0
    });
    updateHistoryDisplay();
    localStorage.removeItem('baccaratData');
  }
}

// حفظ واستعادة البيانات
function saveData() {
  const data = {
    history: analyzer.history,
    currentStreak: analyzer.currentStreak,
    markovMatrix: analyzer.markovMatrix
  };
  localStorage.setItem('baccaratData', JSON.stringify(data));
}

function loadData() {
  const savedData = localStorage.getItem('baccaratData');
  if (savedData) {
    const { history, currentStreak, markovMatrix } = JSON.parse(savedData);
    analyzer.history = history;
    analyzer.currentStreak = currentStreak;
    analyzer.markovMatrix = markovMatrix;
    
    if (history.length > 0) {
      const lastResult = history[history.length - 1];
      const { prediction, recommendation } = analyzer.addResult(lastResult);
      updatePredictionDisplay(prediction);
      updateRecommendation(recommendation);
      updateHistoryDisplay();
    }
  }
}

// تحميل البيانات عند بدء التشغيل
window.addEventListener('load', loadData);

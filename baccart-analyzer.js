// هنا ضع كود الـ BaccaratAnalyzer class الكامل الذي قدمته سابقاً

// إنشاء مثيل المحلل
const analyzer = new BaccaratAnalyzer();

// عناصر واجهة المستخدم
const playerBtn = document.getElementById('playerBtn');
const bankerBtn = document.getElementById('bankerBtn');
const tieBtn = document.getElementById('tieBtn');
const resetBtn = document.getElementById('resetBtn');
const playerProb = document.getElementById('playerProb');
const bankerProb = document.getElementById('bankerProb');
const tieProb = document.getElementById('tieProb');
const recommendationBox = document.getElementById('recommendationBox');
const historyDisplay = document.getElementById('historyDisplay');

// معالجة الأحداث
playerBtn.addEventListener('click', () => addNewResult('P'));
bankerBtn.addEventListener('click', () => addNewResult('B'));
tieBtn.addEventListener('click', () => addNewResult('T'));
resetBtn.addEventListener('click', resetAnalyzer);

function addNewResult(result) {
  const analysis = analyzer.addResult(result);
  
  // تحديث واجهة المستخدم
  updateUI(analysis);
  
  // حفظ في localStorage
  saveToLocalStorage();
}

function updateUI(analysis) {
  // تحديث التنبؤات
  playerProb.textContent = analysis.prediction.P.toFixed(1) + '%';
  bankerProb.textContent = analysis.prediction.B.toFixed(1) + '%';
  tieProb.textContent = analysis.prediction.T.toFixed(1) + '%';
  
  document.querySelector('.player-bar').style.width = analysis.prediction.P + '%';
  document.querySelector('.banker-bar').style.width = analysis.prediction.B + '%';
  document.querySelector('.tie-bar').style.width = analysis.prediction.T + '%';
  
  // تحديث التوصية
  recommendationBox.innerHTML = `
    <h3>${analysis.recommendation.message}</h3>
    ${analysis.recommendation.confidence > 0 ? `
      <div class="confidence-meter">
        <div class="confidence-bar" style="width: ${analysis.recommendation.confidence}%"></div>
        <span>${Math.round(analysis.recommendation.confidence)}%</span>
      </div>
    ` : ''}
  `;
  
  // تحديث سجل النتائج
  updateHistoryDisplay();
}

function updateHistoryDisplay() {
  historyDisplay.innerHTML = analyzer.history.map((result, index) => `
    <div class="history-item history-${result}" title="الجولة ${index + 1}">${result}</div>
  `).join('');
}

function resetAnalyzer() {
  if (confirm('هل تريد إعادة ضبط المحلل؟ سيتم حذف جميع البيانات.')) {
    analyzer.reset();
    updateUI({
      prediction: { P: 33.3, B: 33.3, T: 33.3 },
      recommendation: { message: 'أدخل النتائج لرؤية التوصيات', confidence: 0 }
    });
    localStorage.removeItem('baccaratAnalyzerData');
  }
}

// حفظ واستعادة البيانات
function saveToLocalStorage() {
  localStorage.setItem('baccaratAnalyzerData', JSON.stringify({
    history: analyzer.history,
    markovMatrix: analyzer.markovMatrix,
    currentStreak: analyzer.currentStreak
  }));
}

function loadFromLocalStorage() {
  const savedData = localStorage.getItem('baccaratAnalyzerData');
  if (savedData) {
    const data = JSON.parse(savedData);
    analyzer.history = data.history;
    analyzer.markovMatrix = data.markovMatrix || analyzer.initializeMarkovMatrix();
    analyzer.currentStreak = data.currentStreak || { type: null, count: 0 };
    
    // إعادة تحليل جميع النتائج
    if (analyzer.history.length > 0) {
      const lastAnalysis = analyzer.addResult(analyzer.history[analyzer.history.length-1]);
      updateUI(lastAnalysis);
    }
  }
}

// تحميل البيانات عند بدء التشغيل
window.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
  updateHistoryDisplay();
});

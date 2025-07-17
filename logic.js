// logic.js - النسخة المحسنة
class BaccaratGame {
  constructor() {
    this.history = [];
    this.balance = 1000; // رصيد ابتدائي
    this.balanceHistory = [1000];
    this.currentStreak = { type: null, count: 0 };
    this.betsHistory = [];
    this.lang = localStorage.getItem('lang') || 'ar-MA';
    this.theme = localStorage.getItem('theme') || 'dark';
    this.init();
  }

  init() {
    this.loadGameData();
    this.setupEventListeners();
    this.updateUI();
  }

  setupEventListeners() {
    document.getElementById('langSelect').addEventListener('change', (e) => {
      this.lang = e.target.value;
      localStorage.setItem('lang', this.lang);
      this.updateUI();
    });
  }

  // دالة تحليل متقدمة
  advancedPredict(history) {
    if (history.length < 3) return { P: 33.3, B: 33.3, T: 33.3 };

    // تحليل الترددات
    const frequencyAnalysis = this.analyzeFrequency(history);
    
    // تحليل السلاسل
    const streakAnalysis = this.analyzeStreaks(history);
    
    // تحليل الأنماط
    const patternAnalysis = this.detectPatterns(history);
    
    // دمج النتائج مع أوزان مختلفة
    return this.combinePredictions(frequencyAnalysis, streakAnalysis, patternAnalysis);
  }

  analyzeFrequency(history) {
    const counts = { P: 0, B: 0, T: 0 };
    history.forEach(r => counts[r]++);
    
    const total = history.length || 1;
    return {
      P: (counts.P / total) * 100,
      B: (counts.B / total) * 100,
      T: (counts.T / total) * 100
    };
  }

  analyzeStreaks(history) {
    if (history.length < 3) return { P: 33.3, B: 33.3, T: 33.3 };
    
    const lastResult = history[history.length - 1];
    let streakLength = 1;
    
    for (let i = history.length - 2; i >= 0; i--) {
      if (history[i] === lastResult) streakLength++;
      else break;
    }
    
    const streakWeight = Math.min(0.3, streakLength * 0.1);
    const baseProb = 100 / 3;
    
    return {
      P: lastResult === 'P' ? baseProb + streakWeight * 100 : baseProb - streakWeight * 50,
      B: lastResult === 'B' ? baseProb + streakWeight * 100 : baseProb - streakWeight * 50,
      T: lastResult === 'T' ? baseProb + streakWeight * 100 : baseProb - streakWeight * 50
    };
  }

  detectPatterns(history) {
    if (history.length < 5) return { P: 33.3, B: 33.3, T: 33.3 };
    
    const patterns = [];
    const lastFive = history.slice(-5).join('');
    const lastTen = history.length >= 10 ? history.slice(-10).join('') : '';
    
    // نمط التناوب
    if (/PBPBP|BPBPB/.test(lastFive)) {
      patterns.push({
        type: 'alternating',
        effect: { P: 15, B: 15, T: -30 },
        confidence: 0.8
      });
    }
    
    // نمط التكرار
    const streaks = this.getCurrentStreaks(history);
    streaks.forEach(streak => {
      if (streak.count >= 3) {
        patterns.push({
          type: 'streak',
          effect: { 
            [streak.type]: 10 * streak.count,
            ...(streak.type === 'P' ? { B: -5 * streak.count, T: -5 * streak.count } : 
                streak.type === 'B' ? { P: -5 * streak.count, T: -5 * streak.count } : 
                { P: -5 * streak.count, B: -5 * streak.count })
          },
          confidence: 0.6 + streak.count * 0.1
        });
      }
    });
    
    // تطبيق تأثير الأنماط
    let patternEffects = { P: 0, B: 0, T: 0 };
    patterns.forEach(pattern => {
      patternEffects.P += (pattern.effect.P || 0) * pattern.confidence;
      patternEffects.B += (pattern.effect.B || 0) * pattern.confidence;
      patternEffects.T += (pattern.effect.T || 0) * pattern.confidence;
    });
    
    // تحويل التأثير إلى نسب مئوية
    const totalEffect = Math.max(1, Math.abs(patternEffects.P) + Math.abs(patternEffects.B) + Math.abs(patternEffects.T));
    return {
      P: 33.3 + (patternEffects.P / totalEffect * 33.3),
      B: 33.3 + (patternEffects.B / totalEffect * 33.3),
      T: 33.3 + (patternEffects.T / totalEffect * 33.3)
    };
  }

  combinePredictions(frequency, streaks, patterns) {
    const weights = {
      frequency: 0.5,
      streaks: 0.3,
      patterns: 0.2
    };
    
    const totalP = frequency.P * weights.frequency + 
                  streaks.P * weights.streaks + 
                  patterns.P * weights.patterns;
                  
    const totalB = frequency.B * weights.frequency + 
                  streaks.B * weights.streaks + 
                  patterns.B * weights.patterns;
                  
    const totalT = frequency.T * weights.frequency + 
                  streaks.T * weights.streaks + 
                  patterns.T * weights.patterns;
    
    // ضمان أن المجموع 100%
    const total = totalP + totalB + totalT;
    return {
      P: (totalP / total) * 100,
      B: (totalB / total) * 100,
      T: (totalT / total) * 100
    };
  }

  // دالة إضافة نتيجة جديدة
  addResult(result, betAmount = 0, betOn) {
    betAmount = parseFloat(betAmount) || 0;
    
    // تحديث السجل التاريخي
    this.history.push(result);
    
    // تحديث السلسلة الحالية
    if (result === this.currentStreak.type) {
      this.currentStreak.count++;
    } else {
      this.currentStreak.type = result;
      this.currentStreak.count = 1;
    }
    
    // حساب الربح/الخسارة
    const profit = this.calculateProfit(betOn, result, betAmount);
    
    // تحديث سجل الرهانات
    this.betsHistory.push({
      round: this.history.length,
      betOn,
      amount: betAmount,
      outcome: result,
      profit,
      timestamp: new Date()
    });
    
    // تحديث الرصيد
    this.updateBalance(profit);
    
    // تحديث واجهة المستخدم
    this.updateAllDisplays();
    
    // حفظ البيانات
    this.saveGameData();
  }

  calculateProfit(betOn, outcome, amount) {
    if (!amount || amount <= 0) return 0;
    
    if (betOn === outcome) {
      if (betOn === 'T') return amount * 8; // تعادل 8:1
      if (betOn === 'B') return amount * 0.95; // مصرفي مع خصم 5%
      return amount * 1; // لاعب 1:1
    }
    return -amount; // خسارة
  }

  updateBalance(profit) {
    this.balance += profit;
    this.balanceHistory.push(this.balance);
    
    // تأثير بصرية عند تغيير الرصيد
    const balanceDisplay = document.getElementById('balanceDisplay');
    if (profit > 0) {
      balanceDisplay.classList.add('win-animation');
      setTimeout(() => balanceDisplay.classList.remove('win-animation'), 500);
    }
  }

  updateAllDisplays() {
    this.updateChart();
    this.updateBigRoad();
    this.updatePredictions();
    this.updateStats();
    this.updateTrends();
    this.generateAdvice();
  }

  // ... باقي الدوال بنفس النمط مع تحسينات الأداء
}

// تهيئة اللعبة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  window.baccaratGame = new BaccaratGame();
});

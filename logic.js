class BaccaratAnalyzer {
  constructor() {
    this.history = [];
    this.currentStreak = { type: null, count: 0 };
    this.lang = 'ar-MA';
    this.markovMatrix = this.initializeMarkovMatrix();
    this.adaptiveWeights = {
      frequency: 0.4,
      markov: 0.3,
      patterns: 0.2,
      equilibrium: 0.1
    };
  }

  // Initialization Methods
  initializeMarkovMatrix() {
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

  // Core Methods
  addResult(result) {
    this.history.push(result);
    this.updateStreak(result);
    this.updateMarkovMatrix(result);
    
    return {
      prediction: this.advancedPredict(),
      recommendation: this.generateRecommendation(),
      trends: this.analyzeTrends(),
      patterns: this.detectAdvancedPatterns()
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

  // Analysis Methods
  advancedPredict() {
    const frequency = this.dynamicFrequencyAnalysis();
    const markov = this.markovPrediction();
    const patterns = this.applyPatternsEffect();
    const equilibrium = this.equilibriumAdjustment();

    // Apply adaptive weights
    const prediction = {
      P: frequency.P * this.adaptiveWeights.frequency +
         markov.P * this.adaptiveWeights.markov +
         patterns.P * this.adaptiveWeights.patterns +
         equilibrium.P * this.adaptiveWeights.equilibrium,
      B: frequency.B * this.adaptiveWeights.frequency +
         markov.B * this.adaptiveWeights.markov +
         patterns.B * this.adaptiveWeights.patterns +
         equilibrium.B * this.adaptiveWeights.equilibrium,
      T: frequency.T * this.adaptiveWeights.frequency +
         markov.T * this.adaptiveWeights.markov +
         patterns.T * this.adaptiveWeights.patterns +
         equilibrium.T * this.adaptiveWeights.equilibrium
    };

    // Normalize
    const total = prediction.P + prediction.B + prediction.T;
    return {
      P: (prediction.P / total) * 100,
      B: (prediction.B / total) * 100,
      T: (prediction.T / total) * 100
    };
  }

  dynamicFrequencyAnalysis() {
    const decayFactor = 0.85;
    let weights = { P: 0, B: 0, T: 0 };
    let totalWeight = 0;

    for (let i = this.history.length - 1; i >= 0; i--) {
      const ageFactor = Math.pow(decayFactor, this.history.length - 1 - i);
      weights[this.history[i]] += ageFactor;
      totalWeight += ageFactor;
    }

    return {
      P: (weights.P / totalWeight) * 100,
      B: (weights.B / totalWeight) * 100,
      T: (weights.T / totalWeight) * 100
    };
  }

  markovPrediction() {
    if (this.history.length === 0) return { P: 33.3, B: 33.3, T: 33.3 };
    
    const last = this.history[this.history.length - 1];
    const total = Object.values(this.markovMatrix[last]).reduce((a, b) => a + b, 0);
    
    return total > 0 ? {
      P: (this.markovMatrix[last]['P'] / total) * 100,
      B: (this.markovMatrix[last]['B'] / total) * 100,
      T: (this.markovMatrix[last]['T'] / total) * 100
    } : { P: 33.3, B: 33.3, T: 33.3 };
  }

  detectAdvancedPatterns() {
    const patterns = [];
    const recent = this.history.slice(-10).join('');

    // Dragon Pattern (6+ same)
    const dragonMatch = recent.match(/([PB])\1{5,}$/);
    if (dragonMatch) {
      patterns.push({
        type: dragonMatch[1],
        name: 'Dragon',
        confidence: Math.min(0.95, 0.7 + (dragonMatch[0].length * 0.05)),
        length: dragonMatch[0].length
      });
    }

    // ZigZag Pattern
    const zigzagMatch = recent.match(/(PB){3,}$|(BP){3,}$/);
    if (zigzagMatch) {
      patterns.push({
        type: recent.slice(-1),
        name: 'ZigZag',
        confidence: 0.8,
        length: zigzagMatch[0].length
      });
    }

    // 3+ Ties
    const tieMatch = recent.match(/TTT$/);
    if (tieMatch) {
      patterns.push({
        type: 'T',
        name: 'TripleTie',
        confidence: 0.75,
        length: tieMatch[0].length
      });
    }

    return patterns;
  }

  applyPatternsEffect() {
    const patterns = this.detectAdvancedPatterns();
    const effect = { P: 0, B: 0, T: 0 };

    patterns.forEach(pattern => {
      effect[pattern.type] += pattern.confidence * 15;
    });

    return effect;
  }

  equilibriumAdjustment() {
    const window = 15;
    if (this.history.length < window) return { P: 0, B: 0, T: 0 };

    const segment = this.history.slice(-window);
    const counts = { P: 0, B: 0, T: 0 };
    segment.forEach(x => counts[x]++);

    const expected = window / 3;
    const chiSquare = Object.values(counts).reduce(
      (sum, obs) => sum + Math.pow(obs - expected, 2) / expected, 0);

    // If results are too balanced, reduce extreme predictions
    return chiSquare < 5.991 ? { P: -5, B: -5, T: 10 } : { P: 0, B: 0, T: 0 };
  }

  // Recommendation Engine
  generateRecommendation() {
    if (this.history.length < 5) {
      return {
        type: 'none',
        confidence: 0,
        message: this.t('not_enough_data')
      };
    }

    const prediction = this.advancedPredict();
    const patterns = this.detectAdvancedPatterns();
    const strongest = Object.entries(prediction).reduce((a, b) => a[1] > b[1] ? a : b);

    if (strongest[1] >= 65 || (patterns.length > 0 && patterns[0].confidence >= 0.75)) {
      const type = strongest[1] >= 65 ? strongest[0] : patterns[0].type;
      const confidence = Math.min(95, 
        (strongest[1] * 0.7) + 
        (patterns[0]?.confidence * 30 || 0)
      );

      return {
        type,
        confidence,
        message: this.buildRecommendationMessage(type, confidence, patterns)
      };
    }

    return {
      type: 'none',
      confidence: 0,
      message: this.t('no_clear_recommendation')
    };
  }

  buildRecommendationMessage(type, confidence, patterns) {
    const typeName = this.t(type === 'P' ? 'player' : type === 'B' ? 'banker' : 'tie');
    
    if (patterns.length > 0) {
      const patternName = patterns[0].name;
      return this.t('recommendation_with_pattern', {
        type: typeName,
        pattern: patternName,
        confidence: Math.round(confidence)
      });
    }
    
    return this.t('recommendation_basic', {
      type: typeName,
      confidence: Math.round(confidence)
    });
  }

  // Trend Analysis
  analyzeTrends() {
    const trends = {
      last5: this.calculateSegmentTrend(5),
      last10: this.calculateSegmentTrend(10),
      last20: this.calculateSegmentTrend(20)
    };

    return {
      ...trends,
      streak: this.currentStreak,
      dispersion: this.analyzeDispersion()
    };
  }

  calculateSegmentTrend(size) {
    if (this.history.length < size) return null;
    
    const segment = this.history.slice(-size);
    const counts = { P: 0, B: 0, T: 0 };
    segment.forEach(x => counts[x]++);
    
    return {
      P: (counts.P / size) * 100,
      B: (counts.B / size) * 100,
      T: (counts.T / size) * 100
    };
  }

  analyzeDispersion() {
    const segments = [];
    const segmentSize = 5;
    
    for (let i = 0; i < this.history.length; i += segmentSize) {
      const segment = this.history.slice(i, i + segmentSize);
      const counts = { P: 0, B: 0, T: 0 };
      segment.forEach(x => counts[x]++);
      segments.push(counts);
    }

    if (segments.length < 3) return null;

    const variances = {
      P: this.calculateVariance(segments.map(s => s.P / segmentSize)),
      B: this.calculateVariance(segments.map(s => s.B / segmentSize)),
      T: this.calculateVariance(segments.map(s => s.T / segmentSize))
    };

    return {
      isRandom: Object.values(variances).every(v => v < 0.05),
      isClustered: Object.values(variances).some(v => v > 0.15),
      variances
    };
  }

  calculateVariance(arr) {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    return arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
  }

  // Language Support
  t(key, params = {}) {
    const translations = {
      en: {
        player: 'Player',
        banker: 'Banker',
        tie: 'Tie',
        not_enough_data: 'Not enough data for recommendation',
        no_clear_recommendation: 'No clear recommendation at this time',
        recommendation_basic: 'Recommend {type} ({confidence}% confidence)',
        recommendation_with_pattern: 'Recommend {type} - {pattern} pattern ({confidence}% confidence)'
      },
      ar: {
        player: 'اللاعب',
        banker: 'المصرفي',
        tie: 'تعادل',
        not_enough_data: 'غير كافي من البيانات للتوصية',
        no_clear_recommendation: 'لا توجد توصية واضحة حالياً',
        recommendation_basic: 'توصية: {type} (ثقة {confidence}%)',
        recommendation_with_pattern: 'توصية: {type} - نمط {pattern} (ثقة {confidence}%)'
      }
    };

    let text = translations[this.lang][key] || key;
    Object.keys(params).forEach(k => {
      text = text.replace(`{${k}}`, params[k]);
    });

    return text;
  }

  // Utility Methods
  reset() {
    this.history = [];
    this.currentStreak = { type: null, count: 0 };
    this.markovMatrix = this.initializeMarkovMatrix();
  }

  setLanguage(lang) {
    this.lang = ['ar', 'en'].includes(lang) ? lang : 'en';
  }
  }

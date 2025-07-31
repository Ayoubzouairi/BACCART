// حالة التطبيق المحسنة
const AppState = {
    history: [],
    currentStreak: { type: null, count: 0 },
    lang: 'ar-MA',
    markovModel: {
        'P': { 'P': 0, 'B': 0, 'T': 0 },
        'B': { 'P': 0, 'B': 0, 'T': 0 },
        'T': { 'P': 0, 'B': 0, 'T': 0 }
    },
    secondOrderMarkov: {
        'PP': { 'P': 0, 'B': 0, 'T': 0 },
        'PB': { 'P': 0, 'B': 0, 'T': 0 },
        'PT': { 'P': 0, 'B': 0, 'T': 0 },
        'BP': { 'P': 0, 'B': 0, 'T': 0 },
        'BB': { 'P': 0, 'B': 0, 'T': 0 },
        'BT': { 'P': 0, 'B': 0, 'T': 0 },
        'TP': { 'P': 0, 'B': 0, 'T': 0 },
        'TB': { 'P': 0, 'B': 0, 'T': 0 },
        'TT': { 'P': 0, 'B': 0, 'T': 0 }
    },
    lstmModel: null,
    statsChart: null,
    predictionMethod: 'ensemble', // 'markov', 'lstm', or 'ensemble'
    modelAccuracies: {
        markov: { correct: 0, total: 0 },
        lstm: { correct: 0, total: 0 },
        ensemble: { correct: 0, total: 0 }
    },
    shoeType: 8,
    commission: 5
};

// تهيئة نموذج LSTM
async function initializeLSTMModel() {
    const model = tf.sequential();
    
    model.add(tf.layers.lstm({
        units: 32,
        returnSequences: true,
        inputShape: [10, 1]
    }));
    
    model.add(tf.layers.lstm({ units: 16 }));
    
    model.add(tf.layers.dense({
        units: 3,
        activation: 'softmax'
    }));
    
    model.compile({
        optimizer: tf.train.adam(0.01),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });
    
    AppState.lstmModel = model;
}

// تحويل التاريخ إلى تنسيق مناسب لـ LSTM
function prepareLSTMData(history) {
    const sequenceLength = 10;
    const sequences = [];
    const labels = [];
    
    for (let i = sequenceLength; i < history.length; i++) {
        const sequence = history.slice(i - sequenceLength, i);
        const label = history[i];
        
        // تحويل التسلسل إلى أرقام
        const numSequence = sequence.map(r => {
            if (r === 'P') return 0;
            if (r === 'B') return 1;
            return 2;
        });
        
        // تحويل التسمية إلى مصفوفة one-hot
        const oneHotLabel = [0, 0, 0];
        if (label === 'P') oneHotLabel[0] = 1;
        else if (label === 'B') oneHotLabel[1] = 1;
        else oneHotLabel[2] = 1;
        
        sequences.push(numSequence);
        labels.push(oneHotLabel);
    }
    
    return {
        sequences: tf.tensor3d(sequences, [sequences.length, sequenceLength, 1]),
        labels: tf.tensor2d(labels, [labels.length, 3])
    };
}

// تدريب نموذج LSTM
async function trainLSTMModel() {
    if (AppState.history.length < 20) return;
    
    const { sequences, labels } = prepareLSTMData(AppState.history);
    
    await AppState.lstmModel.fit(sequences, labels, {
        epochs: 50,
        batchSize: 4,
        shuffle: true,
        verbose: 0
    });
    
    tf.dispose([sequences, labels]);
}

// التنبؤ باستخدام LSTM
async function predictWithLSTM() {
    if (AppState.history.length < 10) {
        return { P: 33.3, B: 33.3, T: 33.3 };
    }
    
    const lastSequence = AppState.history.slice(-10).map(r => {
        if (r === 'P') return 0;
        if (r === 'B') return 1;
        return 2;
    });
    
    const input = tf.tensor3d([lastSequence], [1, 10, 1]);
    const prediction = AppState.lstmModel.predict(input);
    const values = await prediction.data();
    tf.dispose([input, prediction]);
    
    return {
        P: values[0] * 100,
        B: values[1] * 100,
        T: values[2] * 100
    };
}

// تحديث نموذج ماركوف من الرتبة الثانية
function updateSecondOrderMarkov() {
    if (AppState.history.length < 3) return;
    
    for (let i = 2; i < AppState.history.length; i++) {
        const from = AppState.history[i-2] + AppState.history[i-1];
        const to = AppState.history[i];
        AppState.secondOrderMarkov[from][to]++;
    }
    
    // حساب الاحتمالات
    for (const fromState in AppState.secondOrderMarkov) {
        const total = Object.values(AppState.secondOrderMarkov[fromState]).reduce((a, b) => a + b, 0);
        if (total > 0) {
            for (const toState in AppState.secondOrderMarkov[fromState]) {
                AppState.secondOrderMarkov[fromState][toState] = (AppState.secondOrderMarkov[fromState][toState] / total) * 100;
            }
        }
    }
}

// التنبؤ باستخدام ماركوف من الرتبة الثانية
function predictWithSecondOrderMarkov() {
    if (AppState.history.length < 2) {
        return { P: 33.3, B: 33.3, T: 33.3 };
    }
    
    const lastTwo = AppState.history.slice(-2).join('');
    const probabilities = AppState.secondOrderMarkov[lastTwo];
    
    if (Object.values(probabilities).every(v => v === 0)) {
        return { P: 33.3, B: 33.3, T: 33.3 };
    }
    
    return { ...probabilities };
}

// التنبؤ المتقدم المحسن
async function advancedPredict() {
    if (AppState.history.length < 3) {
        return {
            P: 33.3,
            B: 33.3,
            T: 33.3,
            confidence: 0
        };
    }
    
    // التنبؤ باستخدام مختلف الطرق
    const markovPrediction = predictWithSecondOrderMarkov();
    const lstmPrediction = await predictWithLSTM();
    
    // حساب المتوسط المرجح
    let ensemblePrediction = {
        P: (markovPrediction.P * 0.6 + lstmPrediction.P * 0.4),
        B: (markovPrediction.B * 0.6 + lstmPrediction.B * 0.4),
        T: (markovPrediction.T * 0.6 + lstmPrediction.T * 0.4)
    };
    
    // تطبيق تأثير الشوز والعمولة
    const shoeFactor = AppState.shoeType === 8 ? 1.0 : 1.05;
    const commissionFactor = AppState.commission === 5 ? 1.0 : 0.98;
    
    ensemblePrediction.B *= commissionFactor;
    ensemblePrediction.P *= shoeFactor;
    
    // تطبيع النتائج
    const total = ensemblePrediction.P + ensemblePrediction.B + ensemblePrediction.T;
    ensemblePrediction.P = (ensemblePrediction.P / total) * 100;
    ensemblePrediction.B = (ensemblePrediction.B / total) * 100;
    ensemblePrediction.T = (ensemblePrediction.T / total) * 100;
    
    // حساب ثقة التنبؤ
    const maxProb = Math.max(ensemblePrediction.P, ensemblePrediction.B, ensemblePrediction.T);
    const confidence = Math.min(95, maxProb * 1.2 - 20);
    
    return {
        ...ensemblePrediction,
        confidence: confidence
    };
}

// تحديث دقة النماذج
function updateModelAccuracy(predicted, actual) {
    const methods = ['markov', 'lstm', 'ensemble'];
    
    methods.forEach(method => {
        AppState.modelAccuracies[method].total++;
        
        if (method === 'markov') {
            const markovPred = predictWithSecondOrderMarkov();
            const markovChoice = Object.entries(markovPred).reduce((a, b) => a[1] > b[1] ? a : b)[0];
            if (markovChoice === actual) AppState.modelAccuracies.markov.correct++;
        }
        else if (method === 'lstm') {
            predictWithLSTM().then(lstmPred => {
                const lstmChoice = Object.entries(lstmPred).reduce((a, b) => a[1] > b[1] ? a : b)[0];
                if (lstmChoice === actual) AppState.modelAccuracies.lstm.correct++;
                updateModelAccuracyDisplay();
            });
        }
        else {
            if (predicted === actual) AppState.modelAccuracies.ensemble.correct++;
        }
    });
    
    updateModelAccuracyDisplay();
}

// تحديث عرض دقة النماذج
function updateModelAccuracyDisplay() {
    const container = document.getElementById('modelAccuracy');
    const isArabic = AppState.lang === 'ar-MA';
    
    let html = '<div class="model-accuracy">';
    
    for (const method in AppState.modelAccuracies) {
        const accuracy = AppState.modelAccuracies[method].total > 0 ?
            (AppState.modelAccuracies[method].correct / AppState.modelAccuracies[method].total * 100).toFixed(1) :
            0;
        
        const methodName = isArabic ? 
            (method === 'markov' ? 'ماركوف' : method === 'lstm' ? 'LSTM' : 'المجموع') :
            method.charAt(0).toUpperCase() + method.slice(1);
        
        html += `
            <div class="model-accuracy-item">
                <span class="model-name">${methodName}</span>
                <span class="model-value">${accuracy}%</span>
                <div class="mini-meter">
                    <div style="width: ${accuracy}%"></div>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

// تعيين طريقة التنبؤ
function setPredictionMethod(method) {
    AppState.predictionMethod = method;
    
    document.querySelectorAll('.method-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelector(`.method-btn[onclick="setPredictionMethod('${method}')"]`).classList.add('active');
    
    updatePredictions();
}

// تهيئة التطبيق
async function initializeApp() {
    createNotificationContainer();
    setupEventListeners();
    checkTimeForTheme();
    loadTheme();
    loadLanguage();
    updateCommonPatterns();
    await initializeLSTMModel();
    
    // تحميل الإعدادات
    AppState.shoeType = parseInt(localStorage.getItem('shoeType')) || 8;
    AppState.commission = parseInt(localStorage.getItem('commission')) || 5;
    document.getElementById('shoeType').value = AppState.shoeType;
    document.getElementById('commission').value = AppState.commission;
}

// بقية الدوال (addResult, updateDisplay, showNotification, etc.) تبقى كما هي مع تعديلات طفيفة
// لتتكامل مع التحسينات الجديدة

// عند إضافة نتيجة جديدة
async function addResult(result) {
    AppState.history.push(result);
    
    // تحديث جميع النماذج
    updateMarkovModel();
    updateSecondOrderMarkov();
    if (AppState.history.length >= 20) {
        await trainLSTMModel();
    }
    
    // التنبؤ والتحديثات
    const prediction = await advancedPredict();
    updateModelAccuracy(prediction.recommendation, result);
    
    // تحديث الواجهة
    updateDisplay();
    updateBigRoad();
    updateDerivativeRoads();
    updateTrendsAndStreaks();
    updatePredictions();
    generateAdvice();
    showRecommendation();
    updateChart();
    updateLast5Analysis();
    
    // حفظ الإعدادات
    AppState.shoeType = parseInt(document.getElementById('shoeType').value);
    AppState.commission = parseInt(document.getElementById('commission').value);
    localStorage.setItem('shoeType', AppState.shoeType);
    localStorage.setItem('commission', AppState.commission);
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initializeApp);

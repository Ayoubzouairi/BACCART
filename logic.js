/* =========================
   BACCARAT PRO — Logic.js
   - نظام الرصيد والرهان (بدون Stop-Loss)
   - تسوية تلقائية بعد تسجيل النتيجة
   - حفظ في LocalStorage
   - تنبؤات أساسية/متقدمة + رسم بياني + Big Road والطرق المشتقة (مبسّطة)
   ========================= */

(() => {
  // عناصر DOM الأساسية
  const els = {
    langSelect:        document.getElementById('langSelect'),
    balanceInput:      document.getElementById('balanceInput'),
    liveBalance:       document.getElementById('liveBalance'),
    betAmount:         document.getElementById('betAmount'),
    currentBet:        document.getElementById('currentBet'),
    statsResult:       document.getElementById('statsResult'),
    aiStats:           document.getElementById('aiStats'),
    historyDisplay:    document.getElementById('historyDisplay'),
    aiAdvice:          document.getElementById('aiAdvice'),
    trendsContent:     document.getElementById('trendsContent'),
    recommendation:    document.getElementById('recommendation'),
    bigRoad:           document.getElementById('bigRoad'),
    bigEyeRoad:        document.getElementById('bigEyeRoad'),
    smallRoad:         document.getElementById('smallRoad'),
    cockroachRoad:     document.getElementById('cockroachRoad'),
    statsChart:        document.getElementById('statsChart'),
    last5Results:      document.getElementById('last5Results'),
    casinoPatterns:    document.getElementById('casinoPatterns'),
    modelPerformance:  document.getElementById('modelPerformance'),
    diamondAnalysis:   document.getElementById('diamondAnalysis'),
    modelStatus:       document.getElementById('modelStatus'),
    playerProb:        document.getElementById('playerProb'),
    bankerProb:        document.getElementById('bankerProb'),
    tieProb:           document.getElementById('tieProb'),
    predictionBars:    document.getElementById('predictionBars'),
    notifyContainer:   document.getElementById('notificationContainer'),
    effects:           document.getElementById('effects-container')
  };

  // الحالة العامة
  const state = {
    history:  JSON.parse(localStorage.getItem('bacc_history')  || '[]'),     // ['P','B','T',...]
    balance: +(localStorage.getItem('bacc_balance') || '1000'),              // الرصيد
    bet:      JSON.parse(localStorage.getItem('bacc_bet')      || '{"side":null,"amount":0}'),
    stats:    JSON.parse(localStorage.getItem('bacc_stats')    || '{"wins":0,"losses":0,"pushes":0}'),
    advancedModel: localStorage.getItem('bacc_adv_model') === '1',           // وضع النموذج المتقدم
    lang: localStorage.getItem('bacc_lang') || 'ar-MA',
    theme: localStorage.getItem('bacc_theme') || 'dark',
    chart: null
  };

  /* ========== تهيئة ========== */
  function init() {
    // الثيم
    if (state.theme === 'light') document.body.classList.add('light-mode');

    // اللغة
    els.langSelect.value = state.lang;
    els.langSelect.addEventListener('change', () => {
      state.lang = els.langSelect.value;
      localStorage.setItem('bacc_lang', state.lang);
      renderAll(); // نصوص واجهة بسيطة
    });

    // تهيئة الرصيد والرهان
    updateBalanceUI();
    updateBetUI();

    // إنشاء الرسم البياني
    setupChart();

    // أول رندر
    renderAll();
  }

  /* ========== واجهة: رصيد/رهان ========== */
  function updateBalanceUI() {
    els.liveBalance.textContent = `الرصيد الحالي: ${fmt(state.balance)} د.م`;
  }

  function updateBetUI() {
    const { side, amount } = state.bet;
    const sideTxt = side === 'P' ? 'لاعب' : side === 'B' ? 'مصرفي' : side === 'T' ? 'تعادل' : null;
    els.currentBet.textContent = sideTxt
      ? `رهان محدد: ${sideTxt} — ${fmt(+amount)} د.م`
      : 'لا يوجد رهان محدد';
  }

  // ضبط الرصيد يدوياً
  window.setBalance = function setBalance() {
    const val = parseFloat(els.balanceInput.value);
    if (isFinite(val) && val >= 0) {
      state.balance = round2(val);
      persist();
      updateBalanceUI();
      showNotification('info', `تم تحديث الرصيد إلى ${fmt(state.balance)} د.م`);
    } else {
      showNotification('error', 'قيمة غير صالحة للرصيد');
    }
  };

  // تحديد الرهان
  window.selectBet = function selectBet(side) {
    const amount = parseFloat(els.betAmount.value);
    if (!isFinite(amount) || amount <= 0) {
      showNotification('error', 'المرجو إدخال مبلغ رهان صالح');
      return;
    }
    state.bet = { side, amount: round2(amount) };
    persist();
    updateBetUI();
    const sideTxt = side === 'P' ? 'لاعب' : side === 'B' ? 'مصرفي' : 'تعادل';
    showNotification('info', `تم تعيين الرهان: ${sideTxt} — ${fmt(state.bet.amount)} د.م`);
  };

  /* ========== تسجيل نتيجة جولة + تسوية الرهان ========== */
  window.addResult = function addResult(result) {
    // 1) نسجّل النتيجة
    state.history.push(result);

    // 2) نسوّي الرهان إذا كان محدد
    settleBet(result);

    // 3) نحفظ ونرندر
    persist();
    renderAll();

    // 4) تأثير بصري خفيف
    runResultEffect(result);
  };

  // تسوية الرهان حسب النتيجة
  function settleBet(result) {
    const { side, amount } = state.bet;
    if (!side || !amount || amount <= 0) return; // لا يوجد رهان نشط

    if (result === 'T') {
      // التعادل لا يغير الرصيد (Push)
      state.stats.pushes++;
      showNotification('tie', 'تعادل — الرهان رجع لك (0:0)');
    } else if (result === side) {
      // ربح
      const gain = side === 'P' ? amount : round2(amount * 0.95); // عمولة المصرفي 5%
      state.balance = round2(state.balance + gain);
      state.stats.wins++;
      showNotification('win', `ربحت +${fmt(gain)} د.م — رصيدك الآن: ${fmt(state.balance)} د.م`);
    } else {
      // خسارة
      state.balance = round2(state.balance - amount);
      state.stats.losses++;
      showNotification('lose', `خسرت -${fmt(amount)} د.م — رصيدك الآن: ${fmt(state.balance)} د.م`);
    }

    // مسح الرهان بعد التسوية
    state.bet = { side: null, amount: 0 };
  }

  /* ========== إعادة تعيين البيانات (بدون المساس بالرصيد) ========== */
  window.resetData = function resetData() {
    state.history = [];
    state.stats = { wins: 0, losses: 0, pushes: 0 };
    state.bet = { side: null, amount: 0 };
    persist();
    renderAll();
    showNotification('info', 'تمت إعادة التعيين (الرصيد لم يتغير)');
  };

  /* ========== تنبؤات: أساسية + متقدمة مبسطة ========== */
  function computeProbabilities() {
    // أساس: تكرارات عامة
    const counts = countPBT(state.history);
    const total = Math.max(1, counts.P + counts.B + counts.T);
    const base = {
      P: counts.P / total,
      B: counts.B / total,
      T: counts.T / total
    };

    // ماركوف 1-خطوة: احتمالات انتقال من آخر نتيجة
    const markov = computeMarkov(state.history);

    // دمج: الأساسي 0.6 + ماركوف 0.4 (لو متاح)
    const wBase = 0.6, wMk = 0.4;
    const probs = {
      P: wBase * base.P + wMk * markov.P,
      B: wBase * base.B + wMk * markov.B,
      T: wBase * base.T + wMk * markov.T
    };

    // نموذج "متقدم" مبسط: boost طفيف لخط السير الأخير
    if (state.advancedModel && state.history.length >= 4) {
      const last = state.history[state.history.length - 1];
      const streak = calcStreak(state.history, last);
      const boost = Math.min(0.15, streak * 0.03);
      probs[last] += boost;
    }

    // تطبيع
    const sum = probs.P + probs.B + probs.T || 1;
    return { P: probs.P / sum, B: probs.B / sum, T: probs.T / sum };
  }

  function computeMarkov(hist) {
    if (hist.length < 3) return { P: 1/3, B: 1/3, T: 1/3 };
    const last = hist[hist.length - 1];
    const trans = { P: {P:0,B:0,T:0, tot:0}, B: {P:0,B:0,T:0, tot:0}, T: {P:0,B:0,T:0, tot:0} };
    for (let i = 0; i < hist.length - 1; i++) {
      const a = hist[i], b = hist[i+1];
      trans[a][b] = (trans[a][b] || 0) + 1;
      trans[a].tot++;
    }
    if (!trans[last].tot) return { P: 1/3, B: 1/3, T: 1/3 };
    return {
      P: trans[last].P / trans[last].tot,
      B: trans[last].B / trans[last].tot,
      T: trans[last].T / trans[last].tot
    };
  }

  function updatePredictionUI() {
    const p = computeProbabilities();
    const perc = {
      P: Math.round(p.P * 100),
      B: Math.round(p.B * 100),
      T: Math.round(p.T * 100)
    };

    // أرقام
    els.playerProb.textContent = `${perc.P}%`;
    els.bankerProb.textContent = `${perc.B}%`;
    els.tieProb.textContent    = `${perc.T}%`;

    // أشرطة
    const bars = els.predictionBars.children; // [0]=P,[1]=B,[2]=T
    bars[0].style.width = `${Math.max(5, perc.P)}%`;
    bars[1].style.width = `${Math.max(5, perc.B)}%`;
    bars[2].style.width = `${Math.max(5, perc.T)}%`;

    // وميض عند نسبة عالية
    [...bars].forEach(b => b.classList.remove('high-prob'));
    const top = Math.max(perc.P, perc.B, perc.T);
    if (top >= 65) {
      if (top === perc.P) bars[0].classList.add('high-prob');
      if (top === perc.B) bars[1].classList.add('high-prob');
      if (top === perc.T) bars[2].classList.add('high-prob');
      pulseEffect(top === perc.P ? 'P' : top === perc.B ? 'B' : 'T');
    }

    // توصية بسيطة
    const best = top === perc.P ? 'P' : top === perc.B ? 'B' : 'T';
    renderRecommendation(best, top);
  }

  /* ========== Big Road + المشتقات (مبسطة) ========== */
  function updateBigRoad() {
    // بناء أعمدة big road بشكل مبسّط: عمود لنفس النتائج المتتالية
    const cols = [];
    let col = [];
    for (let i = 0; i < state.history.length; i++) {
      if (i === 0 || state.history[i] === state.history[i-1] || state.history[i] === 'T') {
        col.push(state.history[i]);
      } else {
        cols.push(col); col = [state.history[i]];
      }
    }
    if (col.length) cols.push(col);

    // رسم
    els.bigRoad.innerHTML = '';
    cols.forEach(c => {
      // كل عمود: نعرض لحد 6 صفوف (اختصار)
      c.slice(0, 6).forEach(v => {
        const cell = document.createElement('div');
        cell.className = `big-road-cell big-road-${v}`;
        cell.textContent = v;
        els.bigRoad.appendChild(cell);
      });
    });

    // طرق مشتقة مختصرة: نحول كل عمود لطول ونقارن
    const lens = cols.map(c => c.filter(x => x !== 'T').length);
    const deriv = deriveRoads(lens);
    drawSmallRoad(els.bigEyeRoad, deriv.bigEye);
    drawSmallRoad(els.smallRoad, deriv.small);
    drawSmallRoad(els.cockroachRoad, deriv.cockroach);
  }

  function deriveRoads(lengths) {
    // مؤشرات بسيطة: إذا كان الطول مستقر/أطول => "P" وإلا "B" (للتلوين فقط)
    const bigEye = [];
    const small  = [];
    const roach  = [];
    for (let i = 1; i < lengths.length; i++) {
      const diff = (lengths[i] || 0) - (lengths[i-1] || 0);
      bigEye.push(diff >= 0 ? 'P' : 'B');
      small.push(Math.abs(diff) <= 1 ? 'P' : 'B');
      roach.push(diff === 0 ? 'P' : 'B');
    }
    return { bigEye, small, cockroach: roach };
  }

  function drawSmallRoad(container, arr) {
    container.innerHTML = '';
    arr.forEach(v => {
      const d = document.createElement('div');
      d.className = `road-cell road-${v}`;
      container.appendChild(d);
    });
  }

  /* ========== التحليلات الثانوية ========== */
  function renderLast5() {
    const last5 = state.history.slice(-5);
    els.last5Results.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'last5-grid';
    last5.forEach(v => {
      const c = document.createElement('div');
      c.className = `last5-cell last5-${v}`;
      c.textContent = v;
      wrap.appendChild(c);
    });
    els.last5Results.appendChild(wrap);
  }

  function renderCasinoPatterns() {
    const h = state.history.join('');
    const items = [
      patternBlock('Streak',        'تكرار نفس الجهة عدة مرات', /(P{3,}|B{3,})/.test(h)),
      patternBlock('Ping-Pong',     'تناوب P-B-P-B...', /(PB){2,}|(BP){2,}/.test(h)),
      patternBlock('Double Pattern','مضاعفات مثل PPBBPP...', /(PPBB){1,}/.test(h)),
    ];
    els.casinoPatterns.innerHTML = items.join('');
  }

  function renderDiamond() {
    const h = state.history.slice(-4).join('');
    const isDiamond = h === 'PBPB' || h === 'BPBP';
    els.diamondAnalysis.innerHTML = isDiamond
      ? `<div class="diamond-result"><p>✅ نمط دايموند ظاهر (${h})</p></div>`
      : `<div class="diamond-result"><p>⏳ لا يوجد دايموند في آخر 4</p></div>`;
  }

  function renderStats() {
    const counts = countPBT(state.history);
    els.statsResult.innerHTML = `
      <table class="results-table">
        <thead><tr><th>اللاعب P</th><th>المصرفي B</th><th>التعادل T</th><th>عدد الجولات</th></tr></thead>
        <tbody><tr>
          <td>${counts.P}</td>
          <td>${counts.B}</td>
          <td>${counts.T}</td>
          <td>${counts.P + counts.B + counts.T}</td>
        </tr></tbody>
      </table>
    `;

    els.aiStats.innerHTML = `
      <p>الانتصارات: ${state.stats.wins} — الخسائر: ${state.stats.losses} — تعادلات (Push): ${state.stats.pushes}</p>
      <p>الرصيد الحالي: <b>${fmt(state.balance)} د.م</b></p>
    `;

    // التاريخ
    els.historyDisplay.textContent = state.history.join(' ');
  }

  function renderAdvice() {
    const p = computeProbabilities();
    const best = p.P > p.B ? (p.P > p.T ? 'P' : 'T') : (p.B > p.T ? 'B' : 'T');
    const txt = best === 'P' ? 'ميول للّاعب' : best === 'B' ? 'ميول للمصرفي' : 'احتمال تعادل أعلى من المعتاد';
    els.aiAdvice.textContent = `نصيحة ذكاء اصطناعي: ${txt}.`;
  }

  function renderTrends() {
    const counts = countPBT(state.history.slice(-20));
    els.trendsContent.innerHTML = `
      <div class="trend-item"><span>آخر 20 جولة — اللاعب</span><span class="trend-value">${counts.P}</span></div>
      <div class="trend-item"><span>آخر 20 جولة — المصرفي</span><span class="trend-value">${counts.B}</span></div>
      <div class="trend-item"><span>آخر 20 جولة — التعادل</span><span class="trend-value">${counts.T}</span></div>
    `;
  }

  function renderRecommendation(side, topPerc) {
    const sideTxt = side === 'P' ? 'اللاعب' : side === 'B' ? 'المصرفي' : 'التعادل';
    const box = `
      <div class="recommendation-box ${side}">
        <div>🔮 التوصية: <b>${sideTxt}</b></div>
        <div class="confidence-meter"><div class="confidence-bar" style="width:${Math.min(100, Math.max(0, topPerc))}%"></div><span>${Math.round(topPerc)}%</span></div>
      </div>
    `;
    els.recommendation.innerHTML = box;
  }

  function renderModelPerformance() {
    // قياس مبسط: نفترض أنك اتبعت أفضل احتمال — قارن بالنتائج الحقيقية (تجريبي)
    let correct = 0;
    for (let i = 0; i < state.history.length; i++) {
      const slice = state.history.slice(0, i);
      const probs = computeProbsOn(slice);
      const best = probs.P > probs.B ? (probs.P > probs.T ? 'P' : 'T') : (probs.B > probs.T ? 'B' : 'T');
      if (best === state.history[i]) correct++;
    }
    const acc = state.history.length ? Math.round(correct / state.history.length * 100) : 0;
    els.modelPerformance.innerHTML = `<p>دقة تقديرية للنموذج الحالي: <b>${acc}%</b></p>`;
  }

  function computeProbsOn(hist) {
    // نسخة من computeProbabilities لكن على مصفوفة ممرّرة
    const counts = countPBT(hist);
    const total = Math.max(1, counts.P + counts.B + counts.T);
    const base = { P: counts.P/total, B: counts.B/total, T: counts.T/total };
    const mk = computeMarkov(hist);
    const wBase = 0.6, wMk = 0.4;
    const probs = { P: wBase*base.P + wMk*mk.P, B: wBase*base.B + wMk*mk.B, T: wBase*base.T + wMk*mk.T };
    const sum = probs.P + probs.B + probs.T || 1;
    return { P: probs.P/sum, B: probs.B/sum, T: probs.T/sum };
  }

  /* ========== الرسم البياني ========== */
  function setupChart() {
    if (!els.statsChart) return;
    state.chart = new Chart(els.statsChart.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['P', 'B', 'T'],
        datasets: [{
          label: 'التكرارات',
          data: [0, 0, 0]
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, precision: 0 }
        }
      }
    });
  }

  function updateChart() {
    if (!state.chart) return;
    const c = countPBT(state.history);
    state.chart.data.datasets[0].data = [c.P, c.B, c.T];
    state.chart.update();
  }

  /* ========== ميزات مساعدة ========== */
  window.toggleTheme = function toggleTheme() {
    document.body.classList.toggle('light-mode');
    state.theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('bacc_theme', state.theme);
  };

  window.toggleAdvancedModel = function toggleAdvancedModel() {
    state.advancedModel = !state.advancedModel;
    localStorage.setItem('bacc_adv_model', state.advancedModel ? '1' : '0');
    els.modelStatus.textContent = state.advancedModel ? 'النموذج المتقدم (Boost streaks)' : 'النموذج الأساسي (ماركوف)';
    renderAll();
  };

  function showNotification(kind, msg) {
    const note = document.createElement('div');
    note.className = `notification ${kind}`;
    note.innerHTML = `<span class="notification-icon">${
      kind === 'win' ? '🏆' :
      kind === 'lose' ? '⚠️' :
      kind === 'tie' ? '🔔' :
      kind === 'error' ? '⛔' : 'ℹ️'
    }</span><span>${msg}</span><button class="close-notification" aria-label="close">✖</button>`;
    els.notifyContainer.appendChild(note);
    // دخول
    requestAnimationFrame(() => note.classList.add('show'));
    // إغلاق يدوي
    note.querySelector('.close-notification').onclick = () => note.remove();
    // إزالة تلقائية
    setTimeout(() => note.remove(), 4200);
  }

  function pulseEffect(side) {
    // تأثير بصري خفيف عند احتمالات عالية
    const ef = document.createElement('div');
    ef.className = `high-prob-effect ${
      side === 'P' ? 'high-prob-player' : side === 'B' ? 'high-prob-banker' : 'high-prob-tie'
    }`;
    els.effects.appendChild(ef);
    setTimeout(() => ef.remove(), 1800);
  }

  function runResultEffect(result) {
    const ef = document.createElement('div');
    ef.className = result === 'P' ? 'win-effect' : result === 'B' ? 'lose-effect' : 'tie-effect';
    els.effects.appendChild(ef);
    setTimeout(() => ef.remove(), 1800);
  }

  function patternBlock(name, desc, ok) {
    return `<div class="pattern-item">
      <div class="pattern-name">${name}</div>
      <div class="pattern-desc">${desc} — ${ok ? 'مُكتشف ✅' : 'غير ظاهر ❌'}</div>
    </div>`;
  }

  function countPBT(arr) {
    let P = 0, B = 0, T = 0;
    for (const v of arr) { if (v==='P') P++; else if (v==='B') B++; else if (v==='T') T++; }
    return { P, B, T };
  }

  function calcStreak(arr, side) {
    let s = 0;
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] === side) s++; else break;
    }
    return s;
  }

  function round2(x) {
    return Math.round((+x + Number.EPSILON) * 100) / 100;
  }

  function fmt(x) {
    return round2(x).toFixed(2);
  }

  function persist() {
    localStorage.setItem('bacc_history', JSON.stringify(state.history));
    localStorage.setItem('bacc_balance', String(state.balance));
    localStorage.setItem('bacc_bet',     JSON.stringify(state.bet));
    localStorage.setItem('bacc_stats',   JSON.stringify(state.stats));
  }

  /* ========== رندر شامل ========== */
  function renderAll() {
    updateBalanceUI();
    updateBetUI();
    updatePredictionUI();
    updateBigRoad();
    renderLast5();
    renderCasinoPatterns();
    renderDiamond();
    renderStats();
    renderAdvice();
    renderTrends();
    renderModelPerformance();
    updateChart();
    els.modelStatus.textContent = state.advancedModel ? 'النموذج المتقدم (Boost streaks)' : 'النموذج الأساسي (ماركوف)';
  }

  // انطلاق
  init();
})();

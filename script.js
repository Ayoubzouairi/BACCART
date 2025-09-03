(() => {
  // === State & Storage ===
  const STORAGE_KEY = "baccarat_predictor_v1";
  const DEFAULT_STATE = {
    lang: "ar",
    history: [],          // array of 'P' | 'B' | 'T'
    totals: { P: 0, B: 0, T: 0 },
    predictionsHistory: [], // predicted label before each round ['P'|'B'|'T']
    acc: { correct: 0, total: 0 }
  };

  function loadState() {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!s) return { ...DEFAULT_STATE };
      return {
        ...DEFAULT_STATE,
        ...s,
        totals: { ...DEFAULT_STATE.totals, ...(s.totals || {}) },
        acc: { ...DEFAULT_STATE.acc, ...(s.acc || {}) }
      };
    } catch {
      return { ...DEFAULT_STATE };
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  let state = loadState();

  // === I18N ===
  const T = {
    en: {
      title: "Baccarat Predictor",
      subtitle: "Simple stats-based suggestion",
      language: "Language",
      nextSuggestion: "Next Suggestion",
      addRound: "Add Round Result",
      player: "Player",
      banker: "Banker",
      tie: "Tie",
      undo: "Undo",
      reset: "Reset",
      stats: "Statistics",
      totalRounds: "Total rounds",
      playerWins: "Player wins",
      bankerWins: "Banker wins",
      ties: "Ties",
      accuracy: "Prediction accuracy",
      last5: "Last 5 rounds",
      footer: "All data is stored locally in your browser (no server).",
      hint: "Based on a blend of last 5 rounds and overall stats. This is not financial or gambling advice.",
      predicted: "Predicted",
    },
    ar: {
      title: "Baccarat Predictor",
      subtitle: "اقتراح بسيط مبني على الإحصائيات",
      language: "اللغة",
      nextSuggestion: "التوقع القادم",
      addRound: "إضافة نتيجة الجولة",
      player: "اللاعب",
      banker: "البانكر",
      tie: "تعادل",
      undo: "تراجع",
      reset: "إعادة تعيين",
      stats: "الإحصائيات",
      totalRounds: "مجموع الجولات",
      playerWins: "انتصارات اللاعب",
      bankerWins: "انتصارات البانكر",
      ties: "تعادلات",
      accuracy: "دقة التوقع",
      last5: "آخر 5 جولات",
      footer: "جميع البيانات تُخزن محليًا في متصفحك (بدون خادم).",
      hint: "التوقع مبني على مزيج من آخر 5 جولات والإحصائيات العامة. هذا ليس نصيحة مالية أو قمار.",
      predicted: "التوقع",
    }
  };

  // === Elements ===
  const el = (id) => document.getElementById(id);
  const appTitle = el("appTitle");
  const appSubtitle = el("appSubtitle");
  const langLabel = el("langLabel");
  const langSelect = el("lang");

  const predTitle = el("predTitle");
  const predLabel = el("predLabel");
  const predPercent = el("predPercent");
  const barPLabel = el("barPLabel");
  const barBLabel = el("barBLabel");
  const barTLabel = el("barTLabel");
  const barP = el("barP");
  const barB = el("barB");
  const barT = el("barT");
  const barPVal = el("barPVal");
  const barBVal = el("barBVal");
  const barTVal = el("barTVal");
  const predHint = el("predHint");

  const addResTitle = el("addResTitle");
  const btnP = el("btnP");
  const btnB = el("btnB");
  const btnT = el("btnT");
  const btnUndo = el("btnUndo");
  const btnReset = el("btnReset");

  const statsTitle = el("statsTitle");
  const totalRoundsLabel = el("totalRoundsLabel");
  const playerWinsLabel = el("playerWinsLabel");
  const bankerWinsLabel = el("bankerWinsLabel");
  const tieCountLabel = el("tieCountLabel");
  const accLabel = el("accLabel");
  const totalRounds = el("totalRounds");
  const playerWins = el("playerWins");
  const bankerWins = el("bankerWins");
  const tieCount = el("tieCount");
  const accValue = el("accValue");

  const recentTitle = el("recentTitle");
  const recentList = el("recentList");

  // === Helpers ===
  const toPct = (x) => Math.round(x * 100);
  function sum(obj) { return Object.values(obj).reduce((a,b)=>a+b,0); }
  function clamp01(x){ return Math.max(0, Math.min(1, x)); }

  function getLastN(arr, n){ return arr.slice(-n); }

  // Compute probabilities as blend of (last5 with Laplace) and (overall with Laplace)
  function computeProbabilities() {
    const last = getLastN(state.history, 5);
    const lastCounts = { P: 0, B: 0, T: 0 };
    last.forEach(x => lastCounts[x]++);
    const n = last.length;

    const alpha = 1; // Laplace smoothing
    const k = 3;

    // Posteriors
    const lastPost = {
      P: (lastCounts.P + alpha) / (n + k*alpha),
      B: (lastCounts.B + alpha) / (n + k*alpha),
      T: (lastCounts.T + alpha) / (n + k*alpha),
    };

    const tot = state.totals;
    const N = sum(tot);
    const overallPost = {
      P: (tot.P + alpha) / (N + k*alpha),
      B: (tot.B + alpha) / (N + k*alpha),
      T: (tot.T + alpha) / (N + k*alpha),
    };

    // Weight: as we get at least 3 last rounds, trust last5 more
    const wLast = (n >= 3) ? 0.7 : 0.5;
    const wOverall = 1 - wLast;

    let pP = wLast * lastPost.P + wOverall * overallPost.P;
    let pB = wLast * lastPost.B + wOverall * overallPost.B;
    let pT = wLast * lastPost.T + wOverall * overallPost.T;

    // Normalize
    const s = pP + pB + pT;
    pP /= s; pB /= s; pT /= s;

    return { P: pP, B: pB, T: pT };
  }

  function argmaxProb(probs) {
    let best = 'P', bestVal = probs.P;
    if (probs.B > bestVal) { best = 'B'; bestVal = probs.B; }
    if (probs.T > bestVal) { best = 'T'; bestVal = probs.T; }
    return best;
  }

  function labelOf(x) {
    if (x === 'P') return T[state.lang].player;
    if (x === 'B') return T[state.lang].banker;
    return T[state.lang].tie;
  }

  // === UI Update ===
  function updateI18N() {
    const dict = T[state.lang];
    document.body.classList.toggle("rtl", state.lang === "ar");

    appTitle.textContent = dict.title;
    appSubtitle.textContent = dict.subtitle;
    langLabel.textContent = dict.language;
    predTitle.textContent = dict.nextSuggestion;
    addResTitle.textContent = dict.addRound;
    btnP.textContent = dict.player;
    btnB.textContent = dict.banker;
    btnT.textContent = dict.tie;
    btnUndo.textContent = dict.undo;
    btnReset.textContent = dict.reset;
    statsTitle.textContent = dict.stats;
    totalRoundsLabel.textContent = dict.totalRounds;
    playerWinsLabel.textContent = dict.playerWins;
    bankerWinsLabel.textContent = dict.bankerWins;
    tieCountLabel.textContent = dict.ties;
    accLabel.textContent = dict.accuracy;
    recentTitle.textContent = dict.last5;
    predHint.textContent = dict.hint;

    // bars
    barPLabel.textContent = dict.player;
    barBLabel.textContent = dict.banker;
    barTLabel.textContent = dict.tie;
  }

  function updateStatsUI() {
    totalRounds.textContent = sum(state.totals);
    playerWins.textContent = state.totals.P;
    bankerWins.textContent = state.totals.B;
    tieCount.textContent = state.totals.T;
    const accPct = (state.acc.total === 0) ? 0 : Math.round(100 * state.acc.correct / state.acc.total);
    accValue.textContent = `${state.acc.correct}/${state.acc.total} (${accPct}%)`;

    recentList.innerHTML = "";
    const last = getLastN(state.history, 5);
    last.forEach(x => {
      const div = document.createElement('div');
      div.className = "chip " + (x==='P'?'p':x==='B'?'b':'t');
      div.textContent = labelOf(x);
      recentList.appendChild(div);
    });
  }

  function updatePredictionUI() {
    const probs = computeProbabilities();
    const best = argmaxProb(probs);
    const pct = toPct(probs[best]);

    predLabel.textContent = `${T[state.lang].predicted}: ${labelOf(best)}`;
    predLabel.classList.remove("player-color","banker-color","tie-color");
    if (best==='P') predLabel.classList.add("player-color");
    if (best==='B') predLabel.classList.add("banker-color");
    if (best==='T') predLabel.classList.add("tie-color");

    predPercent.textContent = `${pct}%`;

    const p = toPct(probs.P), b = toPct(probs.B), t = toPct(probs.T);
    barP.style.width = p + "%"; barPVal.textContent = p + "%";
    barB.style.width = b + "%"; barBVal.textContent = b + "%";
    barT.style.width = t + "%"; barTVal.textContent = t + "%";

    return best; // current best suggestion
  }

  // === Actions ===
  function addResult(resultTag /* 'P'|'B'|'T' */) {
    // 1) what was the suggestion BEFORE this round? count it
    const probs = computeProbabilities();
    const suggested = argmaxProb(probs);
    state.predictionsHistory.push(suggested);
    state.acc.total += 1;
    if (suggested === resultTag) state.acc.correct += 1;

    // 2) apply round result
    state.history.push(resultTag);
    state.totals[resultTag] += 1;
    saveState();

    // 3) refresh
    updateStatsUI();
    updatePredictionUI();
  }

  function undoLast() {
    if (state.history.length === 0) return;
    const lastResult = state.history.pop();
    state.totals[lastResult] = Math.max(0, state.totals[lastResult] - 1);

    // Also remove last prediction outcome (it corresponds to this round)
    if (state.predictionsHistory.length > 0) {
      const prevPred = state.predictionsHistory.pop();
      // Rebuild accuracy safely: recompute from scratch to avoid drift
      let correct = 0, total = 0;
      for (let i=0; i<state.predictionsHistory.length; i++) {
        total += 1;
        if (state.predictionsHistory[i] === state.history[i]) correct += 1;
      }
      state.acc.correct = correct;
      state.acc.total = total;
    } else {
      state.acc.correct = 0;
      state.acc.total = 0;
    }

    saveState();
    updateStatsUI();
    updatePredictionUI();
  }

  function resetAll() {
    if (!confirm(state.lang === 'ar' ? 'هل تريد فعلاً إعادة التعيين بالكامل؟' : 'Reset everything?')) return;
    state = { ...DEFAULT_STATE, lang: state.lang };
    saveState();
    updateStatsUI();
    updateI18N();
    updatePredictionUI();
  }

  // === Event Listeners ===
  btnP.addEventListener("click", () => addResult('P'));
  btnB.addEventListener("click", () => addResult('B'));
  btnT.addEventListener("click", () => addResult('T'));
  btnUndo.addEventListener("click", undoLast);
  btnReset.addEventListener("click", resetAll);

  langSelect.addEventListener("change", e => {
    state.lang = e.target.value;
    saveState();
    updateI18N();
    updateStatsUI();
    updatePredictionUI();
  });

  // === Init ===
  // If first time, set default language to Arabic for convenience
  if (!localStorage.getItem(STORAGE_KEY)) {
    state.lang = "ar";
    saveState();
  } else {
    // keep selected in UI
    langSelect.value = state.lang;
  }

  updateI18N();
  updateStatsUI();
  updatePredictionUI();
})();
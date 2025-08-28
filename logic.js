/* ==========================================================================
   BACCARAT PRO — AI Pattern Detection + Betting + Performance
   Author: ChatGPT (GPT-5 Thinking)
   ========================================================================== */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const state = {
    history: [],            // actual results: 'P','B','T'
    predList: [],           // prediction-before-each-round
    useAdvanced: false,
    chart: null,

    // Betting
    baseBalance: 10000,
    balance: 10000,
    wins: 0,
    losses: 0,
    pushes: 0,
  };

  const LANG = {
    "ar-MA": {
      model_basic: "النموذج الأساسي (ماركوف)",
      model_adv: "النموذج المتقدم (أوزان الأنماط)",
      advice_header: "نصيحة الذكاء الاصطناعي",
      rec_play: "التوصية: راه كايميل لـ",
      player: "اللاعب",
      banker: "المصرفي",
      tie: "تعادل",
      confidence: "الثقة",
      streak: "سلسلة",
      pingpong: "Ping-Pong",
      double: "Double Pattern",
      bias: "انحياز",
      last5: "تحليل آخر 5 جولات",
      trends: "اتجاهات",
      warning: "⚠️ باكارا لعبة حظ، ما كاين حتى ضمان للربح. لعب بعقلانية.",
      diamond: "تحليل نمط الدايموند",
      performance: "تحليل أداء النماذج",
      acc_inc: "الدقة (شاملة التعادلات)",
      acc_exc: "الدقة (بدون تعادلات)",
      precision: "Precision",
      recall: "Recall",
      f1: "F1",
      predicted: "متوقَّع",
      actual: "فعلي",
    },
    "en-US": {
      model_basic: "Basic model (Markov)",
      model_adv: "Advanced model (Pattern-weighted)",
      advice_header: "AI Advice",
      rec_play: "Recommendation: leaning to",
      player: "Player",
      banker: "Banker",
      tie: "Tie",
      confidence: "Confidence",
      streak: "Streak",
      pingpong: "Ping-Pong",
      double: "Double Pattern",
      bias: "Bias",
      last5: "Last 5 Analysis",
      trends: "Trends",
      warning: "⚠️ Baccarat is a game of chance. No profit is guaranteed. Play responsibly.",
      diamond: "Diamond Pattern Analysis",
      performance: "Model Performance",
      acc_inc: "Accuracy (incl. ties)",
      acc_exc: "Accuracy (excl. ties)",
      precision: "Precision",
      recall: "Recall",
      f1: "F1",
      predicted: "Predicted",
      actual: "Actual",
    }
  };

  function getLang() {
    const el = $("langSelect");
    return el ? el.value : "ar-MA";
  }
  function t(key) {
    const l = getLang();
    return (LANG[l] && LANG[l][key]) || LANG["ar-MA"][key] || key;
  }

  // UI Glue
  window.toggleTheme = function toggleTheme() {
    document.body.classList.toggle("light-mode");
  };
  window.toggleAdvancedModel = function toggleAdvancedModel() {
    state.useAdvanced = !state.useAdvanced;
    const status = $("modelStatus");
    if (status) status.textContent = state.useAdvanced ? t("model_adv") : t("model_basic");
    renderAll();
  };

  // Helpers
  function argmaxKey(probs) { return ["P","B","T"].sort((a,b) => probs[b] - probs[a])[0]; }
  function normalize(scores) {
    const sum = scores.P + scores.B + scores.T;
    const out = {
      P: +(100 * scores.P / sum).toFixed(1),
      B: +(100 * scores.B / sum).toFixed(1),
      T: +(100 * scores.T / sum).toFixed(1),
    };
    const drift = +(100 - (out.P + out.B + out.T)).toFixed(1);
    if (Math.abs(drift) >= 0.1) out[argmaxKey(out)] = +(out[argmaxKey(out)] + drift).toFixed(1);
    return out;
  }
  function lastNonTie(history) {
    for (let i = history.length - 1; i >= 0; i--) if (history[i] !== "T") return history[i];
    return null;
  }
  function other(x){ return x === "P" ? "B" : "P"; }

  function markovProbs(history, depth = 14) {
    if (history.length === 0) return { P: 1/3, B: 1/3, T: 1/3 };
    const trans = { P:{P:1,B:1,T:1}, B:{P:1,B:1,T:1}, T:{P:1,B:1,T:1} };
    const start = Math.max(1, history.length - depth);
    for (let i = start; i < history.length; i++) {
      trans[history[i-1]][history[i]]++;
    }
    const last = history[history.length - 1];
    const tot = trans[last].P + trans[last].B + trans[last].T;
    return { P: trans[last].P/tot, B: trans[last].B/tot, T: trans[last].T/tot };
  }
  function patternWeights(history) {
    const w = { P: 1, B: 1, T: 0.6 };
    const n = history.length;
    if (n < 3) return w;
    const last = lastNonTie(history);
    if (last) {
      let streak = 0;
      for (let i = history.length - 1; i >= 0; i--) {
        if (history[i] === "T") continue;
        if (history[i] === last) streak++; else break;
      }
      if (streak >= 3) {
        w[last] += 0.25 + 0.05 * Math.min(4, (streak - 3));
        w[other(last)] = Math.max(0.05, w[other(last)] - 0.05 * Math.min(4, (streak - 3)));
      }
    }
    const noT = history.filter(x => x !== "T");
    if (noT.length >= 4) {
      const last4 = noT.slice(-4);
      const isAlt = last4[0] !== last4[1] && last4[0] === last4[2] && last4[1] === last4[3];
      if (isAlt) {
        const next = last4[last4.length-1] === "P" ? "B" : "P";
        w[next] += 0.2;
      }
    }
    if (noT.length >= 6) {
      const last6 = noT.slice(-6);
      const a = last6.slice(0,2), b = last6.slice(2,4), c = last6.slice(4,6);
      const block = (x,y) => x[0]===x[1] && y[0]===y[1] && x[0]!==y[0];
      if (block(a,b) && block(b,c)) {
        const next = c[1] === "P" ? "B" : "P";
        w[next] += 0.15;
      }
    }
    if (noT.length >= 6) {
      let chops = 0, streaks = 0;
      for (let i = 1; i < noT.length; i++) { if (noT[i] === noT[i-1]) streaks++; else chops++; }
      if (chops - streaks >= 3) { const lastSide = noT[noT.length-1]; w[other(lastSide)] += 0.1; }
      else if (streaks - chops >= 3) { const lastSide = noT[noT.length-1]; w[lastSide] += 0.1; }
    }
    const ties = history.slice(-6).filter(x => x==="T").length;
    if (ties >= 2) w.T += 0.1 * (ties - 1);
    w.P = Math.max(0.05, w.P);
    w.B = Math.max(0.05, w.B);
    w.T = Math.max(0.02, w.T);
    return w;
  }
  function blendedProbs(history) {
    const base = markovProbs(history);
    const w = patternWeights(history);
    const exp = state.useAdvanced ? 1.15 : 1.0;
    const scores = {
      P: Math.pow(base.P * w.P, exp),
      B: Math.pow(base.B * w.B, exp),
      T: Math.pow(base.T * w.T, exp),
    };
    return normalize(scores);
  }

  // Betting helpers
  function getBetAmount() {
    const el = $("betAmount");
    let v = el ? parseInt(el.value, 10) : 100;
    if (!Number.isFinite(v) || v <= 0) v = 100;
    return v;
  }
  function getBetSide(probsBefore) {
    const sel = $("betSideSelect");
    if (!sel) return "AI";
    const val = sel.value;
    if (val === "AI") return argmaxKey(probsBefore);
    return val; // "P"|"B"|"T"
  }
  function showToast(msg, type="push") {
    const root = $("toast"); if (!root) return;
    const div = document.createElement("div");
    div.className = "toast " + (type==="win" ? "toast-win" : type==="loss" ? "toast-loss" : "toast-push");
    div.textContent = msg;
    root.appendChild(div);
    setTimeout(() => { if (div && div.parentNode) div.parentNode.removeChild(div); }, 2000);
  }
  function formatInt(n) {
    try { return n.toLocaleString(); } catch { return String(n); }
  }
  function renderWallet() {
    const pnl = state.balance - state.baseBalance;
    const b = $("balanceVal"), p = $("pnlVal"), w = $("winsVal"), l = $("lossesVal"), u = $("pushesVal");
    if (b) b.textContent = formatInt(Math.round(state.balance));
    if (p) p.textContent = (pnl >= 0 ? "+" : "") + formatInt(Math.round(pnl));
    if (w) w.textContent = state.wins;
    if (l) l.textContent = state.losses;
    if (u) u.textContent = state.pushes;
  }

  // Add a result: prediction + bet BEFORE adding actual
  window.addResult = function addResult(r) {
    if (!["P","B","T"].includes(r)) return;

    // 1) Prediction BEFORE the round (for perf metrics)
    const probsBefore = blendedProbs(state.history);
    const pred = argmaxKey(probsBefore);
    state.predList.push(pred);

    // 2) Betting settlement
    const betSide = getBetSide(probsBefore);
    const amount = getBetAmount();
    let delta = 0;
    if (betSide === "P") {
      if (r === "P") { delta = amount * 1.0; state.wins++; showToast(`✅ فوز Player: +${formatInt(Math.round(delta))}`, "win"); }
      else if (r === "T") { delta = 0; state.pushes++; showToast(`➖ Push (تعادل)`, "push"); }
      else { delta = -amount; state.losses++; showToast(`❌ خسارة Player: ${formatInt(Math.round(delta))}`, "loss"); }
    } else if (betSide === "B") {
      if (r === "B") { delta = amount * 0.95; state.wins++; showToast(`✅ فوز Banker: +${formatInt(Math.round(delta))}`, "win"); }
      else if (r === "T") { delta = 0; state.pushes++; showToast(`➖ Push (تعادل)`, "push"); }
      else { delta = -amount; state.losses++; showToast(`❌ خسارة Banker: ${formatInt(Math.round(delta))}`, "loss"); }
    } else if (betSide === "T") {
      if (r === "T") { delta = amount * 8.0; state.wins++; showToast(`✅ فوز Tie: +${formatInt(Math.round(delta))}`, "win"); }
      else { delta = -amount; state.losses++; showToast(`❌ خسارة Tie: ${formatInt(Math.round(delta))}`, "loss"); }
    }

    state.balance += delta;

    // 3) Now append actual result + re-render
    state.history.push(r);
    renderAll();
  };

  window.resetData = function resetData() {
    state.history = [];
    state.predList = [];
    state.wins = 0; state.losses = 0; state.pushes = 0;
    state.balance = state.baseBalance;
    if (state.chart) {
      state.chart.data.labels = [];
      state.chart.data.datasets.forEach(d => d.data = []);
      state.chart.update();
    }
    renderAll();
  };

  // Rendering
  function renderAll() {
    const probs = blendedProbs(state.history);
    renderWallet();
    renderPredictionBars(probs);
    renderAIAdvice(probs);
    renderStats();
    renderHistory();
    renderTrends();
    renderLast5();
    renderBigRoad();
    renderDerivedRoads();
    renderAdvancedBox();
    renderDiamond();
    renderPerformanceReport();
    updateChart();
  }

  function setBar(which, pct) {
    const bar = document.querySelector(`.prediction-bar.${which}-bar`);
    if (bar) bar.style.width = `${Math.max(1, pct)}%`;
  }
  function renderPredictionBars(probs) {
    const playerProb = $("playerProb");
    const bankerProb = $("bankerProb");
    const tieProb = $("tieProb");
    setBar("player", probs.P);
    setBar("banker", probs.B);
    setBar("tie", probs.T);
    if (playerProb) playerProb.textContent = `${probs.P}%`;
    if (bankerProb) bankerProb.textContent = `${probs.B}%`;
    if (tieProb) tieProb.textContent = `${probs.T}%`;
    [playerProb, bankerProb, tieProb].forEach((el) => { if (!el) return; const val = parseFloat(el.textContent); el.classList.toggle("high", val >= 55); });
    const topKey = argmaxKey(probs);
    applyHighProbEffect(topKey, probs[topKey]);
  }
  function applyHighProbEffect(key, pct) {
    const container = $("effects-container");
    if (!container) return;
    container.innerHTML = "";
    if (pct < 60) return;
    const eff = document.createElement("div");
    eff.className = "high-prob-effect " + (key === "P" ? "high-prob-player" : key === "B" ? "high-prob-banker" : "high-prob-tie");
    container.appendChild(eff);
    setTimeout(() => { if (eff && eff.parentNode) eff.parentNode.removeChild(eff); }, 1900);
  }

  function renderAIAdvice(probs) {
    const el = $("aiAdvice"); if (!el) return;
    const top = argmaxKey(probs);
    const names = { P: t("player"), B: t("banker"), T: t("tie") };
    el.innerHTML = `
      <div class="prediction-title">🤖 ${t("advice_header")}</div>
      <p>${t("rec_play")} <b class="${top === "P" ? "player-text" : top === "B" ? "banker-text" : "tie-text"}">${names[top]}</b></p>
      <div class="recommendation-box ${top}">
        <div>${t("confidence")}: <b>${["P","B","T"].map(k => `${k}:${(probs[k]).toFixed(1)}%`).join(" · ")}</b></div>
        <div class="confidence-meter"><div class="confidence-bar" style="width:${probs[top]}%"></div><span>${probs[top].toFixed(1)}%</span></div>
      </div>
      <p style="margin-top:8px;font-size:.95em;opacity:.9">${t("warning")}</p>
    `;
  }

  function renderStats() {
    const el = $("aiStats"); if (!el) return;
    const total = state.history.length;
    const p = state.history.filter(x => x === "P").length;
    const b = state.history.filter(x => x === "B").length;
    const ti = state.history.filter(x => x === "T").length;
    el.innerHTML = `
      <div><b>الجولات:</b> ${total}</div>
      <div>🔵 P: ${p} | 🔴 B: ${b} | 🟢 T: ${ti}</div>
    `;
    const statsResult = $("statsResult");
    if (statsResult) {
      const pctP = total ? ((100 * p) / total).toFixed(1) : 0;
      const pctB = total ? ((100 * b) / total).toFixed(1) : 0;
      const pctT = total ? ((100 * ti) / total).toFixed(1) : 0;
      statsResult.innerHTML = `
        <div class="prediction-title">📈 نسب كلية</div>
        <div>P: ${pctP}% · B: ${pctB}% · T: ${pctT}%</div>
      `;
    }
  }
  function renderHistory() {
    const el = $("historyDisplay"); if (!el) return;
    const chip = (x) => `<span class="prediction-value ${x==="P"?"prediction-player":x==="B"?"prediction-banker":"prediction-tie"}">${x}</span>`;
    el.innerHTML = state.history.length ? state.history.map(chip).join(" ") : "لا تاريخ بعد.";
  }
  function renderTrends() {
    const el = $("trendsContent"); if (!el) return;
    const lastN = (n) => state.history.slice(-n);
    const L10 = lastN(10), L20 = lastN(20);
    const cnt = (arr, s) => arr.filter(x => x === s).length;
    const mk = (arr) => `
      <div class="trend-item"><span>🔵 P</span><span class="trend-value">${cnt(arr,"P")}</span></div>
      <div class="trend-item"><span>🔴 B</span><span class="trend-value">${cnt(arr,"B")}</span></div>
      <div class="trend-item"><span>🟢 T</span><span class="trend-value">${cnt(arr,"T")}</span></div>
    `;
    el.innerHTML = `
      <div class="prediction-title">📊 ${t("trends")} (10)</div>${mk(L10)}
      <div class="prediction-title" style="margin-top:10px">📊 ${t("trends")} (20)</div>${mk(L20)}
    `;
  }
  function renderLast5() {
    const el = $("last5Results"); if (!el) return;
    const last5 = state.history.slice(-5);
    const cell = (x) => `<div class="last5-cell ${x==="P"?"last5-P":x==="B"?"last5-B":"last5-T"}">${x||"—"}</div>`;
    el.innerHTML = `<div class="last5-grid">${[...Array(5)].map((_,i)=>cell(last5[i]||"")).join("")}</div>`;
  }

  // Big Road & derived roads
  function buildBigRoad(history) {
    const grid = [];
    let col = -1, row = 0, lastColor = null;
    for (let i = 0; i < history.length; i++) {
      const r = history[i];
      if (r === "T") {
        if (col >= 0 && grid[col][row]) grid[col][row] = (grid[col][row] || "") + "T";
        continue;
      }
      const color = r;
      if (color !== lastColor) { col++; row = 0; grid[col] = grid[col] || []; lastColor = color; }
      else {
        if (row >= 5 || (grid[col] && grid[col][row + 1])) { col++; row = 0; grid[col] = grid[col] || []; }
        else { row++; }
      }
      grid[col][row] = color;
    }
    return grid;
  }
  function renderBigRoad() {
    const el = $("bigRoad"); if (!el) return;
    const grid = buildBigRoad(state.history);
    el.innerHTML = "";
    grid.forEach((column) => {
      for (let r = 0; r < 6; r++) {
        const val = column && column[r] ? column[r] : null;
        if (!val) continue;
        const div = document.createElement("div");
        div.className = "big-road-cell " + (val[0] === "P" ? "big-road-P" : "big-road-B");
        div.textContent = val.includes("T") ? (val[0] + "·T") : val[0];
        el.appendChild(div);
      }
    });
  }
  function chunkAsGrid(seq, rows = 6) {
    const grid = []; let col = -1, row = 0, last = null;
    seq.forEach((x) => {
      if (x !== last) { col++; row = 0; grid[col] = grid[col] || []; last = x; }
      else {
        if (row >= rows - 1 || (grid[col] && grid[col][row + 1])) { col++; row = 0; grid[col] = grid[col] || []; }
        else { row++; }
      }
      grid[col][row] = x;
    });
    return grid;
  }
  function buildDerivedRoads(history) {
    const noT = history.filter(x => x !== "T");
    const sig = [];
    for (let i = 1; i < noT.length; i++) sig.push(noT[i] === noT[i - 1] ? "B" : "P");
    const roads = [sig, sig.slice(1), sig.slice(2)];
    return roads.map(seq => chunkAsGrid(seq, 6));
  }
  function renderDerivedRoads() {
    const el1 = $("bigEyeRoad"), el2 = $("smallRoad"), el3 = $("cockroachRoad");
    if (!el1 || !el2 || !el3) return;
    const [r1, r2, r3] = buildDerivedRoads(state.history);
    const render = (el, grid) => {
      el.innerHTML = "";
      grid.forEach(col => {
        for (let r = 0; r < 6; r++) {
          const v = col && col[r]; if (!v) continue;
          const d = document.createElement("div");
          d.className = "road-cell " + (v === "P" ? "road-P" : "road-B");
          el.appendChild(d);
        }
      });
    };
    render(el1, r1); render(el2, r2); render(el3, r3);
  }

  function renderAdvancedBox() {
    const el = $("advancedPredictionResults"); if (!el) return;
    const h = state.history;
    const w = patternWeights(h);
    const base = markovProbs(h);
    const blend = blendedProbs(h);
    const fmt = (o) => `P:${(o.P*100||o.P).toFixed ? (o.P*100).toFixed(1)+'%' : o.P+'%'} · B:${(o.B*100||o.B).toFixed ? (o.B*100).toFixed(1)+'%' : o.B+'%'} · T:${(o.T*100||o.T).toFixed ? (o.T*100).toFixed(1)+'%' : o.T+'%'}`;
    el.innerHTML = `
      <div class="model-performance">
        <p><b>Markov:</b> ${fmt(base)}</p>
        <p><b>Weights:</b> P:${w.P.toFixed(2)} · B:${w.B.toFixed(2)} · T:${w.T.toFixed(2)}</p>
        <p><b>Blend:</b> P:${blend.P}% · B:${blend.B}% · T:${blend.T}%</p>
      </div>
    `;
  }
  function renderDiamond() {
    const el = $("diamondAnalysis"); if (!el) return;
    const noT = state.history.filter(x => x !== "T");
    if (noT.length < 4) { el.innerHTML = "<p>Need ≥ 4 (non-T) rounds for diamond check.</p>"; return; }
    const last4 = noT.slice(-4);
    const balanced = last4[0] === last4[3] && last4[1] === last4[2];
    let text;
    if (balanced) text = "⚖️ توازن تناظري (diamond) — ميول ضعيف للجولة الجاية.";
    else {
      const lean = last4[3];
      text = `💠 ميول دايموند بسيط نحو ${lean}.`;
    }
    el.innerHTML = `<div class="diamond-result"><p>${text}</p></div>`;
  }

  // --- Performance Report ---
  function renderPerformanceReport() {
    const el = $("perfReport"); if (!el) return;
    const labels = ["P","B","T"];
    const M = { P:{P:0,B:0,T:0}, B:{P:0,B:0,T:0}, T:{P:0,B:0,T:0} };
    const N = Math.min(state.predList.length, state.history.length);
    for (let i = 0; i < N; i++) {
      const pred = state.predList[i], act = state.history[i];
      if (!labels.includes(pred) || !labels.includes(act)) continue;
      M[pred][act]++;
    }
    const total = N;
    const correctInc = labels.reduce((s, k) => s + M[k][k], 0);
    const accInc = total ? (100 * correctInc / total).toFixed(1) : "—";

    let correctExc = 0, totalExc = 0;
    for (let i = 0; i < N; i++) {
      const pred = state.predList[i], act = state.history[i];
      if (act === "T") continue;
      totalExc++;
      if (pred === act) correctExc++;
    }
    const accExc = totalExc ? (100 * correctExc / totalExc).toFixed(1) : "—";

    const metrics = {};
    labels.forEach(lbl => {
      const TP = M[lbl][lbl];
      const FP = labels.reduce((s, k) => s + (k === lbl ? 0 : M[lbl][k]), 0);
      const FN = labels.reduce((s, k) => s + (k === lbl ? 0 : M[k][lbl]), 0);
      const precision = (TP + FP) ? (TP / (TP + FP)) : 0;
      const recall = (TP + FN) ? (TP / (TP + FN)) : 0;
      const f1 = (precision + recall) ? (2 * precision * recall / (precision + recall)) : 0;
      metrics[lbl] = {
        precision: (precision * 100).toFixed(1),
        recall: (recall * 100).toFixed(1),
        f1: (f1 * 100).toFixed(1),
      };
    });

    const head = `
      <tr>
        <th>${t("predicted")} \\ ${t("actual")}</th>
        <th>P</th><th>B</th><th>T</th>
      </tr>`;
    const rows = labels.map(pr => `
      <tr>
        <th>${pr}</th>
        <td>${M[pr]["P"]}</td>
        <td>${M[pr]["B"]}</td>
        <td>${M[pr]["T"]}</td>
      </tr>`).join("");

    el.innerHTML = `
      <div class="metrics">
        <div class="metric"><div>${t("acc_inc")}</div><b>${accInc}%</b><div style="opacity:.75">N=${total}</div></div>
        <div class="metric"><div>${t("acc_exc")}</div><b>${accExc}%</b><div style="opacity:.75">N=${totalExc}</div></div>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead>${head}</thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="metrics">
        <div class="metric"><div>P — ${t("precision")} / ${t("recall")} / ${t("f1")}</div><b>${metrics.P.precision}% / ${metrics.P.recall}% / ${metrics.P.f1}%</b></div>
        <div class="metric"><div>B — ${t("precision")} / ${t("recall")} / ${t("f1")}</div><b>${metrics.B.precision}% / ${metrics.B.recall}% / ${metrics.B.f1}%</b></div>
        <div class="metric"><div>T — ${t("precision")} / ${t("recall")} / ${t("f1")}</div><b>${metrics.T.precision}% / ${metrics.T.recall}% / ${metrics.T.f1}%</b></div>
      </div>
    `;
  }

  // Chart.js cumulative counts
  function ensureChart() {
    const ctx = $("statsChart");
    if (!ctx || !window.Chart) return null;
    if (state.chart) return state.chart;
    state.chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          { label: "P", data: [], borderWidth: 2, tension: .25 },
          { label: "B", data: [], borderWidth: 2, tension: .25 },
          { label: "T", data: [], borderWidth: 2, tension: .25 },
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: { x: { display: true }, y: { display: true, beginAtZero: true } }
      }
    });
    return state.chart;
  }
  function cumulativeCounts(arr, sym) {
    const out = []; let c = 0;
    for (let i = 0; i < arr.length; i++) { if (arr[i] === sym) c++; out.push(c); }
    return out;
  }
  function updateChart() {
    const ch = ensureChart(); if (!ch) return;
    const n = state.history.length;
    ch.data.labels = Array.from({ length: n }, (_, i) => i + 1);
    ch.data.datasets[0].data = cumulativeCounts(state.history, "P");
    ch.data.datasets[1].data = cumulativeCounts(state.history, "B");
    ch.data.datasets[2].data = cumulativeCounts(state.history, "T");
    ch.update();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const lang = $("langSelect"); if (lang) lang.addEventListener("change", renderAll);
    const status = $("modelStatus"); if (status) status.textContent = state.useAdvanced ? t("model_adv") : t("model_basic");
    renderAll();
  });
})();
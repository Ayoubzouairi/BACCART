
/* ==========================================================================
   BACCARAT PRO — AI Pattern Detection (Darija + English)
   Author: ChatGPT (GPT‑5 Thinking)
   --------------------------------------------------------------------------
   ✔ Detects common patterns: Streak, Ping‑Pong, Double Pattern, Bias
   ✔ Markov-chain base probabilities with Laplace smoothing
   ✔ Optional "Advanced" weighting model
   ✔ Big Road + simplified derived roads (visual)
   ✔ Last 5 analysis, trends, recommendations
   ✔ Chart.js live stats
   ✔ Light/Dark theme & basic i18n (ar-MA/en-US)
   ⚠ Disclaimer: Baccarat is a chance game. No guarantees of profit.
   ========================================================================== */

(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const state = {
    history: [],          // Sequence of results: 'P', 'B', 'T'
    useAdvanced: false,   // Toggle for the advanced weighting model
    chart: null,          // Chart.js instance
    recHistory: [],       // Log of previous recommendations
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
      patterns: "الأنماط الشائعة في الكازينو",
      performance: "تحليل أداء النماذج",
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
      patterns: "Common Casino Patterns",
      performance: "Model Performance",
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

  // ---------------------------------------------------------------------------
  // UI Glue
  // ---------------------------------------------------------------------------
  window.toggleTheme = function toggleTheme() {
    document.body.classList.toggle("light-mode");
  };

  window.toggleAdvancedModel = function toggleAdvancedModel() {
    state.useAdvanced = !state.useAdvanced;
    const status = $("modelStatus");
    if (status) status.textContent = state.useAdvanced ? t("model_adv") : t("model_basic");
    renderAdvancedBox();
    renderAll();
  };

  window.addResult = function addResult(r) {
    if (!["P", "B", "T"].includes(r)) return;
    state.history.push(r);
    renderAll();
  };

  window.resetData = function resetData() {
    state.history = [];
    state.recHistory = [];
    if (state.chart) {
      state.chart.data.labels = [];
      state.chart.data.datasets.forEach(d => d.data = []);
      state.chart.update();
    }
    renderAll();
  };

  function applyLanguage() {
    // Update labels that are dynamic
    const status = $("modelStatus");
    if (status) status.textContent = state.useAdvanced ? t("model_adv") : t("model_basic");
    // (Other static Arabic strings are baked in HTML; optional to translate here)
    renderAll();
  }

  // ---------------------------------------------------------------------------
  // Core math helpers
  // ---------------------------------------------------------------------------
  function normalize(scores) {
    const sum = scores.P + scores.B + scores.T;
    const out = {
      P: +(100 * scores.P / sum).toFixed(1),
      B: +(100 * scores.B / sum).toFixed(1),
      T: +(100 * scores.T / sum).toFixed(1),
    };
    // Fix rounding drift
    const drift = 100 - (out.P + out.B + out.T);
    if (Math.abs(drift) >= 0.1) {
      // Adjust the max entry by the drift
      const maxKey = ["P", "B", "T"].sort((a, b) => out[b] - out[a])[0];
      out[maxKey] = +(out[maxKey] + drift).toFixed(1);
    }
    return out;
  }

  function lastNonTie(history) {
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i] !== "T") return history[i];
    }
    return null;
  }

  function other(x) {
    return x === "P" ? "B" : "P";
  }

  // Markov base probabilities (order-1) with Laplace smoothing
  function markovProbs(history, depth = 14) {
    if (history.length === 0) return { P: 1 / 3, B: 1 / 3, T: 1 / 3 };
    const trans = { P: { P: 1, B: 1, T: 1 }, B: { P: 1, B: 1, T: 1 }, T: { P: 1, B: 1, T: 1 } };
    const start = Math.max(1, history.length - depth);
    for (let i = start; i < history.length; i++) {
      const prev = history[i - 1];
      const cur = history[i];
      trans[prev][cur]++;
    }
    const last = history[history.length - 1];
    const tot = trans[last].P + trans[last].B + trans[last].T;
    return {
      P: trans[last].P / tot,
      B: trans[last].B / tot,
      T: trans[last].T / tot,
    };
  }

  // Pattern weights: streak/ping-pong/double/bias + tie clustering
  function patternWeights(history) {
    const w = { P: 1, B: 1, T: 0.6 }; // T slightly downweighted by default
    const n = history.length;
    if (n < 3) return w;

    // Current streak (ignore T breaks for streak calc, but use last actual for direction)
    const last = lastNonTie(history);
    if (last) {
      let streak = 0;
      for (let i = history.length - 1; i >= 0; i--) {
        if (history[i] === "T") continue;
        if (history[i] === last) streak++; else break;
      }
      if (streak >= 3) {
        w[last] += 0.25 + 0.05 * Math.min(4, (streak - 3)); // gentle boost
        w[other(last)] = Math.max(0.05, w[other(last)] - 0.05 * Math.min(4, (streak - 3)));
      }
    }

    // Ping-Pong (alternating) on non-ties
    const noT = history.filter(x => x !== "T");
    if (noT.length >= 4) {
      const last4 = noT.slice(-4);
      const isAlt = last4[0] !== last4[1] && last4[0] === last4[2] && last4[1] === last4[3];
      if (isAlt) {
        const next = last4[last4.length - 1] === "P" ? "B" : "P";
        w[next] += 0.2;
      }
    }

    // Double pattern (PP BB PP ... style)
    if (noT.length >= 6) {
      const last6 = noT.slice(-6);
      const block = (a, b) => a[0] === a[1] && b[0] === b[1] && a[0] !== b[0];
      const a = last6.slice(0, 2), b = last6.slice(2, 4), c = last6.slice(4, 6);
      if (block(a, b) && block(b, c)) {
        const next = c[1] === "P" ? "B" : "P";
        w[next] += 0.15;
      }
    }

    // Bias (chop vs streak tendency in recent window)
    if (noT.length >= 6) {
      let chops = 0, streaks = 0;
      for (let i = 1; i < noT.length; i++) {
        if (noT[i] === noT[i - 1]) streaks++; else chops++;
      }
      if (chops - streaks >= 3) {
        const lastSide = noT[noT.length - 1];
        w[other(lastSide)] += 0.1;
      } else if (streaks - chops >= 3) {
        const lastSide = noT[noT.length - 1];
        w[lastSide] += 0.1;
      }
    }

    // Tie clustering (boost T slightly if frequent recently)
    const ties = history.slice(-6).filter(x => x === "T").length;
    if (ties >= 2) w.T += 0.1 * (ties - 1);

    // Floor
    w.P = Math.max(0.05, w.P);
    w.B = Math.max(0.05, w.B);
    w.T = Math.max(0.02, w.T);
    return w;
  }

  // The "advanced" model: blend of Markov and pattern weights with extra emphasis
  function blendedProbs(history) {
    const base = markovProbs(history);
    const w = patternWeights(history);
    // Multiply THEN normalize; also put a mild exponent when advanced is on
    const exp = state.useAdvanced ? 1.15 : 1.0;
    const scores = {
      P: Math.pow(base.P * w.P, exp),
      B: Math.pow(base.B * w.B, exp),
      T: Math.pow(base.T * w.T, exp),
    };
    return normalize(scores);
  }

  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------
  function renderAll() {
    const probs = blendedProbs(state.history);
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
    renderPerformance();
    updateChart();
  }

  function setBar(which, pct) {
    const bar = document.querySelector(`.prediction-bar.${which}-bar`);
    if (bar) bar.style.width = `${Math.max(1, pct)}%`;
  }

  function renderPredictionBars(probs) {
    setBar("player", probs.P);
    setBar("banker", probs.B);
    setBar("tie", probs.T);
    const playerProb = $("playerProb");
    const bankerProb = $("bankerProb");
    const tieProb = $("tieProb");
    if (playerProb) playerProb.textContent = `${probs.P}%`;
    if (bankerProb) bankerProb.textContent = `${probs.B}%`;
    if (tieProb) tieProb.textContent = `${probs.T}%`;

    // Visual pulse on high confidence
    [playerProb, bankerProb, tieProb].forEach((el) => {
      if (!el) return;
      const val = parseFloat(el.textContent);
      el.classList.toggle("high", val >= 55);
    });

    // Full-screen subtle overlay for highest
    const topKey = ["P", "B", "T"].sort((a, b) => probs[b] - probs[a])[0];
    applyHighProbEffect(topKey, probs[topKey]);
  }

  function applyHighProbEffect(key, pct) {
    const container = $("effects-container");
    if (!container) return;
    container.innerHTML = "";
    if (pct < 60) return; // only for 60%+
    const eff = document.createElement("div");
    eff.className = "high-prob-effect " + (key === "P" ? "high-prob-player" : key === "B" ? "high-prob-banker" : "high-prob-tie");
    container.appendChild(eff);
    // Auto remove later (CSS anim handles opacity)
    setTimeout(() => { if (eff && eff.parentNode) eff.parentNode.removeChild(eff); }, 1900);
  }

  function renderAIAdvice(probs) {
    const el = $("aiAdvice");
    if (!el) return;
    const top = ["P", "B", "T"].sort((a, b) => probs[b] - probs[a])[0];
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
    // Save recommendation for simple performance calc
    state.recHistory.push(top);
    if (state.recHistory.length > state.history.length) state.recHistory.shift();
  }

  function renderStats() {
    const el = $("aiStats");
    if (!el) return;
    const total = state.history.length;
    const p = state.history.filter(x => x === "P").length;
    const b = state.history.filter(x => x === "B").length;
    const ti = state.history.filter(x => x === "T").length;

    // Simple "accuracy" = how many times last rec matched actual (exclude T for fairness)
    let correct = 0, considered = 0;
    for (let i = 0; i < state.history.length; i++) {
      const actual = state.history[i];
      const rec = state.recHistory[i] || null;
      if (!rec) continue;
      if (actual === "T") continue;
      considered++;
      if (actual === rec) correct++;
    }
    const acc = considered ? ((100 * correct) / considered).toFixed(1) : "—";

    el.innerHTML = `
      <div><b>الجولات:</b> ${total}</div>
      <div>🔵 P: ${p} | 🔴 B: ${b} | 🟢 T: ${ti}</div>
      <div>✅ دقة التوصية (بدون تعادلات): <b>${acc}%</b></div>
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
    const el = $("historyDisplay");
    if (!el) return;
    const chip = (x) => `<span class="prediction-value ${x==="P"?"prediction-player":x==="B"?"prediction-banker":"prediction-tie"}">${x}</span>`;
    el.innerHTML = state.history.length ? state.history.map(chip).join(" ") : "لا تاريخ بعد.";
  }

  function renderTrends() {
    const el = $("trendsContent");
    if (!el) return;
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
    const el = $("last5Results");
    if (!el) return;
    const last5 = state.history.slice(-5);
    const cell = (x) => `<div class="last5-cell ${x==="P"?"last5-P":x==="B"?"last5-B":"last5-T"}">${x||"—"}</div>`;
    el.innerHTML = `<div class="last5-grid">${[...Array(5)].map((_,i)=>cell(last5[i]||"")).join("")}</div>`;
  }

  // ---------------------------------------------------------------------------
  // Big Road & Derived Roads (simplified but useful)
  // ---------------------------------------------------------------------------

  // Build Big Road matrix (6 rows, many columns). Ties attach as a small overlay letter.
  function buildBigRoad(history) {
    const grid = []; // array of columns; each column is array of up to 6 (top->bottom)
    let col = -1, row = 0;
    let lastColor = null;

    for (let i = 0; i < history.length; i++) {
      const r = history[i];
      if (r === "T") {
        // attach tie to latest placed cell if exists
        if (col >= 0 && grid[col][row]) {
          grid[col][row] = (grid[col][row] || "") + "T";
        }
        continue;
      }
      const color = r; // P/B
      if (color !== lastColor) {
        // start new column
        col++;
        row = 0;
        grid[col] = grid[col] || [];
        lastColor = color;
      } else {
        // continue down, if row is full or cell occupied, move to new column
        if (row >= 5 || (grid[col] && grid[col][row + 1])) {
          col++;
          row = 0;
          grid[col] = grid[col] || [];
        } else {
          row++;
        }
      }
      grid[col][row] = color;
    }
    return grid; // grid[col][row] = 'P'|'B'|'PT'|'BT' etc.
  }

  function renderBigRoad() {
    const el = $("bigRoad");
    if (!el) return;
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

  // Derived "roads" (very simplified): show chop vs streak patterning
  function buildDerivedRoads(history) {
    const noT = history.filter(x => x !== "T");
    const sig = []; // 'P' for chop, 'B' for streak
    for (let i = 1; i < noT.length; i++) {
      sig.push(noT[i] === noT[i - 1] ? "B" : "P");
    }
    // Make three copies with slight phase shifts for BigEye/Small/Cockroach
    const roads = [sig, sig.slice(1), sig.slice(2)];
    return roads.map(seq => chunkAsGrid(seq, 6));
  }

  function chunkAsGrid(seq, rows = 6) {
    const grid = [];
    let col = -1, row = 0, last = null;
    seq.forEach((x) => {
      if (x !== last) {
        col++; row = 0; grid[col] = grid[col] || [];
        last = x;
      } else {
        if (row >= rows - 1 || (grid[col] && grid[col][row + 1])) {
          col++; row = 0; grid[col] = grid[col] || [];
        } else {
          row++;
        }
      }
      grid[col][row] = x;
    });
    return grid; // grid[col][row] in {'P','B'}
  }

  function renderDerivedRoads() {
    const el1 = $("bigEyeRoad");
    const el2 = $("smallRoad");
    const el3 = $("cockroachRoad");
    if (!el1 || !el2 || !el3) return;
    const [r1, r2, r3] = buildDerivedRoads(state.history);
    const render = (el, grid) => {
      el.innerHTML = "";
      grid.forEach(col => {
        for (let r = 0; r < 6; r++) {
          const v = col && col[r];
          if (!v) continue;
          const d = document.createElement("div");
          d.className = "road-cell " + (v === "P" ? "road-P" : "road-B");
          el.appendChild(d);
        }
      });
    };
    render(el1, r1); render(el2, r2); render(el3, r3);
  }

  // ---------------------------------------------------------------------------
  // Advanced box, diamond, performance
  // ---------------------------------------------------------------------------
  function renderAdvancedBox() {
    const el = $("advancedPredictionResults");
    if (!el) return;
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
    const el = $("diamondAnalysis");
    if (!el) return;
    const noT = state.history.filter(x => x !== "T");
    if (noT.length < 4) {
      el.innerHTML = "<p>Need ≥ 4 (non‑T) rounds for diamond check.</p>";
      return;
    }
    const last4 = noT.slice(-4);
    // Simple diamond proxy: symmetry (a==d && b==c) => "balanced"; else lean last
    const balanced = last4[0] === last4[3] && last4[1] === last4[2];
    let text;
    if (balanced) {
      text = "⚖️ توازن تناظري (diamond) — ميول ضعيف للجولة الجاية.";
    } else {
      const lean = last4[3];
      text = `💠 ميول دايموند بسيط نحو ${lean}.`;
    }
    el.innerHTML = `<div class="diamond-result"><p>${text}</p></div>`;
  }

  function renderPerformance() {
    const el = $("modelPerformance");
    if (!el) return;
    // Already computed in renderStats; we re-summarize here
    let correct = 0, considered = 0;
    for (let i = 0; i < state.history.length; i++) {
      const actual = state.history[i];
      const rec = state.recHistory[i] || null;
      if (!rec) continue;
      if (actual === "T") continue;
      considered++;
      if (actual === rec) correct++;
    }
    const acc = considered ? ((100 * correct) / considered).toFixed(1) : "—";
    el.innerHTML = `<p>✅ الدقة الإجمالية للتوصيات (بدون تعادلات): <b>${acc}%</b></p>`;
  }

  // ---------------------------------------------------------------------------
  // Chart.js (cumulative counts)
  // ---------------------------------------------------------------------------
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
        plugins: {
          legend: { display: true }
        },
        scales: {
          x: { display: true, title: { display: false } },
          y: { display: true, beginAtZero: true }
        }
      }
    });
    return state.chart;
  }

  function updateChart() {
    const chart = ensureChart();
    if (!chart) return;
    const n = state.history.length;
    const p = state.history.filter(x => x === "P").length;
    const b = state.history.filter(x => x === "B").length;
    const t = state.history.filter(x => x === "T").length;
    chart.data.labels = Array.from({ length: n }, (_, i) => i + 1);
    chart.data.datasets[0].data = cumulativeCounts(state.history, "P");
    chart.data.datasets[1].data = cumulativeCounts(state.history, "B");
    chart.data.datasets[2].data = cumulativeCounts(state.history, "T");
    chart.update();
  }

  function cumulativeCounts(arr, sym) {
    const out = [];
    let c = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === sym) c++;
      out.push(c);
    }
    return out;
  }

  // ---------------------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    const lang = $("langSelect");
    if (lang) lang.addEventListener("change", applyLanguage);
    applyLanguage();
    renderAll();
  });

})();

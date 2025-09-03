/* Final enhanced logic (ensemble + roads + backtest + ROI) */
(() => {
  const state = {
    history: [],
    wins: 0,
    losses: 0,
    lastRecommendation: null,
    useAdvancedModel: true,
    roiHistory: [],
    settings: { windowSize: 30, bankerCommission: true },
  };

  const $ = (id) => document.getElementById(id);
  const STORAGE_KEY = "bacpro.history.v3";
  const STORAGE_WL  = "bacpro.wl.v3";
  const STORAGE_ADV = "bacpro.advanced.on";
  const STORAGE_SET = "bacpro.settings.v1";

  function init() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(saved)) state.history = saved.filter(x => ["P","B","T"].includes(x));
    } catch {}
    try {
      const wl = JSON.parse(localStorage.getItem(STORAGE_WL) || "{}");
      if (wl && typeof wl === "object") {
        state.wins = +wl.wins || 0;
        state.losses = +wl.losses || 0;
      }
    } catch {}
    try {
      const adv = localStorage.getItem(STORAGE_ADV);
      state.useAdvancedModel = adv === null ? true : adv === "1";
    } catch {}
    try {
      const st = JSON.parse(localStorage.getItem(STORAGE_SET) || "{}");
      if (st.windowSize) state.settings.windowSize = Math.max(5, Math.min(60, +st.windowSize));
      if (typeof st.bankerCommission === "boolean") state.settings.bankerCommission = st.bankerCommission;
    } catch {}

    bindUI();
    updateModelStatus();
    fullRender();
  }

  function bindUI() {
    const gap = $("gapThreshold"), gapValue = $("gapValue");
    if (gap && gapValue) {
      gap.addEventListener("input", () => { gapValue.textContent = `${gap.value}%`; updatePredictionAndUI(); });
    }
    const winSl = $("windowSize"), winVal = $("windowSizeValue");
    if (winSl && winVal) {
      winSl.value = state.settings.windowSize;
      winVal.textContent = String(state.settings.windowSize);
      winSl.addEventListener("input", () => {
        state.settings.windowSize = +winSl.value;
        winVal.textContent = winSl.value;
        persistSettings();
        updatePredictionAndUI();
      });
    }
    const comm = $("bankerCommission");
    if (comm) {
      comm.checked = !!state.settings.bankerCommission;
      comm.addEventListener("change", () => {
        state.settings.bankerCommission = !!comm.checked;
        persistSettings();
      });
    }
  }

  window.addResult = function (res) {
    if (!["P","B","T"].includes(res)) return;
    evaluateLastRecommendationWith(res);
    state.history.push(res);
    persistHistory();
    fullRender();
  };
  window.undoLast = function () {
    state.history.pop();
    persistHistory();
    fullRender();
  };
  window.resetData = function () {
    state.history = [];
    state.wins = 0;
    state.losses = 0;
    state.roiHistory = [];
    state.lastRecommendation = null;
    persistHistory(); persistWL();
    fullRender();
  };
  window.clearStorage = function () {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_WL);
    localStorage.removeItem(STORAGE_ADV);
    localStorage.removeItem(STORAGE_SET);
    alert("تم مسح التخزين المحلي.");
  };
  window.exportJSON = function () {
    const data = {
      history: state.history, wins: state.wins, losses: state.losses,
      advanced: state.useAdvancedModel ? 1 : 0, settings: state.settings
    };
    downloadFile("baccarat_history.json", JSON.stringify(data, null, 2));
  };
  window.exportCSV = function () {
    const rows = ["round,result"]; state.history.forEach((r,i)=>rows.push(`${i+1},${r}`));
    downloadFile("baccarat_history.csv", rows.join("\n"));
  };
  window.importHistory = function (evt) {
    const file = evt.target.files && evt.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        if (file.name.endsWith(".json")) {
          const data = JSON.parse(reader.result);
          if (Array.isArray(data.history)) state.history = data.history.filter(x => ["P","B","T"].includes(x));
          state.wins = +data.wins || 0; state.losses = +data.losses || 0;
          state.useAdvancedModel = data.advanced ? true : false;
          if (data.settings) state.settings = Object.assign({windowSize:30, bankerCommission:true}, data.settings);
          persistHistory(); persistWL(); persistSettings();
          localStorage.setItem(STORAGE_ADV, state.useAdvancedModel ? "1" : "0");
          fullRender();
        } else if (file.name.endsWith(".csv")) {
          const lines = String(reader.result).trim().split(/\r?\n/).slice(1);
          const parsed = [];
          for (const line of lines) { const parts = line.split(","); const v=(parts[1]||"").trim(); if (["P","B","T"].includes(v)) parsed.push(v); }
          state.history = parsed; persistHistory(); fullRender();
        } else { alert("صيغة غير معروفة."); }
      } catch(e){ alert("تعذر قراءة الملف."); }
    };
    reader.readAsText(file);
  };
  window.toggleTheme = function(){ document.body.classList.toggle("light-mode"); };
  window.toggleAdvancedModel = function () {
    state.useAdvancedModel = !state.useAdvancedModel;
    localStorage.setItem(STORAGE_ADV, state.useAdvancedModel ? "1" : "0");
    updateModelStatus(); updatePredictionAndUI();
  };
  window.runBacktest = function () { runBacktestOverHistory(); };

  function persistHistory(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state.history)); }
  function persistWL(){ localStorage.setItem(STORAGE_WL, JSON.stringify({ wins: state.wins, losses: state.losses })); }
  function persistSettings(){ localStorage.setItem(STORAGE_SET, JSON.stringify(state.settings)); }

  function downloadFile(filename, content) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
  }

  function lastNonTie(history) {
    for (let i = history.length-1; i >= 0; i--) { if (history[i] === "P" || history[i] === "B") return history[i]; }
    return null;
  }
  function baselineOrder1(history) {
    const last = lastNonTie(history);
    const c = { P: 1, B: 1, T: 1 };
    if (last) {
      for (let i = 1; i < history.length; i++) if (history[i-1] === last) c[history[i]] = (c[history[i]]||0)+1;
    } else {
      for (const r of history) c[r]=(c[r]||0)+1; c.P++; c.B++; c.T++;
    }
    const s = c.P+c.B+c.T; return { P:c.P/s, B:c.B/s, T:c.T/s };
  }
  function baselineOrder2(history) {
    const comp = history.filter(x => x !== "T");
    const counts = { PP:{P:1,B:1}, PB:{P:1,B:1}, BP:{P:1,B:1}, BB:{P:1,B:1} };
    if (comp.length < 3) return { P:0.5, B:0.5, T:0.0 };
    for (let i=2; i<comp.length; i++){
      const key = comp[i-2] + comp[i-1];
      const nxt = comp[i];
      counts[key][nxt] = (counts[key][nxt]||0)+1;
    }
    const key = comp.slice(-2).join("");
    const row = counts[key] || {P:1,B:1};
    const sum = row.P + row.B;
    return { P: row.P/sum, B: row.B/sum, T: 0 };
  }
  function windowFreqs(history, w) {
    const tail = history.slice(-w);
    const c = { P:1, B:1, T:1 };
    for (const r of tail) c[r]=(c[r]||0)+1;
    const s = c.P+c.B+c.T; return { P:c.P/s, B:c.B/s, T:c.T/s };
  }

  function patternSignals(history) {
    const notes = [];
    const scores = { P: 0, B: 0, T: 0 };
    if (history.length === 0) return { scores, notes };

    const streak = tailStreak(history, ["P","B"]);
    if (streak.length >= 2) {
      const side = streak.value; const len = streak.length;
      const boost = Math.min(0.15, 0.08 + (len-2)*0.03);
      scores[side] += boost; notes.push(`🧵 Streak: ${side} × ${len} → +${Math.round(boost*100)}`);
    }
    const pp = isPingPong(history);
    if (pp.count >= 3) {
      const last = lastNonTie(history); const next = last === "P" ? "B" : "P";
      const boost = Math.min(0.12, 0.06 + (pp.count-3)*0.02);
      scores[next] += boost; notes.push(`🔄 Ping-Pong ${pp.count} → ${next} (+${Math.round(boost*100)})`);
    }
    const dp = doublePatternSignal(history);
    if (dp.detected) { const next = dp.next; const boost = 0.08; scores[next] += boost; notes.push(`➿ Double-Pairs → ${next} (+${Math.round(boost*100)})`); }
    const recent = history.slice(-10);
    const tRate = recent.filter(x => x==="T").length / Math.max(1,recent.length);
    if (tRate >= 0.25) { scores.T += 0.05; notes.push(`🟢 كثرة التعادلات → +5% لـ T`); }

    return { scores, notes };
  }
  function tailStreak(arr, domain){
    let len=0, value=null;
    for (let i=arr.length-1;i>=0;i--){
      if (!domain.includes(arr[i])) break;
      if (value===null) value=arr[i];
      if (arr[i]===value) len++; else break;
    }
    return { value, length: len };
  }
  function isPingPong(history){
    const comp = history.filter(x => x!=="T"); let count=0;
    for (let i=comp.length-1;i>0;i--){ if (comp[i]===comp[i-1]) break; count++; }
    return { count };
  }
  function doublePatternSignal(history){
    const comp = history.filter(x => x!=="T");
    if (comp.length<4) return { detected:false };
    const last4 = comp.slice(-4);
    const p1 = last4.slice(0,2).every(x => x===last4[0]);
    const p2 = last4.slice(2,4).every(x => x===last4[2]);
    if (!(p1&&p2)) return { detected:false };
    if (last4[0]===last4[2]) return { detected:false };
    const next = last4[0]; return { detected:true, next };
  }

  function buildBigRoadColumns(history) {
    const comp = history.filter(x => x !== "T");
    const cols = []; let col = [];
    for (let i=0;i<comp.length;i++){
      const r = comp[i];
      if (col.length===0) col.push(r);
      else { const prev = col[col.length-1];
        if (r===prev) col.push(r); else { cols.push(col); col=[r]; }
      }
    }
    if (col.length) cols.push(col);
    return cols;
  }
  function pushDerived(beads, color){
    if (beads.length===0){ beads.push([color]); return; }
    const lastCol = beads[beads.length-1];
    const lastColor = lastCol[lastCol.length-1];
    if (color===lastColor && lastCol.length<6) lastCol.push(color);
    else beads.push([color]);
  }
  function computeDerivedRoads(history) {
    const cols = buildBigRoadColumns(history);
    const bigEye=[], smallR=[], babyR=[];
    for (let c=0;c<cols.length;c++){
      for (let r=0;r<cols[c].length;r++){
        if (c>=1){
          let color;
          if (r===0){ if (c>=2){ const h1=cols[c-1].length, h2=cols[c-2].length; color=(h1===h2)?"R":"B"; } }
          else { const exist = (cols[c-1].length>r); color = exist?"R":"B"; }
          if (color) pushDerived(bigEye, color);
        }
        if (c>=2){
          let color;
          if (r===0){ if (c>=3){ const h1=cols[c-1].length, h2=cols[c-3].length; color=(h1===h2)?"R":"B"; } }
          else { const exist = (cols[c-2].length>r); color = exist?"R":"B"; }
          if (color) pushDerived(smallR, color);
        }
        if (c>=3){
          let color;
          if (r===0){ if (c>=4){ const h1=cols[c-1].length, h2=cols[c-4].length; color=(h1===h2)?"R":"B"; } }
          else { const exist = (cols[c-3].length>r); color = exist?"R":"B"; }
          if (color) pushDerived(babyR, color);
        }
      }
    }
    return { bigEye, smallR, babyR, cols };
  }
  function bigEyeConsistency(history, window=30){
    const { bigEye } = computeDerivedRoads(history);
    const flat = bigEye.flat(); if (!flat.length) return 0.5;
    const recent = flat.slice(-Math.min(window, flat.length));
    const red = recent.filter(x => x==="R").length;
    return red/recent.length;
  }

  function fusedProbs(history) {
    const w = Math.max(5, Math.min(60, state.settings.windowSize));
    const base1 = baselineOrder1(history);
    const base2 = baselineOrder2(history);
    const winF  = windowFreqs(history, w);
    const { scores, notes } = patternSignals(history);

    const mood = bigEyeConsistency(history);
    const patWeight = state.useAdvancedModel ? (0.10 + 0.20 * mood) : 0.05;

    const w1 = state.useAdvancedModel ? 0.40 : 0.70;
    const w2 = state.useAdvancedModel ? 0.25 : 0.10;
    const ww = state.useAdvancedModel ? 0.20 : 0.15;

    const raw = {
      P: w1*base1.P + w2*base2.P + ww*winF.P + patWeight*scores.P,
      B: w1*base1.B + w2*base2.B + ww*winF.B + patWeight*scores.B,
      T: w1*base1.T + w2*base2.T + ww*winF.T + patWeight*scores.T,
    };
    const sum = raw.P + raw.B + raw.T;
    const probs = { P: raw.P/sum, B: raw.B/sum, T: raw.T/sum };

    const moodPct = Math.round(mood*100);
    notes.unshift(`👁️ Big Eye Consistency: ${moodPct}%`);

    return { probs, notes, base1, base2, winF, mood };
  }

  function makeRecommendation(probs) {
    const entries = Object.entries(probs).sort((a,b)=>b[1]-a[1]);
    const top = entries[0], second = entries[1];
    const gapPct = (top[1]-second[1])*100;
    const threshold = +($("gapThreshold")?.value || 15);
    return { pick: top[0], decisive: gapPct >= threshold, gapPct };
  }

  function evaluateLastRecommendationWith(actual) {
    const prev = state.lastRecommendation; if (!prev) return;
    if (!prev.decisive) return;
    if (actual === "T") return;
    const commission = state.settings.bankerCommission ? 0.95 : 1.0;
    if (actual === prev.pick) {
      state.wins += 1;
      const profit = (prev.pick === "B") ? commission : 1.0;
      state.roiHistory.push(profit);
      fireConfetti("win");
    } else {
      state.losses += 1;
      state.roiHistory.push(-1.0);
      fireConfetti("loss");
    }
    persistWL();
  }

  function updatePredictionAndUI() {
    const { probs, notes } = fusedProbs(state.history);
    const rec = makeRecommendation(probs);
    state.lastRecommendation = { pick: rec.pick, decisive: rec.decisive, probs };

    setBar("barP", probs.P); setBar("barB", probs.B); setBar("barT", probs.T);
    $("playerProb").textContent = Math.round(probs.P*100) + "%";
    $("bankerProb").textContent = Math.round(probs.B*100) + "%";
    $("tieProb").textContent    = Math.round(probs.T*100) + "%";

    renderRecommendation(rec);

    const adv = $("advancedPredictionResults");
    if (adv) adv.innerHTML = notes.length ? notes.map(n => `<div>• ${n}</div>`).join("") : "<div>لا ملاحظات نمطية حالياً.</div>";
  }
  function setBar(id,p){ const el=$(id); if(!el)return; el.style.width=Math.max(5,Math.round(p*100))+"%"; el.textContent=Math.round(p*100)+"%"; }
  function renderRecommendation(rec){
    const box = $("recommendation"); if (!box) return;
    const cls = rec.pick;
    const conf = Math.max(0, Math.min(100, Math.round(rec.gapPct)));
    const label = rec.pick==="P"?"🔵 اللاعب":rec.pick==="B"?"🔴 البانكر":"🟢 التعادل";
    const decisiveText = rec.decisive ? "✅ (إشارة حاسمة)" : "⚠️ (إشارة ضعيفة)";
    box.className = "recommendation-box " + cls;
    box.innerHTML = `<div><strong>التوصية:</strong> ${label} ${decisiveText}</div>
      <div class="confidence-meter"><div class="confidence-bar" style="width:${conf}%"></div><span>${conf}%</span></div>`;
  }
  function renderHistory(){
    const cont=$("historyDisplay"); if(!cont)return;
    cont.innerHTML = state.history.map(r=>`<span class="${r==="P"?"player-text":r==="B"?"banker-text":"tie-text"}">${r}</span>`).join(" • ");
  }
  function renderBigRoad(){
    const grid=$("bigRoad"); if(!grid)return;
    grid.innerHTML=""; const { cols } = computeDerivedRoads(state.history);
    cols.forEach(col=>{ const h=Math.min(6,col.length); for(let r=0;r<h;r++){ const v=col[r]; const cell=document.createElement("div");
      cell.className="big-road-cell " + (v==="P"?"big-road-P":"big-road-B"); cell.textContent=v; grid.appendChild(cell);} });
  }
  function renderDerivedRoads(){
    const { bigEye, smallR, babyR } = computeDerivedRoads(state.history);
    [{id:"bigEyeRoad",data:bigEye},{id:"smallRoad",data:smallR},{id:"babyRoad",data:babyR}].forEach(({id,data})=>{
      const el=$(id); if(!el)return; el.innerHTML="";
      data.forEach(col=>{ const h=Math.min(6,col.length); for(let r=0;r<h;r++){ const color=col[r]; const cell=document.createElement("div");
        cell.className="road-cell " + (color==="R"?"road-B":"road-P"); el.appendChild(cell);} });
    });
  }
  function renderStats(){
    const s=$("statsResult"); if(!s)return;
    const total=state.history.length;
    const p=state.history.filter(x=>x==="P").length;
    const b=state.history.filter(x=>x==="B").length;
    const t=state.history.filter(x=>x==="T").length;
    s.innerHTML = `المجموع: ${total} | P: ${p} | B: ${b} | T: ${t}`;
  }
  function renderLast5(){
    const el=$("last5Results"); if(!el)return;
    const last5=state.history.slice(-5);
    if(!last5.length){ el.innerHTML="—"; return; }
    el.innerHTML = `<div class="last5-grid">${ last5.map(x=>`<div class="last5-cell last5-${x}">${x}</div>`).join("") }</div>`;
  }
  function renderPatterns(){
    const target=$("casinoPatterns"); if(!target)return;
    const { notes } = patternSignals(state.history);
    target.innerHTML = notes.length ? notes.map(n=>`<div>• ${n}</div>`).join("") : "<div>ما بانوش أنماط قوية دابا.</div>";
  }
  function renderPerformance(){
    $("wlWins").textContent = state.wins;
    $("wlLosses").textContent = state.losses;
    const total = state.wins + state.losses;
    const rate = total ? Math.round((state.wins/total)*100) : 0;
    $("wlRate").textContent = rate + "%";
    const roi = state.roiHistory.reduce((a,b)=>a+b,0);
    $("roiValue").textContent = roi.toFixed(2);
    const pct = total ? Math.min(100, Math.max(0, Math.round((state.wins/Math.max(1,total))*100))) : 0;
    $("roiBar").style.width = pct + "%"; $("roiLabel").textContent = pct + "%";
  }
  function fireConfetti(kind){
    const container=$("effects-container"); if(!container)return;
    const burst=document.createElement("div"); burst.textContent= kind==="win"?"✨":"💥";
    burst.style.position="fixed"; burst.style.left=Math.random()*80+10+"%"; burst.style.top="20%";
    burst.style.fontSize="32px"; burst.style.transition="all .9s ease"; container.appendChild(burst);
    requestAnimationFrame(()=>{ burst.style.transform="translateY(80px) scale(1.5)"; burst.style.opacity="0"; });
    setTimeout(()=>container.removeChild(burst),1000);
  }
  function updateModelStatus(){
    const el=$("modelStatus"); if(!el)return;
    el.textContent = state.useAdvancedModel ? "الموديل المتقدم (إنسامبل + أنماط + Roads)" : "الموديل الأساسي (ماركوف فقط)";
  }

  let chart, roiChart;
  function renderChart(){
    const ctx=$("statsChart"); if(!ctx)return;
    const p=state.history.filter(x=>x==="P").length;
    const b=state.history.filter(x=>x==="B").length;
    const t=state.history.filter(x=>x==="T").length;
    if(chart) chart.destroy();
    chart = new Chart(ctx, {
      type:"bar",
      data:{ labels:["P","B","T"], datasets:[{ label:"Counts", data:[p,b,t] }] },
      options:{ responsive:true, plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true } } }
    });
  }
  function renderTrends(){ const t=$("trendsContent"); if(!t)return; t.innerHTML=""; }

  function runBacktestOverHistory(){
    const h = state.history.slice();
    const results = { bets:0, wins:0, losses:0, roiSeries:[], cumROI:0 };
    const commission = state.settings.bankerCommission ? 0.95 : 1.0;
    const startAt = 6;
    for (let i=startAt; i<h.length; i++){
      const past = h.slice(0, i);
      const { probs } = fusedProbs(past);
      const rec = makeRecommendation(probs);
      if (!rec.decisive) { results.roiSeries.push(results.cumROI); continue; }
      const actual = h[i];
      if (actual==="T") { results.roiSeries.push(results.cumROI); continue; }
      results.bets++;
      if (actual === rec.pick){
        results.wins++;
        const profit = (rec.pick==="B") ? commission : 1.0;
        results.cumROI += profit;
      } else {
        results.losses++;
        results.cumROI -= 1.0;
      }
      results.roiSeries.push(results.cumROI);
    }

    const br = $("backtestResults");
    if (br){
      const acc = results.bets ? Math.round(results.wins/results.bets*100) : 0;
      br.innerHTML = `
        <div><strong>عدد الرهانات:</strong> ${results.bets}</div>
        <div><strong>انتصارات/خسائر:</strong> ${results.wins} / ${results.losses}</div>
        <div><strong>الدقة (على إشارات حاسمة فقط):</strong> ${acc}%</div>
        <div><strong>ROI تراكمي (وحدات):</strong> ${results.cumROI.toFixed(2)}</div>
      `;
    }

    const ctx = $("roiBacktestChart");
    if (ctx){
      if (roiChart) roiChart.destroy();
      roiChart = new Chart(ctx, {
        type:"line",
        data:{ labels: results.roiSeries.map((_,i)=>i+1), datasets:[{ label:"ROI", data: results.roiSeries, fill:false }] },
        options:{ responsive:true, plugins:{ legend:{ display:true } }, scales:{ y:{ beginAtZero:true } } }
      });
    }
  }

  function fullRender(){
    updatePredictionAndUI();
    renderHistory();
    renderBigRoad();
    renderDerivedRoads();
    renderStats();
    renderLast5();
    renderPatterns();
    renderPerformance();
    renderChart();
    renderTrends();
  }

  window._bacpro = state;
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", init) : init();
})();

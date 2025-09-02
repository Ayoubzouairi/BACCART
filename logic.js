/* BACCARAT PRO — logic.js (Markov + Backtest + ROI + Brier + Persistence + Big Road + Chart) */
(function(){
  // ======= State =======
  const LS_KEY = 'bacc_history_v2';
  const LS_GAP = 'bacc_gap_v2';
  const HISTORY = loadHistory();
  let useAdvanced = false; // placeholder toggle (ML not required to run)
  let gapThreshold = loadGap(); // in percent, e.g., 15

  const EL = {
    playerProb: document.getElementById('playerProb'),
    bankerProb: document.getElementById('bankerProb'),
    tieProb: document.getElementById('tieProb'),
    barP: document.getElementById('barP'),
    barB: document.getElementById('barB'),
    barT: document.getElementById('barT'),
    historyDisplay: document.getElementById('historyDisplay'),
    modelStatus: document.getElementById('modelStatus'),
    modelPerformance: document.getElementById('modelPerformance'),
    wlWins: document.getElementById('wlWins'),
    wlLosses: document.getElementById('wlLosses'),
    wlRate: document.getElementById('wlRate'),
    roiValue: document.getElementById('roiValue'),
    roiBar: document.getElementById('roiBar'),
    roiLabel: document.getElementById('roiLabel'),
    recommendation: document.getElementById('recommendation'),
    last5Results: document.getElementById('last5Results'),
    bigRoad: document.getElementById('bigRoad'),
    gapThreshold: document.getElementById('gapThreshold'),
    gapValue: document.getElementById('gapValue'),
    chartCanvas: document.getElementById('statsChart'),
  };

  // ======= Chart =======
  let roiChart = null;

  // ======= Helpers =======
  const idxOf = (c)=> c==='P'?0: c==='B'?1:2;
  const labOf = (i)=> i===0?'P': i===1?'B':'T';

  function softmax(arr){
    const m = Math.max(...arr);
    const exps = arr.map(x => Math.exp(x - m));
    const s = exps.reduce((a,b)=>a+b,0) || 1;
    return exps.map(e => e/s);
  }

  function saveHistory(){
    try{ localStorage.setItem(LS_KEY, JSON.stringify(HISTORY)); }catch(e){}
  }
  function loadHistory(){
    try{
      const txt = localStorage.getItem(LS_KEY);
      if(txt){ const arr = JSON.parse(txt); if(Array.isArray(arr)) return arr; }
    }catch(e){}
    return [];
  }
  function saveGap(v){
    try{ localStorage.setItem(LS_GAP, String(v)); }catch(e){}
  }
  function loadGap(){
    try{
      const v = parseInt(localStorage.getItem(LS_GAP), 10);
      if(!isNaN(v)) return v;
    }catch(e){}
    return 15;
  }

  // Build Markov probabilities with Laplace smoothing
  function markovProbs(history){
    if(history.length < 2){ return [1/3,1/3,1/3]; }
    const M = Array.from({length:3}, ()=> Array(3).fill(1));
    for(let i=1;i<history.length;i++){
      const prev = idxOf(history[i-1]);
      const cur  = idxOf(history[i]);
      M[prev][cur] += 1;
    }
    const last = idxOf(history[history.length-1]);
    const row = M[last].slice();
    const sum = row.reduce((a,b)=>a+b,0);
    return row.map(x => x/sum);
  }

  // Advanced (simple blend)
  function advancedProbs(history){
    const mk = markovProbs(history);
    const counts = [1,1,1];
    for(const c of history){ counts[idxOf(c)] += 1; }
    const total = counts.reduce((a,b)=>a+b,0);
    const freq = counts.map(x => x/total);
    const mix = [0,1,2].map(i => 0.6*mk[i] + 0.4*freq[i]);
    const s = mix.reduce((a,b)=>a+b,0) || 1;
    return mix.map(x => x/s);
  }

  function getProbs(history){
    return useAdvanced ? advancedProbs(history) : markovProbs(history);
  }

  function predict(history){
    const p = getProbs(history);
    const arr = [{k:'P',v:p[0]},{k:'B',v:p[1]},{k:'T',v:p[2]}].sort((a,b)=>b.v-a.v);
    const top1 = arr[0], top2 = arr[1];
    const equalTop = Math.abs(top1.v - top2.v) < 1e-12;
    const gap = top1.v - top2.v;
    return { probs:p, top: top1.k, top2: top2.k, gap, equalTop };
  }

  function formatPct(x){ return (x*100).toFixed(0) + '%'; }

  function updateUIFromProbs(p){
    EL.playerProb.textContent = formatPct(p[0]);
    EL.bankerProb.textContent = formatPct(p[1]);
    EL.tieProb.textContent    = formatPct(p[2]);

    EL.barP.style.width = formatPct(p[0]);
    EL.barB.style.width = formatPct(p[1]);
    EL.barT.style.width = formatPct(p[2]);

    const arr = [{el:EL.barP,val:p[0]},{el:EL.barB,val:p[1]},{el:EL.barT,val:p[2]}].sort((a,b)=>b.val-a.val);
    const gap = arr[0].val - arr[1].val;
    [EL.barP,EL.barB,EL.barT].forEach(el => el.classList.remove('high-prob'));
    if(gap >= gapThreshold/100){ arr[0].el.classList.add('high-prob'); }
  }

  function renderHistory(){
    EL.historyDisplay.textContent = 'السجل: ' + (HISTORY.length? HISTORY.join(' - ') : 'فارغ');
    const last5 = HISTORY.slice(-5);
    EL.last5Results.innerHTML = '<div class="last5-grid">' + last5.map(c => {
      const cls = c==='P'?'last5-P': c==='B'?'last5-B':'last5-T';
      return `<div class="last5-cell ${cls}">${c}</div>`;
    }).join('') + '</div>';
  }

  // Big Road (simplified): build columns of streaks ignoring T; mark T by overlay small dot
  function drawBigRoad(history){
    const grid = []; // array of columns; each col is an array rows up to 6
    let col = 0, row = 0;
    let prev = null;
    const tiesByIndex = {}; // index -> count
    const seq = []; // compress T with previous index
    for(let i=0;i<history.length;i++){
      const c = history[i];
      if(c==='T'){ tiesByIndex[seq.length-1] = (tiesByIndex[seq.length-1]||0)+1; continue; }
      seq.push(c);
    }
    // place circles
    for(let i=0;i<seq.length;i++){
      const c = seq[i];
      if(prev===c){
        // continue down if possible
        if(row<5 && (!grid[col] || !grid[col][row+1])){
          row += 1;
        } else {
          // move to next column
          col += 1; row = 0;
        }
      } else {
        // new color starts new column or same column if empty row 0 occupied?
        col += (prev===null) ? 0 : 1;
        row = 0;
      }
      if(!grid[col]) grid[col] = [];
      grid[col][row] = c;
      prev = c;
    }

    // render
    const container = EL.bigRoad;
    container.innerHTML = '';
    // determine width (#columns)
    const cols = grid.length;
    container.style.gridTemplateColumns = `repeat(${Math.max(cols,1)}, 30px)`;
    for(let x=0;x<cols;x++){
      for(let y=0;y<6;y++){
        const val = grid[x]?.[y] || null;
        const div = document.createElement('div');
        div.className = 'big-road-cell ' + (val? ('big-road-'+val): '');
        div.textContent = val? (val==='P'?'P':'B') : '';
        // small tie marker if any
        const idx = x; // approx index mapping
        if(val && tiesByIndex[idx]){
          const dot = document.createElement('div');
          dot.style.width='8px'; dot.style.height='8px';
          dot.style.borderRadius='50%';
          dot.style.background='#28A745'; // green for ties
          dot.style.position='absolute';
          dot.style.transform='translate(10px,-10px)';
          div.style.position='relative';
          div.appendChild(dot);
        }
        container.appendChild(div);
      }
    }
  }

  // Backtest respecting rules and confidence threshold
  function backtest(history, gapThresh){
    let wins = 0, losses = 0, bets = 0;
    let brierSum = 0, brierN = 0;
    let roi = 0;
    const cumRoi = []; // per accepted bet
    for(let i=1;i<history.length;i++){
      const slice = history.slice(0,i);
      const {probs, top, gap, equalTop} = predict(slice);
      const actual = history[i];
      if(actual === 'T') continue;          // skip ties entirely
      if(equalTop) continue;                // skip equal-top cases
      if(gap < gapThresh/100) continue;     // apply confidence threshold
      bets += 1;

      // Brier
      const y = actual==='P'?[1,0,0]:[0,1,0];
      brierSum += (probs[0]-y[0])**2 + (probs[1]-y[1])**2 + (probs[2]-0)**2;
      brierN += 1;

      if(top === actual){
        wins += 1;
        roi += (top==='P'? 1 : (top==='B'? 0.95 : 0));
      } else {
        losses += 1;
        roi -= 1;
      }
      cumRoi.push(roi);
    }
    const winRate = bets? (wins/bets) : 0;
    const brier = brierN? (brierSum/brierN) : 0;
    return {wins, losses, bets, winRate, brier, roi, cumRoi};
  }

  function updateWLWidget({wins, losses, winRate}){
    EL.wlWins.textContent = wins;
    EL.wlLosses.textContent = losses;
    EL.wlRate.textContent = formatPct(winRate);
  }

  function updateROI(roi, bets){
    const roiPct = bets? (roi / bets) * 100 : 0;
    EL.roiValue.textContent = bets? `${roi.toFixed(2)} (على ${bets} رهانات)` : '0';
    const w = Math.max(0, Math.min(100, Math.round(roiPct + 50)));
    EL.roiBar.style.width = w + '%';
    EL.roiLabel.textContent = Math.round(roiPct) + '%';
  }

  function renderPerformance(){
    const stats = backtest(HISTORY, gapThreshold);
    updateWLWidget(stats);
    updateROI(stats.roi, stats.bets);
    EL.modelPerformance.innerHTML = `
      <div class="model-performance">
        <p>✅ الرهانات المحتسبة: <strong>${stats.bets}</strong></p>
        <p>🏆 الانتصارات: <strong>${stats.wins}</strong> | ❌ الهزائم: <strong>${stats.losses}</strong></p>
        <p>🎯 نسبة الفوز: <strong>${formatPct(stats.winRate)}</strong></p>
        <p>📐 Brier Score (أصغر أحسن): <strong>${stats.brier.toFixed(3)}</strong></p>
      </div>
    `;
    renderChart(stats.cumRoi);
  }

  function renderRecommendation(pred){
    const mapLabel = {P:'🔵 اللاعب', B:'🔴 المصرفي', T:'🟢 تعادل'};
    const {top, gap} = pred;
    const conf = Math.max(0, Math.min(1, gap / 0.25));
    const confPct = Math.round(conf*100);
    const html = `
      <div class="recommendation-box ${top}">
        <div><strong>اقتراح الجولة القادمة:</strong> ${mapLabel[top]}
          <span style="opacity:.8"> (الثقة ≈ ${confPct}%)</span>
        </div>
        <div class="confidence-meter">
          <div class="confidence-bar" style="width:${confPct}%"></div>
          <span>${confPct}%</span>
        </div>
      </div>
    `;
    EL.recommendation.innerHTML = html;
  }

  function renderChart(cumRoi){
    if(!EL.chartCanvas) return;
    const labels = cumRoi.map((_,i)=> i+1);
    const data = {
      labels,
      datasets: [{
        label: 'ROI تراكمي لكل رهان مقبول',
        data: cumRoi,
        borderWidth: 2,
        fill: false,
        tension: 0.15
      }]
    };
    const options = {
      responsive: true,
      scales: {
        x: { title: { display: true, text: 'عدد الرهانات المقبولة' } },
        y: { title: { display: true, text: 'ROI تراكمي' } }
      }
    };
    if(roiChart){
      roiChart.data = data;
      roiChart.options = options;
      roiChart.update();
    } else {
      roiChart = new Chart(EL.chartCanvas.getContext('2d'), {
        type: 'line',
        data, options
      });
    }
  }

  function refreshAll(){
    const pred = predict(HISTORY);
    updateUIFromProbs(pred.probs);
    renderHistory();
    drawBigRoad(HISTORY);
    renderPerformance();
    renderRecommendation(pred);
    saveHistory();
  }

  // ======= Public API (used by HTML buttons) =======
  window.addResult = function(result){
    if(!['P','B','T'].includes(result)) return;
    HISTORY.push(result);
    refreshAll();
  };

  window.resetData = function(){
    HISTORY.length = 0;
    refreshAll();
  };

  window.toggleAdvancedModel = function(){
    useAdvanced = !useAdvanced;
    document.getElementById('modelStatus').textContent =
      useAdvanced ? 'النموذج المتقدم (مزج ماركوف + تردد عام)' : 'النموذج الأساسي (ماركوف)';
    refreshAll();
  };

  window.toggleTheme = function(){
    document.body.classList.toggle('light-mode');
  };

  // IO
  window.exportJSON = function(){
    const blob = new Blob([JSON.stringify(HISTORY)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'baccarat_history.json';
    a.click();
  };

  window.exportCSV = function(){
    const csv = 'result\n' + HISTORY.join('\n');
    const blob = new Blob([csv], {type:'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'baccarat_history.csv';
    a.click();
  };

  window.importHistory = function(ev){
    const file = ev.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(){
      try{
        const text = reader.result;
        let arr = [];
        if(file.name.endsWith('.json')){
          arr = JSON.parse(text);
        }else{
          // csv: first line header optional
          arr = text.trim().split(/\r?\n/).filter(Boolean);
          if(arr[0] && arr[0].toLowerCase().includes('result')) arr = arr.slice(1);
        }
        // sanitize to P/B/T
        arr = arr.map(x => String(x).trim().toUpperCase()[0]).filter(c => ['P','B','T'].includes(c));
        HISTORY.length = 0;
        HISTORY.push(...arr);
        refreshAll();
      }catch(e){
        alert('تعذر استيراد الملف. تأكد من الصيغة.');
      }
      ev.target.value = '';
    };
    reader.readAsText(file);
  };

  window.clearStorage = function(){
    try{
      localStorage.removeItem(LS_KEY);
      localStorage.removeItem(LS_GAP);
      alert('تم مسح التخزين.');
    }catch(e){}
  };

  // Threshold slider
  if(EL.gapThreshold){
    EL.gapThreshold.value = gapThreshold;
    EL.gapValue.textContent = gapThreshold + '%';
    EL.gapThreshold.addEventListener('input', (e)=>{
      gapThreshold = parseInt(e.target.value,10) || 0;
      EL.gapValue.textContent = gapThreshold + '%';
      saveGap(gapThreshold);
      refreshAll();
    });
  }

  // initial render
  refreshAll();
})();

/* ====== Pattern + Decision Module (Plug & Play) ====== */
(function () {
  const ID = (x) => document.getElementById(x);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  function getHistory() {
    try {
      const raw = localStorage.getItem("bacc_history");
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return window.historyResults ? [...window.historyResults] : [];
  }
  function lastN(arr, n) { return arr.slice(-n); }
  function freqStats(seq) {
    const f = { P: 0, B: 0, T: 0 };
    seq.forEach((x) => (f[x] = (f[x] || 0) + 1));
    const total = Math.max(1, seq.length);
    const pct = {
      P: Math.round((f.P / total) * 100),
      B: Math.round((f.B / total) * 100),
      T: Math.round((f.T / total) * 100),
    };
    return { f, pct, total };
  }
  function detectStreak(seq) {
    if (seq.length < 3) return { score: 0, label: null };
    let run = 1, best = 1, bestVal = null;
    for (let i = 1; i < seq.length; i++) {
      if (seq[i] === seq[i - 1] && seq[i] !== "T") {
        run++;
        if (run > best) { best = run; bestVal = seq[i]; }
      } else { run = 1; }
    }
    const score = best >= 3 ? clamp(10 + (best - 3) * 5, 0, 40) : 0;
    return { score, label: best >= 3 ? `Streak (${best}) على ${bestVal}` : null, next: bestVal };
  }
  function detectPingPong(seq) {
    if (seq.length < 4) return { score: 0, label: null };
    const clean = seq.filter((x) => x !== "T");
    if (clean.length < 4) return { score: 0, label: null };
    let good = 1;
    for (let i = 1; i < clean.length; i++) {
      if (clean[i] !== clean[i - 1]) good++; else good = 1;
    }
    const score = good >= 4 ? clamp(12 + (good - 4) * 4, 0, 35) : 0;
    const next = clean.length ? (clean.at(-1) === "P" ? "B" : "P") : null;
    return { score, label: good >= 4 ? `Ping-Pong (${good})` : null, next };
  }
  function detectDouble(seq) {
    if (seq.length < 4) return { score: 0, label: null };
    const blocks = []; let i = 0;
    while (i < seq.length) {
      const v = seq[i]; let j = i + 1;
      while (j < seq.length && seq[j] === v) j++;
      const len = j - i; if (v !== "T") blocks.push({ v, len });
      i = j;
    }
    if (blocks.length < 2) return { score: 0, label: null };
    let chain = 0, bestChain = 0;
    for (const b of blocks) {
      if (b.len >= 2) { chain++; bestChain = Math.max(bestChain, chain); }
      else { chain = 0; }
    }
    const score = bestChain >= 2 ? clamp(10 + (bestChain - 2) * 5, 0, 30) : 0;
    const lastBlock = blocks.at(-1);
    const next = lastBlock ? (lastBlock.v === "P" ? "B" : "P") : null;
    return { score, label: bestChain >= 2 ? `Double Pattern (${bestChain}x)` : null, next };
  }
  function detectDragonTail(seq) {
    if (seq.length < 6) return { score: 0, label: null };
    let run = 1, best = 1, val = null;
    for (let i = 1; i < seq.length; i++) {
      if (seq[i] === seq[i - 1] && seq[i] !== "T") {
        run++; if (run > best) { best = run; val = seq[i]; }
      } else run = 1;
    }
    const score = best >= 7 ? clamp(18 + (best - 7) * 4, 0, 40) : 0;
    return { score, label: best >= 7 ? `Dragon Tail (${best}) على ${val}` : null, next: val };
  }
  function detectCluster(seq) {
    if (seq.length < 5) return { score: 0, label: null };
    const blocks = []; let i = 0;
    while (i < seq.length) {
      const v = seq[i]; let j = i + 1;
      while (j < seq.length && seq[j] === v) j++;
      const len = j - i; if (v !== "T") blocks.push({ v, len });
      i = j;
    }
    const small = blocks.filter((b) => b.len === 2 || b.len === 3).length;
    const score = small >= 2 ? clamp(8 + (small - 2) * 3, 0, 25) : 0;
    const next = blocks.at(-1)?.v ?? null;
    return { score, label: small >= 2 ? `Clusters (${small})` : null, next };
  }
  function detectRandom(seq) {
    const { pct } = freqStats(seq);
    const spread = Math.abs(pct.P - pct.B) + Math.abs(pct.P - pct.T) + Math.abs(pct.B - pct.T);
    const score = spread < 40 ? 10 : 0;
    return { score, label: score ? "Random / No clear pattern" : null, next: null };
  }
  function aggregate(seq) {
    const dets = [
      detectStreak(seq),
      detectPingPong(seq),
      detectDouble(seq),
      detectDragonTail(seq),
      detectCluster(seq),
      detectRandom(seq),
    ];
    let best = { score: -1, label: null, next: null, name: null };
    const names = ["Streak", "PingPong", "Double", "DragonTail", "Cluster", "Random"];
    const scores = {};
    dets.forEach((d, i) => {
      scores[names[i]] = d.score;
      if (d.score > best.score) best = { ...d, name: names[i] };
    });
    return { best, scores, dets };
  }
  function decide(probs, gapThreshold, bestPatternNext) {
    const entries = Object.entries(probs).sort((a, b) => b[1] - a[1]);
    const [topK, secondK] = entries;
    const gap = (topK?.[1] ?? 0) - (secondK?.[1] ?? 0);
    let bias = { P: 0, B: 0, T: 0 };
    if (bestPatternNext && (bestPatternNext === "P" || bestPatternNext === "B")) {
      bias[bestPatternNext] = 5;
    }
    const adj = {
      P: clamp((probs.P || 0) + bias.P, 0, 100),
      B: clamp((probs.B || 0) + bias.B, 0, 100),
      T: clamp((probs.T || 0) + bias.T, 0, 100),
    };
    const sortedAdj = Object.entries(adj).sort((a, b) => b[1] - a[1]);
    const [topAdj, secondAdj] = sortedAdj;
    const gapAdj = topAdj[1] - secondAdj[1];
    const shouldBet = gapAdj >= gapThreshold;
    return { shouldBet, choice: shouldBet ? topAdj[0] : "SKIP", gap: Math.round(gapAdj), adjusted: adj };
  }
  function renderUI({ seq, agg, probs, decision }) {
    const last5 = lastN(seq, 5);
    const last5HTML = last5.map((x) => {
      const cls = x === "P" ? "last5-cell last5-P" : x === "B" ? "last5-cell last5-B" : "last5-cell last5-T";
      return `<div class="${cls}">${x}</div>`;
    }).join("");
    const last5Box = ID("last5Results");
    if (last5Box) last5Box.innerHTML = `<div class="last5-grid">${last5HTML || "—"}</div>`;
    const patternsBox = ID("casinoPatterns");
    if (patternsBox) {
      const rows = Object.entries(agg.scores).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<div>• <strong>${k}</strong>: ${v}</div>`).join("");
      patternsBox.innerHTML = `<div><strong>النمط الغالب:</strong> ${agg.best.label || "—"}</div><div style="margin-top:8px">${rows}</div>`;
    }
    const recBox = ID("recommendation");
    if (recBox) {
      let text, cls = "recommendation-box";
      if (decision.choice === "SKIP") {
        text = "⏸️ مكاينش فرق كافي بين النِّسب. متراهنش دابا.";
      } else {
        const side = decision.choice === "P" ? "اللاعب (P)" : decision.choice === "B" ? "البانكر (B)" : "التعادل (T)";
        cls += " " + (decision.choice === "P" ? "P" : decision.choice === "B" ? "B" : "T");
        text = `🎯 التوصية: <strong>${side}</strong> — الفرق المعدّل: <strong>${decision.gap}%</strong>`;
      }
      recBox.innerHTML = `<div class="${cls}"><div>${text}</div><div class="confidence-meter"><div class="confidence-bar" style="width:${clamp(decision.gap,0,100)}%"></div><span>${clamp(decision.gap,0,100)}%</span></div></div>`;
    }
    const adviceBox = ID("aiAdvice");
    if (adviceBox) {
      adviceBox.innerHTML = `<div class="prediction-title">نصيحة سريعة</div><div>النمط الحالي: <strong>${agg.best.label || "غير واضح"}</strong>.</div><div>نسب معدّلة: P=${decision.adjusted.P}% | B=${decision.adjusted.B}% | T=${decision.adjusted.T}%.</div>`;
    }
  }
  window.recomputeAll = function () {
    const seq = getHistory();
    const probs = {
      P: Number((ID("playerProb")?.textContent || "0").replace("%", "")) || 0,
      B: Number((ID("bankerProb")?.textContent || "0").replace("%", "")) || 0,
      T: Number((ID("tieProb")?.textContent || "0").replace("%", "")) || 0,
    };
    const gapThreshold = Number(ID("gapThreshold")?.value || 15);
    const last5 = lastN(seq, 5);
    const agg = aggregate(last5);
    const decision = decide(probs, gapThreshold, agg.best.next);
    renderUI({ seq, agg, probs, decision });
  };
  window.addEventListener("load", () => { try { window.recomputeAll(); } catch (e) {} });
})();


/* ====== W/L + ROI Tracking Module ====== */
(function(){
  const ID = (x) => document.getElementById(x);
  let wlStats = { wins: 0, losses: 0, totalBets: 0 };

  function updateWLUI(){
    const w = ID("wlWins"), l = ID("wlLosses"), r = ID("wlRate");
    if (!w || !l || !r) return;
    w.textContent = wlStats.wins;
    l.textContent = wlStats.losses;
    const rate = wlStats.totalBets ? Math.round((wlStats.wins / wlStats.totalBets) * 100) : 0;
    r.textContent = rate + "%";
    // ROI simple: (wins - losses)/total *100
    const roi = wlStats.totalBets ? Math.round(((wlStats.wins - wlStats.losses) / wlStats.totalBets) * 100) : 0;
    const roiVal = ID("roiValue"), roiBar = ID("roiBar"), roiLabel = ID("roiLabel");
    if (roiVal) roiVal.textContent = roi;
    if (roiBar) roiBar.style.width = Math.max(0, Math.min(100, roi)) + "%";
    if (roiLabel) roiLabel.textContent = roi + "%";
  }

  // Hook into addResult to compare with last recommendation
  function patchWL(){
    const orig = window.addResult;
    if (typeof orig === "function"){
      window.addResult = function(result){
        // Before updating, check decision
        let lastDecision = null;
        if (window.lastDecisionChoice) lastDecision = window.lastDecisionChoice;
        const ret = orig.apply(this, arguments);
        if (lastDecision && lastDecision!=="SKIP"){
          wlStats.totalBets++;
          if (lastDecision===result){
            wlStats.wins++;
          } else if (result!=="T"){ // count as loss only if not Tie
            wlStats.losses++;
          }
          updateWLUI();
        }
        return ret;
      }
    }
  }

  window.addEventListener("load", ()=>{
    patchWL();
    updateWLUI();
  });

  // Ensure recomputeAll stores last decision globally
  const origRecompute = window.recomputeAll;
  if (typeof origRecompute==="function"){
    window.recomputeAll = function(){
      const ret = origRecompute.apply(this, arguments);
      try{
        if (window.lastDecision) {
          window.lastDecisionChoice = window.lastDecision.choice;
        }
      }catch(e){}
      return ret;
    }
  }
})();


/* ====== W/L + ROI Auto Tracking Module ====== */
/*
  - كيحسب الربح/الخسارة و ROI أوتوماتيكياً.
  - كيستعمل توصية recomputeAll الأخيرة (غير إذا كانت SKIP ما كنديروش رهان).
  - Tie كنديروها "Push" => ما كتدخلش فالحساب (لا ربح لا خسارة).
  - Player يدّي 1:1، Banker يدّي 0.95:1.
  - التخزين فـ localStorage بمفتاح 'bacc_stats' و 'bacc_pending_decision'.
*/
(function(){
  const ID = (x)=>document.getElementById(x);

  function loadJSON(key, fallback){
    try{
      const raw = localStorage.getItem(key);
      if(raw) return JSON.parse(raw);
    }catch(e){}
    return fallback;
  }
  function saveJSON(key, obj){
    try{ localStorage.setItem(key, JSON.stringify(obj)); }catch(e){}
  }

  // هيكل الإحصائيات
  function getStats(){
    return loadJSON("bacc_stats", {
      wins: 0,
      losses: 0,
      profit: 0,        // مجموع الربح الصافي بالوحدة
      staked: 0         // مجموع المراهنات لي تحسبو (بدون Push)
    });
  }
  function setStats(s){ saveJSON("bacc_stats", s); }

  function setPendingDecision(d){
    saveJSON("bacc_pending_decision", d || null);
  }
  function getPendingDecision(){
    return loadJSON("bacc_pending_decision", null);
  }

  // استدعاء من recomputeAll مباشرة باش نخزن آخر توصية
  window.__captureDecisionForNextRound = function(decision){
    // نخزنو غير إلا كان قرار رهان واضح (P/B) ومشي SKIP
    if(decision && decision.choice && (decision.choice === "P" || decision.choice === "B")){
      setPendingDecision({
        choice: decision.choice,    // "P" or "B"
        gap: decision.gap || 0,
        ts: Date.now()
      });
    }else{
      // SKIP -> نحيد أي توصية سابقة
      setPendingDecision(null);
    }
  };

  // تسوية الرهان ملي كتزاد نتيجة جديدة (من addResult)
  window.__settleBetWithActual = function(actual){
    const pend = getPendingDecision();
    if(!pend) return; // ماكيناش توصية معلقة

    // نعتبر غير نتائج P/B للتسوية. إذا كان T => Push
    if(actual === "T"){
      setPendingDecision(null);
      renderStats(); // بلا تغيير
      return;
    }

    if(actual !== "P" and actual !== "B"){
      setPendingDecision(null);
      renderStats();
      return;
    }

    const stats = getStats();
    // تسوية
    if(pend.choice === actual){
      // ربح
      stats.wins += 1;
      stats.staked += 1;
      if(actual === "P"){
        stats.profit += 1.0;   // Player 1:1
      }else{
        stats.profit += 0.95;  // Banker 0.95:1
      }
    }else{
      // خسارة
      stats.losses += 1;
      stats.staked += 1;
      stats.profit -= 1.0;
    }
    setStats(stats);
    setPendingDecision(null);
    renderStats();
  };

  function percent(x){ return Math.round(x * 100); }

  // تحديث الواجهة
  window.renderStats = function(){
    const s = getStats();
    const winsEl = ID("wlWins");
    const lossesEl = ID("wlLosses");
    const rateEl = ID("wlRate");

    if(winsEl) winsEl.textContent = String(s.wins);
    if(lossesEl) lossesEl.textContent = String(s.losses);

    const total = s.wins + s.losses;
    const rate = total > 0 ? Math.round((s.wins / total) * 100) : 0;
    if(rateEl) rateEl.textContent = rate + "%";

    // ROI
    const roiEl = ID("roiValue");
    const roiBar = ID("roiBar");
    const roiLabel = ID("roiLabel");

    const roi = s.staked > 0 ? Math.round((s.profit / s.staked) * 100) : 0; // %
    if(roiEl) roiEl.textContent = String(s.profit.toFixed(2));
    if(roiBar) roiBar.style.width = Math.max(0, Math.min(100, Math.abs(roi))) + "%";
    if(roiLabel) roiLabel.textContent = (roi >= 0 ? roi : roi) + "%";
  };

  // Patch addResult: منين كتزاد نتيجة كنصفي الربح/الخسارة للتوصية الأخيرة
  function patchAddResult(){
    const orig = window.addResult;
    if(typeof orig === "function"){
      window.addResult = function(symbol){
        const ret = orig.apply(this, arguments);
        try{ if(window.__settleBetWithActual) window.__settleBetWithActual(symbol); }catch(e){}
        try{ if(window.recomputeAll) window.recomputeAll(); }catch(e){}
        return ret;
      };
    }
  }

  // نداء renderStats على اللود
  window.addEventListener("load", ()=>{
    patchAddResult();
    renderStats();
  });

  // نربط مع recomputeAll باش نمسكو آخر توصية
  const _origRecompute = window.recomputeAll;
  window.recomputeAll = function(){
    if(typeof _origRecompute === "function"){
      _origRecompute();
    }
    try{
      // من بعد ما recomputeAll كتحسب decision داخلها، نلتقطها عبر قراءة DOM المعدل
      // نعاود بناء نفس القرارات هنا لالتقاط قرار حالي بطريقة بسيطة:
      const P = Number((document.getElementById("playerProb")?.textContent || "0").replace("%",""))||0;
      const B = Number((document.getElementById("bankerProb")?.textContent || "0").replace("%",""))||0;
      const T = Number((document.getElementById("tieProb")?.textContent || "0").replace("%",""))||0;
      const gapThreshold = Number(document.getElementById("gapThreshold")?.value || 15);

      // نحاول نقرا من العنصر recommendation النص لاستنتاج القرار الحالي
      const recEl = document.getElementById("recommendation");
      let choice = null;
      if(recEl && recEl.textContent){
        const txt = recEl.textContent;
        if(/اللاعب\s*\(P\)/.test(txt)) choice = "P";
        else if(/البانكر\s*\(B\)/.test(txt)) choice = "B";
        else if(/التعادل\s*\(T\)/.test(txt)) choice = "T";
        else choice = "SKIP";
      }
      const gapMatch = (recEl && recEl.innerHTML.match(/الفرق المعدّل:\s*<strong>(\d+)%<\/strong>/));
      const gap = gapMatch ? parseInt(gapMatch[1], 10) : 0;

      if(window.__captureDecisionForNextRound){
        window.__captureDecisionForNextRound({ choice, gap });
      }
    }catch(e){}
  };

})();
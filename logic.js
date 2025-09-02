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
// Baccarat Predictor — Dark Gold logic (no betting amount, pattern-weighted prediction)
// Features:
// - Window 5..10
// - Pattern detectors: Streak, Ping-Pong, DoublePattern, Pair, Triplet, Cluster, ShoeJump
// - Prediction percentage = weighted sum (pattern weights + frequency + recency)
// - No bet handling (user requested removal)
// - Arabic / English toggle, Day/Night, export/import JSON, win/loss visual effect

const state = {
  rounds: [], // 'P'|'B'|'T'
  windowSize: 5,
};

const weights = {
  // pattern weights (tunable)
  Streak: 0.20,
  'Ping-Pong': 0.15,
  DoublePattern: 0.12,
  Pair: 0.08,
  Triplet: 0.10,
  Cluster: 0.10,
  ShoeJump: 0.12
};

const el = id => document.getElementById(id);

function init(){
  el('windowSize').value = state.windowSize;
  el('applyWindow').onclick = ()=>{ const v = Number(el('windowSize').value); if(v<5||v>10){ alert('Window must be 5..10'); return;} state.windowSize=v; updateAll(); };
  el('btnP').onclick = ()=>pushRound('P');
  el('btnB').onclick = ()=>pushRound('B');
  el('btnT').onclick = ()=>pushRound('T');
  el('btnUndo').onclick = ()=>{ state.rounds.pop(); updateAll(); log('Undo'); };
  el('exportJSON').onclick = ()=>exportJSON();
  el('importJSON').onclick = ()=>importJSON();
  el('langToggle').onchange = ()=>updateLang();
  el('modeToggle').onclick = ()=>toggleMode();
  updateAll();
}

function pushRound(r){
  state.rounds.push(r);
  // compute prediction before pushing? we push and then compute next prediction based on new history
  const pred = predict();
  // visual effect: if the added round equals predicted final -> win effect else loss effect
  const finalCard = el('finalCard');
  const didWin = (r === pred.final);
  finalCard.textContent = (r==='P'?'Player': r==='B'?'Banker':'Tie');
  applyEffect(finalCard, didWin);
  log((didWin? 'Win: ': 'Loss: ') + r + ' | Predicted: ' + pred.final + ' ('+predScoreString(pred)+')');
  updateAll();
}

function predScoreString(pred){
  return `P:${pred.P}% B:${pred.B}% T:${pred.T}%`;
}

function predict(){
  const n = Math.min(state.windowSize, state.rounds.length);
  const recent = state.rounds.slice(-n);
  if(recent.length===0) return {P:33.3, B:33.3, T:33.3, final:'—', patterns:[]};

  // base frequency
  const counts = {P:0,B:0,T:0}; recent.forEach(x=>counts[x]++);
  const baseFreq = {P: counts.P/recent.length, B: counts.B/recent.length, T: counts.T/recent.length};

  // recency weights (more recent rounds stronger)
  const rec = {P:0,B:0,T:0};
  for(let i=0;i<recent.length;i++){
    const r = recent[recent.length-1-i];
    rec[r] += 1/(1+i); // 1, 1/2, 1/3, ...
  }
  const recSum = rec.P + rec.B + rec.T;
  if(recSum>0){ rec.P/=recSum; rec.B/=recSum; rec.T/=recSum; }

  // detect patterns and compute pattern score for each side
  const patterns = detectPatterns(recent);
  const patternScores = {P:0,B:0,T:0};
  patterns.forEach(p => {
    const w = weights[p] || 0;
    // heuristics: map pattern to side(s)
    if(p === 'Streak'){
      const last = recent[recent.length-1];
      patternScores[last] += w;
    } else if(p === 'Ping-Pong'){
      // favor alternate of last
      const last = recent[recent.length-1];
      const alt = last === 'P' ? 'B' : last === 'B' ? 'P' : null;
      if(alt) patternScores[alt] += w;
    } else if(p === 'DoublePattern'){
      const next = inferDoublePattern(recent);
      if(next) patternScores[next] += w;
    } else if(p === 'Pair' || p === 'Triplet' || p === 'Cluster'){
      // favor the majority in recent window
      const maj = majorityOf(recent);
      if(maj) patternScores[maj] += w;
    } else if(p === 'ShoeJump'){
      // small boost to side that increased recently
      const maj = majorityOf(recent);
      if(maj) patternScores[maj] += w*0.7;
    }
  });

  // combine weights: baseFreq 50%, recency 30%, patternScores 20%
  let combined = {};
  combined.P = baseFreq.P*0.5 + rec.P*0.3 + patternScores.P*0.2;
  combined.B = baseFreq.B*0.5 + rec.B*0.3 + patternScores.B*0.2;
  combined.T = baseFreq.T*0.5 + rec.T*0.3 + patternScores.T*0.2;

  // normalize and convert to percentages
  const s = combined.P + combined.B + combined.T || 1;
  combined.P = (combined.P / s * 100).toFixed(1);
  combined.B = (combined.B / s * 100).toFixed(1);
  combined.T = (combined.T / s * 100).toFixed(1);

  const final = Object.keys(combined).reduce((a,b)=> combined[a] > combined[b] ? a : b);

  return {P: combined.P, B: combined.B, T: combined.T, final, patterns};
}

function majorityOf(arr){
  if(arr.length===0) return null;
  const c = {P:0,B:0,T:0}; arr.forEach(x=>c[x]++);
  const max = Math.max(c.P, c.B, c.T);
  if(max === 0) return null;
  if(max === c.P) return 'P';
  if(max === c.B) return 'B';
  if(max === c.T) return 'T';
  return null;
}

// Pattern detectors
function detectPatterns(arr){
  const p = [];
  if(arr.length>=3){
    const last3 = arr.slice(-3);
    if(last3.every(x=>x===last3[0])) p.push('Streak');
  }
  if(arr.length>=4){
    const alt = arr.slice(-4);
    if(alt[0]===alt[2] && alt[1]===alt[3] && alt[0]!==alt[1]) p.push('Ping-Pong');
  }
  if(arr.length>=5){
    const l5 = arr.slice(-5);
    if(l5[0]===l5[1] && l5[2]!==l5[0] && l5[3]===l5[4] && l5[3]===l5[0]) p.push('DoublePattern');
  }
  if(arr.length>=3){
    const a = arr.slice(-3);
    if(a[0]===a[2] && a[0]!==a[1]) p.push('Pair');
  }
  if(arr.length>=3){
    const a = arr.slice(-3);
    if(a.every(x=>x===a[0])) p.push('Triplet');
  }
  if(arr.length>=6){
    const last6 = arr.slice(-6);
    const cnt = {P:0,B:0,T:0}; last6.forEach(x=>cnt[x]++);
    if(cnt.P>=4 || cnt.B>=4) p.push('Cluster');
  }
  if(arr.length>=8){
    const a = arr.slice(-8,-4);
    const b = arr.slice(-4);
    const fa = freqMap(a), fb = freqMap(b);
    if(Math.abs(fb.P - fa.P) > 0.5 || Math.abs(fb.B - fa.B) > 0.5) p.push('ShoeJump');
  }
  return [...new Set(p)];
}

function inferDoublePattern(arr){
  if(arr.length>=5){
    const l5 = arr.slice(-5);
    if(l5[0]===l5[1] && l5[2]!==l5[0] && l5[3]===l5[4] && l5[3]===l5[0]) return l5[2];
  }
  return null;
}
function freqMap(a){ const m={P:0,B:0,T:0}; a.forEach(x=>m[x]++); return {P:m.P/a.length,B:m.B/a.length,T:m.T/a.length}; }

// UI update
function updateAll(){
  renderCounts();
  const out = predict();
  el('pBar').style.width = out.P + '%'; el('pPct').textContent = out.P + '%';
  el('bBar').style.width = out.B + '%'; el('bPct').textContent = out.B + '%';
  el('tBar').style.width = out.T + '%'; el('tPct').textContent = out.T + '%';
  el('finalCard').textContent = (out.final==='P'?'Player': out.final==='B'?'Banker':'Tie');
  // patterns list
  const plist = el('patternList'); plist.innerHTML = '';
  if(out.patterns.length===0){
    const li = document.createElement('li'); li.textContent = 'لا أنماط مكتشفة'; plist.appendChild(li);
  } else {
    out.patterns.forEach(x=>{ const li=document.createElement('li'); li.innerHTML = `<strong>${x}</strong> <span class="small">weight=${weights[x]||0}</span>`; plist.appendChild(li); });
  }
}

// counters
function renderCounts(){
  const c = {P:0,B:0,T:0}; state.rounds.forEach(x=>c[x]++);
  el('pCount').textContent = c.P; el('bCount').textContent = c.B; el('tCount').textContent = c.T;
}

// visual effects
function applyEffect(node, win){
  node.classList.remove('win','loss');
  void node.offsetWidth;
  node.classList.add(win? 'win':'loss');
}

// log helper
function log(txt){
  const node = el('log'); const time = new Date().toLocaleTimeString();
  node.innerHTML = `<div style="padding:8px;border-bottom:1px solid rgba(255,255,255,0.03)"><small class="small">${time}</small><div>${txt}</div></div>` + node.innerHTML;
}

// import/export
function exportJSON(){
  const data = {rounds: state.rounds};
  const blob = new Blob([JSON.stringify(data)], {type:'application/json'});
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'baccarat_rounds_darkgold.json'; a.click(); URL.revokeObjectURL(url);
}
function importJSON(){
  const txt = prompt('Paste JSON: {"rounds":["P","B",...]}');
  if(!txt) return;
  try{
    const obj = JSON.parse(txt);
    if(Array.isArray(obj.rounds)){ state.rounds = obj.rounds.slice(); log('Imported rounds ('+state.rounds.length+')'); updateAll(); }
  }catch(e){ alert('Invalid JSON'); }
}

// language / mode
function updateLang(){
  const v = el('langToggle').value;
  if(v==='ar'){
    document.documentElement.lang='ar';
    el('subtitle').textContent = 'Predictor — توقع ذكي بالقوة ديال الأنماط';
    el('predTitle').textContent = 'توقع الجولة القادمة';
    el('predSub').textContent = 'نسبة الثقة معتمدة على الأنماط';
    el('patternsTitle').textContent = 'مكتشفات الأنماط';
    el('lblP').textContent = 'Player';
    el('lblB').textContent = 'Banker';
    el('lblT').textContent = 'Tie';
    el('applyWindow').textContent = 'تطبيق';
    el('btnUndo').textContent = 'Undo';
  } else {
    document.documentElement.lang='en';
    el('subtitle').textContent = 'Intelligent Baccarat Predictor';
    el('predTitle').textContent = 'Next round prediction';
    el('predSub').textContent = 'Confidence % based on patterns';
    el('patternsTitle').textContent = 'Pattern Detectors';
    el('lblP').textContent = 'Player Count';
    el('lblB').textContent = 'Banker Count';
    el('lblT').textContent = 'Tie Count';
    el('applyWindow').textContent = 'Apply';
    el('btnUndo').textContent = 'Undo';
  }
}

// mode toggle
function toggleMode(){
  const b = document.body;
  if(b.classList.contains('day')){ b.classList.remove('day'); el('modeToggle').textContent = 'نهار'; } else { b.classList.add('day'); el('modeToggle').textContent = 'ليلي'; }
}

// start
init();

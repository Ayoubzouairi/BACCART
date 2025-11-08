// Baccarat Predictor - logic.js
// Features: window 5-10, pattern detectors (Streak, Ping-Pong, DoublePattern, Pair, Triplet, ShoeJump, Cluster),
// Arabic/English, Day/Night, Buttons for P/B/T, percentages, heuristic + AI-like pattern scoring,
// win/loss visual effects, counters, export/import JSON.

const state = {
  rounds: [], // 'P'|'B'|'T'
  windowSize: 5,
  pWins:0, bWins:0, tWins:0,
};

const el = id=>document.getElementById(id);

// init bindings
function init(){
  el('windowSize').value = state.windowSize;
  el('applyWindow').onclick = ()=>{ const v = Number(el('windowSize').value); if(v<5||v>10){ alert('Window must be between 5 and 10'); return;} state.windowSize=v; updateAll(); }
  el('btnP').onclick = ()=>addRound('P');
  el('btnB').onclick = ()=>addRound('B');
  el('btnT').onclick = ()=>addRound('T');
  el('btnUndo').onclick = ()=>{ state.rounds.pop(); updateAll(); log('Undo'); }
  el('langToggle').onchange = ()=>updateLang();
  el('modeToggle').onclick = ()=>toggleMode();
  el('exportJSON').onclick = ()=>downloadJSON();
  el('importJSON').onclick = ()=>importJSON();
  updateAll();
}

// add and update
function addRound(r){
  state.rounds.push(r);
  // update counters
  if(r==='P') state.pWins++; if(r==='B') state.bWins++; if(r==='T') state.tWins++;
  // play visual effect for prediction (simulate resolution): if matches predicted -> win visual else loss
  const pred = predict();
  const final = pred.final;
  const finalCard = el('finalCard');
  let didWin = (r===final);
  finalCard.textContent = (r==='P'?'Player':r==='B'?'Banker':'Tie');
  applyEffect(finalCard, didWin);
  log((didWin? 'Win: ':'Loss: ')+ (r==='P'?'Player':r==='B'?'Banker':'Tie'));
  updateAll();
}

// detection & prediction engine
function predict(){
  const n = Math.min(state.windowSize, state.rounds.length);
  const recent = state.rounds.slice(-n);
  if(recent.length===0) return {P:33.3,B:33.3,T:33.3, final:'—', patterns:[]};
  const counts = {P:0,B:0,T:0}; recent.forEach(x=>counts[x]++);
  // base probability
  const base = {P:counts.P/recent.length, B:counts.B/recent.length, T:counts.T/recent.length};
  // recency weight
  const rec = {P:0,B:0,T:0};
  for(let i=0;i<recent.length;i++){
    const r=recent[recent.length-1-i]; rec[r]+=1/(1+i);
  }
  const recSum = rec.P+rec.B+rec.T; if(recSum>0){ rec.P/=recSum; rec.B/=recSum; rec.T/=recSum; }
  const patterns = detectPatterns(recent);
  const boosts = {P:0,B:0,T:0};
  if(patterns.includes('Streak')){ const last=recent[recent.length-1]; boosts[last]+=0.18; }
  if(patterns.includes('Ping-Pong')){ const last=recent[recent.length-1]; const alt = last==='P'?'B': last==='B'?'P': null; if(alt) boosts[alt]+=0.12; }
  if(patterns.includes('DoublePattern')){ const next = inferDoublePattern(recent); if(next) boosts[next]+=0.12; }
  if(patterns.includes('Pair')){ const last=recent[recent.length-1]; boosts[last]+=0.06; }
  // combine: base 50%, recency 30%, boosts 20%
  let comb = {};
  comb.P = base.P*0.5 + rec.P*0.3 + boosts.P*0.2;
  comb.B = base.B*0.5 + rec.B*0.3 + boosts.B*0.2;
  comb.T = base.T*0.5 + rec.T*0.3 + boosts.T*0.2;
  const sum = comb.P+comb.B+comb.T;
  comb.P = comb.P/sum*100; comb.B = comb.B/sum*100; comb.T = comb.T/sum*100;
  const final = Object.keys(comb).reduce((a,b)=> comb[a]>comb[b]?a:b);
  return {P:comb.P.toFixed(1), B:comb.B.toFixed(1), T:comb.T.toFixed(1), final, patterns};
}

// extended pattern detectors
function detectPatterns(arr){
  const p = [];
  if(arr.length>=3){ const last3 = arr.slice(-3); if(last3.every(x=>x===last3[0])) p.push('Streak'); }
  if(arr.length>=4){ const alt = arr.slice(-4); if(alt[0]===alt[2] && alt[1]===alt[3] && alt[0]!==alt[1]) p.push('Ping-Pong'); }
  if(arr.length>=5){ const l5 = arr.slice(-5); if(l5[0]===l5[1] && l5[2]!==l5[0] && l5[3]===l5[4] && l5[3]===l5[0]) p.push('DoublePattern'); }
  if(arr.length>=3){ const a = arr.slice(-3); if(a[0]===a[2] && a[0]!==a[1]) p.push('Pair'); }
  if(arr.length>=3){ const a = arr.slice(-3); if(a.every(x=>x===a[0])) p.push('Triplet'); }
  if(arr.length>=6){ const last6 = arr.slice(-6); const cnt = {P:0,B:0,T:0}; last6.forEach(x=>cnt[x]++); if(cnt.P>=4 || cnt.B>=4) p.push('Cluster'); }
  if(arr.length>=8){ const a = arr.slice(-8,-4); const b = arr.slice(-4); const fa=freqMap(a), fb=freqMap(b); if(Math.abs(fb.P-fa.P)>0.5 || Math.abs(fb.B-fa.B)>0.5) p.push('ShoeJump'); }
  return [...new Set(p)];
}
function inferDoublePattern(arr){ if(arr.length>=5){ const l5 = arr.slice(-5); if(l5[0]===l5[1] && l5[2]!==l5[0] && l5[3]===l5[4] && l5[3]===l5[0]) return l5[2]; } return null; }
function freqMap(a){ const m={P:0,B:0,T:0}; a.forEach(x=>m[x]++); return {P:m.P/a.length,B:m.B/a.length,T:m.T/a.length}; }

// UI updates
function updateAll(){
  renderRounds();
  const out = predict();
  el('pBar').style.width = out.P + '%'; el('pPct').textContent = out.P + '%';
  el('bBar').style.width = out.B + '%'; el('bPct').textContent = out.B + '%';
  el('tBar').style.width = out.T + '%'; el('tPct').textContent = out.T + '%';
  el('finalCard').textContent = (out.final==='P'?'Player':out.final==='B'?'Banker': 'Tie');
  // patterns
  const plist = el('patternList'); plist.innerHTML=''; out.patterns.forEach(x=>{ const li=document.createElement('li'); li.textContent = x; plist.appendChild(li); });
  // stats
  el('pWins').textContent = state.pWins; el('bWins').textContent = state.bWins; el('tWins').textContent = state.tWins;
  // log summary
  const log = el('log'); log.innerHTML = '<div class="small">Recent: '+ state.rounds.slice(-20).join(', ') + '</div>' + log.innerHTML;
}

// visual effects
function applyEffect(node, win){
  node.classList.remove('win','loss');
  void node.offsetWidth;
  node.classList.add(win? 'win':'loss');
}
// logging
function log(txt){
  const node = el('log'); const time = new Date().toLocaleTimeString(); node.innerHTML = `<div style="padding:6px;border-bottom:1px solid rgba(255,255,255,0.03)"><small class="small">${time}</small><div>${txt}</div></div>` + node.innerHTML;
}

// import / export
function downloadJSON(){
  const data = {rounds: state.rounds, pWins: state.pWins, bWins: state.bWins, tWins: state.tWins};
  const blob = new Blob([JSON.stringify(data)], {type:'application/json'});
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='baccarat_rounds.json'; a.click(); URL.revokeObjectURL(url);
}
function importJSON(){
  const txt = prompt('Paste JSON data ({"rounds":["P","B",...]})');
  if(!txt) return;
  try{
    const obj = JSON.parse(txt);
    if(Array.isArray(obj.rounds)){ state.rounds = obj.rounds.slice(); state.pWins = obj.pWins||0; state.bWins = obj.bWins||0; state.tWins = obj.tWins||0; updateAll(); log('Imported data'); }
  }catch(e){ alert('Invalid JSON'); }
}

// language & mode
function updateLang(){
  const v = el('langToggle').value;
  if(v==='ar'){
    document.documentElement.lang='ar';
    document.getElementById('subtitle').textContent = 'توقعات باكارات — Intelligent Predictor';
    document.getElementById('predTitle').textContent = 'توقع النتيجة التالية';
    document.getElementById('predSub').textContent = 'نسبة الثقة';
    document.getElementById('windowLabelText').textContent = 'نافذة التحليل (5 - 10)';
    el('applyWindow').textContent = 'تطبيق';
    el('btnUndo').textContent = 'Undo';
  } else {
    document.documentElement.lang='en';
    document.getElementById('subtitle').textContent = 'Intelligent Baccarat Predictor';
    document.getElementById('predTitle').textContent = 'Next round prediction';
    document.getElementById('predSub').textContent = 'Confidence %';
    document.getElementById('windowLabelText').textContent = 'Window size (5 - 10)';
    el('applyWindow').textContent = 'Apply';
    el('btnUndo').textContent = 'Undo';
  }
}

// day/night
function toggleMode(){
  const body = document.body;
  if(body.classList.contains('day')){ body.classList.remove('day'); el('modeToggle').textContent = 'نهار'; } else { body.classList.add('day'); el('modeToggle').textContent = 'ليلي'; }
}

// render rounds list (simple)
function renderRounds(){
  // no visible rounds list in this version; show top summary
  const log = el('log');
  // keep existing entries but ensure max length
  while(log.children.length>200) log.removeChild(log.lastChild);
}

// start
init();

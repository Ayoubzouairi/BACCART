// Baccarat Strategy App (Ayoub edition)
// Core state
const state = {
  bankroll: 2000,
  baseBet: 50,
  antiMartingale: true,
  antiCap: 2,
  takeProfit: 500,
  stopLoss: 500,
  // session
  history: [], // {round, outcome: 'P'|'B'|'T', betSide: 'P'|'B'|null, betAmt, pl, bankroll}
  pendingBet: null, // {side:'P'|'B', amt:number}
};

// Utilities
const $ = (id) => document.getElementById(id);
const fmt = (n) => Intl.NumberFormat('ar-MA').format(Math.round(n));

function persist() {
  localStorage.setItem('bacc_state_v1', JSON.stringify(state));
}
function restore() {
  const raw = localStorage.getItem('bacc_state_v1');
  if (!raw) return;
  try {
    const saved = JSON.parse(raw);
    Object.assign(state, saved);
  } catch {}
}

// Pattern detection
function getRecentOutcomes(n=10) {
  return state.history.slice(-n).map(h => h.outcome).filter(x => x === 'P' || x === 'B');
}

function detectStreak() {
  const arr = getRecentOutcomes(50);
  if (arr.length === 0) return {len: 0, side: null};
  let len = 1;
  let side = arr[arr.length - 1];
  for (let i = arr.length - 2; i >= 0; i--) {
    if (arr[i] === side) len++;
    else break;
  }
  return {len, side};
}

function isPingPong() {
  const arr = getRecentOutcomes(6);
  if (arr.length < 4) return false;
  // check last 4 alternate
  const last4 = arr.slice(-4);
  return (last4[0] !== last4[1] && last4[1] !== last4[2] && last4[2] !== last4[3] &&
          last4[0] === last4[2] && last4[1] === last4[3]);
}

function detectDoublePattern() {
  // Look for pairs: A A B B A A ...
  const arr = getRecentOutcomes(10);
  if (arr.length < 4) return {active:false};
  // compute run lengths from end
  let runs = [];
  let cur = arr[arr.length-1], len = 1;
  for (let i = arr.length-2; i>=0; i--) {
    if (arr[i] === cur) len++;
    else {
      runs.push({side: cur, len});
      cur = arr[i]; len = 1;
    }
  }
  runs.push({side: cur, len});
  // We only care about last two runs
  const r1 = runs[0]; // most recent
  const r2 = runs[1];
  if (!r2) return {active:false};
  // Double pattern signal if r1.len <=2 and r2.len === 2 or vice versa
  const nearPair = (l) => (l === 1 || l === 2);
  if (nearPair(r1.len) && nearPair(r2.len)) {
    return {active:true, lastRun:r1, prevRun:r2};
  }
  return {active:false};
}

// Recommendation logic
function nextRecommendation() {
  const streak = detectStreak();
  const pingpong = isPingPong();
  const dbl = detectDoublePattern();
  let reason = "";
  let side = null;

  if (streak.len >= 2) {
    side = streak.side;
    reason = `Streak ${streak.len}× على ${side === 'P' ? 'Player' : 'Banker'} — تابع السلسلة.`;
  } else if (pingpong) {
    // continue alternation: pick the opposite of last
    const arr = getRecentOutcomes(2);
    const last = arr[arr.length-1];
    side = last === 'P' ? 'B' : 'P';
    reason = "نمط Ping‑Pong ظاهر — تابع التناوب.";
  } else if (dbl.active) {
    // If last run length =1 → expect to complete the pair
    // If last run length =2 → expect switch to the other side to start the next pair
    if (dbl.lastRun.len === 1) {
      side = dbl.lastRun.side; // complete the pair
      reason = "Double Pattern: كمّل الزوج (2 في نفس الجهة).";
    } else {
      side = dbl.lastRun.side === 'P' ? 'B' : 'P';
      reason = "Double Pattern: بدّل الجهة بعد اكتمال الزوج.";
    }
  } else {
    // default slight edge: Banker
    side = 'B';
    reason = "لا يوجد نمط واضح — Banker له أفضلية طفيفة إحصائياً.";
  }

  const last = state.history[state.history.length - 1];
  // Bet amount suggestion
  let amt = state.baseBet;
  if (state.antiMartingale && last && last.pl > 0) {
    const doubled = (last.betAmt || state.baseBet) * 2;
    const capAmt = state.baseBet * state.antiCap;
    amt = Math.min(doubled, capAmt);
  }
  // guard against exceeding bankroll
  amt = Math.min(amt, state.bankroll);

  return {side, amt, reason};
}

// Payout calc
function settleRound(outcome) {
  const round = state.history.length + 1;
  const betSide = state.pendingBet?.side ?? null;
  const betAmt  = state.pendingBet?.amt ?? 0;

  let pl = 0;
  if (betSide && betAmt > 0) {
    if (outcome === 'T') {
      pl = 0; // push
    } else if (betSide === outcome) {
      // win
      if (outcome === 'B') pl = betAmt * 0.95; else pl = betAmt * 1.0;
    } else {
      // lose
      pl = -betAmt;
    }
    state.bankroll += pl;
  }

  const entry = { round, outcome, betSide, betAmt, pl, bankroll: state.bankroll };
  state.history.push(entry);
  state.pendingBet = null;
  persist();
  refreshUI();
  drawAllRoads();
  checkRiskLimits();
}

// Risk limits
function checkRiskLimits() {
  const diff = state.bankroll - (initialBankroll());
  if (state.takeProfit > 0 && diff >= state.takeProfit) {
    notify(`🎉 وصلت لهدف الربح +${fmt(diff)} درهم. من الأفضل توقف.`);
  }
  if (state.stopLoss > 0 && -diff >= state.stopLoss) {
    notify(`⚠️ وصلت لحد الخسارة −${fmt(-diff)} درهم. وقف باش تحمي رصيدك.`);
  }
}

function initialBankroll() {
  // first recorded bankroll from first session
  const first = JSON.parse(localStorage.getItem('bacc_first_bankroll') || 'null');
  if (first != null) return first;
  localStorage.setItem('bacc_first_bankroll', String(state.bankroll));
  return state.bankroll;
}

// UI
function refreshUI() {
  $('bankrollLabel').textContent = fmt(state.bankroll) + ' درهم';
  $('currentBetLabel').textContent = state.pendingBet ? `${state.pendingBet.side === 'P' ? 'Player' : 'Banker'} • ${fmt(state.pendingBet.amt)}` : '—';

  // Fill table
  const tbody = $('historyBody');
  tbody.innerHTML = '';
  state.history.forEach(h => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${h.round}</td>
      <td>${h.outcome === 'P' ? 'Player' : (h.outcome === 'B' ? 'Banker' : 'Tie')}</td>
      <td>${h.betSide ? (h.betSide === 'P' ? 'Player' : 'Banker') : '—'}</td>
      <td>${h.betAmt ? fmt(h.betAmt) : '—'}</td>
      <td class="${h.pl > 0 ? 'profit' : (h.pl < 0 ? 'loss' : '')}">${h.pl ? (h.pl>0?'+':'')+fmt(h.pl) : '0'}</td>
      <td>${fmt(h.bankroll)}</td>
    `;
    tbody.appendChild(tr);
  });

  // Patterns
  const streak = detectStreak();
  const ping  = isPingPong();
  const dbl   = detectDoublePattern();
  const list  = $('patternList');
  list.innerHTML = `
    <li>Streak: ${streak.len > 0 ? `${streak.len}× على ${streak.side === 'P' ? 'Player' : 'Banker'}` : '—'}</li>
    <li>Ping-Pong: ${ping ? 'ظاهر' : '—'}</li>
    <li>Double Pattern: ${dbl.active ? `نشط (آخر ركضة ${dbl.lastRun.len} على ${dbl.lastRun.side==='P'?'Player':'Banker'})` : '—'}</li>
  `;

  // Recommendation
  const rec = nextRecommendation();
  $('recSide').textContent = rec.side === 'P' ? 'اقتراح: Player' : 'اقتراح: Banker';
  $('recBet').textContent = `مبلغ مقترح: ${fmt(rec.amt)} درهم`;
  $('recWhy').textContent = rec.reason;
}

// Notifications
let notifyTimeout = null;
function notify(text) {
  if (notifyTimeout) clearTimeout(notifyTimeout);
  let n = document.querySelector('.toast');
  if (!n) {
    n = document.createElement('div');
    n.className = 'toast';
    document.body.appendChild(n);
  }
  n.textContent = text;
  n.style.opacity = '1';
  notifyTimeout = setTimeout(()=>{ n.style.opacity = '0'; }, 3500);
}

// Handlers
function placeBet(side) {
  const rec = nextRecommendation();
  const amt = rec.amt;
  if (amt <= 0) { notify('لا يوجد رصيد كافٍ للرهان.'); return; }
  state.pendingBet = { side, amt };
  persist();
  refreshUI();
  drawAllRoads();
}

function saveSettings() {
  state.bankroll = Number($('bankrollInput').value || 0);
  state.baseBet  = Number($('baseBetInput').value || 0);
  state.antiMartingale = $('antiMartingaleToggle').checked;
  state.antiCap  = Math.max(1, Number($('antiMartingaleCap').value || 1));
  state.takeProfit = Number($('takeProfitInput').value || 0);
  state.stopLoss   = Number($('stopLossInput').value || 0);
  localStorage.removeItem('bacc_first_bankroll');
  initialBankroll(); // set new baseline
  persist();
  refreshUI();
  drawAllRoads();
  notify('✅ تم حفظ الإعدادات.');
}

function resetAll() {
  if (!confirm('هل تريد إعادة الضبط الكامل؟')) return;
  const bank = state.bankroll; // keep current bankroll as baseline
  Object.assign(state, {
    bankroll: bank,
    baseBet: 50,
    antiMartingale: true,
    antiCap: 2,
    takeProfit: 500,
    stopLoss: 500,
    history: [],
    pendingBet: null,
  });
  localStorage.removeItem('bacc_first_bankroll');
  localStorage.setItem('bacc_first_bankroll', String(state.bankroll));
  persist();
  refreshUI();
  drawAllRoads();
}

function clearHistory() {
  if (!confirm('مسح السجل؟')) return;
  state.history = [];
  state.pendingBet = null;
  persist();
  refreshUI();
  drawAllRoads();
}

function undoLast() {
  if (state.history.length === 0) return;
  // revert bankroll to previous entry
  const last = state.history.pop();
  if (typeof last.bankroll === 'number') {
    // If we stored balance after round, we can recompute by reading previous
    const prev = state.history[state.history.length-1];
    state.bankroll = prev ? prev.bankroll : Number($('bankrollInput').value || state.bankroll);
  }
  persist();
  refreshUI();
  drawAllRoads();
}

// Outcome buttons
function setOutcome(o) {
  settleRound(o);
}

// Init
function init() {
  restore();
  // Fill settings UI from state
  $('bankrollInput').value = state.bankroll;
  $('baseBetInput').value = state.baseBet;
  $('antiMartingaleToggle').checked = state.antiMartingale;
  $('antiMartingaleCap').value = state.antiCap;
  $('takeProfitInput').value = state.takeProfit;
  $('stopLossInput').value = state.stopLoss;

  $('saveSettings').addEventListener('click', saveSettings);
  $('resetAll').addEventListener('click', resetAll);

  $('betPlayer').addEventListener('click', ()=>placeBet('P'));
  $('betBanker').addEventListener('click', ()=>placeBet('B'));
  $('betFollow').addEventListener('click', ()=>{
    const rec = nextRecommendation();
    placeBet(rec.side);
  });

  $('outcomePlayer').addEventListener('click', ()=>setOutcome('P'));
  $('outcomeBanker').addEventListener('click', ()=>setOutcome('B'));
  $('outcomeTie').addEventListener('click', ()=>setOutcome('T'));

  $('clearHistory').addEventListener('click', clearHistory);
  $('undoLast').addEventListener('click', undoLast);

  refreshUI();
  drawAllRoads();
}

document.addEventListener('DOMContentLoaded', init);

// ---- Export PNG helpers ----
function exportCanvasPNG(canvasId, filename) {
  const cv = document.getElementById(canvasId);
  if (!cv) { notify('لوحة غير موجودة: ' + canvasId); return; }
  const link = document.createElement('a');
  link.download = filename || (canvasId + '.png');
  link.href = cv.toDataURL('image/png');
  link.click();
}

function wireExportButtons() {
  document.querySelectorAll('[data-export]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-export');
      exportCanvasPNG(id, id + '.png');
    });
  });
  const expAll = document.getElementById('exportAllRoads');
  if (expAll) {
    expAll.addEventListener('click', () => {
      ['beadCanvas','bigRoadCanvas','bigEyeCanvas','smallRoadCanvas','cockroachCanvas']
        .forEach(id => exportCanvasPNG(id, id + '.png'));
      notify('تم تصدير جميع اللوحات ✅');
    });
  }
}

document.addEventListener('DOMContentLoaded', wireExportButtons);


/* Roads Logic */
function outcomesOnlyPB() {
  return state.history.filter(h => h.outcome==='P' || h.outcome==='B' || h.outcome==='T')
                      .map(h => h.outcome);
}

// Bead Plate: fill 6 rows by columns, includes T as green.
function drawBeadPlate() {
  const cv = document.getElementById('beadCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const cols = 14, rows = 6; // 14x6 grid
  const w = cv.width, h = cv.height;
  const cw = w/cols, rh = h/rows;

  // bg grid
  ctx.clearRect(0,0,w,h);
  ctx.strokeStyle = '#1f2940';
  for (let i=0;i<=cols;i++){ ctx.beginPath(); ctx.moveTo(i*cw,0); ctx.lineTo(i*cw,h); ctx.stroke(); }
  for (let j=0;j<=rows;j++){ ctx.beginPath(); ctx.moveTo(0,j*rh); ctx.lineTo(w,j*rh); ctx.stroke(); }

  const seq = outcomesOnlyPB(); // include T
  let c=0,r=0;
  for (let k=0;k<seq.length && c<cols;k++) {
    const o = seq[k];
    const cx = c*cw + cw/2;
    const cy = r*rh + rh/2;
    // color
    let color = (o==='B') ? '#ff4b5c' : (o==='P' ? '#3aa8ff' : '#29cc6a');
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(cw,rh)*0.35, 0, Math.PI*2);
    ctx.fillStyle = color;
    ctx.fill();
    r++;
    if (r>=rows){ r=0; c++; }
  }
}

// Build Big Road from P/B only (ignore T)

function buildBigRoad() {
  // Build Big Road with classic placement rules:
  // - Start at top-left (col 0, row 0)
  // - Same outcome as previous: try to go down; if blocked or bottom reached, move right (same row)
  // - Different outcome: move to next column, start at top row (row 0)
  const seq = state.history.map(h=>h.outcome).filter(x => x==='P' || x==='B'); // ignore T
  const rows = 6;
  const grid = []; // grid[col][row]
  let col = 0, row = 0;
  let prev = null;

  function setCell(c, r, v){
    if (!grid[c]) grid[c] = new Array(rows).fill(null);
    grid[c][r] = v;
  }
  function getCell(c, r){
    if (!grid[c]) return null;
    return grid[c][r];
  }

  for (let i=0;i<seq.length;i++){
    const cur = seq[i];
    if (prev === null){
      // first
      col = 0; row = 0;
      setCell(col, row, cur);
      prev = cur;
      continue;
    }
    if (cur === prev){
      // try go down
      if (row+1 < rows && !getCell(col, row+1)){
        row = row+1;
      } else {
        // blocked -> move right, same row
        col = col+1;
        // ensure not overwriting; if occupied (rare), slide further right until empty
        while (getCell(col, row)) { col = col+1; }
      }
    } else {
      // switch side -> new column, row 0
      col = col+1;
      row = 0;
      // if occupied (shouldn't in well-formed road), slide right
      while (getCell(col, row)) { col = col+1; }
    }
    setCell(col, row, cur);
    prev = cur;
  }

  return grid; // grid[col][row] = 'P'|'B'|null
}


function drawBigRoad() {
  const cv = document.getElementById('bigRoadCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const grid = buildBigRoad();
  const cols = Math.min(grid.length, 28);
  const rows = 6;
  const w = cv.width, h = cv.height;
  const cw = w/Math.max(cols,1), rh = h/rows;

  ctx.clearRect(0,0,w,h);
  ctx.strokeStyle = '#1f2940';
  for (let i=0;i<=cols;i++){ ctx.beginPath(); ctx.moveTo(i*cw,0); ctx.lineTo(i*cw,h); ctx.stroke(); }
  for (let j=0;j<=rows;j++){ ctx.beginPath(); ctx.moveTo(0,j*rh); ctx.lineTo(w,j*rh); ctx.stroke(); }

  for (let c=0;c<cols;c++) {
    for (let r=0;r<rows;r++) {
      const v = grid[c]?.[r] || null;
      if (!v) continue;
      const cx = c*cw + cw/2, cy = r*rh + rh/2;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(cw,rh)*0.35, 0, Math.PI*2);
      ctx.fillStyle = (v==='B') ? '#ff4b5c' : '#3aa8ff';
      ctx.fill();
    }
  }
  return grid;
}

// Derived roads use comparative rules based on Big Road.
// We'll implement standard approximations:
// - Big Eye: compare length/structure of columns (starting from col index 1)
// - Small: shift by one more column
// - Cockroach: shift by two more columns
function buildDerivedRoad(grid, offset) {
  // grid[col][row] P/B/null
  const rows = 6;
  const res = []; // sequence of 'R'|'B' markers
  const ncol = grid.length;
  function colDepth(ci) {
    let d=0; for (let r=0;r<rows;r++){ if (grid[ci]?.[r]) d++; else break; } return d;
  }
  for (let c=0;c<ncol;c++) {
    const depth = colDepth(c);
    for (let r=0;r<depth;r++) {
      // only from certain starting column per rule
      if (c < offset) continue;
      // Rule: red if depth of column c - offset equals depth of column c - offset -1, else blue.
      const a = colDepth(c - offset);
      const b = colDepth(c - offset - 1);
      if (a === b) res.push('R'); else res.push('B');
    }
  }
  return res;
}

function drawDotsSequence(cvId, seq, cols=30, rows=6) {
  const cv = document.getElementById(cvId);
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const w = cv.width, h = cv.height;
  const cw = w/cols, rh = h/rows;
  ctx.clearRect(0,0,w,h);
  ctx.strokeStyle = '#1f2940';
  for (let i=0;i<=cols;i++){ ctx.beginPath(); ctx.moveTo(i*cw,0); ctx.lineTo(i*cw,h); ctx.stroke(); }
  for (let j=0;j<=rows;j++){ ctx.beginPath(); ctx.moveTo(0,j*rh); ctx.lineTo(w,j*rh); ctx.stroke(); }
  // fill down then next column (like bead style)
  let c=0,r=0;
  for (let i=0;i<seq.length && c<cols;i++) {
    const color = (seq[i]==='R') ? '#ff4b5c' : '#3aa8ff';
    const cx = c*cw + cw/2, cy = r*rh + rh/2;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(cw,rh)*0.3, 0, Math.PI*2);
    ctx.fillStyle = color;
    ctx.fill();
    r++; if (r>=rows){ r=0; c++; }
  }
}

function drawAllRoads() {
  drawBeadPlate();
  const grid = drawBigRoad();
  if (!grid) return;
  // Derived
  const bigEye = buildDerivedRoad(grid, 1);
  const small  = buildDerivedRoad(grid, 2);
  const cock   = buildDerivedRoad(grid, 3);
  drawDotsSequence('bigEyeCanvas', bigEye, 21, 6);
  drawDotsSequence('smallRoadCanvas', small, 21, 6);
  drawDotsSequence('cockroachCanvas', cock, 21, 6);
}

// Styles for toast (injected via JS if needed)
const style = document.createElement('style');
style.textContent = `.toast{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#121826;border:1px solid #2e3f62;color:#e8eef7;padding:10px 14px;border-radius:12px;box-shadow:0 6px 18px rgba(0,0,0,.35);opacity:0;transition:opacity .2s;font-size:14px;z-index:1000}`;
document.head.appendChild(style); 

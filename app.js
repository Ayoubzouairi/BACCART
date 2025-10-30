// Simple Baccarat prediction logic based on last 5 rounds
const balanceEl = document.getElementById('balance');
const betInput = document.getElementById('betInput');
const historyList = document.getElementById('historyList');
const pctPlayer = document.getElementById('pctPlayer');
const pctBanker = document.getElementById('pctBanker');
const pctTie = document.getElementById('pctTie');
const logBox = document.getElementById('logBox');

let balance = 1000;
let history = []; // store last results as 'Player' | 'Banker' | 'Tie'

function saveState(){ localStorage.setItem('bacc_state', JSON.stringify({balance, history})); }
function loadState(){
  try{
    const s = JSON.parse(localStorage.getItem('bacc_state')||'{}');
    if(s.balance) balance = s.balance;
    if(Array.isArray(s.history)) history = s.history.slice(0,5);
  }catch(e){}
}
loadState();
render();

function render(){
  balanceEl.textContent = balance;
  historyList.innerHTML = '';
  history.slice().reverse().forEach((h, i)=>{
    const d = document.createElement('div');
    d.className='pill';
    d.textContent = h;
    historyList.appendChild(d);
  });
  updatePrediction();
  saveState();
}

function updatePrediction(){
  // Basic algorithm:
  // Count occurrences in last 5 rounds, then give a small bias towards the less frequent outcome (simple contrarian heuristic),
  // and favor Banker slightly because of house edge simulation.
  const counts = {Player:0,Banker:0,Tie:0};
  history.forEach(h=>{ counts[h] = (counts[h]||0)+1; });
  const total = Math.max(1, history.length);
  // Base percentages from frequency
  let pPlayer = (counts.Player/total)*100;
  let pBanker = (counts.Banker/total)*100;
  let pTie = (counts.Tie/total)*100;
  // Contrarian adjustment: slightly increase chance for the least frequent
  const minKey = Object.keys(counts).reduce((a,b)=>counts[a]<=counts[b]?a:b);
  if(counts[minKey] < 2){
    if(minKey === 'Player') pPlayer += 8;
    if(minKey === 'Banker') pBanker += 8;
    if(minKey === 'Tie') pTie += 4;
  }
  // Small banker bias
  pBanker += 3;
  // Normalize
  const sum = pPlayer + pBanker + pTie;
  pPlayer = Math.round((pPlayer / sum)*100);
  pBanker = Math.round((pBanker / sum)*100);
  pTie = 100 - pPlayer - pBanker;
  pctPlayer.textContent = pPlayer;
  pctBanker.textContent = pBanker;
  pctTie.textContent = pTie;
}

function addResult(r){
  history.push(r);
  if(history.length>5) history.shift();
  render();
  appendLog('أضيفت نتيجة: ' + r);
}

function appendLog(text){
  const p = document.createElement('div');
  p.textContent = new Date().toLocaleTimeString() + ' — ' + text;
  logBox.prepend(p);
}

// manual add buttons
document.getElementById('addPlayer').addEventListener('click',()=>addResult('Player'));
document.getElementById('addBanker').addEventListener('click',()=>addResult('Banker'));
document.getElementById('addTie').addEventListener('click',()=>addResult('Tie'));
document.getElementById('clearHistory').addEventListener('click',()=>{
  history = []; render(); appendLog('تم مسح التاريخ');
});

// Betting buttons simulate a round result randomly but weighted by prediction
function simulateBet(choice){
  const bet = Number(betInput.value) || 10;
  if(bet <= 0 || bet > balance){ alert('دخل مبلغ صالح أو أكبر من الرصيد'); return; }
  // get current prediction percentages
  const p = {
    Player: Number(pctPlayer.textContent) || 33,
    Banker: Number(pctBanker.textContent) || 33,
    Tie: Number(pctTie.textContent) || 34
  };
  // simulate outcome according to these weights
  const rand = Math.random()*100;
  let cum = 0;
  let outcome = 'Player';
  for(const key of ['Player','Banker','Tie']){
    cum += p[key];
    if(rand <= cum){ outcome = key; break; }
  }
  // payout rules: Player 1:1, Banker 0.95:1, Tie 8:1 (but many casinos pay 8)
  if(outcome === choice){
    let win = 0;
    if(choice === 'Player') win = bet;
    if(choice === 'Banker') win = Math.floor(bet * 0.95);
    if(choice === 'Tie') win = bet * 8;
    balance += win;
    appendLog('ربحت ' + win + ' (لعبت ' + choice + ' — النتيجة ' + outcome + ')');
  } else {
    balance -= bet;
    appendLog('خسرت ' + bet + ' (لعبت ' + choice + ' — النتيجة ' + outcome + ')');
  }
  addResult(outcome);
  render();
}

document.getElementById('betPlayer').addEventListener('click',()=>simulateBet('Player'));
document.getElementById('betBanker').addEventListener('click',()=>simulateBet('Banker'));
document.getElementById('betTie').addEventListener('click',()=>simulateBet('Tie'));

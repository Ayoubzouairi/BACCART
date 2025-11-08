// Logic.js for AYBOUB BACCARAT PRO FULL
const state={
  rounds:[], windowSize:5, 
  count:{P:0,B:0,T:0}, 
  win:{P:0,B:0,T:0}, loss:{P:0,B:0,T:0},
  patterns:{Streak:0,PingPong:0,DoublePattern:0,Pair:0,Triplet:0,ShoeJump:0,Cluster:0}
};

const el=id=>document.getElementById(id);

function init(){
  el('windowSize').value=state.windowSize;
  el('applyWindow').onclick=()=>{const v=Number(el('windowSize').value);if(v<5||v>10){alert('Window must be 5..10');return}state.windowSize=v;updateAll()};
  el('btnP').onclick=()=>pushRound('P');
  el('btnB').onclick=()=>pushRound('B');
  el('btnT').onclick=()=>pushRound('T');
  el('btnUndo').onclick=()=>{state.rounds.pop();updateAll();log('Undo')};
  el('btnReset').onclick=()=>{state.rounds=[];state.count={P:0,B:0,T:0};state.win={P:0,B:0,T:0};state.loss={P:0,B:0,T:0};updateAll();log('Reset')};
  updateAll();
}

function pushRound(r){
  state.rounds.push(r);
  state.count[r]++;
  updatePatterns();
  const pred=predict();
  const didWin=(r===pred.final);
  if(didWin) state.win[r]++; else state.loss[r]++;
  el('finalCard').textContent=(r==='P'?'Player':r==='B'?'Banker':'Tie');
  applyEffect(el('finalCard'),didWin);
  log((didWin?'Win: ':'Loss: ')+r+' | Predicted: '+pred.final+' ('+predScoreString(pred)+')');
  updateAll();
}

function predScoreString(pred){return `P:${pred.P}% B:${pred.B}% T:${pred.T}%`}

// حساب الأنماط الشائعة بشكل مبسط (مثال) 
function updatePatterns(){
  const recent=state.rounds.slice(-state.windowSize);
  state.patterns.Streak=0; state.patterns.PingPong=0; state.patterns.DoublePattern=0;
  state.patterns.Pair=0; state.patterns.Triplet=0; state.patterns.ShoeJump=0; state.patterns.Cluster=0;
  // مثال: العد البسيط حسب تكرار الجولات الأخيرة
  let streak=1;
  for(let i=1;i<recent.length;i++){if(recent[i]===recent[i-1]) streak++;}
  state.patterns.Streak=streak;
}

function predict(){
  const n=Math.min(state.windowSize,state.rounds.length);
  const recent=state.rounds.slice(-n);
  if(recent.length===0) return {P:33.3,B:33.3,T:33.3,final:'—'};
  const counts={P:0,B:0,T:0};
  recent.forEach(x=>counts[x]++);
  const baseFreq={P:counts.P/recent.length,B:counts.B/recent.length,T:counts.T/recent.length};
  let final=Object.entries(baseFreq).sort((a,b)=>b[1]-a[1])[0][0];
  return {P:(baseFreq.P*100).toFixed(1),B:(baseFreq.B*100).toFixed(1),T:(baseFreq.T*100).toFixed(1),final};
}

function log(msg){const lg=el('log');const d=document.createElement('div');d.textContent=msg;lg.appendChild(d);lg.scrollTop=lg.scrollHeight;}
function updateAll(){renderStats();renderBigRoad();renderPatterns();}
function renderStats(){
  el('pTotal').textContent=state.count.P; el('bTotal').textContent=state.count.B; el('tTotal').textContent=state.count.T;
  el('pWin').textContent=state.win.P; el('bWin').textContent=state.win.B; el('tWin').textContent=state.win.T;
  el('pLoss').textContent=state.loss.P; el('bLoss').textContent=state.loss.B; el('tLoss').textContent=state.loss.T;
  el('pPct').textContent=((state.win.P/(state.win.P+state.loss.P||1))*100).toFixed(1)+'%';
  el('bPct').textContent=((state.win.B/(state.win.B+state.loss.B||1))*100).toFixed(1)+'%';
  el('tPct').textContent=((state.win.T/(state.win.T+state.loss.T||1))*100).toFixed(1)+'%');
}

function renderBigRoad(){
  const canvas=el('bigRoad'); const ctx=canvas.getContext('2d'); ctx.clearRect(0,0,canvas.width,canvas.height);
  const size=30; let x=0,y=0;
  for(let i=0;i<state.rounds.length;i++){
    const r=state.rounds[i];
    ctx.fillStyle=r==='P'?'#2d7ef7':r==='B'?'#e03b3b':'#28a745';
    ctx.fillRect(x*size,y*size,size-2,size-2);
    y++; if(y*size>=canvas.height){y=0;x++;}
  }
}

function renderPatterns(){
  const ul=el('patternList'); ul.innerHTML='';
  for(const [k,v] of Object.entries(state.patterns)){
    const li=document.createElement('li'); li.textContent=k+' : '+v; ul.appendChild(li);
  }
}

function applyEffect(elm,win){elm.style.transition='0.3s';elm.style.transform=win?'scale(1.2)':'scale(0.9)';setTimeout(()=>{elm.style.transform='scale(1)';},300);}

window.onload=init;

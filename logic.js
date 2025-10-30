// logic.js — Baccarat Predictor logic (heuristic-based)
function normInput(ch){
  if(!ch) return '';
  ch = ch.toUpperCase().trim();
  if(ch === 'P' || ch === 'PLAYER' || ch === '1') return 'P';
  if(ch === 'B' || ch === 'BANKER' || ch === '2') return 'B';
  if(ch === 'T' || ch === 'TIE' || ch === '0') return 'T';
  return '';
}

function readRounds(){
  const ids = ['r1','r2','r3','r4','r5'];
  const arr = ids.map(id => normInput(document.getElementById(id).value));
  return arr;
}

function simpleHeuristic(rounds){
  const counts = {P:0,B:0,T:0};
  rounds.forEach(r => { if(r) counts[r]++; });
  const totalKnown = counts.P + counts.B + counts.T;
  let p = counts.P / Math.max(1,totalKnown);
  let b = counts.B / Math.max(1,totalKnown);
  let t = counts.T / Math.max(1,totalKnown);

  const last = rounds.slice(-2);
  if(last[0] && last[0] === last[1]){
    if(last[1] === 'P') p += 0.08;
    if(last[1] === 'B') b += 0.08;
    if(last[1] === 'T') t += 0.06;
  }

  const alt4 = rounds.slice(-4).every((v,i,a)=> v && a[i-1] && (i===0 || v !== a[i-1]));
  if(alt4){
    const opp = {P:'B', B:'P', T:'P'};
    const lastVal = rounds[rounds.length-1];
    if(opp[lastVal]) {
      if(opp[lastVal]==='P') p += 0.07;
      if(opp[lastVal]==='B') b += 0.07;
    }
  }

  b += 0.03;

  p = Math.max(0, p);
  b = Math.max(0, b);
  t = Math.max(0, t);
  const s = p+b+t || 1;
  p = p/s; b = b/s; t = t/s;

  return {
    counts, p: Math.round(p*1000)/10, b: Math.round(b*1000)/10, t: Math.round(t*1000)/10,
    explanation: explain(rounds, counts)
  };
}

function explain(rounds, counts){
  const parts = [];
  parts.push('التوزيع: Player='+counts.P+', Banker='+counts.B+', Tie='+counts.T+'.');
  const last = rounds.slice(-2);
  if(last[0] && last[0] === last[1]) parts.push('كاين ستريك فآخر جوج جولات ('+last[1]+'). هادشي كيعطي ميل طفيف للاستمرار.');
  const alt4 = rounds.slice(-4).every((v,i,a)=> v && a[i-1] && (i===0 || v !== a[i-1]));
  if(alt4) parts.push('كاين نمط alternation (ping-pong) فالآخر 4 جولات — ممكن يرجع النمط ويعطي الأفضلية للعكس.');
  parts.push('تم تطبيق تعديل بسيط لفائدة Banker بسبب ميزة العائد.');
  return parts.join(' ');
}

document.getElementById('analyze').addEventListener('click', ()=>{
  const rounds = readRounds();
  if(rounds.filter(Boolean).length < 3){
    document.getElementById('analysis').innerHTML = '<p class="small">دخل على الأقل 3 نتائج من آخر 5 جولات باش نحسب.</p>';
    return;
  }
  const res = simpleHeuristic(rounds);
  const html = '<p class="small">'+res.explanation+'</p><p>التوزيع المستعمل: '+JSON.stringify(res.counts)+'</p>';
  document.getElementById('analysis').innerHTML = html;
  const list = document.getElementById('pred-list');
  list.innerHTML = '<li>Player: '+res.p+'%</li><li>Banker: '+res.b+'%</li><li>Tie: '+res.t+'%</li>';
});

document.getElementById('fill-sample').addEventListener('click', ()=>{
  const sample = ['P','B','P','P','B'];
  ['r1','r2','r3','r4','r5'].forEach((id,i)=> document.getElementById(id).value = sample[i]);
});

\
(function(){
  const I18N = {
    ar: {
      title: 'BACCARAT SPEED — تحليل باكارات',
      subtitle: 'يدوي • تحليل الأنماط • تصدير/استيراد',
      player: 'PLAYER', banker: 'BANKER', tie: 'TIE', analyze: 'حلّل الآن', sample: 'مثال',
      history: 'سجل الجولات', beadroad: 'Beadroad (Mini)', analysis: 'التحليل و الاكتشاف', stats: 'إحصائيات',
      no_analysis: 'مازال ما تم التحليل', import_label: 'استيراد CSV / لصق:', export_label: 'تصدير السجل:',
      footer: 'نسخة متقدمة — BACCARAT SPEED'
    },
    en: {
      title: 'BACCARAT SPEED — Baccarat Analysis', subtitle: 'Manual • Pattern detection • Import/Export',
      player: 'PLAYER', banker: 'BANKER', tie: 'TIE', analyze: 'Analyze', sample: 'Sample',
      history: 'Recent rounds', beadroad: 'Beadroad (Mini)', analysis: 'Analysis & Patterns', stats: 'Stats',
      no_analysis: 'No analysis yet', import_label: 'Import CSV / Paste:', export_label: 'Export log:',
      footer: 'Advanced — BACCARAT SPEED'
    }
  };

  const $ = id => document.getElementById(id);
  const btnP = $('btn-player'), btnB = $('btn-banker'), btnT = $('btn-tie');
  const pctP = $('pct-player'), pctB = $('pct-banker'), pctT = $('pct-tie');
  const historyEl = $('history'), beadEl = $('beadroad'), analysisEl = $('analysis');
  const undoBtn = $('undo'), resetBtn = $('reset'), analyzeBtn = $('analyze'), sampleBtn = $('fill-sample');
  const importText = $('import-text'), doImport = $('do-import'), clearImport = $('clear-import');
  const exportCsv = $('export-csv'), downloadJson = $('download-json');
  const langAr = $('lang-ar'), langEn = $('lang-en'), audioToggle = $('audio-toggle');

  let rounds = JSON.parse(localStorage.getItem('bacc_rounds') || '[]');
  let lang = localStorage.getItem('bacc_lang') || 'ar';
  let audioEnabled = localStorage.getItem('bacc_audio') !== 'false';

  function save(){ localStorage.setItem('bacc_rounds', JSON.stringify(rounds)); localStorage.setItem('bacc_lang', lang); localStorage.setItem('bacc_audio', audioEnabled); }
  function norm(x){ if(!x) return ''; x = x.toString().toUpperCase().trim(); if(x==='P'||x==='PLAYER'||x==='1') return 'P'; if(x==='B'||x==='BANKER'||x==='2') return 'B'; if(x==='T'||x==='TIE'||x==='0') return 'T'; return ''; }
  function addRound(r){ const n=norm(r); if(!n) return; rounds.push(n); if(rounds.length>1000) rounds = rounds.slice(-1000); save(); renderAll(); }
  function undo(){ rounds.pop(); save(); renderAll(); }
  function resetAll(){ rounds = []; save(); renderAll(); }

  function countsOf(arr){ const c={P:0,B:0,T:0}; arr.forEach(x=>{ if(x) c[x]++; }); return c; }

  function heuristic(arr){
    const counts = countsOf(arr);
    const total = Math.max(1, counts.P+counts.B+counts.T);
    let p = counts.P/total, b = counts.B/total, t = counts.T/total;
    const last2 = arr.slice(-2); if(last2[0] && last2[0]===last2[1]){ if(last2[1]==='P') p+=0.08; if(last2[1]==='B') b+=0.08; if(last2[1]==='T') t+=0.06; }
    let run=1; for(let i=arr.length-1;i>0;i--){ if(arr[i]===arr[i-1]) run++; else break; }
    if(run>=3){ const side=arr[arr.length-1]; if(side==='P') p+=0.06; if(side==='B') b+=0.06; }
    const last4 = arr.slice(-4);
    if(last4.length===4 && last4[0]===last4[1] && last4[2]===last4[3] && last4[1]!==last4[2]){ const fav = {P:'B',B:'P',T:'P'}[last4[3]]; if(fav==='P') p+=0.07; if(fav==='B') b+=0.07; }
    const alt = arr.slice(-4).length===4 && arr.slice(-4).every((v,i,a)=> i===0 || v!==a[i-1]);
    if(alt){ const last=arr[arr.length-1]; const opp={P:'B',B:'P',T:'P'}[last]; if(opp==='P') p+=0.06; if(opp==='B') b+=0.06; }
    b += 0.03;
    p = Math.max(0,p); b = Math.max(0,b); t = Math.max(0,t); const s = p+b+t || 1; p = Math.round((p/s)*1000)/10; b = Math.round((b/s)*1000)/10; t = Math.round((t/s)*1000)/10;
    return {counts,p,b,t};
  }

  function detectPatterns(arr){
    const patterns = [];
    if(arr.length<2) return patterns;
    let streak=1; for(let i=arr.length-1;i>0;i--){ if(arr[i]===arr[i-1]) streak++; else break; }
    if(streak>=2) patterns.push(`Streak: ${streak} x ${arr[arr.length-1]}`);
    const last4 = arr.slice(-4); if(last4.length===4 && last4.every((v,i,a)=> i===0 || v!==a[i-1])) patterns.push('Ping-Pong (alternation) in last 4');
    if(last4.length===4 && last4[0]===last4[1] && last4[2]===last4[3] && last4[1]!==last4[2]) patterns.push(`Double pattern: ${last4.join('')}`);
    const last5 = arr.slice(-5); const c = countsOf(last5); const maxSide = Object.keys(c).reduce((a,b)=> c[a]>=c[b]? a:b, 'P'); if(last5.length>=3 && c[maxSide]>=3) patterns.push(`Majority in last 5: ${maxSide} (${c[maxSide]}/${last5.length})`);
    return patterns;
  }

  function renderHistory(){ historyEl.innerHTML=''; if(rounds.length===0){ historyEl.innerText='—'; return; } rounds.forEach((r,i)=>{ const d=document.createElement('div'); d.className='history-item'; d.innerText=r; historyEl.appendChild(d); }); }
  function renderBeadroad(){ beadEl.innerHTML=''; if(rounds.length===0) return; const last = rounds.slice(-100); last.forEach(x=>{ const b=document.createElement('div'); b.className='bead '+(x==='P'?'p': x==='B'?'b':'t'); beadEl.appendChild(b); }); }
  function renderStats(){ const c = countsOf(rounds); $('stat-p').innerText = c.P; $('stat-b').innerText = c.B; $('stat-t').innerText = c.T; $('stat-total').innerText = (c.P+c.B+c.T); }
  function renderAnalysis(){ if(rounds.length===0){ analysisEl.innerHTML = `<p class="muted">${I18N[lang].no_analysis}</p>`; pctP.innerText='—'; pctB.innerText='—'; pctT.innerText='—'; return; } const h = heuristic(rounds); const pats = detectPatterns(rounds); pctP.innerText = h.p + '%'; pctB.innerText = h.b + '%'; pctT.innerText = h.t + '%'; let html = `<p class="muted">Distribution P:${h.counts.P} B:${h.counts.B} T:${h.counts.T}</p>`; if(pats.length===0) html += '<p>No strong patterns detected.</p>'; else { html += '<ul>'; pats.forEach(p=> html+=`<li>${p}</li>`); html += '</ul>'; } const best = h.p >= h.b && h.p >= h.t ? 'PLAYER' : (h.b >= h.p && h.b >= h.t ? 'BANKER' : 'TIE'); html += `<p><strong>Suggested next:</strong> ${best} (${Math.max(h.p,h.b,h.t)}%)</p>`; analysisEl.innerHTML = html; }
  function renderAll(){ renderHistory(); renderBeadroad(); renderStats(); renderAnalysis(); }

  function importFromText(txt){ if(!txt) return; const parts = txt.split(/[,\\s]+/).map(s=> norm(s)).filter(Boolean); if(parts.length===0) return; rounds = rounds.concat(parts); if(rounds.length>1000) rounds = rounds.slice(-1000); save(); renderAll(); }
  function exportCSV(){ if(rounds.length===0) return alert('No data'); const csv = rounds.join(','); const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'baccarat_rounds.csv'; document.body.appendChild(a); a.click(); a.remove(); }
  function downloadJSON(){ const blob = new Blob([JSON.stringify(rounds)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'baccarat_rounds.json'; document.body.appendChild(a); a.click(); a.remove(); }

  btnP.addEventListener('click', ()=> addRound('P')); btnB.addEventListener('click', ()=> addRound('B')); btnT.addEventListener('click', ()=> addRound('T'));
  undoBtn.addEventListener('click', ()=> { undo(); }); resetBtn.addEventListener('click', ()=> { if(confirm('Reset all rounds?')) resetAll(); });
  analyzeBtn.addEventListener('click', ()=> renderAnalysis()); sampleBtn.addEventListener('click', ()=> { rounds = ['P','B','P','P','B']; save(); renderAll(); });
  doImport.addEventListener('click', ()=> { importFromText(importText.value); importText.value=''; }); clearImport.addEventListener('click', ()=> importText.value='');
  exportCsv.addEventListener('click', ()=> exportCSV()); downloadJson.addEventListener('click', ()=> downloadJSON());
  langAr.addEventListener('click', ()=> { setLang('ar'); }); langEn.addEventListener('click', ()=> { setLang('en'); });
  audioToggle.addEventListener('change', (e)=> { audioEnabled = e.target.checked; save(); });

  function setLang(l){ lang = l; localStorage.setItem('bacc_lang', l); renderI18n(); }
  function renderI18n(){ const dict = I18N[lang]||I18N.ar; document.querySelectorAll('[data-i18n]').forEach(el=>{ const k = el.getAttribute('data-i18n'); if(dict[k]) el.innerText = dict[k]; }); langAr.classList.toggle('active', lang==='ar'); langEn.classList.toggle('active', lang==='en'); }

  renderI18n(); renderAll();
  window.addRoundFromLive = function(v){ addRound(v); };
  function $('id'){ return document.getElementById(id); } // helper used in renderStats
})();
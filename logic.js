// Offline, no dependencies. ES5-compatible.
(function(){
  var history = [];
  var themeLight = false;

  function $(id){ return document.getElementById(id); }
  function tag(letter){ var d=document.createElement('div'); d.className='tag '+letter; d.textContent=letter; return d; }

  // Bind buttons
  window.addEventListener('DOMContentLoaded', function(){
    // Theme
    $('toggleTheme').addEventListener('click', function(){
      themeLight = !themeLight;
      document.body.classList.toggle('light', themeLight);
    });

    // Buttons
    $('btnP').addEventListener('click', function(){ addResult('P'); });
    $('btnB').addEventListener('click', function(){ addResult('B'); });
    $('btnT').addEventListener('click', function(){ addResult('T'); });
    $('btnR').addEventListener('click', resetData);

    // Init
    $('debug').textContent = '✅ JS loaded — Offline mode';
    refreshAll();
  });

  // Core
  function addResult(r){
    if(!r || (r!=='P' && r!=='B' && r!=='T')) return;
    history.push(r);
    refreshAll();
  }

  function resetData(){
    history = [];
    refreshAll();
  }

  function refreshAll(){
    renderHistory();
    renderLast5();
    renderBigRoad();
    var probs = predict();
    renderBars(probs);
    renderRecommendation(probs);
    renderPatterns();
  }

  function renderHistory(){
    var box = $('history'); box.innerHTML='';
    for(var i=0;i<history.length;i++){ box.appendChild(tag(history[i])); }
  }

  function renderLast5(){
    var box = $('last5'); box.innerHTML='';
    var last = history.slice(-5);
    if(last.length===0){ box.innerHTML = '<span class="badge warn">لا توجد بيانات كافية</span>'; return; }
    last.forEach(function(x){ box.appendChild(tag(x)); });
    var cP=0,cB=0,cT=0; for(var i=0;i<last.length;i++){ if(last[i]==='P')cP++; else if(last[i]==='B')cB++; else cT++; }
    var info = document.createElement('div');
    info.innerHTML = '<div class="badge ok">P: '+cP+'/5</div> <div class="badge ok">B: '+cB+'/5</div> <div class="badge ok">T: '+cT+'/5</div>';
    box.appendChild(info);
  }

  function renderBigRoad(){
    var grid = $('bigRoad'); grid.innerHTML='';
    // Very simple Big Road: place tokens column-wise with streak wrapping rows (max 6 rows)
    var col = -1, row = 0, last = null, run = 0;
    for(var i=0;i<history.length;i++){
      var r = history[i];
      if(r===last){ run++; if(run>5){ run=0; col++; } } else { col++; row=0; run=0; last = r; }
      var cell = document.createElement('div');
      cell.className = 'big-cell big-'+r;
      cell.textContent = (r==='T'?'T':(r==='P'?'P':'B'));
      cell.style.gridColumn = (col+1);
      cell.style.gridRow = (row+1);
      grid.appendChild(cell);
      row = (row+1)%6;
    }
  }

  // Simple Markov predictor (first-order)
  function predict(){
    if(history.length<2){ return {P:33.3,B:33.3,T:33.3}; }
    var counts = {P:{P:0,B:0,T:0}, B:{P:0,B:0,T:0}, T:{P:0,B:0,T:0}};
    for(var i=1;i<history.length;i++){
      var prev = history[i-1], cur = history[i];
      counts[prev][cur] += 1;
    }
    var last = history[history.length-1];
    var tot = counts[last].P + counts[last].B + counts[last].T;
    var P = tot? (counts[last].P/tot)*100 : 33.3;
    var B = tot? (counts[last].B/tot)*100 : 33.3;
    var T = tot? (counts[last].T/tot)*100 : 33.3;

    // Pattern-based nudges
    var pats = detectPatterns();
    for(var k=0;k<pats.length;k++){
      var p = pats[k];
      var w = p.weight || 0.08;
      if(p.bias==='P'){ P += 10*w*p.confidence; B -= 5*w*p.confidence; T -= 5*w*p.confidence; }
      if(p.bias==='B'){ B += 10*w*p.confidence; P -= 5*w*p.confidence; T -= 5*w*p.confidence; }
      if(p.bias==='T'){ T += 8*w*p.confidence; P -= 4*w*p.confidence; B -= 4*w*p.confidence; }
    }

    // Normalize
    var s = Math.max(P,0)+Math.max(B,0)+Math.max(T,0);
    if(s<=0) return {P:33.3,B:33.3,T:33.3};
    return {P:(P/s)*100, B:(B/s)*100, T:(T/s)*100};
  }

  function renderBars(p){
    var pP = Math.round(p.P), pB = Math.round(p.B), pT = Math.round(p.T);
    $('barP').style.width = pP + '%'; $('txtP').textContent = pP + '%';
    $('barB').style.width = pB + '%'; $('txtB').textContent = pB + '%';
    $('barT').style.width = pT + '%'; $('txtT').textContent = pT + '%';
  }

  function bestKey(p){ var m = Math.max(p.P,p.B,p.T); if(m===p.P) return 'P'; if(m===p.B) return 'B'; return 'T'; }

  function renderRecommendation(p){
    var k = bestKey(p), v = Math.max(p.P,p.B,p.T);
    var msg = (k==='P'?'🔵 إحتمال لاعب أعلى':'') + (k==='B'?'🔴 إحتمال مصرفي أعلى':'') + (k==='T'?'🟢 إحتمال تعادل أعلى':'');
    $('recBox').innerHTML = '<b>التوصية:</b> '+ msg + ' — ثقة ~ '+ Math.round(v) + '%';
  }

  // Pattern detectors
  function detectPatterns(){
    var res = [];
    var s = history.join('');

    function push(name,conf,bias,weight,desc){
      res.push({name:name, confidence:conf, bias:bias, weight:weight||0.08, description:desc||''});
    }

    if(history.length<5) return res;

    // Dragon (long streak >=6)
    var mDragon = /(P{6,}|B{6,})$/.exec(s);
    if(mDragon){ var bias = mDragon[0][0]==='P'?'P':'B'; push('Dragon',0.9,bias,0.15,'سلسلة طويلة'); }

    // ZigZag (alternating at least 6)
    var mZig = /(PB){3,}$|(BP){3,}$/.exec(s);
    if(mZig){ var last = history[history.length-1]; var nextBias = (last==='P')?'B':'P'; push('ZigZag',0.85,nextBias,0.12,'تناوب منتظم'); }

    // Double Pattern (PPBB or BBPP) repeating pairs
    var mDouble = /((PP|BB){2,})$/.exec(s);
    if(mDouble){ var lastPair = s.slice(-2); var biasD = lastPair==='PP'?'B':(lastPair==='BB'?'P':null); push('Double',0.8,biasD||'P',0.10,'زوج زوج'); }

    // 5P/5B (five consecutive)
    var m5 = /(P{5}|B{5})$/.exec(s);
    if(m5){ var b5 = m5[0][0]==='P'?'P':'B'; push('5P/5B',0.85,b5,0.1,'خمسة متتالية'); }

    // 3T+ (3 ties)
    var m3t = /(T{3,})$/.exec(s);
    if(m3t){ push('3T+',0.75,'T',0.07,'3 تعادلات'); }

    // Diamond (PBPBP or BPBPB)
    var mDia = /(PBPBP|BPBPB)$/.exec(s);
    if(mDia){ var last = history[history.length-1]; var biasDia = (last==='P')?'B':'P'; push('Diamond',0.7,biasDia,0.1,'نمط ماسة'); }

    // 8-8 balance in last 16
    if(history.length>=16){
      var last16 = history.slice(-16), cP=0,cB=0;
      for(var i=0;i<16;i++){ if(last16[i]==='P')cP++; else if(last16[i]==='B')cB++; }
      if(cP===8 && cB===8){ push('8-8',0.65,(history[history.length-1]==='P'?'B':'P'),0.08,'توازن 8 ضد 8'); }
    }

    // Cockroach (i vs i-3)
    if(history.length>=7){
      var cock=0; for(var j=3;j<history.length;j++){ if(history[j]===history[j-3]) cock++; }
      if(cock>3){ var last = history[history.length-1]; push('Cockroach', Math.min(0.8, 0.3 + cock/history.length), (last==='P'?'P':(last==='B'?'B':'T')), 0.09, 'تكرار كل 3'); }
    }

    // Double Tie (TT + next)
    var mDT = /TT[PB]$/.exec(s);
    if(mDT){ var nx = s.slice(-1); push('Double Tie',0.7,nx==='P'?'P':'B',0.07,'تعادلان متتاليان'); }

    // Historic repeat of last 5
    var last5 = history.slice(-5).join('');
    if(last5.length===5){
      var cnt=0;
      for(var k=0;k<=history.length-5-5;k++){
        if(history.slice(k,k+5).join('')===last5) cnt++;
      }
      if(cnt>0){ push('Historic', Math.min(0.9, 0.6 + 0.1*cnt), null, 0.05, 'تكرار سابق لنمط آخر 5'); }
    }
    return res;
  }

  function renderPatterns(){
    var pats = detectPatterns();
    var box = $('patterns'); box.innerHTML='';
    if(pats.length===0){ box.innerHTML = '<span class="badge warn">لا أنماط قوية حالياً</span>'; return; }
    for(var i=0;i<pats.length && i<6;i++){
      var p = pats[i]; 
      var row = document.createElement('div');
      row.className='badge ok';
      row.textContent = p.name + ' — ثقة ' + Math.round(p.confidence*100) + '%';
      box.appendChild(row);
    }
  }

  // Expose minimal API (optional)
  window.__BACC_OFFLINE__ = { addResult:addResult, resetData:resetData };

})();
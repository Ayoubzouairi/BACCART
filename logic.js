(function(){
  // ====== STATE ======
  var history = [];
  var themeLight = false;
  var WEIGHTS = {Dragon:0.15,ZigZag:0.12,Double:0.10,"5P/5B":0.10,"3T+":0.07,Diamond:0.10,"8-8":0.08,Cockroach:0.09,"Double Tie":0.07,Historic:0.05};

  // ====== UTIL ======
  function $(id){ return document.getElementById(id); }
  function tag(letter){ var d=document.createElement('div'); d.className='tag '+letter; d.textContent=letter; return d; }
  function clamp01(x){ return x<0?0:(x>100?100:x); }
  function bestKey(p){ var m=Math.max(p.P,p.B,p.T); return (m===p.P?'P':(m===p.B?'B':'T')); }
  function saveHistory(){ try{ localStorage.setItem('bacc_history', history.join('')); }catch(e){} }
  function loadHistory(){ try{ var s=localStorage.getItem('bacc_history')||''; history = s.split('').filter(function(c){return c==='P'||c==='B'||c==='T';}); }catch(e){ history=[]; } }

  // ====== BINDINGS ======
  window.addEventListener('DOMContentLoaded', function(){
    loadHistory();
    $('btnP').addEventListener('click', function(){ addResult('P'); });
    $('btnB').addEventListener('click', function(){ addResult('B'); });
    $('btnT').addEventListener('click', function(){ addResult('T'); });
    $('btnR').addEventListener('click', resetData);
    var tbtn = $('toggleTheme'); if (tbtn) tbtn.addEventListener('click', function(){ themeLight=!themeLight; document.body.classList.toggle('light', themeLight); });
    $('debug').textContent = '✅ JS loaded — FULL';
    refreshAll();
  });

  // ====== CORE ======
  function addResult(r){ if(!r||(r!=='P'&&r!=='B'&&r!=='T'))return; history.push(r); saveHistory(); refreshAll(); }
  function resetData(){ if(!confirm('تأكيد إعادة التعيين؟')) return; history=[]; saveHistory(); refreshAll(); }

  function refreshAll(){
    renderHistory(); renderLast5(); renderBigRoad();
    var probs = predict();
    renderBars(probs); renderRec(probs); renderPatterns();
    var sig = computeDerivativeSignals();
    $('debug').textContent = '✅ JS loaded — signal: ' + sig.toFixed(2);
  }

  function renderHistory(){ var box=$('history'); box.innerHTML=''; for(var i=0;i<history.length;i++){ box.appendChild(tag(history[i])); } }
  function renderLast5(){ var box=$('last5'); box.innerHTML=''; var last=history.slice(-5); if(!last.length){ box.innerHTML='<span class="badge warn">لا توجد بيانات</span>'; return; } for(var i=0;i<last.length;i++){ box.appendChild(tag(last[i])); } var cP=0,cB=0,cT=0; for(var j=0;j<last.length;j++){ if(last[j]==='P')cP++; else if(last[j]==='B')cB++; else cT++; } var info=document.createElement('div'); info.innerHTML='<div class="badge ok">P: '+cP+'/5</div> <div class="badge ok">B: '+cB+'/5</div> <div class="badge ok">T: '+cT+'/5</div>'; box.appendChild(info); }
  function renderBigRoad(){ var grid=$('bigRoad'); grid.innerHTML=''; var col=-1,row=0,last=null,run=0; for(var i=0;i<history.length;i++){ var r=history[i]; if(r===last){ run++; if(run>5){ run=0; col++; } } else { col++; row=0; run=0; last=r; } var cell=document.createElement('div'); cell.className='big-cell big-'+r; cell.textContent=(r==='T'?'T':(r==='P'?'P':'B')); cell.style.gridColumn=(col+1); cell.style.gridRow=(row+1); grid.appendChild(cell); row=(row+1)%6; } }
  function renderBars(p){ var pP=Math.round(p.P), pB=Math.round(p.B), pT=Math.round(p.T); $('barP').style.width=pP+'%'; $('txtP').textContent=pP+'%'; $('barB').style.width=pB+'%'; $('txtB').textContent=pB+'%'; $('barT').style.width=pT+'%'; $('txtT').textContent=pT+'%'; }
  function renderRec(p){ var k=bestKey(p), v=Math.max(p.P,p.B,p.T); var msg=(k==='P'?'🔵 إحتمال لاعب أعلى':'')+(k==='B'?'🔴 إحتمال مصرفي أعلى':'')+(k==='T'?'🟢 إحتمال تعادل أعلى':''); $('recBox').innerHTML='<b>التوصية:</b> '+msg+' — ثقة ~ '+Math.round(v)+'%'; }

  // ====== PREDICTION ======
  function predict(){ if(history.length<2){ return {P:33.3,B:33.3,T:33.3}; } var counts={P:{P:0,B:0,T:0}, B:{P:0,B:0,T:0}, T:{P:0,B:0,T:0}}; for(var i=1;i<history.length;i++){ var prev=history[i-1], cur=history[i]; counts[prev][cur]+=1; } var last=history[history.length-1]; var tot=counts[last].P+counts[last].B+counts[last].T; var P=tot?(counts[last].P/tot)*100:33.3; var B=tot?(counts[last].B/tot)*100:33.3; var T=tot?(counts[last].T/tot)*100:33.3; var final={P:P,B:B,T:T}; var pats=detectPatterns(); for(var k=0;k<pats.length;k++){ var p=pats[k]; var w=WEIGHTS[p.name]||0.05; if(p.bias==='P'){ final.P+=12*w*p.confidence*100; final.B-=6*w*p.confidence*100; final.T-=6*w*p.confidence*100; } if(p.bias==='B'){ final.B+=12*w*p.confidence*100; final.P-=6*w*p.confidence*100; final.T-=6*w*p.confidence*100; } if(p.bias==='T'){ final.T+=10*w*p.confidence*100; final.P-=5*w*p.confidence*100; final.B-=5*w*p.confidence*100; } } var s=Math.max(final.P,0)+Math.max(final.B,0)+Math.max(final.T,0); if(s<=0) final={P:33.3,B:33.3,T:33.3}; else { final.P=(final.P/s)*100; final.B=(final.B/s)*100; final.T=(final.T/s)*100; } final=applyConfidenceByDerivatives(final); return final; }

  // ====== PATTERNS ======
  function detectPatterns(){ var res=[]; var s=history.join(''); function push(name,conf,bias,desc){ res.push({name:name,confidence:conf,bias:bias||null,desc:desc||''}); } if(history.length<5) return res;
    var mDragon=/(P{6,}|B{6,})$/.exec(s); if(mDragon){ var biasD=mDragon[0][0]==='P'?'P':'B'; push('Dragon',0.90,biasD,'سلسلة طويلة'); }
    var mZig=/(PB){3,}$|(BP){3,}$/.exec(s); if(mZig){ var last=history[history.length-1]; var nextBias=(last==='P')?'B':'P'; push('ZigZag',0.85,nextBias,'تناوب منتظم'); }
    var mDouble=/((PP|BB){2,})$/.exec(s); if(mDouble){ var lastPair=s.slice(-2); var bias=(lastPair==='PP'?'B':(lastPair==='BB'?'P':null)); push('Double',0.80,bias,'زوج زوج'); }
    var m5=/(P{5}|B{5})$/.exec(s); if(m5){ var b5=m5[0][0]==='P'?'P':'B'; push('5P/5B',0.85,b5,'خمسة متتالية'); }
    var m3t=/(T{3,})$/.exec(s); if(m3t){ push('3T+',0.75,'T','ثلاثة تعادلات'); }
    var mDia=/(PBPBP|BPBPB)$/.exec(s); if(mDia){ var lastD=history[history.length-1]; var bD=(lastD==='P')?'B':'P'; push('Diamond',0.70,bD,'نمط ماسة'); }
    if(history.length>=16){ var last16=history.slice(-16),cP=0,cB=0; for(var i=0;i<16;i++){ if(last16[i]==='P')cP++; else if(last16[i]==='B')cB++; } if(cP===8&&cB===8){ var b88=(history[history.length-1]==='P'?'B':'P'); push('8-8',0.65,b88,'توازن 8 ضد 8'); } }
    if(history.length>=7){ var cock=0; for(var j=3;j<history.length;j++){ if(history[j]===history[j-3]) cock++; } if(cock>3){ var lastC=history[history.length-1]; var bC=(lastC==='P'?'P':(lastC==='B'?'B':'T')); var confC=Math.min(0.8,0.3+cock/history.length); push('Cockroach',confC,bC,'تكرار كل 3'); } }
    var mDT=/TT[PB]$/.exec(s); if(mDT){ var nx=s.slice(-1); push('Double Tie',0.70,(nx==='P'?'P':'B'),'تعادلان متتاليان'); }
    var last5=history.slice(-5).join(''); if(last5.length===5){ var cnt=0; for(var k2=0;k2<=history.length-10;k2++){ if(history.slice(k2,k2+5).join('')===last5) cnt++; } if(cnt>0){ push('Historic',Math.min(0.9,0.6+0.1*cnt),null,'تكرار سابق'); } }
    res.sort(function(a,b){ return b.confidence - a.confidence; }); return res; }

  // ====== DERIVATIVES (approx) ======
  function computeDerivativeSignals(){ var s=history, n=s.length, score=0, votes=0; if(n>=6){ var sw=0; for(var i=n-5;i<n;i++){ if(s[i]!==s[i-1]) sw++; } var bigEye=(sw<=1)?+1:(sw===2?+0.5:(sw===3?0:-0.6)); score+=bigEye; votes++; } if(n>=7){ var match3=0, windows=0; for(var k=n-6; k<=n-3; k++){ if(k>=2){ var a=s[k-2]+s[k-1]+s[k]; var b=s[k-1]+s[k]+s[k+1]; windows++; if(a===b) match3++; } } var ratio=windows?(match3/windows):0; var small=ratio>0.6?+0.7:(ratio>0.4?+0.3:(ratio>0.25?0:-0.5)); score+=small; votes++; } if(n>=7){ var cock=0, checks=0; for(var j=3;j<n;j++){ checks++; if(s[j]===s[j-3]) cock++; } var cRatio=checks?(cock/checks):0; var cSig=cRatio>0.6?+0.6:(cRatio>0.45?+0.3:(cRatio>0.3?0:-0.4)); score+=cSig; votes++; } if(!votes) return 0; var avg=score/votes; if(avg>1)avg=1; if(avg<-1)avg=-1; return avg; }
  function applyConfidenceByDerivatives(probs){ var signal=computeDerivativeSignals(); var boost=signal*8; var k=bestKey(probs); var P=probs.P, B=probs.B, T=probs.T; if(boost!==0){ if(k==='P'){ P=clamp01(P+boost); } else if(k==='B'){ B=clamp01(B+boost); } else { T=clamp01(T+boost); } var sum=P+B+T; if(sum!==100){ var sc=100/sum; P*=sc; B*=sc; T*=sc; } } return {P:P,B:B,T:T}; }

  // EXPORT
  window.BACC={addResult:addResult, resetData:resetData};
})();
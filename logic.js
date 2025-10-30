// logic.js — full Baccarat Predictor with manual input buttons, reset, language toggle, and localStorage
(function(){
  // i18n strings
  const I18N = {
    ar: {
      title: 'BACCARAT SPEED — Baccarat AI Predictor',
      enter_last5: 'دخل نتائج آخر 5 جولات',
      hint: 'استعمل الحروف: P = Player, B = Banker, T = Tie',
      player: 'Player',
      banker: 'Banker',
      tie: 'Tie',
      reset: 'Reset',
      history: 'سجل آخر الجولات',
      analyze: 'حلّل و تنبأ',
      sample: 'عطيني مثال',
      result: 'النتيجة',
      no_analysis: 'مازال ما تم التحليل',
      prediction: 'التنبؤ (نسب مئوية)',
      what: 'شنو كيدير هاد الموديل؟',
      explain: 'هاد التطبيق كيستعمل قواعد بسيطة: تكرار الفائزين، الستريك (streak), نمط ping-pong، وتعديل طفيف على Banker (لأنو فالباكارات عندو ميزة 5% فالدفع). هادشي ماشي «ذكاء اصطناعي حقيقي» متعلّم — هو موديل تحليلي بسيط يعطي نسب مفهومة وسريعة.',
      footer: 'مبني من طرف BACCARAT SPEED — نسخة تجريبية'
    },
    en: {
      title: 'BACCARAT SPEED — Baccarat AI Predictor',
      enter_last5: 'Enter last 5 rounds',
      hint: 'Use letters: P = Player, B = Banker, T = Tie',
      player: 'Player',
      banker: 'Banker',
      tie: 'Tie',
      reset: 'Reset',
      history: 'Recent rounds',
      analyze: 'Analyze & Predict',
      sample: 'Fill sample',
      result: 'Result',
      no_analysis: 'No analysis yet',
      prediction: 'Prediction (percentages)',
      what: 'What this model does',
      explain: 'This app uses simple heuristic rules: streaks, alternation (ping-pong), and a small banker bias. It is not a trained AI model — it provides fast, explainable percentages.',
      footer: 'Built by BACCARAT SPEED — Experimental'
    }
  };

  // helpers
  function byId(id){ return document.getElementById(id); }
  function qsAll(sel){ return Array.from(document.querySelectorAll(sel)); }

  // state
  let rounds = JSON.parse(localStorage.getItem('bacc_rounds') || '[]'); // oldest -> newest, keep max 5
  let lang = localStorage.getItem('bacc_lang') || 'ar';

  // DOM refs
  const historyList = byId('history-list');
  const analyzeBtn = byId('analyze');
  const predList = document.getElementById('pred-list');
  const analysisDiv = byId('analysis');
  const langArBtn = byId('lang-ar');
  const langEnBtn = byId('lang-en');
  const btnPlayer = byId('btn-player');
  const btnBanker = byId('btn-banker');
  const btnTie = byId('btn-tie');
  const btnReset = byId('btn-reset');
  const fillSample = byId('fill-sample');

  // persist & render
  function save(){ localStorage.setItem('bacc_rounds', JSON.stringify(rounds)); }
  function setLang(l){
    lang = l; localStorage.setItem('bacc_lang', l); renderI18n();
    langArBtn.classList.toggle('active', l==='ar');
    langEnBtn.classList.toggle('active', l==='en');
  }

  function renderI18n(){
    const dict = I18N[lang] || I18N.ar;
    qsAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if(dict[key]) el.innerText = dict[key];
    });
    // update buttons preserved text for accessibility
    btnPlayer.innerText = I18N[lang].player;
    btnBanker.innerText = I18N[lang].banker;
    btnTie.innerText = I18N[lang].tie;
    btnReset.innerText = I18N[lang].reset;
  }

  function renderHistory(){
    historyList.innerHTML = '';
    if(rounds.length === 0){
      historyList.innerText = '—';
      return;
    }
    rounds.forEach((r, i) => {
      const d = document.createElement('div');
      d.className = 'history-item';
      d.innerText = r;
      historyList.appendChild(d);
    });
  }

  function norm(ch){
    if(!ch) return '';
    ch = ch.toString().toUpperCase().trim();
    if(ch==='P'||ch==='PLAYER'||ch==='1') return 'P';
    if(ch==='B'||ch==='BANKER'||ch==='2') return 'B';
    if(ch==='T'||ch==='TIE'||ch==='0') return 'T';
    return '';
  }

  function addRound(r){
    const n = norm(r);
    if(!n) return;
    rounds.push(n);
    if(rounds.length>5) rounds = rounds.slice(rounds.length-5);
    save(); renderHistory(); analyzeAndRender();
  }

  function resetAll(){ rounds = []; save(); renderHistory(); clearAnalysis(); }

  function clearAnalysis(){
    analysisDiv.innerHTML = '<p class="small">'+I18N[lang].no_analysis+'</p>';
    predList.querySelectorAll('li').forEach(li => { li.innerText = (li.getAttribute('data-key')==='p'? 'Player: —' : li.getAttribute('data-key')==='b' ? 'Banker: —' : 'Tie: —'); });
  }

  function simpleHeuristic(roundsArr){
    const counts = {P:0,B:0,T:0};
    roundsArr.forEach(r => { if(r) counts[r]++; });
    const totalKnown = counts.P + counts.B + counts.T || 1;
    let p = counts.P / totalKnown;
    let b = counts.B / totalKnown;
    let t = counts.T / totalKnown;

    const last = roundsArr.slice(-2);
    if(last[0] && last[0] === last[1]){
      if(last[1] === 'P') p += 0.08;
      if(last[1] === 'B') b += 0.08;
      if(last[1] === 'T') t += 0.06;
    }

    const alt4 = roundsArr.slice(-4).every((v,i,a)=> v && a[i-1] && (i===0 || v !== a[i-1]));
    if(alt4){
      const opp = {P:'B', B:'P', T:'P'};
      const lastVal = roundsArr[roundsArr.length-1];
      if(opp[lastVal]) {
        if(opp[lastVal]==='P') p += 0.07;
        if(opp[lastVal]==='B') b += 0.07;
      }
    }

    b += 0.03;

    p = Math.max(0,p); b = Math.max(0,b); t = Math.max(0,t);
    const s = p+b+t || 1;
    p = p/s; b = b/s; t = t/s;

    return {counts, p: Math.round(p*1000)/10, b: Math.round(b*1000)/10, t: Math.round(t*1000)/10, explanation: explain(roundsArr, counts)};
  }

  function explain(roundsArr, counts){
    const parts = [];
    parts.push((lang==='ar' ? 'التوزيع: ' : 'Distribution: ') + 'Player='+counts.P+', Banker='+counts.B+', Tie='+counts.T+'.');
    const last = roundsArr.slice(-2);
    if(last[0] && last[0] === last[1]) parts.push(lang==='ar' ? 'كاين ستريك فآخر جوج جولات ('+last[1]+'). هادشي كيعطي ميل طفيف للاستمرار.' : 'There is a streak in the last two rounds ('+last[1]+') — slight continuation bias.');
    const alt4 = roundsArr.slice(-4).every((v,i,a)=> v && a[i-1] && (i===0 || v !== a[i-1]));
    if(alt4) parts.push(lang==='ar' ? 'كاين نمط alternation (ping-pong) فالآخر 4 جولات — ممكن يرجع النمط ويعطي الأفضلية للعكس.' : 'Detected alternation (ping-pong) in the last 4 rounds — expect possible reversal.');
    parts.push(lang==='ar' ? 'تم تطبيق تعديل بسيط لفائدة Banker بسبب ميزة العائد.' : 'Applied a small banker bias due to payout advantage.');
    return parts.join(' ');
  }

  function analyzeAndRender(){
    if(rounds.length < 1){
      clearAnalysis(); return;
    }
    const res = simpleHeuristic(rounds);
    analysisDiv.innerHTML = '<p class="small">'+res.explanation+'</p><p>'+(lang==='ar' ? 'التوزيع المستعمل: ' : 'Used distribution: ')+JSON.stringify(res.counts)+'</p>';
    const lis = predList.querySelectorAll('li');
    lis.forEach(li => {
      const key = li.getAttribute('data-key');
      if(key==='p') li.innerText = (lang==='ar' ? 'Player: ' : 'Player: ') + res.p + '%';
      if(key==='b') li.innerText = (lang==='ar' ? 'Banker: ' : 'Banker: ') + res.b + '%';
      if(key==='t') li.innerText = (lang==='ar' ? 'Tie: ' : 'Tie: ') + res.t + '%';
    });
  }

  // events
  btnPlayer.addEventListener('click', ()=> addRound('P'));
  btnBanker.addEventListener('click', ()=> addRound('B'));
  btnTie.addEventListener('click', ()=> addRound('T'));
  btnReset.addEventListener('click', ()=> resetAll());
  analyzeBtn.addEventListener('click', ()=> analyzeAndRender());
  fillSample.addEventListener('click', ()=> { rounds = ['P','B','P','P','B']; save(); renderHistory(); analyzeAndRender(); });

  langArBtn.addEventListener('click', ()=> setLang('ar'));
  langEnBtn.addEventListener('click', ()=> setLang('en'));

  // init
  renderI18n();
  renderHistory();
  analyzeAndRender();

})();
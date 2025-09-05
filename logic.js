// Baccarat Offline Plus Logic
// No external libraries. Implements: history, prediction bars, Big Road, and
// derived roads: Big Eye / Small / Cockroach following standard offset rules.

(() => {
  // ======= State =======
  let history = []; // values: 'P' | 'B' | 'T'
  const rows = 6;   // grid rows for roads

  // ======= Helpers =======
  const $ = (id) => document.getElementById(id);

  function saveState() {
    localStorage.setItem("bacc_history", JSON.stringify(history));
  }
  function loadState() {
    const raw = localStorage.getItem("bacc_history");
    if (raw) {
      try { history = JSON.parse(raw) || []; } catch { history = []; }
    }
    renderAll();
  }

  function addResult(r) {
    if (!['P','B','T'].includes(r)) return;
    history.push(r);
    saveState();
    renderAll();
  }

  function undoLast() {
    if (!history.length) return;
    history.pop();
    saveState();
    renderAll();
  }

  function exportCSV() {
    const rows = ["index,result"];
    history.forEach((r, i) => rows.push(`${i+1},${r}`));
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "baccarat_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // ======= Rendering: History & Last5 & Patterns =======
  function renderHistory() {
    const box = $("history");
    box.innerHTML = "";
    history.forEach((h) => {
      const sp = document.createElement("span");
      sp.className = `tag ${h}`;
      sp.textContent = h;
      box.appendChild(sp);
    });
  }

  function renderLast5() {
    const box = $("last5");
    box.innerHTML = "";
    const last = history.slice(-5);
    if (!last.length) { box.textContent = "—"; return; }
    last.forEach((h) => {
      const sp = document.createElement("span");
      sp.className = `tag ${h}`;
      sp.textContent = h;
      box.appendChild(sp);
    });
  }

  function detectPatterns(seq) {
    // Simple pattern detection: streak, ping-pong, double
    const res = [];
    const clean = seq.filter(x => x !== 'T');
    const n = clean.length;
    if (n >= 3) {
      // streak
      let streak = 1, maxStreak = 1, last = clean[0];
      for (let i=1;i<n;i++) {
        if (clean[i] === last) { streak++; maxStreak = Math.max(maxStreak, streak); }
        else { last = clean[i]; streak = 1; }
      }
      if (maxStreak >= 3) res.push({label:`Streak ${maxStreak}+`, cls:"ok"});
    }
    if (n >= 4) {
      // ping-pong
      let ok = true;
      for (let i=2;i<n;i++) if (clean[i] !== clean[i-2]) { ok = false; break; }
      if (ok) res.push({label:"Ping-Pong", cls:"warn"});
    }
    if (n >= 6) {
      // double pattern (pairs repeating)
      let ok = true;
      for (let i=2;i<n;i++) if (clean[i] !== clean[i-2]) { ok = false; break; }
      // already same as ping-pong; add extra check: pairs exactly length 2
      if (ok) res.push({label:"Double Pattern", cls:"warn"});
    }
    return res;
  }

  function renderPatterns() {
    const box = $("patterns");
    box.innerHTML = "";
    const pats = detectPatterns(history.slice(-12));
    if (!pats.length) {
      const sp = document.createElement("span");
      sp.className = "badge err";
      sp.textContent = "لا نمط واضح حالياً";
      box.appendChild(sp);
      return;
    }
    pats.forEach(p => {
      const sp = document.createElement("span");
      sp.className = `badge ${p.cls}`;
      sp.textContent = p.label;
      box.appendChild(sp);
    });
  }

  // ======= Big Road Construction =======
  function buildBigRoad(seq) {
    // Ignore ties when building columns
    const s = seq.filter(x => x === 'P' || x === 'B');
    const cols = []; // array of columns; each column is array of 'P' or 'B'
    let cur = [];
    for (let i=0;i<s.length;i++) {
      const v = s[i];
      if (cur.length === 0 || cur[cur.length-1] === v) {
        // try to extend current column; cap rows by 'rows'
        if (cur.length < rows) cur.push(v);
        else {
          // overflow goes to a new column (keeps adding on bottom-most row)
          cols.push(cur);
          cur = [v];
        }
      } else {
        // switch -> new column
        cols.push(cur);
        cur = [v];
      }
    }
    if (cur.length) cols.push(cur);
    return cols;
  }

  function renderBigRoad() {
    const box = $("bigRoad");
    box.innerHTML = "";
    const cols = buildBigRoad(history);
    for (let c=0;c<cols.length;c++) {
      const col = cols[c];
      for (let r=0;r<col.length && r<rows;r++) {
        const cell = document.createElement("div");
        cell.className = `big-cell big-${col[r]}`;
        cell.title = `${col[r]} (${c+1},${r+1})`;
        box.appendChild(cell);
      }
      // fill empty rows with invisible spacers to keep grid aligned (optional)
      for (let r=col.length; r<rows; r++) {
        const spacer = document.createElement("div");
        spacer.style.width = "28px";
        spacer.style.height = "28px";
        spacer.style.opacity = "0";
        box.appendChild(spacer);
      }
    }
    return cols;
  }

  // ======= Derived Roads (Big Eye / Small / Cockroach) =======
  // Color rule generalized by offset k:
  // if row>1: check existence at (col-k, row-1). exists => RED, else BLUE.
  // if row==1: compare heights of (col-k) and (col-k-1). equal => RED, else BLUE.
  function computeDerivedColorsFromBigRoad(bigCols, k) {
    const colors = []; // sequence of 'R' or 'L' (R=red, L=blue)
    for (let col=0; col<bigCols.length; col++) {
      const height = bigCols[col].length;
      for (let row=1; row<=height; row++) {
        if (col < k) continue; // not enough columns to compare
        if (row > 1) {
          // compare cell existence at (col-k, row-1)
          const exists = (bigCols[col - k]?.length || 0) >= (row - 1);
          colors.push(exists ? 'R' : 'L');
        } else {
          // row == 1 => compare heights of previous two reference columns
          if (col - k - 1 < 0) continue;
          const h1 = (bigCols[col - k]?.length || 0);
          const h2 = (bigCols[col - k - 1]?.length || 0);
          colors.push(h1 === h2 ? 'R' : 'L');
        }
      }
    }
    return colors;
  }

  // Build a "road" grid (columns of consecutive same color) from colors sequence
  function buildColorRoad(colors) {
    const cols = []; // columns of 'R' or 'L'
    let cur = [];
    for (let i=0;i<colors.length;i++) {
      const v = colors[i];
      if (cur.length === 0 || cur[cur.length-1] === v) {
        if (cur.length < rows) cur.push(v);
        else { cols.push(cur); cur = [v]; }
      } else {
        cols.push(cur); cur = [v];
      }
    }
    if (cur.length) cols.push(cur);
    return cols;
  }

  function renderDerivedRoad(containerId, bigCols, k) {
    const box = $(containerId);
    box.innerHTML = "";
    const colors = computeDerivedColorsFromBigRoad(bigCols, k);
    const cols = buildColorRoad(colors);
    for (let c=0;c<cols.length;c++) {
      const col = cols[c];
      for (let r=0;r<col.length && r<rows;r++) {
        const d = document.createElement("div");
        d.className = `dot ${col[r] === 'R' ? 'red' : 'blue'}`;
        d.title = `${col[r]==='R'?'RED':'BLUE'} (${c+1},${r+1})`;
        box.appendChild(d);
      }
      for (let r=col.length; r<rows; r++) {
        const spacer = document.createElement("div");
        spacer.style.width = "16px";
        spacer.style.height = "16px";
        spacer.style.opacity = "0";
        box.appendChild(spacer);
      }
    }
  }

  // ======= Prediction Bars =======
  function renderBars() {
    const p = history.filter(x=>x==='P').length;
    const b = history.filter(x=>x==='B').length;
    const t = history.filter(x=>x==='T').length;
    const total = Math.max(1, p+b+t);
    const pctP = Math.round(p*100/total);
    const pctB = Math.round(b*100/total);
    const pctT = 100 - pctP - pctB;

    $("barP").style.width = pctP + "%";
    $("barB").style.width = pctB + "%";
    $("barT").style.width = pctT + "%";
    $("txtP").textContent = pctP + "%";
    $("txtB").textContent = pctB + "%";
    $("txtT").textContent = pctT + "%";

    // simple recommendation using last signal + derived consensus
    const cols = buildBigRoad(history);
    const be = computeDerivedColorsFromBigRoad(cols, 1);
    const sm = computeDerivedColorsFromBigRoad(cols, 2);
    const ck = computeDerivedColorsFromBigRoad(cols, 3);
    const last = history.slice().reverse().find(x => x==='P' || x==='B');
    const lastColor = (arr) => arr.length ? arr[arr.length-1] : null;
    const reds = [lastColor(be), lastColor(sm), lastColor(ck)].filter(Boolean).filter(x=>x==='R').length;
    const blues = [lastColor(be), lastColor(sm), lastColor(ck)].filter(Boolean).filter(x=>x==='L').length;

    let rec = "—";
    let cls = "warn";
    if (last) {
      if (reds > blues) {
        // consistency -> continue last side
        rec = `توصية مبدئية: الاستمرار نحو ${last==='P'?'Player 🔵':'Banker 🔴'} (استقرار أعلى)`;
        cls = "ok";
      } else if (blues > reds) {
        // inconsistency -> switch
        rec = `توصية مبدئية: احتمال تبديل نحو ${last==='P'?'Banker 🔴':'Player 🔵'} (فوضى مرتفعة)`;
        cls = "warn";
      } else {
        rec = "توازن في المشتقات — لا إشارة قوية حالياً";
        cls = "err";
      }
    }
    $("recBox").className = "rec " + (cls==='ok'?'badge ok':cls==='warn'?'badge warn':'badge err');
    $("recBox").textContent = rec;
  }

  // ======= Theme =======
  function toggleTheme() {
    document.body.classList.toggle("light");
    localStorage.setItem("bacc_theme_light", document.body.classList.contains("light") ? "1" : "0");
  }
  function loadTheme() {
    const t = localStorage.getItem("bacc_theme_light");
    if (t === "1") document.body.classList.add("light");
  }

  // ======= Global Render =======
  function renderAll() {
    $("debug").textContent = `الجولات: ${history.length}`;
    renderHistory();
    renderLast5();
    renderPatterns();
    const bigCols = renderBigRoad();
    renderDerivedRoad("bigEye", bigCols, 1);
    renderDerivedRoad("smallRoad", bigCols, 2);
    renderDerivedRoad("cockroach", bigCols, 3);
    renderBars();
  }

  // ======= Events =======
  document.addEventListener("DOMContentLoaded", () => {
    loadTheme();
    loadState(); // also triggers renderAll
  });
  $("toggleTheme")?.addEventListener("click", toggleTheme);

  $("btnP")?.addEventListener("click", () => addResult('P'));
  $("btnB")?.addEventListener("click", () => addResult('B'));
  $("btnT")?.addEventListener("click", () => addResult('T'));
  $("btnR")?.addEventListener("click", () => { history = []; saveState(); renderAll(); });
  $("btnU")?.addEventListener("click", undoLast);
  $("btnX")?.addEventListener("click", exportCSV);

  document.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if (k === 'p') addResult('P');
    else if (k === 'b') addResult('B');
    else if (k === 't') addResult('T');
    else if (k === 'r') { history = []; saveState(); renderAll(); }
    else if (k === 'z' && (e.ctrlKey || e.metaKey)) undoLast();
  });
})();

const historyList=document.getElementById('historyList');
const pctPlayer=document.getElementById('pctPlayer');const pctBanker=document.getElementById('pctBanker');const pctTie=document.getElementById('pctTie');
const barPlayer=document.getElementById('barPlayer');const barBanker=document.getElementById('barBanker');const barTie=document.getElementById('barTie');
const logBox=document.getElementById('logBox');const roundCount=document.getElementById('roundCount');const resetBtn=document.getElementById('resetBtn');
const patternsList=document.getElementById('patternsList');
let history=[];
function render(){renderHistory();analyze();}
function renderHistory(){historyList.innerHTML='';history.slice().reverse().forEach(h=>{const d=document.createElement('div');d.textContent=h;d.className='pill';historyList.appendChild(d);});}
function detectPatterns(arr){const pats=[];if(arr.length<2)return pats;
let streak=1;for(let i=1;i<arr.length;i++){if(arr[i]===arr[i-1])streak++;else{if(streak>=3)pats.push('Streak: '+arr[i-1]+' x'+streak);streak=1;}}if(streak>=3)pats.push('Streak: '+arr[arr.length-1]+' x'+streak);
let alt=true;for(let i=2;i<arr.length;i++){if(arr[i]===arr[i-2])alt=false;}if(alt && arr.length>=4)pats.push('Ping-Pong: alternating');
if(arr.length>=4){const l4=arr.slice(-4).join(',');if(l4[0] && l4[0]===l4[2] && l4[1]===l4[3])pats.push('Double Pattern: pair repeat');}return pats;}
function analyze(){const rounds=Number(roundCount.value);const recent=history.slice(-rounds);
let counts={Player:0,Banker:0,Tie:0};recent.forEach(r=>counts[r]=(counts[r]||0)+1);
let total=Math.max(1,recent.length);let pPlayer=counts.Player/total;let pBanker=counts.Banker/total+0.03;let pTie=counts.Tie/total;
const patterns=detectPatterns(recent);patternsList.innerHTML='';if(patterns.length===0)patternsList.innerHTML='<li>ماكاين حتى نمط واضح</li>';
patterns.forEach(p=>{const li=document.createElement('li');li.textContent=p;patternsList.appendChild(li);
if(p.startsWith('Streak')){const side=p.split(':')[1].trim().split(' ')[0];if(side==='Player')pPlayer+=0.12;if(side==='Banker')pBanker+=0.12;}
if(p.includes('Ping-Pong')){const last=recent[recent.length-1];if(last==='Player')pBanker+=0.08;if(last==='Banker')pPlayer+=0.08;}
if(p.includes('Double Pattern'))pTie+=0.05;}});
let sum=pPlayer+pBanker+pTie;pPlayer/=sum;pBanker/=sum;pTie/=sum;
const intP=Math.round(pPlayer*100),intB=Math.round(pBanker*100),intT=100-intP-intB;
pctPlayer.textContent=intP;pctBanker.textContent=intB;pctTie.textContent=intT;
barPlayer.style.height=intP+'%';barBanker.style.height=intB+'%';barTie.style.height=intT+'%';
appendLog('تحليل '+recent.length+' جولات');}
function appendLog(t){const p=document.createElement('div');p.textContent=new Date().toLocaleTimeString()+' — '+t;logBox.prepend(p);}
document.getElementById('addPlayer').addEventListener('click',()=>{history.push('Player');render();appendLog('أضفت Player');});
document.getElementById('addBanker').addEventListener('click',()=>{history.push('Banker');render();appendLog('أضفت Banker');});
document.getElementById('addTie').addEventListener('click',()=>{history.push('Tie');render();appendLog('أضفت Tie');});
roundCount.addEventListener('change',()=>{analyze();appendLog('عدد الجولات: '+roundCount.value);});
resetBtn.addEventListener('click',()=>{if(confirm('بغيت تمسح كلشي؟')){history=[];render();appendLog('تم مسح كلشي');}});
render();
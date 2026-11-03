import { AmbientEngine, DEFAULT_LEVELS, isLevels, clamp, type Levels } from './audio/engine';
import { isJournalList, validContent, removeEntry, escapeHTML, type JournalEntry } from './journal/model';
import { isRecord, readStored, writeStored } from './utils/storage';

type House = { slug: string; name: string; english: string; desc: string };
const houses: House[] = [
  {slug:'forest',name:'숲속의 집',english:'FOREST HOUSE',desc:'바람이 나무 사이를 지나가는 곳'},
  {slug:'ocean',name:'바닷가의 집',english:'OCEAN HOUSE',desc:'파도가 마음을 천천히 씻어 주는 곳'},
  {slug:'rain',name:'비 오는 집',english:'RAIN HOUSE',desc:'창가에 앉아 쉬어 가는 오후'},
];
function el<T extends HTMLElement = HTMLElement>(selector: string): T { const found=document.querySelector<T>(selector);if(!found)throw new Error(`Missing UI: ${selector}`);return found; }
function input(id: keyof Levels): HTMLInputElement {return el<HTMLInputElement>(`#${id}`);}
const engine=new AmbientEngine();
const isHouse=(v:unknown):v is string=>typeof v==='string'&&houses.some(h=>h.slug===v);
let activeHouse=readStored('house','forest',isHouse);
function renderCards():void {
  const cards=houses.map(h=>`<button class="house-card ${activeHouse===h.slug?'selected':''}" data-house="${h.slug}" aria-label="${h.name} 선택"><div class="card-art ${h.slug}-art"></div><div class="card-detail"><strong>${h.name} →</strong><p>${h.desc}</p></div></button>`).join('');
  el('#home-cards').innerHTML=cards;el('#house-cards').innerHTML=cards;
  document.querySelectorAll<HTMLButtonElement>('[data-house]').forEach(button=>button.addEventListener('click',()=>{setHouse(button.dataset.house??'forest');location.hash='houses';}));
}
function setHouse(slug:string):void { const h=houses.find(x=>x.slug===slug)??houses[0];activeHouse=h.slug;writeStored('house',h.slug);
  el('#scene-visual').className=`scene-visual ${h.slug}`;el('#scene-title').textContent=h.name;el('#scene-current').textContent=h.name;el('#scene-english').textContent=h.english;el('#scene-desc').textContent=h.desc;renderCards();
}
function navigate():void {const route=location.hash.replace('#','').split('/')[0]||'home';const valid=['home','houses','studio','journal','together'];const current=valid.includes(route)?route:'home';
 document.querySelectorAll<HTMLElement>('.page').forEach(page=>page.classList.toggle('active',page.id===current));document.querySelectorAll<HTMLAnchorElement>('[data-nav]').forEach(a=>a.setAttribute('aria-current',a.getAttribute('href')===`#${current}`?'page':'false'));el('.topbar nav').classList.remove('open');window.scrollTo(0,0);
}
window.addEventListener('hashchange',navigate);
document.querySelectorAll<HTMLButtonElement>('[data-go]').forEach(b=>b.addEventListener('click',()=>location.hash=b.dataset.go??'home'));
el<HTMLButtonElement>('#menu-toggle').addEventListener('click',()=>{const nav=el('.topbar nav');nav.classList.toggle('open');el('#menu-toggle').setAttribute('aria-expanded',String(nav.classList.contains('open')));});
el('#scene-audio-only').addEventListener('click',()=>{const hidden=el('.scene-panel').classList.toggle('visual-hidden');el('#scene-audio-only').textContent=hidden?'풍경 보이기':'풍경 숨기기';});
el('#scene-fullscreen').addEventListener('click',async()=>{try{await el('#scene-visual').requestFullscreen();}catch{el('#playing-status').textContent='전체화면을 사용할 수 없습니다.';}});
let levels=readStored<Levels>('levels',{...DEFAULT_LEVELS},isLevels);
function getLevels():Levels {return {piano:clamp(Number(input('piano').value)),rain:clamp(Number(input('rain').value)),wind:clamp(Number(input('wind').value)),volume:clamp(Number(input('volume').value))};}
function setSliders(values: Levels):void {(['piano','rain','wind','volume'] as const).forEach(id=>input(id).value=String(values[id]));applyVolumes();}
function applyVolumes():void {levels=getLevels();(['piano','rain','wind','volume'] as const).forEach(id=>el(`#${id}-val`).textContent=`${levels[id]}%`);el<HTMLInputElement>('#player-volume').value=String(levels.volume);engine.setLevels(levels);}
setSliders(levels);
(['piano','rain','wind','volume'] as const).forEach(id=>input(id).addEventListener('input',()=>{applyVolumes();writeStored('levels',levels);}));
el<HTMLInputElement>('#player-volume').addEventListener('input',e=>{input('volume').value=(e.target as HTMLInputElement).value;applyVolumes();writeStored('levels',levels);});
el('#mute-button').addEventListener('click',()=>{input('volume').value=input('volume').value==='0'?'65':'0';applyVolumes();writeStored('levels',levels);});
el('#save-preset').addEventListener('click',()=>{el('#studio-status').textContent=writeStored('preset',getLevels())?'이 기기에 소리 조합을 저장했습니다.':'저장할 수 없습니다.';});
el('#restore-preset').addEventListener('click',()=>{const value=readStored<Levels|null>('preset',null,(v):v is Levels|null=>v===null||isLevels(v));if(!value){el('#studio-status').textContent='저장된 조합이 없습니다.';return;}setSliders(value);writeStored('levels',getLevels());el('#studio-status').textContent='저장된 조합을 불러왔습니다.';});
let sleepDeadline: number|null=null;let sleepTimer:ReturnType<typeof setTimeout>|null=null;
function cancelSleepTimer():void {if(sleepTimer!==null)clearTimeout(sleepTimer);sleepTimer=null;sleepDeadline=null;}
function scheduleSleepTimer(reset:boolean):void {
 if(reset){cancelSleepTimer();const mins=Number(el<HTMLSelectElement>('#timer').value);if(mins>0&&engine.isPlaying)sleepDeadline=Date.now()+mins*60_000;}
 if(sleepTimer!==null)clearTimeout(sleepTimer);sleepTimer=null;
 if(sleepDeadline!==null&&engine.isPlaying){sleepTimer=setTimeout(async()=>{await engine.pause();cancelSleepTimer();updatePlayUI();},Math.max(0,sleepDeadline-Date.now()));}
}
function updatePlayUI():void {el('#play-button').textContent=engine.isPlaying?'❚❚':'▶';el('#play-button').setAttribute('aria-label',engine.isPlaying?'일시정지':'재생');el('#playing-status').textContent=engine.isPlaying?'생성형 고요한 소리 재생 중':'재생 준비됨';}
el('#play-button').addEventListener('click',async()=>{try{await engine.toggle();updatePlayUI();scheduleSleepTimer(engine.isPlaying&&sleepDeadline===null);}catch{el('#playing-status').textContent='오디오를 시작할 수 없습니다. 브라우저 설정을 확인하세요.';}});
el<HTMLSelectElement>('#timer').addEventListener('change',()=>scheduleSleepTimer(true));
let entries=readStored<JournalEntry[]>('journal',[],isJournalList);
function renderEntries():void { el('#entries').innerHTML=entries.length?entries.map(e=>`<article class="entry-card"><small>${escapeHTML(e.date)} · ${escapeHTML(e.mood)}</small><p>${escapeHTML(e.content)}</p><button class="secondary" data-remove="${escapeHTML(e.id)}">삭제</button></article>`).join(''):'<p class="muted">아직 작성한 기록이 없습니다.</p>';
 document.querySelectorAll<HTMLButtonElement>('[data-remove]').forEach(b=>b.addEventListener('click',()=>{if(!window.confirm('이 기록을 삭제하시겠습니까?'))return;const updated=removeEntry(entries,b.dataset.remove??'');if(writeStored('journal',updated)){entries=updated;renderEntries();}else el('#journal-status').textContent='기록을 삭제하지 못했습니다.';}));
}
el('#add-entry').addEventListener('click',()=>{const field=el<HTMLTextAreaElement>('#entry');const content=field.value.trim();if(!validContent(content)){el('#journal-status').textContent='1자 이상 5,000자 이하로 입력해 주세요.';return;}
const item:JournalEntry={id:crypto.randomUUID(),date:new Date().toLocaleString('ko-KR'),mood:el<HTMLSelectElement>('#mood').value,content};const updated=[item,...entries].slice(0,1000);
if(writeStored('journal',updated)){entries=updated;field.value='';el('#journal-status').textContent='이 브라우저에 기록을 저장했습니다.';renderEntries();}else el('#journal-status').textContent='저장 공간이 부족하거나 저장이 제한되었습니다.';
});
el('#export-journal').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(entries,null,2)],{type:'application/json;charset=utf-8'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='soul-stay-house-journal.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
let remaining=1200;let meditationStartedAt:number|null=null;let baseRemaining=1200;let meditationInterval:ReturnType<typeof setInterval>|null=null;
function paintClock():void {el('#meditation-clock').textContent=`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;}
function clearMeditation():void {if(meditationInterval!==null)clearInterval(meditationInterval);meditationInterval=null;meditationStartedAt=null;}
function tickMeditation():void {if(meditationStartedAt===null)return;remaining=Math.max(0,baseRemaining-Math.floor((Date.now()-meditationStartedAt)/1000));paintClock();if(remaining===0){clearMeditation();el('#meditation-start').textContent='명상 완료';}}
el('#meditation-start').addEventListener('click',()=>{if(meditationInterval!==null){tickMeditation();clearMeditation();el('#meditation-start').textContent='명상 이어하기';return;}if(remaining===0)remaining=1200;baseRemaining=remaining;meditationStartedAt=Date.now();el('#meditation-start').textContent='일시정지';tickMeditation();meditationInterval=setInterval(tickMeditation,250);});
el('#meditation-reset').addEventListener('click',()=>{clearMeditation();remaining=1200;paintClock();el('#meditation-start').textContent='명상 시작';});
setHouse(activeHouse);renderEntries();navigate();updatePlayUI();paintClock();

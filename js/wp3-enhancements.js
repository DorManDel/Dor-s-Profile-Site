/* MyPortfolio R1.6 WP3 — optional, independently switchable experiments and diagnostics. */
(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const panel = $('settings-panel');
  if (!panel || !$('wp3-ripple')) return;
  const defaults = Object.freeze({
    ripple:false, rippleHaptic:false, rippleSound:false, prism:false, prismSensor:false,
    workHaptic:false, hapticPulse:10, fps:false,
    prismStrength:74, prismHighlights:68, prismDepth:16, prismParallax:13,
    prismBands:4, prismSensitivity:35
  });
  const key = 'dor.portfolio.wp3-experiments.v1';
  const bounds = {hapticPulse:[4,35],prismStrength:[0,100],prismHighlights:[0,100],
    prismDepth:[0,30],prismParallax:[0,30],prismBands:[1,8],prismSensitivity:[0,100]};
  let config = {...defaults};
  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    if (saved && typeof saved === 'object') {
      for (const k of Object.keys(defaults)) {
        if (typeof defaults[k] === 'boolean' && typeof saved[k] === 'boolean') config[k] = saved[k];
        if (typeof defaults[k] === 'number' && Number.isFinite(saved[k])) {
          const [min,max] = bounds[k];
          config[k] = Math.max(min,Math.min(max,saved[k]));
        }
      }
    }
  } catch {}
  const save = () => { try { localStorage.setItem(key,JSON.stringify(config)); } catch {} };
  const status = (id, message) => { const el = $(id); if (el) el.textContent = message; };
  const isCalm = () => !!$('motion-toggle')?.checked || !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const booleans = {
    'wp3-ripple':'ripple','wp3-ripple-haptic':'rippleHaptic','wp3-ripple-sound':'rippleSound',
    'wp3-prism':'prism','wp3-prism-sensor':'prismSensor','wp3-work-haptic':'workHaptic',
    'wp3-fps':'fps'
  };
  const sliders = {
    'wp3-haptic-pulse':'hapticPulse','wp3-prism-strength':'prismStrength',
    'wp3-prism-highlights':'prismHighlights','wp3-prism-depth':'prismDepth',
    'wp3-prism-parallax':'prismParallax','wp3-prism-bands':'prismBands',
    'wp3-prism-sensitivity':'prismSensitivity'
  };
  const suffix = {hapticPulse:' ms',prismStrength:'%',prismHighlights:'%',prismDepth:'°',
    prismParallax:' px',prismBands:'',prismSensitivity:'%'};
  Object.entries(booleans).forEach(([id, k]) => {
    const el=$(id); if (!el) return;
    el.checked=config[k];
    el.addEventListener('change',async () => {
      config[k]=el.checked;
      if (k==='prismSensor' && el.checked) {
        if (!('DeviceOrientationEvent' in window)) {
          config[k]=false;el.checked=false;status('wp3-prism-status','Motion sensor unavailable here. Pointer preview still works.');
        } else if (typeof DeviceOrientationEvent.requestPermission === 'function') {
          try {
            const granted = await DeviceOrientationEvent.requestPermission();
            if (granted!=='granted') {config[k]=false;el.checked=false;status('wp3-prism-status','Motion sensor permission denied.');}
          } catch {config[k]=false;el.checked=false;status('wp3-prism-status','Motion sensor permission unavailable.');}
        }
      }
      save();apply();
    });
  });
  Object.entries(sliders).forEach(([id,k]) => {
    const el=$(id); if (!el) return;
    el.value=config[k];
    const output=$(id+'-out');
    const update=()=>{config[k]=Number(el.value);if(output)output.textContent=el.value+(suffix[k]||'');save();apply();};
    el.addEventListener('input',update);
    if(output)output.textContent=String(config[k])+(suffix[k]||'');
  });

  // Reorder existing settings in stable categories while keeping the original
  // controls, listeners, IDs and Developer Mode access gate intact.
  const allDetails=Array.from(panel.querySelectorAll(':scope > details.settings-group.developer-only'));
  const categorise=(el)=>{
    const name=(el.querySelector(':scope > summary')?.textContent||'').trim().toLowerCase();
    if(el.id==='wp3-ripple-settings'||el.id==='wp3-prism-settings'||el.id==='wp3-haptics-settings') return 'Interaction FX';
    if(name.includes('appearance'))return 'Appearance';
    if(name.includes('things i'))return 'Things I\'ve Built';
    if(name.includes('projects'))return 'Projects & Media';
    if(name.includes('navigation')||name.includes('preferences'))return 'Navigation';
    if(el.id==='wp3-diagnostics'||name.includes('diagnostic'))return 'Diagnostics';
    if(name.includes('tools')||name.includes('history')||name.includes('publish'))return 'Authoring & Publish';
    return 'Extras';
  };
  const categories=['Appearance','Things I\'ve Built','Interaction FX','Projects & Media',
    'Navigation','Diagnostics','Authoring & Publish','Extras'];
  const banner=$('dev-unlocked-banner');
  const headers=[];
  for(const category of categories){
    const matches=allDetails.filter(el=>categorise(el)===category);
    if(!matches.length)continue;
    const title=document.createElement('div');
    title.className='wp3-category';title.textContent=category;
    panel.insertBefore(title,banner);headers.push({title,matches});
    matches.forEach(el=>panel.insertBefore(el,banner));
  }
  const search=$('wp3-search'), searchStatus=$('wp3-search-status');
  if(search){
    const filter=()=>{
      const term=search.value.trim().toLocaleLowerCase();
      let found=0;
      for(const el of allDetails){
        const hit=!term||el.textContent.toLocaleLowerCase().includes(term);
        el.classList.toggle('wp3-filtered',!hit);
        if(hit){found++;if(term)el.open=true;}
      }
      for(const {title,matches} of headers){
        title.classList.toggle('wp3-filtered',!matches.some(el=>!el.classList.contains('wp3-filtered')));
      }
      if(searchStatus)searchStatus.textContent=term?found+' matching groups':'Search by effect, control, or keyword';
    };
    search.addEventListener('input',filter);
    search.addEventListener('keydown',e=>{if(e.key==='Escape'&&search.value){e.stopPropagation();search.value='';filter();}});
  }

  // Ripple v2: hosted above animated fish but below the readable hero card.
  const welcome=$('welcome');
  if(welcome)welcome.classList.add('wp3-ripple-host');
  let ripple=null,waterAudio=null,lastPlop=0;
  function useRipple(){
    const enabled=config.ripple&&!isCalm()&&!!welcome&&!!window.WaterRipple;
    if(enabled&&!ripple){
      try{
        ripple=new window.WaterRipple(welcome,{enabled:true,mode:'overlay',strength:100,
          waveSize:70,speed:77,persistence:81,highlights:66,touchFluidity:82,
          hover:false,touchBehavior:'scroll',quality:'auto',maxDpr:1.2,continuous:false,
          ignoreSelector:'a,button,input,textarea,select,[role="button"],[data-ripple-ignore],.settings-panel'});
      }catch(err){status('wp3-ripple-status','Ripple could not initialize: '+(err.message||err));}
    } else if(!enabled&&ripple){ripple.destroy();ripple=null;}
    status('wp3-ripple-status',!config.ripple?'Disabled by default. Layer: fish → ripple → hero.':
      isCalm()?'Suspended by Calm Mode / reduced motion.':
      ripple?'Active on the introduction area. Scroll remains native.':'Ripple renderer unavailable.');
  }

  // Short, throttled haptic impulses. Web Vibration has duration but no amplitude API.
  const lastHaptic={};
  function haptic(channel){
    if(typeof navigator.vibrate!=='function'||isCalm()||document.hidden)return false;
    const now=performance.now();
    if(now-(lastHaptic[channel]||0)<190)return false;
    lastHaptic[channel]=now;
    try{return navigator.vibrate(config.hapticPulse)===true;}catch{return false;}
  }
  function waterPlop(){
    if(!config.rippleSound||!config.ripple||isCalm()||document.hidden)return;
    const now=performance.now();if(now-lastPlop<230)return;lastPlop=now;
    try{
      const AC=window.AudioContext||window.webkitAudioContext;
      if(!AC)return;
      if(!waterAudio)waterAudio=new AC();
      if(waterAudio.state==='suspended')void waterAudio.resume();
      if(waterAudio.state!=='running')return;
      const t=waterAudio.currentTime,osc=waterAudio.createOscillator(),gain=waterAudio.createGain();
      osc.type='sine';osc.frequency.setValueAtTime(480,t);
      osc.frequency.exponentialRampToValueAtTime(170,t+.12);
      gain.gain.setValueAtTime(.0001,t);
      gain.gain.exponentialRampToValueAtTime(.04,t+.008);
      gain.gain.exponentialRampToValueAtTime(.0001,t+.15);
      osc.connect(gain);gain.connect(waterAudio.destination);
      osc.start(t);osc.stop(t+.16);
      osc.onended=()=>{osc.disconnect();gain.disconnect();};
    }catch{}
  }
  welcome?.addEventListener('pointerdown',e=>{
    if(!config.ripple||isCalm()||e.target.closest('a,button,input,select,textarea,[data-ripple-ignore]'))return;
    if(config.rippleHaptic)haptic('ripple');
    waterPlop();
  },{passive:true});

  // Interaction feedback for entering the Work section and choosing its cards.
  document.addEventListener('click',e=>{
    const target=e.target;
    if(config.workHaptic&&target instanceof Element&&target.closest('a[href="#work"]'))haptic('work-nav');
  },{passive:true});
  document.addEventListener('pointerdown',e=>{
    if(!config.workHaptic)return;
    if(e.composedPath().some(node=>node instanceof Element&&node.tagName==='SELECTED-WORK'))haptic('work-card');
  },{passive:true});
  $('wp3-haptic-test')?.addEventListener('click',()=>{
    const ok=haptic('test');
    status('wp3-haptic-status',ok?'Pulse requested: '+config.hapticPulse+' ms. Hardware controls actual strength.':
      'No vibration returned. Android browser and device settings may restrict it; iOS Safari does not expose this API.');
  });

  // Prism: opt-in light/color overlay with 2D pointer fallback and motion sensors.
  const portrait=$('profile-photo')?.closest('figure');
  let angleX=0,angleY=0,sensorActive=false,lastSensor=0;
  const orientation=e=>{
    if(!config.prism||!config.prismSensor||isCalm())return;
    const t=performance.now();if(t-lastSensor<33)return;lastSensor=t;
    const amp=config.prismSensitivity/100;
    angleX=Math.max(-1,Math.min(1,(Number(e.beta)||0)/60*amp));
    angleY=Math.max(-1,Math.min(1,(Number(e.gamma)||0)/45*amp));
    paintPrism();
  };
  function paintPrism(){
    if(!portrait)return;
    const x=angleY*config.prismParallax,y=angleX*config.prismParallax;
    portrait.style.setProperty('--wp3-prism-x',x.toFixed(1)+'px');
    portrait.style.setProperty('--wp3-prism-y',y.toFixed(1)+'px');
    portrait.style.setProperty('--wp3-prism-rotate-x',(-angleX*config.prismDepth).toFixed(1)+'deg');
    portrait.style.setProperty('--wp3-prism-rotate-y',(angleY*config.prismDepth).toFixed(1)+'deg');
    portrait.style.setProperty('--wp3-prism-opacity',(.07+config.prismStrength/100*.55).toFixed(3));
    portrait.style.setProperty('--wp3-prism-glow',(config.prismHighlights/100*.28).toFixed(3));
    portrait.style.setProperty('--wp3-prism-size',(100+config.prismBands*12)+'%');
  }
  portrait?.addEventListener('pointermove',e=>{
    if(!config.prism||config.prismSensor||isCalm()||e.pointerType==='touch')return;
    const b=portrait.getBoundingClientRect(),amp=config.prismSensitivity/100;
    angleY=Math.max(-1,Math.min(1,((e.clientX-b.left)/b.width*2-1)*amp));
    angleX=Math.max(-1,Math.min(1,((e.clientY-b.top)/b.height*2-1)*amp));
    paintPrism();
  },{passive:true});
  portrait?.addEventListener('pointerleave',()=>{
    if(!config.prismSensor){angleX=0;angleY=0;paintPrism();}
  },{passive:true});
  function usePrism(){
    const enabled=config.prism&&!isCalm();
    portrait?.classList.toggle('wp3-prism-on',enabled);
    paintPrism();
    const needed=enabled&&config.prismSensor;
    if(needed!==sensorActive){
      window[needed?'addEventListener':'removeEventListener']('deviceorientation',orientation,{passive:true});
      sensorActive=needed;
    }
    status('wp3-prism-status',!config.prism?'Off by default. Original portrait is unchanged.':
      isCalm()?'Suspended by Calm Mode / reduced motion.':
      config.prismSensor?'Sensor requested; tilt device to test.':'Pointer preview active. Switch on sensor to test phone tilt.');
  }

  // Debug HUD measures rAF callbacks; not the phone's hardware refresh-rate setting.
  const hud=document.createElement('div');hud.id='wp3-fps-hud';hud.hidden=true;
  hud.setAttribute('aria-hidden','true');document.body.append(hud);
  let raf=0,previous=0,windowStart=0,frames=0,deltas=[];
  function frame(t){
    if(!config.fps||document.hidden){raf=0;return;}
    if(previous){const dt=t-previous;if(dt>0&&dt<500)deltas.push(dt);}
    previous=t;if(!windowStart)windowStart=t;frames++;
    const elapsed=t-windowStart;
    if(elapsed>=1000){
      const sorted=deltas.slice().sort((a,b)=>a-b);
      const mean=sorted.reduce((a,b)=>a+b,0)/(sorted.length||1);
      const p95=sorted[Math.min(sorted.length-1,Math.floor(sorted.length*.95))]||0;
      const fps=Math.round(frames*1000/elapsed);
      hud.textContent='FPS '+fps+'   AVG '+mean.toFixed(1)+' ms';
      const sub=document.createElement('small');
      sub.textContent='p95 '+p95.toFixed(1)+' ms · measured rAF';
      hud.append(sub);
      windowStart=t;frames=0;deltas=[];
    }
    raf=requestAnimationFrame(frame);
  }
  function useFPS(){
    const enabled=config.fps&&!document.hidden;
    hud.hidden=!enabled;
    if(!enabled&&raf){cancelAnimationFrame(raf);raf=0;previous=0;windowStart=0;}
    if(enabled&&!raf){previous=0;windowStart=0;frames=0;deltas=[];raf=requestAnimationFrame(frame);}
  }

  // Touch reading aid. The older pointer-only magnifier is left untouched.
  const lens=document.createElement('div');lens.id='wp3-touch-lens';lens.hidden=true;
  lens.setAttribute('aria-hidden','true');document.body.append(lens);
  const magnifierToggle=$('a11y-magnifier');
  let touchId=null,lensTimer=null,lastLensPaint=0;
  const stopLens=()=>{
    if(lensTimer)clearTimeout(lensTimer);
    lensTimer=setTimeout(()=>{lens.hidden=true;touchId=null;},600);
  };
  const paintLens=e=>{
    if(!magnifierToggle?.checked||e.pointerType!=='touch')return;
    if(!e.isPrimary)return;
    const now=performance.now();if(now-lastLensPaint<45)return;lastLensPaint=now;
    const t=document.elementFromPoint(e.clientX,e.clientY);
    const source=t?.closest?.('p,h1,h2,h3,h4,li,a,button,label,small,span');
    if(!source||source.closest('.settings-panel,#wp3-touch-lens')){lens.hidden=true;return;}
    const value=source.textContent?.trim().replace(/\s+/g,' ').slice(0,280);
    if(!value){lens.hidden=true;return;}
    lens.textContent=value;lens.hidden=false;
    lens.style.left=Math.max(8,Math.min(innerWidth-320,e.clientX-140))+'px';
    lens.style.bottom='auto';
    lens.style.top=Math.max(8,e.clientY-120)+'px';
  };
  document.addEventListener('pointerdown',e=>{
    if(e.pointerType==='touch'&&magnifierToggle?.checked){touchId=e.pointerId;paintLens(e);}
  },{passive:true});
  document.addEventListener('pointermove',e=>{
    if(e.pointerId===touchId&&e.pointerType==='touch')paintLens(e);
  },{passive:true});
  document.addEventListener('pointerup',e=>{if(e.pointerId===touchId)stopLens();},{passive:true});
  document.addEventListener('pointercancel',e=>{if(e.pointerId===touchId)stopLens();},{passive:true});
  magnifierToggle?.addEventListener('change',()=>{lens.hidden=true;touchId=null;});
  window.addEventListener('scroll',()=>{lens.hidden=true;},{passive:true});

  function apply(){useRipple();usePrism();useFPS();}
  $('motion-toggle')?.addEventListener('change',apply);
  const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)');
  reduce?.addEventListener?.('change',apply);
  document.addEventListener('visibilitychange',apply);
  apply();
  status('wp3-haptic-status',typeof navigator.vibrate==='function'?
    'Vibration supported by browser; optional pulses are off by default.':'Vibration unavailable in this browser (common on desktop/iOS).');
  window.PortfolioWP3={get:()=>({...config}),getDiagnostics:()=>({
    ripple:ripple?.getStats()||null,frameHud:config.fps,sensorActive
  })};
})();

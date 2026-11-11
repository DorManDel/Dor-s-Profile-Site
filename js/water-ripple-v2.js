/* WaterRipple v2.0.0 — vanilla JS, standalone, MIT.
 * Overlay mode supports animated HTML/CSS content below the canvas.
 * True pixel refraction requires mode:'scene' with a supplied drawable source.
 */
(function (root, factory) {
  'use strict';
  const klass = factory();
  if (typeof module === 'object' && module.exports) module.exports = klass;
  else root.WaterRipple = klass;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const DEFAULTS = Object.freeze({
    mode: 'overlay', enabled: true, strength: 100, waveSize: 70,
    speed: 77, persistence: 81, refraction: 100, highlights: 66,
    touchFluidity: 82, dragStrength: 48, hover: true,
    touchBehavior: 'scroll', // scroll: native page scrolling; paint: drag water without scrolling
    quality: 'auto', maxDpr: 1.4,
    debugWaveMap: false, debugBounds: false, respectReducedMotion: true,
    background: null, sceneRenderer: null, sceneFps: 30, continuous: false,
    ignoreSelector: 'a,button,input,textarea,select,[role="button"],[data-ripple-ignore]'
  });
  const VERT = 'attribute vec2 aPos; varying vec2 uv; void main(){uv=(aPos+1.0)*0.5;gl_Position=vec4(aPos,0.,1.);}';
  const FRAG = `precision mediump float;
  varying vec2 uv;
  uniform sampler2D heightMap;
  uniform sampler2D scene;
  uniform vec2 texel;
  uniform float highlights;
  uniform float strength;
  uniform float refraction;
  uniform float debug;
  uniform float sceneMode;
  void main(){
    float h=texture2D(heightMap,uv).r;
    float l=texture2D(heightMap,uv-vec2(texel.x,0.)).r;
    float r=texture2D(heightMap,uv+vec2(texel.x,0.)).r;
    float d=texture2D(heightMap,uv-vec2(0.,texel.y)).r;
    float u=texture2D(heightMap,uv+vec2(0.,texel.y)).r;
    vec2 n=vec2(r-l,u-d);
    float g=length(n);
    float curvature=abs((l+r+d+u)*.25-h);
    float lit=max(0.,dot(n,normalize(vec2(-.72,.70))));
    float shade=max(0.,dot(n,normalize(vec2(.66,-.75))));
    // Narrow, low-alpha crests instead of broad bright opaque blobs.
    float contour=clamp(g*31.0+curvature*12.0,0.,1.);
    float spec=clamp(lit*22.0,0.,1.);
    float alpha=clamp((contour*.16+spec*.15)*highlights*strength,0.,.39);
    vec3 tint=mix(vec3(.30,.77,.89),vec3(.91,.98,1.),spec*.62);
    vec4 col=vec4(tint,alpha);
    if(sceneMode>.5){
      vec2 displaced=clamp(uv+n*refraction*.12,vec2(.002),vec2(.998));
      col=texture2D(scene,displaced);
      col.rgb+=tint*spec*highlights*.22;
      col.rgb-=vec3(.04,.08,.10)*clamp(shade*17.0,0.,1.)*highlights*.12;
      col.a=1.;
    }
    if(debug>.5) col=vec4(clamp(vec3(.36+(h-.5)*3.,.48+(h-.5)*1.5,.66-(h-.5)*2.5),0.,1.),1.);
    gl_FragColor=col;
  }`;

  class WaterRipple {
    constructor(element, opts={}) {
      this.element = typeof element==='string'? document.querySelector(element):element;
      if (!this.element || this.element.nodeType!==1) throw new TypeError('WaterRipple needs a real HTML element.');
      this.options = this._normalize({...DEFAULTS,...opts});
      this._destroyed=false;this._visible=true;this._raf=0;this._running=false;
      this._lastFrame=0;this._accum=0;this._steps=0;this._quietCount=0;
      this._active=false;this._energy=0;this._lastInput=0;this._lastPointer=null;
      this._touch=null;this._lastMouse=0;this._listeners=[];this._fallback=[];
      this._prevStyle={position:this.element.style.position, touchAction:this.element.style.touchAction};
      if(getComputedStyle(this.element).position==='static') this.element.style.position='relative';
      if(this.options.touchBehavior==='paint')this.element.style.touchAction='none';
      this.canvas=document.createElement('canvas');this.canvas.className='water-ripple-canvas';
      this.canvas.setAttribute('aria-hidden','true');
      Object.assign(this.canvas.style,{position:'absolute',inset:'0',width:'100%',height:'100%',
        pointerEvents:'none',userSelect:'none',display:'block',zIndex:'1',clipPath:'inset(0)'});
      // First child visually lies above the background only when the host defines explicit z-index layers.
      this.element.insertBefore(this.canvas,this.element.firstChild);
      this._source=document.createElement('canvas');this._sourceCtx=this._source.getContext('2d');
      this._resize=()=>this.resize();
      if(window.ResizeObserver){this._ro=new ResizeObserver(this._resize);this._ro.observe(this.element);}
      else this._listen(window,'resize',this._resize,{passive:true});
      if(window.IntersectionObserver){this._io=new IntersectionObserver(a=>{
        this._visible=!!a[0]?.isIntersecting;this._lastFrame=0;
        if(!this._visible)this._sleep();else if(this._active)this._wake();
      },{threshold:0});this._io.observe(this.element);}
      this._onVisibility=()=>{this._lastFrame=0;if(document.hidden)this._sleep();else if(this._active)this._wake();};
      this._listen(document,'visibilitychange',this._onVisibility);
      this._media=window.matchMedia?.('(prefers-reduced-motion: reduce)')||null;
      this._reduced=!!this._media?.matches;
      this._onMedia=e=>{this._reduced=e.matches;this.clear();};
      if(this._media){if(this._media.addEventListener)this._media.addEventListener('change',this._onMedia);
        else this._media.addListener(this._onMedia);}
      this._listen(this.element,'pointerdown',e=>this._mouseDown(e),{passive:true});
      this._listen(this.element,'pointermove',e=>this._mouseMove(e),{passive:true});
      this._listen(this.element,'pointerleave',()=>{this._lastPointer=null;},{passive:true});
      // Touch events intentionally separate from mouse/pointer to survive pointercancel on native mobile scroll.
      this._listen(this.element,'touchstart',e=>this._touchStart(e),{passive:true});
      this._listen(this.element,'touchmove',e=>this._touchMove(e),{passive:true});
      this._listen(this.element,'touchend',e=>this._touchEnd(e),{passive:true});
      this._listen(this.element,'touchcancel',e=>this._touchEnd(e),{passive:true});
      this._init();this.resize();this._applyBounds();
    }
    _normalize(o){
      for(const k of ['strength','waveSize','speed','persistence','refraction','highlights','touchFluidity','dragStrength']){
        o[k]=clamp(Number.isFinite(+o[k])?Number(o[k]):DEFAULTS[k],0,100);
      }
      o.mode=o.mode==='scene'?'scene':'overlay';
      o.touchBehavior=o.touchBehavior==='paint'?'paint':'scroll';
      o.quality=['low','auto','high'].includes(o.quality)?o.quality:'auto';
      o.maxDpr=clamp(Number(o.maxDpr)||1.4,.5,2);
      o.sceneFps=clamp(Number(o.sceneFps)||30,1,60);
      return o;
    }
    _listen(target,type,fn,opts){target.addEventListener(type,fn,opts);this._listeners.push([target,type,fn,opts]);}
    _reducedOn(){return this._reduced&&this.options.respectReducedMotion;}
    _canRun(){return !this._destroyed&&this.options.enabled&&!this._reducedOn()&&this._visible&&!document.hidden&&this.width>0&&this.height>0;}
    _applyBounds(){this.canvas.style.outline=this.options.debugBounds?'2px dashed #f6cf70':'none';this.canvas.style.outlineOffset='-2px';}
    _init(){
      let gl=null;
      try{gl=this.canvas.getContext('webgl',{alpha:true,antialias:false,depth:false,stencil:false,premultipliedAlpha:false})||this.canvas.getContext('experimental-webgl');}catch(_){}
      if(!gl){
        this.ctx=this.canvas.getContext('2d');
        this._fallbackCanvas=document.createElement('canvas');
        this._fallbackCtx=this._fallbackCanvas.getContext('2d',{alpha:true});
        this.renderer='canvas2d-fallback';return;
      }
      try{
        const shader=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
        const prog=gl.createProgram();const v=shader(gl.VERTEX_SHADER,VERT),f=shader(gl.FRAGMENT_SHADER,FRAG);
        gl.attachShader(prog,v);gl.attachShader(prog,f);gl.linkProgram(prog);
        gl.deleteShader(v);gl.deleteShader(f);
        if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(prog));
        gl.useProgram(prog);
        const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,-1,1,1,-1,1]),gl.STATIC_DRAW);
        const loc=gl.getAttribLocation(prog,'aPos');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
        const tex=()=>{const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t;};
        this._heightTex=tex();this._sceneTex=tex();this._program=prog;this._buffer=buf;
        this._uniforms={};
        for(const key of ['heightMap','scene','texel','highlights','strength','refraction','debug','sceneMode'])this._uniforms[key]=gl.getUniformLocation(prog,key);
        gl.uniform1i(this._uniforms.heightMap,0);gl.uniform1i(this._uniforms.scene,1);
        gl.disable(gl.BLEND);gl.disable(gl.DEPTH_TEST);
        this.gl=gl;this.renderer='webgl';this._listen(this.canvas,'webglcontextlost',e=>{e.preventDefault();this._sleep();},{passive:false});
      }catch(err){console.warn('WaterRipple WebGL init:',err);this.renderer='unavailable';}
    }
    resize(){
      if(this._destroyed)return this;
      const r=this.element.getBoundingClientRect(),w=Math.round(r.width),h=Math.round(r.height);
      const dpr=window.devicePixelRatio||1;
      if(this.width===w&&this.height===h&&this._dpr===dpr)return this;
      this.width=w;this.height=h;this._dpr=dpr;
      let s=Math.min(dpr,this.options.maxDpr);
      if(this.options.quality==='low')s=Math.min(s,.85);
      if(this.options.quality==='high')s=Math.min(s,1.7);
      s=Math.min(s,Math.sqrt(1100000/Math.max(1,w*h)));
      this._scale=s;
      this.canvas.width=Math.max(1,Math.round(w*s));this.canvas.height=Math.max(1,Math.round(h*s));
      this._source.width=this.canvas.width;this._source.height=this.canvas.height;
      let density=this.options.quality==='low'?.75:(this.options.quality==='high'?1.25:1);
      this.cols=clamp(Math.round(w/5.6*density),56,260);
      this.rows=clamp(Math.round(h/5.6*density),56,310);
      const n=this.cols*this.rows;
      this.prev=new Float32Array(n);this.curr=new Float32Array(n);this.next=new Float32Array(n);
      this.heightBytes=new Uint8Array(n);this.heightBytes.fill(128);
      this._active=false;this._quietCount=0;this._accum=0;this._lastFrame=0;this._fallback=[];
      if(this._fallbackCanvas){this._fallbackCanvas.width=this.cols;this._fallbackCanvas.height=this.rows;
        this._fallbackImage=this._fallbackCtx.createImageData(this.cols,this.rows);}
      if(this.gl)this.gl.viewport(0,0,this.canvas.width,this.canvas.height);
      this._clearPixels();return this;
    }
    _clearPixels(){if(this.gl){this.gl.clearColor(0,0,0,0);this.gl.clear(this.gl.COLOR_BUFFER_BIT);}else if(this.ctx)this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);}
    _sleep(){if(this._raf)cancelAnimationFrame(this._raf);this._raf=0;this._running=false;}
    _wake(){if(!this._canRun()||this._running)return;this._running=true;this._lastFrame=0;this._raf=requestAnimationFrame(t=>this._frame(t));}
    _frame(now){
      this._raf=0;if(!this._canRun()){this._running=false;return;}
      const dt=this._lastFrame?clamp(now-this._lastFrame,0,50):16.667;
      this._lastFrame=now;this._accum+=dt;
      let loops=0;
      while(this._accum>=16.667&&loops<3){this._step();this._accum-=16.667;loops++;}
      if(loops===3)this._accum=0;
      if(this._active || (this.options.mode==='scene'&&this.options.continuous))this._render(now/1000);
      if(this._steps%10===0&&this._steps>0){
        const energy=this._measureEnergy();this.energy=energy;
        if(energy < 0.00044 && now-this._lastInput>420)this._quietCount++;
        else this._quietCount=0;
        if(this._quietCount>=5){this._active=false;this._clearPixels();}
      }
      if(!this._fpsAt){this._fpsAt=now;this._fpsCount=0;}
      this._fpsCount++;
      if(now-this._fpsAt>1000){this.fps=Math.round(1000*this._fpsCount/(now-this._fpsAt));this._fpsCount=0;this._fpsAt=now;}
      if(this._active || (this.options.mode==='scene'&&this.options.continuous))this._raf=requestAnimationFrame(t=>this._frame(t));
      else this._running=false;
    }
    _step(){
      if(!this._active)return;
      const W=this.cols,H=this.rows,old=this.prev,curr=this.curr,next=this.next;
      const tension=.16+this.options.speed*.00285;
      const friction=.982+this.options.persistence*.000155; // 0.982–0.9975: energy-based decay
      next.fill(0);
      for(let y=1;y<H-1;y++){
        const row=y*W;
        for(let x=1;x<W-1;x++){
          const i=row+x,h=curr[i];
          const lap=curr[i-1]+curr[i+1]+curr[i-W]+curr[i+W]-4*h;
          let result=h+(h-old[i])*friction+lap*tension;
          const edge=Math.min(x,W-x-1,y,H-y-1);
          if(edge<6)result*=.82+edge*.03;
          next[i]=clamp(result,-2.2,2.2);
        }
      }
      this.prev=curr;this.curr=next;this.next=old;
      for(let i=0;i<next.length;i++)this.heightBytes[i]=clamp(Math.round(128+this.curr[i]*36),0,255);
      this._steps++;
    }
    _measureEnergy(){
      const a=this.curr,b=this.prev;
      if(!a?.length)return 0;
      let s=0,count=0;
      for(let i=0;i<a.length;i+=13){s+=Math.abs(a[i])*.55+Math.abs(a[i]-b[i])*.45;count++;}
      return s/count;
    }
    _sourceFrame(seconds){
      const ctx=this._sourceCtx;if(!ctx)return null;
      const c=this._source,w=c.width,h=c.height;
      ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,w,h);
      if(typeof this.options.sceneRenderer==='function'){
        ctx.setTransform(this._scale,0,0,this._scale,0,0);
        this.options.sceneRenderer(ctx,this.width,this.height,seconds);
        ctx.setTransform(1,0,0,1,0,0);
      }else if(this.options.background){
        try{ctx.drawImage(this.options.background,0,0,w,h);}catch(e){return null;}
      }else{ctx.fillStyle='#123047';ctx.fillRect(0,0,w,h);}
      return c;
    }
    _render(seconds){
      if(this.gl){
        const gl=this.gl,u=this._uniforms;
        gl.useProgram(this._program);
        gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this._heightTex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.LUMINANCE,this.cols,this.rows,0,gl.LUMINANCE,gl.UNSIGNED_BYTE,this.heightBytes);
        if(this.options.mode==='scene'&& (!this._lastSceneFrame||performance.now()-this._lastSceneFrame>1000/this.options.sceneFps)){
          const src=this._sourceFrame(seconds);
          if(src){gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,this._sceneTex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
            try{gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,src);}catch(e){console.warn('WaterRipple source not readable',e);return;}
            this._lastSceneFrame=performance.now();}
        }
        gl.uniform2f(u.texel,1/this.cols,1/this.rows);
        gl.uniform1f(u.highlights,this.options.highlights/100);
        gl.uniform1f(u.strength,this.options.strength/100);
        gl.uniform1f(u.refraction,this.options.refraction/100);
        gl.uniform1f(u.debug,this.options.debugWaveMap?1:0);
        gl.uniform1f(u.sceneMode,this.options.mode==='scene'?1:0);
        gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES,0,6);
      }else if(this.ctx){
        // CPU fallback uses the SAME simulated height field as WebGL.
        // Unlike fixed-timer circles, overlapping wave crests fade when their energy fades.
        const ctx=this.ctx,W=this.cols,H=this.rows;
        ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        if(this.options.mode==='scene'){
          const src=this._sourceFrame(seconds);if(src)ctx.drawImage(src,0,0);
        }
        if(!this._fallbackImage)return;
        const pixels=this._fallbackImage.data,heights=this.heightBytes;
        const light=this.options.highlights/100* this.options.strength/100;
        for(let y=0;y<H;y++){
          const row=y*W;
          for(let x=0;x<W;x++){
            const pos=row+x,idx=((H-1-y)*W+x)*4;
            if(x===0||x===W-1||y===0||y===H-1){pixels[idx+3]=0;continue;}
            const nX=(heights[pos+1]-heights[pos-1])/255;
            const nY=(heights[pos+W]-heights[pos-W])/255;
            const g=Math.hypot(nX,nY);
            const curvature=Math.abs((heights[pos-1]+heights[pos+1]+heights[pos-W]+heights[pos+W])*.25-heights[pos])/255;
            const lit=Math.max(0,-.72*nX+.70*nY);
            const spec=Math.min(1,lit*22);
            const contour=Math.min(1,g*31+curvature*12);
            const alpha=clamp((contour*.16+spec*.15)*light,0,.39);
            pixels[idx]=Math.round(77+156*spec*.62);
            pixels[idx+1]=Math.round(196+54*spec*.62);
            pixels[idx+2]=Math.round(227+28*spec*.62);
            pixels[idx+3]=Math.round(alpha*255);
          }
        }
        this._fallbackCtx.putImageData(this._fallbackImage,0,0);
        ctx.save();ctx.imageSmoothingEnabled=true;
        ctx.drawImage(this._fallbackCanvas,0,0,this.canvas.width,this.canvas.height);
        ctx.restore();

      }
    }
    _inject(x,y,power=1,trail=false){
      if(!this._canRun()||!this.curr)return;
      if(x<0||y<0||x>this.width||y>this.height)return;
      const X=x/this.width*(this.cols-1),Y=(1-y/this.height)*(this.rows-1);
      const radius=(trail?1.55:2.1)+this.options.waveSize*(trail?.025:.036);
      const amp=(.12+.50*this.options.strength/100)*clamp(power,0,3.0);
      const ix0=Math.max(2,Math.floor(X-radius*2.6)),ix1=Math.min(this.cols-3,Math.ceil(X+radius*2.6));
      const iy0=Math.max(2,Math.floor(Y-radius*2.6)),iy1=Math.min(this.rows-3,Math.ceil(Y+radius*2.6));
      for(let j=iy0;j<=iy1;j++)for(let i=ix0;i<=ix1;i++){
        const q=((i-X)**2+(j-Y)**2)/(radius*radius);
        if(q>5.5)continue;
        const value=amp*(Math.exp(-2*q)-.20*Math.exp(-.45*q));
        const a=j*this.cols+i;
        this.curr[a]=clamp(this.curr[a]+value,-1.65,1.65);
      }
      if(this.ctx){this._fallback.push({x,y,power:Math.min(power,1.8),birth:performance.now(),radius:4+radius*2});if(this._fallback.length>75)this._fallback.shift();}
      this._lastInput=performance.now();this._quietCount=0;this._active=true;this._wake();
    }
    splash(x,y,power=1){this._inject(x,y,power);return this;}
    splashNormalized(x,y,power=1){return this.splash(x*this.width,y*this.height,power);}
    _local(x,y){const b=this.element.getBoundingClientRect();return {x:x-b.left,y:y-b.top};}
    _ignored(target){return !!(target instanceof Element &&this.options.ignoreSelector&&target.closest(this.options.ignoreSelector));}
    _stroke(from,to,power,ms){
      if(!from){this._inject(to.x,to.y,power*.6,true);return;}
      const length=Math.hypot(to.x-from.x,to.y-from.y);
      const spacing=clamp(24-this.options.touchFluidity*.19,5,24);
      const count=clamp(Math.ceil(length/spacing),1,28);
      const velocity=length/Math.max(8,ms);
      const amp=clamp(power*(.62+velocity*.18),.03,.32);
      for(let i=1;i<=count;i++){
        const f=i/count;this._inject(from.x+(to.x-from.x)*f,from.y+(to.y-from.y)*f,amp,true);
      }
    }
    _mouseDown(e){if(e.pointerType==='touch'||e.button!==0||this._ignored(e.target))return;
      const p=this._local(e.clientX,e.clientY);this.splash(p.x,p.y,e.pointerType==='pen'?.78:1.05);this._lastPointer={...p,t:performance.now()};}
    _mouseMove(e){if(e.pointerType==='touch'||this._ignored(e.target)||(!this.options.hover&&!e.buttons))return;
      const t=performance.now();if(t-this._lastMouse<24)return;
      const p=this._local(e.clientX,e.clientY),from=this._lastPointer;
      if(from&&Math.hypot(p.x-from.x,p.y-from.y)<6)return;
      if(from)this._stroke(from,p,e.buttons?.27*this.options.dragStrength/50:.09,t-from.t);
      else this._inject(p.x,p.y,.07,true);
      this._lastPointer={...p,t};this._lastMouse=t;}
    _touchStart(e){if(this._ignored(e.target)||this._touch||!e.changedTouches.length)return;
      const touch=e.changedTouches[0],p=this._local(touch.clientX,touch.clientY);
      this._touch={id:touch.identifier,p,t:performance.now()};this.splash(p.x,p.y,1.0);}
    _touchMove(e){if(!this._touch)return;
      let touch=null;for(const v of e.changedTouches)if(v.identifier===this._touch.id){touch=v;break;}
      if(!touch)return;
      const p=this._local(touch.clientX,touch.clientY),t=performance.now();
      this._stroke(this._touch.p,p,.29*this.options.dragStrength/50,t-this._touch.t);
      this._touch.p=p;this._touch.t=t;}
    _touchEnd(e){if(!this._touch)return;
      for(const v of e.changedTouches)if(v.identifier===this._touch.id){this._touch=null;break;}}
    setOptions(patch){
      if(this._destroyed)return this;
      const before=this.options;this.options=this._normalize({...before,...patch});
      if(before.touchBehavior!==this.options.touchBehavior)this.element.style.touchAction=this.options.touchBehavior==='paint'?'none':this._prevStyle.touchAction;
      this._applyBounds();
      if(before.quality!==this.options.quality||before.maxDpr!==this.options.maxDpr){this.width=-1;this.resize();}
      if(!this.options.enabled||this._reducedOn())this.clear();
      else if(before.mode!==this.options.mode){this._lastSceneFrame=0;this._active=true;this._wake();}
      return this;
    }
    getOptions(){return {...this.options};}
    getStats(){return {renderer:this.renderer,fps:this.fps||0,energy:this.energy||0,width:this.width,height:this.height,grid:`${this.cols}x${this.rows}`,active:!!this._active};}
    clear(){if(this.curr){this.prev.fill(0);this.curr.fill(0);this.next.fill(0);this.heightBytes.fill(128);}
      this._fallback=[];this._active=false;this._quietCount=0;this.energy=0;this._sleep();this._clearPixels();return this;}
    destroy(){if(this._destroyed)return;
      this._sleep();this._destroyed=true;
      for(const [obj,name,fn,opts] of this._listeners)obj.removeEventListener(name,fn,opts);
      this._ro?.disconnect();this._io?.disconnect();
      if(this._media){if(this._media.removeEventListener)this._media.removeEventListener('change',this._onMedia);else this._media.removeListener(this._onMedia);}
      if(this.gl){this.gl.deleteTexture(this._heightTex);this.gl.deleteTexture(this._sceneTex);this.gl.deleteBuffer(this._buffer);this.gl.deleteProgram(this._program);}
      this.canvas.remove();this.element.style.position=this._prevStyle.position;this.element.style.touchAction=this._prevStyle.touchAction;
    }
  }
  WaterRipple.version='2.1.0';WaterRipple.defaults=DEFAULTS;
  return WaterRipple;
});
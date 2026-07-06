/*!
 * Maya — Florida Mortgage Assistant · embeddable chat widget
 * Self-contained, isolated in a Shadow DOM. Photo avatar + minimize/drag-down.
 * Talks to a Cloudflare Worker (holds the API key) running the Maya persona/KB.
 */
(function () {
  "use strict";
  if (window.__mayaWidgetLoaded) return;
  window.__mayaWidgetLoaded = true;

  // ---- Config ------------------------------------------------------------
  var ENDPOINT = window.MAYA_ENDPOINT || "https://maya-mortgage.maya-mortgage.workers.dev";
  var scriptEl = document.currentScript || document.querySelector('script[src*="maya-widget"]');
  var AVATAR = scriptEl ? new URL("maya.jpg", scriptEl.src).href : "maya.jpg";
  var GREETING =
    "Hi, I'm **Maya** 👋 your Florida mortgage assistant. I can explain how mortgages work here — down payments, programs like Hometown Heroes, condo rules, insurance, closing costs — in plain English. For your actual rate or approval I'll point you to a licensed loan officer. What can I help you with?";
  var SUGGESTED = [
    "What down payment do I need in Florida?",
    "What is the Hometown Heroes program?",
    "How does condo financing work after Surfside?",
    "What mortgage rate can I get?"
  ];
  var DISCLAIMER =
    "Maya is an AI assistant providing general info about Florida mortgages — not financial, legal, or tax advice, and not a substitute for a licensed loan officer (NMLS). Rates/programs are general and current as of July 2026.";

  // ---- Host + Shadow root -------------------------------------------------
  var host = document.createElement("div");
  host.id = "maya-widget-host";
  host.setAttribute("data-lenis-prevent", ""); // let the chat scroll even under Lenis smooth-scroll
  document.body.appendChild(host);
  var root = host.attachShadow({ mode: "open" });

  var CSS = "\
:host{all:initial}\
*{box-sizing:border-box;margin:0;padding:0;font-family:system-ui,-apple-system,'Segoe UI',Inter,Roboto,sans-serif}\
.wrap{position:fixed;bottom:22px;right:22px;z-index:2147483000}\
.ph{width:100%;height:100%;object-fit:cover;object-position:50% 28%;display:block}\
.dot{position:absolute;right:-1px;bottom:-1px;width:12px;height:12px;border-radius:50%;background:#22C55E;border:2.5px solid #fff}\
.fab{display:flex;align-items:center;gap:11px;border:none;cursor:pointer;padding:8px 20px 8px 8px;border-radius:999px;\
 background:linear-gradient(135deg,#8A1523,#C8102E);color:#fff;box-shadow:0 12px 32px rgba(138,21,35,.42);\
 font-size:15.5px;font-weight:650;transition:transform .18s ease,box-shadow .18s ease}\
.fab:hover{transform:translateY(-2px);box-shadow:0 18px 42px rgba(138,21,35,.5)}\
.fab .pav{position:relative;width:44px;height:44px;border-radius:50%;overflow:visible;flex:0 0 auto}\
.fab .pav .ph{border-radius:50%;box-shadow:0 0 0 2px rgba(255,255,255,.6)}\
.fab.hide{display:none}\
.panel{position:fixed;bottom:22px;right:22px;width:392px;max-width:calc(100vw - 32px);height:610px;max-height:calc(100vh - 44px);\
 background:#fff;border-radius:22px;box-shadow:0 26px 74px rgba(60,10,18,.34);display:flex;flex-direction:column;overflow:hidden;\
 opacity:0;transform:translateY(20px) scale(.98);pointer-events:none;transition:opacity .22s ease,transform .22s ease}\
.panel.open{opacity:1;transform:none;pointer-events:auto}\
.panel.dragging{transition:none}\
.hd{position:relative;background:linear-gradient(135deg,#7C1220 0%,#A81528 55%,#C8102E 100%);color:#fff;padding:15px 14px 15px 16px;display:flex;align-items:center;gap:12px;cursor:grab;touch-action:none;flex:0 0 auto}\
.hd:active{cursor:grabbing}\
.hd .grip{position:absolute;top:6px;left:50%;transform:translateX(-50%);width:38px;height:4px;border-radius:99px;background:rgba(255,255,255,.35)}\
.hav{position:relative;width:46px;height:46px;border-radius:50%;flex:0 0 auto}\
.hav .ph{border-radius:50%;box-shadow:0 0 0 2.5px rgba(255,255,255,.35)}\
.who{flex:1;min-width:0}\
.who b{font-size:16.5px;font-weight:750;letter-spacing:.2px;display:flex;align-items:center;gap:7px}\
.badge{font-size:9.5px;font-weight:800;letter-spacing:.6px;background:rgba(255,255,255,.22);color:#fff;padding:2px 6px;border-radius:5px}\
.who .sub{font-size:12px;opacity:.9;display:flex;align-items:center;gap:5px;margin-top:2px}\
.who .sub i{width:7px;height:7px;border-radius:50%;background:#3BE38B;box-shadow:0 0 6px #3BE38B}\
.hbtns{display:flex;gap:6px;flex:0 0 auto}\
.hbtn{background:rgba(255,255,255,.14);border:none;color:#fff;width:30px;height:30px;border-radius:9px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s}\
.hbtn:hover{background:rgba(255,255,255,.28)}.hbtn svg{width:16px;height:16px}\
.body{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:18px 15px 8px;background:#FAF7F6;display:flex;flex-direction:column;gap:12px}\
.row{display:flex;gap:9px;align-items:flex-end;max-width:100%}\
.row.u{flex-direction:row-reverse}\
.mav{width:28px;height:28px;border-radius:50%;flex:0 0 auto;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.12)}\
.bub{padding:10px 13px;border-radius:15px;font-size:14px;line-height:1.5;max-width:78%;word-wrap:break-word}\
.row.m .bub{background:#fff;color:#26140f;border:1px solid #efe4e2;border-bottom-left-radius:5px;box-shadow:0 1px 2px rgba(60,20,20,.04)}\
.row.u .bub{background:linear-gradient(135deg,#C8102E,#A81528);color:#fff;border-bottom-right-radius:5px}\
.bub a{color:#C8102E;font-weight:600}.row.u .bub a{color:#ffd6dc}\
.bub strong{font-weight:700}.bub ul{margin:6px 0 2px;padding-left:18px}.bub li{margin:3px 0}\
.chips{display:flex;flex-wrap:wrap;gap:7px;margin:2px 0 6px 37px}\
.chip{background:#fff;border:1px solid #eccdd2;color:#8A1523;font-size:12.5px;font-weight:550;padding:7px 11px;border-radius:999px;cursor:pointer;transition:all .15s}\
.chip:hover{background:#C8102E;color:#fff;border-color:#C8102E}\
.typing{display:flex;gap:4px;padding:12px 14px;background:#fff;border:1px solid #efe4e2;border-radius:15px;border-bottom-left-radius:5px;width:fit-content}\
.typing i{width:7px;height:7px;border-radius:50%;background:#d59aa2;animation:bl 1.2s infinite}\
.typing i:nth-child(2){animation-delay:.2s}.typing i:nth-child(3){animation-delay:.4s}\
@keyframes bl{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-4px)}}\
.ft{border-top:1px solid #f0e7e5;background:#fff;padding:10px 12px 8px;flex:0 0 auto}\
.inrow{display:flex;gap:8px;align-items:flex-end}\
.inrow textarea{flex:1;border:1px solid #e2d3d0;border-radius:12px;padding:10px 12px;font-size:14px;resize:none;max-height:96px;outline:none;line-height:1.4;font-family:inherit}\
.inrow textarea:focus{border-color:#C8102E;box-shadow:0 0 0 3px rgba(200,16,46,.13)}\
.send{background:linear-gradient(135deg,#C8102E,#A81528);border:none;width:40px;height:40px;border-radius:11px;cursor:pointer;flex:0 0 auto;display:flex;align-items:center;justify-content:center;transition:opacity .15s}\
.send:disabled{opacity:.45;cursor:default}.send svg{width:19px;height:19px}\
.disc{font-size:10px;color:#a08f8b;line-height:1.35;margin-top:7px;text-align:center}\
.body::-webkit-scrollbar{width:7px}.body::-webkit-scrollbar-thumb{background:#e3cfcc;border-radius:8px}\
@media(max-width:480px){.panel{width:100vw;height:100vh;max-height:100vh;bottom:0;right:0;border-radius:0}.wrap{bottom:16px;right:16px}}\
";

  var SEND_ICON = "<svg viewBox='0 0 24 24' fill='none'><path d='M4 12 20 4l-6 16-3.5-6.5L4 12Z' stroke='#fff' stroke-width='2' stroke-linejoin='round' stroke-linecap='round'/></svg>";
  var MIN_ICON = "<svg viewBox='0 0 24 24' fill='none'><path d='M6 10l6 6 6-6' stroke='#fff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/></svg>";
  var X_ICON = "<svg viewBox='0 0 24 24' fill='none'><path d='M6 6l12 12M18 6L6 18' stroke='#fff' stroke-width='2.2' stroke-linecap='round'/></svg>";
  var IMG = "<img class='ph' src='" + AVATAR + "' alt='Maya'>";

  var el = document.createElement("div");
  el.className = "wrap";
  el.innerHTML =
    "<style>" + CSS + "</style>" +
    "<button class='fab' aria-label='Chat with Maya'>" +
    "<span class='pav'>" + IMG + "<i class='dot'></i></span><span class='flabel'>Ask Maya</span></button>" +
    "<section class='panel' role='dialog' aria-label='Maya chat'>" +
    "<header class='hd'><span class='grip'></span>" +
    "<span class='hav'>" + IMG + "<i class='dot'></i></span>" +
    "<div class='who'><b>Maya <span class='badge'>AI</span></b><span class='sub'><i></i>Florida Mortgage Assistant</span></div>" +
    "<div class='hbtns'><button class='hbtn min' aria-label='Minimize'>" + MIN_ICON + "</button>" +
    "<button class='hbtn x' aria-label='Close'>" + X_ICON + "</button></div></header>" +
    "<div class='body'></div>" +
    "<div class='ft'><div class='inrow'>" +
    "<textarea rows='1' placeholder='Ask about Florida mortgages…' aria-label='Message'></textarea>" +
    "<button class='send' aria-label='Send'>" + SEND_ICON + "</button></div>" +
    "<div class='disc'>" + DISCLAIMER + "</div></div></section>";
  root.appendChild(el);

  var fab = root.querySelector(".fab");
  var panel = root.querySelector(".panel");
  var hd = root.querySelector(".hd");
  var body = root.querySelector(".body");
  var ta = root.querySelector("textarea");
  var sendBtn = root.querySelector(".send");

  var history = [], started = false, busy = false;

  function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
  function fmt(text){
    var t = esc(text);
    t = t.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>");
    t = t.replace(/(https?:\/\/[^\s)]+)/g,function(u){var c=u.replace(/[.,;]$/,"");return "<a href='"+c+"' target='_blank' rel='noopener'>"+c+"</a>";});
    var lines=t.split(/\n/),out=[],inL=false;
    for(var i=0;i<lines.length;i++){var m=/^\s*[-•]\s+(.*)$/.exec(lines[i]);
      if(m){if(!inL){out.push("<ul>");inL=true;}out.push("<li>"+m[1]+"</li>");}
      else{if(inL){out.push("</ul>");inL=false;}out.push(lines[i]);}}
    if(inL)out.push("</ul>");
    return out.join("\n").replace(/\n{2,}/g,"<br><br>").replace(/\n/g,"<br>");
  }
  function scroll(){body.scrollTop=body.scrollHeight;}
  function addMsg(role,text){
    var row=document.createElement("div");
    row.className="row "+(role==="user"?"u":"m");
    row.innerHTML=(role!=="user"?"<span class='mav'>"+IMG+"</span>":"")+"<div class='bub'>"+fmt(text)+"</div>";
    body.appendChild(row);scroll();
  }
  function addChips(){
    var wrap=document.createElement("div");wrap.className="chips";
    SUGGESTED.forEach(function(q){var c=document.createElement("button");c.className="chip";c.textContent=q;
      c.addEventListener("click",function(){wrap.remove();send(q);});wrap.appendChild(c);});
    body.appendChild(wrap);scroll();
  }
  function typing(on){
    var ex=root.querySelector(".typing-row");if(ex)ex.remove();
    if(on){var row=document.createElement("div");row.className="row m typing-row";
      row.innerHTML="<span class='mav'>"+IMG+"</span><div class='typing'><i></i><i></i><i></i></div>";
      body.appendChild(row);scroll();}
  }
  function send(text){
    text=(text||"").trim();if(!text||busy)return;
    busy=true;sendBtn.disabled=true;addMsg("user",text);history.push({role:"user",content:text});
    ta.value="";ta.style.height="auto";typing(true);
    fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:history})})
      .then(function(r){return r.json().then(function(j){return{ok:r.ok,j:j};});})
      .then(function(res){typing(false);
        var reply=(res.j&&(res.j.reply||res.j.message))||null;
        if(!res.ok||!reply){addMsg("assistant","Sorry — I'm having trouble reaching my brain right now. Please try again in a moment.");}
        else{addMsg("assistant",reply);history.push({role:"assistant",content:reply});}})
      .catch(function(){typing(false);addMsg("assistant","Sorry — I can't connect right now. Please try again shortly.");})
      .then(function(){busy=false;sendBtn.disabled=false;ta.focus();});
  }

  function open(){panel.classList.add("open");fab.classList.add("hide");
    if(!started){started=true;addMsg("assistant",GREETING);addChips();}
    setTimeout(function(){ta.focus();},250);}
  function minimize(){panel.classList.remove("dragging");panel.style.transform="";panel.classList.remove("open");fab.classList.remove("hide");}

  fab.addEventListener("click",open);
  root.querySelector(".x").addEventListener("click",minimize);
  root.querySelector(".min").addEventListener("click",minimize);
  sendBtn.addEventListener("click",function(){send(ta.value);});
  ta.addEventListener("keydown",function(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send(ta.value);}});
  ta.addEventListener("input",function(){ta.style.height="auto";ta.style.height=Math.min(ta.scrollHeight,96)+"px";});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&panel.classList.contains("open"))minimize();});

  // ---- Drag the header DOWN to minimize ----------------------------------
  var dragging=false,startY=0,dy=0;
  hd.addEventListener("pointerdown",function(e){
    if(e.target.closest(".hbtn"))return;            // ignore button taps
    dragging=true;startY=e.clientY;dy=0;
    panel.classList.add("dragging");
    try{hd.setPointerCapture(e.pointerId);}catch(_){}
  });
  hd.addEventListener("pointermove",function(e){
    if(!dragging)return;
    dy=Math.max(0,e.clientY-startY);
    panel.style.transform="translateY("+dy+"px)";
    panel.style.opacity=String(Math.max(0.4,1-dy/500));
  });
  function endDrag(){
    if(!dragging)return;dragging=false;
    panel.classList.remove("dragging");
    panel.style.opacity="";
    if(dy>110){minimize();}
    else{panel.style.transform="";}   // snap back via transition
  }
  hd.addEventListener("pointerup",endDrag);
  hd.addEventListener("pointercancel",endDrag);

  // ---- Wheel over the conversation scrolls the chat, not the page --------
  body.addEventListener("wheel",function(e){
    var d = e.deltaMode===1 ? e.deltaY*16 : (e.deltaMode===2 ? e.deltaY*body.clientHeight : e.deltaY);
    body.scrollTop += d;
    e.preventDefault();
    e.stopPropagation();
  },{passive:false});
})();

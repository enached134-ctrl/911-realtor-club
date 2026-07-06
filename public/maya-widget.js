/*!
 * Maya — Florida Mortgage Assistant · embeddable chat widget
 * Self-contained, framework-agnostic, isolated in a Shadow DOM (no CSS clashes).
 * Talks to a Cloudflare Worker (holds the API key) which runs the Maya persona/KB.
 *
 * Config: set window.MAYA_ENDPOINT before this script loads, or edit ENDPOINT below.
 */
(function () {
  "use strict";
  if (window.__mayaWidgetLoaded) return;
  window.__mayaWidgetLoaded = true;

  // ---- Config ------------------------------------------------------------
  var ENDPOINT =
    window.MAYA_ENDPOINT ||
    "https://maya-mortgage.maya-mortgage.workers.dev"; // live Cloudflare Worker (Maya brain)
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
  host.style.cssText = "position:fixed;z-index:2147483000;bottom:0;right:0;";
  document.body.appendChild(host);
  var root = host.attachShadow({ mode: "open" });

  var CSS = "\
:host{all:initial}\
*{box-sizing:border-box;margin:0;padding:0;font-family:system-ui,-apple-system,'Segoe UI',Inter,Roboto,sans-serif}\
.wrap{position:fixed;bottom:22px;right:22px;z-index:2147483000}\
.fab{display:flex;align-items:center;gap:10px;border:none;cursor:pointer;padding:12px 18px 12px 12px;border-radius:999px;\
 background:linear-gradient(135deg,#0B2545,#12B5A5);color:#fff;box-shadow:0 10px 30px rgba(11,37,69,.35);\
 font-size:15px;font-weight:650;transition:transform .18s ease,box-shadow .18s ease}\
.fab:hover{transform:translateY(-2px);box-shadow:0 16px 40px rgba(11,37,69,.45)}\
.fab .av{width:30px;height:30px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;flex:0 0 auto}\
.fab .av svg{width:20px;height:20px}\
.fab.hide{display:none}\
.panel{position:fixed;bottom:22px;right:22px;width:390px;max-width:calc(100vw - 32px);height:600px;max-height:calc(100vh - 44px);\
 background:#fff;border-radius:20px;box-shadow:0 24px 70px rgba(8,20,40,.35);display:flex;flex-direction:column;overflow:hidden;\
 opacity:0;transform:translateY(16px) scale(.98);pointer-events:none;transition:opacity .2s ease,transform .2s ease}\
.panel.open{opacity:1;transform:none;pointer-events:auto}\
.hd{background:linear-gradient(135deg,#0B2545,#0E2E4E);color:#fff;padding:16px 16px;display:flex;align-items:center;gap:12px}\
.hd .av{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#12B5A5,#3BE0CE);display:flex;align-items:center;justify-content:center;flex:0 0 auto;box-shadow:0 0 0 3px rgba(255,255,255,.12)}\
.hd .av svg{width:26px;height:26px}\
.hd .who{flex:1;min-width:0}\
.hd .who b{font-size:16px;font-weight:750;letter-spacing:.2px;display:flex;align-items:center;gap:7px}\
.hd .badge{font-size:9.5px;font-weight:800;letter-spacing:.6px;background:#12B5A5;color:#04231f;padding:2px 6px;border-radius:5px}\
.hd .who span{font-size:12px;opacity:.75;display:block;margin-top:1px}\
.hd .x{background:rgba(255,255,255,.12);border:none;color:#fff;width:30px;height:30px;border-radius:8px;cursor:pointer;font-size:18px;line-height:1;flex:0 0 auto;transition:background .15s}\
.hd .x:hover{background:rgba(255,255,255,.25)}\
.body{flex:1;overflow-y:auto;padding:18px 15px 8px;background:#F7F9FC;display:flex;flex-direction:column;gap:12px}\
.row{display:flex;gap:9px;align-items:flex-end;max-width:100%}\
.row.u{flex-direction:row-reverse}\
.row .mav{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#12B5A5,#3BE0CE);flex:0 0 auto;display:flex;align-items:center;justify-content:center}\
.row .mav svg{width:16px;height:16px}\
.bub{padding:10px 13px;border-radius:15px;font-size:14px;line-height:1.5;max-width:78%;white-space:normal;word-wrap:break-word}\
.row.m .bub{background:#fff;color:#0d1b2a;border:1px solid #e6ecf3;border-bottom-left-radius:5px;box-shadow:0 1px 2px rgba(16,40,70,.04)}\
.row.u .bub{background:#0B2545;color:#fff;border-bottom-right-radius:5px}\
.bub a{color:#0e7c72;font-weight:600}.row.u .bub a{color:#9fe9df}\
.bub strong{font-weight:700}\
.bub ul{margin:6px 0 2px;padding-left:18px}.bub li{margin:3px 0}\
.chips{display:flex;flex-wrap:wrap;gap:7px;margin:2px 0 6px 35px}\
.chip{background:#fff;border:1px solid #cfe0ea;color:#0B2545;font-size:12.5px;font-weight:550;padding:7px 11px;border-radius:999px;cursor:pointer;transition:all .15s}\
.chip:hover{background:#0B2545;color:#fff;border-color:#0B2545}\
.typing{display:flex;gap:4px;padding:12px 14px;background:#fff;border:1px solid #e6ecf3;border-radius:15px;border-bottom-left-radius:5px;width:fit-content}\
.typing i{width:7px;height:7px;border-radius:50%;background:#9db4c6;animation:bl 1.2s infinite}\
.typing i:nth-child(2){animation-delay:.2s}.typing i:nth-child(3){animation-delay:.4s}\
@keyframes bl{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-4px)}}\
.ft{border-top:1px solid #eef2f6;background:#fff;padding:10px 12px 8px}\
.inrow{display:flex;gap:8px;align-items:flex-end}\
.inrow textarea{flex:1;border:1px solid #d4dfe8;border-radius:12px;padding:10px 12px;font-size:14px;resize:none;max-height:96px;outline:none;line-height:1.4;font-family:inherit}\
.inrow textarea:focus{border-color:#12B5A5;box-shadow:0 0 0 3px rgba(18,181,165,.15)}\
.send{background:linear-gradient(135deg,#0B2545,#12B5A5);border:none;width:40px;height:40px;border-radius:11px;cursor:pointer;flex:0 0 auto;display:flex;align-items:center;justify-content:center;transition:opacity .15s}\
.send:disabled{opacity:.45;cursor:default}.send svg{width:19px;height:19px}\
.disc{font-size:10px;color:#8a9bab;line-height:1.35;margin-top:7px;text-align:center}\
.body::-webkit-scrollbar{width:7px}.body::-webkit-scrollbar-thumb{background:#cdd9e3;border-radius:8px}\
@media(max-width:480px){.panel{width:100vw;height:100vh;max-height:100vh;bottom:0;right:0;border-radius:0}.wrap{bottom:16px;right:16px}}\
";

  // Maya avatar (friendly chat/house mark)
  var AV_LIGHT =
    "<svg viewBox='0 0 24 24' fill='none'><path d='M4 11.5 12 5l8 6.5' stroke='#0B2545' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/><path d='M6 10.5V18a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-7.5' stroke='#0B2545' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/><circle cx='12' cy='13.5' r='1.6' fill='#12B5A5'/></svg>";
  var AV_WHITE =
    "<svg viewBox='0 0 24 24' fill='none'><path d='M4 11.5 12 5l8 6.5' stroke='#fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/><path d='M6 10.5V18a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-7.5' stroke='#fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/><circle cx='12' cy='13.5' r='1.6' fill='#3BE0CE'/></svg>";
  var SEND_ICON =
    "<svg viewBox='0 0 24 24' fill='none'><path d='M4 12 20 4l-6 16-3.5-6.5L4 12Z' stroke='#fff' stroke-width='2' stroke-linejoin='round' stroke-linecap='round'/></svg>";

  var el = document.createElement("div");
  el.className = "wrap";
  el.innerHTML =
    "<style>" + CSS + "</style>" +
    "<button class='fab' aria-label='Open Maya, the mortgage assistant'>" +
    "<span class='av'>" + AV_LIGHT + "</span><span>Ask Maya</span></button>" +
    "<section class='panel' role='dialog' aria-label='Maya chat'>" +
    "<header class='hd'><span class='av'>" + AV_WHITE + "</span>" +
    "<div class='who'><b>Maya <span class='badge'>AI</span></b><span>Florida Mortgage Assistant</span></div>" +
    "<button class='x' aria-label='Close'>×</button></header>" +
    "<div class='body'></div>" +
    "<div class='ft'><div class='inrow'>" +
    "<textarea rows='1' placeholder='Ask about Florida mortgages…' aria-label='Message'></textarea>" +
    "<button class='send' aria-label='Send'>" + SEND_ICON + "</button></div>" +
    "<div class='disc'>" + DISCLAIMER + "</div></div></section>";
  root.appendChild(el);

  var fab = root.querySelector(".fab");
  var panel = root.querySelector(".panel");
  var body = root.querySelector(".body");
  var ta = root.querySelector("textarea");
  var sendBtn = root.querySelector(".send");
  var closeBtn = root.querySelector(".x");

  var history = [];
  var started = false;
  var busy = false;

  // ---- Rendering ---------------------------------------------------------
  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function fmt(text) {
    var t = esc(text);
    t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    t = t.replace(/(https?:\/\/[^\s)]+)(?![^<]*>)/g, function (u) {
      var clean = u.replace(/[.,;]$/, "");
      return "<a href='" + clean + "' target='_blank' rel='noopener'>" + clean + "</a>";
    });
    // bullet lines -> list
    var lines = t.split(/\n/);
    var out = [], inList = false;
    for (var i = 0; i < lines.length; i++) {
      var m = /^\s*[-•]\s+(.*)$/.exec(lines[i]);
      if (m) {
        if (!inList) { out.push("<ul>"); inList = true; }
        out.push("<li>" + m[1] + "</li>");
      } else {
        if (inList) { out.push("</ul>"); inList = false; }
        out.push(lines[i]);
      }
    }
    if (inList) out.push("</ul>");
    return out.join("\n").replace(/\n{2,}/g, "<br><br>").replace(/\n/g, "<br>");
  }
  function scroll() { body.scrollTop = body.scrollHeight; }

  function addMsg(role, text) {
    var row = document.createElement("div");
    row.className = "row " + (role === "user" ? "u" : "m");
    var inner = "";
    if (role !== "user") inner += "<span class='mav'>" + AV_WHITE + "</span>";
    inner += "<div class='bub'>" + fmt(text) + "</div>";
    row.innerHTML = inner;
    body.appendChild(row);
    scroll();
  }

  function addChips() {
    var wrap = document.createElement("div");
    wrap.className = "chips";
    SUGGESTED.forEach(function (q) {
      var c = document.createElement("button");
      c.className = "chip";
      c.textContent = q;
      c.addEventListener("click", function () { wrap.remove(); send(q); });
      wrap.appendChild(c);
    });
    body.appendChild(wrap);
    scroll();
  }

  function typing(on) {
    var ex = root.querySelector(".typing-row");
    if (ex) ex.remove();
    if (on) {
      var row = document.createElement("div");
      row.className = "row m typing-row";
      row.innerHTML = "<span class='mav'>" + AV_WHITE + "</span><div class='typing'><i></i><i></i><i></i></div>";
      body.appendChild(row);
      scroll();
    }
  }

  // ---- Networking --------------------------------------------------------
  function send(text) {
    text = (text || "").trim();
    if (!text || busy) return;
    busy = true; sendBtn.disabled = true;
    addMsg("user", text);
    history.push({ role: "user", content: text });
    ta.value = ""; ta.style.height = "auto";
    typing(true);

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history })
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        typing(false);
        var reply = (res.j && (res.j.reply || res.j.message)) || null;
        if (!res.ok || !reply) {
          addMsg("assistant", "Sorry — I'm having trouble reaching my brain right now. Please try again in a moment.");
        } else {
          addMsg("assistant", reply);
          history.push({ role: "assistant", content: reply });
        }
      })
      .catch(function () {
        typing(false);
        addMsg("assistant", "Sorry — I can't connect right now. Please try again shortly.");
      })
      .then(function () { busy = false; sendBtn.disabled = false; ta.focus(); });
  }

  // ---- Open / close ------------------------------------------------------
  function open() {
    panel.classList.add("open");
    fab.classList.add("hide");
    if (!started) {
      started = true;
      addMsg("assistant", GREETING);
      addChips();
    }
    setTimeout(function () { ta.focus(); }, 250);
  }
  function close() { panel.classList.remove("open"); fab.classList.remove("hide"); }

  fab.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  sendBtn.addEventListener("click", function () { send(ta.value); });
  ta.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(ta.value); }
  });
  ta.addEventListener("input", function () {
    ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 96) + "px";
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.classList.contains("open")) close();
  });
})();

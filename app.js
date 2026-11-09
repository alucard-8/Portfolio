(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const src = p => encodeURI(p);
  // optimized copies live in images/thumb (grids) and images/web (viewer); gifs/videos stay original
  const v = (p, kind) => /\.(gif|mp4)$/i.test(p) || p.startsWith("images/web/") ? p : p.replace(/^images\//, `images/${kind}/`).replace(/\.\w+$/, ".webp");

  /* ---------- COMMISSIONS: edit prices + slots here ---------- */
  const COMMISSIONS = {
    slotsOpen: null,          // set a number (e.g. 3) to show the slots meter, null hides it
    slotsTotal: 5,
    currency: "$",
    tiers: [
      { name: "BUST-UP", prices: [5, 10, 25] },
      { name: "HALF-BODY", prices: [10, 15, 40], hot: true },
      { name: "FULL BODY", prices: [15, 20, 50] },
      { name: "CHIBI", prices: [5, 10, 15] }
    ],
    levels: ["sketch", "lineart", "rendered"],
    addons: ["extra character +50%", "background $5–$15"],
    will: ["fanart", "OCs", "furries"],
    wont: ["NSFW", "realism", "ships"],
    payment: "PayPal or Robux · you pay after the sketch"
  };

  /* ---------- games (from alucardd8.itch.io) ---------- */
  const GAMES = [
    { t: "Ducking Crazy", u: "https://alucardd8.itch.io/ducking-crazy", img: "images/covers/ducking-crazy.png", g: "racing", new: true },
    { t: "RIFT", u: "https://alucardd8.itch.io/rift", img: "images/covers/rift.png", g: "game jam", new: true },
    { t: "Gamble Baby", u: "https://alucardd8.itch.io/gamble-baby", img: "images/covers/gamble-baby.png", g: "card game", new: true },
    { t: "SOULBREAK", u: "https://alucardd8.itch.io/soulbreak", img: "images/covers/soulbreak.png", g: "game jam" },
    { t: "Rogue Protocol", u: "https://nomad-2088.itch.io/rogue-protocol", img: "images/covers/rogue.gif", g: "shooter", d: "Roguelike arena shooter where every loop you survive comes back to hunt you as a ghost." },
    { t: "Pokado", u: "https://toccata.itch.io/pokado", img: "images/covers/pokado.png", g: "arcade", d: "Bet cash and guess the exact countdown time to win." },
    { t: "Unseen", u: "https://naaylla.itch.io/unseen", img: "images/covers/unseen.png", g: "horror", d: "Escape the experiment… just don't look away." }
  ];
  const esc = x => String(x).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  $("#gamesGrid").innerHTML = GAMES.map(g => `
    <article class="win game">
      <div class="win-bar"><span>${esc(g.t.toUpperCase())}</span><span class="win-btns"><b></b><b></b><b class="x"></b></span></div>
      <a class="game-img" href="${g.u}" target="_blank" rel="noopener">${g.new ? '<span class="new">NEW!</span>' : ""}<img src="${src(v(g.img, "thumb"))}" alt="${esc(g.t)} cover" loading="lazy"></a>
      ${g.d ? `<p class="game-d">${esc(g.d)}</p>` : ""}
      <div class="game-foot"><span class="tag">${esc(g.g)}</span><a class="btn tiny" href="${g.u}" target="_blank" rel="noopener">PLAY ▶</a></div>
    </article>`).join("");

  /* ---------- commissions render ---------- */
  {
    const C = COMMISSIONS;
    $("#slotsTxt").innerHTML = C.slotsOpen > 0
      ? `<span class="dot"></span> ${C.slotsOpen}/${C.slotsTotal} SLOTS OPEN`
      : `<span class="dot off"></span> CLOSED — DM TO JOIN THE WAITLIST`;
    $("#slotRow").innerHTML = Array.from({ length: C.slotsTotal }, (_, i) => `<i class="${i < C.slotsTotal - C.slotsOpen ? "taken" : ""}"></i>`).join("");
    $("#tiers").innerHTML = C.tiers.map(t => `
      <article class="win tier${t.hot ? " hot" : ""}">
        <div class="win-bar"><span>${esc(t.name)}</span>${t.hot ? '<span class="pop-tag">POPULAR</span>' : ""}</div>
        <div class="tier-body">
          <p class="price"><small>from</small> ${C.currency}${t.prices[0]}</p>
          <ul class="plist">${t.prices.map((p, i) => `<li><span>${C.levels[i]}</span><b>${C.currency}${p}</b></li>`).join("")}</ul>
        </div>
      </article>`).join("");
    $("#cInfo").innerHTML = `
      <div class="win info"><div class="win-bar"><span>ADD-ONS</span></div><ul>${C.addons.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
      <div class="win info"><div class="win-bar ok"><span>☺ WILL DRAW</span></div><ul>${C.will.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
      <div class="win info"><div class="win-bar no"><span>☹ WON'T DRAW</span></div><ul>${C.wont.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
      <div class="win info"><div class="win-bar"><span>PAYMENT</span></div><ul><li>${esc(C.payment)}</li></ul></div>`;
    $(".slots").hidden = C.slotsOpen == null;
    $("#sheetBtn").addEventListener("click", () => openLB([{ src: "images/web/commission-sheet.webp", title: "commission sheet" }], 0));
  }

  /* ---------- gallery data ---------- */
  const DESIGN = ["brandiha 24h lime.png","poster.png","primary logo.png","Banner.png","Instagram post - 25.png","first page.png",
    "back shirt 1.1.png","option 1.png","option 2.png","monochrome logo.png","page 26.png","Check your emails.png",
    "Frame 2147238711.png","Group 2085665058.png","1.png","2.png","3.png","4.png","5.png","6.png","7.png",
    "144.png","145.png","146.png","147.png","148.png","149.png","150.png","151.png","152.png","153.png",
    "164.png","165.png","166.png","167.png","168.png","169.png","option 4.png","option 5.png",
    "back shirt 1.1-1.png","back shirt 1.1-2.png","Frame 2147239016.png","Group 2085665236.png","Group 2085665622.png",
    "frame.png","frame-1.png","frame-2.png","monochrome logo-1.png","sara li modifyaha alucard.png"
  ].map(f => ({ src: "images/designs/" + f, title: f.replace(/\.\w+$/, "") }));

  const UI = ["cover animated.mp4","void runner.png","ember hunt.png","thumbnail.png","pause menu.png","game over.png","settings.png",
    "banner.png","game icon.png","thumbnail 1.png","settings-1.png","Frame 1.png","Frame 2.png","Frame 30.png","gamedevgraphics and ui.png","a.png","1.png","sticker 4.png"
  ].map(f => ({ src: "images/gameuigraphic/" + f, title: f.replace(/\.\w+$/, "") }));

  const ART = ["Zatannette.png","final pls.mp4","angel promo.png","kaiju_kafka.jpg","arthur promo 1.png","eternal_sugar_cookie_2.jpg","collabs/Alulu feat Vanny.png"]
    .map(f => ({ src: "images/drawing/" + f, title: f.replace(/^collabs\//, "collab · ").replace(/\.\w+$/, "").replace(/_/g, " ") }));

  const isVid = s => /\.mp4$/i.test(s);

  function build(gridId, items, limit) {
    const grid = $(gridId);
    items.forEach((it, i) => {
      const b = document.createElement("button");
      b.className = "tile rv" + (limit && i >= limit ? " hide" : "");
      b.type = "button";
      b.setAttribute("aria-label", "Open " + it.title);
      if (isVid(it.src)) {
        b.innerHTML = `<video src="${src(it.src)}" muted loop playsinline preload="none"></video><span class="play">▶ VIDEO</span>`;
        const vid = b.querySelector("video");
        b.addEventListener("mouseenter", () => vid.play().catch(() => {}));
        b.addEventListener("mouseleave", () => vid.pause());
      } else {
        b.innerHTML = `<img src="${src(v(it.src, "thumb"))}" alt="${it.title}" loading="lazy" decoding="async">`;
      }
      b.addEventListener("click", () => openLB(items, i));
      grid.appendChild(b);
    });
  }
  build("#designGrid", DESIGN, 12);
  build("#uiGrid", UI);
  build("#artGrid", ART);

  const more = $("#designMore");
  more.addEventListener("click", () => {
    const hidden = [...document.querySelectorAll("#designGrid .tile.hide")];
    hidden.slice(0, 12).forEach(t => { t.classList.remove("hide"); io.observe(t); });
    if (hidden.length <= 12) more.remove();
  });

  /* ---------- lightbox ---------- */
  const lb = $("#lb"), stage = $("#lbStage");
  let cur = [], idx = 0, lastFocus = null;
  function show() {
    const it = cur[idx];
    stage.innerHTML = isVid(it.src)
      ? `<video src="${src(it.src)}" controls autoplay loop playsinline></video>`
      : `<img src="${src(v(it.src, "web"))}" alt="${it.title}">`;
    $("#lbTitle").textContent = it.title.toUpperCase();
    $("#lbCount").textContent = `${idx + 1}/${cur.length}`;
  }
  function openLB(items, i) {
    lastFocus = document.activeElement;
    cur = items; idx = i; show();
    lb.hidden = false; document.body.style.overflow = "hidden";
    $("#lbClose").focus();
  }
  function closeLB() {
    lb.hidden = true; stage.innerHTML = ""; document.body.style.overflow = "";
    lastFocus && lastFocus.focus();
  }
  const step = d => { idx = (idx + d + cur.length) % cur.length; show(); };
  $("#lbClose").onclick = closeLB;
  $("#lbPrev").onclick = () => step(-1);
  $("#lbNext").onclick = () => step(1);
  lb.addEventListener("click", e => { if (e.target === lb) closeLB(); });
  document.addEventListener("keydown", e => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLB();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
  let tx = null;
  stage.addEventListener("touchstart", e => tx = e.touches[0].clientX, { passive: true });
  stage.addEventListener("touchend", e => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    tx = null;
  });

  /* ---------- boot screen ---------- */
  const boot = $("#boot");
  let booted = false;
  try { booted = sessionStorage.getItem("booted") === "1"; } catch (e) {}
  if (booted || /[?&]noboot/.test(location.search) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("no-boot");
  } else {
    const bar = $("#bootBar"), txt = $("#bootTxt");
    const msgs = ["LOADING...", "LOADING PIXELS...", "WAKING UP ALUCARD...", "READY!"];
    let p = 0;
    const finish = () => {
      if (boot.classList.contains("done")) return;
      bar.style.width = "100%"; txt.textContent = "READY!";
      setTimeout(() => boot.classList.add("done"), 200);
      try { sessionStorage.setItem("booted", "1"); } catch (e) {}
    };
    const t = setInterval(() => {
      p += 8 + Math.random() * 14;
      if (p >= 100) { clearInterval(t); finish(); return; }
      bar.style.width = Math.round(p / 6.25) * 6.25 + "%";
      txt.textContent = msgs[Math.min(2, Math.floor(p / 34))];
    }, 120);
    ["click", "keydown", "touchstart"].forEach(ev => boot.ownerDocument.addEventListener(ev, () => { clearInterval(t); finish(); }, { once: true }));
  }

  /* ---------- menu, clock, misc ---------- */
  const nav = $("#nav"), mb = $("#menuBtn");
  mb.addEventListener("click", () => {
    const o = nav.classList.toggle("open");
    mb.setAttribute("aria-expanded", o);
  });
  nav.addEventListener("click", e => { if (e.target.tagName === "A") { nav.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); } });

  const clock = $("#clock");
  const tick = () => { const d = new Date(); clock.textContent = d.toTimeString().slice(0, 5); };
  tick(); setInterval(tick, 10000);

  document.querySelectorAll("[data-close]").forEach(x => x.addEventListener("click", () => $("#" + x.dataset.close).classList.add("closed")));

  const toast = $("#toast");
  const say = m => { toast.textContent = m; toast.classList.add("show"); clearTimeout(say.t); say.t = setTimeout(() => toast.classList.remove("show"), 2200); };
  document.querySelectorAll("#discordBtn,[data-copy-discord]").forEach(b => b.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText("w_assim8"); say("COPIED: w_assim8 ✓"); }
    catch (e) { say("DISCORD: w_assim8"); }
  }));

  /* ---------- secret game: click the logo 5 times ---------- */
  {
    const logo = $(".mb-logo"), box = $("#game"), cv = $("#gCanvas"), ctx = cv.getContext("2d");
    const W = cv.width, H = cv.height, GROUND = H - 40;
    const BLUE = "#1d3bd6", RED = "#e8452c", INK = "#0d1440", SKY = "#7fb2ff", PAPER = "#f7f6ec";
    let clicks = 0, clickT = 0, raf = 0, st;
    let hi = 0; try { hi = +localStorage.getItem("jumpHi") || 0; } catch (e) {}
    $("#gHi").textContent = hi;

    logo.addEventListener("click", e => {
      const now = Date.now();
      clicks = now - clickT < 700 ? clicks + 1 : 1; clickT = now;
      if (clicks >= 3 && clicks < 5) say(`${5 - clicks} MORE...`);
      if (clicks >= 5) { e.preventDefault(); clicks = 0; openGame(); }
    });

    const reset = () => st = { y: GROUND, vy: 0, obs: [], clouds: [{ x: 120, y: 40 }, { x: 420, y: 70 }], t: 0, speed: 5, score: 0, next: 60, over: false, started: false };
    function openGame() { reset(); box.hidden = false; document.body.style.overflow = "hidden"; cancelAnimationFrame(raf); loop(); }
    function closeGame() { box.hidden = true; document.body.style.overflow = ""; cancelAnimationFrame(raf); }
    function jump() {
      if (st.over) { reset(); return; }
      st.started = true;
      if (st.y >= GROUND) st.vy = -11.5;
    }
    $("#gClose").onclick = closeGame;
    box.addEventListener("click", e => { if (e.target === box) closeGame(); });
    cv.addEventListener("pointerdown", e => { e.preventDefault(); jump(); });
    document.addEventListener("keydown", e => {
      if (box.hidden) return;
      if (e.key === "Escape") closeGame();
      if (e.code === "Space" || e.key === "ArrowUp") { e.preventDefault(); jump(); }
    });

    const rect = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
    function loop() {
      update(); draw();
      raf = requestAnimationFrame(loop);
    }
    function update() {
      if (!st.started || st.over) return;
      st.t++; st.score += st.speed / 20; st.speed = 5 + st.t / 600;
      st.vy += 0.6; st.y = Math.min(GROUND, st.y + st.vy);
      if (--st.next <= 0) {
        const tall = Math.random() < .35;
        st.obs.push({ x: W, w: tall ? 18 : 26, h: tall ? 46 : 24, fly: !tall && st.t > 900 && Math.random() < .3 });
        st.next = 45 + Math.random() * 60 - Math.min(25, st.t / 200);
      }
      st.obs.forEach(o => o.x -= st.speed);
      st.obs = st.obs.filter(o => o.x + o.w > 0);
      st.clouds.forEach(c => { c.x -= st.speed * .2; if (c.x < -60) c.x = W + Math.random() * 100; });
      const px = 60, pw = 24, ph = 24, py = st.y - ph;
      for (const o of st.obs) {
        const oy = o.fly ? GROUND - 62 : GROUND - o.h;
        if (px + pw - 3 > o.x && px + 3 < o.x + o.w && py + ph - 2 > oy && py + 2 < oy + o.h) {
          st.over = true;
          if (Math.floor(st.score) > hi) { hi = Math.floor(st.score); try { localStorage.setItem("jumpHi", hi); } catch (e) {} $("#gHi").textContent = hi; }
        }
      }
      $("#gScore").textContent = String(Math.floor(st.score)).padStart(5, "0");
    }
    function draw() {
      rect(0, 0, W, H, PAPER);
      for (let x = 0; x < W; x += 16) for (let y = 0; y < GROUND; y += 16) rect(x, y, 1, 1, SKY);
      st.clouds.forEach(c => { rect(c.x, c.y, 40, 8, SKY); rect(c.x + 8, c.y - 8, 20, 8, SKY); });
      rect(0, GROUND, W, 3, BLUE);
      for (let x = -(st.t * st.speed) % 24; x < W; x += 24) rect(x, GROUND + 10, 10, 3, BLUE);
      // player: little blue window-guy
      const py = st.y - 24, leg = st.started && !st.over && st.y >= GROUND && (st.t >> 3) % 2;
      rect(60, py, 24, 20, BLUE); rect(63, py + 6, 18, 11, PAPER);
      rect(67, py + 9, 3, 3, INK); rect(75, py + 9, 3, 3, INK);
      rect(64 + (leg ? 2 : 0), py + 20, 5, 4, INK); rect(76 - (leg ? 2 : 0), py + 20, 5, 4, INK);
      st.obs.forEach(o => {
        const oy = o.fly ? GROUND - 62 : GROUND - o.h;
        rect(o.x, oy, o.w, o.h, RED); rect(o.x + 3, oy + 3, o.w - 6, 3, PAPER);
      });
      ctx.fillStyle = BLUE; ctx.font = "16px Silkscreen, monospace"; ctx.textAlign = "center";
      if (!st.started) ctx.fillText("PRESS SPACE OR TAP TO START", W / 2, 90);
      if (st.over) { ctx.fillText("GAME OVER", W / 2, 80); ctx.font = "12px Silkscreen, monospace"; ctx.fillText("tap to retry", W / 2, 104); }
    }
  }

  /* ---------- reveal + active nav ---------- */
  document.querySelectorAll(".sec-head, .game, .case, .tier, .about-win, .contact-win").forEach(el => el.classList.add("rv"));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".rv:not(.hide)").forEach(el => io.observe(el));

  const skills = $(".skills");
  new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { skills.classList.add("in"); o.disconnect(); } }), { threshold: .4 }).observe(skills);

  const links = [...nav.querySelectorAll("a")];
  const so = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("section[id]").forEach(s => so.observe(s));
})();

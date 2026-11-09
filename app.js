(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const src = p => encodeURI(p);

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
      <a class="game-img" href="${g.u}" target="_blank" rel="noopener">${g.new ? '<span class="new">NEW!</span>' : ""}<img src="${src(g.img)}" alt="${esc(g.t)} cover" loading="lazy"></a>
      ${g.d ? `<p class="game-d">${esc(g.d)}</p>` : ""}
      <div class="game-foot"><span class="tag">${esc(g.g)}</span><a class="btn tiny" href="${g.u}" target="_blank" rel="noopener">PLAY ▶</a></div>
    </article>`).join("");

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
        b.innerHTML = `<video src="${src(it.src)}" muted loop playsinline preload="metadata"></video><span class="play">▶ VIDEO</span>`;
        const v = b.querySelector("video");
        b.addEventListener("mouseenter", () => v.play().catch(() => {}));
        b.addEventListener("mouseleave", () => v.pause());
      } else {
        b.innerHTML = `<img src="${src(it.src)}" alt="${it.title}" loading="lazy" decoding="async">`;
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
      : `<img src="${src(it.src)}" alt="${it.title}">`;
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
  if (booted || matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
  $("#discordBtn").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText("w_assim8"); say("COPIED: w_assim8 ✓"); }
    catch (e) { say("DISCORD: w_assim8"); }
  });

  /* ---------- reveal + active nav ---------- */
  document.querySelectorAll(".sec-head, .game, .case, .about-win, .contact-win").forEach(el => el.classList.add("rv"));
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

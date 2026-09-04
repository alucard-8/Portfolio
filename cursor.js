(() => {
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (isTouch) return;

  document.documentElement.classList.add('has-custom-cursor');

  const cursor = document.getElementById('cursorBlob');
  const TRAIL_LIMIT = 14;

  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const cursorPos = { x: mouse.x, y: mouse.y };
  let trail = [];
  let active = false;

  function makeTrail() {
    const dot = document.createElement('div');
    dot.className = 'cursor-trail';
    document.body.appendChild(dot);
    dot.x = mouse.x;
    dot.y = mouse.y;
    return dot;
  }

  function spawnPop(x, y) {
    const size = 40 + Math.random() * 40;
    const burst = document.createElement('div');
    burst.className = 'cursor-pop';
    const hue = 28 + Math.random() * 30;
    burst.style.width = size + 'px';
    burst.style.height = size + 'px';
    burst.style.background = `hsl(${hue}, 95%, 60%)`;
    burst.style.left = x + 'px';
    burst.style.top = y + 'px';
    document.body.appendChild(burst);
    burst.addEventListener('animationend', () => burst.remove());
  }

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (!active) {
      active = true;
      cursorPos.x = mouse.x;
      cursorPos.y = mouse.y;
      cursor.classList.add('cursor-on');
      for (let i = 0; i < TRAIL_LIMIT; i++) {
        trail.push(makeTrail());
      }
    }
  });

  window.addEventListener('mouseout', () => {
    active = false;
    cursor.classList.remove('cursor-on');
    trail.forEach((t) => t.remove());
    trail = [];
  });

  document.addEventListener('mousedown', () => {
    cursor.classList.add('cursor-pressed');
    spawnPop(mouse.x, mouse.y);
    for (let i = 0; i < 2; i++) {
      setTimeout(() => spawnPop(mouse.x + (Math.random() * 30 - 15), mouse.y + (Math.random() * 30 - 15)), 40 + i * 30);
    }
  });

  document.addEventListener('mouseup', () => cursor.classList.remove('cursor-pressed'));

  const hoverables = 'a, button, .filter-btn, .project-card, input, textarea, .btn, .sticker, .star, .panel, .fab-btn, .ig-link, .pencil-btn, .dt-btn, .dt-swatch, .dt-sizebtn, .dt-custom';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverables)) {
      cursor.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverables)) {
      cursor.classList.remove('cursor-hover');
    }
  });

  let raf;
  function loop() {
    cursorPos.x += (mouse.x - cursorPos.x) * 0.22;
    cursorPos.y += (mouse.y - cursorPos.y) * 0.22;

    cursor.style.left = cursorPos.x + 'px';
    cursor.style.top = cursorPos.y + 'px';

    for (let i = trail.length - 1; i >= 0; i--) {
      const t = trail[i];
      const prev = i === 0 ? cursorPos : trail[i - 1];
      t.x += (prev.x - t.x) * 0.18;
      t.y += (prev.y - t.y) * 0.18;
      const shift = i * 0.1;
      t.style.left = t.x + 'px';
      t.style.top = t.y + 'px';
      t.style.zIndex = String(10 - i);
      t.style.transform = `translate(-50%, -50%) scale(${(1 - i / TRAIL_LIMIT - 0.15).toFixed(2)})`;
    }

    raf = requestAnimationFrame(loop);
  }
  loop();
})();

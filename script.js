/* ═══════════════════════════════════════════════
   KAL KRISH — CINEMATIC PORTFOLIO SCRIPT
   ═══════════════════════════════════════════════ */
'use strict';

// ── Utilities ──────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

// ═══════════════════ STUDIO INTRO SEQUENCE ═══════════════════
const loadingScreen = $('#loadingScreen');
window.addEventListener('load', () => {
  // Wait for the logo animation to reach peak (2.2s)
  setTimeout(() => {
    loadingScreen?.classList.add('hidden');
    document.body.classList.remove('no-scroll');
    
    // Sequence the reveal of other elements
    setTimeout(() => {
      initReveal();
      startTypewriter();
      spawnHeroParticles();
      initCameraDrift();
    }, 400); // Small delay after screen clears
  }, 2200);
});
document.body.classList.add('no-scroll');

// ═══════════════════ CAMERA DRIFT (PHYSICS) ═══════════════════
function initCameraDrift() {
  const content = $('.hero-content');
  const bg = $('.hero-bg-image');
  if (!content || !bg) return;

  on(window, 'mousemove', e => {
    const x = (window.innerWidth / 2 - e.clientX) / 30;
    const y = (window.innerHeight / 2 - e.clientY) / 30;
    
    content.style.transform = `translate(${x}px, ${y}px)`;
    bg.style.transform = `scale(1.05) translate(${-x/2}px, ${-y/2}px)`;
    bg.style.transition = 'transform 1.5s var(--ease-out)';
  });
}

// ═══════════════════ CUSTOM CURSOR ═══════════════════
const cursorDot  = $('#cursorDot');
const cursorRing = $('#cursorRing');
let mx = -100, my = -100, rx = -100, ry = -100;

if (window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mousedown', () => cursorDot?.classList.add('clicking'));
  document.addEventListener('mouseup',   () => cursorDot?.classList.remove('clicking'));

  $$('a, button, [role="button"]').forEach(el => {
    on(el, 'mouseenter', () => cursorRing?.classList.add('hovering'));
    on(el, 'mouseleave', () => cursorRing?.classList.remove('hovering'));
  });

  (function animateCursor() {
    if (cursorDot) { cursorDot.style.left = mx + 'px'; cursorDot.style.top = my + 'px'; }
    if (cursorRing) {
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px';
    }
    requestAnimationFrame(animateCursor);
  })();
}

// ═══════════════════ FILM GRAIN ═══════════════════
(function initGrain() {
  const canvas = $('#grainCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, animFrameId;

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  on(window, 'resize', resize);

  function renderGrain() {
    const img = ctx.createImageData(w, h);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      d[i] = d[i+1] = d[i+2] = v;
      d[i+3] = 20;
    }
    ctx.putImageData(img, 0, 0);
    animFrameId = requestAnimationFrame(renderGrain);
  }
  renderGrain();
})();

// ═══════════════════ TYPEWRITER ═══════════════════
const PHRASES = [
  "Stories aren't written. They are uncovered.",
  "Every shadow holds a truth daylight won't touch.",
  "Born from struggle. Grown with imagination.",
  "Where worlds end, new ones begin.",
  "The darkness is where the story really starts.",
];
let phraseIndex = 0, charIndex = 0, isDeleting = false, twTimeout;

function startTypewriter() {
  const el = $('#typewriterText');
  if (!el) return;

  function tick() {
    const phrase = PHRASES[phraseIndex];
    if (isDeleting) {
      el.textContent = phrase.slice(0, --charIndex);
      if (charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % PHRASES.length; }
      twTimeout = setTimeout(tick, 40);
    } else {
      el.textContent = phrase.slice(0, ++charIndex);
      if (charIndex === phrase.length) { isDeleting = true; twTimeout = setTimeout(tick, 2600); }
      else { twTimeout = setTimeout(tick, 60); }
    }
  }
  tick();
}

// ═══════════════════ HERO PARTICLES ═══════════════════
function spawnHeroParticles() {
  const container = $('#heroParticles');
  if (!container) return;
  const count = 28;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'h-particle';
    const size = 1 + Math.random() * 2.5;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      --dur:${10 + Math.random() * 16}s;
      --delay:${Math.random() * 10}s;
      --op:${0.15 + Math.random() * 0.35};
      --dx:${(Math.random() - 0.5) * 60}px;
    `;
    frag.appendChild(p);
  }
  container.appendChild(frag);
}

// ═══════════════════ NAVBAR ═══════════════════
const navbar    = $('#navbar');
const hamburger = $('#hamburger');
const navMenu   = $('#navMenu');

on(window, 'scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

on(hamburger, 'click', () => {
  const isOpen = navMenu?.classList.toggle('open');
  hamburger?.classList.toggle('open', isOpen);
  hamburger?.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('no-scroll', isOpen);
});

$$('.nav-link').forEach(link => {
  on(link, 'click', () => {
    navMenu?.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  });
});

// ── Active nav on scroll ──
const sections = $$('section[id]');
on(window, 'scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  $$('.nav-link').forEach(l => {
    l.classList.toggle('active', l.getAttribute('data-section') === current);
  });
}, { passive: true });

// ── Smooth anchor scroll ──
$$('a[href^="#"]').forEach(anchor => {
  on(anchor, 'click', e => {
    const target = $(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── Scroll indicator ──
const scrollIndicator = $('#scrollIndicator');
on(scrollIndicator, 'click', () => $('#identity')?.scrollIntoView({ behavior: 'smooth' }));
on(scrollIndicator, 'keydown', e => { if (e.key === 'Enter') $('#identity')?.scrollIntoView({ behavior: 'smooth' }); });

// ═══════════════════ SCROLL REVEAL ═══════════════════
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  $$('[data-reveal]').forEach(el => io.observe(el));
}

// (Redundant parallax removed, replaced by Camera Drift at top)

// ═══════════════════ COUNTER ANIMATION ═══════════════════
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  let current = 0;
  const step = target / 40;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.round(current);
    if (current >= target) clearInterval(timer);
  }, 30);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
$$('[data-count]').forEach(el => counterObserver.observe(el));

// ═══════════════════ THEME SWITCHER ═══════════════════
const THEME_CLASSES = ['theme-default','theme-psych','theme-horror','theme-fantasy','theme-drama','theme-mystery'];

function setTheme(theme) {
  if (!theme) return;
  THEME_CLASSES.forEach(c => document.body.classList.remove(c));
  document.body.classList.add(`theme-${theme}`);
  $$('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
  try { localStorage.setItem('kk-theme', theme); } catch (_) {}
}

const savedTheme = (() => { try { return localStorage.getItem('kk-theme') || 'default'; } catch(_){return 'default';} })();
setTheme(savedTheme);

$$('.theme-btn').forEach(btn => {
  on(btn, 'click', () => setTheme(btn.dataset.theme));
});

// ═══════════════════ GENRE FILTER ═══════════════════
$$('.genre-pill').forEach(pill => {
  on(pill, 'click', () => {
    $$('.genre-pill').forEach(p => { p.classList.remove('active'); p.setAttribute('aria-pressed','false'); });
    pill.classList.add('active');
    pill.setAttribute('aria-pressed','true');

    const filter = pill.dataset.filter;
    $$('.work-panel').forEach(panel => {
      const show = filter === 'all' || panel.dataset.genre === filter;
      panel.style.opacity = show ? '1' : '0.25';
      panel.style.transform = show ? '' : 'scale(0.97)';
      panel.style.transition = 'opacity 0.4s, transform 0.4s';
    });
  });
});

// ═══════════════════ FORM HANDLER ═══════════════════
async function handleForm(form, submitBtn, statusEl) {
  const data = {
    name:    form.querySelector('[name="name"]')?.value || '',
    email:   form.querySelector('[name="email"]')?.value || '',
    message: form.querySelector('[name="message"]')?.value || '',
  };

  const originalText = submitBtn.querySelector('.submit-text')?.textContent || 'Send';
  submitBtn.disabled = true;
  if (submitBtn.querySelector('.submit-text')) submitBtn.querySelector('.submit-text').textContent = 'Sending…';
  if (statusEl) { statusEl.textContent = ''; statusEl.className = 'form-status'; }

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.success) {
      if (statusEl) { statusEl.textContent = result.message || 'Sent successfully. Thank you.'; statusEl.className = 'form-status success'; }
      form.reset();
    } else {
      throw new Error(result.message || 'Something went wrong.');
    }
  } catch (err) {
    if (statusEl) { statusEl.textContent = err.message || 'Failed to send. Please try again.'; statusEl.className = 'form-status error'; }
  } finally {
    submitBtn.disabled = false;
    if (submitBtn.querySelector('.submit-text')) submitBtn.querySelector('.submit-text').textContent = originalText;
    setTimeout(() => { if (statusEl) { statusEl.textContent = ''; statusEl.className = 'form-status'; } }, 6000);
  }
}

['feedbackForm', 'contactForm'].forEach(id => {
  const form = $(`#${id}`);
  if (!form) return;
  const submitBtn = form.querySelector('[type="submit"]');
  const statusEl  = $(`#${id.replace('Form','Status')}`);
  on(form, 'submit', e => { e.preventDefault(); handleForm(form, submitBtn, statusEl); });
});

// ── mailto passthrough ──
$$('a[href^="mailto:"]').forEach(a => {
  on(a, 'click', e => { e.preventDefault(); window.location.href = a.getAttribute('href'); });
});

// ═══════════════════ CINEMATIC WORK PANEL TILT ═══════════════════
$$('.work-panel').forEach(panel => {
  on(panel, 'mousemove', e => {
    const rect = panel.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
    panel.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-6px)`;
  });
  on(panel, 'mouseleave', () => {
    panel.style.transform = '';
    panel.style.transition = 'transform 0.6s var(--ease-out)';
    setTimeout(() => { panel.style.transition = ''; }, 600);
  });
});

// ═══════════════════ STUDIO CONSOLE LOGIC ═══════════════════
(function initStudioConsole() {
  const clock = $('#realTime');
  if (clock) {
    setInterval(() => {
      const now = new Date();
      clock.textContent = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    }, 1000);
  }

  // Adaptive Word Count logic for story pages
  const wordCountEl = $('#wordCount');
  if (wordCountEl) {
    const text = $('#synopsisBody')?.innerText || '';
    const words = text.split(/\s+/).length;
    let current = 0;
    const interval = setInterval(() => {
      current += Math.ceil(words / 20);
      if (current >= words) { current = words; clearInterval(interval); }
      wordCountEl.textContent = `WORDS: ${current.toLocaleString()}`;
    }, 40);
  }
})();

// ═══════════════════ REDACTION REVEAL ═══════════════════
const redactObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.8 });
$$('.philosophy-block p, .s-para').forEach(el => redactObserver.observe(el));

// ═══════════════════ CONSOLE SIGNATURE ═══════════════════
console.log('%c Kal Krish ', 'background: #d4af37; color: #040404; font-size: 22px; font-weight: bold; padding: 10px 20px; font-family: serif;');
console.log('%c GENIUS FULL-STACK ENGINE ACTIVATED ', 'color: #d4af37; font-size: 10px; letter-spacing: 4px;');

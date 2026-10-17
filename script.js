/* ============================================================
   ПЛАВНОЕ ПОЯВЛЕНИЕ ПРИ СКРОЛЛЕ
   ============================================================ */
const revealEls = document.querySelectorAll('.reveal');

if (!('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
  });

  revealEls.forEach((el) => observer.observe(el));
}

/* ============================================================
   МЕНЮ ПРИ СКРОЛЛЕ
   ============================================================ */
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ============================================================
   БУРГЕР
   ============================================================ */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
  });

  navLinks.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ============================================================
   ПОДСВЕТКА АКТИВНОЙ СЕКЦИИ
   ============================================================ */
const sections = document.querySelectorAll('section[id]');
const linkMap = {};
document.querySelectorAll('.nav__links a[href^="#"]').forEach((a) => {
  const id = a.getAttribute('href').slice(1);
  if (id) linkMap[id] = a;
});

if (sections.length && Object.keys(linkMap).length) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const link = linkMap[entry.target.id];
      if (!link) return;
      if (entry.isIntersecting) {
        Object.values(linkMap).forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach((s) => spy.observe(s));
}

/* ============================================================
   ФОРМА — старая JS-логика ОТКЛЮЧЕНА
   Форма отправляется напрямую в Formspree через action=""
   ============================================================ */
if (false) {
  // старый обработчик отключён
}

/* ============================================================
   ЖИВАЯ ПРОВЕРКА ПРОМОКОДА
   ============================================================ */
const promoField = document.getElementById('promo');
const promoStatusLive = document.getElementById('promoStatus');

if (promoField && promoStatusLive) {
  promoField.addEventListener('input', () => {
    const val = promoField.value.trim().toUpperCase();
    if (!val) {
      promoStatusLive.textContent = '';
      promoStatusLive.className = 'promo-status';
      return;
    }
    if (val === 'CHISLO10') {
      promoStatusLive.textContent = 'Промокод принят: скидка 10% на офлайн-квест.';
      promoStatusLive.className = 'promo-status ok';
    } else {
      promoStatusLive.textContent = 'Промокод не распознан.';
      promoStatusLive.className = 'promo-status err';
    }
  });
}

/* ============================================================
   ПАРАЛЛАКС HERO
   ============================================================ */
const hero = document.querySelector('.hero');
if (hero && window.matchMedia('(pointer: fine)').matches) {
  hero.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 12;
    const y = (e.clientY / window.innerHeight - 0.5) * 12;
    hero.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
  });
}

/* ============================================================
   ЗВУК — глухой стук на все кнопки и ссылки
   ============================================================ */
let audioCtx = null;

function ensureAudio() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (err) {
      return null;
    }
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playThud() {
  const ctx = ensureAudio();
  if (!ctx) return;
  const t = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(180, t);
  osc.frequency.exponentialRampToValueAtTime(60, t + 0.18);

  gain.gain.setValueAtTime(0.2, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.22);
}

['click', 'touchstart', 'keydown'].forEach(evt => {
  document.addEventListener(evt, () => ensureAudio(), { once: true, passive: true });
});

document.addEventListener('click', (e) => {
  const target = e.target.closest('a, button');
  if (!target) return;

  const href = target.getAttribute('href');

  // Переход на другую страницу — блокируем, играем звук, потом переходим
  if (href && !href.startsWith('#') && !href.startsWith('http') && !target.target) {
    e.preventDefault();
    playThud();
    setTimeout(() => { window.location.href = href; }, 220);
    return;
  }

  playThud();
}, true);

/* ============================================================
   КВЕСТ
   ============================================================ */
const questWrap = document.getElementById('quest');

if (questWrap) {

  const CONFIG = {
    answers: {
      0: { type: 'text', value: '6',    key: 'Ч',
           hint: 'Перенеси 7 вправо: 2x = 12. Потом раздели на 2.' },
      1: { type: 'text', value: '3000', key: 'И',
           hint: 'Найди 25% от 4000, потом вычти из 4000.' },
      2: { type: 'text', value: '10',   key: 'С',
           hint: 'Теорема Пифагора: c^2 = a^2 + b^2.' },
      3: { type: 'text', value: '3',    key: 'Л',
           hint: 'Время = расстояние / скорость.' },
      4: { type: 'text', value: '9',    key: 'О',
           hint: 'Какому числу равен корень из 81?' }
    },
    finalCode: 'ЧИСЛО'
  };

  const state = {
    solved: [false, false, false, false, false],
    keys:   [null, null, null, null, null]
  };

  const rooms        = document.querySelectorAll('.chapter');
  const feedbacks    = document.querySelectorAll('.feedback');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const keyEls       = document.querySelectorAll('.key');
  const finalBlock   = document.getElementById('final');
  const finalCode    = document.getElementById('finalCode');
  const scene        = document.getElementById('scene');
  const startBtn     = document.getElementById('startBtn');
  const resetBtn     = document.getElementById('resetBtn');
  const TOTAL        = 5;

  if (startBtn && scene) {
    startBtn.addEventListener('click', () => {
      scene.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      scene.style.opacity = '0';
      scene.style.transform = 'translateY(-30px)';

      setTimeout(() => {
        scene.style.display = 'none';
        questWrap.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 700);
    });
  }

  function normalize(str) {
    return String(str)
      .trim()
      .toLowerCase()
      .replace(/ё/g, 'е')
      .replace(/\s+/g, '');
  }

  function setFeedback(index, text, type) {
    const el = feedbacks[index];
    if (!el) return;
    el.textContent = text;
    el.className = 'feedback ' + (type || '');
  }

  function checkRoom(index) {
    if (state.solved[index]) return;
    const cfg = CONFIG.answers[index];
    let valid = false;

    if (cfg.type === 'text') {
      const input = document.getElementById('ans' + (index + 1));
      const userAnswer = normalize(input.value);
      if (!userAnswer) {
        setFeedback(index, 'Голос ждёт. Напиши ответ — иначе дверь останется закрытой.', 'err');
        return;
      }
      valid = userAnswer === normalize(cfg.value);
    }

    if (valid) {
      solveRoom(index, cfg.key);
      setFeedback(index, `Верно. Голос произносит: «Ключ «${cfg.key}» — твой».`, 'ok');
    } else {
      setFeedback(index, `Неверно. ${cfg.hint}`, 'err');
    }
  }

  function solveRoom(index, key) {
    state.solved[index] = true;
    state.keys[index] = key;

    if (keyEls[index]) {
      keyEls[index].textContent = key;
      keyEls[index].classList.add('found');
    }

    const end = document.querySelector(`[data-end="${index}"]`);
    if (end) end.classList.add('show');

    const next = rooms[index + 1];
    if (next) {
      setTimeout(() => {
        next.classList.remove('locked');
        next.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 1200);
    }

    updateProgress();

    if (state.solved.every(Boolean)) {
      setTimeout(showFinal, 1600);
    }
  }

  function updateProgress() {
    const done = state.solved.filter(Boolean).length;
    if (progressText) progressText.textContent = `${done} / ${TOTAL}`;
    if (progressFill) progressFill.style.right = `${100 - (done / TOTAL) * 100}%`;
  }

  function showFinal() {
    const word = state.keys.filter(Boolean).join('');
    if (finalCode) finalCode.textContent = word || CONFIG.finalCode;
    if (finalBlock) {
      finalBlock.classList.add('show');
      setTimeout(() => finalBlock.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
    }

    setTimeout(() => {
      const popup = document.getElementById('promoPopup');
      if (popup) popup.classList.add('show');
    }, 900);
  }

  // ===== ПЛАШКА С ПРОМОКОДОМ =====
  const popup      = document.getElementById('promoPopup');
  const popupClose = document.getElementById('promoClose');
  const copyBtn    = document.getElementById('copyPromoBtn');
  const copyStatus = document.getElementById('copyStatus');
  const promoEl    = document.getElementById('promoCode');

  const PROMO_CODE = 'CHISLO10';

  if (popup && promoEl) {
    promoEl.textContent = PROMO_CODE;
  }

  if (copyBtn && promoEl) {
    copyBtn.addEventListener('click', async () => {
      const code = promoEl.textContent.trim();
      try {
        await navigator.clipboard.writeText(code);
        if (copyStatus) {
          copyStatus.textContent = 'Промокод скопирован: ' + code;
          copyStatus.classList.add('show');
        }
      } catch (err) {
        if (copyStatus) {
          copyStatus.textContent = 'Не удалось скопировать. Запиши вручную: ' + code;
          copyStatus.classList.add('show');
        }
      }
    });
  }

  if (popupClose && popup) {
    popupClose.addEventListener('click', () => popup.classList.remove('show'));
    popup.addEventListener('click', (e) => {
      if (e.target === popup) popup.classList.remove('show');
    });
  }

  // ===== КНОПКИ ОТВЕТОВ =====
  document.querySelectorAll('[data-check]').forEach(btn => {
    btn.addEventListener('click', () => checkRoom(Number(btn.dataset.check)));
  });

  document.querySelectorAll('.answer-row input').forEach(inp => {
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const btn = inp.closest('.chapter')?.querySelector('[data-check]');
        if (btn) btn.click();
      }
    });
  });

  // ===== СБРОС =====
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.solved = [false, false, false, false, false];
      state.keys   = [null, null, null, null, null];

      keyEls.forEach(el => { el.textContent = '?'; el.classList.remove('found'); });
      feedbacks.forEach(el => { el.textContent = ''; el.className = 'feedback'; });
      document.querySelectorAll('.chapter-end').forEach(el => el.classList.remove('show'));
      document.querySelectorAll('input[type="text"]').forEach(i => i.value = '');
      rooms.forEach((r, i) => r.classList.toggle('locked', i > 0));
      if (finalBlock) finalBlock.classList.remove('show');
      if (popup) popup.classList.remove('show');
      if (copyStatus) {
        copyStatus.textContent = '';
        copyStatus.classList.remove('show');
      }

      updateProgress();

      if (scene && startBtn) {
        scene.style.display = 'flex';
        scene.style.opacity = '1';
        scene.style.transform = 'translateY(0)';
        questWrap.style.display = 'none';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  updateProgress();
}
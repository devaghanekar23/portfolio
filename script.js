// Typing effect
const roles = ['Frontend Developer', 'DevOps Learner', 'Cloud Enthusiast'];
const typing = document.getElementById('typing');
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let r = 0, i = 0, del = false;
  (function tick() {
    const word = roles[r];
    typing.textContent = word.slice(0, del ? --i : ++i);
    let wait = del ? 45 : 90;
    if (!del && i === word.length) { del = true; wait = 1400; }
    else if (del && i === 0) { del = false; r = (r + 1) % roles.length; wait = 350; }
    setTimeout(tick, wait);
  })();
}

// Mobile menu
const nav = document.getElementById('nav');
const menuBtn = document.querySelector('.menu-btn');
const menuIcon = menuBtn ? menuBtn.querySelector('i') : null;

function setMenuState(open) {
  if (!nav || !menuBtn) return;
  nav.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  if (menuIcon) {
    if (open) {
      menuIcon.classList.remove('fa-bars');
      menuIcon.classList.add('fa-xmark');
    } else {
      menuIcon.classList.remove('fa-xmark');
      menuIcon.classList.add('fa-bars');
    }
  }
}

if (menuBtn && nav) {
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = nav.classList.contains('open');
    setMenuState(!isOpen);
  });

  nav.addEventListener('click', e => {
    if (e.target.closest('a')) {
      setMenuState(false);
    }
  });

  document.addEventListener('click', e => {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !menuBtn.contains(e.target)) {
      setMenuState(false);
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      setMenuState(false);
      menuBtn.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860 && nav.classList.contains('open')) {
      setMenuState(false);
    }
  });
}

// Highlight current section in the menu
const links = [...nav.querySelectorAll('a')];
const spy = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) links.forEach(a => a.classList.toggle('on', a.hash === '#' + en.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

// Back to top button
const topBtn = document.getElementById('topBtn');
addEventListener('scroll', () => topBtn.classList.toggle('show', scrollY > 500), { passive: true });
topBtn.addEventListener('click', () => scrollTo({ top: 0 }));

// Contact form: sends the message to my email using FormSubmit
const form = document.getElementById('form');
const statusEl = document.getElementById('status');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const sendBtn = form.querySelector('button');
  const f = new FormData(form);
  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending...';
  statusEl.style.color = '';
  statusEl.textContent = '';
  try {
    const res = await fetch('https://formsubmit.co/ajax/devaghanekar23@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: f.get('name'),
        email: f.get('email'),
        message: f.get('message'),
        _subject: 'New portfolio message from ' + f.get('name'),
        _template: 'table',
        _captcha: 'false'
      })
    });
    const data = await res.json();
    if (!res.ok || String(data.success) !== 'true') throw new Error('failed');
    form.reset();
    statusEl.textContent = 'Thank you! Your message has been sent.';
  } catch (err) {
    statusEl.style.color = '#f87171';
    statusEl.textContent = 'Could not send. Please email me at devaghanekar23@gmail.com.';
  }
  sendBtn.disabled = false;
  sendBtn.textContent = 'Send message';
});

// Scroll reveal animation for elements
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealElements = document.querySelectorAll('.card, .skills li, .certs a, .about > div, .about-img, .edu-item, .contact > div, .form');
  revealElements.forEach(el => el.classList.add('reveal-init'));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));
}

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Professional polish and motion layer =====
(function () {
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.getElementById('progress');
  const headerEl = document.querySelector('.header');
  function onScrollFx() {
    const h = document.documentElement;
    progress.style.transform = 'scaleX(' + (scrollY / ((h.scrollHeight - h.clientHeight) || 1)) + ')';
    headerEl.classList.toggle('scrolled', scrollY > 20);
  }
  addEventListener('scroll', onScrollFx, { passive: true });
  onScrollFx();
  if (calm) return;

  // Count-up numbers when the stats strip appears
  const countObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, end = +el.dataset.count, suffix = el.dataset.suffix || '', t0 = performance.now();
      (function step(now) {
        const p = Math.min((now - t0) / 1400, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + (p === 1 ? suffix : '');
        if (p < 1) requestAnimationFrame(step);
      })(t0);
      obs.unobserve(el);
    });
  }, { threshold: .3 });
  document.querySelectorAll('[data-count]').forEach(c => { c.textContent = '0'; countObs.observe(c); });

  // Spotlight follows the cursor on cards (pointer hover devices only)
  if (matchMedia('(hover: hover)').matches) {
    document.addEventListener('pointermove', e => {
      const t = e.target.closest && e.target.closest('.card, .edu-card, .certs a');
      if (!t) return;
      const r = t.getBoundingClientRect();
      t.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      t.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  // Gentle 3D tilt on the portrait (wraps the image so it can tilt while the photo floats)
  const photo = document.querySelector('.photo');
  if (photo && matchMedia('(hover: hover)').matches) {
    const tilt = document.createElement('div');
    tilt.className = 'photo-tilt';
    photo.insertBefore(tilt, photo.firstChild);
    tilt.appendChild(photo.querySelector('img'));
    photo.addEventListener('pointermove', e => {
      const r = photo.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      tilt.style.transform = 'perspective(800px) rotateY(' + x * 14 + 'deg) rotateX(' + -y * 14 + 'deg)';
    });
    photo.addEventListener('pointerleave', () => { tilt.style.transform = ''; });
  } else if (photo && !photo.querySelector('.photo-tilt')) {
    const tilt = document.createElement('div');
    tilt.className = 'photo-tilt';
    photo.insertBefore(tilt, photo.firstChild);
    tilt.appendChild(photo.querySelector('img'));
  }

  // Section titles reveal, and siblings stagger in one after another
  const titleObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('revealed'); obs.unobserve(en.target); } });
  }, { threshold: .3 });
  document.querySelectorAll('.title').forEach(el => { el.classList.add('reveal-init'); titleObs.observe(el); });

  document.querySelectorAll('.grid, .skills, .certs, .edu').forEach(group => {
    [...group.children].forEach((child, i) => {
      child.style.transitionDelay = (i * 0.06) + 's';
      // clear the delay once revealed so hover effects stay instant
      child.addEventListener('transitionend', ev => {
        if (ev.propertyName === 'opacity') child.style.transitionDelay = '0s';
      }, { once: true });
    });
  });
})();
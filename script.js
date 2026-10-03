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
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
nav.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', false);
  }
});

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

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
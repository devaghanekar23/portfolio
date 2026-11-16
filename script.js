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
  const revealElements = document.querySelectorAll('.card, .skills li, .certs a, .about > div, .about-img, .edu-item, .contact > div, .form, .pipe-step, .terminal-card');
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

  // Button click ripple effect
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      ripple.className = 'btn-ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  // 3D Tilt on Project Cards (desktop hover devices only)
  if (matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(900px) rotateY(' + (x * 7) + 'deg) rotateX(' + (-y * 7) + 'deg) translateY(-6px)';
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  // Interactive Constellation Particle Canvas
  (function initHeroParticles() {
    const canvas = document.getElementById('heroCanvas');
    const hero = document.getElementById('home');
    if (!canvas || !hero || calm) return;
    const ctx = canvas.getContext('2d');
    let width = 0, height = 0, dpr = 1;
    let particles = [];
    let animId = null;
    let isVisible = true;
    const mouse = { x: -1000, y: -1000, radius: 140 };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = hero.offsetWidth;
      height = hero.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createParticles();
    }

    function createParticles() {
      const isMobile = window.innerWidth < 768;
      const count = isMobile ? 22 : 42;
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.8 + 1.2,
          isPurple: i % 3 === 0
        });
      }
    }

    function draw() {
      if (!isVisible) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        // Particle dot with glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.isPurple ? 'rgba(167, 139, 250, 0.85)' : 'rgba(56, 189, 248, 0.85)';
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.isPurple ? '#8b5cf6' : '#38bdf8';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.hypot(dx, dy);
          const maxDist = 110;
          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - dist / maxDist) * 0.22;
            ctx.strokeStyle = 'rgba(56, 189, 248, ' + alpha + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Connect to mouse pointer
        if (mouse.x > 0 && mouse.y > 0) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            const alpha = (1 - dist / mouse.radius) * 0.35;
            ctx.strokeStyle = 'rgba(167, 139, 250, ' + alpha + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }, { passive: true });

    hero.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !animId) {
        animId = requestAnimationFrame(draw);
      } else if (!isVisible && animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    }, { threshold: 0.05 });
    observer.observe(hero);

    window.addEventListener('resize', resize, { passive: true });
    resize();
    animId = requestAnimationFrame(draw);
  })();
})();

// ===== Interactive New Features =====

// 1. Certificate Lightbox Modal
(function initCertModal() {
  const certModal = document.getElementById('certModal');
  const certImg = document.getElementById('certImg');
  const certTitle = document.getElementById('certTitle');
  const certDownload = document.getElementById('certDownload');
  const certClose = document.getElementById('certClose');
  const certBackdrop = document.getElementById('certBackdrop');

  if (!certModal || !certImg) return;

  function openModal(href, title) {
    certImg.src = href;
    certImg.alt = title || 'Certificate preview';
    if (certTitle) certTitle.textContent = title || 'Certificate Preview';
    if (certDownload) certDownload.href = href;
    certModal.classList.add('open');
    certModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    certModal.classList.remove('open');
    certModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.certs a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const href = link.getAttribute('href');
      const title = link.getAttribute('data-title') || link.querySelector('span')?.textContent || 'Certificate';
      openModal(href, title);
    });
  });

  if (certClose) certClose.addEventListener('click', closeModal);
  if (certBackdrop) certBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && certModal.classList.contains('open')) {
      closeModal();
    }
  });
})();

// 2. Project Category Filter
(function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const cats = (card.dataset.cat || '').split(' ');
        if (filter === 'all' || cats.includes(filter)) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });
})();

// 3. Quick Copy Email & Floating Toast Notification
(function initCopyEmail() {
  const toastEl = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message, icon = 'fa-check') {
    if (!toastEl) return;
    toastEl.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2800);
  }

  document.querySelectorAll('.copy-email-btn').forEach(btn => {
    btn.addEventListener('click', async e => {
      e.stopPropagation();
      const email = btn.dataset.email || 'devaghanekar23@gmail.com';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          const ta = document.createElement('textarea');
          ta.value = email;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        showToast('Email copied to clipboard!');
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = 'fas fa-check';
          setTimeout(() => { icon.className = 'far fa-copy'; }, 2000);
        }
      } catch (err) {
        showToast('Failed to copy email', 'fa-circle-xmark');
      }
    });
  });
})();

// 4. Interactive DevOps Cloud Terminal
(function initDevOpsTerminal() {
  const terminal = document.getElementById('terminal');
  const termBody = document.getElementById('termBody');
  const termOutput = document.getElementById('termOutput');
  const termForm = document.getElementById('termForm');
  const termInput = document.getElementById('termInput');
  const chips = document.querySelectorAll('.term-chip');
  if (!terminal || !termOutput || !termInput) return;

  const history = [];
  let histIndex = -1;

  const COMMANDS = {
    help: () => `
<span class="term-cyan">DevOps Cloud Control Shell v2.4 (x86_64-aws-linux)</span>
<span class="term-dim">--------------------------------------------------</span>
<span class="term-cmd-text">Available Commands:</span>
  <span class="term-cyan">kubectl get pods</span>   View live Kubernetes pods & container health
  <span class="term-cyan">docker ps</span>          List running production Docker containers
  <span class="term-cyan">aws status</span>         Inspect AWS cloud VPC, ECS & region details
  <span class="term-cyan">skills</span>             Display full engineering tech stack
  <span class="term-cyan">projects</span>           List featured DevOps & fullstack deployments
  <span class="term-cyan">whoami</span>             View Devendra Ghanekar profile summary
  <span class="term-cyan">contact</span>            Display verified email, location & links
  <span class="term-cyan">resume</span>             Download official Resume PDF
  <span class="term-cyan">uptime</span>             Check simulated cluster uptime & system load
  <span class="term-cyan">clear</span>              Clear the terminal display
`,
    kubectl: () => `
<span class="term-dim">$ kubectl get pods -n production --show-labels</span>
<span class="term-dim">NAME                             READY   STATUS    RESTARTS   AGE   LABELS</span>
eventhub-web-84f9b2d-v7x2        <span class="term-green">1/1     Running</span>   0          4d    app=eventhub,tier=frontend
weather-helm-api-7b8ac1-9kx4     <span class="term-green">1/1     Running</span>   0          6d    app=weather,tier=backend
hearth-fargate-task-3df8-nm9     <span class="term-green">1/1     Running</span>   0          11d   app=recipe,tier=fullstack
devops-cicd-runner-52bc-4tz1     <span class="term-green">1/1     Running</span>   0          18d   app=jenkins,tier=pipeline
aws-ingress-alb-controller-01    <span class="term-green">1/1     Running</span>   0          30d   app=ingress,tier=networking
<span class="term-green">✓ All 5 workloads healthy & actively serving requests.</span>
`,
    docker: () => `
<span class="term-dim">$ docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"</span>
<span class="term-dim">CONTAINER ID   IMAGE                          STATUS          PORTS</span>
7f8a920b1c3e   eventhub/frontend:v2.1         <span class="term-green">Up 4 days</span>       0.0.0.0:3000->3000/tcp
4e1c980b3d2a   deva/weather-helm-api:latest   <span class="term-green">Up 6 days</span>       0.0.0.0:8080->8080/tcp
1b3d58a7c9ef   hearth/ecs-fargate:prod        <span class="term-green">Up 11 days</span>      0.0.0.0:5000->5000/tcp
9c4e21a8d05b   jenkins/jenkins:lts-jdk17      <span class="term-green">Up 18 days</span>      0.0.0.0:8080->8080/tcp
<span class="term-cyan">4 containers active. Total memory allocated: 3.4 GiB / 8.0 GiB</span>
`,
    aws: () => `
<span class="term-dim">$ aws ec2 describe-availability-zones && aws ecs describe-clusters</span>
<span class="term-cmd-text">Cloud Region  :</span> <span class="term-cyan">ap-south-1 (Mumbai, India)</span>
<span class="term-cmd-text">VPC Network   :</span> vpc-0a819b2f34 (CIDR: 10.0.0.0/16 | 2 Public, 2 Private Subnets)
<span class="term-cmd-text">ECS Cluster   :</span> prod-deva-cluster <span class="term-green">[ACTIVE - 3 Fargate Tasks]</span>
<span class="term-cmd-text">ECR Registry  :</span> 4539821098.dkr.ecr.ap-south-1.amazonaws.com
<span class="term-cmd-text">Security      :</span> AWS WAF Active, TLS 1.3 Strict, IAM Least-Privilege
<span class="term-green">✓ Cloud infrastructure status: OPERATIONAL (99.98% uptime)</span>
`,
    skills: () => `
<span class="term-cmd-text">Technical Stack Matrix:</span>
  <span class="term-cyan">Cloud & IaC     :</span> AWS (VPC, EC2, ECS, ECR, Route 53), Terraform
  <span class="term-cyan">Containers & K8s:</span> Docker (Multi-stage), Kubernetes, Helm Charts
  <span class="term-cyan">CI/CD & Tools   :</span> Jenkins, GitHub Actions, Git, Linux (Bash/Shell)
  <span class="term-cyan">Frontend        :</span> HTML5, CSS3, JavaScript (ES6+), Responsive UI
`,
    projects: () => `
<span class="term-cmd-text">Featured Deployments:</span>
  1. <span class="term-cyan">EventHub</span>               - React, Docker, Kubernetes Helm
  2. <span class="term-cyan">Weather App</span>            - Express, Helm Chart, Amazon ECR
  3. <span class="term-cyan">Hearth Recipe App</span>      - Docker, AWS ECS Fargate
  4. <span class="term-cyan">DevOps Fundamentals</span>    - AWS VPC, Subnets, Route Tables
  5. <span class="term-cyan">Jenkins Pipeline</span>       - Automated CI/CD Jenkinsfile
  <span class="term-dim">Type 'projects' or scroll to #projects to view details and code repositories.</span>
`,
    whoami: () => `
<span class="term-cmd-text">Devendra Ghanekar</span>
<span class="term-cyan">Role:</span> Junior DevOps Engineer & B.Sc Computer Science Graduate
<span class="term-cyan">Location:</span> Virar (East), Maharashtra, India
<span class="term-cyan">Mission:</span> Automating resilient cloud architectures & building seamless digital experiences.
`,
    contact: () => `
<span class="term-cmd-text">Contact Channels:</span>
  <span class="term-cyan">Email    :</span> devaghanekar23@gmail.com
  <span class="term-cyan">GitHub   :</span> https://github.com/devaghanekar23
  <span class="term-cyan">LinkedIn :</span> https://www.linkedin.com/in/devendra-ghanekar/
  <span class="term-dim">Tip: Click the copy icon in the About section or use Ctrl+K to copy email instantly.</span>
`,
    resume: () => {
      const a = document.createElement('a');
      a.href = 'resume/Resume.pdf';
      a.download = 'Resume.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return `<span class="term-green">✓ Downloading Devendra's official resume (Resume.pdf)...</span>`;
    },
    uptime: () => `
<span class="term-cyan">cluster up 42 days, 16 hours, 2 users, load average: 0.08, 0.04, 0.01</span>
<span class="term-green">Zero crash events detected. Auto-scaling groups nominal.</span>
`,
    date: () => `<span>${new Date().toUTCString()}</span>`
  };

  function printLine(rawCmd, outputHtml) {
    const block = document.createElement('div');
    block.className = 'term-line';
    block.innerHTML = `
      <div class="term-input-echo">
        <span class="term-prompt"><span class="usr">deva@cloud</span><span class="sep">:</span><span class="path">~</span><span class="symbol">$</span></span>
        <span class="term-cmd-text">${escapeHtml(rawCmd)}</span>
      </div>
      <div class="term-result">${outputHtml}</div>
    `;
    termOutput.appendChild(block);
    termBody.scrollTop = termBody.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function executeCommand(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    history.push(trimmed);
    histIndex = history.length;

    const lower = trimmed.toLowerCase();
    if (lower === 'clear') {
      termOutput.innerHTML = '';
      return;
    }

    let out = '';
    if (lower === 'help') {
      out = COMMANDS.help();
    } else if (lower.startsWith('kubectl') || lower === 'k8s') {
      out = COMMANDS.kubectl();
    } else if (lower.startsWith('docker')) {
      out = COMMANDS.docker();
    } else if (lower.startsWith('aws')) {
      out = COMMANDS.aws();
    } else if (lower.startsWith('skill')) {
      out = COMMANDS.skills();
    } else if (lower.startsWith('project')) {
      out = COMMANDS.projects();
    } else if (lower === 'whoami') {
      out = COMMANDS.whoami();
    } else if (lower === 'contact' || lower === 'email') {
      out = COMMANDS.contact();
    } else if (lower === 'resume' || lower === 'cv') {
      out = COMMANDS.resume();
    } else if (lower === 'uptime') {
      out = COMMANDS.uptime();
    } else if (lower === 'date') {
      out = COMMANDS.date();
    } else if (lower.startsWith('echo ')) {
      out = `<span>${escapeHtml(trimmed.slice(5))}</span>`;
    } else {
      out = `<span class="term-dim">bash: command not found: ${escapeHtml(trimmed)}. Type <span class="term-cyan">'help'</span> for a list of available commands.</span>`;
    }
    printLine(trimmed, out);
  }

  termForm.addEventListener('submit', e => {
    e.preventDefault();
    const val = termInput.value;
    termInput.value = '';
    executeCommand(val);
  });

  termInput.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIndex > 0) {
        histIndex--;
        termInput.value = history[histIndex] || '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIndex < history.length - 1) {
        histIndex++;
        termInput.value = history[histIndex] || '';
      } else {
        histIndex = history.length;
        termInput.value = '';
      }
    }
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.dataset.cmd;
      if (!cmd) return;
      termInput.value = cmd;
      setTimeout(() => {
        executeCommand(cmd);
        termInput.value = '';
        termInput.focus();
      }, 100);
    });
  });

  // Initial welcome sequence when terminal scrolls into view
  let hasAutoRun = false;
  const termObs = new IntersectionObserver(([entry], obs) => {
    if (entry.isIntersecting && !hasAutoRun) {
      hasAutoRun = true;
      obs.unobserve(terminal);
      const welcome = `
<span class="term-cyan">Welcome to Devendra's Cloud DevOps Control Center (v2.4)</span>
<span class="term-dim">Session initialized: AWS ap-south-1 · Kubernetes cluster: prod-deva · Connected.</span>
<span class="term-dim">Type <span class="term-cmd-text">'help'</span> to view commands or click any quick action chip above.</span>
`;
      const div = document.createElement('div');
      div.className = 'term-line';
      div.innerHTML = welcome;
      termOutput.appendChild(div);

      // Auto-simulate typing 'kubectl get pods'
      setTimeout(() => {
        if (history.length === 0) {
          executeCommand('kubectl get pods');
        }
      }, 600);
    }
  }, { threshold: 0.25 });
  termObs.observe(terminal);
})();

// 5. Spotlight Command Palette (Ctrl + K)
(function initCommandPalette() {
  const palette = document.getElementById('cmdPalette');
  const backdrop = document.getElementById('cmdBackdrop');
  const input = document.getElementById('cmdInput');
  const list = document.getElementById('cmdList');
  const hudBtn = document.getElementById('cmdHudBtn');
  if (!palette || !input || !list) return;

  const COMMAND_ITEMS = [
    { title: 'Workflow CI/CD Pipeline', cat: 'Navigation', icon: 'fa-diagram-project', badge: 'Section', action: () => scrollToId('pipeline') },
    { title: 'DevOps Cloud Terminal', cat: 'Navigation', icon: 'fa-terminal', badge: 'Interactive', action: () => { scrollToId('terminal'); focusTerminal(); } },
    { title: 'Browse Projects', cat: 'Navigation', icon: 'fa-folder-open', badge: 'Section', action: () => scrollToId('projects') },
    { title: 'Skills & Tech Stack', cat: 'Navigation', icon: 'fa-layer-group', badge: 'Section', action: () => scrollToId('skills') },
    { title: 'About Me', cat: 'Navigation', icon: 'fa-user', badge: 'Section', action: () => scrollToId('about') },
    { title: 'Education Timeline', cat: 'Navigation', icon: 'fa-graduation-cap', badge: 'Section', action: () => scrollToId('education') },
    { title: 'Work Experience', cat: 'Navigation', icon: 'fa-briefcase', badge: 'Section', action: () => scrollToId('experience') },
    { title: 'View Certificates', cat: 'Navigation', icon: 'fa-certificate', badge: 'Section', action: () => scrollToId('certificates') },
    { title: 'Contact Me', cat: 'Navigation', icon: 'fa-envelope', badge: 'Section', action: () => scrollToId('contact') },
    { title: 'Download Resume (PDF)', cat: 'Actions', icon: 'fa-file-pdf', badge: 'Download', action: () => downloadResume() },
    { title: 'Copy Email Address', cat: 'Actions', icon: 'fa-copy', badge: 'Clipboard', action: () => copyEmail() },
    { title: 'Open GitHub Profile', cat: 'External', icon: 'fa-brands fa-github', badge: 'github.com', action: () => window.open('https://github.com/devaghanekar23', '_blank') },
    { title: 'Open LinkedIn Profile', cat: 'External', icon: 'fa-brands fa-linkedin', badge: 'linkedin.com', action: () => window.open('https://www.linkedin.com/in/devendra-ghanekar/', '_blank') },
    { title: 'Run: kubectl get pods', cat: 'Terminal', icon: 'fa-dharmachakra', badge: 'CLI', action: () => runTermCmd('kubectl get pods') },
    { title: 'Run: docker ps', cat: 'Terminal', icon: 'fa-brands fa-docker', badge: 'CLI', action: () => runTermCmd('docker ps') },
    { title: 'Run: aws status', cat: 'Terminal', icon: 'fa-brands fa-aws', badge: 'CLI', action: () => runTermCmd('aws status') }
  ];

  let selectedIndex = 0;
  let currentFiltered = [...COMMAND_ITEMS];

  function openPalette() {
    palette.classList.add('open');
    palette.setAttribute('aria-hidden', 'false');
    input.value = '';
    renderItems(COMMAND_ITEMS);
    setTimeout(() => input.focus({ preventScroll: true }), 60);
    document.body.style.overflow = 'hidden';
  }

  function closePalette() {
    palette.classList.remove('open');
    palette.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function renderItems(items) {
    currentFiltered = items;
    selectedIndex = 0;
    list.innerHTML = '';
    if (!items.length) {
      list.innerHTML = '<div class="cmd-empty"><i class="fas fa-search"></i> No matching commands found</div>';
      return;
    }
    items.forEach((item, index) => {
      const el = document.createElement('div');
      el.className = 'cmd-item' + (index === 0 ? ' active' : '');
      el.setAttribute('role', 'option');
      el.innerHTML = `
        <div class="cmd-item-left">
          <div class="cmd-item-icon"><i class="${item.icon.includes('fa-') ? item.icon : 'fas ' + item.icon}"></i></div>
          <span>${item.title}</span>
        </div>
        <span class="cmd-item-badge">${item.badge}</span>
      `;
      el.addEventListener('click', () => {
        closePalette();
        item.action();
      });
      el.addEventListener('mouseenter', () => {
        setSelectedIndex(index);
      });
      list.appendChild(el);
    });
  }

  function setSelectedIndex(idx) {
    const children = list.querySelectorAll('.cmd-item');
    if (!children.length) return;
    children.forEach((c, i) => c.classList.toggle('active', i === idx));
    selectedIndex = idx;
    if (children[idx]) {
      children[idx].scrollIntoView({ block: 'nearest' });
    }
  }

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    if (!q) {
      renderItems(COMMAND_ITEMS);
      return;
    }
    const filtered = COMMAND_ITEMS.filter(it =>
      it.title.toLowerCase().includes(q) ||
      it.cat.toLowerCase().includes(q) ||
      it.badge.toLowerCase().includes(q)
    );
    renderItems(filtered);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentFiltered.length) {
        setSelectedIndex((selectedIndex + 1) % currentFiltered.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentFiltered.length) {
        setSelectedIndex((selectedIndex - 1 + currentFiltered.length) % currentFiltered.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentFiltered[selectedIndex]) {
        closePalette();
        currentFiltered[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      closePalette();
    }
  });

  if (hudBtn) hudBtn.addEventListener('click', openPalette);
  if (backdrop) backdrop.addEventListener('click', closePalette);

  window.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (palette.classList.contains('open')) closePalette();
      else openPalette();
    } else if (e.key === 'Escape' && palette.classList.contains('open')) {
      closePalette();
    }
  });

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  function focusTerminal() {
    const inp = document.getElementById('termInput');
    if (inp) setTimeout(() => inp.focus(), 500);
  }

  function downloadResume() {
    const a = document.createElement('a');
    a.href = 'resume/Resume.pdf';
    a.download = 'Resume.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function copyEmail() {
    const email = 'devaghanekar23@gmail.com';
    navigator.clipboard?.writeText(email).then(() => {
      const toastEl = document.getElementById('toast');
      if (toastEl) {
        toastEl.innerHTML = '<i class="fas fa-check"></i> <span>Email copied to clipboard!</span>';
        toastEl.classList.add('show');
        setTimeout(() => toastEl.classList.remove('show'), 2800);
      }
    });
  }

  function runTermCmd(cmd) {
    scrollToId('terminal');
    const termInput = document.getElementById('termInput');
    const termForm = document.getElementById('termForm');
    if (termInput && termForm) {
      termInput.value = cmd;
      termForm.dispatchEvent(new Event('submit', { cancelable: true }));
      setTimeout(() => termInput.focus(), 600);
    }
  }
})();

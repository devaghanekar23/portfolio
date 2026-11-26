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

    // If an SVG is displayed, check if user has added a real scanned .jpg / .jpeg / .png
    if (href.endsWith('.svg')) {
      const base = href.replace(/\.svg$/, '');
      ['.jpg', '.jpeg', '.png'].forEach(ext => {
        const probe = new Image();
        probe.onload = function () {
          certImg.src = base + ext;
          if (certDownload) certDownload.href = base + ext;
        };
        probe.src = base + ext;
      });
    }
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
  <span class="term-cyan">certs</span>              List verified certifications
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
    date: () => `<span>${new Date().toUTCString()}</span>`,
    certs: () => `
<span class="term-cmd-text">Verified Certifications:</span>
  1.  <span class="term-cyan">Git Linux AWS Certificate</span>
  2.  <span class="term-cyan">Jenkins CI/CD Certificate</span>
  3.  <span class="term-cyan">Docker Containerization Certificate</span>
  4.  <span class="term-cyan">Kubernetes Cluster &amp; Orchestration</span>
  5.  <span class="term-cyan">Terraform Infrastructure as Code</span>
  6.  <span class="term-cyan">Ansible Configuration Management</span>
  7.  <span class="term-cyan">Real-Time Cloud Monitoring</span>
  8.  <span class="term-cyan">DevOps Internship Certificate</span>
  9.  <span class="term-cyan">Video Editing Certificate</span>
  10. <span class="term-cyan">12th Science Certificate</span>
  11. <span class="term-cyan">NCC 'B' Certificate</span>
  12. <span class="term-cyan">NCC 'C' Certificate</span>
<span class="term-dim">Click any certificate in #certificates section or use Ctrl+K to preview.</span>
`
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
    window.playDevaSound?.('terminal');
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
    } else if (lower.startsWith('cert')) {
      out = COMMANDS.certs();
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
    { title: 'DevOps Robot Ecosystem', cat: 'Navigation', icon: 'fa-robot', badge: 'Interactive', action: () => scrollToId('ecosystem') },
    { title: 'Workflow CI/CD Pipeline', cat: 'Navigation', icon: 'fa-diagram-project', badge: 'Section', action: () => scrollToId('pipeline') },
    { title: 'Cluster Observability (Monitoring)', cat: 'Navigation', icon: 'fa-chart-area', badge: 'Live Telemetry', action: () => scrollToId('monitoring') },
    { title: 'DevOps Cloud Terminal', cat: 'Navigation', icon: 'fa-terminal', badge: 'Interactive', action: () => { scrollToId('terminal'); focusTerminal(); } },
    { title: 'Technical Skills Matrix', cat: 'Navigation', icon: 'fa-layer-group', badge: 'Section', action: () => scrollToId('skills') },
    { title: 'Browse Projects', cat: 'Navigation', icon: 'fa-folder-open', badge: 'Section', action: () => scrollToId('projects') },
    { title: 'About Me', cat: 'Navigation', icon: 'fa-user', badge: 'Section', action: () => scrollToId('about') },
    { title: 'Education Timeline', cat: 'Navigation', icon: 'fa-graduation-cap', badge: 'Section', action: () => scrollToId('education') },
    { title: 'Work Experience', cat: 'Navigation', icon: 'fa-briefcase', badge: 'Section', action: () => scrollToId('experience') },
    { title: 'View Certificates', cat: 'Navigation', icon: 'fa-certificate', badge: 'Section', action: () => scrollToId('certificates') },
    { title: 'Simulate Traffic Spike (HPA)', cat: 'Simulation', icon: 'fa-bolt', badge: 'Live Test', action: () => { scrollToId('monitoring'); document.getElementById('simSpikeBtn')?.click(); } },
    { title: 'Trigger Zero-Downtime Rollout', cat: 'Simulation', icon: 'fa-rocket', badge: 'Live Test', action: () => { scrollToId('monitoring'); document.getElementById('simRolloutBtn')?.click(); } },
    { title: 'Run Trivy Vulnerability Scan', cat: 'Simulation', icon: 'fa-shield-halved', badge: 'Live Test', action: () => { scrollToId('monitoring'); document.getElementById('simScanBtn')?.click(); } },
    { title: 'Theme: Docker Cyan', cat: 'Appearance', icon: 'fa-palette', badge: 'Theme', action: () => window.switchPortfolioTheme?.('cyan') },
    { title: 'Theme: K8s Emerald', cat: 'Appearance', icon: 'fa-palette', badge: 'Theme', action: () => window.switchPortfolioTheme?.('emerald') },
    { title: 'Theme: IaC Violet', cat: 'Appearance', icon: 'fa-palette', badge: 'Theme', action: () => window.switchPortfolioTheme?.('violet') },
    { title: 'Theme: AWS Amber', cat: 'Appearance', icon: 'fa-palette', badge: 'Theme', action: () => window.switchPortfolioTheme?.('orange') },
    { title: 'Cert: Kubernetes Cluster', cat: 'Certificates', icon: 'fa-dharmachakra', badge: 'Credential', action: () => openCertByQuery('kubernetes') },
    { title: 'Cert: Terraform IaC', cat: 'Certificates', icon: 'fa-cubes', badge: 'Credential', action: () => openCertByQuery('terraform') },
    { title: 'Cert: Ansible Automation', cat: 'Certificates', icon: 'fa-cogs', badge: 'Credential', action: () => openCertByQuery('ansible') },
    { title: 'Cert: Real-Time Monitoring', cat: 'Certificates', icon: 'fa-chart-line', badge: 'Credential', action: () => openCertByQuery('monitoring') },
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

  function openCertByQuery(query) {
    const link = [...document.querySelectorAll('.certs a')].find(a =>
      a.textContent.toLowerCase().includes(query.toLowerCase()) ||
      (a.dataset.title && a.dataset.title.toLowerCase().includes(query.toLowerCase()))
    );
    if (link) link.click();
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

// 6. Interactive Theme Switcher
(function initThemeSwitcher() {
  const switcher = document.getElementById('themeSwitcher');
  const themeBtn = document.getElementById('themeBtn');
  const themeMenu = document.getElementById('themeMenu');
  const currentDot = document.getElementById('currentThemeDot');
  const options = document.querySelectorAll('.theme-opt');
  if (!switcher || !themeBtn || !themeMenu) return;

  const THEMES = {
    cyan: '#38bdf8',
    emerald: '#10b981',
    violet: '#a855f7',
    orange: '#f97316'
  };

  function applyTheme(name, save = true) {
    if (!THEMES[name]) name = 'cyan';
    if (name === 'cyan') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', name);
    }
    if (currentDot) currentDot.style.background = THEMES[name];
    options.forEach(opt => opt.classList.toggle('active', opt.dataset.theme === name));
    if (save) localStorage.setItem('deva_theme', name);
    window.devaActiveTheme = name;
  }

  window.switchPortfolioTheme = applyTheme;

  themeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = themeMenu.classList.toggle('open');
    themeBtn.setAttribute('aria-expanded', String(open));
    window.playDevaSound?.('click');
  });

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      const theme = opt.dataset.theme;
      applyTheme(theme);
      themeMenu.classList.remove('open');
      themeBtn.setAttribute('aria-expanded', 'false');
      window.playDevaSound?.('success');
      const toastEl = document.getElementById('toast');
      if (toastEl) {
        toastEl.innerHTML = `<i class="fas fa-palette"></i> <span>Theme accent updated to <b>${opt.textContent.trim()}</b></span>`;
        toastEl.classList.add('show');
        setTimeout(() => toastEl.classList.remove('show'), 2400);
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!switcher.contains(e.target)) {
      themeMenu.classList.remove('open');
      themeBtn.setAttribute('aria-expanded', 'false');
    }
  });

  const saved = localStorage.getItem('deva_theme');
  if (saved && THEMES[saved]) applyTheme(saved, false);
})();

// 7. Web Audio FX Synthesizer (Zero external dependencies)
(function initSoundFX() {
  const soundBtn = document.getElementById('soundBtn');
  const soundIcon = document.getElementById('soundIcon');
  let audioCtx = null;
  let isMuted = localStorage.getItem('deva_muted') !== 'false';

  function updateIcon() {
    if (!soundIcon) return;
    if (isMuted) {
      soundIcon.className = 'fas fa-volume-xmark';
      soundBtn?.setAttribute('title', 'Enable Sci-Fi Audio FX (Muted)');
    } else {
      soundIcon.className = 'fas fa-volume-high';
      soundBtn?.setAttribute('title', 'Disable Sci-Fi Audio FX (Active)');
    }
  }

  function getAudioCtx() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playSound(type) {
    if (isMuted) return;
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(350, t + 0.04);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.start(t);
        osc.stop(t + 0.04);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, t);
        osc.frequency.setValueAtTime(780, t + 0.06);
        gain.gain.setValueAtTime(0.09, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
        osc.start(t);
        osc.stop(t + 0.16);
      } else if (type === 'terminal') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(900, t);
        osc.frequency.exponentialRampToValueAtTime(300, t + 0.03);
        gain.gain.setValueAtTime(0.04, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
        osc.start(t);
        osc.stop(t + 0.03);
      }
    } catch (_) {}
  }

  window.playDevaSound = playSound;

  if (soundBtn) {
    updateIcon();
    soundBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      localStorage.setItem('deva_muted', String(isMuted));
      updateIcon();
      if (!isMuted) {
        playSound('success');
        const toastEl = document.getElementById('toast');
        if (toastEl) {
          toastEl.innerHTML = '<i class="fas fa-volume-high"></i> <span>Sci-Fi Audio FX enabled!</span>';
          toastEl.classList.add('show');
          setTimeout(() => toastEl.classList.remove('show'), 2200);
        }
      }
    });
  }
})();

// 8. Technical Skills Matrix (Category Filters & Animated Progress Bars)
(function initSkillsMatrix() {
  const tabs = document.querySelectorAll('.skill-tab');
  const cards = document.querySelectorAll('.skill-card');
  const fills = document.querySelectorAll('.skill-bar-fill');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat;
      window.playDevaSound?.('click');

      cards.forEach(card => {
        if (cat === 'all' || card.dataset.cat === cat) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fills.forEach(fill => {
          const pct = fill.dataset.progress || '80%';
          fill.style.width = pct;
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.15 });

  const skillsSec = document.getElementById('skills');
  if (skillsSec) obs.observe(skillsSec);
})();

// 9. DevOps Cluster Observability & Real-Time Sparkline
(function initMonitoringDashboard() {
  const podGrid = document.getElementById('podVisualGrid');
  const sparkCanvas = document.getElementById('cpuSparkline');
  const cpuVal = document.getElementById('monCpuVal');
  const memVal = document.getElementById('monMemVal');
  const memFill = document.getElementById('monMemFill');
  const latencyVal = document.getElementById('monLatency');
  const simSpikeBtn = document.getElementById('simSpikeBtn');
  const simRolloutBtn = document.getElementById('simRolloutBtn');
  const simScanBtn = document.getElementById('simScanBtn');
  const simLogText = document.getElementById('simLogText');
  const clusterState = document.getElementById('monClusterState');
  const activeCount = document.getElementById('podActiveCount');
  const cpuLoadTag = document.getElementById('cpuLoadTag');

  if (!podGrid || !sparkCanvas) return;

  const TOTAL_BASE_PODS = 24;
  function renderPods(count = TOTAL_BASE_PODS) {
    podGrid.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const node = document.createElement('div');
      node.className = 'pod-node' + (i >= TOTAL_BASE_PODS ? ' scaled-up' : '');
      node.setAttribute('title', `Pod #app-${i + 1} • Status: Running`);
      podGrid.appendChild(node);
    }
    if (activeCount) activeCount.textContent = count;
  }
  renderPods();

  const ctx = sparkCanvas.getContext('2d');
  let dpr = window.devicePixelRatio || 1;
  let points = Array.from({ length: 28 }, () => Math.random() * 8 + 30);
  let baseTarget = 34;

  function drawSparkline() {
    const parent = sparkCanvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth || 240;
    const h = 58;
    sparkCanvas.width = w * dpr;
    sparkCanvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, w, h);

    const step = w / (points.length - 1);
    ctx.beginPath();
    ctx.moveTo(0, h - (points[0] / 100) * h);

    for (let i = 1; i < points.length; i++) {
      const x = i * step;
      const y = h - (points[i] / 100) * h;
      const prevX = (i - 1) * step;
      const prevY = h - (points[i - 1] / 100) * h;
      const cx = (prevX + x) / 2;
      ctx.bezierCurveTo(cx, prevY, cx, y, x, y);
    }

    const activeTheme = window.devaActiveTheme || 'cyan';
    const strokeColors = {
      cyan: '#38bdf8',
      emerald: '#10b981',
      violet: '#a855f7',
      orange: '#f97316'
    };
    const accentCol = strokeColors[activeTheme] || '#38bdf8';

    ctx.strokeStyle = accentCol;
    ctx.lineWidth = 2.2;
    ctx.stroke();

    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, accentCol.includes('#') ? accentCol + '55' : 'rgba(56,189,248,0.35)');
    grad.addColorStop(1, 'rgba(11, 18, 38, 0.02)');
    ctx.fillStyle = grad;
    ctx.fill();
  }

  let tickCount = 0;
  setInterval(() => {
    const jitter = (Math.random() - 0.5) * 4;
    const newPoint = Math.max(15, Math.min(94, baseTarget + jitter));
    points.shift();
    points.push(newPoint);

    if (cpuVal) cpuVal.textContent = newPoint.toFixed(1);

    tickCount++;
    if (tickCount % 3 === 0) {
      if (latencyVal) latencyVal.textContent = `Latency: ${Math.round(22 + Math.random() * 6)}ms`;
      if (memVal && memFill) {
        const m = (2.42 + Math.random() * 0.12).toFixed(2);
        memVal.textContent = m;
        memFill.style.width = Math.round((m / 4) * 100) + '%';
      }
    }

    drawSparkline();
  }, 900);

  window.addEventListener('resize', drawSparkline, { passive: true });
  drawSparkline();

  let spikeTimer = null;
  if (simSpikeBtn) {
    simSpikeBtn.addEventListener('click', () => {
      window.playDevaSound?.('click');
      clearTimeout(spikeTimer);
      baseTarget = 78;
      if (clusterState) clusterState.textContent = 'Auto-scaling (HPA Triggered)';
      if (cpuLoadTag) {
        cpuLoadTag.textContent = 'High Load (Spike)';
        cpuLoadTag.style.background = 'rgba(239, 68, 68, 0.2)';
        cpuLoadTag.style.color = '#ef4444';
      }
      renderPods(28);
      if (simLogText) {
        simLogText.innerHTML = '<span style="color:#f87171">[ALERT]</span> Traffic spike detected: CPU &gt; 75%. HPA dynamically provisioned <b>4 additional pods</b> (28/28 active). Cluster auto-healed.';
      }
      window.playDevaSound?.('success');

      spikeTimer = setTimeout(() => {
        baseTarget = 34;
        if (clusterState) clusterState.textContent = 'All Systems Normal';
        if (cpuLoadTag) {
          cpuLoadTag.textContent = 'Optimal';
          cpuLoadTag.style.background = '';
          cpuLoadTag.style.color = '';
        }
        renderPods(TOTAL_BASE_PODS);
        if (simLogText) {
          simLogText.innerHTML = '<span style="color:#34d399">[STABILIZED]</span> Traffic normalized. Scale-down completed. Cluster running 24 healthy pods in AWS ap-south-1.';
        }
      }, 7000);
    });
  }

  if (simRolloutBtn) {
    simRolloutBtn.addEventListener('click', () => {
      window.playDevaSound?.('click');
      if (simLogText) {
        simLogText.innerHTML = '<span style="color:#38bdf8">[ROLLOUT]</span> Initiating progressive canary deployment: <code>image: v2.4.3</code>. Zero downtime target.';
      }
      const nodes = podGrid.querySelectorAll('.pod-node');
      nodes.forEach((n, idx) => {
        setTimeout(() => {
          n.style.background = '#38bdf8';
          n.style.transform = 'scale(1.25)';
          setTimeout(() => {
            n.style.background = '';
            n.style.transform = '';
          }, 350);
        }, idx * 45);
      });

      setTimeout(() => {
        window.playDevaSound?.('success');
        if (simLogText) {
          simLogText.innerHTML = '<span style="color:#34d399">[SUCCESS]</span> Zero-downtime rollout complete. 24/24 pods updated to <code>v2.4.3</code>. 0 HTTP 5xx errors.';
        }
      }, nodes.length * 45 + 350);
    });
  }

  if (simScanBtn) {
    simScanBtn.addEventListener('click', () => {
      window.playDevaSound?.('terminal');
      if (simLogText) {
        simLogText.innerHTML = '<span style="color:#fbbf24">[AUDIT]</span> Running Trivy &amp; SonarQube container vulnerability security scan across 14 images...';
      }
      setTimeout(() => {
        window.playDevaSound?.('success');
        if (simLogText) {
          simLogText.innerHTML = '<span style="color:#34d399">[CLEAN]</span> Security scan complete: <b>0 Critical, 0 High CVEs</b> detected. CIS benchmark 98% passed.';
        }
      }, 850);
    });
  }
})();

// 10. Project Architecture Specs Lightbox Modal
(function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const backdrop = document.getElementById('projectBackdrop');
  const closeBtn = document.getElementById('projectClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalBadge = document.getElementById('modalBadge');
  const modalDesc = document.getElementById('modalDesc');
  const modalArchFlow = document.getElementById('modalArchFlow');
  const modalSpecsList = document.getElementById('modalSpecsList');
  const modalDeployCmd = document.getElementById('modalDeployCmd');
  const copyCmdBtn = document.getElementById('copyCmdBtn');
  const modalGithubLink = document.getElementById('modalGithubLink');

  if (!modal || !modalTitle) return;

  const PROJECT_DATA = {
    'eventhub': {
      title: 'EventHub — Event Management Platform',
      badge: 'Full-Stack & Containerized',
      desc: 'Interactive event ticketing and seating platform with complete containerized microservice topology.',
      nodes: [
        { title: 'React Client', sub: 'SPA Frontend' },
        { title: 'Nginx Ingress', sub: 'Reverse Proxy' },
        { title: 'Node.js App', sub: 'Docker Pods' },
        { title: 'PostgreSQL', sub: 'Relational DB' },
        { title: 'AWS S3', sub: 'Static Media' }
      ],
      specs: [
        'Multi-stage Docker build pipeline reducing final image size from 460MB to 74MB.',
        'Kubernetes manifests covering Deployments, ClusterIP Services, ConfigMaps, and Secrets.',
        'Horizontal Pod Autoscaler (HPA) configured to scale between 2 and 8 replicas based on CPU target.',
        'Automated GitHub Actions workflow for pull request linting and Docker Hub automated push.'
      ],
      deployCmd: 'kubectl apply -f https://raw.githubusercontent.com/devaghanekar23/EventHub/main/k8s/deployment.yaml',
      github: 'https://github.com/devaghanekar23'
    },
    'weather': {
      title: 'Weather App — Kubernetes Helm Orchestration',
      badge: 'Cloud Native & Helm',
      desc: 'Real-time weather tracking application packaged with custom parameterized Helm charts on Kubernetes.',
      nodes: [
        { title: 'Web App', sub: 'Responsive UI' },
        { title: 'Route 53', sub: 'DNS Routing' },
        { title: 'AWS ALB', sub: 'Load Balancer' },
        { title: 'K8s Cluster', sub: 'Helm Release' },
        { title: 'Amazon ECR', sub: 'Private Registry' }
      ],
      specs: [
        'Custom Helm Chart with dynamic environment values for Dev, Staging, and Production tiers.',
        'Integrated with Amazon ECR for private, scanned container image storage and automated pull secrets.',
        'Configured Readiness and Liveness probes with HTTP health endpoints for graceful fault tolerance.',
        'Rolling update deployment strategy configured with maxSurge: 25% and maxUnavailable: 0.'
      ],
      deployCmd: 'helm upgrade --install weather-app ./helm -f values.prod.yaml --namespace production',
      github: 'https://github.com/devaghanekar23'
    },
    'hearth': {
      title: 'Hearth Recipe App — AWS ECS & Fargate',
      badge: 'Serverless Containers',
      desc: 'High-availability recipe curation application deployed entirely on serverless AWS ECS Fargate clusters.',
      nodes: [
        { title: 'End User', sub: 'HTTPS Request' },
        { title: 'CloudFront', sub: 'CDN Edge' },
        { title: 'AWS ALB', sub: 'Target Group' },
        { title: 'ECS Fargate', sub: 'Serverless Tasks' },
        { title: 'Amazon ECR', sub: 'Image Registry' }
      ],
      specs: [
        'Serverless container execution via AWS Fargate eliminating underlying EC2 instance maintenance.',
        'Multi-AZ architecture deployed across ap-south-1a and ap-south-1b for zero single points of failure.',
        'Optimized Docker container security running with non-root user and minimal alpine base layer.',
        'Integrated AWS CloudWatch log groups for centralized application observability and alerts.'
      ],
      deployCmd: 'aws ecs update-service --cluster hearth-cluster --service hearth-svc --force-new-deployment',
      github: 'https://github.com/devaghanekar23'
    },
    'devops-fund': {
      title: 'DevOps Fundamentals — Infrastructure as Code',
      badge: 'IaC & AWS Cloud',
      desc: 'Automated AWS cloud infrastructure provisioning using Terraform HCL scripts and GitHub Actions.',
      nodes: [
        { title: 'Developer', sub: 'Terraform Code' },
        { title: 'GitHub CI', sub: 'Validation & Plan' },
        { title: 'AWS VPC', sub: 'Isolated Network' },
        { title: 'Subnets', sub: 'Public / Private' },
        { title: 'Route Tables', sub: 'Internet Gateway' }
      ],
      specs: [
        'Modular Terraform HCL code managing VPC, subnets, NAT gateways, and custom security groups.',
        'Remote state locking configured with Amazon S3 and DynamoDB to prevent concurrent pipeline conflicts.',
        'Automated CI pipeline enforcing terraform fmt, terraform validate, and tflint on every pull request.',
        'Strict least-privilege security group ingress/egress rules adhering to CIS Cloud benchmarks.'
      ],
      deployCmd: 'terraform init && terraform plan -out=tfplan && terraform apply tfplan',
      github: 'https://github.com/devaghanekar23'
    },
    'jenkins-fund': {
      title: 'Jenkins CI/CD Pipeline Automation',
      badge: 'CI/CD & Automation',
      desc: 'Declarative Jenkins pipeline automating build, test, and release cycles from source code to artifact repository.',
      nodes: [
        { title: 'Git Push', sub: 'Source Code' },
        { title: 'Webhook', sub: 'Instant Trigger' },
        { title: 'Jenkins Master', sub: 'Pipeline Engine' },
        { title: 'Build Agent', sub: 'Unit Tests & Build' },
        { title: 'Artifact Store', sub: 'Verified Build' }
      ],
      specs: [
        'Declarative Jenkinsfile with distinct Build, Unit Test, Security Audit, and Package stages.',
        'Webhook automation responding instantly to GitHub commits and pull request events.',
        'Jenkins Credentials store integration to prevent plaintext secrets leakage in console build logs.',
        'Automated post-build actions including test report generation and artifact archiving.'
      ],
      deployCmd: 'jenkins-cli build "DevOps-Fundamentals-Pipeline" -s -v',
      github: 'https://github.com/devaghanekar23'
    },
    'k8s-project': {
      title: 'Automated Kubernetes Deployment Pipeline',
      badge: 'Kubernetes & CI/CD',
      desc: 'End-to-end continuous delivery pipeline automating Docker builds and Kubernetes cluster rollouts.',
      nodes: [
        { title: 'Jenkins CI', sub: 'Pipeline Runner' },
        { title: 'Docker Engine', sub: 'Image Build' },
        { title: 'Kube Controller', sub: 'Deployment Apply' },
        { title: 'K8s Cluster', sub: 'Worker Nodes' },
        { title: 'ClusterIP / Ingress', sub: 'Live Service' }
      ],
      specs: [
        'Complete integration connecting Jenkins build agents directly to Kubernetes cluster APIs.',
        'Automated zero-downtime deployment rollouts verified with kubectl rollout status monitoring.',
        'Configured NodePort and Ingress controllers for clean external application access.',
        'Automated deployment rollback logic triggered if readiness probe fails during rollout.'
      ],
      deployCmd: 'kubectl apply -f k8s/ && kubectl rollout status deployment/app-deployment',
      github: 'https://github.com/devaghanekar23'
    }
  };

  function openProjectModal(key) {
    const data = PROJECT_DATA[key] || PROJECT_DATA['eventhub'];
    modalTitle.textContent = data.title;
    modalBadge.textContent = data.badge;
    modalDesc.textContent = data.desc;
    modalDeployCmd.textContent = data.deployCmd;
    if (modalGithubLink) modalGithubLink.href = data.github;

    modalArchFlow.innerHTML = '';
    data.nodes.forEach((node, i) => {
      const nodeEl = document.createElement('div');
      nodeEl.className = 'arch-node';
      nodeEl.innerHTML = `<span class="arch-node-title">${node.title}</span><span class="arch-node-sub">${node.sub}</span>`;
      modalArchFlow.appendChild(nodeEl);
      if (i < data.nodes.length - 1) {
        const arrow = document.createElement('i');
        arrow.className = 'fas fa-arrow-right arch-arrow';
        modalArchFlow.appendChild(arrow);
      }
    });

    modalSpecsList.innerHTML = '';
    data.specs.forEach(spec => {
      const li = document.createElement('li');
      li.innerHTML = `<i class="fas fa-check-circle"></i> <span>${spec}</span>`;
      modalSpecsList.appendChild(li);
    });

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    window.playDevaSound?.('click');
  }

  function closeProjectModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.spec-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const proj = btn.dataset.project || 'eventhub';
      openProjectModal(proj);
    });
  });

  if (copyCmdBtn) {
    copyCmdBtn.addEventListener('click', async () => {
      const cmd = modalDeployCmd.textContent;
      try {
        if (navigator.clipboard) await navigator.clipboard.writeText(cmd);
        copyCmdBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        window.playDevaSound?.('success');
        setTimeout(() => { copyCmdBtn.innerHTML = '<i class="far fa-copy"></i> Copy'; }, 2200);
      } catch (_) {}
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeProjectModal);
  if (backdrop) backdrop.addEventListener('click', closeProjectModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeProjectModal();
    }
  });
})();

// 11. DevOps Robot & Orbiting Tools Ecosystem
(function initRobotEcosystem() {
  const orbitTrack = document.getElementById('orbitTrack');
  const botSpeechText = document.getElementById('botSpeechText');
  const botCenterpiece = document.getElementById('botCenterpiece');
  const pauseBtn = document.getElementById('orbitPauseBtn');
  const pauseText = document.getElementById('orbitPauseText');
  const speedBtn = document.getElementById('orbitSpeedBtn');
  const speedText = document.getElementById('orbitSpeedText');
  const waveBtn = document.getElementById('orbitWaveBtn');
  const orbitItems = document.querySelectorAll('.orbit-item');

  if (!orbitTrack || !botSpeechText) return;

  const TOOL_DATA = {
    'aws': '☁️ AWS: Managing VPC networks, ECR registries, ECS/EKS clusters, and automated cloud deployments.',
    'linux': '🐧 Linux: System administration, shell automation, SSH management, and systemd service tuning.',
    'jenkins': '🏗️ Jenkins: Declarative Jenkinsfile pipelines, automated unit testing, and webhook-driven artifact releases.',
    'docker': '🐳 Docker: Multi-stage container builds, alpine image minimization, and containerized microservices.',
    'k8s': '☸️ Kubernetes: Managing Helm charts, pod replication, self-healing rollouts, and horizontal autoscaling (HPA).',
    'ansible': '📜 Ansible: Idempotent YAML playbooks, automated server provisioning, and multi-node fleet management.',
    'terraform': '🧱 Terraform: Infrastructure as Code (IaC) provisioning AWS VPCs, subnets, and security groups with remote state.',
    'prometheus': '🔥 Prometheus: Time-series cluster telemetry, metrics scraping, PromQL queries, and proactive alerts.',
    'grafana': '📈 Grafana: Dynamic real-time cluster visualization, performance monitoring, and SLO tracking dashboards.',
    'git': '🌿 Git: Branching strategies, atomic commits, fast-forward rebasing, and clean repo hygiene.',
    'github': '🐙 GitHub: Automated CI/CD Actions, pull request code review workflows, and project issue tracking.'
  };

  const DEFAULT_SPEECH = "Hi! I coordinate Devendra's DevOps stack. Hover over any orbiting tool to inspect its role!";
  let revertTimer = null;
  let isManuallyPaused = false;

  orbitItems.forEach(item => {
    const tool = item.dataset.tool;
    item.addEventListener('mouseenter', () => {
      clearTimeout(revertTimer);
      orbitTrack.classList.add('paused');
      window.playDevaSound?.('click');
      if (TOOL_DATA[tool]) {
        botSpeechText.textContent = TOOL_DATA[tool];
      }
    });

    item.addEventListener('mouseleave', () => {
      if (!isManuallyPaused) {
        orbitTrack.classList.remove('paused');
      }
      revertTimer = setTimeout(() => {
        botSpeechText.textContent = DEFAULT_SPEECH;
      }, 2500);
    });

    item.addEventListener('click', () => {
      window.playDevaSound?.('success');
      const toastEl = document.getElementById('toast');
      if (toastEl) {
        toastEl.innerHTML = `<i class="fas fa-microchip"></i> <span>DevOps Tool: <b>${item.querySelector('.orbit-label')?.textContent || tool.toUpperCase()}</b> Active</span>`;
        toastEl.classList.add('show');
        setTimeout(() => toastEl.classList.remove('show'), 2000);
      }
    });
  });

  // Pause / Resume Button
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      isManuallyPaused = !isManuallyPaused;
      orbitTrack.classList.toggle('paused', isManuallyPaused);
      if (pauseText) pauseText.textContent = isManuallyPaused ? 'Resume Orbit' : 'Pause Orbit';
      const icon = pauseBtn.querySelector('i');
      if (icon) icon.className = isManuallyPaused ? 'fas fa-play' : 'fas fa-pause';
      window.playDevaSound?.('click');
    });
  }

  // Speed Toggle
  let isFast = false;
  if (speedBtn) {
    speedBtn.addEventListener('click', () => {
      isFast = !isFast;
      orbitTrack.classList.toggle('speed-up', isFast);
      if (speedText) speedText.textContent = isFast ? '1x Normal' : '2x Speed';
      window.playDevaSound?.('click');
    });
  }

  // Say Hello Wave Button
  function triggerBotWave() {
    window.playDevaSound?.('success');
    if (botCenterpiece) {
      botCenterpiece.style.transform = 'scale(1.15) rotate(-3deg)';
      setTimeout(() => {
        botCenterpiece.style.transform = 'scale(1.15) rotate(3deg)';
        setTimeout(() => { botCenterpiece.style.transform = ''; }, 350);
      }, 250);
    }
    botSpeechText.textContent = "👋 Devendra's Cloud Bot reporting for duty! All 11 DevOps tools running at 100% capacity.";
    clearTimeout(revertTimer);
    revertTimer = setTimeout(() => {
      botSpeechText.textContent = DEFAULT_SPEECH;
    }, 4500);
  }

  if (waveBtn) waveBtn.addEventListener('click', triggerBotWave);
  if (botCenterpiece) botCenterpiece.addEventListener('click', triggerBotWave);
})();

/* =========================================
   ZILON Z PORTFOLIO — SCRIPTS
   ========================================= */

// ── PARTICLES CANVAS ──────────────────────
(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.5 + 0.1;
  };
  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  };

  function init() {
    resize();
    particles = Array.from({ length: 90 }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`;
      ctx.fill();
      p.update();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();


// ── NAV SCROLL EFFECT ──────────────────────
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
})();


// ── MOBILE NAV TOGGLE ──────────────────────
(function () {
  const toggle = document.getElementById('nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    const open = links.classList.contains('open');
    toggle.setAttribute('aria-expanded', open);
  });

  // Close on link click
  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => links.classList.remove('open'));
  });
})();


// ── SCROLL REVEAL ──────────────────────────
(function () {
  const targets = [
    '.section-header',
    '.about-text',
    '.about-stats',
    '.tech-category',
    '.specialty-card',
    '.project-card',
    '.contact-text',
    '.contact-item',
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger siblings
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        siblings.forEach((el, idx) => {
          setTimeout(() => el.classList.add('visible'), idx * 80);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  });
})();


// ── AVATAR HOVER (touch support) ───────────
(function () {
  const container = document.querySelector('.avatar-container');
  if (!container) return;

  container.addEventListener('touchstart', () => {
    container.classList.add('touched');
  }, { passive: true });

  container.addEventListener('touchend', () => {
    setTimeout(() => container.classList.remove('touched'), 800);
  }, { passive: true });
})();


// ── GLITCH TEXT (hero alias) ────────────────
(function () {
  const alias = document.querySelector('.alias-text');
  if (!alias) return;

  const chars = '!<>-_\\/[]{}—=+*^?#░▒▓';
  const original = alias.textContent;
  let glitching = false;

  function glitch() {
    if (glitching) return;
    glitching = true;
    let iter = 0;
    const interval = setInterval(() => {
      alias.textContent = original.split('').map((ch, i) => {
        if (i < iter) return original[i];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      if (iter >= original.length) {
        clearInterval(interval);
        alias.textContent = original;
        glitching = false;
      }
      iter += 1 / 2;
    }, 40);
  }

  // Trigger occasionally
  setInterval(glitch, 5000);
  setTimeout(glitch, 800);
})();


// ── ACTIVE NAV LINK ────────────────────────
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--cyan)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

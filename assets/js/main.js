// ===== LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 600);
});

// ===== THEME TOGGLE =====
const themeBtn = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') document.body.classList.add('light-mode');

function updateThemeIcon() {
  if (!themeBtn) return;
  const icon = themeBtn.querySelector('i');
  if (icon) {
    icon.className = document.body.classList.contains('light-mode') ? 'fas fa-sun' : 'fas fa-moon';
  }
}
updateThemeIcon();
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    updateThemeIcon();
  });
}

// ===== HAMBURGER MENU =====
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const icon = hamburger.querySelector('i');
    if (icon) icon.className = mobileMenu.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
  });
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      const icon = hamburger.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
    }
  });
}

// ===== ACTIVE NAV =====
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === currentPage || (currentPage === '' && href === 'index.html'));
  });
}
setActiveNav();

// ===== SCROLL TO TOP =====
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }
});
if (scrollTopBtn) scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== REVEAL ANIMATIONS =====
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// ===== TYPING EFFECT =====
function initTyping(selector, phrases) {
  const el = document.querySelector(selector);
  if (!el) return;
  let phraseIndex = 0, charIndex = 0, deleting = false;
  const typed = document.createElement('span');
  typed.className = 'typed';
  el.appendChild(typed);

  function type() {
    const current = phrases[phraseIndex];
    if (deleting) {
      typed.textContent = current.slice(0, --charIndex);
    } else {
      typed.textContent = current.slice(0, ++charIndex);
    }
    let delay = deleting ? 50 : 90;
    if (!deleting && charIndex === current.length) { delay = 2200; deleting = true; }
    else if (deleting && charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; delay = 400; }
    setTimeout(type, delay);
  }
  type();
}
initTyping('#hero-title', ['AI/ML Enthusiast', 'BCA Final Year Student', 'IoT Developer', 'Python Developer']);

// ===== PARTICLES CANVAS =====
(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const count = 55;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.4,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.15
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56,189,248,${p.alpha})`;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56,189,248,${0.06 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ===== CONTACT FORM VALIDATION =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const fields = [
      { id: 'contactName', errId: 'nameError', msg: 'Please enter your name.' },
      { id: 'contactEmail', errId: 'emailError', msg: 'Please enter a valid email.', type: 'email' },
      { id: 'contactMessage', errId: 'msgError', msg: 'Please enter a message.' }
    ];

    fields.forEach(f => {
      const input = document.getElementById(f.id);
      const err = document.getElementById(f.errId);
      input.classList.remove('error');
      err.classList.remove('show');
      let invalid = !input.value.trim();
      if (f.type === 'email' && input.value.trim()) {
        invalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      }
      if (invalid) {
        input.classList.add('error');
        err.textContent = f.msg;
        err.classList.add('show');
        valid = false;
      }
    });

    if (valid) {
      document.getElementById('formSuccess').classList.add('show');
      contactForm.reset();
      setTimeout(() => document.getElementById('formSuccess').classList.remove('show'), 4000);
    }
  });
}

// ===== PROJECT FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card-wrap');
if (filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? 'block' : 'none';
      });
    });
  });
}

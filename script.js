// ============================================================
// Respect reduced-motion preference
// ============================================================
const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================================
// Sticky nav background + active link highlighting
// ============================================================
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('[data-nav]');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);

  let current = '';
  sections.forEach((sec) => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom > 120) current = sec.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}, { passive: true });

// ============================================================
// Mobile nav toggle
// ============================================================
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
});
navLinksEl.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => navLinksEl.classList.remove('open'));
});

// ============================================================
// Typing effect for hero role line
// ============================================================
const roles = ['Software Developer', 'Full-Stack Developer', 'Problem Solver', 'Fast Learner'];
const typedEl = document.getElementById('typedRole');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  if (REDUCE_MOTION) {
    typedEl.textContent = roles[0];
    return;
  }
  const current = roles[roleIndex];
  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 35 : 65);
}
typeLoop();

// ============================================================
// Scroll-reveal animations
// ============================================================
const revealTargets = document.querySelectorAll(
  '.section-title, .about-text, .about-stats, .skill-card, .project-card, .timeline-item, .cert-leadership-grid, .education-block'
);
revealTargets.forEach((el) => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach((el) => io.observe(el));

// ============================================================
// "Editable" placeholder helper — clicking shows what to change
// ============================================================
document.querySelectorAll('.todo[data-todo]').forEach((el) => {
  el.title = el.getAttribute('data-todo');
});

// ============================================================
// Footer year
// ============================================================
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================================
// Hero network/particle canvas — signature element
// Subtle node graph that drifts and reacts to the cursor
// ============================================================
(function networkCanvas() {
  const canvas = document.getElementById('netCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, nodes, mouse = { x: -9999, y: -9999 };

  function resize() {
    const hero = canvas.parentElement;
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
    const count = Math.max(24, Math.min(60, Math.floor((w * h) / 28000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.6 + 0.6,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;

      const dx = n.x - mouse.x, dy = n.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        n.x += dx / dist * 0.6;
        n.y += dy / dist * 0.6;
      }
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.strokeStyle = `rgba(140,124,253,${(1 - dist / 140) * 0.35})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,179,71,0.65)';
      ctx.fill();
    });

    if (!REDUCE_MOTION) requestAnimationFrame(step);
  }

  window.addEventListener('resize', resize, { passive: true });
  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.parentElement.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  resize();
  if (REDUCE_MOTION) {
    step(); // draw once, static
  } else {
    step();
  }
})();

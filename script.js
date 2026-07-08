/* ============================================
   SANDEEP KUMAR SHA — Portfolio Interactions
   Particle System · Typing · Scroll Animations
   Theme Toggle · Smooth Scroll
   ============================================ */

// ==========================================
// PARTICLE SYSTEM (Canvas-based)
// ==========================================
class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.particleCount = 80;
    this.connectionDistance = 130;
    this.animationId = null;

    this.resize();
    this.init();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    const count = window.innerWidth < 768 ? 40 : this.particleCount;
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(this.canvas));
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.init();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  drawConnections() {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const lineColor = theme === 'light' ? '0, 151, 167' : '0, 240, 255';
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.connectionDistance) {
          const opacity = 1 - dist / this.connectionDistance;
          this.ctx.strokeStyle = `rgba(${lineColor}, ${opacity * 0.15})`;
          this.ctx.lineWidth = 0.6;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((p) => {
      p.update(this.mouse, this.canvas);
      p.draw(this.ctx);
    });

    this.drawConnections();
    this.animationId = requestAnimationFrame(() => this.animate());
  }
}

class Particle {
  constructor(canvas) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.baseSpeedX = (Math.random() - 0.5) * 0.6;
    this.baseSpeedY = (Math.random() - 0.5) * 0.6;
    this.speedX = this.baseSpeedX;
    this.speedY = this.baseSpeedY;
    this.opacity = Math.random() * 0.5 + 0.2;

    // Random accent color names
    const colorTypes = ['cyan', 'purple', 'magenta'];
    this.colorType = colorTypes[Math.floor(Math.random() * colorTypes.length)];
  }

  update(mouse, canvas) {
    // Mouse repulsion
    if (mouse.x !== null && mouse.y !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.speedX += (dx / dist) * force * 0.8;
        this.speedY += (dy / dist) * force * 0.8;
      }
    }

    // Friction
    this.speedX += (this.baseSpeedX - this.speedX) * 0.05;
    this.speedY += (this.baseSpeedY - this.speedY) * 0.05;

    this.x += this.speedX;
    this.y += this.speedY;

    // Wrap around edges
    if (this.x < -10) this.x = canvas.width + 10;
    if (this.x > canvas.width + 10) this.x = -10;
    if (this.y < -10) this.y = canvas.height + 10;
    if (this.y > canvas.height + 10) this.y = -10;
  }

  draw(ctx) {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    let rgb;
    if (theme === 'light') {
      if (this.colorType === 'cyan') rgb = '0, 151, 167';
      else if (this.colorType === 'purple') rgb = '123, 47, 242';
      else rgb = '216, 27, 96';
    } else {
      if (this.colorType === 'cyan') rgb = '0, 240, 255';
      else if (this.colorType === 'purple') rgb = '180, 74, 255';
      else rgb = '255, 45, 149';
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rgb}, ${this.opacity})`;
    ctx.fill();

    // Glow
    ctx.shadowBlur = theme === 'dark' ? 15 : 5;
    ctx.shadowColor = `rgba(${rgb}, 0.3)`;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}


// ==========================================
// TYPING EFFECT
// ==========================================
class TypingEffect {
  constructor(elementId, strings, typeSpeed = 80, deleteSpeed = 40, pauseTime = 2000) {
    this.element = document.getElementById(elementId);
    this.strings = strings;
    this.typeSpeed = typeSpeed;
    this.deleteSpeed = deleteSpeed;
    this.pauseTime = pauseTime;
    this.currentString = 0;
    this.currentChar = 0;
    this.isDeleting = false;

    this.type();
  }

  type() {
    const current = this.strings[this.currentString];

    if (this.isDeleting) {
      this.currentChar--;
      this.element.textContent = current.substring(0, this.currentChar);
    } else {
      this.currentChar++;
      this.element.textContent = current.substring(0, this.currentChar);
    }

    let speed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

    if (!this.isDeleting && this.currentChar === current.length) {
      speed = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentChar === 0) {
      this.isDeleting = false;
      this.currentString = (this.currentString + 1) % this.strings.length;
      speed = 400;
    }

    setTimeout(() => this.type(), speed);
  }
}


// ==========================================
// SCROLL REVEAL ANIMATIONS
// ==========================================
class ScrollReveal {
  constructor() {
    this.elements = document.querySelectorAll('.reveal');
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    this.elements.forEach((el) => this.observer.observe(el));
  }
}


// ==========================================
// THEME TOGGLE
// ==========================================
class ThemeToggle {
  constructor() {
    this.toggle = document.getElementById('theme-toggle');
    this.icon = document.getElementById('theme-icon');
    this.html = document.documentElement;

    // Load saved theme or default to dark
    const saved = localStorage.getItem('portfolio-theme') || 'dark';
    this.setTheme(saved);

    this.toggle.addEventListener('click', () => {
      const current = this.html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      this.setTheme(next);
      localStorage.setItem('portfolio-theme', next);
    });
  }

  setTheme(theme) {
    this.html.setAttribute('data-theme', theme);
    if (theme === 'light') {
      this.icon.className = 'fa-solid fa-sun';
    } else {
      this.icon.className = 'fa-solid fa-moon';
    }
  }
}


// ==========================================
// NAVBAR CONTROLLER
// ==========================================
class NavbarController {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.hamburger = document.getElementById('nav-hamburger');
    this.navLinks = document.getElementById('nav-links');
    this.links = document.querySelectorAll('.nav-links a');
    this.sections = document.querySelectorAll('section[id], div[id]');

    this.bindEvents();
    this.onScroll();
  }

  bindEvents() {
    // Scroll class
    window.addEventListener('scroll', () => this.onScroll());

    // Hamburger toggle
    this.hamburger.addEventListener('click', () => {
      this.hamburger.classList.toggle('open');
      this.navLinks.classList.toggle('open');
    });

    // Close on link click
    this.links.forEach((link) => {
      link.addEventListener('click', () => {
        this.hamburger.classList.remove('open');
        this.navLinks.classList.remove('open');
      });
    });

    // Close on outside click (mobile)
    document.addEventListener('click', (e) => {
      if (
        !this.navLinks.contains(e.target) &&
        !this.hamburger.contains(e.target) &&
        this.navLinks.classList.contains('open')
      ) {
        this.hamburger.classList.remove('open');
        this.navLinks.classList.remove('open');
      }
    });
  }

  onScroll() {
    // Shrink navbar on scroll
    if (window.scrollY > 60) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }

    // Active section highlighting
    let currentSection = '';
    this.sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        currentSection = section.getAttribute('id');
      }
    });

    this.links.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('data-section');
      if (href === currentSection) {
        link.classList.add('active');
      }
    });
  }
}


// ==========================================
// CONTACT FORM HANDLER
// ==========================================
class ContactForm {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.status = document.getElementById('form-status');

    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim() || 'Portfolio Contact';
    const message = document.getElementById('form-message').value.trim();

    // Validation
    if (!name || !email || !message) {
      this.showStatus('Please fill in all required fields.', 'error');
      return;
    }

    if (!this.isValidEmail(email)) {
      this.showStatus('Please enter a valid email address.', 'error');
      return;
    }

    // Build mailto link
    const mailtoBody = `Hi Sandeep,%0D%0A%0D%0AMy name is ${encodeURIComponent(name)}.%0D%0A%0D%0A${encodeURIComponent(message)}%0D%0A%0D%0ARegards,%0D%0A${encodeURIComponent(name)}%0D%0AEmail: ${encodeURIComponent(email)}`;
    const mailtoLink = `mailto:shasandeepkumar.333@gmail.com?subject=${encodeURIComponent(subject)}&body=${mailtoBody}`;

    window.location.href = mailtoLink;

    this.showStatus('Opening your email client... Thank you!', 'success');
    this.form.reset();

    // Auto-hide status
    setTimeout(() => {
      this.status.style.display = 'none';
      this.status.className = 'form-status';
    }, 5000);
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  showStatus(message, type) {
    this.status.textContent = message;
    this.status.className = `form-status ${type}`;
  }
}


// ==========================================
// SMOOTH SCROLL
// ==========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}


// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Particle background
  new ParticleSystem('particle-canvas');

  // Typing effect — updated strings (no Full-Stack Developer)
  new TypingEffect('typed-text', [
    'AI/ML Engineer',
    'Data Science Enthusiast',
    'Problem Solver',
    'Python Developer',
    'Open Source Contributor',
  ]);

  // Scroll reveal
  new ScrollReveal();

  // Theme toggle
  new ThemeToggle();

  // Navbar
  new NavbarController();

  // Contact form
  new ContactForm('contact-form');

  // Smooth scroll
  initSmoothScroll();
});

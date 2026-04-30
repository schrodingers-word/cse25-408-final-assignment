/* ═══════════════════════════════════════════════════════════════
   AutomationHub — main.js
   Modules: Nav, Form Validation, Scroll Reveal, Char Counter
═══════════════════════════════════════════════════════════════ */
 
// ── MOBILE NAV ─────────────────────────────────────────────────
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.navlinks');
  if (!toggle || !navLinks) return;
 
  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isExpanded));
    document.querySelector('header').classList.toggle('nav-open');
  });
 
  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      document.querySelector('header').classList.remove('nav-open');
    });
  });
}
 
// ── ACTIVE NAV LINK ────────────────────────────────────────────
function setActiveNavLink() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navlinks a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
    }
  });
}
 
// ── SCROLL REVEAL ──────────────────────────────────────────────
function initScrollReveal() {
  const elements = document.querySelectorAll(
    '.card, .project-card, .device-card, .topic-block, .callout'
  );
 
  if (!elements.length) return;
 
  // Add reveal class to all target elements
  elements.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger siblings in a grid
    const delay = (i % 3) * 100;
    el.style.transitionDelay = delay + 'ms';
  });
 
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
 
  elements.forEach(el => observer.observe(el));
}
 
// ── CHARACTER COUNTER (feedback form) ─────────────────────────
function initCharCounter() {
  const textarea = document.getElementById('message');
  const counter  = document.getElementById('messageCount');
  if (!textarea || !counter) return;
 
  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    const max = parseInt(textarea.getAttribute('maxlength')) || 1000;
    counter.textContent = `${len} / ${max} characters`;
    counter.style.color = len > max * 0.9
      ? 'var(--red)'
      : 'var(--muted)';
  });
}
 
// ── FORM VALIDATION ────────────────────────────────────────────
function initFeedbackForm() {
  const form = document.getElementById('feedbackForm');
  if (!form) return;
 
  const fields = [
    {
      input:    document.getElementById('fullName'),
      error:    document.getElementById('nameError'),
      validate: v => v.trim().length >= 2,
      message:  'Please enter your full name (at least 2 characters).'
    },
    {
      input:    document.getElementById('email'),
      error:    document.getElementById('emailError'),
      validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message:  'Please enter a valid email address.'
    },
    {
      input:    document.getElementById('occupation'),
      error:    document.getElementById('occupationError'),
      validate: v => v.trim().length > 0,
      message:  'Please enter your role or occupation.'
    },
    {
      input:    document.getElementById('topic'),
      error:    document.getElementById('topicError'),
      validate: v => v !== '',
      message:  'Please select a topic of interest.'
    },
    {
      input:    document.getElementById('message'),
      error:    document.getElementById('messageError'),
      validate: v => v.trim().length >= 10,
      message:  'Please enter a message of at least 10 characters.'
    }
  ];
 
  function clearErrors() {
    fields.forEach(({ input, error }) => {
      if (!input || !error) return;
      error.textContent = '';
      error.hidden = true;
      input.classList.remove('input-error');
      input.removeAttribute('aria-invalid');
    });
  }
 
  function validateField({ input, error, validate, message }) {
    if (!input || !error) return true;
    const isValid = validate(input.value);
    if (!isValid) {
      error.textContent = message;
      error.hidden = false;
      input.classList.add('input-error');
      input.setAttribute('aria-invalid', 'true');
    }
    return isValid;
  }
 
  // Inline validation on blur
  fields.forEach(field => {
    if (!field.input) return;
    field.input.addEventListener('blur', () => {
      if (field.input.value !== '') validateField(field);
    });
    // Clear error when user starts typing again
    field.input.addEventListener('input', () => {
      if (field.error) {
        field.error.hidden = true;
        field.input.classList.remove('input-error');
        field.input.removeAttribute('aria-invalid');
      }
    });
  });
 
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();
 
    const results = fields.map(validateField);
    const allValid = results.every(Boolean);
 
    if (allValid) {
      const successRegion = document.getElementById('formSuccess');
      if (successRegion) {
        successRegion.hidden = false;
        successRegion.focus();
        successRegion.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
      // Reset char counter
      const counter = document.getElementById('messageCount');
      if (counter) counter.textContent = '0 / 1000 characters';
    } else {
      // Focus first invalid field
      const firstInvalid = fields.find(
        ({ input }) => input && input.getAttribute('aria-invalid') === 'true'
      );
      if (firstInvalid) firstInvalid.input.focus();
    }
  });
}
 
// ── CURRENT YEAR IN FOOTER ────────────────────────────────────
function setFooterYear() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
 
// ── INIT ALL ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  setActiveNavLink();
  initScrollReveal();
  initCharCounter();
  initFeedbackForm();
  setFooterYear();
});

/**
 * UI & Animation Controller
 */

// 1. Set current year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// 2. Mobile Menu Logic
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');

function openMobileMenu() {
  mobileMenu.classList.add('open');
  mobileMenuBackdrop.classList.add('open');
  mobileMenuBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  closeMenuBtn.focus();
}

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  mobileMenuBackdrop.classList.remove('open');
  mobileMenuBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMobileMenu);
if (mobileMenuBackdrop) mobileMenuBackdrop.addEventListener('click', closeMobileMenu);

document.querySelectorAll('#mobile-menu a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// 3. Typewriter Effect
const typewriterElement = document.getElementById('typewriter');
const words = ['Frontend-Developer.', 'Competitive Programmer.', 'Math Student.', 'AI Enthusiast.', 'Problem Solver.'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function typewriter() {
  if (prefersReducedMotion || !typewriterElement) {
    if (typewriterElement) typewriterElement.textContent = words[0];
    return;
  }

  const currentWord = words[wordIndex];
  if (isDeleting) {
    typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 50 : 100;

  if (!isDeleting && charIndex === currentWord.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    delay = 500;
  }

  setTimeout(typewriter, delay);
}

// 4. Scroll Animations (The Fixed Part)
const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // FIX: Get delay from CSS even if not set as inline style
      const computedStyle = window.getComputedStyle(entry.target);
      const delayStr = entry.target.style.transitionDelay || computedStyle.transitionDelay;
      const delay = parseFloat(delayStr) || 0;

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay * 1000);
      
      // Stop observing once visible to save mobile battery
      animationObserver.unobserve(entry.target);
    }
  });
}, {
  root: null,
  rootMargin: '0px 0px -50px 0px',
  threshold: 0.1
});

function initAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
  
  if (prefersReducedMotion) {
    animatedElements.forEach(el => el.classList.add('visible'));
    return;
  }

  // Activate animations via class
  document.body.classList.add('js-animations');

  animatedElements.forEach(el => {
    animationObserver.observe(el);
  });

  // Force-check elements already in view on load
  window.requestAnimationFrame(() => {
    animatedElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
      }
    });
  });
}

// 5. Stats Counter
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.getAttribute('data-target'));
      animateCounter(entry.target, target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

function animateCounter(element, target) {
  if (prefersReducedMotion) {
    element.textContent = target;
    return;
  }

  let current = 0;
  const duration = 2000; 
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic function for smoother finish
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    
    element.textContent = Math.floor(easeProgress * target);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }
  requestAnimationFrame(update);
}

// 6. Execution
document.addEventListener('DOMContentLoaded', () => {
  typewriter();
  initAnimations();
  document.querySelectorAll('.stat-number').forEach(stat => statsObserver.observe(stat));
  
  // Active Nav Observer
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });

  sections.forEach(section => navObserver.observe(section));
});


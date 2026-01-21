// Set current year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu functionality
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
  mobileMenuBtn.focus();
}

mobileMenuBtn.addEventListener('click', openMobileMenu);
closeMenuBtn.addEventListener('click', closeMobileMenu);
mobileMenuBackdrop.addEventListener('click', closeMobileMenu);

// Close menu when clicking a link
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Close menu with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    closeMobileMenu();
  }
});

// Typewriter effect
const typewriterElement = document.getElementById('typewriter');
const words = [' Frontend-Developer', 'Competitive Programmer.', 'Math Student.', 'AI Enthusiast.', 'Problem Solver.'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function typewriter() {
  if (prefersReducedMotion) {
    typewriterElement.textContent = words[0];
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
    delay = 2000; // Pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    delay = 500; // Pause before new word
  }

  setTimeout(typewriter, delay);
}

typewriter();

// FIXED: Initialize animations only if not reduced motion
// Add class to body to enable CSS animations
if (!prefersReducedMotion) {
  document.body.classList.add('js-animations');
}

// Scroll animations with IntersectionObserver
const observerOptions = {
  root: null,
  rootMargin: '0px 0px -50px 0px', // Trigger slightly before element is fully visible
  threshold: 0.1
};

const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Add small delay for staggered effect
      const delay = entry.target.style.transitionDelay || '0s';
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, parseFloat(delay) * 1000);
    }
  });
}, observerOptions);

// Initialize animations
function initAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
  
  if (prefersReducedMotion) {
    // If reduced motion, make everything visible immediately
    animatedElements.forEach(el => {
      el.classList.add('visible');
    });
  } else {
    // Observe all animated elements
    animatedElements.forEach(el => {
      animationObserver.observe(el);
    });
    
    // IMPORTANT: Trigger initial check for elements already in viewport
    // This fixes the mobile issue where elements don't animate on page load
    setTimeout(() => {
      animatedElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        // If element is already in viewport, make it visible
        if (rect.top < windowHeight && rect.bottom > 0) {
          el.classList.add('visible');
        }
      });
    }, 100);
  }
}

// Run initialization
initAnimations();

// Stats counter animation
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
  const increment = target / 50;
  const duration = 1500;
  const stepTime = duration / 50;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, stepTime);
}

document.querySelectorAll('.stat-number').forEach(stat => {
  statsObserver.observe(stat);
});

// Active nav link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { rootMargin: '-50% 0px -50% 0px' });

sections.forEach(section => {
  navObserver.observe(section);
});


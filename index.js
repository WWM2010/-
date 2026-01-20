// Default configuration
const defaultConfig = {
  hero_greeting: "Hi, I'm Mohamed.",
  hero_subtitle: "Building the future, one line of code at a time.",
  about_title: "About Me",
  contact_location: "Agadir, Morocco",
  contact_email: "mohamedaitelkadi@example.com"
};
// all the code is written by AI and some parts from me and i modified it to match my website . 
// Initialize Element SDK
if (window.elementSdk) {
  window.elementSdk.init({
    defaultConfig,
    onConfigChange: async (config) => {
      // Update hero greeting
      const heroGreeting = document.getElementById('hero-greeting');
      if (heroGreeting) {
        heroGreeting.textContent = config.hero_greeting || defaultConfig.hero_greeting;
      }

      // Update hero subtitle
      const heroSubtitle = document.getElementById('hero-subtitle');
      if (heroSubtitle) {
        heroSubtitle.textContent = config.hero_subtitle || defaultConfig.hero_subtitle;
      }

      // Update about title
      const aboutTitle = document.getElementById('about-title');
      if (aboutTitle) {
        aboutTitle.textContent = config.about_title || defaultConfig.about_title;
      }

      // Update contact location
      const contactLocation = document.getElementById('contact-location');
      if (contactLocation) {
        contactLocation.textContent = config.contact_location || defaultConfig.contact_location;
      }

      // Update contact email
      const contactEmail = document.getElementById('contact-email');
      if (contactEmail) {
        contactEmail.textContent = config.contact_email || defaultConfig.contact_email;
      }
    },
    mapToCapabilities: (config) => ({
      recolorables: [],
      borderables: [],
      fontEditable: undefined,
      fontSizeable: undefined
    }),
    mapToEditPanelValues: (config) => new Map([
      ['hero_greeting', config.hero_greeting || defaultConfig.hero_greeting],
      ['hero_subtitle', config.hero_subtitle || defaultConfig.hero_subtitle],
      ['about_title', config.about_title || defaultConfig.about_title],
      ['contact_location', config.contact_location || defaultConfig.contact_location],
      ['contact_email', config.contact_email || defaultConfig.contact_email]
    ])
  });
}

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
const words = ['Competitive Programmer.', 'Developer.', 'Math Student.', 'AI Enthusiast.', 'Problem Solver.'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typewriterTimeout;

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

  typewriterTimeout = setTimeout(typewriter, delay);
}

typewriter();

// Scroll animations with IntersectionObserver
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
  if (!prefersReducedMotion) {
    animationObserver.observe(el);
  } else {
    el.classList.add('visible');
  }
});

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

(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9c0ec477a3bfb283',t:'MTc2ODkxNDE1OS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();

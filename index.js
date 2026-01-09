// Cursor effect
const circle = document.querySelector(".circle");
let mouseX = 0, mouseY = 0, rafId = null;

const mqHover = window.matchMedia('(hover: hover) and (pointer: fine)');
const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

function onMouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (rafId === null) rafId = requestAnimationFrame(animate);
}

function animate() {
  if (!circle) return;
  const offsetX = circle.offsetWidth / 2;
  const offsetY = circle.offsetHeight / 2;
  const targetX = mouseX - offsetX;
  const targetY = mouseY - offsetY;

  const currentTransform = circle.style.transform || 'translate(0px, 0px)';
  const match = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
  let currentX = 0, currentY = 0;
  if (match) {
    currentX = parseFloat(match[1]);
    currentY = parseFloat(match[2]);
  }

  const newX = currentX + (targetX - currentX) * 0.12;
  const newY = currentY + (targetY - currentY) * 0.12;

  circle.style.transform = `translate(${newX}px, ${newY}px)`;
  rafId = requestAnimationFrame(animate);
}

function startCursor() {
  if (!circle) return;
  window.addEventListener("mousemove", onMouseMove);
}

function stopCursor() {
  window.removeEventListener("mousemove", onMouseMove);
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (circle) circle.style.transform = "";
}

function evaluateCursor() {
  if (mqHover.matches && !mqReduce.matches) {
    startCursor();
  } else {
    stopCursor();
  }
}

evaluateCursor();
mqHover.addEventListener('change', evaluateCursor);
mqReduce.addEventListener('change', evaluateCursor);







// Counting animation for stats
function startCountingAnimation() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        const target = parseInt(entry.target.dataset.target);
        let current = 0;
        const increment = target / 50;
        const duration = 2500;
        const startTime = Date.now();

        const count = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          current = Math.floor(target * progress);
          
          entry.target.textContent = current;

          if (progress < 1) {
            requestAnimationFrame(count);
          } else {
            entry.target.textContent = target;
            entry.target.classList.add('counted');
          }
        };

        count();
      }
    });
  }, observerOptions);

  statNumbers.forEach(number => observer.observe(number));
}

// Navbar active state
(function initActiveNav() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const links = nav.querySelectorAll('a[href^="#"]');

  const setActive = (id) => {
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
  };

  links.forEach(l => l.classList.remove('active'));

  const io = new IntersectionObserver((entries) => {
    let best = null;
    entries.forEach(e => {
      if (e.isIntersecting && (!best || e.intersectionRatio > best.ratio)) {
        best = { id: e.target.id, ratio: e.intersectionRatio };
      }
    });
    if (best) setActive(best.id);
  }, { threshold: [0.4, 0.6, 0.8], rootMargin: '0px 0px -30% 0px' });

  links.forEach(link => {
    const id = link.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) io.observe(el);

    link.addEventListener('click', () => setActive(id));
  });
})();



// Typewriter implementation for cross-browser support
function initTypewriter() {
  const target = document.querySelector('.type-target');
  if (!target) return;

  let words = [];
  try {
    const data = target.getAttribute('data-words');
    if (data) words = JSON.parse(data);
  } catch (e) {}
  if (!Array.isArray(words) || words.length === 0) {
    words = ['Web Developer.', 'Student.', 'Competitive Programmer.'];
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    target.textContent = words[0];
    target.style.borderRight = 'none';
    return;
  }

  let wordIndex = 0;
  let charIndex = 0;
  let state = 'typing'; // 'typing', 'holding', 'deleting', 'pausing'
  let lastUpdate = 0;
  let caretVisible = true;
  let lastBlink = 0;
  const typeDelay = 90;
  const deleteDelay = 60;
  const holdDelay = 1100;
  const pauseDelay = 300;
  const blinkDelay = 500;

  // Add caret style
  target.style.borderRight = '2px solid var(--main-color)';
  target.style.paddingRight = '2px';

  const animate = (timestamp) => {
    if (lastUpdate === 0) lastUpdate = timestamp;

    const delta = timestamp - lastUpdate;
    const blinkDelta = timestamp - lastBlink;

    // Handle caret blinking
    if (blinkDelta >= blinkDelay) {
      caretVisible = !caretVisible;
      target.style.borderRightColor = caretVisible ? 'var(--main-color)' : 'transparent';
      lastBlink = timestamp;
    }

    const current = words[wordIndex];

    if (state === 'typing') {
      if (delta >= typeDelay) {
        charIndex = Math.min(charIndex + 1, current.length);
        target.textContent = current.slice(0, charIndex);
        lastUpdate = timestamp;
        if (charIndex === current.length) {
          state = 'holding';
          lastUpdate = timestamp;
        }
      }
    } else if (state === 'holding') {
      if (delta >= holdDelay) {
        state = 'deleting';
        lastUpdate = timestamp;
      }
    } else if (state === 'deleting') {
      if (delta >= deleteDelay) {
        charIndex = Math.max(charIndex - 1, 0);
        target.textContent = current.slice(0, charIndex);
        lastUpdate = timestamp;
        if (charIndex === 0) {
          state = 'pausing';
          lastUpdate = timestamp;
        }
      }
    } else if (state === 'pausing') {
      if (delta >= pauseDelay) {
        state = 'typing';
        wordIndex = (wordIndex + 1) % words.length;
        lastUpdate = timestamp;
      }
    }

    requestAnimationFrame(animate);
  };

  // Start
  target.textContent = '';
  requestAnimationFrame(animate);
}

// Scroll animations
function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animate')) {
        entry.target.classList.add('animate');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.Home-content, .about-content, .projects-grid, .skills-grid, .Education .heading, .timeline-items').forEach(el => observer.observe(el));
}

// Accordion for education
function initializeAccordion() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
}

// Initialize everything
function init() {
  startCountingAnimation();
  initTypewriter();
  initScrollAnimations();
  initTimelineScroll();
  initializeAccordion();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Copy code functionality for code showcase
function copyCode() {
  const codeElement = document.querySelector('.code-display code');
  if (!codeElement) return;

  const textToCopy = codeElement.textContent || codeElement.innerText;

  navigator.clipboard.writeText(textToCopy).then(() => {
    const btn = document.querySelector('.copy-btn');
    if (btn) {
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      btn.style.background = 'var(--highlight-color)';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = 'var(--main-color)';
      }, 2000);
    }
  }).catch(err => {
    console.error('Failed to copy: ', err);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      const btn = document.querySelector('.copy-btn');
      if (btn) {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.background = 'var(--highlight-color)';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = 'var(--main-color)';
        }, 2000);
      }
    } catch (fallbackErr) {
      console.error('Fallback copy failed: ', fallbackErr);
    }
    document.body.removeChild(textArea);
  });
}

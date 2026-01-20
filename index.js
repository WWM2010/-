// Simple UI script for reveal animations, mobile menu, counters and a small typewriter.
// Put this at scripts/main.js and make sure main.html includes: <script src="scripts/main.js" defer></script>

(function () {
  // Reveal elements when they enter the viewport
  const revealSelector = '.fade-in, .fade-in-left, .fade-in-right';
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve so the animation runs once
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(revealSelector).forEach((el) => {
    revealObserver.observe(el);
  });

  // Mobile menu open/close
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('close-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const backdrop = document.getElementById('mobile-menu-backdrop');

  function openMenu() {
    if (!mobileMenu || !backdrop) return;
    mobileMenu.classList.add('open');
    backdrop.classList.add('open');
    menuBtn && menuBtn.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    if (!mobileMenu || !backdrop) return;
    mobileMenu.classList.remove('open');
    backdrop.classList.remove('open');
    menuBtn && menuBtn.setAttribute('aria-expanded', 'false');
  }

  menuBtn && menuBtn.addEventListener('click', openMenu);
  closeBtn && closeBtn.addEventListener('click', closeMenu);
  backdrop && backdrop.addEventListener('click', closeMenu);

  // Stat counters
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    counters.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target'), 10) || 0;
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min(1, (now - start) / duration);
        const value = Math.floor(progress * target);
        el.textContent = value;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
    });
  }

  // Run counters when they come into view
  const anyStat = document.querySelector('.stat-number[data-target]');
  if (anyStat) {
    const statObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          obs.disconnect();
        }
      });
    }, { threshold: 0.2 });
    statObserver.observe(anyStat);
  }

  // Simple typewriter rotation for #typewriter
  (function typewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;
    const words = ['Student.', 'Developer.', 'AI enthusiast.', 'Problem solver.'];
    let w = 0, i = 0, deleting = false;
    const speed = 70;
    function loop() {
      const current = words[w];
      if (!deleting) {
        el.textContent = current.slice(0, i + 1);
        i++;
        if (i === current.length) {
          deleting = true;
          setTimeout(loop, 900);
          return;
        }
      } else {
        el.textContent = current.slice(0, i - 1);
        i--;
        if (i === 0) {
          deleting = false;
          w = (w + 1) % words.length;
        }
      }
      setTimeout(loop, deleting ? Math.round(speed / 1.2) : speed);
    }
    loop();
  })();

  // Accessibility: Escape closes menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Fallback: if any reveal elements are already in-view on load, mark visible
  window.addEventListener('load', () => {
    document.querySelectorAll(revealSelector).forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) el.classList.add('visible');
    });
  });
})();

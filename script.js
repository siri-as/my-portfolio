(function () {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  const yearEl = document.getElementById('year');

  // Dynamic year
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Ensure all images lazy-load (adds if missing)
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
    if (!img.hasAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }
  });

  // Mobile nav toggle
  if (toggle && navList) {
    toggle.addEventListener('click', () => {
      const open = navList.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close menu with Escape
        document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navList.classList.contains('open')) {
        navList.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // Smooth scroll with header offset
  function getHeaderOffset() {
    return header ? header.getBoundingClientRect().height : 0;
  }

  function smoothScrollTo(hash) {
    const target = document.querySelector(hash);
    if (!target) return;

    const top = window.scrollY + target.getBoundingClientRect().top - getHeaderOffset() - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const hash = a.getAttribute('href');
      if (!hash || hash === '#') return;

      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        smoothScrollTo(hash);
        // Close mobile menu after navigation
        if (navList && navList.classList.contains('open')) {
          navList.classList.remove('open');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }
        // Update URL hash without jump
        history.pushState(null, '', hash);
      }
    });
  });

  // Highlight active section link
  const sectionIds = Array.from(document.querySelectorAll('main section[id]')).map(s => s.id);
  const linksById = new Map(
    sectionIds.map(id => [id, document.querySelector(`.nav-list a[href="#${id}"]`)])
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = linksById.get(id);
      if (!link) return;
      if (entry.isIntersecting) {
        // Clear previous active
        document.querySelectorAll('.nav-list a[aria-current="page"]').forEach(el => {
          el.removeAttribute('aria-current');
        });
        link.setAttribute('aria-current', 'page');
      }
      });
  }, {
    root: null,
    rootMargin: `-${Math.max(getHeaderOffset(), 56)}px 0px -60% 0px`,
    threshold: 0.1
  });

  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  // Optional: add subtle header shadow when scrolled
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY || 0;
    if (header) {
      if (y > 2 && lastY <= 2) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
      } else if (y <= 2 && lastY > 2) {
        header.style.boxShadow = 'none';
      }
    }
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
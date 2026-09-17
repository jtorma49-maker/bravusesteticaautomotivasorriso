document.addEventListener("DOMContentLoaded", function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- REVEAL AO ROLAR (seções + itens com stagger) ---------- */
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0 // dispara assim que qualquer parte entra na tela — evita travar seções longas (muitos cards) no celular
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target); // anima uma vez só, economiza processamento
      }
    });
  }, observerOptions);

  // Seções principais (comportamento original)
  document.querySelectorAll('.reveal').forEach(section => observer.observe(section));

  // Itens individuais com efeito cascata (stagger)
  function setupStagger(selector, groupSelector, step) {
    document.querySelectorAll(groupSelector).forEach(group => {
      const items = group.querySelectorAll(selector);
      items.forEach((item, i) => {
        item.classList.add('reveal-item');
        if (!prefersReducedMotion) {
          item.style.transitionDelay = `${i * step}ms`;
        }
        observer.observe(item);
      });
    });
  }

  setupStagger('.service-card', '.service-cards', 90);
  setupStagger('.gallery-item', '.gallery-grid', 70);
  setupStagger('.contact-item', '.contact-info', 90);

  /* ---------- HERO: entrada suave ao carregar (não depende de scroll) ---------- */
  const heroEls = document.querySelectorAll('.hero .eyebrow, .hero h1, .hero p, .hero-cta');
  heroEls.forEach((el, i) => {
    el.classList.add('hero-in');
    if (!prefersReducedMotion) {
      el.style.transitionDelay = `${150 + i * 110}ms`;
    }
  });
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      heroEls.forEach(el => el.classList.add('active'));
    });
  });

  /* ---------- HEADER: reduz e escurece ao rolar ---------- */
  const header = document.querySelector('header');
  if (header) {
    let ticking = false;
    const updateHeader = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
    updateHeader();
  }
});

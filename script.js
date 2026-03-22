/* ============================================================
   SAMEER SHUKLA — GSoC PORTFOLIO
   script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── CUSTOM CURSOR (desktop only) ── */
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  let mx=0, my=0, rx=0, ry=0;

  if (window.matchMedia('(pointer: fine)').matches && cursor && ring) {
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });
    (function animateRing() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(animateRing);
    })();
    document.querySelectorAll('a, button, .cert-card, .project-card').forEach(el => {
      el.addEventListener('mouseenter', () => { ring.style.width = '48px'; ring.style.height = '48px'; });
      el.addEventListener('mouseleave', () => { ring.style.width = '36px'; ring.style.height = '36px'; });
    });
  }

  /* ── HAMBURGER MENU ── */
  const navToggle = document.getElementById('navToggle');
  const navDrawer = document.getElementById('navDrawer');

  if (navToggle && navDrawer) {
    navToggle.addEventListener('click', () => {
      const isOpen = navDrawer.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', e => {
      if (!navToggle.contains(e.target) && !navDrawer.contains(e.target)) {
        closeDrawer();
      }
    });
  }

  /* ── CLOSE DRAWER ── */
  window.closeDrawer = function () {
    if (!navDrawer || !navToggle) return;
    navDrawer.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  /* ── SCROLL REVEAL ── */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.01 });

    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('hidden');
      io.observe(el);
    });
  }
  /* Fallback — show all after 800ms no matter what */
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }, 800);

  /* ── STAGGER CARD DELAYS ── */
  document.querySelectorAll('.project-card').forEach((c, i) => {
    c.style.transitionDelay = `${i * 0.07}s`;
  });
  document.querySelectorAll('.cert-card').forEach((c, i) => {
    c.style.transitionDelay = `${i * 0.05}s`;
  });

  /* ── ACTIVE NAV HIGHLIGHT ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });

  /* ── CERT MODAL ── */
  const certModalOverlay = document.getElementById('certModalOverlay');
  const certModal        = certModalOverlay ? certModalOverlay.querySelector('.cert-modal') : null;
  const certModalTitle   = document.getElementById('certModalTitle');
  const certModalId      = document.getElementById('certModalId');
  const certModalFrame   = document.getElementById('certModalFrame');
  const certDlBtn        = document.getElementById('certDlBtn');
  let certLastFocused    = null;

  window.openCert = function (file, title, id) {
    if (!certModalOverlay) return;
    certLastFocused = document.activeElement;
    certModalTitle.textContent = title.toUpperCase();
    certModalId.textContent    = id;
    certModalFrame.src         = file;
    certDlBtn.href             = file;
    certDlBtn.setAttribute('download', file);
    certModalOverlay.classList.add('active');
    certModalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    /* Focus first focusable element in modal */
    const focusable = certModal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();
  };

  window.closeCert = function () {
    if (!certModalOverlay) return;
    certModalOverlay.classList.remove('active');
    certModalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { certModalFrame.src = ''; }, 320);
    if (certLastFocused) certLastFocused.focus();
  };

  window.closeCertOnOverlay = function (e) {
    if (e.target === certModalOverlay) window.closeCert();
  };

  /* Keyboard: Escape closes modal, Tab traps focus */
  document.addEventListener('keydown', e => {
    if (!certModalOverlay || !certModalOverlay.classList.contains('active')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      window.closeCert();
      return;
    }
    if (e.key === 'Tab' && certModal) {
      const focusable = certModal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  });

}); // end DOMContentLoaded

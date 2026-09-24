/**
 * Tactical Portfolio Engine (Personality, Cursor & Interaction Engine)
 * Author: Liyan Nechikaden
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Tactical Reticle Custom Cursor (GPU Accelerated, 1:1 Synchronized)
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (cursor && cursorDot && isFinePointer && !prefersReducedMotion) {
    let mouseX = -100, mouseY = -100;
    let cursorX = -100, cursorY = -100;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Immediate 1:1 response for center dot (zero input lag)
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    const animateCursor = () => {
      // Smooth spring follow for outer tactical reticle bracket
      cursorX += (mouseX - cursorX) * 0.35;
      cursorY += (mouseY - cursorY) * 0.35;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);

    // Hide/show custom cursor when leaving/entering browser window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorDot.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      cursorDot.style.opacity = '1';
    });

    // Event Delegation for hover target activation across all current and future interactive elements
    document.addEventListener('mouseover', (e) => {
      const isInteractive = e.target.closest('a, button, input, textarea, select, label, [role="button"], .project-card, .skill-card, .timeline-content, .social-icon-btn, .nav-brand');
      if (isInteractive) {
        document.body.classList.add('cursor-hover');
      } else {
        document.body.classList.remove('cursor-hover');
      }
    });
  }

  // 2. Rotating Witty Status Messages
  const statusRotator = document.querySelector('.status-message-text');
  if (statusRotator) {
    const statusLines = [
      'Available for Cool Projects & Technical Roles',
      'Status: 200 OK — 47 Browser Tabs Open',
      'Building Digital Products That Actually Ship',
      'Current State: Caffeinated & Debugging',
      'Searching for the Missing Semicolon'
    ];
    let currentIndex = 0;

    setInterval(() => {
      currentIndex = (currentIndex + 1) % statusLines.length;
      statusRotator.style.opacity = '0';
      setTimeout(() => {
        statusRotator.textContent = statusLines[currentIndex];
        statusRotator.style.opacity = '1';
      }, 300);
    }, 4500);
  }

  // 3. Email Copy-to-Clipboard Action with Personality
  const copyBtns = document.querySelectorAll('.js-copy-email');
  const toast = document.getElementById('toast-notification');
  const emailResponses = [
    'lnk.liyannk@gmail.com copied! Now go send that email. ✉️',
    'Email copied to clipboard! No spam please. ☕',
    'Copied! Ready to talk code or coffee. 🚀'
  ];

  copyBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'lnk.liyannk@gmail.com';
      const randomResponse = emailResponses[Math.floor(Math.random() * emailResponses.length)];
      
      navigator.clipboard.writeText(email).then(() => {
        showToast(randomResponse);
      }).catch(() => {
        showToast('Email: lnk.liyannk@gmail.com');
      });
    });
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  // 4. Secret Bat-Signal / Diagnostic Easter Egg on Brand Click
  const brandLogo = document.querySelector('.nav-brand');
  if (brandLogo) {
    brandLogo.addEventListener('click', (e) => {
      if (window.scrollY < 100) {
        showToast('[ SYSTEM DIAGNOSTIC // 0 ERRORS FOUND. CAFFEINE LEVEL: 98% ⚡ ]');
      }
    });
  }

  // 5. Mobile Navigation Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('bi-list');
        icon.classList.toggle('bi-x');
      }
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('bi-list');
          icon.classList.remove('bi-x');
        }
      });
    });
  }

  // 6. Scroll Active Link Highlighting (Edge Detection & Smooth Highlighting)
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    const scrollY = window.scrollY;
    const isAtBottom = (window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 60);

    if (isAtBottom) {
      navItems.forEach((item) => {
        item.classList.remove('active');
        if (item.getAttribute('href') === '#contact') {
          item.classList.add('active');
        }
      });
      return;
    }

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 150;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navItems.forEach((item) => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav);
  highlightNav();

  // 7. Scroll Reveal Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.timeline-item, .project-card, .info-block, .contact-card').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    revealObserver.observe(el);
  });

  document.addEventListener('scroll', () => {
    document.querySelectorAll('.timeline-item, .project-card, .info-block, .contact-card').forEach((el) => {
      if (el.classList.contains('revealed')) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  });
});
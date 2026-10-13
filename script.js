/**
 * JAIVARSHAN PORTFOLIO - JAVASCRIPT
 * Pure Vanilla JavaScript (ES6+)
 * Lightweight, Performant, Zero Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- Element References ---
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const copyBtn = document.getElementById('copy-email-btn');
  const copyText = document.getElementById('copy-text');
  const toast = document.getElementById('toast');

  // ==========================================================================
  // 1. STICKY HEADER & SCROLL BEHAVIOR
  // ==========================================================================
  const handleScrollHeader = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScrollHeader, { passive: true });
  handleScrollHeader(); // Initial check

  // ==========================================================================
  // 2. MOBILE NAVIGATION DRAWER
  // ==========================================================================
  const toggleMobileMenu = (forceClose = false) => {
    const isOpen = forceClose ? false : !navMenu.classList.contains('open');

    if (isOpen) {
      navMenu.classList.add('open');
      mobileToggle.classList.add('active');
      mobileToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      navMenu.classList.remove('open');
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Close menu when clicking on any navigation link
    const allMenuLinks = navMenu.querySelectorAll('a');
    allMenuLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggleMobileMenu(true);
      });
    });

    // Close menu when clicking outside of navMenu
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        toggleMobileMenu(true);
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleMobileMenu(true);
      }
    });

    // Reset when resizing past mobile breakpoint (768px)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        toggleMobileMenu(true);
      }
    }, { passive: true });
  }

  // ==========================================================================
  // 3. ACTIVE NAVIGATION LINK ON SCROLL
  // ==========================================================================
  const highlightActiveNavLink = () => {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (matchingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          matchingLink.classList.add('active');
        } else {
          matchingLink.classList.remove('active');
        }
      }
    });
  };

  window.addEventListener('scroll', highlightActiveNavLink, { passive: true });
  highlightActiveNavLink();

  // ==========================================================================
  // 4. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // ==========================================================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    // If reduced motion or IntersectionObserver not supported, show immediately
    revealElements.forEach((el) => el.classList.add('active'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });
  }

  // ==========================================================================
  // 5. TOAST NOTIFICATION UTILITY
  // ==========================================================================
  let toastTimeout;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  };

  // ==========================================================================
  // 6. COPY EMAIL ACTION
  // ==========================================================================
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.getAttribute('data-email') || 'jaivarshan732005@gmail.com';
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback copy method
          const tempInput = document.createElement('input');
          tempInput.value = email;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        if (copyText) {
          const originalText = copyText.textContent;
          copyText.textContent = 'Copied!';
          copyBtn.classList.add('btn-accent');
          showToast(`Copied ${email} to clipboard!`);

          setTimeout(() => {
            copyText.textContent = originalText;
            copyBtn.classList.remove('btn-accent');
          }, 2200);
        }
      } catch (err) {
        showToast(`Email: ${email}`);
      }
    });
  }

  // ==========================================================================
  // 7. SMOOTH SCROLLING FOR INTERNAL LINKS (Cross-browser fallback)
  // ==========================================================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });

        // Set focus to the section for keyboard accessibility
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
      }
    });
  });

  // ==========================================================================
  // 8. IMAGE FALLBACK HANDLER (Prevent broken layouts)
  // ==========================================================================
  const allImages = document.querySelectorAll('img');
  allImages.forEach((img) => {
    img.addEventListener('error', function () {
      this.style.display = 'none';
      if (this.classList.contains('profile-img')) {
        const fallbackBox = document.createElement('div');
        fallbackBox.className = 'profile-fallback';
        fallbackBox.setAttribute('role', 'img');
        fallbackBox.setAttribute('aria-label', this.alt || 'Jaivarshan B');
        fallbackBox.innerHTML = `
          <div class="fallback-monogram">JV</div>
          <span class="fallback-caption">Jaivarshan B</span>
        `;
        if (this.parentNode) {
          this.parentNode.appendChild(fallbackBox);
        }
        return;
      }
      const fallbackBox = document.createElement('div');
      fallbackBox.style.width = '100%';
      fallbackBox.style.height = '100%';
      fallbackBox.style.minHeight = '200px';
      fallbackBox.style.display = 'flex';
      fallbackBox.style.alignItems = 'center';
      fallbackBox.style.justifyContent = 'center';
      fallbackBox.style.backgroundColor = '#131c2e';
      fallbackBox.style.color = '#818cf8';
      fallbackBox.style.fontFamily = 'monospace';
      fallbackBox.style.fontSize = '0.85rem';
      fallbackBox.style.border = '1px dashed rgba(99, 102, 241, 0.4)';
      fallbackBox.style.borderRadius = '8px';
      fallbackBox.textContent = `[${this.alt || 'Image Preview'}]`;
      if (this.parentNode) {
        this.parentNode.appendChild(fallbackBox);
      }
    });
  });
});

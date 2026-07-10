/**
 * script.js — Hà Nội: Nghìn Năm Văn Hiến
 * Main JavaScript: AOS init, navbar scroll behavior,
 * mobile menu toggle, and smooth interaction enhancements.
 */
'use strict';
/* =====================================================
   1. AOS — Animate On Scroll (elegant parameters)
===================================================== */
document.addEventListener('DOMContentLoaded', function () {
  AOS.init({
    duration:   1200,               // ms per animation
    easing:     'ease-in-out',      // cubic-bezier smoothness
    once:       true,               // animate only on first scroll into view
    offset:     80,                 // px from viewport edge to trigger
    delay:      0,                  // global base delay (individual overrides via data-aos-delay)
    mirror:     false,              // don't re-animate when scrolling back
    anchorPlacement: 'top-bottom',  // trigger when element top hits viewport bottom
  });
  /* ===================================================
     2. NAVBAR — Scroll-dependent glass opacity
  ==================================================== */
  const navbar = document.getElementById('navbar');
  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run once on load
  /* ===================================================
     3. MOBILE MENU TOGGLE
  ==================================================== */
  const menuToggle   = document.getElementById('menu-toggle');
  const mobileMenu   = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', !isHidden);
      menuToggle.setAttribute('aria-expanded', String(isHidden));
    });
  }
  /* ===================================================
     4. SMOOTH SCROLL — Nav anchor links
  ==================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId  = this.getAttribute('href');
      const target    = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 0;
      const top       = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
  /* ===================================================
     5. LANDMARK CARDS — Keyboard accessibility
     (allow Enter/Space to toggle hover state on touch)
  ==================================================== */
  document.querySelectorAll('.landmark-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('force-hover');
      }
    });
  });
  /* ===================================================
     6. PARALLAX — Subtle hero depth effect on mouse move
  ==================================================== */
  const heroSection = document.getElementById('hero');
  if (heroSection && window.innerWidth > 1024) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect   = heroSection.getBoundingClientRect();
      const centerX = rect.width  / 2;
      const centerY = rect.height / 2;
      const dx     = (e.clientX - rect.left - centerX) / centerX;
      const dy     = (e.clientY - rect.top  - centerY) / centerY;
      const orb1 = heroSection.querySelector('.orb-1');
      const orb2 = heroSection.querySelector('.orb-2');
      if (orb1) orb1.style.transform = `translate(${dx * -20}px, ${dy * -15}px)`;
      if (orb2) orb2.style.transform = `translate(${dx * 15}px, ${dy * 20}px)`;
    });
    heroSection.addEventListener('mouseleave', () => {
      const orb1 = heroSection.querySelector('.orb-1');
      const orb2 = heroSection.querySelector('.orb-2');
      if (orb1) orb1.style.transform = '';
      if (orb2) orb2.style.transform = '';
    });
  }
  /* ===================================================
     7. SCROLL PROGRESS — Optional thin top bar
  ==================================================== */
  const progressBar = document.createElement('div');
  progressBar.id    = 'scroll-progress';
  Object.assign(progressBar.style, {
    position:   'fixed',
    top:        '0',
    left:       '0',
    width:      '0%',
    height:     '3px',
    background: 'linear-gradient(90deg, #0F4C43, #E3A857, #0F4C43)',
    backgroundSize: '200% 100%',
    zIndex:     '9999',
    transition: 'width 0.1s linear',
    animation:  'shimmer 3s linear infinite',
  });
  document.body.prepend(progressBar);
  const updateProgress = () => {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPct    = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = scrollPct.toFixed(1) + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  /* ===================================================
     8. SECTION ACTIVE LINK HIGHLIGHTING
  ==================================================== */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  const observerOpts = {
    root:       null,
    rootMargin: '-40% 0px -40% 0px',
    threshold:  0,
  };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.style.color = isActive ? '#E3A857' : '';
        });
      }
    });
  }, observerOpts);
  sections.forEach(section => sectionObserver.observe(section));
  /* ===================================================
     9. ERA IMAGE — Reveal on hover (subtle lift)
  ==================================================== */
  document.querySelectorAll('.era-image-frame').forEach(frame => {
    frame.addEventListener('mouseenter', () => {
      frame.style.transform  = 'translateY(-6px) scale(1.01)';
      frame.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
      frame.style.boxShadow  = '0 30px 60px rgba(0,0,0,0.25)';
    });
    frame.addEventListener('mouseleave', () => {
      frame.style.transform = '';
      frame.style.boxShadow = '';
  });
  /* ===================================================
     10. ACCORDION INTERACTION
  ==================================================== */
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Allow clicking inside the open body without collapsing it, 
      // but clicking the trigger or anywhere else on the card toggles it.
      if (e.target.closest('.accordion-collapse')) return;
      
      const isOpen = item.classList.contains('open');
      
      // Close all items
      accordionItems.forEach(acc => {
        acc.classList.remove('open');
        const trigger = acc.querySelector('.accordion-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
      
      // Open the clicked item if it wasn't already open
      if (!isOpen) {
        item.classList.add('open');
        const trigger = item.querySelector('.accordion-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
  /* ===================================================
     11. AOS REFRESH on window resize (debounced)
  ==================================================== */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      AOS.refresh();
    }, 200);
  });
}); // end DOMContentLoaded
/* =====================================================
   GLOBAL HELPER — Close mobile menu (used in HTML onclick)
===================================================== */
function closeMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) {
    mobileMenu.classList.add('hidden');
    const toggle = document.getElementById('menu-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }
}
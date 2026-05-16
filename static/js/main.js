// =============================================
// MUTHU GROUPS — Main JavaScript
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initFadeIn();
  initTabs();
  setActiveNav();
  initContactForm();
});

// =============================================
// CONTACT FORM HANDLING (Flask SMTP)
// =============================================
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');
  const subjectSelect = document.getElementById('subject-select');
  const hiddenSubject = document.getElementById('email-subject');

  // Update hidden subject line when selection changes
  if (subjectSelect && hiddenSubject) {
    subjectSelect.addEventListener('change', () => {
      const selectedText = subjectSelect.options[subjectSelect.selectedIndex].text;
      hiddenSubject.value = `Muthu Groups Contact Enquiry - ${selectedText}`;
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Show loading state
    submitBtn.classList.add('btn-loading');
    status.style.display = 'none';
    status.className = 'form-status';

    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    fetch('/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: json
    })
      .then(async (response) => {
        let res = await response.json();
        if (res.success) {
          status.innerHTML = "Thank you! Your message has been sent successfully. ✨";
          status.classList.add('success');
          form.reset();
        } else {
          console.log(response);
          status.innerHTML = res.message || "Something went wrong. Please try again.";
          status.classList.add('error');
        }
      })
      .catch(error => {
        console.log(error);
        status.innerHTML = "Network error. Please check your connection and try again.";
        status.classList.add('error');
      })
      .finally(() => {
        submitBtn.classList.remove('btn-loading');
        status.style.display = 'block';
        
        // Hide message after 5 seconds if success
        if (status.classList.contains('success')) {
          setTimeout(() => {
            status.style.display = 'none';
          }, 6000);
        }
      });
  });
}


// =============================================
// NAVBAR — sticky scroll behavior
// =============================================
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// =============================================
// HAMBURGER MENU
// =============================================
function initHamburger() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// =============================================
// FADE-IN ANIMATION (Intersection Observer)
// =============================================
function initFadeIn() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stagger children if applicable
        const staggered = entry.target.querySelectorAll('.stagger-child');
        staggered.forEach((child, i) => {
          child.style.transitionDelay = `${i * 0.1}s`;
          child.classList.add('visible');
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

// =============================================
// PRODUCT TABS
// =============================================
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const panel = document.getElementById(target);
      if (panel) {
        panel.classList.add('active');
        // Re-trigger fade-in for newly visible elements
        panel.querySelectorAll('.fade-in').forEach(el => {
          el.classList.remove('visible');
          setTimeout(() => el.classList.add('visible'), 50);
        });
      }
    });
  });
}

// =============================================
// SET ACTIVE NAV LINK
// =============================================
function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.navbar__links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path) {
      link.classList.add('active');
    }
  });
}

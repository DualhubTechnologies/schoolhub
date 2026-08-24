/* ==========================================================================
   SchoolHubUG — Shared JavaScript
   A product of DualHub Technologies
   Vanilla JS only — no dependencies.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Mobile navigation ---------- */
  var hamburger = document.querySelector('.hamburger');
  var drawer = document.querySelector('.mobile-drawer');
  if (hamburger && drawer) {
    hamburger.addEventListener('click', function () {
      var expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      drawer.classList.toggle('open');
      document.body.style.overflow = !expanded ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.setAttribute('aria-expanded', 'false');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScrollHeader = function () {
      header.style.boxShadow = window.scrollY > 8 ? '0 4px 20px rgba(15,42,74,0.08)' : 'none';
    };
    window.addEventListener('scroll', onScrollHeader, { passive: true });
    onScrollHeader();
  }

  /* ---------- Smooth scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id.length > 1) {
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      }
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.accordion').forEach(function (accordion) {
    var triggers = accordion.querySelectorAll('.accordion-trigger');
    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var expanded = trigger.getAttribute('aria-expanded') === 'true';
        var panel = document.getElementById(trigger.getAttribute('aria-controls'));

        // Close siblings (single-open accordion behaviour)
        triggers.forEach(function (t) {
          if (t !== trigger) {
            t.setAttribute('aria-expanded', 'false');
            var p = document.getElementById(t.getAttribute('aria-controls'));
            if (p) p.style.maxHeight = null;
          }
        });

        trigger.setAttribute('aria-expanded', String(!expanded));
        if (panel) panel.style.maxHeight = !expanded ? panel.scrollHeight + 'px' : null;
      });
    });
  });

  /* ---------- Feature / role tabs ---------- */
  document.querySelectorAll('[data-tabs]').forEach(function (tabGroup) {
    var tabs = tabGroup.querySelectorAll('.role-tab, [role="tab"]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var panelId = tab.getAttribute('aria-controls');
        tabs.forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
        tabGroup.querySelectorAll('.role-panel, [role="tabpanel"]').forEach(function (p) {
          p.classList.remove('active');
        });
        tab.setAttribute('aria-selected', 'true');
        var panel = document.getElementById(panelId);
        if (panel) panel.classList.add('active');
      });
    });
  });

  /* ---------- Pricing period toggle ---------- */
  var pricingToggle = document.querySelector('.pricing-toggle');
  if (pricingToggle) {
    var periodButtons = pricingToggle.querySelectorAll('button');
    periodButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        periodButtons.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        var period = btn.getAttribute('data-period');
        document.querySelectorAll('[data-price]').forEach(function (priceEl) {
          var value = priceEl.getAttribute('data-price-' + period);
          if (value) priceEl.textContent = value;
        });
      });
    });
  }

  /* ---------- Testimonial slider ---------- */
  var slider = document.querySelector('[data-slider]');
  if (slider) {
    var slides = slider.querySelectorAll('.testimonial-card');
    var dotsWrap = document.querySelector('[data-slider-dots]');
    var current = 0;

    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.className = 'slider-dot';
        dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
        dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
        dot.addEventListener('click', function () { showSlide(i); });
        dotsWrap.appendChild(dot);
      });
    }

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.style.display = i === current ? 'block' : 'none'; });
      if (dotsWrap) {
        dotsWrap.querySelectorAll('.slider-dot').forEach(function (d, i) {
          d.setAttribute('aria-current', i === current ? 'true' : 'false');
        });
      }
    }
    showSlide(0);

    var autoplay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? null :
      setInterval(function () { showSlide(current + 1); }, 6000);

    slider.addEventListener('mouseenter', function () { if (autoplay) clearInterval(autoplay); });
  }

  /* ---------- Show / hide password ---------- */
  document.querySelectorAll('.toggle-password').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = document.getElementById(btn.getAttribute('data-target'));
      if (!input) return;
      var isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.textContent = isPassword ? 'Hide' : 'Show';
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  });

  /* ---------- Form validation (contact + login) ---------- */
  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      form.querySelectorAll('[required]').forEach(function (input) {
        var field = input.closest('.field');
        var errorEl = field ? field.querySelector('.error-msg') : null;
        var fieldValid = true;

        if (input.type === 'checkbox') {
          fieldValid = input.checked;
        } else if (input.type === 'email') {
          fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        } else {
          fieldValid = input.value.trim().length > 0;
        }

        if (field) field.classList.toggle('has-error', !fieldValid);
        if (!fieldValid) valid = false;
      });

      if (valid) {
        form.style.display = 'none';
        var success = form.parentElement.querySelector('.form-success');
        if (success) {
          success.classList.add('show');
          success.setAttribute('tabindex', '-1');
          success.focus();
        }
        // NOTE FOR DEVELOPERS:
        // This is a static front-end demo. To actually receive submissions,
        // connect this form to a backend endpoint or form service (e.g. a
        // serverless function, PHP mailer on cPanel, or a service like
        // Formspree) and POST the form data (new FormData(form)) there.
      } else {
        var firstError = form.querySelector('.has-error input, .has-error select, .has-error textarea');
        if (firstError) firstError.focus();
      }
    });

    form.querySelectorAll('input, select, textarea').forEach(function (input) {
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field) field.classList.remove('has-error');
      });
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Animated impact counters ---------- */
  var counters = document.querySelectorAll('[data-count-to]');
  if (counters.length) {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var animateCount = function (el) {
      var target = parseFloat(el.getAttribute('data-count-to'));
      var suffixEl = el.querySelector('.suffix');
      var decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
      if (reduceMotion) {
        el.firstChild.textContent = target.toFixed(decimals);
        return;
      }
      var start = 0;
      var duration = 1400;
      var startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = start + (target - start) * eased;
        el.firstChild.textContent = value.toFixed(decimals);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
      var countIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { countIo.observe(el); });
    } else {
      counters.forEach(animateCount);
    }
  }

  /* ---------- Back to top ---------- */
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Cookie consent ---------- */
  var cookieBanner = document.querySelector('.cookie-banner');
  if (cookieBanner) {
    var CONSENT_KEY = 'schoolhubug_cookie_consent';
    var hasConsent = false;
    try { hasConsent = document.cookie.indexOf(CONSENT_KEY + '=1') !== -1; } catch (err) { hasConsent = false; }

    if (!hasConsent) {
      setTimeout(function () { cookieBanner.classList.add('show'); }, 800);
    }
    var acceptBtn = cookieBanner.querySelector('[data-cookie-accept]');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        try { document.cookie = CONSENT_KEY + '=1; max-age=' + (60 * 60 * 24 * 180) + '; path=/'; } catch (err) {}
        cookieBanner.classList.remove('show');
      });
    }
  }

  /* ---------- Timetable rail: highlight "now" row on a light interval ---------- */
  var timetableRows = document.querySelectorAll('.timetable-row[data-order]');
  if (timetableRows.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var order = 0;
    setInterval(function () {
      timetableRows.forEach(function (row) { row.classList.remove('is-now'); });
      var next = document.querySelector('.timetable-row[data-order="' + (order % timetableRows.length) + '"]');
      if (next) next.classList.add('is-now');
      order++;
    }, 4000);
  }

});

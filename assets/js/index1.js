/* ==========================================================================
   KD EDUCATION LTD — index1.js
   Behaviour for the alternative landing page only.

   SELF-CONTAINED ON PURPOSE. Loaded exclusively by index1.html; it shares no
   state, no selectors and no globals with assets/js/main.js, so the existing
   site cannot be affected by anything in here.

   Plain ES2020, no build step. Each block is an isolated IIFE so a failure in
   one feature cannot take the rest of the page down.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     1 — MOBILE NAV
     The panel is display:none below 991px until `.is-open` lands, so there is
     nothing to hide on desktop and no state to reset on resize beyond closing.
     ---------------------------------------------------------------------- */
  (function nav() {
    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    function close() {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    }

    function open() {
      menu.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
    }

    toggle.addEventListener('click', function () {
      if (menu.classList.contains('is-open')) close();
      else open();
    });

    // Any in-page jump closes the panel, otherwise it covers the target.
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a[href^="#"]')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    // Crossing back to desktop leaves `.is-open` on an element the media query
    // has already hidden — harmless now, but it would re-appear on the way
    // back down without this.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 991) close();
    });
  }());

  /* ------------------------------------------------------------------------
     2 — SCROLL REVEALS
     The stylesheet only hides `[data-reveal]` under `.js`, which is set inline
     in the head. If this file fails to load the elements stay hidden, so the
     observer is set up defensively: anything already on screen is revealed on
     the first callback, and with no IntersectionObserver everything is shown
     immediately.
     ---------------------------------------------------------------------- */
  (function reveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    function showAll() {
      Array.prototype.forEach.call(items, function (el) {
        el.classList.add('is-in');
      });
    }

    if (reduceMotion || !('IntersectionObserver' in window)) {
      showAll();
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  }());

  /* ------------------------------------------------------------------------
     3 — STAT COUNTERS
     The final value is already in the HTML and is only ever animated towards,
     so a script failure still leaves real numbers on the page — the same rule
     the main site follows.
     ---------------------------------------------------------------------- */
  (function counters() {
    var nodes = document.querySelectorAll('.number, .big-number');
    if (!nodes.length || reduceMotion || !('IntersectionObserver' in window)) return;

    // Split "6.5K+" into the number to count and whatever wraps it, so the
    // suffix survives and the decimal place is preserved.
    function parse(text) {
      var m = String(text).match(/^([^\d.]*)([\d.]+)(.*)$/);
      if (!m) return null;
      return {
        prefix: m[1],
        target: parseFloat(m[2]),
        suffix: m[3],
        decimals: (m[2].split('.')[1] || '').length
      };
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;
        io.unobserve(el);

        var parts = parse(el.textContent.trim());
        if (!parts) return;

        var start = performance.now();
        var dur = 1400;

        (function step(now) {
          var p = Math.min(1, (now - start) / dur);
          var eased = 1 - Math.pow(1 - p, 3);
          var value = (parts.target * eased).toFixed(parts.decimals);
          el.textContent = parts.prefix + value + parts.suffix;
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = parts.prefix + parts.target.toFixed(parts.decimals) + parts.suffix;
        }(start));
      });
    }, { threshold: 0.6 });

    Array.prototype.forEach.call(nodes, function (n) { io.observe(n); });
  }());

  /* ------------------------------------------------------------------------
     4 — SERVICES SLIDER
     One card at a time, centred, with the neighbours spilling out of a mask
     that is deliberately narrower than the track and does not clip.

     Looping is done with clones rather than modulo arithmetic: a real slide
     is copied to each end, so moving off either edge still animates into a
     card instead of rewinding the whole track. The moment that transition
     lands on a clone, the transform is re-pointed at the genuine slide with
     transitions off, which is invisible because both render identically.
     ---------------------------------------------------------------------- */
  (function servicesSlider() {
    var track = document.querySelector('[data-svc-track]');
    if (!track) return;

    var prevBtn = document.querySelector('[data-svc-prev]');
    var nextBtn = document.querySelector('[data-svc-next]');
    var real = Array.prototype.slice.call(track.children);
    if (real.length < 2) return;

    // Clone the ends
    var head = real[0].cloneNode(true);
    var tail = real[real.length - 1].cloneNode(true);
    head.setAttribute('aria-hidden', 'true');
    tail.setAttribute('aria-hidden', 'true');
    track.appendChild(head);
    track.insertBefore(tail, real[0]);

    var slides = Array.prototype.slice.call(track.children);
    var index = 1;                // first real slide
    var animating = false;

    function place(withTransition) {
      track.classList.toggle('is-jumping', !withTransition);
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === index); });

      if (!withTransition) {
        // force a reflow so the class removal below cannot be batched with it
        void track.offsetWidth;
        track.classList.remove('is-jumping');
      }
    }

    function go(step) {
      if (animating) return;
      animating = true;
      index += step;
      place(true);
    }

    track.addEventListener('transitionend', function (e) {
      if (e.target !== track || e.propertyName !== 'transform') return;
      animating = false;

      // Landed on a clone — re-point at the real slide, silently
      if (index === 0) { index = slides.length - 2; place(false); }
      else if (index === slides.length - 1) { index = 1; place(false); }
    });

    if (prevBtn) prevBtn.addEventListener('click', function () { stopAuto(); go(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { stopAuto(); go(1); });

    // ---- drag / swipe ---------------------------------------------------
    var startX = 0, dragging = false;

    track.addEventListener('pointerdown', function (e) {
      if (animating) return;
      dragging = true;
      startX = e.clientX;
    });

    track.addEventListener('pointerup', function (e) {
      if (!dragging) return;
      dragging = false;
      var dx = e.clientX - startX;
      if (Math.abs(dx) < 40) return;
      stopAuto();
      go(dx < 0 ? 1 : -1);
    });

    track.addEventListener('pointercancel', function () { dragging = false; });

    // Keyboard, for anyone tabbing the arrows
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { stopAuto(); go(-1); }
      if (e.key === 'ArrowRight') { stopAuto(); go(1); }
    });

    // ---- autoplay --------------------------------------------------------
    // The reference advances exactly once and then hands over (autoplay with
    // a limit of 1). Its delay is 10ms, which in practice just means the page
    // arrives already showing slide 2; a visible beat reads as a deliberate
    // hint that the row moves, which is the point of a one-shot autoplay.
    var autoTimer = null;
    function stopAuto() { if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; } }

    if (!reduceMotion) {
      autoTimer = window.setTimeout(function () { go(1); autoTimer = null; }, 2200);
    }

    place(false);
  }());

  /* ------------------------------------------------------------------------
     5 — NEWSLETTER
     Placeholder only — there is no endpoint wired up on this page any more
     than there is on index.html. It validates, acknowledges, and stops.
     ---------------------------------------------------------------------- */
  (function forms() {
    document.querySelectorAll('[data-form]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var input = form.querySelector('input[required]');
        if (input && !input.checkValidity()) {
          input.focus();
          return;
        }

        var btn = form.querySelector('[type="submit"]');
        if (btn) {
          var original = btn.textContent;
          btn.textContent = 'Thank you';
          btn.disabled = true;
          window.setTimeout(function () {
            btn.textContent = original;
            btn.disabled = false;
            form.reset();
          }, 2400);
        }
      });
    });
  }());

}());

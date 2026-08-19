/* ==========================================================================
   KD EDUCATION LTD — index2.js
   Behaviour for the second alternative landing page only.

   SELF-CONTAINED ON PURPOSE. Loaded exclusively by index2.html. It shares no
   state, no selectors and no globals with main.js or index1.js, so neither of
   the other two pages can be affected by anything in here.

   Plain ES2020, no build step, no jQuery. The template this follows needs
   twelve scripts to do roughly this much; each block below is an isolated
   IIFE so a failure in one feature cannot take the rest of the page down.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     1 — STICKY NAVIGATION (desktop only)

     The bar sits under the banner in normal flow. Once the banner has
     scrolled past it switches to fixed, and a spacer of the bar's own height
     takes its place in the flow at the same instant — without that the page
     jumps by the full bar height the moment it detaches.

     Below 992px none of this runs: the stylesheet pins the bar from the first
     frame, because on a phone the banner is most of the screen and a bar that
     only arrives after scrolling past it would leave the reader with no
     navigation for the entire first screen.
     ---------------------------------------------------------------------- */
  (function stickyNav() {
    var wrap = document.getElementById('navwrap');
    var nav = wrap && wrap.querySelector('.nav');
    var banner = document.querySelector('.banner');
    if (!wrap || !nav || !banner) return;

    var mobile = window.matchMedia('(max-width: 991px)');
    var pinned = false;
    var ticking = false;

    function pin() {
      if (pinned) return;
      wrap.style.height = nav.offsetHeight + 'px';   // spacer, before detaching
      nav.classList.add('is-pinned');
      pinned = true;
    }

    function unpin() {
      if (!pinned) return;
      nav.classList.remove('is-pinned');
      wrap.style.height = '';
      pinned = false;
    }

    function update() {
      ticking = false;
      if (mobile.matches) { unpin(); return; }
      if (window.scrollY >= banner.offsetHeight) pin();
      else unpin();
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });

    window.addEventListener('resize', function () {
      if (pinned && !mobile.matches) wrap.style.height = nav.offsetHeight + 'px';
      update();
    });

    update();
  }());

  /* ------------------------------------------------------------------------
     2 — MOBILE DRAWER

     A right-hand sheet with its own scrim. While closed it carries `inert`,
     so nothing inside is tabbable behind the scrim; while open, focus is held
     inside and Escape or a scrim tap closes it. The page locks with
     scrollbar compensation so nothing shifts underneath.
     ---------------------------------------------------------------------- */
  (function drawer() {
    var toggle = document.getElementById('nav-toggle');
    var panel = document.getElementById('nav-drawer');
    var scrim = document.getElementById('nav-scrim');
    var closeBtn = document.getElementById('nav-close');
    if (!toggle || !panel || !scrim) return;

    var mobile = window.matchMedia('(max-width: 991px)');
    var FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';
    var lastFocus = null;

    function isOpen() { return panel.classList.contains('is-open'); }

    // Only inert while it is actually an off-canvas sheet — on desktop the
    // same element holds the visible inline links.
    function syncInert() {
      if (mobile.matches && !isOpen()) {
        panel.setAttribute('inert', '');
        panel.setAttribute('aria-hidden', 'true');
      } else {
        panel.removeAttribute('inert');
        panel.setAttribute('aria-hidden', 'false');
      }
    }

    function open() {
      if (isOpen()) return;
      lastFocus = document.activeElement;

      var gap = window.innerWidth - document.documentElement.clientWidth;
      if (gap > 0) document.body.style.paddingRight = gap + 'px';
      document.documentElement.classList.add('is-locked');

      scrim.hidden = false;
      requestAnimationFrame(function () {
        scrim.classList.add('is-open');
        panel.classList.add('is-open');
      });

      // Cleared here, not via syncInert(): the `is-open` class is added inside
      // the rAF below, so syncInert() would still see the sheet as closed and
      // leave it inert — which blocks the focus move on the next line.
      panel.removeAttribute('inert');
      panel.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');

      var first = panel.querySelector(FOCUSABLE);
      if (first) first.focus();

      // Lets the bottom app bar drop out of the way of the scrim.
      document.dispatchEvent(new CustomEvent('kd:drawer', { detail: { open: true } }));
    }

    function close() {
      if (!isOpen()) return;
      panel.classList.remove('is-open');
      scrim.classList.remove('is-open');

      if (panel.contains(document.activeElement)) document.activeElement.blur();
      if (mobile.matches) {
        panel.setAttribute('inert', '');
        panel.setAttribute('aria-hidden', 'true');
      }
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');

      document.documentElement.classList.remove('is-locked');
      document.body.style.paddingRight = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();

      window.setTimeout(function () { if (!isOpen()) scrim.hidden = true; }, 400);
      document.dispatchEvent(new CustomEvent('kd:drawer', { detail: { open: false } }));
    }

    toggle.addEventListener('click', function () { isOpen() ? close() : open(); });
    if (closeBtn) closeBtn.addEventListener('click', close);
    scrim.addEventListener('click', close);

    panel.addEventListener('click', function (e) {
      if (e.target.closest('a[href^="#"]')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (!isOpen()) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;

      var items = Array.prototype.filter.call(
        panel.querySelectorAll(FOCUSABLE),
        function (el) { return el.offsetParent !== null; }
      );
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    window.addEventListener('resize', function () {
      if (!mobile.matches) close();
      syncInert();
    });

    syncInert();
  }());

  /* ------------------------------------------------------------------------
     3 — BANNER SLIDER

     Cross-fade only: the active slide is a class, nothing translates, so the
     caption cannot shift between slides and no layout is touched. Autoplay
     stops permanently on the first manual choice, and never starts at all
     under reduced motion.
     ---------------------------------------------------------------------- */
  (function banner() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('.banner__slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.banner__dot'));
    if (slides.length < 2) return;

    var index = 0;
    var timer = null;
    var DELAY = 6500;

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle('is-active', n === index); });
      dots.forEach(function (d, n) {
        d.classList.toggle('is-active', n === index);
        d.setAttribute('aria-selected', n === index ? 'true' : 'false');
      });
    }

    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() {
      if (reduceMotion || timer) return;
      timer = window.setInterval(function () { show(index + 1); }, DELAY);
    }

    dots.forEach(function (d, n) {
      d.addEventListener('click', function () { stop(); show(n); });
    });

    // Pausing on hover is what stops a slide changing under a reader who has
    // stopped to read it.
    var root = document.querySelector('.banner');
    if (root) {
      root.addEventListener('mouseenter', stop);
      root.addEventListener('mouseleave', start);
    }

    // A backgrounded tab throttles the interval; restarting cleanly on return
    // avoids a burst of queued changes.
    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : start();
    });

    show(0);
    start();
  }());

  /* ------------------------------------------------------------------------
     4 — SCROLL SPY

     Runs once PER navigation container rather than once for the whole page.
     That matters because the containers do not carry the same set of links:
     the header lists all seven sections, the bottom app bar lists five. A
     single shared pass marks by exact id, so while the reader was inside
     "About" or "Track record" the app bar had nothing lit at all. Given its
     own pass, each container resolves the nearest section IT actually offers
     and always has exactly one item current.

     Targets are also sorted by document position, not by link order. The two
     differ here — "Destinations" is listed before "Stories" in the menus but
     appears after it on the page — and the "last target above the probe" test
     is only meaningful against document order.
     ---------------------------------------------------------------------- */
  (function spy() {
    var groups = Array.prototype.slice.call(
      document.querySelectorAll('.nav__list, .appbar, [data-nav-group]')
    ).filter(function (g) { return g.querySelector('[data-nav]'); });
    if (!groups.length) return;

    var bars = groups.map(function (group) {
      var links = Array.prototype.slice.call(group.querySelectorAll('[data-nav]'));
      var seen = {};
      var targets = [];
      links.forEach(function (a) {
        var id = a.getAttribute('data-nav');
        if (!id || seen[id]) return;
        seen[id] = true;
        var el = id === '#top' ? document.body : document.querySelector(id);
        if (el) targets.push({ id: id, el: el });
      });
      targets.sort(function (a, b) {
        if (a.id === '#top') return -1;
        if (b.id === '#top') return 1;
        return a.el.getBoundingClientRect().top - b.el.getBoundingClientRect().top;
      });
      return { links: links, targets: targets, current: null };
    }).filter(function (b) { return b.targets.length; });
    if (!bars.length) return;

    function mark(bar, id) {
      if (id === bar.current) return;
      bar.current = id;
      bar.links.forEach(function (a) {
        a.classList.toggle('is-current', a.getAttribute('data-nav') === id);
      });
    }

    var ticking = false;
    function update() {
      ticking = false;
      var probe = window.scrollY + 140;
      var atEnd = window.innerHeight + window.scrollY >= document.body.scrollHeight - 8;

      bars.forEach(function (bar) {
        var best = bar.targets[0].id;
        for (var i = 0; i < bar.targets.length; i++) {
          if (bar.targets[i].id === '#top') continue;
          var top = bar.targets[i].el.getBoundingClientRect().top + window.scrollY;
          if (top <= probe) best = bar.targets[i].id;
        }
        if (window.scrollY < 140) best = '#top';
        if (atEnd) best = bar.targets[bar.targets.length - 1].id;
        mark(bar, best);
      });
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    update();
  }());

  /* ------------------------------------------------------------------------
     4b — BOTTOM APP BAR (mobile only)

     The `is-current` state is not handled here — the bar's items carry
     `data-nav`, so the scroll spy above already owns them. All this block
     does is retract the bar on the way down and bring it back on the way up,
     which is the behaviour a native bottom bar has and the reason it does not
     feel like a permanent 62px tax on a small screen.

     A 6px threshold keeps momentum jitter from flapping it, and the bar is
     forced back into view at the very bottom of the page so the contact
     action is reachable from the footer.
     ---------------------------------------------------------------------- */
  (function appbar() {
    var bar = document.getElementById('appbar');
    if (!bar) return;

    var mobile = window.matchMedia('(max-width: 991px)');
    var last = window.scrollY;
    var ticking = false;

    function update() {
      ticking = false;
      var y = window.scrollY;
      var delta = y - last;

      if (!mobile.matches || reduceMotion) { bar.classList.remove('is-down'); last = y; return; }
      if (Math.abs(delta) < 6) return;

      var atEnd = window.innerHeight + y >= document.body.scrollHeight - 8;
      bar.classList.toggle('is-down', delta > 0 && y > 260 && !atEnd);
      last = y;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });

    /* While the drawer is open the bar would sit on top of the scrim. */
    document.addEventListener('kd:drawer', function (e) {
      bar.classList.toggle('is-down', !!(e.detail && e.detail.open));
      last = window.scrollY;
    });

    mobile.addEventListener('change', function () { bar.classList.remove('is-down'); });
  }());

  /* ------------------------------------------------------------------------
     5 — REVEALS
     Applied to everything the markup has not opted out of, rather than
     tagging fifty elements by hand. The class is only ever added, so a failure
     here cannot leave content hidden — and the hidden state is gated on `.js`
     so it never applies without scripting.
     ---------------------------------------------------------------------- */
  (function reveal() {
    var groups = [
      '.head', '.feat__card', '.about__media', '.about__body',
      '.dial', '.dest__card', '.quote', '.request__inner > *', '.foot__grid > *'
    ];
    var items = [];
    groups.forEach(function (sel) {
      Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) {
        el.setAttribute('data-rise', '');
        items.push(el);
      });
    });
    if (!items.length) return;

    function showAll() { items.forEach(function (el) { el.classList.add('is-in'); }); }
    if (reduceMotion || !('IntersectionObserver' in window)) { showAll(); return; }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        // Stagger within a row without needing per-element delays in markup.
        var siblings = Array.prototype.slice.call(e.target.parentNode.children);
        var i = Math.min(siblings.indexOf(e.target), 5);
        e.target.style.transitionDelay = (i * 0.08) + 's';
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

    items.forEach(function (el) { io.observe(el); });
  }());

  /* ------------------------------------------------------------------------
     6 — TESTIMONIAL SLIDER
     Same cross-fade discipline as the banner: the active slide is a class,
     nothing translates, and autoplay stops for good on the first manual pick.
     ---------------------------------------------------------------------- */
  (function testimonials() {
    var root = document.getElementById('tst-slider');
    if (!root) return;
    var slides = Array.prototype.slice.call(root.querySelectorAll('.tst-slide'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('.tst-dot'));
    if (slides.length < 2) return;

    var index = 0, timer = null;

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle('is-active', n === index); });
      dots.forEach(function (d, n) {
        d.classList.toggle('is-active', n === index);
        d.setAttribute('aria-selected', n === index ? 'true' : 'false');
      });
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() {
      if (reduceMotion || timer) return;
      timer = window.setInterval(function () { show(index + 1); }, 7000);
    }

    dots.forEach(function (d, n) { d.addEventListener('click', function () { stop(); show(n); }); });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });

    show(0);
    start();
  }());

  /* ------------------------------------------------------------------------
     7 — TRACK RECORD BARS
     Each bar fills to its own data-bar percentage once the panel is on
     screen. Below 768px the CSS turns the bars horizontal, so the same value
     is written to width instead of height.
     ---------------------------------------------------------------------- */
  (function bars() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-bar]'));
    if (!nodes.length) return;

    var horizontal = window.matchMedia('(max-width: 767px)');

    function fill(el) {
      var pct = Math.max(0, Math.min(100, parseFloat(el.getAttribute('data-bar')) || 0));
      var f = el.querySelector('.bar__fill');
      if (!f) return;
      if (horizontal.matches) { f.style.width = pct + '%'; f.style.height = '100%'; }
      else { f.style.height = pct + '%'; f.style.width = '100%'; }
    }

    function fillAll() { nodes.forEach(fill); }

    if (reduceMotion || !('IntersectionObserver' in window)) { fillAll(); return; }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        fill(e.target);
      });
    }, { threshold: 0.35 });

    nodes.forEach(function (el) { io.observe(el); });

    // Crossing the breakpoint swaps which axis carries the value.
    var onChange = function () {
      nodes.forEach(function (el) {
        var f = el.querySelector('.bar__fill');
        if (f && (f.style.height || f.style.width)) fill(el);
      });
    };
    horizontal.addEventListener ? horizontal.addEventListener('change', onChange)
                                : horizontal.addListener(onChange);
  }());

  /* ------------------------------------------------------------------------
     8 — CONSULTATION FORM
     Placeholder only — there is no endpoint wired up here. It validates,
     says why when it will not send, acknowledges, and stops. The label is
     swapped through a dedicated span so the icon is never destroyed.
     ---------------------------------------------------------------------- */
  (function forms() {
    document.querySelectorAll('[data-form]').forEach(function (form) {
      var btn = form.querySelector('[type="submit"]');
      var label = btn && (btn.querySelector('span') || btn);
      var fields = Array.prototype.slice.call(form.querySelectorAll('[required]'));
      var note = null, busy = false;

      function say(msg, isError) {
        if (!note) {
          note = document.createElement('p');
          note.className = 'form-note';
          note.setAttribute('role', 'status');
          note.setAttribute('aria-live', 'polite');
          form.appendChild(note);
        }
        note.textContent = msg;
        note.classList.toggle('is-error', !!isError);
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (busy) return;

        var bad = fields.filter(function (f) { return !f.checkValidity(); });
        if (bad.length) {
          bad.forEach(function (f) { f.setAttribute('aria-invalid', 'true'); });
          var first = bad[0];
          say(first.value.trim()
            ? 'Check the ' + (first.type === 'email' ? 'email address' : 'highlighted field') + ' — that does not look right.'
            : 'Please fill in your name and email so we can reply.', true);
          first.focus();
          return;
        }

        fields.forEach(function (f) { f.removeAttribute('aria-invalid'); });
        if (!label) return;

        busy = true;
        var original = label.textContent;
        label.textContent = 'Thank you';
        btn.disabled = true;
        say('Request received. We will come back to you within one working day.', false);

        window.setTimeout(function () {
          label.textContent = original;
          btn.disabled = false;
          busy = false;
          form.reset();
          if (note) note.textContent = '';
        }, 2600);
      });

      fields.forEach(function (f) {
        f.addEventListener('input', function () {
          if (!f.getAttribute('aria-invalid')) return;
          f.removeAttribute('aria-invalid');
          if (note) { note.textContent = ''; note.classList.remove('is-error'); }
        });
      });
    });
  }());

  /* ------------------------------------------------------------------------
     9 — BACK TO TOP
     ---------------------------------------------------------------------- */
  (function toTop() {
    var btn = document.getElementById('totop');
    if (!btn) return;

    var ticking = false;
    function update() {
      btn.classList.toggle('is-on', window.scrollY > window.innerHeight * 0.9);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    update();
  }());

}());

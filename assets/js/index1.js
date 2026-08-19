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
     1 — MOBILE DRAWER
     A right-hand sheet with its own scrim, not the old dropdown panel.

     While closed the drawer carries `inert`, so nothing inside it is
     focusable or reachable by a screen reader behind the scrim. While open,
     focus is held inside it and Escape or a scrim tap closes it. The page
     itself is locked with `padding-right` compensation so removing the
     scrollbar cannot shift the layout underneath.
     ---------------------------------------------------------------------- */
  (function drawer() {
    var toggle = document.getElementById('nav-toggle');
    var panel = document.getElementById('nav-drawer');
    var scrim = document.getElementById('drawer-scrim');
    var closeBtn = document.getElementById('drawer-close');
    if (!toggle || !panel || !scrim) return;

    var lastFocus = null;
    var FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

    function isOpen() { return panel.classList.contains('is-open'); }

    function open() {
      if (isOpen()) return;
      lastFocus = document.activeElement;

      // Compensate for the scrollbar we are about to remove.
      var gap = window.innerWidth - document.documentElement.clientWidth;
      if (gap > 0) document.body.style.paddingRight = gap + 'px';
      document.documentElement.classList.add('is-locked');

      scrim.hidden = false;
      // next frame, so the transition has a start value to animate from
      requestAnimationFrame(function () {
        scrim.classList.add('is-open');
        panel.classList.add('is-open');
      });

      panel.removeAttribute('inert');
      panel.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');

      var first = panel.querySelector(FOCUSABLE);
      if (first) first.focus();
    }

    function close() {
      if (!isOpen()) return;
      panel.classList.remove('is-open');
      scrim.classList.remove('is-open');

      // Blur anything inside before `inert` lands, or focus is left nowhere.
      if (panel.contains(document.activeElement)) document.activeElement.blur();
      panel.setAttribute('inert', '');
      panel.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');

      document.documentElement.classList.remove('is-locked');
      document.body.style.paddingRight = '';

      if (lastFocus && lastFocus.focus) lastFocus.focus();

      window.setTimeout(function () {
        if (!isOpen()) scrim.hidden = true;
      }, 420);
    }

    toggle.addEventListener('click', function () { isOpen() ? close() : open(); });
    if (closeBtn) closeBtn.addEventListener('click', close);
    scrim.addEventListener('click', close);

    // Any in-page jump closes the sheet, otherwise it covers the target.
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
      var first = items[0];
      var last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    // Crossing up to desktop leaves the sheet open over a bar that is already
    // showing its inline links.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 991) close();
    });
  }());

  /* ------------------------------------------------------------------------
     2 — SCROLL SPY
     One pass marks the current section on every navigation surface: the
     desktop bar, the drawer and the bottom app bar all key off data-nav, so
     they can never disagree about where the reader is.

     Sections are resolved from the links themselves rather than hard-coded,
     so adding a nav item needs no change here.
     ---------------------------------------------------------------------- */
  (function spy() {
    var links = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
    if (!links.length) return;

    // Unique hrefs, paired with the element each points at.
    var seen = {};
    var targets = [];
    links.forEach(function (a) {
      var id = a.getAttribute('data-nav');
      if (!id || seen[id]) return;
      seen[id] = true;
      var el = id === '#top' ? document.body : document.querySelector(id);
      if (el) targets.push({ id: id, el: el });
    });
    if (!targets.length) return;

    var current = null;

    function mark(id) {
      if (id === current) return;
      current = id;
      links.forEach(function (a) {
        a.classList.toggle('is-current', a.getAttribute('data-nav') === id);
      });
    }

    function update() {
      // The bar is ~86px tall; probe a little below it so a section counts as
      // current once its top has passed under the bar rather than the moment
      // it enters the viewport.
      var probe = window.scrollY + 140;
      var best = targets[0].id;

      for (var i = 0; i < targets.length; i++) {
        var t = targets[i];
        if (t.id === '#top') continue;
        var top = t.el.getBoundingClientRect().top + window.scrollY;
        if (top <= probe) best = t.id;
      }

      // Within the first screen nothing has passed the probe yet.
      if (window.scrollY < 120) best = '#top';

      // The last section can be shorter than the remaining scroll, so the
      // foot of the page always resolves to the final entry.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 8) {
        best = targets[targets.length - 1].id;
      }

      mark(best);
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }());

  /* ------------------------------------------------------------------------
     3 — RETRACTING HEADER
     Desktop only. The bar leaves on the way down and comes back on the way
     up, which hands the reader the full viewport while they are reading and
     the navigation back the moment they look for it.

     Mobile is excluded in CSS rather than here: the phone layout has no
     inline links, so the toggle is the only route into the menu and taking it
     away mid-scroll would strand the reader.

     Held down near the top, while the drawer is open, and whenever focus is
     inside the bar — a keyboard user tabbing the nav must not have it slide
     out from under them.
     ---------------------------------------------------------------------- */
  (function header() {
    var bar = document.querySelector('.navbar');
    if (!bar) return;

    var last = window.scrollY;
    var THRESHOLD = 8;          // ignore sub-pixel and rubber-band jitter
    var ticking = false;

    function show() { bar.classList.remove('is-tucked'); last = window.scrollY; }

    function update() {
      var y = window.scrollY;
      var delta = y - last;
      if (Math.abs(delta) < THRESHOLD) { ticking = false; return; }

      var atTop = y < 140;
      var drawerOpen = document.documentElement.classList.contains('is-locked');
      var focusInside = bar.contains(document.activeElement);

      if (atTop || drawerOpen || focusInside) bar.classList.remove('is-tucked');
      else bar.classList.toggle('is-tucked', delta > 0);

      last = y;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });

    // Bring it back for anything that implies the reader wants it.
    bar.addEventListener('focusin', show);
    document.addEventListener('click', function (e) {
      if (e.target.closest('a[href^="#"]')) show();
    });
  }());

  /* ------------------------------------------------------------------------
     4 — BOTTOM APP BAR
     Retracts on scroll down and returns on scroll up, the way a native tab
     bar does. Held open near the top and bottom of the page, and never
     retracted while the drawer is open — the bar would slide away under a
     scrim the reader cannot scroll anyway.
     ---------------------------------------------------------------------- */
  (function appbar() {
    var bar = document.getElementById('appbar');
    if (!bar) return;

    var last = window.scrollY;
    var THRESHOLD = 8;            // ignore sub-pixel and rubber-band jitter
    var ticking = false;

    function update() {
      var y = window.scrollY;
      var delta = y - last;

      if (Math.abs(delta) < THRESHOLD) { ticking = false; return; }

      var atTop = y < 120;
      var atFoot = window.innerHeight + y >= document.body.scrollHeight - 120;
      var drawerOpen = document.documentElement.classList.contains('is-locked');

      if (atTop || atFoot || drawerOpen) bar.classList.remove('is-tucked');
      else bar.classList.toggle('is-tucked', delta > 0);

      last = y;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });

    // A tap on any entry should always leave the bar showing at its target.
    bar.addEventListener('click', function () {
      bar.classList.remove('is-tucked');
      last = window.scrollY;
    });
  }());

  /* ------------------------------------------------------------------------
     5 — REVEALS AND PARALLAX (GSAP, with a fallback)

     Two rules govern everything here, because the brief was that the design
     must not change:

       1. Only `opacity` and `transform` are ever animated. Nothing touches a
          property that participates in layout, so no element can move, resize
          or reflow anything around it.
       2. Every tween ends by adding `.is-in` and clearing its own inline
          styles. The resting state therefore comes from the stylesheet, not
          from GSAP — the finished page is byte-identical to the page with
          this block deleted.

     If GSAP or ScrollTrigger is missing, or motion is reduced, this degrades
     to the original IntersectionObserver, and past that to showing
     everything at once.
     ---------------------------------------------------------------------- */
  (function motion() {
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
    if (!items.length) return;

    function settle(el) {
      el.classList.add('is-in');
      if (window.gsap) gsap.set(el, { clearProps: 'opacity,transform,willChange' });
    }
    function showAll() { items.forEach(settle); }

    var hasGsap = !!(window.gsap && window.ScrollTrigger);

    /* ---- fallbacks ---------------------------------------------------- */
    if (reduceMotion) { showAll(); return; }

    if (!hasGsap) {
      if (!('IntersectionObserver' in window)) { showAll(); return; }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      items.forEach(function (el) { io.observe(el); });
      return;
    }

    /* ---- GSAP --------------------------------------------------------- */
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add('gsap-on');

    var EASE = 'power3.out';
    var hero = document.querySelector('.hero');
    var wide = window.matchMedia('(min-width: 768px)').matches;

    /* Page load. The hero is already on screen, so it is a timeline rather
       than a trigger — the first thing the reader sees should be settling,
       not waiting for a scroll that has not happened. */
    var heroItems = hero
      ? Array.prototype.slice.call(hero.querySelectorAll('[data-reveal]'))
      : [];

    var tl = gsap.timeline({ defaults: { ease: EASE } });

    var navbar = document.querySelector('.navbar');
    if (navbar) {
      tl.fromTo(navbar,
        { y: -18, opacity: 0 },
        { y: 0, opacity: 1, duration: .7, clearProps: 'transform,opacity' }, 0);
    }

    /* A 1.06 -> 1 settle on the photograph. Transform only, and the image is
       already `object-fit: cover` inside a clipped box, so nothing crops
       differently at rest than it does now. */
    var heroImg = document.querySelector('.hero__bg img');
    if (heroImg) {
      tl.fromTo(heroImg,
        { scale: 1.06 },
        { scale: 1, duration: 1.8, ease: 'power2.out', clearProps: 'transform' }, 0);
    }

    if (heroItems.length) {
      tl.fromTo(heroItems,
        { y: 26, opacity: 0 },
        {
          y: 0, opacity: 1, duration: .85, stagger: .09,
          onComplete: function () { heroItems.forEach(settle); }
        }, .12);
    }

    /* Everything below the fold, batched so items entering together move
       together instead of firing one stagger per element. */
    var rest = items.filter(function (el) { return heroItems.indexOf(el) === -1; });

    if (rest.length) {
      ScrollTrigger.batch(rest, {
        start: 'top 88%',
        once: true,
        batchMax: 6,
        onEnter: function (batch) {
          gsap.fromTo(batch,
            { y: 24, opacity: 0 },
            {
              y: 0, opacity: 1, duration: .8, ease: EASE, stagger: .08,
              onComplete: function () { batch.forEach(settle); }
            });
        }
      });
    }

    /* ---- parallax ------------------------------------------------------
       Purely decorative layers, all transform-only, and skipped on narrow
       screens where the scroll is short and the gain is not worth the work.
       `scrub` ties them to scroll position rather than time, so they track
       the reader in both directions instead of replaying.
       ------------------------------------------------------------------ */
    if (!wide) { ScrollTrigger.refresh(); return; }

    function drift(el, from, to, trigger) {
      if (!el) return;
      gsap.fromTo(el, { yPercent: from }, {
        yPercent: to,
        ease: 'none',
        scrollTrigger: {
          trigger: trigger || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: .6
        }
      });
    }

    // NOT the hero photograph. It is `object-fit: cover` at exactly 100%
    // height inside a clipped box, so it has no headroom to move within —
    // drifting it down opened a ~56px band of empty section above the image.
    // Giving it headroom would mean scaling it up, which changes the crop at
    // rest. The load-time settle above is safe because it ENDS at scale 1;
    // a scrub would leave it displaced at every scroll position.

    // The banner's photo columns, each at a slightly different rate — the
    // outer pair furthest, the centre card barely moving, which is what
    // gives the field depth without anything visibly sliding. Kept small,
    // and the section clips, so a column can never ride up into the section
    // above it.
    var bnrCols = document.querySelectorAll('.bnr__field > *');
    if (bnrCols.length) {
      var rates = [-2.4, -1.6, -0.9, -0.35, -0.9, -1.6, -2.4];
      Array.prototype.forEach.call(bnrCols, function (col, i) {
        drift(col, 0, rates[i] || -1, document.querySelector('.bnr'));
      });
    }

    drift(document.querySelector('.vmove__map-img'), 2, -2, document.querySelector('#visa'));
    drift(document.querySelector('.about__swoosh'), 3, -3, document.querySelector('.about'));

    // The footer wordmark slides horizontally, the one place a lateral drift
    // reads as intentional because the mark already runs off both edges.
    var wm = document.querySelector('.footer__watermark');
    // Centred on the -50% the stylesheet already applies, so the mark never
    // sits more than 1% either side of where it renders now.
    if (wm) {
      gsap.fromTo(wm, { xPercent: -51 }, {
        xPercent: -49,
        ease: 'none',
        scrollTrigger: {
          trigger: document.querySelector('.footer'),
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: .8
        }
      });
    }

    // Layout settles after fonts and lazy images land; without this the
    // triggers keep the positions they were measured at on first paint.
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }

    /* Safety net.

       The batches are `once: true`, so a tween that gets interrupted never
       gets a second chance — and an interrupted tween leaves inline opacity
       part-way. Backgrounding the tab mid-flight is the realistic way that
       happens: the ticker stops, the tween never completes, its onComplete
       never runs, and the element is stranded translucent forever.

       Nothing here is allowed to rest at half opacity, so anything that has
       already scrolled into view and is not currently tweening gets settled
       outright. Idempotent — settle() only ever adds a class and clears
       inline styles. */
    function sweep() {
      items.forEach(function (el) {
        if (el.getBoundingClientRect().top > window.innerHeight) return;
        if (gsap.isTweening(el)) return;
        if (el.classList.contains('is-in') && !el.getAttribute('style')) return;
        settle(el);
      });
    }

    window.addEventListener('load', function () { setTimeout(sweep, 1400); });
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) setTimeout(sweep, 400);
    });
  }());

  /* ------------------------------------------------------------------------
     6 — STAT COUNTERS
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
     7 — SERVICES SLIDER
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
     8 — NEWSLETTER
     Placeholder only — there is no endpoint wired up on this page any more
     than there is on index.html. It validates, acknowledges, and stops.

     The label is swapped through a dedicated <span>, never through the
     button's own textContent. Reading textContent and writing it back looks
     harmless but replaces every child, so the send icon was destroyed on the
     first submit and never came back.

     A failed validation now says why, in a live region, instead of silently
     moving focus.
     ---------------------------------------------------------------------- */
  (function forms() {
    document.querySelectorAll('[data-form]').forEach(function (form) {
      var input = form.querySelector('input[required]');
      var btn = form.querySelector('[type="submit"]');
      var label = btn && (btn.querySelector('span') || btn);
      var busy = false;

      // One live region per form, created lazily so the markup stays clean.
      var note = null;
      function say(message, isError) {
        if (!note) {
          note = document.createElement('p');
          note.className = 'form-note';
          note.setAttribute('role', 'status');
          note.setAttribute('aria-live', 'polite');
          form.appendChild(note);
        }
        note.textContent = message;
        note.classList.toggle('is-error', !!isError);
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (busy) return;

        if (input && !input.checkValidity()) {
          say(
            input.value.trim()
              ? 'That does not look like an email address — check for a typo.'
              : 'Enter your email address so we know where to send it.',
            true
          );
          input.setAttribute('aria-invalid', 'true');
          input.focus();
          return;
        }

        if (input) input.removeAttribute('aria-invalid');
        if (!label) return;

        busy = true;
        var original = label.textContent;
        label.textContent = 'Thank you';
        btn.disabled = true;
        say('You are on the list. Look out for the next issue.', false);

        window.setTimeout(function () {
          label.textContent = original;
          btn.disabled = false;
          busy = false;
          form.reset();
          if (note) note.textContent = '';
        }, 2400);
      });

      // Clear the error once they start correcting it.
      if (input) {
        input.addEventListener('input', function () {
          if (input.getAttribute('aria-invalid')) {
            input.removeAttribute('aria-invalid');
            if (note) { note.textContent = ''; note.classList.remove('is-error'); }
          }
        });
      }
    });
  }());


  /* ------------------------------------------------------------------------
     9 — HERO TYPEWRITER
     Reveals the H1 a character at a time.

     Every character is in the DOM from the start, hidden with `opacity`, and
     revealed in place. Nothing is inserted or removed while it runs, so the
     heading never reflows and the two lines below it never jump — which is
     what a width- or textContent-based typewriter does to a wrapping
     headline.

     Accessibility: the accessible name is set once on the H1 and every
     character span is hidden from assistive tech, so a screen reader reads
     the sentence normally instead of twenty-four separate letters. With no
     JS, or with reduced motion, the heading is just the heading.
     ---------------------------------------------------------------------- */
  (function typewriter() {
    var el = document.querySelector('[data-typewriter]');
    if (!el) return;

    var text = el.textContent.replace(/\s+/g, ' ').trim();
    if (!text) return;

    el.setAttribute('aria-label', text);

    if (reduceMotion) return;          // leave the plain heading alone

    // Rebuild: characters get spans, spaces stay real text nodes so the
    // headline still wraps at word boundaries.
    var frag = document.createDocumentFragment();
    var chars = [];

    for (var i = 0; i < text.length; i++) {
      if (text[i] === ' ') {
        frag.appendChild(document.createTextNode(' '));
        continue;
      }
      var s = document.createElement('span');
      s.className = 'tw-c';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = text[i];
      frag.appendChild(s);
      chars.push(s);
    }

    el.textContent = '';
    el.appendChild(frag);

    var STEP = 55;                     // ms per character
    var idx = 0;
    var timer = null;

    function finish() {
      chars.forEach(function (c) { c.classList.add('is-on'); });
      if (chars.length) chars[chars.length - 1].classList.remove('is-caret');
      if (timer) { clearInterval(timer); timer = null; }
    }

    function tick() {
      if (idx > 0) chars[idx - 1].classList.remove('is-caret');
      if (idx >= chars.length) { finish(); return; }
      chars[idx].classList.add('is-on', 'is-caret');
      idx++;
    }

    function start() {
      if (timer) return;
      timer = window.setInterval(tick, STEP);
      tick();
    }

    // Hold until the section is actually on screen, and never run it twice.
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          window.setTimeout(start, 320);
        });
      }, { threshold: 0.25 });
      io.observe(el);
    } else {
      window.setTimeout(start, 320);
    }

    // If the tab is hidden the interval throttles and the effect finishes
    // mid-word on return; jump it to the end instead.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && timer) finish();
    });
  }());

}());

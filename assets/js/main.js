/* ==========================================================================
   BD INTERNATIONAL — main.js
   Plain ES2020, no build step. Each block is an isolated IIFE so a failure
   in one feature cannot take the rest of the page down.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isDesktop = function () { return window.matchMedia('(min-width: 1024px)').matches; };

  /* ------------------------------------------------------------------------
     1 — HEADER / APP BAR: stick on scroll, hide on scroll-down
     ---------------------------------------------------------------------- */
  (function header() {
    var header = document.getElementById('header');
    var appbar = document.getElementById('appbar');
    var tabbar = document.getElementById('tabbar');
    var toTop = document.getElementById('to-top');
    var last = window.scrollY;
    var ticking = false;

    function update() {
      var y = window.scrollY;
      var stuck = y > 80;
      var goingDown = y > last && y > 240;

      [header, appbar].forEach(function (el) {
        if (!el) return;
        el.classList.toggle('is-stuck', stuck);
        el.classList.toggle('is-hidden', goingDown);
      });

      if (tabbar) tabbar.classList.toggle('is-hidden', goingDown);

      if (toTop) toTop.classList.toggle('is-visible', y > 600);

      last = y;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });

    update();

    if (toTop) {
      toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }
  }());

  /* ------------------------------------------------------------------------
     2 — MOBILE DRAWER
     ---------------------------------------------------------------------- */
  (function drawer() {
    var drawer = document.getElementById('drawer');
    var scrim = document.getElementById('drawer-scrim');
    var openBtn = document.getElementById('drawer-open');
    var closeBtn = document.getElementById('drawer-close');
    if (!drawer || !scrim || !openBtn) return;

    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      scrim.hidden = false;
      requestAnimationFrame(function () {
        drawer.classList.add('is-open');
        scrim.classList.add('is-open');
      });
      drawer.setAttribute('aria-hidden', 'false');
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('is-locked');
      var first = drawer.querySelector('a, button');
      if (first) first.focus();
    }

    function close() {
      drawer.classList.remove('is-open');
      scrim.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked');
      window.setTimeout(function () { scrim.hidden = true; }, 400);
      if (lastFocus) lastFocus.focus();
    }

    openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    scrim.addEventListener('click', close);

    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a[href^="#"]')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
    });
  }());

  /* ------------------------------------------------------------------------
     3 — BOTTOM SHEETS
     Content is *moved* into the sheet rather than duplicated, then returned
     to its original position on close. One source of truth per component.
     ---------------------------------------------------------------------- */
  (function sheets() {
    var scrim = document.getElementById('sheet-scrim');
    if (!scrim) return;

    var openSheet = null;
    var adopted = null;      // { node, marker }
    var lastFocus = null;

    function close() {
      if (!openSheet) return;

      openSheet.classList.remove('is-open');
      openSheet.setAttribute('aria-hidden', 'true');
      openSheet.style.transform = '';
      scrim.classList.remove('is-open');
      document.body.classList.remove('is-locked');

      // Put the borrowed node back where it came from
      if (adopted && adopted.marker && adopted.marker.parentNode) {
        adopted.marker.parentNode.replaceChild(adopted.node, adopted.marker);
      }
      adopted = null;
      openSheet = null;

      if (lastFocus) lastFocus.focus();
    }

    // Move focus into the sheet once it is actually focusable.
    //
    // `.sheet` is `visibility: hidden` when closed and `visibility` is in its
    // transition list, so it keeps computing as hidden for a frame or two
    // after `.is-open` lands — and focus() on a hidden element is a silent
    // no-op. That left focus on the trigger behind the scrim, with the tab
    // trap guarding a dialog the user was never inside. Retrying beats
    // hard-coding a frame count, which would only hold for one duration.
    function focusInto(sheet, attempt) {
      var focusable = sheet.querySelector('button, a, input, select, textarea');
      if (!focusable) return;

      focusable.focus();

      if (document.activeElement !== focusable && attempt < 6) {
        requestAnimationFrame(function () { focusInto(sheet, attempt + 1); });
      }
    }

    function open(sheet, adoptSel) {
      var body = sheet.querySelector('[data-sheet-body]');
      lastFocus = document.activeElement;

      if (adoptSel && body) {
        var node = document.querySelector(adoptSel);
        if (node) {
          var marker = document.createComment('sheet-adopted');
          node.parentNode.replaceChild(marker, node);
          body.appendChild(node);
          // A node whose scroll-reveal has not fired yet would arrive
          // invisible — force it visible for the duration of the sheet.
          node.style.opacity = '1';
          node.style.transform = 'none';
          adopted = { node: node, marker: marker };
        }
      }

      openSheet = sheet;
      scrim.classList.add('is-open');
      sheet.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');

      requestAnimationFrame(function () {
        sheet.classList.add('is-open');
        focusInto(sheet, 0);
      });
    }

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-sheet]');
      if (trigger) {
        var sheet = document.getElementById(trigger.getAttribute('data-sheet'));
        if (sheet) { e.preventDefault(); open(sheet, trigger.getAttribute('data-adopt')); }
        return;
      }

      // Contact is a dialog, not a section, so `#contact` has nothing to jump
      // to. Caught here rather than by tagging each link: fifteen of them
      // point at it — the header and hero CTAs, all six destination cards,
      // the quiz result, the CTA band, the footer and the mobile tab bar —
      // and every one of them would otherwise be a dead anchor.
      var contactLink = e.target.closest('a[href="#contact"]');
      var contactSheet = document.getElementById('sheet-contact');
      if (contactLink && contactSheet) {
        e.preventDefault();
        open(contactSheet);
        return;
      }

      if (e.target.closest('[data-sheet-close]')) close();
    });

    scrim.addEventListener('click', close);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    // Focus trap
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !openSheet) return;
      var items = openSheet.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!items.length) return;
      var first = items[0];
      var lastItem = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastItem.focus(); }
      else if (!e.shiftKey && document.activeElement === lastItem) { e.preventDefault(); first.focus(); }
    });

    // ---- drag-to-dismiss -------------------------------------------------
    document.querySelectorAll('[data-sheet-handle]').forEach(function (handle) {
      var sheet = handle.closest('.sheet');
      var startY = 0;
      var delta = 0;
      var dragging = false;

      handle.addEventListener('pointerdown', function (e) {
        if (isDesktop()) return;
        dragging = true;
        startY = e.clientY;
        delta = 0;
        sheet.classList.add('is-dragging');
        handle.setPointerCapture(e.pointerId);
      });

      handle.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        delta = Math.max(0, e.clientY - startY);
        sheet.style.transform = 'translateY(' + delta + 'px)';
      });

      handle.addEventListener('pointerup', function (e) {
        if (!dragging) return;
        dragging = false;
        sheet.classList.remove('is-dragging');
        handle.releasePointerCapture(e.pointerId);

        // Past a quarter of its height, let it go
        if (delta > sheet.offsetHeight * 0.25) close();
        else sheet.style.transform = '';
      });
    });

    // Returning to desktop while a sheet is open would strand *borrowed*
    // content away from its home in the page. A sheet that owns its content
    // outright — the contact dialog — has nothing to strand and is a proper
    // dialog at every width, so it stays open.
    window.addEventListener('resize', function () {
      if (openSheet && adopted && isDesktop()) close();
    });
  }());

  /* ------------------------------------------------------------------------
     4 — TAB BAR SCROLL-SPY
     ---------------------------------------------------------------------- */
  (function tabspy() {
    var tabs = document.querySelectorAll('.tabbar__tab[data-tab]');
    if (!tabs.length || !('IntersectionObserver' in window)) return;

    var map = {};
    tabs.forEach(function (t) {
      var id = t.getAttribute('data-tab');
      var section = document.getElementById(id);
      if (section) map[id] = { tab: t, section: section };
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        tabs.forEach(function (t) {
          t.classList.toggle('is-active', t.getAttribute('data-tab') === id);
          if (t.getAttribute('data-tab') === id) t.setAttribute('aria-current', 'true');
          else t.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    Object.keys(map).forEach(function (k) { observer.observe(map[k].section); });
  }());

  /* ------------------------------------------------------------------------
     5 — SLIDERS
     ---------------------------------------------------------------------- */
  (function sliders() {
    if (typeof Swiper === 'undefined') return;

    // Destinations
    // Destinations are no longer a slider either — that section is now a
    // sticky intro column beside a scroll-driven card stack.

    // Testimonials are no longer a slider — the section is a static 2+1+2
    // bento grid, so there is nothing to initialise here.
  }());

  /* ------------------------------------------------------------------------
     6 — PROCESS RAIL DOTS (mobile)
     ---------------------------------------------------------------------- */
  (function processRail() {
    var rail = document.getElementById('process-rail');
    var dots = document.getElementById('process-dots');
    if (!rail || !dots) return;

    var cards = rail.children;
    var marks = dots.children;

    rail.addEventListener('scroll', function () {
      var i = Math.round(rail.scrollLeft / (cards[0].offsetWidth + 16));
      i = Math.max(0, Math.min(marks.length - 1, i));
      for (var n = 0; n < marks.length; n++) marks[n].classList.toggle('is-active', n === i);
    }, { passive: true });
  }());

  /* ------------------------------------------------------------------------
     7 — FANCYBOX
     ---------------------------------------------------------------------- */
  (function lightbox() {
    if (typeof Fancybox === 'undefined') return;
    Fancybox.bind('[data-fancybox]', {
      Toolbar: { display: { left: [], middle: [], right: ['close'] } },
      Thumbs: false
    });
  }());

  /* ------------------------------------------------------------------------
     8 — COUNTERS + PROGRESS BARS
     The final value is already in the HTML; JS only animates towards it,
     so a script failure still shows real numbers.
     ---------------------------------------------------------------------- */
  (function counters() {
    var nodes = document.querySelectorAll('[data-count]');
    var bars = document.querySelectorAll('[data-progress]');
    if (!('IntersectionObserver' in window)) return;

    function format(n) {
      return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K' : String(n);
    }

    // Show the formatted target immediately so nothing reads as raw "6500"
    nodes.forEach(function (el) {
      el.textContent = format(parseFloat(el.getAttribute('data-count')));
    });

    if (reduceMotion) {
      bars.forEach(function (b) { b.style.width = b.getAttribute('data-progress') + '%'; });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);

        if (el.hasAttribute('data-count')) {
          var target = parseFloat(el.getAttribute('data-count'));
          var start = performance.now();
          var dur = 1600;
          (function step(now) {
            var p = Math.min(1, (now - start) / dur);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = format(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = format(target);
          }(start));
        } else {
          el.style.transition = 'width 1.2s cubic-bezier(.22,1,.36,1)';
          el.style.width = el.getAttribute('data-progress') + '%';
        }
      });
    }, { threshold: 0.6 });

    nodes.forEach(function (n) { io.observe(n); });
    bars.forEach(function (b) { io.observe(b); });
  }());

  /* ------------------------------------------------------------------------
     9 — ELIGIBILITY CHECKER
     Indicative routing only. It never promises an outcome — it summarises
     what the student told us and hands over to a human.
     ---------------------------------------------------------------------- */
  (function quiz() {
    var card = document.getElementById('quiz-card');
    if (!card) return;

    var steps = card.querySelectorAll('.quiz__step');
    var bar = card.querySelector('[data-quiz-bar]');
    var current = card.querySelector('[data-quiz-current]');
    var head = card.querySelector('[data-quiz-head]');
    var nav = card.querySelector('[data-quiz-nav]');
    var backBtn = card.querySelector('[data-quiz-back]');
    var result = card.querySelector('[data-quiz-result]');
    var summary = card.querySelector('[data-quiz-summary]');
    var verdict = card.querySelector('[data-quiz-verdict]');
    var restart = card.querySelector('[data-quiz-restart]');

    var LABELS = ['Destination', 'Qualification', 'English test', 'Start date'];
    var answers = [];
    var index = 0;

    function show(i) {
      steps.forEach(function (s, n) { s.classList.toggle('is-active', n === i); });
      current.textContent = String(i + 1).padStart(2, '0');
      bar.style.width = ((i + 1) / steps.length * 100) + '%';
      backBtn.hidden = i === 0;

      var active = steps[i];
      if (typeof gsap !== 'undefined' && !reduceMotion) {
        gsap.fromTo(active, { opacity: 0, x: 18 }, { opacity: 1, x: 0, duration: 0.32, ease: 'power2.out' });
      }
    }

    function finish() {
      steps.forEach(function (s) { s.classList.remove('is-active'); });
      head.style.display = 'none';
      nav.style.display = 'none';
      result.classList.add('is-active');
      bar.style.width = '100%';

      summary.innerHTML = '';
      answers.forEach(function (a, i) {
        var row = document.createElement('div');
        row.className = 'quiz__row';
        row.innerHTML = '<dt>' + LABELS[i] + '</dt><dd></dd>';
        row.querySelector('dd').textContent = a;
        summary.appendChild(row);
      });

      // Honest, non-committal routing
      var english = answers[2];
      var msg;
      if (english === 'IELTS 6.5+') {
        msg = 'Your English score meets the direct-entry bar at most partner universities.';
      } else if (english === 'IELTS 5.5–6.0') {
        msg = 'Direct entry is possible at some institutions; others would route you through a pathway programme.';
      } else {
        msg = 'You can still start — many universities issue conditional offers while you sit the test.';
      }
      verdict.textContent = msg;

      if (typeof gsap !== 'undefined' && !reduceMotion) {
        gsap.fromTo(result, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
      }
    }

    card.addEventListener('click', function (e) {
      var opt = e.target.closest('.quiz__opt');
      if (opt) {
        var step = opt.closest('.quiz__step');
        step.querySelectorAll('.quiz__opt').forEach(function (o) { o.classList.remove('is-selected'); });
        opt.classList.add('is-selected');
        answers[index] = opt.getAttribute('data-value');

        window.setTimeout(function () {
          if (index < steps.length - 1) { index += 1; show(index); }
          else finish();
        }, 260);
        return;
      }

      if (e.target.closest('[data-quiz-back]')) {
        if (index > 0) { index -= 1; show(index); }
        return;
      }

      if (e.target.closest('[data-quiz-restart]')) {
        answers = [];
        index = 0;
        card.querySelectorAll('.quiz__opt').forEach(function (o) { o.classList.remove('is-selected'); });
        result.classList.remove('is-active');
        head.style.display = '';
        nav.style.display = '';
        show(0);
      }
    });

    show(0);
  }());

  /* ------------------------------------------------------------------------
     10 — FORMS
     Client-side validation + a success state. Wire `endpoint` to a real
     handler (CRM / mail script) before launch — see DESIGN-PLAN §17.
     ---------------------------------------------------------------------- */
  (function forms() {
    document.querySelectorAll('[data-form]').forEach(function (form) {
      var panel = form.closest('.contact__panel');
      var success = panel ? panel.querySelector('[data-form-success]') : null;

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = true;

        form.querySelectorAll('[required]').forEach(function (input) {
          var field = input.closest('.field');
          var valid = input.checkValidity() && String(input.value).trim() !== '';

          if (input.type === 'tel') {
            valid = /^[0-9+\-\s()]{9,}$/.test(input.value.trim());
          }
          if (input.type === 'checkbox') valid = input.checked;

          if (field) field.classList.toggle('has-error', !valid);
          if (!valid && ok) { input.focus(); ok = false; }
        });

        if (!ok) return;

        var btn = form.querySelector('[type="submit"]');
        if (btn) btn.classList.add('is-loading');

        // Placeholder for the real submission
        window.setTimeout(function () {
          if (btn) btn.classList.remove('is-loading');
          if (success) {
            form.style.display = 'none';
            success.classList.add('is-visible');
          } else {
            form.reset();
          }
        }, 700);
      });

      // Clear the error as soon as the user starts fixing it
      form.addEventListener('input', function (e) {
        var field = e.target.closest('.field');
        if (field) field.classList.remove('has-error');
      });
    });
  }());

  /* ------------------------------------------------------------------------
     11 — FOOTER ACCORDIONS (mobile)
     ---------------------------------------------------------------------- */
  (function footerCols() {
    document.querySelectorAll('[data-footer-col]').forEach(function (col) {
      var title = col.querySelector('.footer__title');
      if (!title) return;
      title.addEventListener('click', function () {
        if (window.matchMedia('(min-width: 768px)').matches) return;
        col.classList.toggle('is-open');
      });
    });
  }());

  /* ------------------------------------------------------------------------
     12 — HERO TYPEWRITER
     Types the H1 one character at a time, then draws the gold swash under
     "here". Deliberately independent of GSAP so the heading still types (and
     the swash still draws) if the CDN fails.

     The H1 carries the full string in aria-label and the typed markup is
     aria-hidden, so assistive tech gets one clean heading instead of a
     stream of single letters — it is also the section's accessible name.
     ---------------------------------------------------------------------- */
  (function typewriter() {
    var tw = document.getElementById('hero-tw');
    if (!tw) return;

    var segs = tw.querySelectorAll('[data-tw-seg]');
    var chars = [];

    // Split each segment into inline-block words of per-character spans.
    // Spaces stay as plain text nodes: they carry no ink, so they can be
    // laid out from the start, and they keep the line-break opportunities.
    Array.prototype.forEach.call(segs, function (seg) {
      var words = seg.textContent.trim().split(/\s+/);
      seg.textContent = '';

      words.forEach(function (word, wi) {
        if (wi) seg.appendChild(document.createTextNode(' '));

        var wEl = document.createElement('span');
        wEl.className = 'tw__w';

        word.split('').forEach(function (ch) {
          var cEl = document.createElement('span');
          cEl.className = 'tw__c';
          cEl.textContent = ch;
          wEl.appendChild(cEl);
          chars.push(cEl);
        });

        seg.appendChild(wEl);
      });
    });

    if (!chars.length) return;

    function drawSwash() {
      var swash = document.getElementById('swash');
      if (swash) swash.classList.add('is-drawn');
    }

    function revealAll() {
      chars.forEach(function (c) { c.classList.add('is-on'); });
      tw.classList.add('is-done');
      drawSwash();
    }

    if (reduceMotion) { revealAll(); return; }

    var i = 0;
    var caret = null;

    function step() {
      var c = chars[i++];
      if (caret) caret.classList.remove('is-cursor');
      c.classList.add('is-on', 'is-cursor');
      caret = c;

      if (i < chars.length) {
        // Uneven cadence so it reads as typing rather than a metronome
        setTimeout(step, 40 + Math.random() * 45);
      } else {
        drawSwash();
        setTimeout(function () { tw.classList.add('is-done'); }, 500);
      }
    }

    // Start once the hero's fade-in has landed. If the tab is hidden the
    // timers throttle and it would type unseen, so wait for it to be visible.
    function start() { setTimeout(step, 460); }

    if (document.hidden) {
      document.addEventListener('visibilitychange', function onShow() {
        if (document.hidden) return;
        document.removeEventListener('visibilitychange', onShow);
        start();
      });
    } else {
      start();
    }
  }());

  /* ------------------------------------------------------------------------
     13 — GSAP: reveals, parallax, process timeline
     ---------------------------------------------------------------------- */
  (function motion() {
    if (typeof gsap === 'undefined') {
      // No GSAP — make sure nothing stays invisible
      document.querySelectorAll('[data-animate]').forEach(function (el) { el.style.opacity = 1; });
      return;
    }
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

    var mm = gsap.matchMedia();

    // Reduced motion: reveal everything with a plain fade, nothing else
    mm.add('(prefers-reduced-motion: reduce)', function () {
      gsap.set('[data-animate]', { opacity: 1, y: 0 });
    });

    // ---- quicklinks: overlapping deck -> evenly spaced ------------------
    // Only from md up: below that the rail is a horizontal scroll-snap strip,
    // where collapsing the cards on top of each other would break scrolling.
    //
    // The evenly-spaced layout is the CSS baseline and we animate transforms
    // *away* from it, so the grid never reflows, the cards stay clickable at
    // every point, and a no-JS/no-GSAP visitor just gets the final layout.
    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', function () {
      var slots = gsap.utils.toArray('.quicklinks__slot');
      if (slots.length < 3) return;

      var last = slots.length - 1;
      // Fraction of its own width each outer card slides inward. ~50% leaves
      // roughly half of each outer card proud of the centre one, so all three
      // titles stay readable while collapsed — a fanned deck rather than a
      // pile where the outer two are just slivers.
      var SHIFT = 50;

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.quicklinks__rail',
          start: 'top 90%',
          // play on the way down, rewind on the way back up — the toggle the
          // brief asks for, and it keeps the easing intact in both directions
          // (a scrub would replace the easing with raw scroll position).
          toggleActions: 'play none none reverse'
        }
      });

      tl.fromTo(slots, {
        xPercent: function (i) { return i === 0 ? SHIFT : (i === last ? -SHIFT : 0); },
        yPercent: function (i) { return i === 1 ? 0 : 7; },
        rotate:   function (i) { return i === 0 ? -3.5 : (i === last ? 3.5 : 0); },
        scale:    function (i) { return i === 1 ? 1 : 0.95; },
        opacity:  function (i) { return i === 1 ? 1 : 0.94; }
      }, {
        xPercent: 0,
        yPercent: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
        duration: 1.15,
        // Smooth decelerate, no bounce. Deliberately not expo.out: that puts
        // ~90% of the travel into the first fifth of the duration, so the move
        // is over before it registers. power3 spreads it across the whole
        // tween, which is what makes it read as fluid rather than snapped.
        ease: 'power3.out',
        // outer cards leave the deck first, so the centre is uncovered last
        stagger: { each: 0.08, from: 'center' }
      });

      // Hand the transform hint back afterwards so the cards aren't parked on
      // their own compositor layers for the rest of the session.
      gsap.set(slots, { willChange: 'transform' });
      tl.eventCallback('onComplete', function () {
        gsap.set(slots, { willChange: 'auto' });
      });
      tl.eventCallback('onReverseComplete', function () {
        gsap.set(slots, { willChange: 'auto' });
      });
    });

    // ---- destinations: collapsed deck -> evenly spaced column -----------
    // Scrubbed rather than a timed tween, so it tracks the wheel 1:1, can be
    // held half-open, and unwinds identically on the way back up.
    //
    // Each card is pulled up onto the first one by the difference in their
    // layout positions, so the collapsed state is an exact deck whatever the
    // card heights are. Only from lg up: below that the sticky intro column
    // is off and the cards are a plain stacked list.
    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 1024px)', function () {
      var cards = gsap.utils.toArray('.dest__stack > *');
      if (cards.length < 2) return;

      var first = cards[0];

      cards.forEach(function (card, i) {
        if (!i) return;

        gsap.fromTo(card,
          { y: function () { return first.offsetTop - card.offsetTop; } },
          {
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: '.dest__stack',
              start: 'top 80%',
              end: 'top 25%',
              scrub: true,
              // recompute the collapse offsets if the layout reflows
              invalidateOnRefresh: true
            }
          });
      });
    });

    mm.add('(prefers-reduced-motion: no-preference)', function () {
      // ---- hero entrance ------------------------------------------------
      // fromTo, not from: CSS already sets these to opacity 0, so a plain
      // .from() would animate 0 -> 0 and leave the hero blank.
      var heroBits = gsap.utils.toArray('.hero [data-animate]');
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo(heroBits,
          { opacity: 0, y: 34 },
          { opacity: 1, y: 0, duration: 0.75, stagger: 0.08 })
        // The swash is no longer drawn here — block 12 fires it when the
        // typewriter finishes "here", which is the only moment it makes sense.
        .fromTo('.hero__bg img', { scale: 1.14 }, { scale: 1.06, duration: 8, ease: 'none' }, 0);

      // ---- generic section reveals --------------------------------------
      gsap.utils.toArray('[data-animate]').forEach(function (el) {
        if (el.closest('.hero')) return;
        // The service cards are choreographed as one set below, not as six
        // independent fades — skip them here so they aren't animated twice.
        if (el.closest('.services__grid')) return;
        gsap.fromTo(el,
          { opacity: 0, y: 32 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
            // Hand the transform back to CSS once the reveal has landed.
            // GSAP parks `translate/rotate/scale: none` inline on everything
            // it touches, which silently outranks any stylesheet hover lift —
            // it had already killed the hover on the service, process and FAQ
            // cards. Safe here because this tween plays once and never
            // reverses.
            //
            // Transforms only, never opacity: the stylesheet has
            // `.js [data-animate] { opacity: 0 }`, so clearing that would
            // send the element straight back to invisible.
            onComplete: function () {
              gsap.set(el, { clearProps: 'transform,translate,rotate,scale' });
            }
          }
        );
      });

      // ---- about collage parallax ---------------------------------------
      if (document.querySelector('.about__img-main')) {
        gsap.to('.about__img-main', {
          yPercent: -7,
          ease: 'none',
          scrollTrigger: { trigger: '.about__media', start: 'top bottom', end: 'bottom top', scrub: true }
        });
        gsap.to('.about__img-sub', {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: '.about__media', start: 'top bottom', end: 'bottom top', scrub: true }
        });
      }

      // ---- process timeline: rule scrubbed to scroll ---------------------
      var timeline = document.getElementById('process-timeline');
      if (timeline && typeof ScrollTrigger !== 'undefined') {
        var rule = timeline.querySelector('[data-process-rule]');
        var rows = timeline.querySelectorAll('[data-process-row]');

        gsap.to(rule, {
          height: '100%',
          ease: 'none',
          scrollTrigger: { trigger: timeline, start: 'top 62%', end: 'bottom 78%', scrub: 0.6 }
        });

        // Each step is scrubbed against its own position rather than fired
        // once on entry, so the five cards arrive one per scroll step and the
        // whole run unwinds card by card on the way back up — the same
        // wheel-tracking feel as the services sequence.
        //
        // The section is ~1370px of content in a ~1000px viewport, so it
        // can't be pinned the way services is; the reveals ride the page's
        // own scroll instead. The window is deliberately close to the 214px
        // row pitch, which is what keeps the cards from arriving in a clump.
        rows.forEach(function (row) {
          var node = row.querySelector('.process__node');
          var wrap = row.querySelector('.process__cardwrap');
          var mark = row.querySelector('.process__row-icon');
          var fromX = node.previousElementSibling ? -46 : 46;

          gsap.timeline({
            scrollTrigger: {
              trigger: row,
              start: 'top 84%',
              end: 'top 58%',
              scrub: 0.6,
              // The node's colour and its ping ride the same direction as
              // the reveal, so scrolling back up un-reaches the step.
              onEnter: function () { row.classList.add('is-reached'); },
              onEnterBack: function () { row.classList.add('is-reached'); },
              onLeaveBack: function () { row.classList.remove('is-reached'); }
            }
          })
            .fromTo(node, { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(1.7)' })
            .fromTo(wrap, { opacity: 0, x: fromX }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }, 0.2)
            .fromTo(mark, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, 0.3);
        });
      }

      // ---- process: drifting step marks ----------------------------------
      // Each mark gets its own period, direction and phase so the group never
      // settles into a shared rhythm — that synchronised look is what makes
      // floating decoration read as cheap.
      //
      // Two motions per mark: an endless yoyo drift on xPercent/yPercent/
      // rotation, and a scrubbed parallax on `y`. Different properties, so
      // they occupy different slots of the same matrix and run at once
      // without cancelling each other.
      gsap.utils.toArray('.process__row-icon').forEach(function (el, i) {
        var dirX = i % 2 ? -1 : 1;
        var dirY = i % 3 ? 1 : -1;

        gsap.to(el, {
          xPercent: dirX * (16 + (i % 4) * 7),
          yPercent: dirY * (20 + (i % 3) * 9),
          rotation: dirX * (8 + (i % 3) * 5),
          duration: 8 + (i % 5) * 2.4,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.35
        });

        // Alternating parallax depth, so the layer separates as you scroll
        // instead of sliding as one sheet.
        var depth = 46 * (i % 2 ? -1 : 1);

        gsap.fromTo(el,
          { y: depth },
          {
            y: -depth,
            ease: 'none',
            scrollTrigger: {
              trigger: '.process',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8
            }
          });
      });

      return function () { /* cleanup handled by matchMedia */ };
    });

    // ---- services: six gradient cards, revealed one at a time ------------
    // One card's worth of reveal, dropped into a timeline at whatever
    // position the caller asks for. Shared by both branches below so the
    // pinned sequence and the fallback can't drift apart.
    //
    // Everything targets the *cell*, never the card. GSAP writes `translate:
    // none; rotate: none; scale: none` inline on every element it touches to
    // stop those properties fighting its matrix — which also outranks any
    // stylesheet hover rule using them. Animating one level up leaves the
    // card's own transform free for the CSS hover lift.
    function svcReveal(tl, cell, at) {
      var icon = cell.querySelector('.card__icon');
      var num = cell.querySelector('.card__num');

      // Hinged at the bottom edge so the card stands up into place rather
      // than tipping around its own middle. The grid's CSS perspective is
      // what makes the rotation read as depth.
      tl.fromTo(cell,
        { opacity: 0, y: 64, scale: 0.94, rotateX: -14, transformOrigin: '50% 100%' },
        { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 0.7, ease: 'power3.out' }, at);

      if (icon) {
        tl.fromTo(icon,
          { opacity: 0, scale: 0.55, rotate: -20 },
          { opacity: 1, scale: 1, rotate: 0, duration: 0.45, ease: 'back.out(2.2)' }, at + 0.14);
      }

      // The number's resting alpha lives in its stroke colour, not in
      // `opacity`, so this can settle on a plain 1 and still leave the CSS
      // hover brighten free to work.
      if (num) {
        tl.fromTo(num,
          { opacity: 0, x: 22 },
          { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out' }, at + 0.2);
      }
    }

    // Pinned sequence: the section holds still while the six cards arrive
    // one per scroll step, and only releases to the next section once the
    // last one has landed. Scrubbed rather than timed, so scrolling back up
    // plays the whole thing backwards card by card instead of snapping.
    //
    // Whether it can pin at all depends on the section fitting the viewport,
    // and that is deliberately *measured* rather than expressed as a media
    // query. The card text rewraps at every width, so the content block runs
    // ~690px tall at 1920 but ~770px at 1024 — one `min-height` threshold is
    // right at one width and wrong at the next, which is how a 1024x900
    // viewport ended up pinned with its bottom row cut off. Anything that
    // doesn't fit falls back to a plain staggered reveal.
    (function services() {
      var section = document.querySelector('.services');
      if (!section) return;

      var inner = section.querySelector('.services__inner');
      var cells = gsap.utils.toArray('.services__cell');
      if (!inner || cells.length < 2) return;

      // Matches `padding-block` on `.is-sequenced`. Symmetric, so the gap
      // above the eyebrow always equals the gap below the last row, and high
      // enough to clear the 76px fixed header when it bites.
      var PAD = 80;

      // Scroll distance per card — long enough that each one is a deliberate
      // step rather than a flick of the wheel.
      var STEP = 320;

      var ctx = null;
      var lastMode = null;
      var lastW = 0;
      var lastH = 0;

      function canPin() {
        if (!window.matchMedia('(min-width: 1024px)').matches) return false;

        // Measure the layout being decided about, not the one on screen:
        // `.is-sequenced` tightens the heading gap, so measuring without it
        // over-states the content by ~40px and would reject viewports the
        // sequence actually fits. Restored exactly as found, so a caller
        // that only asks the question can't leave the section restyled.
        var had = section.classList.contains('is-sequenced');
        if (!had) section.classList.add('is-sequenced');

        var fits = inner.offsetHeight + PAD * 2 <= window.innerHeight;

        if (!had) section.classList.remove('is-sequenced');
        return fits;
      }

      function build() {
        // Under reduced motion the stylesheet already reveals everything and
        // block 13's reduce branch pins nothing. Leave it alone.
        if (reduceMotion) return;

        if (ctx) { ctx.revert(); ctx = null; }
        section.classList.remove('is-sequenced');

        var pinned = canPin();
        lastMode = pinned;

        if (pinned) section.classList.add('is-sequenced');

        ctx = gsap.context(function () {
          var tl = gsap.timeline({
            scrollTrigger: pinned
              ? {
                trigger: section,
                start: 'top top',
                end: '+=' + (cells.length * STEP),
                pin: true,
                anticipatePin: 1,
                scrub: 0.55,
                invalidateOnRefresh: true,
                // Refresh ahead of every default-priority trigger. Pinning
                // adds its whole scroll distance to the document, so every
                // trigger below this section shifts down by that much — but
                // only if this one is measured first. This module is built
                // after the section triggers above, so without the priority
                // the process timeline came out exactly 1920px (the pin
                // length) too high and its cards were all revealed on load.
                refreshPriority: 1
              }
              : {
                trigger: '.services__grid',
                start: 'top 84%',
                toggleActions: 'play none none reverse'
              }
          });

          cells.forEach(function (cell, i) {
            svcReveal(tl, cell, pinned ? i : i * 0.12);
          });

          // A beat with all six standing before the pin releases, so the
          // finished grid is something you see rather than scroll past.
          if (pinned) tl.to({}, { duration: 0.6 });
        });

        // Both the class swap and the pin spacer this just created change
        // the height of everything above and below, so every trigger on the
        // page has to be re-measured against the settled DOM. Skipping it
        // lets a rebuild compute a start of -70 and pin the section fixed
        // over the top of the page. Deferred a frame so the new layout has
        // actually been applied before anything is measured.
        requestAnimationFrame(function () {
          if (typeof ScrollTrigger === 'undefined') return;
          // Re-order before re-measuring: this trigger is created out of
          // document order relative to the rest of the page, and the pin's
          // spacing can only be credited to the triggers below it if they
          // are refreshed after it.
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
        });
      }

      var resizeTimer;
      function onResize() {
        // Ignore the mobile-browser address-bar jitter that fires resize on
        // every scroll without changing the layout in any way that matters.
        if (window.innerWidth === lastW && Math.abs(window.innerHeight - lastH) < 80) return;
        lastW = window.innerWidth;
        lastH = window.innerHeight;

        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(function () {
          if (canPin() !== lastMode) build();
        }, 220);
      }

      lastW = window.innerWidth;
      lastH = window.innerHeight;
      build();
      window.addEventListener('resize', onResize);

      // Web fonts land after first paint and change how the card text wraps,
      // which can flip the fit decision either way.
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
          if (canPin() !== lastMode) build();
        });
      }
    }());

    // Fonts and images shift layout — re-measure once they land
    window.addEventListener('load', function () {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      });
    }
  }());

}());

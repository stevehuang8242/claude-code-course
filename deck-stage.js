/**
 * <deck-stage> — reusable web component for HTML decks.
 *
 * Handles:
 *  (a) speaker notes — reads <script type="application/json" id="speaker-notes">
 *      and posts {slideIndexChanged: N} to the parent window on nav.
 *  (b) keyboard navigation — ←/→, PgUp/PgDn, Space, Home/End, number keys.
 *  (c) press R to reset to slide 0 (with a tasteful keyboard hint).
 *  (d) bottom-center overlay showing slide count + hints, fades out on idle.
 *  (e) auto-scaling — inner canvas is a fixed design size (default 1920×1080)
 *      scaled with `transform: scale()` to fit the viewport, letterboxed.
 *      Set the `noscale` attribute to render at authored size (1:1) — the
 *      PPTX exporter sets this so its DOM capture sees unscaled geometry.
 *  (f) print — `@media print` lays every slide out as its own page at the
 *      design size, so the browser's Print → Save as PDF produces a clean
 *      one-page-per-slide PDF with no extra setup.
 *  (g) overview — press `o` to toggle a full-screen grid of thumbnails;
 *      click a thumbnail to jump. Esc closes. Thumbnails are deep clones
 *      (display-only, no React) of the live slide DOM, scaled with
 *      transform; the overlay lives in document.body so clones inherit
 *      document fonts & global stylesheets.
 *
 * Slides are HIDDEN, not unmounted. Non-active slides stay in the DOM with
 * `visibility: hidden` + `opacity: 0`, so their state (videos, iframes,
 * form inputs, React trees) is preserved across navigation.
 *
 * Lifecycle event — the component dispatches a `slidechange` CustomEvent on
 * itself whenever the active slide changes (including the initial mount).
 * The event bubbles and composes out of shadow DOM, so you can listen on
 * the <deck-stage> element or on document:
 *
 *   document.querySelector('deck-stage').addEventListener('slidechange', (e) => {
 *     e.detail.index         // new 0-based index
 *     e.detail.previousIndex // previous index, or -1 on init
 *     e.detail.total         // total slide count
 *     e.detail.slide         // the new active slide element
 *     e.detail.previousSlide // the prior slide element, or null on init
 *     e.detail.reason        // 'init' | 'keyboard' | 'click' | 'tap' | 'api'
 *   });
 *
 * Persistence: none at the deck level. The host app keeps the current slide
 * in its own URL (?slide=) and re-delivers it via location.hash on load, so a
 * bare load with no hash always starts at slide 1.
 *
 * Usage:
 *   <deck-stage width="1920" height="1080">
 *     <section data-label="Title">...</section>
 *     <section data-label="Agenda">...</section>
 *   </deck-stage>
 *
 * Slides are the direct element children of <deck-stage>. Each slide is
 * automatically tagged with:
 *   - data-screen-label="NN Label"   (1-indexed, for comment flow)
 *   - data-om-validate="no_overflowing_text,no_overlapping_text,slide_sized_text"
 */

(() => {
  const DESIGN_W_DEFAULT = 1920;
  const DESIGN_H_DEFAULT = 1080;
  const OVERLAY_HIDE_MS = 1800;
  const VALIDATE_ATTR = 'no_overflowing_text,no_overlapping_text,slide_sized_text';

  /* Overview thumbnail size = 380×214 (≈1/5 of 1920×1080).
   * Scale = 380 / DESIGN_W_DEFAULT — re-derived in _buildOverviewContent
   * if the deck is using a non-default authoring size. */
  const OVERVIEW_THUMB_W = 380;

  const pad2 = (n) => String(n).padStart(2, '0');

  /* Lives in document <head>, NOT shadow DOM, because thumbnails are clones
   * of light-DOM slides that need access to document fonts (Inter / Noto Sans
   * TC) and any global stylesheet rules the slides depend on. */
  const OVERVIEW_CSS = `
    .deck-overview-host {
      position: fixed;
      inset: 0;
      background: rgba(9, 9, 9, 0.96);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      z-index: 2147482500;
      opacity: 0;
      pointer-events: none;
      transition: opacity 220ms ease;
      overflow: auto;
      padding: 56px 56px 80px;
      box-sizing: border-box;
      color: #fff;
      font-family: Inter, 'Noto Sans TC', system-ui, sans-serif;
    }
    .deck-overview-host[data-open] {
      opacity: 1;
      pointer-events: auto;
    }
    .deck-overview-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      font-size: 12px;
      letter-spacing: 0.04em;
      font-weight: 500;
      margin-bottom: 36px;
      color: rgba(255, 255, 255, 0.5);
    }
    .deck-overview-title .label {
      color: #fff;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      font-size: 11px;
    }
    .deck-overview-title .hint { display: inline-flex; align-items: center; gap: 6px; }
    .deck-overview-title .kbd {
      display: inline-flex; align-items: center; justify-content: center;
      min-width: 18px; height: 18px; padding: 0 5px;
      font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      font-size: 10px; line-height: 1;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      color: rgba(255, 255, 255, 0.85);
    }
    .deck-overview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, ${OVERVIEW_THUMB_W}px);
      gap: 32px 24px;
      justify-content: center;
      max-width: ${OVERVIEW_THUMB_W * 4 + 24 * 3 + 80}px;
      margin: 0 auto;
    }
    .deck-thumb {
      cursor: pointer;
      user-select: none;
      transition: transform 160ms cubic-bezier(.2,.8,.2,1);
    }
    .deck-thumb:hover { transform: translateY(-3px); }
    .deck-thumb-frame {
      width: ${OVERVIEW_THUMB_W}px;
      aspect-ratio: 16 / 9;
      border-radius: 8px;
      overflow: hidden;
      border: 1.5px solid rgba(255, 255, 255, 0.08);
      background: #090909;
      transition: border-color 160ms ease, box-shadow 160ms ease;
      position: relative;
    }
    .deck-thumb:hover .deck-thumb-frame {
      border-color: rgba(255, 255, 255, 0.4);
    }
    .deck-thumb[data-active] .deck-thumb-frame {
      border-color: #ffffff;
      box-shadow: 0 0 0 1px #ffffff;
    }
    .deck-thumb-inner {
      transform-origin: top left;
      pointer-events: none;
    }
    .deck-thumb-inner > * {
      position: absolute !important;
      inset: 0 !important;
      box-sizing: border-box !important;
      visibility: visible !important;
      opacity: 1 !important;
      pointer-events: none !important;
    }
    .deck-thumb-label {
      margin-top: 10px;
      display: flex;
      align-items: baseline;
      gap: 10px;
      font-size: 13px;
      letter-spacing: 0.005em;
      color: rgba(255, 255, 255, 0.55);
    }
    .deck-thumb-num {
      color: rgba(255, 255, 255, 0.4);
      font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      font-size: 11px;
      font-variant-numeric: tabular-nums;
      min-width: 22px;
    }
    .deck-thumb[data-active] .deck-thumb-label { color: #fff; }
    .deck-thumb[data-active] .deck-thumb-num { color: rgba(255, 255, 255, 0.85); }
    @media print { .deck-overview-host { display: none !important; } }
  `;

  const stylesheet = `
    :host {
      position: fixed;
      inset: 0;
      display: block;
      background: #000;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
      overflow: hidden;
    }

    .stage {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .canvas {
      position: relative;
      transform-origin: center center;
      flex-shrink: 0;
      background: #fff;
      will-change: transform;
    }

    /* Slides live in light DOM (via <slot>) so authored CSS still applies.
       We absolutely position each slotted child to stack them. */
    ::slotted(*) {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      box-sizing: border-box !important;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
    }
    ::slotted([data-deck-active]) {
      opacity: 1;
      pointer-events: auto;
      visibility: visible;
    }

    /* Tap zones for mobile — back/forward thirds like Stories.
       Transparent, no visible UI, don't block the overlay. */
    .tapzones {
      position: fixed;
      inset: 0;
      display: flex;
      z-index: 2147482000;
      pointer-events: none;
    }
    .tapzone {
      flex: 1;
      pointer-events: auto;
      -webkit-tap-highlight-color: transparent;
    }
    /* Only activate tap zones on coarse pointers (touch devices). */
    @media (hover: hover) and (pointer: fine) {
      .tapzones { display: none; }
    }

    .overlay {
      position: fixed;
      left: 50%;
      bottom: 22px;
      transform: translate(-50%, 6px) scale(0.92);
      filter: blur(6px);
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px;
      background: #000;
      color: #fff;
      border-radius: 999px;
      font-size: 12px;
      font-feature-settings: "tnum" 1;
      letter-spacing: 0.01em;
      opacity: 0;
      pointer-events: none;
      transition: opacity 260ms ease, transform 260ms cubic-bezier(.2,.8,.2,1), filter 260ms ease;
      transform-origin: center bottom;
      z-index: 2147483000;
      user-select: none;
    }
    .overlay[data-visible] {
      opacity: 1;
      pointer-events: auto;
      transform: translate(-50%, 0) scale(1);
      filter: blur(0);
    }

    .btn {
      appearance: none;
      -webkit-appearance: none;
      background: transparent;
      border: 0;
      margin: 0;
      padding: 0;
      color: inherit;
      font: inherit;
      cursor: default;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      min-width: 28px;
      border-radius: 999px;
      color: rgba(255,255,255,0.72);
      transition: background 140ms ease, color 140ms ease;
      -webkit-tap-highlight-color: transparent;
    }
    .btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
    .btn:active { background: rgba(255,255,255,0.18); }
    .btn:focus { outline: none; }
    .btn:focus-visible { outline: none; }
    .btn::-moz-focus-inner { border: 0; }
    .btn svg { width: 14px; height: 14px; display: block; }
    .btn.reset,
    .btn.overview,
    .btn.agenda {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.02em;
      padding: 0 10px 0 12px;
      gap: 6px;
      color: rgba(255,255,255,0.72);
    }
    .btn.reset .kbd,
    .btn.overview .kbd,
    .btn.agenda .kbd {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      font-size: 10px;
      line-height: 1;
      color: rgba(255,255,255,0.88);
      background: rgba(255,255,255,0.12);
      border-radius: 4px;
    }

    .count {
      font-variant-numeric: tabular-nums;
      color: #fff;
      font-weight: 500;
      padding: 0 8px;
      min-width: 42px;
      text-align: center;
      font-size: 12px;
    }
    .count .sep { color: rgba(255,255,255,0.45); margin: 0 3px; font-weight: 400; }
    .count .total { color: rgba(255,255,255,0.55); }

    .divider {
      width: 1px;
      height: 14px;
      background: rgba(255,255,255,0.18);
      margin: 0 2px;
    }

    /* ── Print: one page per slide, no chrome ────────────────────────────
       The screen layout stacks every slide at inset:0 inside a scaled
       canvas; for print we want them in document flow at the authored
       design size so the browser paginates one slide per sheet. The
       @page size is set from the width/height attributes via the inline
       <style id="deck-stage-print-page"> that connectedCallback injects
       into <head> (the @page at-rule has no effect inside shadow DOM). */
    @media print {
      :host {
        position: static;
        inset: auto;
        background: none;
        overflow: visible;
        color: inherit;
      }
      .stage { position: static; display: block; }
      .canvas {
        transform: none !important;
        width: auto !important;
        height: auto !important;
        background: none;
        will-change: auto;
      }
      ::slotted(*) {
        position: relative !important;
        inset: auto !important;
        width: var(--deck-design-w) !important;
        height: var(--deck-design-h) !important;
        box-sizing: border-box !important;
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto;
        break-after: page;
        page-break-after: always;
        break-inside: avoid;
        overflow: hidden;
      }
      ::slotted(*:last-child) {
        break-after: auto;
        page-break-after: auto;
      }
      .overlay, .tapzones { display: none !important; }
    }
  `;

  class DeckStage extends HTMLElement {
    static get observedAttributes() { return ['width', 'height', 'noscale']; }

    constructor() {
      super();
      this._root = this.attachShadow({ mode: 'open' });
      this._index = 0;
      this._slides = [];
      this._notes = [];
      this._hideTimer = null;
      this._mouseIdleTimer = null;
      this._overviewOpen = false;
      this._overviewHost = null;

      this._onKey = this._onKey.bind(this);
      this._onResize = this._onResize.bind(this);
      this._onSlotChange = this._onSlotChange.bind(this);
      this._onMouseMove = this._onMouseMove.bind(this);
      this._onTapBack = this._onTapBack.bind(this);
      this._onTapForward = this._onTapForward.bind(this);
    }

    get designWidth() {
      return parseInt(this.getAttribute('width'), 10) || DESIGN_W_DEFAULT;
    }
    get designHeight() {
      return parseInt(this.getAttribute('height'), 10) || DESIGN_H_DEFAULT;
    }

    connectedCallback() {
      this._render();
      this._loadNotes();
      this._syncPrintPageRule();
      this._injectOverviewStyles();
      window.addEventListener('keydown', this._onKey);
      window.addEventListener('resize', this._onResize);
      window.addEventListener('mousemove', this._onMouseMove, { passive: true });
      // Initial collection + layout happens via slotchange, which fires on mount.
    }

    disconnectedCallback() {
      window.removeEventListener('keydown', this._onKey);
      window.removeEventListener('resize', this._onResize);
      window.removeEventListener('mousemove', this._onMouseMove);
      if (this._hideTimer) clearTimeout(this._hideTimer);
      if (this._mouseIdleTimer) clearTimeout(this._mouseIdleTimer);
      if (this._overviewHost && this._overviewHost.parentNode) {
        this._overviewHost.parentNode.removeChild(this._overviewHost);
        this._overviewHost = null;
      }
    }

    attributeChangedCallback() {
      if (this._canvas) {
        this._canvas.style.width = this.designWidth + 'px';
        this._canvas.style.height = this.designHeight + 'px';
        this._canvas.style.setProperty('--deck-design-w', this.designWidth + 'px');
        this._canvas.style.setProperty('--deck-design-h', this.designHeight + 'px');
        this._fit();
        this._syncPrintPageRule();
      }
    }

    _render() {
      const style = document.createElement('style');
      style.textContent = stylesheet;

      const stage = document.createElement('div');
      stage.className = 'stage';

      const canvas = document.createElement('div');
      canvas.className = 'canvas';
      canvas.style.width = this.designWidth + 'px';
      canvas.style.height = this.designHeight + 'px';
      canvas.style.setProperty('--deck-design-w', this.designWidth + 'px');
      canvas.style.setProperty('--deck-design-h', this.designHeight + 'px');

      const slot = document.createElement('slot');
      slot.addEventListener('slotchange', this._onSlotChange);
      canvas.appendChild(slot);
      stage.appendChild(canvas);

      // Tap zones (mobile): left third = back, right third = forward.
      const tapzones = document.createElement('div');
      tapzones.className = 'tapzones export-hidden';
      tapzones.setAttribute('aria-hidden', 'true');
      tapzones.setAttribute('data-noncommentable', '');
      const tzBack = document.createElement('div');
      tzBack.className = 'tapzone tapzone--back';
      const tzMid = document.createElement('div');
      tzMid.className = 'tapzone tapzone--mid';
      tzMid.style.pointerEvents = 'none';
      const tzFwd = document.createElement('div');
      tzFwd.className = 'tapzone tapzone--fwd';
      tzBack.addEventListener('click', this._onTapBack);
      tzFwd.addEventListener('click', this._onTapForward);
      tapzones.append(tzBack, tzMid, tzFwd);

      // Overlay: compact, solid black, with clickable controls.
      const overlay = document.createElement('div');
      overlay.className = 'overlay export-hidden';
      overlay.setAttribute('role', 'toolbar');
      overlay.setAttribute('aria-label', 'Deck controls');
      overlay.setAttribute('data-noncommentable', '');
      overlay.innerHTML = `
        <button class="btn prev" type="button" aria-label="Previous slide" title="Previous (←)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3L5 8l5 5"/></svg>
        </button>
        <span class="count" aria-live="polite"><span class="current">1</span><span class="sep">/</span><span class="total">1</span></span>
        <button class="btn next" type="button" aria-label="Next slide" title="Next (→)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg>
        </button>
        <span class="divider"></span>
        <button class="btn reset" type="button" aria-label="Return to first slide" title="Return (R)">Return<span class="kbd">R</span></button>
        <button class="btn overview" type="button" aria-label="Toggle overview" title="Overview (O)">Overview<span class="kbd">O</span></button>
        <button class="btn agenda" type="button" aria-label="Jump to Agenda" title="Agenda (A)">Agenda<span class="kbd">A</span></button>
      `;

      overlay.querySelector('.prev').addEventListener('click', () => this._step(-1, 'click'));
      overlay.querySelector('.next').addEventListener('click', () => this._step(1, 'click'));
      overlay.querySelector('.reset').addEventListener('click', () => this._go(0, 'click'));
      overlay.querySelector('.overview').addEventListener('click', () => this._toggleOverview());
      overlay.querySelector('.agenda').addEventListener('click', () => this._jumpToRole('agenda', 'click'));

      this._root.append(style, stage, tapzones, overlay);
      this._canvas = canvas;
      this._slot = slot;
      this._overlay = overlay;
      this._countEl = overlay.querySelector('.current');
      this._totalEl = overlay.querySelector('.total');
    }

    /** @page must live in the document stylesheet — it's a no-op inside
     *  shadow DOM. Inject/update a single <head> style tag so the print
     *  sheet matches the design size and Save-as-PDF yields one slide per
     *  page with no margins. */
    _syncPrintPageRule() {
      const id = 'deck-stage-print-page';
      let tag = document.getElementById(id);
      if (!tag) {
        tag = document.createElement('style');
        tag.id = id;
        document.head.appendChild(tag);
      }
      tag.textContent =
        '@page { size: ' + this.designWidth + 'px ' + this.designHeight + 'px; margin: 0; } ' +
        '@media print { html, body { margin: 0 !important; padding: 0 !important; background: none !important; overflow: visible !important; height: auto !important; } ' +
        '* { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }';
    }

    _onSlotChange() {
      this._collectSlides();
      this._restoreIndex();
      this._applyIndex({ showOverlay: false, broadcast: true, reason: 'init' });
      this._fit();
    }

    _collectSlides() {
      const assigned = this._slot.assignedElements({ flatten: true });
      this._slides = assigned.filter((el) => {
        // Skip template/style/script nodes even if someone slots them.
        const tag = el.tagName;
        return tag !== 'TEMPLATE' && tag !== 'SCRIPT' && tag !== 'STYLE';
      });

      this._slides.forEach((slide, i) => {
        const n = i + 1;
        // Determine a label for comment flow: prefer explicit data-label,
        // then an existing data-screen-label, then first heading, else "Slide".
        let label = slide.getAttribute('data-label');
        if (!label) {
          const existing = slide.getAttribute('data-screen-label');
          if (existing) {
            // Strip any leading number the author may have included.
            label = existing.replace(/^\s*\d+\s*/, '').trim() || existing;
          }
        }
        if (!label) {
          const h = slide.querySelector('h1, h2, h3, [data-title]');
          if (h) label = (h.textContent || '').trim().slice(0, 40);
        }
        if (!label) label = 'Slide';
        slide.setAttribute('data-screen-label', `${pad2(n)} ${label}`);

        // Validation attribute for comment flow / auto-checks.
        if (!slide.hasAttribute('data-om-validate')) {
          slide.setAttribute('data-om-validate', VALIDATE_ATTR);
        }

        slide.setAttribute('data-deck-slide', String(i));
      });

      if (this._totalEl) this._totalEl.textContent = String(this._slides.length || 1);
      if (this._index >= this._slides.length) this._index = Math.max(0, this._slides.length - 1);
    }

    _loadNotes() {
      const tag = document.getElementById('speaker-notes');
      if (!tag) { this._notes = []; return; }
      try {
        const parsed = JSON.parse(tag.textContent || '[]');
        if (Array.isArray(parsed)) this._notes = parsed;
      } catch (e) {
        console.warn('[deck-stage] Failed to parse #speaker-notes JSON:', e);
        this._notes = [];
      }
    }

    _restoreIndex() {
      // The host's ?slide= param is delivered as a #<int> hash (1-indexed) on
      // the iframe src. No hash → slide 1; the deck itself keeps no position
      // state across loads.
      const h = (location.hash || '').match(/^#(\d+)$/);
      if (h) {
        const n = parseInt(h[1], 10) - 1;
        if (n >= 0 && n < this._slides.length) this._index = n;
      }
    }

    _applyIndex({ showOverlay = true, broadcast = true, reason = 'init' } = {}) {
      if (!this._slides.length) return;
      const prev = this._prevIndex == null ? -1 : this._prevIndex;
      const curr = this._index;
      // Keep the iframe's own hash in sync so an in-iframe location.reload()
      // (reload banner path in viewer-handle.ts) lands on the current slide,
      // not the stale deep-link hash from initial load.
      try { history.replaceState(null, '', '#' + (curr + 1)); } catch (e) {}
      this._slides.forEach((s, i) => {
        if (i === curr) s.setAttribute('data-deck-active', '');
        else s.removeAttribute('data-deck-active');
      });
      if (this._countEl) this._countEl.textContent = String(curr + 1);

      if (broadcast) {
        // (1) Legacy: host-window postMessage for speaker-notes renderers.
        try { window.postMessage({ slideIndexChanged: curr }, '*'); } catch (e) {}

        // (2) In-page CustomEvent on the <deck-stage> element itself.
        //     Bubbles and composes out of shadow DOM so slide code can listen:
        //       document.querySelector('deck-stage').addEventListener('slidechange', e => {
        //         e.detail.index, e.detail.previousIndex, e.detail.total, e.detail.slide, e.detail.reason
        //       });
        const detail = {
          index: curr,
          previousIndex: prev,
          total: this._slides.length,
          slide: this._slides[curr] || null,
          previousSlide: prev >= 0 ? (this._slides[prev] || null) : null,
          reason: reason, // 'init' | 'keyboard' | 'click' | 'tap' | 'api'
        };
        this.dispatchEvent(new CustomEvent('slidechange', {
          detail,
          bubbles: true,
          composed: true,
        }));
      }

      this._prevIndex = curr;
      if (showOverlay) this._flashOverlay();
      this._refreshOverviewActive();
    }

    _flashOverlay() {
      if (!this._overlay) return;
      this._overlay.setAttribute('data-visible', '');
      if (this._hideTimer) clearTimeout(this._hideTimer);
      this._hideTimer = setTimeout(() => {
        this._overlay.removeAttribute('data-visible');
      }, OVERLAY_HIDE_MS);
    }

    /* Overview mode --------------------------------------------------------
     * Press 'o' to toggle a full-screen grid of slide thumbnails. Each
     * thumbnail is a deep clone of the live slide DOM, scaled with
     * transform: scale() — clones are static (no React, no state), which is
     * fine for visual previews. Lives in document.body (light DOM) so the
     * thumbnails inherit document fonts and global stylesheets. */

    _injectOverviewStyles() {
      if (document.getElementById('deck-stage-overview-style')) return;
      const style = document.createElement('style');
      style.id = 'deck-stage-overview-style';
      style.textContent = OVERVIEW_CSS;
      document.head.appendChild(style);
    }

    _toggleOverview() {
      if (this._overviewOpen) this._closeOverview();
      else this._openOverview();
    }

    _openOverview() {
      if (!this._slides.length) return;
      if (!this._overviewHost) {
        this._overviewHost = document.createElement('div');
        this._overviewHost.className = 'deck-overview-host';
        this._overviewHost.setAttribute('role', 'dialog');
        this._overviewHost.setAttribute('aria-label', 'Slides overview');
        document.body.appendChild(this._overviewHost);
      }
      this._buildOverviewContent();
      // Force reflow so the opacity transition runs from 0 → 1.
      void this._overviewHost.offsetWidth;
      this._overviewHost.setAttribute('data-open', '');
      this._overviewOpen = true;
      // Hide the bottom navigation overlay while overview is up.
      if (this._overlay) this._overlay.removeAttribute('data-visible');
      if (this._hideTimer) clearTimeout(this._hideTimer);
    }

    _closeOverview() {
      if (!this._overviewHost || !this._overviewOpen) return;
      this._overviewHost.removeAttribute('data-open');
      this._overviewOpen = false;
      // Clear cloned thumbnails after fade-out so we don't keep stale DOM,
      // and so the next open re-clones from the current slide state.
      const host = this._overviewHost;
      setTimeout(() => {
        if (!this._overviewOpen && host) host.innerHTML = '';
      }, 240);
    }

    _buildOverviewContent() {
      if (!this._overviewHost) return;
      this._overviewHost.innerHTML = '';

      const designW = this.designWidth;
      const designH = this.designHeight;
      const scale = OVERVIEW_THUMB_W / designW;
      const thumbH = designH * scale;

      const title = document.createElement('div');
      title.className = 'deck-overview-title';
      title.innerHTML = `
        <span class="label">Overview</span>
        <span class="hint">
          <span>點選跳轉</span>
          <span class="kbd">Esc</span><span>或</span><span class="kbd">o</span><span>關閉</span>
        </span>
      `;

      const grid = document.createElement('div');
      grid.className = 'deck-overview-grid';

      this._slides.forEach((slide, i) => {
        const thumb = document.createElement('div');
        thumb.className = 'deck-thumb';
        thumb.setAttribute('data-thumb-index', String(i));
        if (i === this._index) thumb.setAttribute('data-active', '');

        const frame = document.createElement('div');
        frame.className = 'deck-thumb-frame';
        frame.style.height = thumbH + 'px';

        const inner = document.createElement('div');
        inner.className = 'deck-thumb-inner';
        inner.style.width = designW + 'px';
        inner.style.height = designH + 'px';
        inner.style.transform = `scale(${scale})`;

        // Deep-clone the slide DOM. Strip ids on the clone tree so the
        // original (which React mounted into via getElementById) stays the
        // canonical target — clones are display-only.
        const clone = slide.cloneNode(true);
        clone.removeAttribute('data-deck-active');
        clone.removeAttribute('data-deck-slide');
        clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));

        inner.appendChild(clone);
        frame.appendChild(inner);
        thumb.appendChild(frame);

        const label = document.createElement('div');
        label.className = 'deck-thumb-label';
        const screenLabel = slide.getAttribute('data-screen-label') || `Slide ${i + 1}`;
        const labelText = screenLabel.replace(/^\s*\d+\s*/, '').trim() || `Slide ${i + 1}`;
        label.innerHTML = `<span class="deck-thumb-num">${pad2(i + 1)}</span><span>${labelText}</span>`;
        thumb.appendChild(label);

        thumb.addEventListener('click', () => {
          this._closeOverview();
          this._go(i, 'click');
        });

        grid.appendChild(thumb);
      });

      this._overviewHost.append(title, grid);
    }

    _refreshOverviewActive() {
      if (!this._overviewOpen || !this._overviewHost) return;
      const thumbs = this._overviewHost.querySelectorAll('.deck-thumb');
      thumbs.forEach((t, i) => {
        if (i === this._index) t.setAttribute('data-active', '');
        else t.removeAttribute('data-active');
      });
    }

    _fit() {
      if (!this._canvas) return;
      // PPTX export sets noscale so the DOM capture sees authored-size
      // geometry — the scaled canvas is in shadow DOM, so the exporter's
      // resetTransformSelector can't reach .canvas.style.transform directly.
      if (this.hasAttribute('noscale')) {
        this._canvas.style.transform = 'none';
        return;
      }
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const s = Math.min(vw / this.designWidth, vh / this.designHeight);
      this._canvas.style.transform = `scale(${s})`;
    }

    _onResize() { this._fit(); }

    _onMouseMove() {
      // Keep overlay visible while mouse moves; hide after idle.
      this._flashOverlay();
    }

    _onTapBack(e) {
      e.preventDefault();
      this._step(-1, 'tap');
    }

    _onTapForward(e) {
      e.preventDefault();
      this._step(1, 'tap');
    }

    _onKey(e) {
      // Ignore when the user is typing.
      const t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key;
      let handled = true;

      // Overview: 'o' toggles, Escape closes. Other keys close overview AND
      // perform their normal action so the user can quickly skim and resume.
      if (key === 'o' || key === 'O') {
        this._toggleOverview();
      } else if (key === 'Escape' && this._overviewOpen) {
        this._closeOverview();
      } else if (key === 'ArrowRight' || key === 'PageDown' || key === ' ' || key === 'Spacebar') {
        if (this._overviewOpen) this._closeOverview();
        this._step(1, 'keyboard');
      } else if (key === 'ArrowLeft' || key === 'PageUp') {
        if (this._overviewOpen) this._closeOverview();
        this._step(-1, 'keyboard');
      } else if (key === 'Home') {
        if (this._overviewOpen) this._closeOverview();
        this._go(0, 'keyboard');
      } else if (key === 'End') {
        if (this._overviewOpen) this._closeOverview();
        this._go(this._slides.length - 1, 'keyboard');
      } else if (key === 'r' || key === 'R') {
        if (this._overviewOpen) this._closeOverview();
        this._go(0, 'keyboard');
      } else if (key === 'a' || key === 'A') {
        if (this._overviewOpen) this._closeOverview();
        this._jumpToRole('agenda', 'keyboard');
      } else if (/^[0-9]$/.test(key)) {
        if (this._overviewOpen) this._closeOverview();
        // 1..9 jump to that slide; 0 jumps to 10.
        const n = key === '0' ? 9 : parseInt(key, 10) - 1;
        if (n < this._slides.length) this._go(n, 'keyboard');
      } else {
        handled = false;
      }

      if (handled) {
        e.preventDefault();
        if (!this._overviewOpen) this._flashOverlay();
      }
    }

    /* Sequential step that skips slides tagged data-deck-skip="true".
     * Use this for all "next / prev" intents (keyboard, tap, bottom nav,
     * public next() / prev()); use _go for direct jumps that should land
     * on the exact target regardless of skip flag. */
    _step(direction, reason = 'api') {
      let i = this._index + direction;
      while (
        i >= 0 && i < this._slides.length &&
        this._slides[i].getAttribute('data-deck-skip') === 'true'
      ) {
        i += direction;
      }
      this._go(i, reason);
    }

    _go(i, reason = 'api') {
      if (!this._slides.length) return;
      const clamped = Math.max(0, Math.min(this._slides.length - 1, i));
      if (clamped === this._index) {
        this._flashOverlay();
        return;
      }
      this._index = clamped;
      this._applyIndex({ showOverlay: true, broadcast: true, reason });
    }

    // Public API ------------------------------------------------------------

    /** Current slide index (0-based). */
    get index() { return this._index; }
    /** Total slide count. */
    get length() { return this._slides.length; }
    /** Programmatically navigate. */
    goTo(i) { this._go(i, 'api'); }
    next() { this._step(1, 'api'); }
    prev() { this._step(-1, 'api'); }
    reset() { this._go(0, 'api'); }

    /* Find the first slide whose section was tagged `data-deck-role="<role>"`
     * (set by main.jsx from the manifest entry's `role` field) and navigate
     * to it. No-op if no slide carries that role. */
    _jumpToRole(role, reason = 'api') {
      const idx = this._slides.findIndex((s) => s.getAttribute('data-deck-role') === role);
      if (idx >= 0) this._go(idx, reason);
    }
    /** Open / close / toggle the overview grid. */
    openOverview() { this._openOverview(); }
    closeOverview() { this._closeOverview(); }
    toggleOverview() { this._toggleOverview(); }
  }

  if (!customElements.get('deck-stage')) {
    customElements.define('deck-stage', DeckStage);
  }
})();

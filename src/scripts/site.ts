/**
 * Site-wide vanilla JS.
 *
 * All listeners are attached once (delegated to `document`) so they keep
 * working across Astro view-transition page swaps without re-execution.
 */

/* ── UI clicks (delegated) ─────────────────────────────────────── */
document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;

  // Copy-to-clipboard (contact page)
  const copyBtn = target.closest<HTMLElement>('[data-copy]');
  if (copyBtn) {
    const value = copyBtn.dataset.copy ?? '';
    const label = copyBtn.querySelector('[data-copy-label]');
    navigator.clipboard
      ?.writeText(value)
      .then(() => {
        if (!label) return;
        const original = label.textContent;
        label.textContent = 'Copied!';
        setTimeout(() => (label.textContent = original), 1600);
      })
      .catch(() => {});
    return;
  }

  // Status filter (games page)
  const filterBtn = target.closest<HTMLElement>('[data-filter]');
  if (filterBtn) {
    const filter = filterBtn.dataset.filter;
    document
      .querySelectorAll('[data-filter]')
      .forEach((b) => b.classList.toggle('filter-active', b === filterBtn));
    document.querySelectorAll<HTMLElement>('[data-status]').forEach((card) => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.status !== filter);
    });
  }
});

/* ── Keep the js flag across view-transition swaps ─────────────── */
document.addEventListener('astro:before-swap', (event) => {
  const { newDocument } = event as Event & { newDocument: Document };
  newDocument.documentElement.classList.add('js');
});

/* ── Scroll reveal ─────────────────────────────────────────────── */
function setupReveal() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.revealed)');
  if (els.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('revealed'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
  );
  els.forEach((el) => io.observe(el));
}
document.addEventListener('astro:page-load', setupReveal);

/* ── Synchronize blinking cursors (logo + hero) ────────────────
   A single interval drives every [data-cursor] element from one
   shared clock (performance.now), so all cursors blink together —
   no per-element CSS animation clocks to drift apart. */
const BLINK_MS = 1100;
let blinkTimer: number | undefined;

function startBlinkSync() {
  if (blinkTimer !== undefined) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  blinkTimer = window.setInterval(() => {
    const off = Math.floor(performance.now() / (BLINK_MS / 2)) % 2 === 1;
    document.querySelectorAll<HTMLElement>('[data-cursor]').forEach((el) => {
      el.classList.toggle('cursor-off', off);
    });
  }, BLINK_MS / 2);
}
document.addEventListener('astro:page-load', startBlinkSync);

/* ── Topbar logo animation ─────────────────────────────────────
   Cursor slides left, deletes back to "rg", then types the real
   name "raj_giri" — with the r/g letters kept in the accent red.
   Loops back to "Overduerg".                                       */
const NAME = 'overduerg';
const TARGET_RED = 2; // trailing "rg" is the highlighted pair

let logoCancel: (() => void) | undefined;

function setupLogoAnim() {
  logoCancel?.();
  logoCancel = undefined;

  const root = document.querySelector<HTMLElement>('[data-logo-name]');
  if (!root) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const chars = [...NAME].map((c, i) => ({ c, red: i >= NAME.length - TARGET_RED }));
  let cursor = NAME.length;
  let cancelled = false;
  let timer = 0;

  const sleep = (ms: number) =>
    new Promise<void>((resolve) => {
      timer = window.setTimeout(resolve, ms);
    });

  const cursorEl = document.createElement('span');
  cursorEl.textContent = '_';
  cursorEl.className = 'text-accent';
  cursorEl.dataset.cursor = '';

  const render = () => {
    root.textContent = '';
    chars.forEach((ch, i) => {
      if (i === cursor) root.append(cursorEl);
      const span = document.createElement('span');
      span.textContent = ch.c;
      if (ch.red) span.className = 'text-accent';
      root.append(span);
    });
    if (cursor >= chars.length) root.append(cursorEl);
  };

  const move = (to: number) => async () => {
    while (cursor !== to && !cancelled) {
      cursor += cursor < to ? 1 : -1;
      render();
      await sleep(90);
    }
  };
  const del = () => async () => {
    if (cursor > 0) chars.splice(cursor - 1, 1);
    cursor = Math.max(0, cursor - 1);
    render();
    await sleep(60);
  };
  const type = (c: string, red = false) => async () => {
    chars.splice(cursor, 0, { c, red });
    cursor += 1;
    render();
    await sleep(85);
  };
  const wait = (ms: number) => () => sleep(ms);

  const steps = [
    wait(1800),
    move(7), // cursor slides back to sit before the trailing "rg"
    del(),
    del(),
    del(),
    del(),
    del(),
    del(),
    del(), // "Overdue" deleted one by one
    move(1), // after the surviving "r"
    type('a', true),
    type('j', true),
    type('_'),
    move(5), // after the surviving "g"
    type('i', true),
    type('r', true),
    type('i', true),
    wait(2400), // hold on "raj_giri"
    del(),
    del(),
    del(), // "iri" out
    move(4),
    del(),
    del(),
    del(), // "_" then "aj" out
    move(0),
    type('o'),
    type('v'),
    type('e'),
    type('r'),
    type('d'),
    type('u'),
    type('e'), // "Overdue" retyped
    move(9),
  ];

  void (async () => {
    render();
    while (!cancelled) {
      for (const step of steps) {
        if (cancelled) return;
        await step();
      }
    }
  })();

  logoCancel = () => {
    cancelled = true;
    window.clearTimeout(timer);
  };
}

document.addEventListener('astro:page-load', setupLogoAnim);

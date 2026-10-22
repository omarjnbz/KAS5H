/*
 * Motion system: GSAP + ScrollTrigger, Lenis as the only smooth-scroll engine.
 * Everything here is additive — the page renders complete without it, and under
 * prefers-reduced-motion we render final states and never start Lenis.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'power3.out', duration: 0.85 });

export const reduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = () => window.matchMedia('(pointer: coarse)').matches;

let lenis = null;
let tick = null;

export function startLenis() {
  if (lenis || reduceMotion()) return;
  lenis = new Lenis({ lerp: 0.08, smoothWheel: true, wheelMultiplier: 0.9, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  tick = (t) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  document.documentElement.classList.add('has-motion');
}

export function stopLenis() {
  if (!lenis) return;
  gsap.ticker.remove(tick);
  lenis.destroy();
  lenis = null;
  document.documentElement.classList.remove('has-motion');
}

/* Jump (no easing) to a page offset, through Lenis when it's running. */
export function jumpTo(y) {
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo(0, y);
}

/* Hold the page still under a modal, and let it go again. */
export function holdScroll(hold) {
  lenis?.[hold ? 'stop' : 'start']();
  document.documentElement.style.overflow = hold ? 'hidden' : '';
}

/*
 * Reveals play once and stay played. Not `once: true`: a once-trigger that's
 * already scrolled past kills itself while it's still being created, and when
 * the alias switches near the bottom of the page that happens to every reveal
 * above you at once, which crashes ScrollTrigger's refresh.
 */
const REVEAL = { start: 'top 84%', toggleActions: 'play none none none' };

/*
 * Runs inside a gsap.context scoped to `root`; the caller reverts that context
 * and calls the function this returns, which removes the DOM listeners.
 */
export function initMotion(root) {
  const rm = reduceMotion();
  const q = gsap.utils.selector(root);
  const listeners = new AbortController();
  const on = { signal: listeners.signal };
  const cleanup = () => listeners.abort();

  // Final states, no animation.
  if (rm) {
    gsap.set(q('[data-words] .w, [data-reveal], [data-clip]'), { clearProps: 'all', autoAlpha: 1 });
    return cleanup;
  }

  /* --- Hero intro: frame → name → frame chrome → action → cards --- */
  const hero = root.querySelector('[data-hero]');
  if (hero) {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.fromTo(q('[data-hero-media]'), { clipPath: 'inset(0 0 100% 0 round 28px)' }, { clipPath: 'inset(0 0 0% 0 round 28px)', duration: 1.2 }, 0)
      // One wrapper scales photo, name and cutout together, so the cutout never slips.
      .fromTo(q('[data-hero-media] .stage-zoom'), { scale: 1.12 }, { scale: 1, duration: 1.5 }, 0)
      // y: 0 on both ends: after an alias switch the CSS pre-state (translateY 110%)
      // is already applied, and GSAP would otherwise keep it as an extra y offset,
      // leaving the title parked below its mask.
      .fromTo(q('[data-hero-title] > *'), { y: 0, yPercent: 110 }, { y: 0, yPercent: 0, duration: 1.1 }, 0.35)
      .fromTo(q('[data-hero-chrome]'), { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06 }, 0.7)
      .fromTo(q('[data-hero-cta] > *'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.8)
      .fromTo(q('[data-hero-cards] > *'), { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.09 }, 0.85)
      // Leave the clip off once it's open: a clip-path would cut the frame's shadow.
      .set(q('[data-hero-media]'), { clearProps: 'clipPath' });
  }

  /* --- Word reveals (markup pre-split by <Words/>) --- */
  q('[data-words]').forEach((el) => {
    const words = el.querySelectorAll('.w');
    gsap.fromTo(words,
      { yPercent: 110, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.9, ease: 'power4.out', stagger: 0.05,
        scrollTrigger: { trigger: el, ...REVEAL } });
  });

  /* --- Generic reveals --- */
  q('[data-reveal]').forEach((el) => {
    gsap.fromTo(el,
      { y: 32, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power4.out', delay: Number(el.dataset.revealDelay || 0),
        scrollTrigger: { trigger: el, ...REVEAL } });
  });

  /* --- Clip reveals on photography --- */
  q('[data-clip]').forEach((fig) => {
    const img = fig.querySelector('img');
    const tl = gsap.timeline({ scrollTrigger: { trigger: fig, ...REVEAL, start: 'top 82%' } });
    tl.fromTo(fig, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power4.out' })
      .fromTo(img, { scale: 1.08 }, { scale: 1, duration: 1.2, ease: 'power4.out' }, 0);
  });

  /* --- Parallax: images drift slower than the page --- */
  q('[data-parallax]').forEach((layer) => {
    const speed = Number(layer.dataset.parallax || 0.12);
    gsap.to(layer, {
      y: () => -window.innerHeight * speed, ease: 'none',
      scrollTrigger: { trigger: layer.closest('section, footer') || layer, start: 'top bottom', end: 'bottom top', scrub: 1.2, invalidateOnRefresh: true },
    });
  });

  if (coarse()) return cleanup;

  /* --- Magnetic CTAs --- */
  q('[data-magnetic]').forEach((el) => {
    const k = Number(el.dataset.magnetic || 0.18);
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45 });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45 });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * k);
      yTo((e.clientY - r.top - r.height / 2) * k);
    }, on);
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); }, on);
  });

  /* --- Pointer depth in the hero --- */
  if (hero) {
    const layers = [...hero.querySelectorAll('[data-depth]')].map((layer) => ({
      d: Number(layer.dataset.depth || 0.03),
      xTo: gsap.quickTo(layer, 'x', { duration: 0.8 }),
      yTo: gsap.quickTo(layer, 'y', { duration: 0.8 }),
    }));
    const reset = () => layers.forEach(({ xTo, yTo }) => { xTo(0); yTo(0); });
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      layers.forEach(({ d, xTo, yTo }) => { xTo(x * d); yTo(y * d); });
    }, on);
    hero.addEventListener('pointerleave', reset, on);
    // Used to pile up: one more window listener on every alias switch, all
    // still pointing at the old, unmounted hero.
    window.addEventListener('blur', reset, on);
  }

  return cleanup;
}

export { gsap, ScrollTrigger };

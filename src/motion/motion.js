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

/* Runs inside a gsap.context scoped to `root`; caller reverts on cleanup. */
export function initMotion(root) {
  const rm = reduceMotion();
  const q = gsap.utils.selector(root);

  // Final states, no animation.
  if (rm) {
    gsap.set(q('[data-words] .w, [data-reveal], [data-clip]'), { clearProps: 'all', autoAlpha: 1 });
    return;
  }

  /* --- Hero intro: media → kicker → title → copy → CTA --- */
  const hero = root.querySelector('[data-hero]');
  if (hero) {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.fromTo(q('[data-hero-media]'), { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.2 }, 0)
      .fromTo(q('[data-hero-media] .hero-photo'), { scale: 1.12 }, { scale: 1, duration: 1.5 }, 0)
      .fromTo(q('[data-hero-kicker]'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.25)
      .fromTo(q('[data-hero-title] > *'), { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.09 }, 0.35)
      .fromTo(q('[data-hero-copy]'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.75)
      .fromTo(q('[data-hero-cta] > *'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.9)
      .fromTo(q('[data-hero-media] .bk'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.5, stagger: 0.05 }, 1.0);
  }

  /* --- Word reveals (markup pre-split by <Words/>) --- */
  q('[data-words]').forEach((el) => {
    const words = el.querySelectorAll('.w');
    gsap.fromTo(words,
      { yPercent: 110, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.9, ease: 'power4.out', stagger: 0.05,
        scrollTrigger: { trigger: el, start: 'top 84%', once: true } });
  });

  /* --- Generic reveals --- */
  q('[data-reveal]').forEach((el) => {
    gsap.fromTo(el,
      { y: 32, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power4.out', delay: Number(el.dataset.revealDelay || 0),
        scrollTrigger: { trigger: el, start: 'top 84%', once: true } });
  });

  /* --- Clip reveals on photography --- */
  q('[data-clip]').forEach((fig) => {
    const img = fig.querySelector('img');
    const tl = gsap.timeline({ scrollTrigger: { trigger: fig, start: 'top 82%', once: true } });
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

  if (coarse()) return;

  /* --- Magnetic CTAs --- */
  q('[data-magnetic]').forEach((el) => {
    const k = Number(el.dataset.magnetic || 0.18);
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45 });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45 });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * k);
      yTo((e.clientY - r.top - r.height / 2) * k);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
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
    });
    hero.addEventListener('pointerleave', reset);
    window.addEventListener('blur', reset);
  }
}

export { gsap, ScrollTrigger };

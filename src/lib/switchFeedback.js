/*
 * The click and the colour flash when the site changes alias. Shared by the
 * HUD at the top and the split section at the bottom so both feel the same.
 *
 * One AudioContext for the page: browsers cap how many a page may open, and the
 * old version created a new one on every click until the sound stopped working.
 */
let audio = null;
const getAudio = () => {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audio) audio = new Ctx();
  if (audio.state === 'suspended') audio.resume();
  return audio;
};

const blip = (ctx, { type, from, to, gain, length, at = 0 }) => {
  const t = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(to, t + length);
  amp.gain.setValueAtTime(gain, t);
  amp.gain.exponentialRampToValueAtTime(0.001, t + length);
  osc.connect(amp).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + length + 0.02);
};

const SOUNDS = {
  // KAS5H: a mechanical double click.
  garagesale: [
    { type: 'sawtooth', from: 150, to: 40, gain: 0.25, length: 0.1 },
    { type: 'triangle', from: 110, to: 30, gain: 0.18, length: 0.08, at: 0.05 },
  ],
  // M0rf: a sub thud with a thin digital chirp on top.
  m0rf: [
    { type: 'sine', from: 80, to: 20, gain: 0.35, length: 0.2 },
    { type: 'square', from: 2400, to: 1200, gain: 0.025, length: 0.06 },
    { type: 'square', from: 1800, to: 900, gain: 0.02, length: 0.05, at: 0.08 },
  ],
};

const FLASH = { garagesale: '#ff3300', m0rf: '#4422ff' };

export default function switchFeedback(target) {
  try {
    const ctx = getAudio();
    if (ctx) SOUNDS[target].forEach((s) => blip(ctx, s));
  } catch {
    // Sound is decoration; a blocked or missing audio API changes nothing else.
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const flash = document.createElement('div');
  flash.style.cssText = `position:fixed;inset:0;z-index:99999;pointer-events:none;background:${FLASH[target]};opacity:.85;transition:opacity .35s ease`;
  document.body.appendChild(flash);
  flash.getBoundingClientRect(); // commit the start state so the fade runs
  flash.style.opacity = '0';
  setTimeout(() => flash.remove(), 400);
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { PHOTOS, VIDEOS, PHOTOS_FOLDER, VIDEOS_FOLDER, driveDownload } from '../content/press';
import { holdScroll } from '../motion/motion';

/*
 * Press chapter: the whole kit, moving. Two rows of photos slide in opposite
 * directions (hover or keyboard focus pauses a row). Clips play in their own
 * row once their web versions exist (see content/press.js). Any frame opens
 * the viewer: ←/→ walk the whole kit, every item downloads from Drive.
 */
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function PressReel({ title, marker }) {
  const clips = VIDEOS.filter((v) => v.clip);
  const items = [
    ...PHOTOS.map((p) => ({ kind: 'photo', ...p })),
    ...clips.map((v) => ({ kind: 'clip', ...v })),
  ];
  const [open, setOpen] = useState(-1);
  const half = Math.ceil(PHOTOS.length / 2);
  const count = items.length;
  const step = useCallback((d) => setOpen((i) => (i + d + count) % count), [count]);
  const close = useCallback(() => setOpen(-1), []);

  return (
    <section className="press chapter" id="press" aria-labelledby="press-title">
      <div className="container press-head">
        <h2 className="section-title font-heading" id="press-title" data-reveal>{title}</h2>
        <p className="press-line font-mono" data-reveal data-reveal-delay="0.1">
          {marker} {PHOTOS.length} PHOTOS · {VIDEOS.length} CLIPS · FREE FOR PROMOTERS &amp; PRESS — TAP ANY FRAME TO VIEW &amp; DOWNLOAD
        </p>
      </div>

      <div className="reel" data-reveal>
        <Row photos={PHOTOS.slice(0, half)} offset={0} onOpen={setOpen} />
        <Row photos={PHOTOS.slice(half)} offset={half} onOpen={setOpen} reverse />
      </div>

      {clips.length > 0 && (
        <div className="container reel-clips" data-reveal>
          {clips.map((v, i) => (
            <button
              key={v.slug}
              type="button"
              className={`clip-tile ${v.portrait ? 'is-portrait' : ''}`}
              onClick={() => setOpen(PHOTOS.length + i)}
              aria-label={`Play ${v.label.toLowerCase()}`}
            >
              <LoopVideo src={v.clip} poster={v.still} />
              <span className="clip-label font-mono">{v.label}</span>
              <span className="clip-play" aria-hidden="true"><Icon icon="solar:play-bold" width="20" /></span>
            </button>
          ))}
        </div>
      )}

      <div className="container press-foot font-mono" data-reveal>
        <a className="press-dl" href={PHOTOS_FOLDER} target="_blank" rel="noreferrer">
          <Icon icon="solar:gallery-wide-bold" width="18" aria-hidden="true" /> ALL {PHOTOS.length} PHOTOS
          <Icon icon="solar:arrow-right-up-linear" width="14" aria-hidden="true" />
        </a>
        <a className="press-dl" href={VIDEOS_FOLDER} target="_blank" rel="noreferrer">
          <Icon icon="solar:clapperboard-play-bold" width="18" aria-hidden="true" /> ALL {VIDEOS.length} CLIPS
          <Icon icon="solar:arrow-right-up-linear" width="14" aria-hidden="true" />
        </a>
        <span className="press-note">FULL RESOLUTION ON GOOGLE DRIVE</span>
      </div>

      {open >= 0 && (
        <Viewer items={items} index={open} onStep={step} onClose={close} />
      )}
    </section>
  );
}

/* One sliding row. Rendered twice over so translateX(-50%) loops without a seam;
   the second pass is hidden from screen readers and the tab order. */
function Row({ photos, offset, onOpen, reverse = false }) {
  return (
    <div className={`reel-row ${reverse ? 'reel-row--rev' : ''}`} style={{ '--reel-dur': `${photos.length * 5}s` }}>
      <ul className="reel-track">
        {[0, 1].map((pass) =>
          photos.map((p, i) => (
            <li key={`${pass}-${p.file}`} className="reel-item" aria-hidden={pass ? 'true' : undefined}>
              <button
                type="button"
                className="reel-tile"
                tabIndex={pass ? -1 : 0}
                onClick={() => onOpen(offset + i)}
                aria-label={`View press photo ${offset + i + 1} of ${PHOTOS.length}`}
              >
                <img
                  src={`/promo/thumbs/${p.file}.jpg`}
                  srcSet={`/promo/thumbs/${p.file}.jpg 560w, /promo/${p.file}.jpg 1000w`}
                  sizes="(max-width: 640px) 280px, 420px"
                  width={p.w}
                  height={p.h}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

/* A muted loop that only plays while on screen. */
function LoopVideo({ src, poster }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || reduced()) return undefined;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" aria-hidden="true" />;
}

function Viewer({ items, index, onStep, onClose }) {
  const item = items[index];
  const dialog = useRef(null);
  const closeBtn = useRef(null);

  useEffect(() => {
    const opener = document.activeElement;
    holdScroll(true);
    closeBtn.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onStep(1);
      else if (e.key === 'ArrowLeft') onStep(-1);
      else if (e.key === 'Tab') {
        // Keep focus inside the viewer.
        const f = [...dialog.current.querySelectorAll('button, a[href], video[controls]')];
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      holdScroll(false);
      opener?.focus?.({ preventScroll: true });
    };
  }, [onClose, onStep]);

  const isClip = item.kind === 'clip';
  const n = index + 1;

  return createPortal(
    <div className="viewer" role="dialog" aria-modal="true" aria-label="Press kit viewer" onClick={onClose} ref={dialog}>
      <div className="viewer-stage" onClick={(e) => e.stopPropagation()}>
        {isClip ? (
          <video key={item.slug} className="viewer-media" src={item.clip} poster={item.still} controls autoPlay playsInline />
        ) : (
          <img key={item.file} className="viewer-media" src={`/promo/${item.file}.jpg`} alt={`KAS5H press photo ${n} of ${PHOTOS.length}`} />
        )}
        <div className="viewer-bar font-mono">
          <span>{isClip ? item.label : 'PRESS PHOTO'} — {String(n).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
          <a className="viewer-dl" href={driveDownload(item.id)} rel="noreferrer">
            <Icon icon="solar:download-minimalistic-bold" width="16" aria-hidden="true" /> {isClip ? 'DOWNLOAD ORIGINAL' : 'DOWNLOAD FULL RES'}
          </a>
        </div>
      </div>
      <button type="button" className="viewer-nav viewer-nav--prev" onClick={(e) => { e.stopPropagation(); onStep(-1); }} aria-label="Previous">
        <Icon icon="solar:alt-arrow-left-linear" width="28" aria-hidden="true" />
      </button>
      <button type="button" className="viewer-nav viewer-nav--next" onClick={(e) => { e.stopPropagation(); onStep(1); }} aria-label="Next">
        <Icon icon="solar:alt-arrow-right-linear" width="28" aria-hidden="true" />
      </button>
      <button type="button" className="viewer-close font-mono" onClick={onClose} ref={closeBtn}>✕ CLOSE</button>
    </div>,
    document.body
  );
}

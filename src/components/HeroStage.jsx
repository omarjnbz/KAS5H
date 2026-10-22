import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import Name from './Name';
import { reduceMotion } from '../motion/motion';

const HOLD = 5200; // ms each still stays up

/*
 * The hero frame: the studio stills, cycling, with the alias name set behind
 * his head. Three stacks share one index:
 *   wash  — the still again, blurred to cover, so the 2:3 photo sits in a 16:9 room
 *   photo — the still, centred, full height
 *   name  — the h1
 *   cut   — the still once more through its subject mask, over the name
 * Photo and cut are the same box, so the cutout lines up exactly.
 * Stills never auto-advance under reduced motion; the pause button stops them too.
 */
export default function HeroStage({ name, stills, marker, kicker, tag }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(reduceMotion);
  const count = stills.length;

  useEffect(() => {
    if (paused || count < 2) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), HOLD);
    return () => clearInterval(timer);
  }, [paused, count]);

  const layer = (kind) =>
    stills.map((s, i) => (
      <img
        key={s.src}
        src={s.src}
        alt={kind === 'photo' ? s.alt : ''}
        aria-hidden={kind === 'photo' && i === index ? undefined : true}
        className={i === index ? 'is-on' : undefined}
        style={kind === 'cut' ? { '--cut': `url(${s.mask})` } : undefined}
        fetchPriority={i === 0 ? 'high' : undefined}
        draggable="false"
      />
    ));

  return (
    <div className="stage" data-hero-media>
      <div className="stage-zoom">
        <div className="stage-wash" aria-hidden="true">{layer('wash')}</div>
        <div className="stage-photo">{layer('photo')}</div>
        <h1 className="stage-name font-heading" data-hero-title data-depth="0.018">
          <span><Name text={name} /></span>
        </h1>
        <div className="stage-photo stage-cut" aria-hidden="true">{layer('cut')}</div>
      </div>

      <p className="stage-tag font-mono" data-hero-chrome>{marker} {tag}</p>
      <p className="stage-kicker font-mono" data-hero-chrome>{kicker}</p>

      {count > 1 && (
        <div className="stage-controls" data-hero-chrome>
          <span className="stage-count font-mono" aria-hidden="true">
            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
          <button
            type="button"
            className="stage-btn"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Play the photos' : 'Pause the photos'}
          >
            <Icon icon={paused ? 'solar:play-bold' : 'solar:pause-bold'} width="14" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="stage-btn"
            onClick={() => setIndex((i) => (i + 1) % count)}
            aria-label={`Next photo (${index + 1} of ${count})`}
          >
            <Icon icon="solar:alt-arrow-right-linear" width="16" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

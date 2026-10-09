import { Icon } from '@iconify/react';

/*
 * The transport under the crate: play/pause, what's on, a seekable progress
 * line, and the way out to SoundCloud. State comes from useSoundCloud in App,
 * which also owns the hidden iframe (outside the themed subtree, so switching
 * alias doesn't remount the stream).
 */
const fmt = (ms) => {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
};

export default function CratePlayer({ track, state, marker }) {
  const { ready, playing, position, duration, toggle, seek } = state;
  const frac = duration ? position / duration : 0;

  const onSeek = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    seek((e.clientX - r.left) / r.width);
  };

  return (
    <div className="crate-bar font-mono" data-playing={playing ? '' : undefined}>
      <button
        type="button"
        className="crate-play"
        onClick={toggle}
        disabled={!ready}
        aria-label={playing ? 'Pause' : 'Play'}
        data-magnetic="0.14"
      >
        <Icon icon={playing ? 'solar:pause-bold' : 'solar:play-bold'} width="22" aria-hidden="true" />
      </button>

      <div className="crate-now">
        <span className="crate-now-tag">{marker} {playing ? 'NOW SPINNING' : ready ? 'ON THE DECK' : 'LOADING'}</span>
        <span className="crate-now-title">{track.title}</span>
      </div>

      <div className="crate-time" aria-hidden="true">
        {fmt(position)} <span className="crate-time-sep">/</span> {duration ? fmt(duration) : '--:--'}
      </div>

      <a className="crate-out" href={track.url} target="_blank" rel="noreferrer">
        SOUNDCLOUD <Icon icon="solar:arrow-right-up-linear" width="14" aria-hidden="true" />
      </a>

      <div
        className="crate-progress"
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(frac * 100)}
        tabIndex={0}
        onClick={onSeek}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') seek(frac + 0.05);
          if (e.key === 'ArrowLeft') seek(frac - 0.05);
        }}
      >
        <span className="crate-progress-fill" style={{ transform: `scaleX(${frac})` }} />
      </div>
    </div>
  );
}

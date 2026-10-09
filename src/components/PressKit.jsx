import { Icon } from '@iconify/react';

/*
 * Press chapter: three selected stills, full-bleed and editorial, and one line
 * that hands promoters the whole kit on Drive. The gallery-as-file-browser is
 * gone; visitors get three strong images, press gets the folders.
 *
 * Stills live in public/press. Counts and folder links come from content.
 */
const STILLS = [
  { src: '/press/booth-wide.jpg', alt: 'KAS5H on the decks, arm raised, crowd behind', wide: true },
  { src: '/press/portrait-blue.jpg', alt: 'KAS5H portrait in blue light, tattooed hand to face' },
  { src: '/press/booth-lights.jpg', alt: 'KAS5H in the booth under stage lights' },
];

export default function PressKit({ title, kit, marker }) {
  return (
    <section className="press chapter" id="press" aria-labelledby="press-title">
      <div className="container press-head">
        <h2 className="section-title font-heading" id="press-title" data-reveal>{title}</h2>
        <p className="press-line font-mono" data-reveal data-reveal-delay="0.1">
          {marker} PRESS KIT — {kit.photos} PHOTOS · {kit.videos} CLIPS · FREE FOR PROMOTERS &amp; PRESS
        </p>
      </div>

      <div className="press-stills">
        {STILLS.map((s, i) => (
          <figure key={s.src} className={`press-still ${s.wide ? 'press-still--wide' : ''}`} data-clip>
            <img src={s.src} alt={s.alt} loading="lazy" decoding="async" data-parallax={i === 0 ? '0.05' : '0.08'} />
          </figure>
        ))}
      </div>

      <div className="container press-foot font-mono" data-reveal>
        <a className="press-dl" href={kit.photosFolder} target="_blank" rel="noreferrer" data-magnetic="0.1">
          <Icon icon="solar:gallery-wide-bold" width="18" aria-hidden="true" /> ALL {kit.photos} PHOTOS
          <Icon icon="solar:arrow-right-up-linear" width="14" aria-hidden="true" />
        </a>
        <a className="press-dl" href={kit.videosFolder} target="_blank" rel="noreferrer" data-magnetic="0.1">
          <Icon icon="solar:clapperboard-play-bold" width="18" aria-hidden="true" /> ALL {kit.videos} CLIPS
          <Icon icon="solar:arrow-right-up-linear" width="14" aria-hidden="true" />
        </a>
        <span className="press-note">GOOGLE DRIVE · ANYONE WITH THE LINK</span>
      </div>
    </section>
  );
}

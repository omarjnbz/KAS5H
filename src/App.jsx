import React, { useState, useEffect, useLayoutEffect, useMemo, useRef, useCallback } from 'react';
import { Icon } from '@iconify/react';
import BackgroundCanvas from './components/BackgroundCanvas';
import Nav from './components/Nav';
import Ticker from './components/Ticker';
import Words from './components/Words';
import TextDistort from './components/TextDistort';
import PressReel from './components/PressReel';
import InstagramFeed from './components/InstagramFeed';
import Name from './components/Name';
import DiscCascadeCarousel from './components/DiscCascadeCarousel';
import CratePlayer from './components/CratePlayer';
import useSoundCloud from './lib/useSoundCloud';
import switchFeedback from './lib/switchFeedback';
import {
  ARTISTS, releasesFor, FIRST_RELEASE, SOUNDCLOUD, INSTAGRAM, INSTAGRAM_FEED, BOOKING_EMAIL, embedSrc,
} from './content/artists';
import { gsap, ScrollTrigger, initMotion, startLenis, stopLenis, jumpTo } from './motion/motion';
import './App.css';

/* The track the hidden player boots with: the newest KAS5H release (the site opens on KAS5H). */
const BOOT = releasesFor('garagesale')[0] ?? FIRST_RELEASE;

/* Discs that hold the place for an alias with nothing out yet: generated labels, no audio. */
const RESERVED_PALETTES = [
  ['#eceff4', '#4422ff', '#0b0c14'],
  ['#4422ff', '#eceff4', '#b7a4ff'],
  ['#0b0c14', '#b7a4ff', '#4422ff'],
];
const reservedFor = (a) =>
  ['halftone', 'stripes', 'mosaic'].map((pattern, i) => ({
    title: `Transmission 0${i + 1}`,
    label: `${a.name} · 0${i + 1}`,
    pattern,
    palette: RESERVED_PALETTES[i],
    fine: `${a.name} · RESERVED · FIRST TRANSMISSION INCOMING`,
    credits: [
      { label: 'Artist', value: a.name },
      { label: 'Status', value: 'Reserved' },
    ],
  }));

/* Which chapter is on screen, and where, so switching alias keeps you in place. */
const placeOnPage = (root) => {
  if (!root) return null;
  const probe = window.innerHeight * 0.35;
  const el = [...root.querySelectorAll(':scope > section[id], :scope > footer[id]')].find((s) => {
    const r = s.getBoundingClientRect();
    return r.top <= probe && r.bottom > probe;
  });
  return el ? { id: el.id, top: el.getBoundingClientRect().top } : null;
};

function App() {
  const [theme, setTheme] = useState('garagesale');
  const a = ARTISTS[theme];
  const isM0rf = theme === 'm0rf';
  const root = useRef(null);
  const place = useRef(null);

  // The crate: this alias's releases, which disc is up, and the widget that plays it.
  const releases = useMemo(() => releasesFor(theme), [theme]);
  const [release, setRelease] = useState(0);
  const current = releases[release];
  const playerFrame = useRef(null);
  const player = useSoundCloud(playerFrame, current?.id, BOOT?.id);
  const { pause } = player;

  const switchAlias = useCallback((next) => {
    if (next === theme) return;
    place.current = placeOnPage(root.current);
    pause(); // the other alias's music doesn't belong on this page
    setRelease(0);
    switchFeedback(next);
    setTheme(next);
  }, [theme, pause]);

  const playLatest = () => {
    if (release === 0) player.play();
    else { player.playOnLoad(); setRelease(0); }
  };

  // Theme class drives the CSS variables; the browser chrome follows too.
  useEffect(() => {
    document.body.classList.toggle('theme-garagesale', !isM0rf);
    document.body.classList.toggle('theme-m0rf', isM0rf);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', a.themeColor);
  }, [isM0rf, a.themeColor]);

  // One Lenis for the page lifetime. Warm the other alias's hero so a switch is instant.
  useEffect(() => {
    startLenis();
    const onLoad = () => {
      ScrollTrigger.refresh();
      Object.values(ARTISTS).forEach((x) => { new Image().src = x.images.hero.src; });
    };
    window.addEventListener('load', onLoad);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => { window.removeEventListener('load', onLoad); stopLenis(); };
  }, []);

  // The themed subtree remounts on every switch (key={theme}); put the reader back
  // where they were, then rebuild the motion for the new markup.
  useLayoutEffect(() => {
    const p = place.current;
    place.current = null;
    if (p) {
      const el = document.getElementById(p.id);
      if (el) jumpTo(window.scrollY + el.getBoundingClientRect().top - p.top);
    }
    let cleanup;
    const ctx = gsap.context(() => { cleanup = initMotion(root.current); }, root);
    ScrollTrigger.refresh();
    return () => { cleanup?.(); ctx.revert(); };
  }, [theme]);

  const discs = releases.length
    ? releases.map((r) => ({ title: r.title, credits: r.credits, src: r.cover, alt: `${r.title} cover`, label: '' }))
    : reservedFor(a);

  return (
    <div className="landing-wrapper" id="top">
      <div className="noise-overlay" />
      <div className="scanlines" />
      <BackgroundCanvas theme={theme} isPlaying={player.playing} />
      <Nav theme={theme} onSwitch={switchAlias} name={a.name} />

      {/* The real SoundCloud player the crate drives. Outside the themed subtree so
          switching alias doesn't remount it; hidden, never removed. */}
      {BOOT && (
        <div className="crate-iframe" aria-hidden="true">
          <iframe
            ref={playerFrame}
            title="SoundCloud player"
            width="100%" height="166" scrolling="no" frameBorder="no"
            allow="autoplay; encrypted-media"
            src={embedSrc(ARTISTS.garagesale, BOOT, false)}
          />
        </div>
      )}

      <div ref={root} key={theme}>
        {/* 1. HERO */}
        <section className="hero-section container" data-hero>
          <div className="hero-grid">
            <div className="hero-content" data-depth="0.012">
              <div className="hero-subtitle font-mono" data-hero-kicker>{a.marker} {a.hero.kicker}</div>

              <h1 className="hero-title font-heading" data-hero-title>
                <span><TextDistort text={a.hero.title} theme={theme} /></span>
                <span className="text-stroke">{a.hero.stroke}</span>
              </h1>

              <p className="hero-desc" data-hero-copy>{a.hero.lead}</p>

              <div className="hero-cta" data-hero-cta>
                {a.hero.cta.action === 'play' && current ? (
                  // Straight to the crate, playing. Lenis handles the anchor.
                  <a href="#tracks" className="btn-primary btn-primary--solid" data-magnetic onClick={playLatest}>
                    <Icon icon={a.hero.cta.icon} width="16" aria-hidden="true" /> {a.hero.cta.label}
                  </a>
                ) : (
                  <a href="#book" className="btn-primary btn-primary--solid" data-magnetic>
                    {/* One span: the button is a flex row, and a bare <Name> would make
                        the zero its own flex item with a gap either side. */}
                    <Icon icon={a.hero.cta.icon} width="16" aria-hidden="true" /> <span><Name text={a.hero.cta.label} /></span>
                  </a>
                )}
                <a href={SOUNDCLOUD} target="_blank" rel="noreferrer" className="hero-link font-mono">
                  SOUNDCLOUD <Icon icon="solar:arrow-right-up-linear" width="14" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="hero-visual" data-depth="0.025">
              <div className={`hero-photo-frame ${a.frame}`} data-hero-media>
                <img src={a.images.hero.src} alt={a.images.hero.alt} className="hero-photo" fetchPriority="high" />
                <div className="hero-photo-grain" />
                <div className="hero-photo-brackets">
                  <span className="bk bk-tl" /><span className="bk bk-tr" />
                  <span className="bk bk-bl" /><span className="bk bk-br" />
                </div>
                <span className="hero-photo-tag font-mono">{a.hero.tag}</span>
              </div>
            </div>
          </div>
        </section>

        <Ticker items={a.ticker} marker={a.marker} />

        {/* 2. THE CRATE — work first */}
        <section className="tracks-section chapter" id="tracks">
          <div className="container">
            <div className="brands-header">
              <Words as="h2" className="section-title font-heading" text={a.tracks.title} />
              <p className="section-subtitle font-mono" data-reveal>{a.tracks.subtitle}</p>
            </div>

            {/* Real covers on the discs; the chosen disc is the play button.
                An alias with nothing out yet gets reserved discs instead. */}
            <div className={`crate ${releases.length ? '' : 'crate--reserved'}`} data-reveal>
              <DiscCascadeCarousel
                items={discs}
                index={Math.min(release, discs.length - 1)}
                onIndexChange={setRelease}
                onSelect={releases.length ? player.toggle : undefined}
                height="clamp(420px, 62svh, 620px)"
                discSize="clamp(200px, min(48vmin, 36vw), 400px)"
                brand=""
                indexLabel=""
                reviews={false}
                frame={false}
                hint={
                  !releases.length ? 'RESERVED // FIRST TRANSMISSION INCOMING'
                    : player.playing ? 'TAP THE DISC TO PAUSE' : 'TAP THE DISC TO PLAY · DRAG TO BROWSE'
                }
                background="transparent"
                color="var(--text-primary)"
                serif="var(--font-heading)"
                sans="var(--font-mono)"
                display="var(--font-mono)"
                spin={releases.length && player.playing ? 4 : 0}
                noun={releases.length ? 'release' : 'reserved slot'}
                ariaLabel={releases.length ? 'Releases and mixes' : 'Reserved release slots'}
              />
            </div>
            <CratePlayer track={current} state={player} marker={a.marker} empty={a.tracks.empty} profileUrl={SOUNDCLOUD} />

            <div className="tracks-cta" data-reveal>
              <a href={SOUNDCLOUD} target="_blank" rel="noreferrer" className="btn-primary" data-magnetic>
                <Icon icon="logos:soundcloud" width="18" aria-hidden="true" /> FULL PROFILE ON SOUNDCLOUD
              </a>
            </div>
          </div>
        </section>

        {/* 3. PRESS KIT — every photo, sliding; clips once they have web versions */}
        <PressReel title={a.press.title} marker={a.marker} />

        {/* 4. BIO — the point of view, after the work */}
        <section className="bio-section chapter chapter--field" id="bio">
          <div className="container bio-grid">
            <div className={`bio-photo-wrap ${a.frame}`} data-clip>
              <img src={a.images.bio.src} alt={a.images.bio.alt} className="bio-photo" loading="lazy" data-parallax="0.06" />
              <span className="bio-photo-tag font-mono">{a.bio.tag}</span>
            </div>
            <div>
              <p className="bio-paragraph" data-reveal>
                {a.bio.parts.map(([text, distort], i) =>
                  distort ? <TextDistort key={i} text={text} theme={theme} /> : <React.Fragment key={i}>{text}</React.Fragment>
                )}
              </p>
              <ul className="bio-credits font-mono" data-reveal data-reveal-delay="0.15">
                {a.bio.credits.map((c) => <li key={c}>{a.marker} {c}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* 5. INSTAGRAM — appears once a feed is connected (content/artists.js) */}
        <InstagramFeed feed={INSTAGRAM_FEED} profileUrl={INSTAGRAM} marker={a.marker} />

        {/* 6. ALIASES — one artist, two modes */}
        <section className="split chapter" id="aliases" aria-labelledby="split-title">
          <h2 className="sr-only" id="split-title">{a.roster.title}</h2>
          {Object.values(ARTISTS).map((art) => {
            const active = art.key === theme;
            return (
              <button
                type="button"
                key={art.key}
                onClick={() => switchAlias(art.key)}
                className={`split-half split-half--${art.key} ${active ? 'is-active' : ''}`}
                aria-pressed={active}
              >
                <span className="split-kicker font-mono">{art.marker} {art.card.kicker}</span>
                <span className={`split-name ${art.key === 'm0rf' ? 'font-heading' : 'font-mono'}`}><Name text={art.name} /></span>
                <span className="split-line">{art.card.blurb}</span>
                <span className="split-action font-mono">
                  {active ? art.card.status : <>SWITCH <Icon icon="solar:arrow-right-linear" width="18" aria-hidden="true" /></>}
                </span>
              </button>
            );
          })}
        </section>

        {/* 7. BOOK FOR — oversized handoff from proof to contact */}
        <section className="offer-section chapter chapter--field" id="book" aria-labelledby="offer-title">
          <div className="container">
            <p className="section-subtitle font-mono" id="offer-title" data-reveal>{a.marker} BOOK <Name text={a.name} /> FOR</p>
            <ul className="offer-list">
              {a.offers.map((o, i) => (
                <li key={`${o.by}-${o.title}`} className="offer-item" data-reveal data-reveal-delay={i * 0.06}>
                  <a
                    href={`mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(`${o.title} — ${o.by}`)}`}
                    className="offer-link font-heading"
                  >
                    <span className="offer-mask">
                      <span className="offer-text">
                        <span className="offer-by font-mono"><Name text={o.by} /></span>
                        <Name text={o.title} />
                      </span>
                    </span>
                    <span className="offer-meta font-mono">{o.meta}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 8. CONTACT — the signal chapter */}
        <footer className="contact chapter chapter--signal" id="bookings">
          <div className="container contact-grid">
            <div className="contact-photo" data-clip>
              <img src={a.images.contact.src} alt={a.images.contact.alt} loading="lazy" data-parallax="0.04" />
            </div>

            <div className="contact-body">
              <p className="contact-kicker font-mono" data-reveal>{a.marker} {a.footer.copy}</p>
              <h2 className="contact-title font-heading" data-reveal>
                <TextDistort text={a.footer.title} theme={theme} />
              </h2>
              <a
                href={`mailto:${BOOKING_EMAIL}?subject=Booking%20enquiry%20%E2%80%94%20${a.name}`}
                className="contact-cta font-mono" data-magnetic="0.1" data-reveal
              >
                <span>{BOOKING_EMAIL}</span>
                <Icon icon="solar:arrow-right-up-linear" width="28" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="container site-foot font-mono">
            <nav className="site-foot-nav" aria-label="Footer">
              <a href="#tracks">CRATE</a>
              <a href="#press">PRESS KIT</a>
              <a href="#bio">BIO</a>
              <a href="#aliases">ALIASES</a>
              <a href="#book">BOOK</a>
            </nav>
            <div className="site-foot-meta">
              <span>DELHI NCR, IN</span>
              <a href={SOUNDCLOUD} target="_blank" rel="noreferrer">SOUNDCLOUD ↗</a>
              <a href={INSTAGRAM} target="_blank" rel="noreferrer">INSTAGRAM ↗</a>
            </div>
            <p className="site-foot-legal">{a.footer.credit}</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;

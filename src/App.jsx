import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Icon } from '@iconify/react';
import BackgroundCanvas from './components/BackgroundCanvas';
import Nav from './components/Nav';
import Ticker from './components/Ticker';
import Words from './components/Words';
import TextDistort from './components/TextDistort';
import PressKit from './components/PressKit';
import Name from './components/Name';
import DiscCascadeCarousel from './components/DiscCascadeCarousel';
import CratePlayer from './components/CratePlayer';
import useSoundCloud from './lib/useSoundCloud';
import { ARTISTS, RELEASES, PRESS_KIT, SOUNDCLOUD, INSTAGRAM, BOOKING_EMAIL, embedSrc } from './content/artists';
import { gsap, ScrollTrigger, initMotion, startLenis, stopLenis } from './motion/motion';
import portraitHero from './assets/portrait-hero.jpg';
import djBooth from './assets/dj-booth.png';
import './App.css';

function App() {
  const [theme, setTheme] = useState('garagesale');
  const a = ARTISTS[theme];
  const isM0rf = theme === 'm0rf';
  const root = useRef(null);
  const reduceMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  // The crate: which disc is up, and the SoundCloud widget that plays it.
  const [release, setRelease] = useState(0);
  const playerFrame = useRef(null);
  const player = useSoundCloud(playerFrame, RELEASES[release].id);

  // Sync theme class to body (index.css keys its variables off these)
  useEffect(() => {
    document.body.classList.toggle('theme-garagesale', !isM0rf);
    document.body.classList.toggle('theme-m0rf', isM0rf);
  }, [isM0rf]);

  // One Lenis for the page lifetime.
  useEffect(() => {
    startLenis();
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => { window.removeEventListener('load', onLoad); stopLenis(); };
  }, []);

  // Motion is scoped to the themed subtree and rebuilt when the alias switches,
  // since every heading and photo frame is re-rendered under the new key.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => initMotion(root.current), root);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [theme]);

  return (
    <div className="landing-wrapper" id="top">
      <div className="noise-overlay" />
      <div className="scanlines" />
      <BackgroundCanvas theme={theme} isPlaying={player.playing} />
      <Nav theme={theme} setTheme={setTheme} name={a.name} />

      {/* The real SoundCloud player the crate drives. Outside the themed subtree so
          switching alias doesn't remount it mid-stream; hidden, never removed. */}
      <div className="crate-iframe" aria-hidden="true">
        <iframe
          ref={playerFrame}
          title="SoundCloud player"
          width="100%" height="166" scrolling="no" frameBorder="no"
          allow="autoplay; encrypted-media"
          src={embedSrc(ARTISTS.garagesale, RELEASES[0], false)}
        />
      </div>

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
                {/* Primary: straight to the crate, playing. Lenis handles the anchor. */}
                <a
                  href="#tracks"
                  className="btn-primary btn-primary--solid"
                  data-magnetic
                  onClick={() => { setRelease(0); player.play(); }}
                >
                  <Icon icon="solar:play-bold" width="16" aria-hidden="true" /> PLAY THE LATEST
                </a>
                <a href={SOUNDCLOUD} target="_blank" rel="noreferrer" className="hero-link font-mono">
                  SOUNDCLOUD <Icon icon="solar:arrow-right-up-linear" width="14" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="hero-visual" data-depth="0.025">
              <div className={`hero-photo-frame ${a.frame}`} data-hero-media>
                {/* The promo loop (rendered from ../kas5h-video). Muted, so it may autoplay;
                    the portrait is the poster and the whole fallback when motion is off. */}
                {reduceMotion ? (
                  <img src={portraitHero} alt="KAS5H — Delhi NCR DJ and selector" className="hero-photo" fetchPriority="high" />
                ) : (
                  <video
                    className="hero-photo"
                    src="/promo.mp4"
                    poster={portraitHero}
                    autoPlay muted loop playsInline
                    preload="auto"
                    aria-label="KAS5H — Peculiar EP 1 promo loop"
                  />
                )}
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

            {/* The crate: real covers on the discs; the chosen disc is the play button */}
            <div className="crate" data-reveal>
              <DiscCascadeCarousel
                items={RELEASES.map((r) => ({ title: r.title, credits: r.credits, src: r.cover, alt: `${r.title} cover`, label: '' }))}
                index={release}
                onIndexChange={setRelease}
                onSelect={player.toggle}
                height="clamp(420px, 62svh, 620px)"
                discSize="clamp(200px, min(48vmin, 36vw), 400px)"
                brand=""
                indexLabel=""
                reviews={false}
                frame={false}
                hint={player.playing ? 'TAP THE DISC TO PAUSE' : 'TAP THE DISC TO PLAY · DRAG TO BROWSE'}
                background="transparent"
                color="var(--text-primary)"
                serif="var(--font-heading)"
                sans="var(--font-mono)"
                display="var(--font-mono)"
                spin={player.playing ? 4 : 0}
                noun="release"
                ariaLabel="Releases and mixes"
              />
            </div>
            <CratePlayer track={RELEASES[release]} state={player} marker={a.marker} />

            <div className="tracks-cta" data-reveal>
              <a href={SOUNDCLOUD} target="_blank" rel="noreferrer" className="btn-primary" data-magnetic>
                <Icon icon="logos:soundcloud" width="18" aria-hidden="true" /> FULL PROFILE ON SOUNDCLOUD
              </a>
            </div>
          </div>
        </section>

        {/* 3. PRESS KIT */}
        <PressKit title={a.press.title} kit={PRESS_KIT} marker={a.marker} />

        {/* 4. BIO — the point of view, after the work */}
        <section className="bio-section chapter chapter--field" id="bio">
          <div className="container bio-grid">
            <div className={`bio-photo-wrap ${a.frame}`} data-clip>
              <img src={djBooth} alt="KAS5H in the DJ booth" className="bio-photo" loading="lazy" data-parallax="0.06" />
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

        {/* 5. ALIASES — one artist, two modes */}
        <section className="split chapter" id="aliases" aria-labelledby="split-title">
          <h2 className="sr-only" id="split-title">{a.roster.title}</h2>
          {Object.values(ARTISTS).map((art) => {
            const active = art.key === theme;
            return (
              <button
                type="button"
                key={art.key}
                onClick={() => setTheme(art.key)}
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

        {/* 6. BOOK FOR — oversized handoff from proof to contact */}
        <section className="offer-section chapter chapter--field" id="book" aria-labelledby="offer-title">
          <div className="container">
            <p className="section-subtitle font-mono" id="offer-title" data-reveal>{a.marker} BOOK {a.name} FOR</p>
            <ul className="offer-list">
              {a.offers.map((o, i) => (
                <li key={o.title} className="offer-item" data-reveal data-reveal-delay={i * 0.06}>
                  <a
                    href={`mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(`${o.title} — ${a.name}`)}`}
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

        {/* 7. CONTACT — the signal chapter */}
        <footer className="contact chapter chapter--signal" id="bookings">
          <div className="container contact-grid">
            <div className="contact-photo" data-clip>
              <img src={portraitHero} alt="KAS5H portrait" loading="lazy" data-parallax="0.04" />
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

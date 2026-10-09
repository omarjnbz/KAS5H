import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import BackgroundCanvas from './components/BackgroundCanvas';
import Nav from './components/Nav';
import Ticker from './components/Ticker';
import Words from './components/Words';
import TextDistort from './components/TextDistort';
import PromoContent from './components/PromoContent';
import Name from './components/Name';
import { ARTISTS, SOUNDCLOUD, INSTAGRAM, BOOKING_EMAIL, embedSrc } from './content/artists';
import { gsap, ScrollTrigger, initMotion, startLenis, stopLenis } from './motion/motion';
import portraitHero from './assets/portrait-hero.jpg';
import portraitMesh from './assets/portrait-mesh.jpg';
import djBooth from './assets/dj-booth.png';
import './App.css';

function App() {
  const [theme, setTheme] = useState('garagesale');
  const a = ARTISTS[theme];
  const isM0rf = theme === 'm0rf';
  const root = useRef(null);

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
      <BackgroundCanvas theme={theme} isPlaying={false} />
      <Nav theme={theme} setTheme={setTheme} name={a.name} />

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

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }} data-hero-cta>
                <a href={SOUNDCLOUD} target="_blank" rel="noreferrer" className="btn-primary" data-magnetic>
                  <Icon icon="logos:soundcloud" width="18" aria-hidden="true" /> SOUNDCLOUD
                </a>
                <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="btn-primary" data-magnetic>
                  <Icon icon="logos:instagram-icon" width="16" aria-hidden="true" /> INSTAGRAM
                </a>
              </div>
            </div>

            <div className="hero-visual" data-depth="0.025">
              <div className={`hero-photo-frame ${a.frame}`} data-hero-media>
                <img src={portraitHero} alt="KAS5H — Delhi NCR DJ and selector" className="hero-photo" fetchPriority="high" />
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

            {/* Full SoundCloud players — playable in place, not a preview */}
            <div className="sc-featured" data-reveal>
              <span className="sc-featured-tag font-mono">{a.tracks.featuredTag}</span>
              <div className={`sc-frame ${a.frame}`}>
                <iframe
                  title={a.tracks.featured.title}
                  width="100%" height="320" scrolling="no" frameBorder="no"
                  allow="autoplay; encrypted-media" loading="lazy"
                  src={embedSrc(a, a.tracks.featured)}
                />
              </div>
            </div>

            <div className="sc-featured sc-also" data-reveal>
              <span className="sc-featured-tag font-mono">{a.tracks.alsoTag}</span>
              <div className={`sc-frame ${a.frame}`}>
                <iframe
                  title={a.tracks.also.title}
                  width="100%" height="166" scrolling="no" frameBorder="no"
                  allow="autoplay; encrypted-media" loading="lazy"
                  src={embedSrc(a, a.tracks.also, false)}
                />
              </div>
            </div>

            <div className="tracks-cta" data-reveal>
              <a href={SOUNDCLOUD} target="_blank" rel="noreferrer" className="btn-primary" data-magnetic>
                <Icon icon="logos:soundcloud" width="18" aria-hidden="true" /> FULL PROFILE ON SOUNDCLOUD
              </a>
            </div>
          </div>
        </section>

        {/* 3. PRESS KIT */}
        <PromoContent theme={theme} title={a.press.title} />

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
        <section className="roster-section chapter" id="aliases">
          <div className="container">
            <div className="brands-header">
              <Words as="h2" className="section-title font-heading" text={a.roster.title} />
              <p className="section-subtitle font-mono" data-reveal>{a.roster.subtitle}</p>
            </div>

            <div className="brand-showcase-grid">
              {Object.values(ARTISTS).map((art, i) => {
                const active = art.key === theme;
                return (
                  <button
                    type="button"
                    key={art.key}
                    onClick={() => setTheme(art.key)}
                    className={`alias-card alias-card--${art.key} ${active ? 'is-active' : ''}`}
                    aria-pressed={active}
                    data-reveal data-reveal-delay={i * 0.1}
                  >
                    <div className="alias-card-head">
                      <h3 className={art.key === 'm0rf' ? 'font-heading' : 'font-mono'}><Name text={art.name} /></h3>
                      <Icon icon={art.key === 'm0rf' ? 'solar:vinyl-record-bold' : 'solar:radio-minimalistic-bold'}
                        width="26" className={art.key === 'm0rf' && active ? 'alias-spin' : ''} aria-hidden="true" />
                    </div>
                    <p>{art.card.blurb}</p>
                    <span className="font-mono alias-status">[ {active ? art.card.status : art.card.standby} ]</span>
                  </button>
                );
              })}
            </div>
          </div>
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
                    <span className="offer-mask"><span className="offer-text"><Name text={o.title} /></span></span>
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
              <img src={portraitMesh} alt="KAS5H portrait" loading="lazy" data-parallax="0.04" />
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

import React, { useState, useEffect } from 'react';
import BackgroundCanvas from './components/BackgroundCanvas';
import ThemeHud from './components/ThemeHud';
import TextDistort from './components/TextDistort';
import PromoContent from './components/PromoContent';
import { ARTISTS, SOUNDCLOUD, INSTAGRAM, BOOKING_EMAIL, embedSrc } from './content/artists';
import portraitHero from './assets/portrait-hero.jpg';
import portraitMesh from './assets/portrait-mesh.jpg';
import djBooth from './assets/dj-booth.png';
import './App.css';

const Instagram = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Music = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 18V5l12-2v13"></path>
    <circle cx="6" cy="18" r="3"></circle>
    <circle cx="18" cy="16" r="3"></circle>
  </svg>
);

const Radio = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="2"></circle>
    <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>
  </svg>
);

const Mail = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const Disc = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

function App() {
  const [theme, setTheme] = useState('garagesale');
  const a = ARTISTS[theme];
  const isM0rf = theme === 'm0rf';

  // Sync theme class to body (index.css keys its variables off these)
  useEffect(() => {
    document.body.classList.toggle('theme-garagesale', !isM0rf);
    document.body.classList.toggle('theme-m0rf', isM0rf);
  }, [isM0rf]);

  return (
    <div className="landing-wrapper">
      <div className="noise-overlay" />
      <div className="scanlines" />
      <BackgroundCanvas theme={theme} isPlaying={false} />
      <ThemeHud theme={theme} setTheme={setTheme} />

      {/* 1. HERO */}
      <section className="hero-section container">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-subtitle font-mono">{a.marker} {a.hero.kicker}</div>

            <h1 className="hero-title font-heading">
              <TextDistort text={a.hero.title} theme={theme} />
              <br />
              <span className="text-stroke">{a.hero.stroke}</span>
            </h1>

            <p className="hero-desc">{a.hero.lead}</p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a href={SOUNDCLOUD} target="_blank" rel="noreferrer" className="btn-primary">
                <Music size={16} /> SOUNDCLOUD
              </a>
              <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="btn-primary">
                <Instagram size={16} /> INSTAGRAM
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className={`hero-photo-frame ${a.frame}`}>
              <img src={portraitHero} alt="KAS5H — Delhi NCR DJ and selector" className="hero-photo" />
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

      {/* 2. BIO */}
      <section className="bio-section" id="bio">
        <div className="container bio-grid">
          <div className={`bio-photo-wrap ${a.frame}`}>
            <img src={djBooth} alt="KAS5H in the DJ booth" className="bio-photo" />
            <span className="bio-photo-tag font-mono">{a.bio.tag}</span>
          </div>
          <div>
            <p className="bio-paragraph">
              {a.bio.parts.map(([text, distort], i) =>
                distort ? <TextDistort key={i} text={text} theme={theme} /> : <React.Fragment key={i}>{text}</React.Fragment>
              )}
            </p>
            <ul className="bio-credits font-mono">
              {a.bio.credits.map((c) => <li key={c}>{a.marker} {c}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. SOUNDCLOUD */}
      <section className="tracks-section" id="tracks">
        <div className="container">
          <div className="brands-header">
            <h2 className="section-title font-heading">{a.tracks.title}</h2>
            <p className="section-subtitle font-mono">{a.tracks.subtitle}</p>
          </div>

          <div className="sc-featured">
            <span className="sc-featured-tag font-mono">{a.tracks.featuredTag}</span>
            <div className={`sc-frame ${a.frame}`}>
              <iframe
                title={a.tracks.featured.title}
                width="100%"
                height="320"
                scrolling="no"
                frameBorder="no"
                allow="autoplay; encrypted-media"
                loading="lazy"
                src={embedSrc(a, a.tracks.featured)}
              />
            </div>
          </div>

          <div className="sc-featured sc-also">
            <span className="sc-featured-tag font-mono">{a.tracks.alsoTag}</span>
            <div className={`sc-frame ${a.frame}`}>
              <iframe
                title={a.tracks.also.title}
                width="100%"
                height="166"
                scrolling="no"
                frameBorder="no"
                allow="autoplay; encrypted-media"
                loading="lazy"
                src={embedSrc(a, a.tracks.also, false)}
              />
            </div>
          </div>

          <div className="tracks-cta">
            <a href={SOUNDCLOUD} target="_blank" rel="noreferrer" className="btn-primary">
              <Music size={16} /> FULL PROFILE ON SOUNDCLOUD
            </a>
          </div>
        </div>
      </section>

      {/* 4. PRESS KIT */}
      <PromoContent theme={theme} title={a.press.title} />

      {/* 5. ALIASES — one artist, two modes */}
      <section className="roster-section" id="aliases">
        <div className="container">
          <div className="brands-header">
            <h2 className="section-title font-heading">{a.roster.title}</h2>
            <p className="section-subtitle font-mono">{a.roster.subtitle}</p>
          </div>

          <div className="brand-showcase-grid">
            {Object.values(ARTISTS).map((art) => {
              const active = art.key === theme;
              return (
                <button
                  type="button"
                  key={art.key}
                  onClick={() => setTheme(art.key)}
                  className={`alias-card alias-card--${art.key} ${active ? 'is-active' : ''}`}
                  aria-pressed={active}
                >
                  <div className="alias-card-head">
                    <h3 className={art.key === 'm0rf' ? 'font-heading' : 'font-mono'}>{art.name}</h3>
                    {art.key === 'm0rf' ? <Disc className={active ? 'alias-spin' : ''} /> : <Radio />}
                  </div>
                  <p>{art.card.blurb}</p>
                  <span className="font-mono alias-status">[ {active ? art.card.status : art.card.standby} ]</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. BOOKINGS */}
      <footer className="footer" id="bookings">
        <div className="container footer-grid">
          <div className={`footer-photo-wrap ${a.frame}`}>
            <img src={portraitMesh} alt="KAS5H portrait" className="footer-photo" />
            <div className="hero-photo-grain" />
          </div>

          <div className="footer-body">
            <h2 className="font-heading" style={{ fontSize: '2.2rem', marginBottom: '16px' }}>
              <TextDistort text={a.footer.title} theme={theme} />
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '32px' }}>
              {a.footer.copy}
            </p>
            <div style={{ marginBottom: '16px' }}>
              <a
                href={`mailto:${BOOKING_EMAIL}?subject=Booking%20enquiry%20%E2%80%94%20${a.name}`}
                className="btn-primary"
                style={{ fontSize: '1.1rem', padding: '16px 36px' }}
              >
                <Mail size={18} /> {a.footer.cta}
              </a>
            </div>
            <p className="font-mono footer-email">{BOOKING_EMAIL}</p>

            <div className="footer-nav">
              <a href="#bio" className="footer-link">BIO</a>
              <a href="#tracks" className="footer-link">TRACKS</a>
              <a href="#press" className="footer-link">PRESS KIT</a>
              <a href="#aliases" className="footer-link">ALIASES</a>
              <a href={SOUNDCLOUD} target="_blank" rel="noreferrer" className="footer-link">SOUNDCLOUD</a>
            </div>

            <p className="footer-credit">{a.footer.credit}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

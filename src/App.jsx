import React, { useState, useEffect } from 'react';
import BackgroundCanvas from './components/BackgroundCanvas';
import ThemeHud from './components/ThemeHud';
import CustomPlayer from './components/CustomPlayer';
import TextDistort from './components/TextDistort';
import TourDates from './components/TourDates';
import PromoContent from './components/PromoContent';
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
  const [theme, setTheme] = useState('gruvmind'); // 'gruvmind' or 'garagesale'
  const [isPlaying, setIsPlaying] = useState(false);

  // Sync theme class to body
  useEffect(() => {
    const body = document.body;
    if (theme === 'garagesale') {
      body.classList.add('theme-garagesale');
    } else {
      body.classList.remove('theme-garagesale');
    }
  }, [theme]);

  return (
    <div className="landing-wrapper">
      {/* Noise and Scanline overlay filters */}
      <div className="noise-overlay" />
      <div className="scanlines" />

      {/* Dynamic Background Canvas */}
      <BackgroundCanvas theme={theme} isPlaying={isPlaying} />

      {/* Floating UI HUD elements */}
      <ThemeHud theme={theme} setTheme={setTheme} />
      <CustomPlayer theme={theme} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />

      {/* 1. HERO SECTION */}
      <section className="hero-section container">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-subtitle font-mono">
              {theme === 'gruvmind' ? '▼ DELHI-NCR // SELECTOR & PRODUCER' : '▲ SYSTEM ACTIVE // UKG - HOUSE - TECHNO'}
            </div>

            <h1 className="hero-title font-heading">
              <TextDistort text="KAS5H" theme={theme} />
              <br />
              <span className="text-stroke">SOUNDSYSTEM</span>
            </h1>

            <p className="hero-desc">
              {theme === 'gruvmind'
                ? 'A versatile explorer of minimal tech house, hypnotic rhythms, deep basslines, and subterranean Delhi electronica.'
                : 'RAW UK GARAGE, FAST-PACED BREAKS, SKELETON GRIDS, AND GRITTY RAVE FREQUENCIES BUILT FOR THE UNDERGROUND.'}
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a
                href="https://soundcloud.com/kas5hmusik"
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                <Music size={16} /> SOUNDCLOUD
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                <Instagram size={16} /> INSTAGRAM
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className={`hero-photo-frame ${theme === 'gruvmind' ? 'frame-gruv' : 'frame-garage'}`}>
              <img src={portraitHero} alt="KAS5H — Delhi NCR selector & producer" className="hero-photo" />
              <div className="hero-photo-grain" />
              <div className="hero-photo-brackets">
                <span className="bk bk-tl" /><span className="bk bk-tr" />
                <span className="bk bk-bl" /><span className="bk bk-br" />
              </div>
              <span className="hero-photo-tag font-mono">
                {theme === 'gruvmind' ? 'PORTRAIT_01 // SELECTOR' : 'SUBJECT_LOCKED // KAS5H'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE BIO SECTION */}
      <section className="bio-section">
        <div className="container bio-grid">
          <div className={`bio-photo-wrap ${theme === 'gruvmind' ? 'frame-gruv' : 'frame-garage'}`}>
            <img src={djBooth} alt="KAS5H in the DJ booth" className="bio-photo" />
            <span className="bio-photo-tag font-mono">LIVE // IN THE BOOTH</span>
          </div>
          <p className="bio-paragraph">
            Versatile, forward-thinking sound that traverses{' '}
            <TextDistort text="Tech House" theme={theme} />,{' '}
            <TextDistort text="Minimal/Deeptech" theme={theme} />,{' '}
            <TextDistort text="Techno" theme={theme} />,{' '}
            <TextDistort text="IDM" theme={theme} />,{' '}
            <TextDistort text="Footwork" theme={theme} />,{' '}
            <TextDistort text="UK Garage" theme={theme} />, and{' '}
            <TextDistort text="DnB" theme={theme} />. Through rotating curation hubs,{' '}
            <span style={{ color: 'var(--accent)' }}>KAS5H</span> creates immersive sonic pathways, connecting Delhi’s underground electronic architecture directly to global warehouse cultures.
          </p>
        </div>
      </section>

      {/* 3. SOUNDCLOUD TRACKS SECTION */}
      <section className="tracks-section" id="tracks">
        <div className="container">
          <div className="brands-header">
            <h2 className="section-title font-heading">
              {theme === 'gruvmind' ? '▼ SELECTED TRANSMISSIONS' : '▲ THE RECORD CRATE'}
            </h2>
            <p className="section-subtitle font-mono">
              LIVE FROM SOUNDCLOUD // KAS5H MIXES, EDITS &amp; SELECTIONS
            </p>
          </div>

          {/* Featured release */}
          <div className="sc-featured">
            <span className="sc-featured-tag font-mono">
              {theme === 'gruvmind' ? '★ FEATURED RELEASE' : '★ NOW SPINNING'} // SPL 012 — KAS5H
            </span>
            <div className={`sc-frame ${theme === 'gruvmind' ? 'frame-gruv' : 'frame-garage'}`}>
              <iframe
                title="SPL 012 - KAS5H (Spellbound)"
                width="100%"
                height="320"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                loading="lazy"
                src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2229482819&color=%23${theme === 'gruvmind' ? '0011ff' : 'ff3300'}&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`}
              />
            </div>
          </div>

          {/* Full profile player */}
          <div className={`sc-frame ${theme === 'gruvmind' ? 'frame-gruv' : 'frame-garage'}`}>
            <iframe
              title="KAS5H on SoundCloud"
              width="100%"
              height="450"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              loading="lazy"
              src={`https://w.soundcloud.com/player/?url=https%3A%2F%2Fapi.soundcloud.com%2Fusers%2F23528569&color=%23${theme === 'gruvmind' ? '0011ff' : 'ff3300'}&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`}
            />
          </div>

          <div className="tracks-cta">
            <a
              href="https://soundcloud.com/kas5hmusik"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              <Music size={16} /> FULL PROFILE ON SOUNDCLOUD
            </a>
          </div>
        </div>
      </section>

      {/* 4. PROMOTIONAL CONTENT (PRESS KIT) */}
      <PromoContent theme={theme} />

      {/* 5. TOUR DATES SECTION */}
      <TourDates theme={theme} />

      {/* 5. SUB-BRANDS CONCEPT FOCUS */}
      <section style={{ padding: '100px 0' }} id="brands">
        <div className="container">
          <div style={{ textAlign: 'left', marginBottom: '60px' }}>
            <h2 className="section-title font-heading">
              {theme === 'gruvmind' ? '▼ CURATORIAL DEPT' : '▲ THE SUB-BRANDS'}
            </h2>
            <p className="section-subtitle font-mono">
              EXPLORE THE CO-FOUNDED BRANDS THAT POWER KAS5H'S SESSIONS
            </p>
          </div>

          <div className="brand-showcase-grid" style={{ gap: '48px' }}>
            {/* Gruvmind Panel */}
            <div 
              onClick={() => setTheme('gruvmind')}
              style={{
                background: 'rgba(18, 9, 36, 0.4)',
                border: theme === 'gruvmind' ? '2px solid #39ff14' : '1px solid rgba(167, 139, 250, 0.1)',
                padding: '32px',
                borderRadius: '16px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.4s ease'
              }}
              className="brand-panel-gruv"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 className="font-heading" style={{ fontSize: '1.8rem', color: theme === 'gruvmind' ? '#39ff14' : '#fff' }}>
                  GRUVMIND
                </h3>
                <Disc className={theme === 'gruvmind' ? 'glow-accent' : ''} style={{ color: '#39ff14', transform: theme === 'gruvmind' ? 'rotate(360deg)' : 'none', transition: 'transform 2s linear' }} />
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px' }}>
                Co-founded platform concentrating on hypnotic Tech House, Minimal/Deeptech, micro-grooves, and deep room frequency systems.
              </p>
              <span className="font-mono" style={{ fontSize: '0.75rem', color: '#39ff14' }}>
                [ SYSTEM STATUS: SELECTED ]
              </span>
            </div>

            {/* Garage Sale Panel */}
            <div 
              onClick={() => setTheme('garagesale')}
              style={{
                background: '#121212',
                border: theme === 'garagesale' ? '2px solid #ff5500' : '1px solid rgba(255, 85, 0, 0.1)',
                padding: '32px',
                borderRadius: '0px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.4s ease'
              }}
              className="brand-panel-garage"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 className="font-mono" style={{ fontSize: '1.8rem', color: theme === 'garagesale' ? '#ff5500' : '#fff', fontWeight: 'bold' }}>
                  GARAGE SALE
                </h3>
                <Radio style={{ color: '#ff5500' }} />
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px' }}>
                High-energy rave flyers brought to life. Emphasizing fast UK Garage loops, breakbeats, industrial warning sirens, and hardcore selecta feeds.
              </p>
              <span className="font-mono" style={{ fontSize: '0.75rem', color: '#ff5500' }}>
                [ SYSTEM STATUS: READY ]
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOOKINGS & CONTACT FOOTER */}
      <footer className="footer" id="bookings">
        <div className="container footer-grid">
          <div className={`footer-photo-wrap ${theme === 'gruvmind' ? 'frame-gruv' : 'frame-garage'}`}>
            <img src={portraitMesh} alt="KAS5H portrait" className="footer-photo" />
            <div className="hero-photo-grain" />
          </div>

          <div className="footer-body">
            <h2 className="font-heading" style={{ fontSize: '2.2rem', marginBottom: '16px' }}>
              <TextDistort text="BOOKINGS" theme={theme} />
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '32px' }}>
              Contact dispatch for dates, mixes, curation invites, and Delhi underground event info.
            </p>
            <div style={{ marginBottom: '40px' }}>
              <a
                href="mailto:bookings@kas5hmusik.com"
                onClick={(e) => { e.preventDefault(); alert("EMAIL DISPATCH: bookings@kas5hmusik.com"); }}
                className="btn-primary"
                style={{ fontSize: '1.1rem', padding: '16px 36px' }}
              >
                <Mail size={18} /> DISPATCH AGENT
              </a>
            </div>

            <div className="footer-nav">
              <a href="#tracks" className="footer-link">TRACKS</a>
              <a href="#press" className="footer-link">PRESS KIT</a>
              <a href="#brands" className="footer-link">BRANDS</a>
              <a href="#bookings" className="footer-link">CONTACT</a>
              <a href="https://soundcloud.com/kas5hmusik" target="_blank" rel="noreferrer" className="footer-link">SOUNDCLOUD</a>
            </div>

            <p className="footer-credit">
              © 2026 KAS5H MUSIC // DESIGNED BY ANTIGRAVITY SYSTEMS V1.0
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

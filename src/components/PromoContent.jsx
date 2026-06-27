import { useState, useEffect, useRef } from 'react';

/*
 * Promotional content (press kit) sourced from KAS5H's public Google Drive folders.
 * To add/remove items, edit the PHOTOS / VIDEOS arrays below — each entry is { id, name }
 * (id = Google Drive file id). Files must stay shared as "Anyone with the link".
 *   Photos folder: https://drive.google.com/drive/folders/1yAEKO6m7KmORhViFiVblM_j_0cHQRjr5
 *   Videos folder: https://drive.google.com/drive/folders/1-3sSyD6JXhEPba7rLHuBZTPFeZqIs_A4
 */
const PHOTOS = [
  { id: '1j4fYVKwFKpcWcAzSpwbt3zhJ2Aatyxo1', name: '039A0003.jpg' },
  { id: '1K1dmMhIzSRpF6SUPLpeAUhjJ5fjDnzhp', name: '039A0008.jpg' },
  { id: '1trfw6tNaMjZbQO1jn0HA4oMXVSWqQHxw', name: '039A0011.jpg' },
  { id: '1O741tjWN85yOG3ucoKLF1-7Ym6AvKbo0', name: '039A9669.jpg' },
  { id: '1IYy86tF-FYbtTrSs5khEJrH2Ke62MIWl', name: '039A9996.jpg' },
  { id: '1tdkaIELo1-rt-j7B84jqxZRnhFxx8wgq', name: '0H6A1399.jpg' },
  { id: '1mcX1R-5L-svATJVXpknKsMTcvPwrkJeo', name: '2P1A6738.jpg' },
  { id: '1mXIfEyvhIU_lMPUzZ6WG3z0-FyGf9dZy', name: '2P1A6771.jpg' },
  { id: '1m_IaEyxtdSfN4lKjLhfKtx81dE8FVx_o', name: '2P1A6785.jpg' },
  { id: '1m34QBB6rOgpy2xQ6oJ7ptgia78ncHits', name: '2P1A6799.jpg' },
  { id: '1_x0vM3qFKG-L3sFv5sTVRirnQvg0w7mq', name: 'DSC06221.jpg' },
  { id: '1gD53DTYc-zU7IJJNgsxwJ50f73LJRL8O', name: 'DSC06302.jpg' },
  { id: '1VtZRfRcSiukOGlCEXXJxJtexvdSEwO7W', name: 'DSC06303.jpg' },
  { id: '1M_zRQYeJ-yHAhDPW0AIAslB1doNLe4bG', name: 'DSC06320.jpg' },
  { id: '1dykW0LQBctOhrR7i29Dvfw73FL8FkHyY', name: 'DSC06346.jpg' },
  { id: '1oTrTUWDJIpcZr8ElwTeUhILQm3COvb6O', name: 'DSC08331.jpg' },
  { id: '1nT19pKA16lDjjpB1V3wWFp0NhnqXQM78', name: 'DSC08335.jpg' },
  { id: '1xZPmtG1zq-BSJE2dccb6VFWxrixSm__U', name: 'IMG_1084.jpg' },
  { id: '1yhcdEpsNng_AKPp13WeS3e4peORHU6Dn', name: 'IMG_1088.jpg' },
  { id: '1zv7ImrIxHzTNEi-hbQ6Ka3NDJgfe5CsU', name: 'IMG_1089.jpg' },
  { id: '1eySbagRT23bb7NTHyRmED5zUGCTc6aWe', name: 'IMG_1091.jpg' },
  { id: '1UlTfZuH7zbeoEkDuG4gYQLYth7EEn9Nx', name: 'IMG_5862.jpg' },
  { id: '1zIOlH6V0uY1K4ZWy460kj41B-mJC-G1_', name: 'IMG_5905.jpg' },
  { id: '1bUxOejyse_7OnB-c-EFJtilGk24V7Zxv', name: 'IMG_5941.jpg' },
  { id: '1PDVWkaUvbP1dWY8EUwq1fYuaBjJROnVw', name: 'IMG_5977.jpg' },
  { id: '1MfNgI0Tzo9sYvk-Zz38MB7yXO2td7LVw', name: 'IMG_6069.jpg' },
  { id: '13nEbtuLxl5F4O0GTBNV1BWlkDxwEWiUo', name: 'IMG_6300.jpg' },
  { id: '11ldH-OU7xFsr5OnwA3X7Av2XhDfgDxR1', name: 'IMG_9253.jpg' },
  { id: '1QVGMylchMA-pb1-5EQXsTjkAZPMvMsuw', name: 'IMG_9405.jpg' },
  { id: '1hz2MPYl6lGt3yJPumgvQoq4b17F7ltWd', name: 'IMG_9473.jpg' },
  { id: '1qZJ7cIhLIq_aMJVQEU8nDCEj9Cwnibro', name: 'IMG_9480.jpg' },
  { id: '1Y9wvB5za0aC2EALhfkNyHJPfaWeAtCr7', name: 'IMG_9519.jpg' },
  { id: '1crC7hhWjl6N3mcmhWy2_jw0Xx1NTPHoq', name: 'IMG_9524.jpg' },
  { id: '1ewW7N-csCK7HqaLdLX8SM7JdylSgAAUM', name: 'IMG_9567.jpg' },
];

const VIDEOS = [
  { id: '1JLiwSTKXDOzaPLwUpCspLn1VlI8Pwrwu', name: 'KAS5H-promo-reel.mp4', label: 'PROMO REEL', portrait: true },
  { id: '16Wi51PoZGqvH0GdIxTsNgkeLofndNZxD', name: 'KAS5H-cut-01.mp4', label: 'PROMO CUT 01' },
  { id: '1uy2ZG-p6Q61LqylwBkCuOS4Z-xkIzeCp', name: 'KAS5H-cut-02.mp4', label: 'PROMO CUT 02' },
  { id: '1gHcP9LjWtyiHWFUUTEypZfIs4ZqgOqcq', name: 'KAS5H-cut-03.mp4', label: 'PROMO CUT 03' },
  { id: '13rhj04BB8yjqfHqOZFKa_9jER2Zkdgwg', name: 'KAS5H-cut-04.mp4', label: 'PROMO CUT 04' },
  { id: '1GVweRj7KV-xK19fwTy3MzDJIVffI14a8', name: 'KAS5H-live-01.mov', label: 'LIVE SET CLIP' },
  { id: '1fW87oZjI4fgMLkVslKdNvCQY4JgxclV1', name: 'KAS5H-live-02.mov', label: 'LIVE SET CLIP', portrait: true },
];

const PHOTOS_FOLDER = 'https://drive.google.com/drive/folders/1yAEKO6m7KmORhViFiVblM_j_0cHQRjr5';
const VIDEOS_FOLDER = 'https://drive.google.com/drive/folders/1-3sSyD6JXhEPba7rLHuBZTPFeZqIs_A4';

// Display thumbnails are hosted locally (public/promo) for fast, reliable loading —
// hotlinking Drive at gallery scale gets rate-limited. Filenames map to array order:
// photos -> p01.jpg.., posters -> v01.jpg.. Downloads/playback still stream from Drive.
const pad = (i) => String(i + 1).padStart(2, '0');
const localPhoto = (i) => `/promo/p${pad(i)}.jpg`;
const localPoster = (i) => `/promo/v${pad(i)}.jpg`;
const previewSrc = (id) => `https://drive.google.com/file/d/${id}/preview`;
const downloadUrl = (id) => `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;

const PromoContent = ({ theme }) => {
  const [tab, setTab] = useState('photos');
  const [lightbox, setLightbox] = useState(null); // { type, id, name, label }
  const [expanded, setExpanded] = useState(false); // false = sliding carousel, true = full grid
  const trackRef = useRef(null);

  // Close lightbox on Escape + lock background scroll while open
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox]);

  // Switch tab + collapse back to the carousel and reset its scroll position
  const selectTab = (next) => {
    setTab(next);
    setExpanded(false);
    if (trackRef.current) trackRef.current.scrollLeft = 0;
  };

  const frameClass = theme === 'gruvmind' ? 'frame-gruv' : 'frame-garage';

  // Slide the carousel track left/right by ~one viewport-worth of cards
  const slide = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.85, 260);
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  const items = tab === 'photos' ? PHOTOS : VIDEOS;

  const renderPhoto = (p, i) => (
    <figure className="promo-card" key={p.id}>
      <button
        type="button"
        className="promo-thumb"
        onClick={() => setLightbox({ type: 'photo', img: localPhoto(i), ...p })}
        aria-label={`Preview ${p.name}`}
      >
        <img loading="lazy" src={localPhoto(i)} alt={`KAS5H press shot ${p.name}`} />
        <span className="promo-zoom font-mono">VIEW</span>
      </button>
      <a
        className="promo-dl font-mono"
        href={downloadUrl(p.id)}
        download={p.name}
        rel="noreferrer"
      >
        ↓ DOWNLOAD
      </a>
    </figure>
  );

  const renderVideo = (v, i) => (
    <figure className="promo-card" key={v.id}>
      <button
        type="button"
        className="promo-thumb promo-thumb--video"
        onClick={() => setLightbox({ type: 'video', ...v })}
        aria-label={`Play ${v.label}`}
      >
        <img loading="lazy" src={localPoster(i)} alt={`${v.label} poster`} />
        <span className="promo-play" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        </span>
        <figcaption className="promo-vcap font-mono">{v.label}</figcaption>
      </button>
      <a
        className="promo-dl font-mono"
        href={downloadUrl(v.id)}
        download={v.name}
        rel="noreferrer"
      >
        ↓ DOWNLOAD
      </a>
    </figure>
  );

  const renderCard = (it, i) => (tab === 'photos' ? renderPhoto(it, i) : renderVideo(it, i));

  return (
    <section className="promo-section" id="press">
      <div className="container">
        <div className="brands-header">
          <h2 className="section-title font-heading">
            {theme === 'gruvmind' ? '▼ PROMOTIONAL CONTENT' : '▲ PRESS & PROMO KIT'}
          </h2>
          <p className="section-subtitle font-mono">
            DOWNLOAD-READY PRESS SHOTS &amp; PERFORMANCE CLIPS // FREE FOR PROMOTERS, PRESS &amp; PARTNERS
          </p>
        </div>

        {/* Tab switcher */}
        <div className="promo-tabs font-mono">
          <button
            className={`promo-tab ${tab === 'photos' ? 'active' : ''}`}
            onClick={() => selectTab('photos')}
          >
            PHOTOS [{PHOTOS.length}]
          </button>
          <button
            className={`promo-tab ${tab === 'videos' ? 'active' : ''}`}
            onClick={() => selectTab('videos')}
          >
            VIDEOS [{VIDEOS.length}]
          </button>
        </div>

        {/* Sliding carousel (default) OR expanded full grid */}
        {!expanded ? (
          <div className="promo-carousel">
            <button className="promo-arrow" onClick={() => slide(-1)} aria-label="Scroll left">‹</button>
            <div
              className={`promo-track ${tab === 'videos' ? 'promo-track--video' : ''}`}
              ref={trackRef}
            >
              {items.map((it, i) => renderCard(it, i))}
            </div>
            <button className="promo-arrow" onClick={() => slide(1)} aria-label="Scroll right">›</button>
          </div>
        ) : (
          <div className={`promo-grid ${tab === 'videos' ? 'promo-grid--video' : ''} promo-grid--in`}>
            {items.map((it, i) => renderCard(it, i))}
          </div>
        )}

        {/* Show all / show less */}
        <div className="promo-expand">
          <button
            className="promo-showmore font-mono"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded
              ? '▲ SHOW LESS'
              : `▼ SHOW ALL ${tab === 'photos' ? 'PHOTOS' : 'VIDEOS'} [${items.length}]`}
          </button>
        </div>

        <div className="promo-foot font-mono">
          <span>NEED MORE? BROWSE THE FULL DRIVE:</span>
          <a href={PHOTOS_FOLDER} target="_blank" rel="noreferrer">ALL PRESS SHOTS ↗</a>
          <a href={VIDEOS_FOLDER} target="_blank" rel="noreferrer">ALL VIDEOS ↗</a>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="promo-lightbox" onClick={() => setLightbox(null)}>
          <button className="lb-close font-mono" onClick={() => setLightbox(null)} aria-label="Close">✕ CLOSE</button>
          <div className={`lb-inner ${lightbox.type === 'video' ? 'lb-inner--video' : ''}`} onClick={(e) => e.stopPropagation()}>
            {lightbox.type === 'photo' ? (
              <img src={lightbox.img} alt={lightbox.name} className="lb-media" />
            ) : (
              <div className={`lb-frame ${lightbox.portrait ? 'lb-frame--portrait' : ''}`}>
                <iframe
                  title={lightbox.label}
                  src={previewSrc(lightbox.id)}
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                />
              </div>
            )}
            <div className="lb-bar font-mono">
              <span className="lb-name">{lightbox.label || lightbox.name}</span>
              <a className={`lb-dl ${frameClass}`} href={downloadUrl(lightbox.id)} download={lightbox.name} rel="noreferrer">
                ↓ DOWNLOAD {lightbox.type === 'video' ? 'VIDEO' : 'PHOTO'}
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .promo-section { padding: 100px 0; border-top: 1px solid var(--border-color); }

        .promo-tabs { display: flex; gap: 12px; margin-bottom: 40px; }
        .promo-tab {
          padding: 10px 22px;
          background: transparent;
          border: 2px solid var(--border-color);
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: all 0.25s ease;
        }
        .promo-tab.active { background: var(--accent); color: var(--bg-primary); border-color: var(--accent); }
        .promo-tab:not(.active):hover { color: var(--text-primary); border-color: var(--accent); }

        /* ---- Sliding carousel ---- */
        .promo-carousel { display: flex; align-items: stretch; gap: 10px; }
        .promo-track {
          display: flex;
          gap: 18px;
          flex: 1 1 auto;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          padding: 4px 2px 16px;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .promo-track::-webkit-scrollbar { display: none; }
        .promo-track .promo-card {
          flex: 0 0 auto;
          width: clamp(190px, 60vw, 246px);
          scroll-snap-align: start;
        }
        .promo-track--video .promo-card { width: clamp(260px, 82vw, 360px); }

        .promo-arrow {
          flex: 0 0 auto;
          align-self: center;
          width: 44px; height: 64px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.8rem; line-height: 1; font-weight: 400;
          background: var(--bg-secondary);
          color: var(--text-primary);
          border: 2px solid var(--border-color);
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }
        .promo-arrow:hover { background: var(--accent); color: var(--bg-primary); transform: scale(1.05); }
        .promo-arrow:active { transform: scale(0.96); }
        @media (max-width: 640px) { .promo-arrow { display: none; } }

        .promo-expand { display: flex; justify-content: center; margin-top: 30px; }
        .promo-showmore {
          padding: 12px 30px;
          background: transparent;
          border: 2px solid var(--accent);
          color: var(--accent);
          font-size: 0.8rem; font-weight: 700; letter-spacing: 0.16em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .promo-showmore:hover { background: var(--accent); color: var(--bg-primary); box-shadow: 4px 4px 0 var(--text-primary); }

        /* ---- Expanded grid ---- */
        .promo-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        @media (min-width: 640px) { .promo-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1000px) { .promo-grid { grid-template-columns: repeat(4, 1fr); } }
        .promo-grid--video { gap: 24px; }
        @media (min-width: 1000px) { .promo-grid--video { grid-template-columns: repeat(3, 1fr); } }
        .promo-grid--in { animation: promoGridIn 0.45s var(--transition-ease); }
        @keyframes promoGridIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }

        .promo-card { display: flex; flex-direction: column; gap: 0; margin: 0; }

        .promo-thumb {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          padding: 0;
          border: 1px solid var(--border-color);
          background: #0a0a0a;
          cursor: pointer;
          display: block;
        }
        .promo-thumb--video { aspect-ratio: 16 / 10; }
        .promo-thumb img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.5s var(--transition-ease), filter 0.3s ease;
        }
        .promo-thumb:hover img { transform: scale(1.06); }
        .promo-thumb--video img { filter: brightness(0.78); }

        .promo-zoom {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; font-weight: 700; letter-spacing: 0.2em; color: #fff;
          background: rgba(var(--accent-rgb), 0.0);
          opacity: 0; transition: opacity 0.3s ease, background 0.3s ease;
        }
        .promo-thumb:hover .promo-zoom { opacity: 1; background: rgba(var(--accent-rgb), 0.35); }

        .promo-play {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 58px; height: 58px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: var(--accent); color: var(--bg-primary);
          box-shadow: 0 6px 24px rgba(0,0,0,0.5);
          transition: transform 0.3s var(--transition-ease);
        }
        .promo-thumb--video:hover .promo-play { transform: translate(-50%, -50%) scale(1.12); }

        .promo-vcap {
          position: absolute; left: 10px; bottom: 10px;
          font-size: 0.7rem; letter-spacing: 0.12em; color: #fff;
          background: rgba(0,0,0,0.6); padding: 4px 9px; border-left: 2px solid var(--accent);
        }

        .promo-dl {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 11px 8px;
          font-size: 0.72rem; font-weight: 700; letter-spacing: 0.14em;
          text-transform: uppercase; text-decoration: none;
          color: var(--text-primary);
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-top: none;
          transition: all 0.2s ease;
        }
        .promo-dl:hover { background: var(--accent); color: var(--bg-primary); }

        .promo-foot {
          display: flex; flex-wrap: wrap; align-items: center; gap: 10px 24px;
          margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--border-color);
          font-size: 0.78rem; letter-spacing: 0.08em; color: var(--text-secondary);
        }
        .promo-foot a { color: var(--accent); text-decoration: none; font-weight: 700; }
        .promo-foot a:hover { text-decoration: underline; }

        /* Lightbox */
        .promo-lightbox {
          position: fixed; inset: 0; z-index: 10000;
          background: rgba(0,0,0,0.92);
          display: flex; align-items: center; justify-content: center;
          padding: 24px; backdrop-filter: blur(6px);
          animation: lbFade 0.2s ease;
        }
        @keyframes lbFade { from { opacity: 0; } to { opacity: 1; } }
        .lb-close {
          position: absolute; top: 20px; right: 24px;
          background: transparent; border: none; color: #fff;
          font-size: 0.85rem; font-weight: 700; letter-spacing: 0.15em; cursor: pointer;
          padding: 8px;
        }
        .lb-close:hover { color: var(--accent); }
        .lb-inner { max-width: min(92vw, 1100px); width: 100%; display: flex; flex-direction: column; align-items: center; gap: 14px; }
        .lb-inner--video { max-width: min(96vw, 1100px); }
        .lb-media { max-width: 100%; max-height: 78vh; object-fit: contain; border: 2px solid var(--accent); }
        .lb-frame { width: 100%; aspect-ratio: 16 / 9; }
        .lb-frame--portrait { width: auto; height: 78vh; aspect-ratio: 9 / 16; }
        .lb-frame iframe { width: 100%; height: 100%; border: 2px solid var(--accent); display: block; }

        .lb-bar { display: flex; align-items: center; justify-content: space-between; gap: 20px; width: 100%; flex-wrap: wrap; }
        .lb-name { color: #fff; font-size: 0.82rem; letter-spacing: 0.1em; text-transform: uppercase; }
        .lb-dl {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 22px; background: var(--accent); color: var(--bg-primary);
          text-decoration: none; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.12em;
          border: none;
        }
        .lb-dl:hover { filter: brightness(1.1); }
      `}</style>
    </section>
  );
};

export default PromoContent;

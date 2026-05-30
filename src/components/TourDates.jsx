import React from 'react';

const TourDates = ({ theme }) => {
  const dates = [
    { date: 'MAY 31', event: 'WAREHOUSE SESSIONS', loc: 'DELHI NCR' },
    { date: 'JUN 06', event: 'SUB-SYSTEM RAVE', loc: 'BENGALURU' },
    { date: 'JUN 13', event: 'GARAGE SALE UKG', loc: 'MUMBAI' },
    { date: 'JUN 27', event: 'MINIMAL MIND SHOW', loc: 'NEW DELHI' },
    { date: 'JUL 11', event: 'OUTDOOR FESTIVAL', loc: 'GOA' }
  ];

  return (
    <div className={`tour-section ${theme === 'gruvmind' ? 'tour-gruv' : 'tour-garage'}`}>
      
      {/* Infinite Warning Ticker */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {Array.from({ length: 4 }).map((_, loopIdx) => (
            <React.Fragment key={loopIdx}>
              {dates.map((item, idx) => (
                <span key={`${loopIdx}-${idx}`} className="ticker-item">
                  <span className="ticker-dot">●</span>
                  <span className="ticker-date font-mono">{item.date}</span>
                  <span className="ticker-event font-heading">{item.event}</span>
                  <span className="ticker-loc font-mono">[{item.loc}]</span>
                </span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="container tour-grid-container">
        <div className="tour-list-header">
          <h2 className="section-title font-heading">
            {theme === 'gruvmind' ? '▼ DATES & TELEMETRY' : '▲ UPCOMING PORTALS'}
          </h2>
          <p className="section-subtitle font-mono">
            {theme === 'gruvmind' ? 'REALTIME EVENT COORDINATES' : 'WARNING: TICKETS SELL FAST'}
          </p>
        </div>

        <div className="tour-grid">
          {dates.map((item, idx) => (
            <div key={idx} className="tour-row">
              <div className="tour-row-date font-mono">{item.date}</div>
              <div className="tour-row-main">
                <div className="tour-row-event font-heading">{item.event}</div>
                <div className="tour-row-loc font-mono">{item.loc}</div>
              </div>
              <div className="tour-row-action">
                <a 
                  href="#bookings" 
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`PORTAL LOCKED. Booking query dispatched for ${item.event}.`);
                  }}
                  className="btn-primary font-mono"
                >
                  SECURE PASS
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .tour-section {
          padding: 80px 0;
          position: relative;
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          transition: all 0.5s ease;
        }

        .ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          text-transform: uppercase;
        }

        .ticker-dot {
          color: var(--accent);
        }

        .ticker-date {
          background: rgba(var(--accent-rgb), 0.1);
          color: var(--accent);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .ticker-loc {
          color: var(--text-secondary);
        }

        .tour-grid-container {
          margin-top: 60px;
        }

        .tour-list-header {
          text-align: left;
          margin-bottom: 40px;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .section-subtitle {
          font-size: 0.85rem;
          color: var(--text-secondary);
          letter-spacing: 0.1em;
          margin-top: 6px;
        }

        .tour-grid {
          display: flex;
          flex-direction: column;
          gap: 0px;
          border-top: 1px solid var(--border-color);
        }

        .tour-row {
          display: flex;
          align-items: center;
          padding: 24px 0;
          border-bottom: 1px solid var(--border-color);
          transition: background 0.3s ease;
        }

        .tour-row-date {
          font-size: 1.5rem;
          font-weight: 800;
          width: 150px;
          color: var(--accent);
        }

        .tour-row-main {
          flex: 1;
          text-align: left;
        }

        .tour-row-event {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .tour-row-loc {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .tour-row-action {
          width: 180px;
          text-align: right;
        }

        /* Theme adjustments for Gruvmind */
        .tour-gruv .tour-row:hover {
          background: rgba(57, 255, 20, 0.02);
        }
        .tour-gruv .tour-row-date {
          text-shadow: 0 0 10px rgba(57, 255, 20, 0.2);
        }

        /* Theme adjustments for Garage Sale */
        .tour-garage .tour-row {
          border-bottom: 1px dashed var(--border-color);
        }
        .tour-garage .tour-row:hover {
          background: rgba(255, 85, 0, 0.04);
        }
        .tour-garage .tour-row-date {
          font-family: 'Share Tech Mono', monospace;
          color: #ff5500;
        }
        .tour-garage .ticker-date {
          border-radius: 0px;
          background: #ff5500;
          color: #000;
          font-weight: 900;
        }
        
        @media (max-width: 768px) {
          .tour-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            padding: 20px 0;
          }
          .tour-row-date {
            width: auto;
          }
          .tour-row-action {
            width: 100%;
            text-align: left;
          }
          .section-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TourDates;

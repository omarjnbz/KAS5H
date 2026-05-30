import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, Volume2, RotateCcw } from 'lucide-react';

const CustomPlayer = ({ theme, isPlaying, setIsPlaying }) => {
  const iframeRef = useRef(null);
  const canvasRef = useRef(null);
  const widgetRef = useRef(null);
  
  const [trackInfo, setTrackInfo] = useState({ title: 'LOADING SELECTOR...', artist: 'KAS5H' });
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(1);
  const [volume, setVolume] = useState(0.8);
  const [widgetReady, setWidgetReady] = useState(false);

  // Load SoundCloud Widget API
  useEffect(() => {
    const scScriptId = 'soundcloud-widget-api';
    let script = document.getElementById(scScriptId);
    
    const initWidget = () => {
      if (!window.SC || !iframeRef.current) return;
      const widget = window.SC.Widget(iframeRef.current);
      widgetRef.current = widget;

      widget.bind(window.SC.Widget.Events.READY, () => {
        setWidgetReady(true);
        // Sync initial metadata
        widget.getCurrentSound((sound) => {
          if (sound) {
            setTrackInfo({
              title: sound.title || 'UNKNOWN SELECT',
              artist: sound.user?.username || 'KAS5H'
            });
            setDuration(sound.duration || 1);
          }
        });
      });

      widget.bind(window.SC.Widget.Events.PLAY, () => {
        setIsPlaying(true);
        // Play click/bass trigger on play
        playTone(220, 55, 0.1, 'sine');
      });

      widget.bind(window.SC.Widget.Events.PAUSE, () => {
        setIsPlaying(false);
      });

      widget.bind(window.SC.Widget.Events.PLAY_PROGRESS, (progressObj) => {
        setProgress(progressObj.currentPosition);
      });
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scScriptId;
      script.src = 'https://w.soundcloud.com/player/api.js';
      script.onload = () => {
        initWidget();
      };
      document.head.appendChild(script);
    } else {
      if (window.SC) {
        initWidget();
      } else {
        script.addEventListener('load', initWidget);
      }
    }

    return () => {
      if (widgetRef.current && window.SC) {
        widgetRef.current.unbind(window.SC.Widget.Events.READY);
        widgetRef.current.unbind(window.SC.Widget.Events.PLAY);
        widgetRef.current.unbind(window.SC.Widget.Events.PAUSE);
        widgetRef.current.unbind(window.SC.Widget.Events.PLAY_PROGRESS);
      }
    };
  }, [setIsPlaying]);

  // Audio tone synthesizer for UI actions
  const playTone = (freq1, freq2, durationSec, type = 'sine') => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq1, ctx.currentTime);
      if (freq2) {
        osc.frequency.exponentialRampToValueAtTime(freq2, ctx.currentTime + durationSec);
      }
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + durationSec + 0.05);
    } catch (e) {}
  };

  // Synchronize Widget commands
  const handlePlayPause = () => {
    if (!widgetReady || !widgetRef.current) {
      // Offline / blocked widget fallback simulation toggle
      setIsPlaying(!isPlaying);
      playTone(150, 250, 0.15);
      return;
    }
    widgetRef.current.toggle();
  };

  const handleNext = () => {
    playTone(300, 600, 0.1);
    if (widgetRef.current) {
      widgetRef.current.next();
      // Brief timeout to let widgets load next track title
      setTimeout(() => {
        widgetRef.current.getCurrentSound((sound) => {
          if (sound) {
            setTrackInfo({
              title: sound.title || 'UNKNOWN SELECT',
              artist: sound.user?.username || 'KAS5H'
            });
            setDuration(sound.duration || 1);
          }
        });
      }, 500);
    }
  };

  const handleRestart = () => {
    playTone(150, 80, 0.2);
    if (widgetRef.current) {
      widgetRef.current.seekTo(0);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (widgetRef.current) {
      widgetRef.current.setVolume(val * 100);
    }
  };

  // Equalizer Visualizer animation inside the player panel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    
    // Equalizer variables
    const barsCount = 20;
    const barWidth = canvas.width / barsCount;
    let heights = Array(barsCount).fill(5);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate animated bars height
      for (let i = 0; i < barsCount; i++) {
        let targetH = 5;
        if (isPlaying) {
          // React dynamically using noise and frequencies
          const sinFactor = Math.sin(Date.now() * 0.005 + i * 0.4);
          const noiseFactor = Math.random() * 0.5 + 0.5;
          targetH = (Math.abs(sinFactor) * 35 + 5) * noiseFactor;
          
          // Boost center bars (bass frequencies simulation)
          if (i >= 8 && i <= 12) {
            targetH *= 1.3;
          }
        }
        
        // Smooth transition
        heights[i] += (targetH - heights[i]) * 0.25;

        // Render shapes matching theme
        ctx.fillStyle = theme === 'gruvmind' 
          ? `rgba(57, 255, 20, ${0.4 + (heights[i] / 50) * 0.6})` // Green Neon
          : `rgba(255, 85, 0, ${0.4 + (heights[i] / 50) * 0.6})`;  // Industrial Orange

        const x = i * barWidth;
        const h = heights[i];
        const y = canvas.height - h;
        
        if (theme === 'gruvmind') {
          // Rounded organic blobs for Gruvmind
          ctx.beginPath();
          ctx.arc(x + barWidth / 2, y, barWidth / 2.5, 0, Math.PI, true);
          ctx.lineTo(x + barWidth / 2 - barWidth / 2.5, canvas.height);
          ctx.lineTo(x + barWidth / 2 + barWidth / 2.5, canvas.height);
          ctx.fill();
        } else {
          // Sharp grid columns for Garage Sale
          ctx.fillRect(x + 1, y, barWidth - 2, h);
          // Glitch grid dashes on top
          if (isPlaying && Math.random() < 0.15) {
            ctx.fillStyle = '#fff100';
            ctx.fillRect(x + 1, y - 4, barWidth - 2, 2);
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, theme]);

  return (
    <div className={`player-card ${theme === 'gruvmind' ? 'player-gruv' : 'player-garage'}`}>
      
      {/* Hidden SoundCloud Iframe for API binding */}
      <iframe
        ref={iframeRef}
        src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1247293525&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false"
        width="100%"
        height="0"
        scrolling="no"
        frameBorder="no"
        style={{ display: 'none' }}
        allow="autoplay"
        title="soundcloud-player"
      />

      <div className="player-layout">
        {/* Equalizer Visualizer Screen */}
        <div className="player-screen">
          <canvas ref={canvasRef} width="300" height="60" className="visualizer-canvas" />
          <div className="player-track-scroller">
            <div className="player-title">{trackInfo.title}</div>
            <div className="player-artist">{trackInfo.artist}</div>
          </div>
        </div>

        {/* Progress Slider */}
        <div className="player-timeline">
          <div 
            className="timeline-bar" 
            style={{ width: `${(progress / duration) * 100}%` }}
          />
        </div>

        {/* Controls Deck */}
        <div className="player-controls">
          <button onClick={handleRestart} className="ctrl-btn" title="Restart">
            <RotateCcw size={16} />
          </button>
          
          <button onClick={handlePlayPause} className="ctrl-btn play-btn" title={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </button>

          <button onClick={handleNext} className="ctrl-btn" title="Next Select">
            <SkipForward size={16} fill="currentColor" />
          </button>
        </div>

        {/* Bottom Panel: Volume */}
        <div className="player-footer">
          <div className="volume-slider-wrap">
            <Volume2 size={12} className="muted-icon" />
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05" 
              value={volume}
              onChange={handleVolumeChange} 
              className="volume-slider" 
            />
          </div>
          <span className="deck-tag font-mono">
            {theme === 'gruvmind' ? '▼ GRUV_SYS' : '▲ UKG_SALE'}
          </span>
        </div>
      </div>

      {/* Styled Specific Styles */}
      <style>{`
        .player-card {
          width: 320px;
          border-radius: 16px;
          padding: 16px;
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Gruvmind styling: smooth glassmorphism with neon green glow */
        .player-gruv {
          background: rgba(18, 9, 36, 0.7);
          border: 1px solid rgba(167, 139, 250, 0.25);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(57, 255, 20, 0.1);
        }
        .player-gruv .player-screen {
          background: rgba(8, 3, 18, 0.8);
          border-radius: 8px;
          border: 1px solid rgba(57, 255, 20, 0.2);
          overflow: hidden;
          padding: 8px;
          position: relative;
        }
        .player-gruv .player-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          color: #39ff14;
          font-size: 0.8rem;
          white-space: nowrap;
          animation: marquee 12s linear infinite;
        }
        .player-gruv .player-artist {
          font-family: 'Outfit', sans-serif;
          color: #a78bfa;
          font-size: 0.7rem;
        }
        .player-gruv .timeline-bar {
          background: #39ff14;
          box-shadow: 0 0 8px #39ff14;
        }
        .player-gruv .ctrl-btn {
          color: #a78bfa;
        }
        .player-gruv .ctrl-btn:hover {
          color: #39ff14;
          text-shadow: 0 0 5px #39ff14;
        }
        .player-gruv .play-btn {
          background: rgba(57, 255, 20, 0.1);
          border: 1px solid #39ff14;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #39ff14;
        }
        .player-gruv .play-btn:hover {
          background: #39ff14;
          color: #080312;
        }

        /* Garage Sale styling: gritty orange neon outline with warning yellow elements */
        .player-garage {
          background: #0f0f0f;
          border: 2px solid #ff5500;
          border-radius: 0px;
          box-shadow: 10px 10px 0px #000;
        }
        .player-garage .player-screen {
          background: #000;
          border: 1px dashed #ff5500;
          padding: 8px;
          border-radius: 0px;
        }
        .player-garage .player-title {
          font-family: 'Share Tech Mono', monospace;
          color: #fff100;
          font-size: 0.85rem;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }
        .player-garage .player-artist {
          font-family: 'Share Tech Mono', monospace;
          color: #ff5500;
          font-size: 0.7rem;
        }
        .player-garage .player-timeline {
          height: 4px;
          background: #262626;
        }
        .player-garage .timeline-bar {
          background: #ff5500;
        }
        .player-garage .ctrl-btn {
          color: #ffffff;
          border: 1px solid #262626;
          border-radius: 0px;
          padding: 4px;
          background: #171717;
        }
        .player-garage .ctrl-btn:hover {
          border-color: #ff5500;
          color: #ff5500;
          background: #000;
        }
        .player-garage .play-btn {
          background: #ff5500;
          border: 1px solid #ff5500;
          color: #000;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .player-garage .play-btn:hover {
          background: #000;
          color: #ff5500;
        }

        /* Shared deck sizing */
        .player-layout {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .player-screen {
          height: 90px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .visualizer-canvas {
          width: 100%;
          height: 40px;
        }
        .player-track-scroller {
          overflow: hidden;
          width: 100%;
        }
        .player-timeline {
          width: 100%;
          height: 6px;
          background: rgba(255,255,255,0.05);
          border-radius: 3px;
          position: relative;
          overflow: hidden;
        }
        .timeline-bar {
          height: 100%;
          width: 0;
          transition: width 0.1s linear;
        }
        .player-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
        }
        .ctrl-btn {
          background: transparent;
          border: none;
          outline: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .player-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.65rem;
          color: #666;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 8px;
        }
        .volume-slider-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .volume-slider {
          -webkit-appearance: none;
          width: 60px;
          height: 3px;
          background: rgba(255,255,255,0.1);
          outline: none;
          border-radius: 2px;
        }
        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--accent);
          cursor: pointer;
        }
        .deck-tag {
          font-weight: 700;
          color: var(--accent);
        }

        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(-30%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }

        @media (max-width: 480px) {
          .player-card {
            width: calc(100vw - 32px);
            right: 16px;
            bottom: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomPlayer;

import { useEffect, useRef, useState, useCallback } from 'react';

/*
 * Drives one SoundCloud player iframe through the official Widget API so the
 * page can own the controls: the disc is the play button, the bar under it
 * shows progress. The iframe itself stays in the DOM (SoundCloud needs it to
 * stream) but is visually hidden.
 *
 * Returns { ready, playing, position, duration, toggle, play, pause, seek }.
 * `trackId` is the SoundCloud track id; changing it loads the new track and,
 * if something was playing, keeps playing.
 */
const API = 'https://w.soundcloud.com/player/api.js';
let apiPromise = null;
const loadApi = () => {
  if (window.SC?.Widget) return Promise.resolve(window.SC);
  if (!apiPromise) {
    apiPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = API;
      s.async = true;
      s.onload = () => resolve(window.SC);
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  return apiPromise;
};

export const trackUrl = (id) => `https://api.soundcloud.com/tracks/${id}`;

export default function useSoundCloud(iframeRef, trackId) {
  const widget = useRef(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const wasPlaying = useRef(false);
  const loaded = useRef(trackId);

  useEffect(() => {
    let dead = false;
    loadApi().then((SC) => {
      if (dead || !iframeRef.current) return;
      const w = SC.Widget(iframeRef.current);
      const E = SC.Widget.Events;
      w.bind(E.READY, () => {
        if (dead) return;
        setReady(true);
        w.getDuration((d) => setDuration(d));
      });
      w.bind(E.PLAY, () => { setPlaying(true); wasPlaying.current = true; w.getDuration((d) => setDuration(d)); });
      w.bind(E.PAUSE, () => { setPlaying(false); wasPlaying.current = false; });
      w.bind(E.FINISH, () => { setPlaying(false); wasPlaying.current = false; setPosition(0); });
      w.bind(E.PLAY_PROGRESS, (e) => setPosition(e.currentPosition));
      widget.current = w;
    }).catch(() => {});
    return () => { dead = true; widget.current = null; };
  }, [iframeRef]);

  // Follow the chosen disc.
  useEffect(() => {
    const w = widget.current;
    if (!w || !ready || loaded.current === trackId) return;
    loaded.current = trackId;
    setPosition(0);
    w.load(trackUrl(trackId), {
      auto_play: wasPlaying.current,
      show_artwork: false,
      callback: () => w.getDuration((d) => setDuration(d)),
    });
  }, [trackId, ready]);

  const play = useCallback(() => widget.current?.play(), []);
  const pause = useCallback(() => widget.current?.pause(), []);
  const toggle = useCallback(() => widget.current?.toggle(), []);
  const seek = useCallback((frac) => {
    const w = widget.current;
    if (!w || !duration) return;
    w.seekTo(Math.max(0, Math.min(1, frac)) * duration);
  }, [duration]);

  return { ready, playing, position, duration, play, pause, toggle, seek };
}

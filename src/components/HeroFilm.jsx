import { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import Name from './Name';
import { reduceMotion } from '../motion/motion';

const PHONE = '(max-width: 640px)';
// While the camera has the layers apart (3.0–7.4 s into the film) the room tilts away,
// so the tag and kicker step back rather than float over the dark.
const APART = [2.9, 7.4];

/*
 * KAS5H's hero: the HyperFrames film made from one studio photo (project:
 * ../kas5h-hyperframes, cuts site-wide and site-phone, rendered without tag or
 * action because the page draws its own). The name lands behind his head, the
 * camera pulls the layers apart and puts them back, and the film holds on the
 * finished hero. It plays once; the button pauses, resumes or replays it. Under
 * reduced motion it shows the last frame as a still until asked to play.
 *
 * The film's ground is the page's own #0a0a0a, so it sits without a box: .film is
 * the film's stage (the rounded room inside the picture) and the video overhangs
 * it by the film's own margins (App.css, "KAS5H's film").
 */
export default function HeroFilm({ name, film, marker, kicker, tag }) {
  const video = useRef(null);
  const [phone, setPhone] = useState(() => window.matchMedia(PHONE).matches);
  const [still, setStill] = useState(reduceMotion);
  const [state, setState] = useState('paused'); // paused | playing | ended; autoplay flips it
  const [apart, setApart] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(PHONE);
    const onChange = () => setPhone(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const cut = phone ? film.phone : film.wide;

  const onTime = (e) => {
    const t = e.currentTarget.currentTime;
    setApart(t > APART[0] && t < APART[1]);
  };

  const toggle = () => {
    if (still) { setStill(false); return; } // the video mounts with autoPlay
    const v = video.current;
    if (!v) return;
    if (state === 'ended') { v.currentTime = 0; v.play(); }
    else if (v.paused) v.play();
    else v.pause();
  };

  const label = still || state === 'ended' ? 'Play the film' : state === 'paused' ? 'Resume the film' : 'Pause the film';
  const icon = still || state === 'paused' ? 'solar:play-bold' : state === 'ended' ? 'solar:restart-bold' : 'solar:pause-bold';

  return (
    <div className={`film ${phone ? 'film--phone' : ''} ${apart ? 'is-apart' : ''}`}>
      <h1 className="sr-only"><Name text={name} /></h1>

      {still ? (
        <img className="film-media" src={cut.end} alt={film.alt} />
      ) : (
        <video
          key={cut.src}
          ref={video}
          className="film-media"
          src={cut.src}
          autoPlay
          muted
          playsInline
          preload="auto"
          aria-label={film.alt}
          onPlay={() => setState('playing')}
          onPause={(e) => setState(e.currentTarget.ended ? 'ended' : 'paused')}
          onEnded={() => { setState('ended'); setApart(false); }}
          onTimeUpdate={onTime}
        />
      )}

      <p className="stage-tag film-fade font-mono" data-hero-chrome>{marker} {tag}</p>
      <p className="stage-kicker film-fade font-mono" data-hero-chrome>{kicker}</p>

      <div className="stage-controls" data-hero-chrome>
        <button type="button" className="stage-btn" onClick={toggle} aria-label={label}>
          <Icon icon={icon} width="14" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

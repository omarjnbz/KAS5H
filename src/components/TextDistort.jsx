import { useState, useEffect, useRef } from 'react';
import Name from './Name';

/*
 * Hover glitch on display words, one per alias:
 *   KAS5H — letters scramble and resolve left to right (rave terminal).
 *   M0rf  — a one-shot fracture: the word splits, skews and throws offset
 *           colour layers, then snaps back (.fx-fracture in App.css).
 * Plain CSS and text only. The old M0rf effect used an SVG displacement filter
 * on HTML text, which some browsers (Safari especially) render blank or broken.
 */
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789%@$#&!';

const TextDistort = ({ text, theme }) => {
  const [displayText, setDisplayText] = useState(text);
  const [hit, setHit] = useState(false);
  const timer = useRef(null);
  const m0rf = theme === 'm0rf';

  useEffect(() => () => clearInterval(timer.current), []);

  const scramble = () => {
    let step = 0;
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setDisplayText(
        text.split('').map((ch, i) => (ch === ' ' || i < step ? ch : CHARS[Math.floor(Math.random() * CHARS.length)])).join('')
      );
      if (step >= text.length) {
        clearInterval(timer.current);
        setDisplayText(text);
      }
      step += 1 / 3;
    }, 25);
  };

  const onEnter = () => (m0rf ? setHit(true) : scramble());
  const onLeave = () => {
    if (m0rf) return;
    clearInterval(timer.current);
    setDisplayText(text);
  };

  return (
    <span
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onAnimationEnd={() => setHit(false)}
      className={`distort-text-wrapper ${m0rf ? 'fx-fracture' : 'fx-scramble'} ${hit ? 'is-hit' : ''}`}
    >
      <span className="distort-content font-heading"><Name text={displayText} /></span>
    </span>
  );
};

export default TextDistort;

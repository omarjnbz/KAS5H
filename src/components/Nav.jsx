import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import ThemeHud from './ThemeHud';
import Name from './Name';

const CHAPTERS = [
  ['tracks', 'Crate'],
  ['press', 'Press'],
  ['bio', 'Bio'],
  ['book', 'Book'],
];

/*
 * Its own row at the top, never over the hero frame (the hero leaves room for it).
 * Once the page moves it frosts over, and the chapter you're in is underlined.
 * Chapters are looked up by id on every read: the themed subtree remounts on an
 * alias switch, so holding on to the elements would go stale.
 */
export default function Nav({ theme, onSwitch, name }) {
  const [scrolled, setScrolled] = useState(false);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const probe = window.innerHeight * 0.35;
      setScrolled(window.scrollY > 8);
      setCurrent(CHAPTERS.find(([id]) => {
        const r = document.getElementById(id)?.getBoundingClientRect();
        return r && r.top <= probe && r.bottom > probe;
      })?.[0] ?? null);
    };
    const onScroll = () => { frame ||= requestAnimationFrame(read); };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);

  return (
    <header className={`site-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <a href="#top" className="site-nav-mark font-mono" aria-label={`${name} — top of page`}>
        <span className="site-nav-glyph" aria-hidden="true" />
        {/* One span: the mark is a flex row, and a bare <Name> would gap the zero. */}
        <span><Name text={name} /></span>
      </a>
      <nav className="site-nav-links font-mono" aria-label="Chapters">
        {CHAPTERS.map(([id, label]) => (
          <a key={id} href={`#${id}`} aria-current={current === id ? 'true' : undefined}>{label}</a>
        ))}
      </nav>
      <div className="site-nav-end">
        <ThemeHud theme={theme} onSwitch={onSwitch} />
        <a href="#bookings" className="site-nav-cta font-mono">
          Bookings <Icon icon="solar:arrow-right-up-linear" width="14" aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}

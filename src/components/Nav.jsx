import ThemeHud from './ThemeHud';
import Name from './Name';

export default function Nav({ theme, onSwitch, name }) {
  return (
    <header className="site-nav">
      <a href="#top" className="site-nav-mark font-mono" aria-label={`${name} — top of page`}><Name text={name} /></a>
      <ThemeHud theme={theme} onSwitch={onSwitch} />
      <a href="#bookings" className="site-nav-cta font-mono">BOOKINGS</a>
    </header>
  );
}

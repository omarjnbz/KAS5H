import ThemeHud from './ThemeHud';

export default function Nav({ theme, setTheme, name }) {
  return (
    <header className="site-nav">
      <a href="#top" className="site-nav-mark font-mono" aria-label={`${name} — top of page`}>{name}</a>
      <ThemeHud theme={theme} setTheme={setTheme} />
      <a href="#bookings" className="site-nav-cta font-mono">BOOKINGS</a>
    </header>
  );
}

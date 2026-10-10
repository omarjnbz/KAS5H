/*
 * The alias switch in the nav. The switch itself (sound, flash, keeping your
 * place on the page) lives in App, shared with the split section.
 */
const ThemeHud = ({ theme, onSwitch }) => (
  <div className="theme-hud" role="group" aria-label="Alias">
    <button
      type="button"
      onClick={() => onSwitch('garagesale')}
      className={`theme-hud-btn ${theme === 'garagesale' ? 'active' : ''}`}
      aria-pressed={theme === 'garagesale'}
    >
      ▲ KAS5H
    </button>
    <button
      type="button"
      onClick={() => onSwitch('m0rf')}
      className={`theme-hud-btn ${theme === 'm0rf' ? 'active' : ''}`}
      aria-pressed={theme === 'm0rf'}
      aria-label="M0rf"
    >
      ● M<span className="zero">0</span>RF
    </button>
  </div>
);

export default ThemeHud;

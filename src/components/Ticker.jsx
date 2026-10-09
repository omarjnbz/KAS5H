/* Genre ticker. Items duplicated once so the loop is seamless. */
export default function Ticker({ items, marker }) {
  const row = items.map((t) => <span key={t}>{marker} {t}</span>);
  return (
    <div className="ticker-wrap font-mono" aria-label={items.join(', ')}>
      <div className="ticker-inner" aria-hidden="true">{row}{row}</div>
    </div>
  );
}

/*
 * Pre-split word reveal. Rendered by React (not DOM-mutated), so it survives
 * re-renders. The unsplit text stays the accessible name via aria-label; the
 * word spans are decorative. Without JS the words are simply visible.
 */
export default function Words({ as: Tag = 'span', text, className = '', ...rest }) {
  return (
    <Tag className={className} aria-label={text} data-words="" {...rest}>
      {text.split(/(\s+)/).map((part, i) =>
        part.trim()
          ? <span className="w-mask" aria-hidden="true" key={i}><span className="w">{part}</span></span>
          : <span key={i} aria-hidden="true">{part}</span>
      )}
    </Tag>
  );
}

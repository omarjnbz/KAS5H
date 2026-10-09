/*
 * Alias names, set correctly. M0rf is spelled with a zero, and in the display
 * faces a zero reads as an O — so every "0" in a name is wrapped and styled
 * (.zero in App.css: taller, slashed, accent-coloured) to read unmistakably as
 * a digit. Plain strings everywhere else.
 */
export default function Name({ text }) {
  if (!text || !text.includes('0')) return text;
  return text.split(/(0)/).map((part, i) =>
    part === '0' ? <span className="zero" key={i}>0</span> : part
  );
}

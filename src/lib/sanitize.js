export const MAX_NAME_LENGTH = 24;

/** Trims, collapses whitespace and limits length without splitting an emoji in half. */
export function cleanName(value) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_NAME_LENGTH)
    .replace(/[\uD800-\uDBFF]$/, '')
    .trim();
}

/** First word of a name, limited by visible characters so Hindi and Bengali stay intact. */
export function firstName(value) {
  const word = value.trim().split(/\s+/)[0];
  const graphemes = Array.from(new Intl.Segmenter().segment(word), (part) => part.segment);
  return graphemes.slice(0, 12).join('');
}

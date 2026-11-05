import { DataSet, englishDataset, englishRecommendedTransformers, RegExpMatcher } from 'obscenity';

// These match inside common Indian names (Harshit, Dikshit, Shital, Anal), so the English matcher
// skips them. "shit" is blocked below as a whole word instead.
const NAME_FRIENDLY_PHRASES = new Set(['shit', 'anal']);

const englishMatcher = new RegExpMatcher({
  ...new DataSet()
    .addAll(englishDataset)
    .removePhrasesIf((phrase) => NAME_FRIENDLY_PHRASES.has(phrase.metadata.originalWord))
    .build(),
  ...englishRecommendedTransformers,
});

// Hindi and Bengali abuse, in native and romanised spellings. English filters miss all of these.
const BLOCKED_WORDS = new Set([
  'shit',
  'shitty',
  'bullshit',
  'chutiya',
  'chutiye',
  'madarchod',
  'behenchod',
  'bhenchod',
  'banchod',
  'bokachoda',
  'gandu',
  'bhosdike',
  'bhosdi',
  'lauda',
  'lavda',
  'randi',
  'khanki',
  'harami',
  'चूतिया',
  'मादरचोद',
  'बहनचोद',
  'भेनचोद',
  'गांडू',
  'भोसड़ी',
  'भोसड़ीके',
  'लौड़ा',
  'रंडी',
  'हरामी',
  'বোকাচোদা',
  'বানচোদ',
  'খানকি',
  'মাগি',
  'চুদি',
  'হারামি',
]);

/** True if the text contains language we won't carry to someone's phone. */
export function hasProfanity(text) {
  if (englishMatcher.hasMatch(text)) return true;
  const words = text.toLowerCase().match(/[\p{L}\p{M}]+/gu) ?? [];
  return words.some((word) => BLOCKED_WORDS.has(word));
}

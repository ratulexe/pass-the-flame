import { fallbackWish } from './wishes';

const MAX_CHAIN = 8;
const ID_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';

function randomId(length = 7) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (byte) => ID_ALPHABET[byte % ID_ALPHABET.length]).join('');
}

/** People before the sender, always keeping whoever first lit this flame. */
function nextChain(parent) {
  const names = [...parent.chain, parent.from];
  return names.length > MAX_CHAIN ? [names[0], ...names.slice(-(MAX_CHAIN - 1))] : names;
}

// In-memory stand-in until Firestore arrives in Phase B.
const store = new Map([
  [
    'sample',
    {
      id: 'sample',
      from: 'Aarav',
      to: 'Meera',
      relation: 'bestie',
      lang: 'en',
      message: fallbackWish({ from: 'Aarav', to: 'Meera', lang: 'en' }),
      parentId: null,
      rootId: 'sample',
      chain: ['Kabir', 'Isha'],
      depth: 2,
    },
  ],
]);

export function createGreeting({ from, to, relation, lang, parent = null }) {
  const id = randomId();
  const greeting = {
    id,
    from,
    to,
    relation,
    lang,
    message: fallbackWish({ from, to, lang }),
    parentId: parent?.id ?? null,
    rootId: parent?.rootId ?? id,
    chain: parent ? nextChain(parent) : [],
    depth: parent ? parent.depth + 1 : 0,
  };
  store.set(id, greeting);
  return greeting;
}

export async function getGreeting(id) {
  return store.get(id) ?? null;
}

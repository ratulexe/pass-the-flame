import { loadFirestore } from './firebase';
import { fallbackWish } from './wishes';

const MAX_CHAIN = 8;
const ID_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';
const SAVE_ATTEMPTS = 2;

function randomId(length = 7) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (byte) => ID_ALPHABET[byte % ID_ALPHABET.length]).join('');
}

/** People before the sender, always keeping whoever first lit this flame. */
function nextChain(parent) {
  const names = [...parent.chain, parent.from];
  return names.length > MAX_CHAIN ? [names[0], ...names.slice(-(MAX_CHAIN - 1))] : names;
}

/** A complete greeting except for its id, which is chosen when it is saved. */
export function draftGreeting({ from, to, relation, lang, parent = null }) {
  return {
    from,
    to,
    relation,
    lang,
    message: fallbackWish({ from, to, lang }),
    parentId: parent?.id ?? null,
    rootId: parent?.rootId ?? null,
    chain: parent ? nextChain(parent) : [],
    depth: parent ? parent.depth + 1 : 0,
  };
}

/**
 * Saves the greeting and counts it, together or not at all. The rules treat a taken id as a
 * forbidden update, so a refused write tries once more with a new id.
 */
export async function saveGreeting(draft) {
  const { db, doc, writeBatch, serverTimestamp, increment } = await loadFirestore();
  for (let attempt = 1; ; attempt++) {
    const id = randomId();
    const fields = { ...draft, rootId: draft.rootId ?? id };
    const batch = writeBatch(db);
    batch.set(doc(db, 'greetings', id), { ...fields, createdAt: serverTimestamp() });
    batch.update(doc(db, 'stats', 'global'), { totalDiyas: increment(1) });
    try {
      await batch.commit();
      return { ...fields, id };
    } catch (error) {
      if (error.code !== 'permission-denied' || attempt === SAVE_ATTEMPTS) throw error;
    }
  }
}

/** Returns the greeting, or null if no greeting has this id. */
export async function getGreeting(id) {
  const { db, doc, getDoc } = await loadFirestore();
  const snapshot = await getDoc(doc(db, 'greetings', id));
  if (!snapshot.exists()) return null;
  // A Timestamp can't travel in router state when the flame is passed on.
  const fields = snapshot.data();
  delete fields.createdAt;
  return { id: snapshot.id, ...fields };
}

import { loadLiveFirestore } from './firebase';

// Every open sky reads each of these once, so this cap protects the 50K reads/day free quota.
export const VISIBLE_DIYAS = 100;

/** Listens to the latest diyas and the counts. Returns a function that stops listening. */
export function watchSky({ onDiyas, onStats, onError }) {
  let stopped = false;
  let stopListening = [];

  loadLiveFirestore()
    .then(({ db, collection, doc, limit, onSnapshot, orderBy, query }) => {
      if (stopped) return;
      const latest = query(
        collection(db, 'sky'),
        orderBy('createdAt', 'desc'),
        limit(VISIBLE_DIYAS),
      );
      stopListening = [
        onSnapshot(
          latest,
          (snapshot) =>
            onDiyas(snapshot.docs.map((diya) => ({ id: diya.id, passed: diya.get('passed') }))),
          onError,
        ),
        onSnapshot(doc(db, 'stats', 'global'), (snapshot) => onStats(snapshot.data()), onError),
      ];
    })
    .catch(onError);

  return () => {
    stopped = true;
    stopListening.forEach((stop) => stop());
  };
}

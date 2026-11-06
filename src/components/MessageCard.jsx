import { useState } from 'react';
import { showToast } from '../lib/toast';
import { shareWishCard } from '../lib/wishCard';
import { cardLines } from '../lib/wishes';

export default function MessageCard({ greeting }) {
  const { title, relationLine, sign } = cardLines(greeting);
  const [making, setMaking] = useState(false);
  // A wish that arrives after the card has opened skips the staggered reveal delay.
  const [wishArrivesLate] = useState(!greeting.message);
  const ready = Boolean(greeting.message);

  const copyMessage = async () => {
    const text = `${title}\n\n${relationLine}\n${greeting.message}\n\n${sign}`;
    try {
      await navigator.clipboard.writeText(text);
      showToast('Message copied');
    } catch {
      showToast('Copy was blocked here. Select the text to copy it.');
    }
  };

  const shareImage = async () => {
    setMaking(true);
    try {
      const outcome = await shareWishCard(greeting);
      if (outcome === 'saved') showToast('Your wish card is saved');
    } catch {
      showToast('The card could not be made here. Try again.');
    }
    setMaking(false);
  };

  return (
    <div className="card wish-card reveal" lang={greeting.lang}>
      <span className="wish-flame self-center" aria-hidden="true">
        <span className="flame-core" />
      </span>
      <h2 className="message-title text-center">{title}</h2>
      <p className="font-semibold text-flame">{relationLine}</p>
      {ready ? (
        <p className={`text-[1.14rem] leading-[1.6] ${wishArrivesLate ? 'wish-late' : ''}`}>
          {greeting.message}
        </p>
      ) : (
        <p className="flex items-center gap-2.5 text-muted" lang="en" role="status">
          <span className="wish-flame" aria-hidden="true">
            <span className="flame-core" />
          </span>
          Writing your wish…
        </p>
      )}
      <p className="text-muted">{sign}</p>
      <div className="flex flex-wrap gap-2.5" lang="en">
        <button type="button" className="btn" disabled={making || !ready} onClick={shareImage}>
          {making ? 'Making your card…' : 'Share as image'}
        </button>
        <button type="button" className="btn" disabled={!ready} onClick={copyMessage}>
          Copy message
        </button>
      </div>
    </div>
  );
}

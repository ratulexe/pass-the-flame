import { useState } from 'react';
import { showToast } from '../lib/toast';
import { shareWishCard } from '../lib/wishCard';
import { cardLines } from '../lib/wishes';

export default function MessageCard({ greeting }) {
  const { title, relationLine, sign } = cardLines(greeting);
  const [making, setMaking] = useState(false);

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
    <div className="card reveal" lang={greeting.lang}>
      <h2 className="message-title">{title}</h2>
      <p className="font-semibold text-flame">{relationLine}</p>
      <p className="text-[1.14rem] leading-[1.6]">{greeting.message}</p>
      <p className="text-muted">{sign}</p>
      <div className="flex flex-wrap gap-2.5" lang="en">
        <button type="button" className="btn" disabled={making} onClick={shareImage}>
          {making ? 'Making your card…' : 'Share as image'}
        </button>
        <button type="button" className="btn" onClick={copyMessage}>
          Copy message
        </button>
      </div>
    </div>
  );
}

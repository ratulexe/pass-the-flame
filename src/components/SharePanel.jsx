import { showToast } from '../lib/toast';

const SAVE_MESSAGES = {
  saving: 'Saving your flame…',
  slow: 'Still saving your flame. This is taking longer than usual…',
  failed: 'Your flame could not be saved. Check your connection and try again.',
};

function ShareActions({ greeting }) {
  const link = `${window.location.origin}/g/${greeting.id}`;
  const text = `${greeting.from} lit a diya for you this Diwali. Open it to receive the flame:`;
  const canShare = Boolean(navigator.share);

  const share = async () => {
    try {
      await navigator.share({ title: 'Pass the Flame', text, url: link });
    } catch (error) {
      if (error.name !== 'AbortError')
        showToast('Sharing was blocked here. Copy the link instead.');
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      showToast('Link copied');
    } catch {
      showToast('Copy was blocked here. Select the link to copy it.');
    }
  };

  return (
    <>
      <label className="field">
        Your link
        <input readOnly value={link} dir="ltr" onFocus={(event) => event.target.select()} />
      </label>
      <div className="flex flex-wrap gap-2.5">
        <a
          className="btn btn-primary text-center"
          href={`https://wa.me/?text=${encodeURIComponent(`${text}\n${link}`)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Send on WhatsApp
        </a>
        {canShare && (
          <button type="button" className="btn" onClick={share}>
            More ways to share
          </button>
        )}
        <button type="button" className="btn" onClick={copy}>
          Copy link
        </button>
      </div>
    </>
  );
}

/** Shows the greeting's link once it is saved, and the save's progress until then. */
export default function SharePanel({ status, greeting, recipient, onRetry }) {
  return (
    <div className="flex flex-col gap-3.5">
      <p>
        Send this to <b>{recipient}</b>. When they open it, your flame flies in and lights their
        diya.
      </p>
      {greeting ? (
        <ShareActions greeting={greeting} />
      ) : (
        <p className="text-[0.95rem] text-muted" role="status">
          {SAVE_MESSAGES[status]}
        </p>
      )}
      {status === 'failed' && (
        <div>
          <button type="button" className="btn" onClick={onRetry}>
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

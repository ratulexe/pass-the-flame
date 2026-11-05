import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReceiveFlow from '../components/ReceiveFlow';
import { getGreeting } from '../lib/greetings';

export default function ReceivePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState({ id: null, greeting: null, failed: false });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getGreeting(id)
      .then((greeting) => {
        if (active) setResult({ id, greeting, failed: false });
      })
      .catch(() => {
        if (active) setResult({ id, greeting: null, failed: true });
      });
    window.scrollTo(0, 0);
    return () => {
      active = false;
    };
  }, [id, attempt]);

  const retry = () => {
    setResult({ id: null, greeting: null, failed: false });
    setAttempt((count) => count + 1);
  };

  if (result.id !== id) {
    return (
      <p className="text-center text-muted" role="status">
        Looking for your flame…
      </p>
    );
  }

  if (result.failed) {
    return (
      <section className="flex flex-col gap-[22px]">
        <h1>Your flame is having trouble reaching you</h1>
        <p className="text-[1.05rem] text-muted">Check your connection, then try again.</p>
        <button type="button" className="btn btn-primary btn-big" onClick={retry}>
          Try again
        </button>
      </section>
    );
  }

  const { greeting } = result;
  if (!greeting) {
    return (
      <section className="flex flex-col gap-[22px]">
        <h1>This flame could not be found</h1>
        <p className="text-[1.05rem] text-muted">
          The link may be incomplete. You can still light a diya of your own.
        </p>
        <Link to="/" className="btn btn-primary btn-big text-center">
          Light a diya
        </Link>
      </section>
    );
  }

  const continueAs = (parent) =>
    navigate('/', { state: { from: greeting.to, lang: greeting.lang, parent } });

  return (
    <ReceiveFlow
      key={greeting.id}
      greeting={greeting}
      onPass={() => continueAs(greeting)}
      onStartOwn={() => continueAs(null)}
    />
  );
}

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Diya from '../components/Diya';
import Matchstick from '../components/Matchstick';
import MessageCard from '../components/MessageCard';
import RangoliCanvas from '../components/RangoliCanvas';
import ReceiveFlow from '../components/ReceiveFlow';
import { useCelebration } from '../hooks/useCelebration';
import { sound } from '../lib/audio';
import { createGreeting } from '../lib/greetings';
import { cleanName, firstName, MAX_NAME_LENGTH } from '../lib/sanitize';
import { LANGUAGES, RELATIONS } from '../lib/wishes';

const DEFAULT_RANGOLI_NAME = 'Diwali';
const PREVIEW_DEBOUNCE_MS = 200;
const TYPING_BLOOM_MS = 1000;
const INTRO_BLOOM_MS = 1400;
const LIT_BLOOM_MS = 2600;
const DEFAULT_HINT = 'Drag the matchstick to the wick to light your diya.';

export default function CreatePage() {
  const { state: passed } = useLocation();
  const [parent, setParent] = useState(passed?.parent ?? null);
  const [from, setFrom] = useState(passed?.from ?? '');
  const [to, setTo] = useState('');
  const [relation, setRelation] = useState(passed ? 'friend' : 'bestie');
  const [lang, setLang] = useState(passed?.lang ?? 'en');
  const [rangoliName, setRangoliName] = useState(DEFAULT_RANGOLI_NAME);
  const [bloomMs, setBloomMs] = useState(INTRO_BLOOM_MS);
  const [bloomKey, setBloomKey] = useState(0);
  const [hint, setHint] = useState({ text: DEFAULT_HINT, error: false });
  const [greeting, setGreeting] = useState(null);
  const [previewing, setPreviewing] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  const stageRef = useRef(null);
  const anchorRef = useRef(null);
  const resultRef = useRef(null);
  const fromRef = useRef(null);
  const toRef = useRef(null);
  const { celebrate, frameStage } = useCelebration({ tapForFireworks: !previewing });
  const lit = Boolean(greeting);
  const chainRoot = parent ? (parent.chain[0] ?? parent.from) : null;

  useEffect(() => {
    if (passed || resetCount) toRef.current.focus();
  }, [passed, resetCount]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [previewing]);

  useEffect(() => {
    const next = to.trim() || DEFAULT_RANGOLI_NAME;
    if (lit || next === rangoliName) return undefined;
    const timer = setTimeout(() => {
      setBloomMs(TYPING_BLOOM_MS);
      setRangoliName(next);
    }, PREVIEW_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [to, lit, rangoliName]);

  const light = () => {
    if (lit) return true;
    const cleanFrom = cleanName(from);
    const cleanTo = cleanName(to);
    if (!cleanFrom || !cleanTo) {
      setHint({ text: 'Add your name and theirs first, then light the diya.', error: true });
      (cleanFrom ? toRef : fromRef).current.focus();
      return false;
    }
    sound.unlock();
    sound.ambient();
    sound.ignite();
    setGreeting(createGreeting({ from: cleanFrom, to: cleanTo, relation, lang, parent }));
    setRangoliName(cleanTo);
    setBloomMs(LIT_BLOOM_MS);
    setBloomKey((key) => key + 1);
    frameStage(stageRef.current);
    celebrate(cleanTo, resultRef);
    return true;
  };

  const startAnother = () => {
    setParent(null);
    setTo('');
    setRelation('friend');
    setGreeting(null);
    setHint({ text: DEFAULT_HINT, error: false });
    setRangoliName(DEFAULT_RANGOLI_NAME);
    setBloomMs(INTRO_BLOOM_MS);
    setResetCount((count) => count + 1);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {previewing && <ReceiveFlow greeting={greeting} onBack={() => setPreviewing(false)} />}

      <section className="flex flex-col gap-[22px]" aria-label="Light a diya" hidden={previewing}>
        <div className="dimmable flex flex-col gap-2">
          {chainRoot && (
            <p className="font-semibold text-flame">
              You&apos;re passing on a flame that began with {chainRoot}.
            </p>
          )}
          <h1>Light a diya for someone you love.</h1>
          <p className="text-[1.05rem] text-muted">
            They light the next one, and your flame keeps travelling from home to home.
          </p>
        </div>

        <form
          className="card dimmable"
          autoComplete="off"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="grid grid-cols-1 gap-3 min-[361px]:grid-cols-2">
            <label className="field">
              Your name
              <input
                ref={fromRef}
                value={from}
                maxLength={MAX_NAME_LENGTH}
                placeholder="Aarav"
                required
                disabled={lit}
                onChange={(event) => setFrom(event.target.value)}
              />
            </label>
            <label className="field">
              Their name
              <input
                ref={toRef}
                value={to}
                maxLength={MAX_NAME_LENGTH}
                placeholder="Meera"
                required
                disabled={lit}
                onChange={(event) => setTo(event.target.value)}
              />
            </label>
            <label className="field">
              They are your
              <select
                value={relation}
                disabled={lit}
                onChange={(event) => setRelation(event.target.value)}
              >
                {RELATIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              Wish them in
              <select value={lang} disabled={lit} onChange={(event) => setLang(event.target.value)}>
                {LANGUAGES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </form>

        <div ref={stageRef} className={`stage ${lit ? 'lit' : ''}`}>
          <RangoliCanvas name={rangoliName} duration={bloomMs} bloomKey={bloomKey} />
          <Diya anchorRef={anchorRef} showTarget={!lit} />
          <Matchstick targetRef={anchorRef} onLight={light} gone={lit} />
        </div>

        <p className="dimmable -mt-1.5 text-center text-[0.9rem] text-balance text-muted">
          {to.trim()
            ? `This rangoli grows from the letters of ${to.trim()}'s name. Every name gets its own pattern.`
            : 'Type their name to grow a rangoli from it.'}
        </p>

        {!lit && (
          <p className="dimmable text-center text-[0.98rem] text-balance">
            <span className={hint.error ? 'text-[#ff9fb0]' : ''} role={hint.error ? 'alert' : null}>
              {hint.text}
            </span>{' '}
            <button type="button" className="link-btn" onClick={light}>
              Or tap here to light it
            </button>
          </p>
        )}

        {lit && (
          <div ref={resultRef} className="dimmable flex flex-col gap-[22px]">
            <MessageCard greeting={greeting} />
            <div className="card">
              <h2 className="card-title">Your flame is ready to travel</h2>
              <p>
                When <b>{greeting.to}</b> opens your link, your flame flies in and lights their
                diya.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setPreviewing(true)}
                >
                  See what {firstName(greeting.to)} sees
                </button>
              </div>
              <button type="button" className="link-btn" onClick={startAnother}>
                Light a diya for someone else
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

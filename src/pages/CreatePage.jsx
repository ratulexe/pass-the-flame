import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Diya from '../components/Diya';
import DiyaRow from '../components/DiyaRow';
import GreetingSteps from '../components/GreetingSteps';
import Matchstick from '../components/Matchstick';
import MessageCard from '../components/MessageCard';
import RangoliCanvas from '../components/RangoliCanvas';
import ReceiveFlow from '../components/ReceiveFlow';
import SharePanel from '../components/SharePanel';
import { useCelebration } from '../hooks/useCelebration';
import { useGreetingCreation } from '../hooks/useGreetingCreation';
import { sound } from '../lib/audio';
import { draftGreeting, GREETING_STEPS as STEPS } from '../lib/greetings';
import { hasProfanity } from '../lib/profanity';
import { cleanName, firstName } from '../lib/sanitize';
import { skyText } from '../lib/wishes';

const DEFAULT_RANGOLI_NAME = 'Diwali';
const PREVIEW_DEBOUNCE_MS = 200;
const TYPING_BLOOM_MS = 1000;
const INTRO_BLOOM_MS = 1400;
const LIT_BLOOM_MS = 2600;
const BLOCKED_NAME = "That name can't be used here. Please try another.";

/** Why a name can't be used, or null if it can. */
function nameProblem(value, emptyMessage) {
  const name = cleanName(value);
  if (!name) return emptyMessage;
  return hasProfanity(name) ? BLOCKED_NAME : null;
}

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
  const [step, setStep] = useState(passed ? 'to' : 'hero');
  const [stepError, setStepError] = useState(null);
  const [previewing, setPreviewing] = useState(false);

  const stageRef = useRef(null);
  const anchorRef = useRef(null);
  const resultRef = useRef(null);
  const { celebrate, frameStage } = useCelebration({ tapForFireworks: !previewing });
  const creation = useGreetingCreation();
  const greeting = creation.draft;
  const lit = Boolean(greeting);
  const chainRoot = parent ? (parent.chain[0] ?? parent.from) : null;
  const asking = !lit && STEPS.includes(step);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [previewing, step]);

  useEffect(() => {
    const next = to.trim() || DEFAULT_RANGOLI_NAME;
    if (lit || next === rangoliName) return undefined;
    const timer = setTimeout(() => {
      setBloomMs(TYPING_BLOOM_MS);
      setRangoliName(next);
    }, PREVIEW_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [to, lit, rangoliName]);

  const toProblem = () => nameProblem(to, 'Who is this diya for? Add their name first.');
  const fromProblem = () => nameProblem(from, 'Add your name, so they know who it is from.');

  const goTo = (next, error = null) => {
    setStepError(error);
    setStep(next);
  };

  const nextStep = () => {
    const problem = (step === 'to' && toProblem()) || (step === 'from' && fromProblem());
    if (problem) {
      setStepError(problem);
      return;
    }
    const after = STEPS[STEPS.indexOf(step) + 1] ?? 'light';
    goTo(after);
  };

  const light = () => {
    if (lit) return true;
    const problem = toProblem() ?? fromProblem();
    if (problem) {
      goTo(toProblem() ? 'to' : 'from', problem);
      return false;
    }
    const cleanFrom = cleanName(from);
    const cleanTo = cleanName(to);
    sound.unlock();
    sound.ambient();
    sound.ignite();
    const draft = draftGreeting({ from: cleanFrom, to: cleanTo, relation, lang, parent });
    creation.start(draft);
    setRangoliName(cleanTo);
    setBloomMs(LIT_BLOOM_MS);
    setBloomKey((key) => key + 1);
    frameStage(stageRef.current);
    celebrate(skyText(draft), resultRef);
    return true;
  };

  const startAnother = () => {
    setParent(null);
    setTo('');
    setRelation('friend');
    creation.reset();
    goTo('to');
    setRangoliName(DEFAULT_RANGOLI_NAME);
    setBloomMs(INTRO_BLOOM_MS);
    window.scrollTo(0, 0);
  };

  const setField = (field, value) => {
    setStepError(null);
    ({ to: setTo, from: setFrom, relation: setRelation, lang: setLang })[field](value);
  };

  return (
    <>
      {previewing && <ReceiveFlow greeting={greeting} onBack={() => setPreviewing(false)} />}

      <section className="flex flex-col gap-[22px]" aria-label="Light a diya" hidden={previewing}>
        {chainRoot && !lit && (
          <p className="dimmable font-semibold text-flame">
            You&apos;re passing on a flame that began with {chainRoot}.
          </p>
        )}

        {step === 'hero' && (
          <div className="flex flex-col gap-2 text-center">
            <h1>Light a diya for someone you love.</h1>
            <p className="text-[1.05rem] text-muted">
              They light the next one, and your flame keeps travelling from home to home.
            </p>
          </div>
        )}

        {step === 'light' && !lit && (
          <div className="flex flex-col gap-2 text-center">
            <h1>Now light it for {firstName(to)}.</h1>
          </div>
        )}

        <div ref={stageRef} className={`stage ${lit ? 'lit' : ''} ${asking ? 'stage-small' : ''}`}>
          <RangoliCanvas name={rangoliName} duration={bloomMs} bloomKey={bloomKey} />
          <Diya anchorRef={anchorRef} showTarget={step === 'light' && !lit} />
          {step === 'light' && <Matchstick targetRef={anchorRef} onLight={light} gone={lit} />}
        </div>

        {step === 'hero' && (
          <button
            type="button"
            className="btn btn-primary btn-big"
            onClick={() => {
              sound.unlock();
              goTo('to');
            }}
          >
            Light a diya for someone
          </button>
        )}

        {asking && (
          <>
            {step === 'to' && (
              <p className="dimmable -mt-1.5 text-center text-[0.9rem] text-balance text-muted">
                {to.trim()
                  ? `This rangoli is growing from the letters of ${to.trim()}'s name.`
                  : 'Type their name, and a rangoli grows from it.'}
              </p>
            )}
            <GreetingSteps
              step={step}
              values={{ to, relation, from, lang }}
              onChange={setField}
              error={stepError}
              onNext={nextStep}
              onBack={() => goTo(STEPS[STEPS.indexOf(step) - 1])}
            />
          </>
        )}

        {step === 'light' && !lit && (
          <div className="dimmable flex flex-col items-center gap-1 text-center text-[0.98rem] text-balance">
            <p>Drag the matchstick to the wick to light your diya.</p>
            <button type="button" className="link-btn self-center" onClick={light}>
              Or tap here to light it
            </button>
            <button type="button" className="link-btn self-center" onClick={() => goTo('from')}>
              Back
            </button>
          </div>
        )}

        {lit && (
          <div ref={resultRef} className="dimmable flex flex-col gap-[22px]">
            <MessageCard greeting={greeting} />
            <DiyaRow />
            <div className="card">
              <h2 className="card-title">Your flame is ready to travel</h2>
              <SharePanel
                status={creation.status}
                greeting={creation.greeting}
                recipient={greeting.to}
                onRetry={creation.retry}
              />
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  className="btn"
                  disabled={!greeting.message}
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

import { useCallback, useEffect, useRef, useState } from 'react';
import { sound } from '../lib/audio';
import { prefersReducedMotion } from '../lib/motion';
import { useCelebration } from '../hooks/useCelebration';
import { elderTitle, isElder, skyText } from '../lib/wishes';
import ChainGarland from './ChainGarland';
import Diya from './Diya';
import DiyaRow from './DiyaRow';
import FlameFlight from './FlameFlight';
import MessageCard from './MessageCard';
import RangoliCanvas from './RangoliCanvas';

const FLIGHT_DELAY_MS = 700;
const BLOOM_MS = 2600;

function arrivalLine(greeting) {
  const address = isElder(greeting.relation) ? elderTitle(greeting) : greeting.to;
  return address ? `A flame is on its way to you, ${address}` : 'A flame is on its way to you';
}

/**
 * What a recipient experiences, from "Receive the flame" to the wish. The sender's preview uses
 * it too: `onBack` shows the preview banner, and `onPass` adds the pass-it-on card.
 */
export default function ReceiveFlow({ greeting, onBack, onPass, onStartOwn }) {
  const preview = Boolean(onBack);
  const [stage, setStage] = useState('waiting');
  const stageRef = useRef(null);
  const anchorRef = useRef(null);
  const resultRef = useRef(null);
  const { celebrate, frameStage } = useCelebration();
  const lit = stage === 'lit';

  const arrive = useCallback(() => {
    sound.ignite();
    setStage('lit');
    celebrate(skyText(greeting), resultRef);
  }, [celebrate, greeting]);

  useEffect(() => {
    if (stage !== 'launching') return undefined;
    const delay = prefersReducedMotion() ? 0 : FLIGHT_DELAY_MS;
    const timer = setTimeout(() => {
      if (prefersReducedMotion()) {
        arrive();
      } else {
        sound.whoosh();
        setStage('flying');
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [stage, arrive]);

  const receive = () => {
    sound.unlock();
    sound.ambient();
    setStage('launching');
    frameStage(stageRef.current);
  };

  return (
    <section className="flex flex-col gap-[22px]" aria-label="Receive a flame">
      {preview && (
        <p className="dimmable flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-xl border border-line bg-flame/12 px-3.5 py-2.5 text-[0.92rem]">
          <span>
            Previewing what <b>{greeting.to}</b> will see.
          </span>
          <button type="button" className="link-btn p-0.5" onClick={onBack}>
            Back to my diya
          </button>
        </p>
      )}

      <div className="dimmable flex flex-col gap-2">
        <p className="font-semibold text-flame">{greeting.from} lit a diya for you</p>
        <h1>{arrivalLine(greeting)}</h1>
      </div>

      <div className="dimmable">
        <ChainGarland greeting={greeting} lit={lit} preview={preview} />
      </div>

      <div ref={stageRef} className={`stage ${lit ? 'lit' : ''}`}>
        <RangoliCanvas name={greeting.to} dim={!lit} duration={lit ? BLOOM_MS : 0} />
        <Diya anchorRef={anchorRef} />
      </div>

      {stage === 'waiting' && (
        <>
          <p className="dimmable -mt-1.5 text-center text-[0.9rem] text-balance text-muted">
            A rangoli made from the letters of your name is waiting under the diya.
          </p>
          <button type="button" className="btn btn-primary btn-big" onClick={receive}>
            Receive the flame
          </button>
        </>
      )}

      {stage === 'flying' && <FlameFlight targetRef={anchorRef} onArrive={arrive} />}

      {lit && (
        <div ref={resultRef} className="dimmable flex flex-col gap-[22px]">
          <MessageCard greeting={greeting} />
          <DiyaRow />
          {onPass && (
            <div className="card">
              <h2 className="card-title">Keep the flame moving</h2>
              <p>
                Light a diya for someone else. Your name joins the chain, and they will see how far
                this flame has travelled.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <button type="button" className="btn btn-primary" onClick={onPass}>
                  Pass the flame
                </button>
              </div>
              <button type="button" className="link-btn" onClick={onStartOwn}>
                Start a new flame of my own
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

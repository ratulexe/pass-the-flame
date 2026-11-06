import { useEffect, useRef } from 'react';
import { GREETING_STEPS as STEPS } from '../lib/greetings';
import { MAX_NAME_LENGTH } from '../lib/sanitize';
import { isElder, LANGUAGES, RELATION_GROUPS } from '../lib/wishes';

function Choices({ legend, name, options, value, onChange }) {
  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="field mb-2.5">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option.value} className="choice">
            <input
              type="radio"
              className="sr-only"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Asks for one thing at a time, so the form feels like a conversation. */
export default function GreetingSteps({ step, values, onChange, error, onNext, onBack }) {
  const inputRef = useRef(null);
  const number = STEPS.indexOf(step) + 1;

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  const submit = (event) => {
    event.preventDefault();
    onNext();
  };

  return (
    <form className="card dimmable" autoComplete="off" onSubmit={submit}>
      <p className="flex items-center gap-2 text-[0.85rem] font-semibold text-flame">
        <span className="step-dots" aria-hidden="true">
          {STEPS.map((name, index) => (
            <span key={name} className={index < number ? 'step-dot-done' : ''} />
          ))}
        </span>
        Step {number} of {STEPS.length}
      </p>

      {step === 'to' && (
        <>
          <h2 className="card-title">Who is this diya for?</h2>
          <label className="field">
            Their name
            <input
              ref={inputRef}
              value={values.to}
              maxLength={MAX_NAME_LENGTH}
              placeholder="Meera"
              onChange={(event) => onChange('to', event.target.value)}
            />
          </label>
        </>
      )}

      {step === 'relation' && (
        <>
          <h2 className="card-title">What are they to you?</h2>
          {RELATION_GROUPS.map((group) => (
            <Choices
              key={group.label}
              legend={group.label}
              name="relation"
              options={group.options}
              value={values.relation}
              onChange={(value) => onChange('relation', value)}
            />
          ))}
          {isElder(values.relation) && (
            <p className="text-[0.9rem] text-muted">
              Out of respect, they will be greeted without their name.
            </p>
          )}
        </>
      )}

      {step === 'from' && (
        <>
          <h2 className="card-title">Who is it from?</h2>
          <label className="field">
            Your name
            <input
              ref={inputRef}
              value={values.from}
              maxLength={MAX_NAME_LENGTH}
              placeholder="Aarav"
              onChange={(event) => onChange('from', event.target.value)}
            />
          </label>
          <Choices
            legend="Wish them in"
            name="lang"
            options={LANGUAGES}
            value={values.lang}
            onChange={(value) => onChange('lang', value)}
          />
        </>
      )}

      {error && (
        <p className="text-[0.95rem] text-[#ff9fb0]" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-3">
        {number > 1 ? (
          <button type="button" className="link-btn self-center" onClick={onBack}>
            Back
          </button>
        ) : (
          <span />
        )}
        <button type="submit" className="btn btn-primary">
          {number === STEPS.length ? 'Now light it' : 'Next'}
        </button>
      </div>
    </form>
  );
}

import { isElder } from '../lib/wishes';

const MAX_VISIBLE = 6;

/** Long chains show the first person, a "+N more" link and the last four. */
function visiblePeople({ chain, from, to, depth }) {
  const names = [...chain, from, to];
  const people = names.map((name, index) => ({
    key: `${index}-${name}`,
    name,
    isRecipient: index === names.length - 1,
  }));
  const total = depth + 2;
  if (total <= MAX_VISIBLE) return people;
  return [people[0], { key: 'gap', name: `+${total - 5} more` }, ...people.slice(-4)];
}

/**
 * The chain as a marigold garland, whose diyas light one after another. The recipient's diya
 * waits for `lit`, then lights without delay, as the flame arrives.
 */
export default function ChainGarland({ greeting, lit, preview }) {
  const homes = greeting.depth + 1;
  const people = visiblePeople(greeting);
  const recipientLabel = (name) => {
    if (isElder(greeting.relation)) return 'You';
    return preview ? name : `${name} (you)`;
  };

  return (
    <div className="card">
      <p className="text-[0.95rem] text-muted">
        {homes === 1
          ? `This flame comes straight from ${greeting.from}'s diya.`
          : `This flame has passed through ${homes} homes to reach you.`}
      </p>
      <ol className="garland">
        {people.map((person, index) => (
          <li
            key={person.key}
            className={`chain-person ${person.isRecipient ? 'text-flame' : ''}`}
            style={{ '--turn': person.isRecipient ? 0 : index }}
          >
            <span className={`mini-diya ${!person.isRecipient || lit ? 'mini-diya-lit' : ''}`} />
            {person.isRecipient ? recipientLabel(person.name) : person.name}
          </li>
        ))}
      </ol>
    </div>
  );
}

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

/** The chain of diyas this flame has passed through. `lit` lights the recipient's diya. */
export default function ChainGarland({ greeting, lit, preview }) {
  const homes = greeting.depth + 1;
  const people = visiblePeople(greeting);

  return (
    <div className="card">
      <p className="text-[0.95rem] text-muted">
        {homes === 1
          ? `This flame comes straight from ${greeting.from}'s diya.`
          : `This flame has passed through ${homes} homes to reach you.`}
      </p>
      <ol className="flex flex-wrap items-end gap-x-1 gap-y-2">
        {people.map((person, index) => (
          <li key={person.key} className="flex items-end gap-1">
            {index > 0 && (
              <span className="pb-[26px] text-flame opacity-70" aria-hidden="true">
                →
              </span>
            )}
            <span className={`chain-person ${person.isRecipient ? 'text-flame' : ''}`}>
              <span className={`mini-diya ${!person.isRecipient || lit ? 'mini-diya-lit' : ''}`} />
              {person.isRecipient && !preview ? `${person.name} (you)` : person.name}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

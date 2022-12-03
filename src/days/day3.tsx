import { useMemo, useState } from 'react';
import DayContainer from '../components/DayContainer';

const A_CODE = 97;

/**
 * Prepares the data for the challenge.
 * // TODO define cleaning and return type.
 * @param input The input string from the textArea
 * @returns The cleaned data as required to complete the puzzle
 */
function prepare (input: string): string[] {
  return input.trim().split('\n');
}

function findDuplicates (rucksacks: string[]): string[] {
  return rucksacks.map((rucksack) => {
    const half = Math.ceil(rucksack.length / 2);
    const c1 = rucksack.slice(0, half);
    const c2 = rucksack.slice(half);
    for (let i = 0; i < c1.length; ++i) {
      if (c2.includes(c1[i])) {
        return c1[i];
      }
    }
    throw Error('No duplicate found');
  });
}

function findGroupKeys (rucksacks: string[], chunkSize: number): string[] {
  const keys: string[] = [];
  for (let i = 0; i < rucksacks.length; i += chunkSize) {
    const chunk = rucksacks.slice(i, i + chunkSize);
    const first = chunk[0];
    for (let j = 0; j < first.length; j++) {
      const char = first[j];
      if (chunk[1].includes(char) && chunk[2].includes(char)) {
        keys.push(char);
        break;
      }
    }
  }
  return keys;
}

function sumPriorities (dups: string[]): number {
  return dups.reduce((sum, string) => {
    const code = string.charCodeAt(0);
    return code >= A_CODE ? sum + code - 96 : sum + code - 38;
  }, 0);
}

function buildDisplay (rucksacks: string[], duplicates: string[], groupKeys: string[]): JSX.Element {
  const rows: JSX.Element[] = [];
  let groupIndex = -1;
  rucksacks.forEach((rucksack, i) => {
    if (i % 3 === 0) {
      groupIndex++;
      rows.push(<div className='subtitle'>{`Group ${groupKeys[groupIndex]}`}</div>);
    }
    rows.push(buildRow(rucksack, duplicates[i], groupKeys[groupIndex]));
  });
  return (
    <div className='text-visualisation'>
      {rows}
    </div>
  );
}

function buildRow (rucksack: string, duplicate: string, groupKey: string): JSX.Element {
  const half = Math.ceil(rucksack.length / 2);
  const c1 = rucksack.slice(0, half);
  const c2 = rucksack.slice(half);
  const c1dupIndex = c1.indexOf(duplicate);
  const c2dupIndex = c1.indexOf(duplicate);

  let c1Start: string | undefined;
  let c1End: string | undefined;
  if (c1dupIndex !== 0) {
    c1Start = c1.slice(0, c1dupIndex);
    c1End = c1.slice(c1dupIndex, c1.length);
  } else {
    c1End = c1.slice(1, c1.length);
  }

  const part1Highlight = (<span className='part1'>
    {c1Start}<span className='error'>{duplicate}</span>{c1End}
  </span>);

  let c2start: string | undefined;
  let c2end: string | undefined;
  if (c2dupIndex !== 0) {
    c2start = c2.slice(0, c2dupIndex);
    c2end = c2.slice(c2dupIndex, c2.length);
  } else {
    c2end = c2.slice(1, c2.length);
  }

  const part2Highlight = (<span className='part2'>
    {c2start}<span className='error'>{duplicate}</span>{c2end}
  </span>);

  return (<div className='text-row'>
    {part1Highlight}
    <span className='spacer'></span>
    {part2Highlight}
  </div>);
}

function Day (): JSX.Element {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [part1, setPart1] = useState<number | undefined>(undefined);
  const [part2, setPart2] = useState<number | undefined>(undefined);
  const [display, setDisplay] = useState<JSX.Element | undefined>(undefined);
  useMemo(() => {
    if (value !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const cleanData = prepare(value);
      const duplicates = findDuplicates(cleanData);
      const groupKeys = findGroupKeys(cleanData, 3);
      setDisplay(buildDisplay(cleanData, duplicates, groupKeys));
      setPart1(sumPriorities(duplicates));
      setPart2(sumPriorities(groupKeys));
    }
  }, [value]);

  return <DayContainer day='3' inputCallback={setValue} part1={part1} part2={part2}>
    {(display !== undefined) && display }
  </DayContainer>;
}

export default Day;

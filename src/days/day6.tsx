import { useMemo, useState } from 'react';
import DayContainer from '../components/DayContainer';

/**
 * Prepares the data for the challenge.
 * No cleaning required, just trim and whitespace.
 * @param input The input string from the textArea
 * @returns The cleaned data as required to complete the puzzle
 */
function prepare (input: string): string {
  return input.trim();
}

function findIndexFirstNonDuplicateN (input: string, n: number): number {
  for (let i = n; i <= input.length; ++i) {
    const unique = new Set(input.slice(i - n, i)).size;
    if (unique === n) {
      return i;
    }
  }
  throw Error(`could not find a unique string of length ${n}`);
}

function Day (): JSX.Element {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [part1, setPart1] = useState<number | undefined>(undefined);
  const [part2, setPart2] = useState<number | undefined>(undefined);
  const [time, setTime] = useState<number | undefined>(undefined);

  useMemo(() => {
    if (value !== undefined && value.length > 1) {
      const st = new Date();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const cleanData = prepare(value);
      setPart1(findIndexFirstNonDuplicateN(cleanData, 4));
      setPart2(findIndexFirstNonDuplicateN(cleanData, 14));
      setTime(new Date().getTime() - st.getTime());
    }
  }, [value]);

  return <DayContainer day='6' inputCallback={setValue} part1={part1} part2={part2} time={time}></DayContainer>;
}

export default Day;

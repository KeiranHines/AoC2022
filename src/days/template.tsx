import { useMemo, useState } from 'react';
import DayContainer from '../components/DayContainer';

/**
 * Prepares the data for the challenge.
 * // TODO define cleaning and return type.
 * @param input The input string from the textArea
 * @returns The cleaned data as required to complete the puzzle
 */
function prepare (input: string): undefined {
  return undefined;
}

function Day (): JSX.Element {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [part1, setPart1] = useState<number | undefined>(undefined);
  const [part2, setPart2] = useState<number | undefined>(undefined);

  useMemo(() => {
    if (value !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const cleanData = prepare(value);
      setPart1(/* add part1 answer here */ undefined);
      setPart2(/* add part1 answer here */ undefined);
    }
  }, [value]);

  return <DayContainer day='enter day number here' inputCallback={setValue} part1={part1} part2={part2}></DayContainer>;
}

export default Day;

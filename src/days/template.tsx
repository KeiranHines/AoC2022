import { useMemo, useState } from 'react';
import Part from '../components/part';

/**
 * Prepares the data for the challenge.
 * // TODO define cleaning and return type.
 * @param input The input string from the textArea
 * @returns The cleaned data as required to complete the puzzle
 */
function prepare (input: string): undefined {
  return undefined;
}

function App (): JSX.Element {
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

  return (
    <div className="App">
      <div className={'input'}>
      <textarea className='max'
        placeholder='Enter input:'
        value = {value}
        onChange={e => { setValue(e.target.value); }}
        >
      </textarea>
        </div>
      {part1 !== undefined && <Part number={1} result={part1}></Part> }
      {part2 !== undefined && <Part number={2} result={part2}></Part> }
     </div>
  );
}

export default App;

import { useMemo, useState } from 'react';
import Part from '../components/part';

const C_CHAR = 67;

/**
 * Prepares the data for the challenge.
 * // TODO define cleaning and return type.
 * @param input The input string from the textArea
 * @returns The cleaned data as required to complete the puzzle
 */
function prepare (input: string): number[][] {
  return input.split('\n').map((round) => round.split(' ').map((player) => {
    const code = player.charCodeAt(0);
    if (code <= C_CHAR) {
      return code - 64; // offset A to 1 etc.
    }
    return code - 87; // offset X to 1 etc.
  }));
}

function calculateScorePart1 (rounds: number[][]): number {
  return rounds.map((round) => {
    const [opp, player] = round;
    if (opp === player) {
      return player + 3;
    }
    if (player - opp === 1 || (player === 1 && opp === 3)) {
      return player + 6;
    }
    return player;
  }).reduce((sum, a) => sum + a, 0);
}

function calculateScorePart2 (rounds: number[][]): number {
  // rock sci 1,3
  // paper rock 2,1
  // sci paper 3,2
  return rounds.map((round) => {
    const [opp, result] = round;

    if (result === 2) {
      return opp + 3; // Draw
    }
    if (result === 3) {
      if (opp === 3) {
        return 7; // Rock + win
      }
      return opp + 7; // next option from opp + win
    }
    if (opp === 1) {
      return 3;
    }
    return opp - 1;
  }).reduce((sum, a) => sum + a, 0);
}

function App (): JSX.Element {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [part1, setPart1] = useState<number | undefined>(undefined);
  const [part2, setPart2] = useState<number | undefined>(undefined);

  useMemo(() => {
    if (value !== undefined) {
      const cleanData = prepare(value);
      setPart1(calculateScorePart1(cleanData));
      setPart2(calculateScorePart2(cleanData));
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

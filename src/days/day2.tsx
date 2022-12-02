import { useMemo, useState } from 'react';
import DayContainer from '../components/DayContainer';
const C_CHAR = 67;

/**
 * Prepares the data for the challenge.
 * @param input The input string from the textArea
 * @returns The cleaned data as required to complete the puzzle
 */
function prepare (input: string): number[][] {
  return input.trim().split('\n').map((round) => round.split(' ').map((player) => {
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

function Day (): JSX.Element {
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

  return <DayContainer day='2' inputCallback={setValue} part1={part1} part2={part2}></DayContainer>;
}

export default Day;

import { useMemo, useState } from 'react';
import DayContainer from '../components/DayContainer';

type mapGrid = string[][];

interface Payload {
  map: mapGrid
  commands: string[]
}

/**
 * Prepares the data for the challenge.
 * Splits the data into the map and commands sections and parses the map into arrays of chars.
 * @param input The input string from the textArea
 * @returns The cleaned data as required to complete the puzzle
 */
function prepare (input: string): Payload {
  const [mapData, commands] = input.split('\n\n');
  const mapLines = mapData.split('\n');
  const cols = (mapLines[0].length / 4);
  const map: string[][] = [];

  // Init columns arrays
  for (let i = 0; i < cols; i++) {
    map.push([]);
  }
  // Work from bottom up ignoring the number line
  for (let i = mapLines.length - 2; i >= 0; i--) {
    const line = mapLines[i];
    let j = 0;
    let row = 0;
    for (; j <= line.length; j += 4) {
      if (line[j] === '[') {
        map[row].push(line[j + 1]);
      }
      row++;
    }
  }
  return {
    map,
    commands: commands.trim().split('\n')
  };
}

function crate9000Simulator (payload: Payload): mapGrid[] {
  const states: mapGrid[] = [[...payload.map]];
  payload.commands.forEach((command, i) => {
    // Create copy of the previous state to create the new state.
    const prev = states[i].map((arr) => arr.slice());
    const [move, fromNum, toNum] = command.replace('move ', '').replace('from ', '').replace('to ', '').split(' ').map((s) => parseInt(s));
    const from = prev[fromNum - 1];
    const to = prev[toNum - 1];
    for (let i = 0; i < move; ++i) {
      const popped = from.pop();
      if (popped !== undefined) {
        to.push(popped);
      }
    }
    states.push(prev);
  });
  return states;
}

function crate9001Simulator (payload: Payload): mapGrid[] {
  const states: mapGrid[] = [];
  const initial = payload.map.map((arr) => arr.slice());
  states.push(initial);
  payload.commands.forEach((command, i) => {
    // Create copy of the previous state to create the new state.
    const prev = states[i].map((arr) => arr.slice());
    const [move, fromNum, toNum] = command.replace('move ', '').replace('from ', '').replace('to ', '').split(' ').map((s) => parseInt(s));
    const from = prev[fromNum - 1];
    const to = prev[toNum - 1];
    const popped = from.splice(-1 * move, move);
    if (popped !== undefined) {
      to.push(...popped);
    }

    states.push(prev);
  });
  return states;
}

function getTopOfAllRows (state: mapGrid): string {
  return state.map((col) => col[col.length - 1]).join('');
}

function Day (): JSX.Element {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [part1, setPart1] = useState<string | undefined>(undefined);
  const [part2, setPart2] = useState<string | undefined>(undefined);
  const [time, setTime] = useState<number | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [create9000, setCreate9000] = useState<mapGrid[] | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [create9001, setCreate9001] = useState<mapGrid[] | undefined>(undefined);
  useMemo(() => {
    if (value !== undefined) {
      const st = new Date();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const cleanData = prepare(value);
      const crate9000 = crate9000Simulator(cleanData);
      const crate9001 = crate9001Simulator(cleanData);
      setCreate9000(crate9000);
      setCreate9001(crate9001);
      setPart1(getTopOfAllRows(crate9000[crate9000.length - 1]));
      setPart2(getTopOfAllRows(crate9001[crate9001.length - 1]));

      setTime(new Date().getTime() - st.getTime());
    }
  }, [value]);

  return <DayContainer day='enter day number here' inputCallback={setValue} part1={part1} part2={part2} time={time}></DayContainer>;
}

export default Day;

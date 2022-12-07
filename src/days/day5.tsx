import { useMemo, useState, useEffect } from 'react';
import DayContainer from '../components/DayContainer';
import '../crate.css';

type mapGrid = crate[][];
interface crate {
  label: string
  id: number
  color: string
};
interface Payload {
  map: mapGrid
  commands: string[]
}

const colors = ['blue', 'yellow', 'green', 'purple', 'brown', 'grey', 'aqua'];

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
  const map: crate[][] = [];
  let id = 0;
  let colorIndex = 0;
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
        map[row].push({
          label: line[j + 1],
          id,
          color: colors[colorIndex]
        });
        id++;
      }
      row++;
    }
    colorIndex++;
    if (colorIndex === colors.length) {
      colorIndex = 0;
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

/**
 * Renders a states grid.
 * @param state The state to render
 * @param highlight If the top row of the gird should be highlighted.
 * @returns The states display grid.
 */
function buildStateGrid (state: mapGrid, highlight: boolean): JSX.Element {
  const cols = state.map((col, i) => {
    const crates = col.map((crate, i) => {
      return (<div key={crate.id} className={`crate crate-${crate.color}`}>{crate.label}</div>);
    });
    return (<div key={i} className='col'>
      {crates}
    </div>);
  });
  return (<div className='state-container'>
    <div className='state-grid'>
      {cols}
    </div>
  </div>
  );
}

interface AnimationProps {
  title: string
  states: mapGrid[]
}

function Animation ({ title, states }: AnimationProps): JSX.Element {
  const [command, setCommand] = useState(0);
  const [freq, setFreq] = useState(50);
  const [playing, setPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | undefined>(undefined);
  useEffect(() => {
    if (playing && command < states.length - 1) {
      const interval = setInterval(() => {
        setCommand(command + 1);
      }, freq);
      setIntervalId(interval);
      return () => {
        clearInterval(interval);
        setIntervalId(undefined);
      };
    }
    if (intervalId !== undefined) {
      clearInterval(intervalId);
      setIntervalId(undefined);
      setPlaying(false);
    }
    if (playing) {
      setPlaying(false);
    }
    return () => {};
  }, [playing, command]);
  return (<div className='crate-animation'>
    <div className='subtitle'>{title}</div>
    <div className='timing'>
      <label htmlFor='freq'>update interval (ms)</label>
      <input id='freq' type="number" value={freq} onChange={(e) => setFreq(parseInt(e.target.value))}></input>
      <button disabled={command === states.length - 1} onClick={() => setPlaying(playing => !playing)}>{!playing ? 'Play' : 'Pause'}</button>
      <span>{`state: ${command}`}</span>
    </div>
    <input type="range" min={0} max={states.length - 1} value={command} className="slider" onChange={ e => setCommand(parseInt(e.target.value))}/>
    {buildStateGrid(states[command], command === states.length - 1)}
  </div>);
}

function getTopOfAllRows (state: mapGrid): string {
  return state.map((col) => col[col.length - 1].label).join('');
}

function Day (): JSX.Element {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [part1, setPart1] = useState<string | undefined>(undefined);
  const [part2, setPart2] = useState<string | undefined>(undefined);
  const [warning, setWarning] = useState<string>('');
  const [time, setTime] = useState<number | undefined>(undefined);
  const [crate9000, setCreate9000] = useState<mapGrid[] | undefined>(undefined);
  const [crate9001, setCreate9001] = useState<mapGrid[] | undefined>(undefined);
  useMemo(() => {
    setWarning('');
    setPart1(undefined);
    setPart2(undefined);
    setTime(undefined);
    if (value !== undefined && value.length > 1) {
      try {
        const st = window.performance.now();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const cleanData = prepare(value);
        const crate9000 = crate9000Simulator(cleanData);
        const crate9001 = crate9001Simulator(cleanData);
        setCreate9000(crate9000);
        setCreate9001(crate9001);
        setPart1(getTopOfAllRows(crate9000[crate9000.length - 1]));
        setPart2(getTopOfAllRows(crate9001[crate9001.length - 1]));

        setTime(window.performance.now() - st);
      } catch (e) {
        if (typeof e === 'string') {
          setWarning(e.toUpperCase());
        } else if (e instanceof Error) {
          setWarning(e.message);
        }
      }
    }
  }, [value]);

  return <DayContainer day='5' inputCallback={setValue} part1={part1} part2={part2} time={time} warning={warning}>
    {crate9000 !== undefined && <Animation title="Crate 9000" states={crate9000}></Animation>}
    {crate9001 !== undefined && <Animation title="Crate 9001" states={crate9001}></Animation>}
  </DayContainer>;
}

export default Day;

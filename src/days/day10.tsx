import { useMemo, useState } from 'react';
import DayContainer from '../components/DayContainer';

interface results {
  keyCycles: number[]
  crtPixels: boolean[]
}

/**
 * Prepares the data for the challenge.
 * // TODO define cleaning and return type.
 * @param input The input string from the textArea
 * @returns The cleaned data as required to complete the puzzle
 */
function prepare (input: string): string[] {
  return input.trim().split('\n');
}

function runCommands (inputs: string[], keyCycles: number[]): results {
  let cycle = 1;
  let x = 1;
  const pixels: boolean[] = [];
  const results: number[] = [];

  const addPixel = (): void => {
    const row = 40 * Math.floor(cycle / 40);
    const pixel = row + x;
    pixels.push(pixel >= cycle - 2 && pixel <= cycle);
  };

  inputs.forEach((input) => {
    const parts = input.split(' ');
    addPixel();
    switch (parts[0]) {
      case 'noop':
        cycle++;
        break;
      case 'addx':
        cycle++;
        if (keyCycles.includes(cycle)) {
          results.push(x * cycle);
        }
        addPixel();
        x += parseInt(parts[1]);
        cycle++;
        break;
      default:
        break;
    }
    if (keyCycles.includes(cycle)) {
      results.push(x * cycle);
    }
  });
  return {
    keyCycles: results,
    crtPixels: pixels
  };
}

function displayCRT (pixels: boolean[], horizontal: number, vertical: number): JSX.Element {
  const rows: JSX.Element[] = [];
  for (let i = 0; i < vertical; i++) {
    const row = pixels.splice(0, horizontal).map((pixel, j) => {
      return (<div key={`${i},${j}`} className='square xxsmall' style={{ backgroundColor: `${pixel ? 'black' : 'white'}` }}></div>);
    });
    rows.push(<div className='line'>{row}</div>);
  }

  return (<div className='border-outline'>{rows}</div>);
}

function Day (): JSX.Element {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [part1, setPart1] = useState<number | undefined>(undefined);
  const [part2, setPart2] = useState<string | undefined>(undefined);
  const [warning, setWarning] = useState<string>('');
  const [time, setTime] = useState<number | undefined>(undefined);
  const [display, setDisplay] = useState<JSX.Element | undefined>(undefined);
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
        const results = runCommands(cleanData, [20, 60, 100, 140, 180, 220]);
        setPart1(results.keyCycles.reduce((r, a) => r + a, 0));
        setPart2('below');
        setTime(window.performance.now() - st);
        setDisplay(displayCRT(results.crtPixels, 40, 6));
      } catch (e) {
        if (typeof e === 'string') {
          setWarning(e.toUpperCase());
        } else if (e instanceof Error) {
          setWarning(e.message);
        }
      }
    }
  }, [value]);

  return <DayContainer day='10' inputCallback={setValue} part1={part1} part2={part2} time={time} warning={warning}>
    {display !== undefined && display}
  </DayContainer>;
}

export default Day;

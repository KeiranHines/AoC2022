import { useMemo, useState, useEffect } from 'react';
import DayContainer from '../components/DayContainer';

enum Direction {
  Up = 'U', Down = 'D', Left = 'L', Right = 'R'
}

interface Vector {
  direction: Direction
  distance: number
};

interface Point {
  x: number
  y: number
};

interface Knot extends Point {
  nextKnot?: Knot
}

interface MapState {
  visited: Set<String>
  visitedIndex: number
  headString: string
  tailStrings: string[]
}

interface MapParams {
  x: number
  y: number
  start: Point
}
/**
 * Prepares the data for the challenge.
 * Transforms the input to a list of vectors to be executed
 * @param input The input string from the textArea
 * @returns The cleaned data as required to complete the puzzle
 */
function prepare (input: string): Vector[] {
  return input.trim().split('\n').map((dir) => {
    const [d, distance] = dir.split(' ');

    return {
      distance: parseInt(distance),
      direction: d as Direction
    };
  });
}

function runSimulation (input: Vector[], ropeHead: Knot, steps?: MapState[]): Point[] {
  const visited = new Set<String>();
  let currentKnot = ropeHead;
  visited.add(`${ropeHead.x},${ropeHead.y}`);
  let tailStrings: string[] = [];
  if (steps !== undefined) {
    let temp = ropeHead;
    while (temp.nextKnot !== undefined) {
      tailStrings.push(`${temp.nextKnot.x},${temp.nextKnot.y}`);
      temp = temp.nextKnot;
    }
    steps.push({
      visited,
      visitedIndex: visited.size,
      headString: `${ropeHead.x},${ropeHead.y}`,
      tailStrings
    });
    tailStrings = [];
  }
  const change: Point = { x: 0, y: 0 };
  const delta: Point = { x: 0, y: 0 };
  input.forEach((vector) => {
    switch (vector.direction) {
      case Direction.Up:
        change.y = 1;
        change.x = 0;
        break;
      case Direction.Down:
        change.y = -1;
        change.x = 0;
        break;
      case Direction.Left:
        change.y = 0;
        change.x = -1;
        break;
      case Direction.Right:
        change.y = 0;
        change.x = 1;
        break;
    }

    for (let i = 0; i < vector.distance; i++) {
      ropeHead.x += change.x;
      ropeHead.y += change.y;
      currentKnot = ropeHead;
      let tail: Knot | undefined;
      while (currentKnot.nextKnot !== undefined) {
        tail = currentKnot.nextKnot;
        delta.x = currentKnot.x - tail.x;
        delta.y = currentKnot.y - tail.y;

        if (delta.x >= 1 && delta.y >= 1 && delta.x + delta.y > 2) {
          // NE
          tail.x++;
          tail.y++;
        } else if (delta.x <= -1 && delta.y >= 1 && -delta.x + delta.y > 2) {
          // NW
          tail.x--;
          tail.y++;
        } else if (delta.x >= 1 && delta.y <= -1 && delta.x + -delta.y > 2) {
          // SE
          tail.x++;
          tail.y--;
        } else if (delta.x <= -1 && delta.y <= -1 && delta.x + delta.y < -2) {
        // SW
          tail.x--;
          tail.y--;
        } else if (delta.x > 1) {
        // E
          tail.x++;
        } else if (delta.x < -1) {
        // W
          tail.x--;
        } else if (delta.y > 1) {
        // N
          tail.y++;
        } else if (delta.y < -1) {
        // S
          tail.y--;
        }
        currentKnot = tail;
      }
      if (tail !== undefined) { visited.add(`${tail.x},${tail.y}`); }
      if (steps !== undefined) {
        let temp = ropeHead;
        while (temp.nextKnot !== undefined) {
          tailStrings.push(`${temp.nextKnot.x},${temp.nextKnot.y}`);
          temp = temp.nextKnot;
        }
        steps.push({
          visited,
          visitedIndex: visited.size,
          headString: `${ropeHead.x},${ropeHead.y}`,
          tailStrings
        });
        tailStrings = [];
      }
    }
  });
  return Array.from(visited).map((s) => {
    const [x, y] = s.split(',');
    return {
      x: parseInt(x),
      y: parseInt(y)
    };
  });
}

function buildRope (length: number, start: Point): Knot {
  const head = {
    x: start.x, y: start.y
  };
  let tail: Knot = head;
  for (let i = 1; i < length; i++) {
    const newKnot = {
      x: start.x, y: start.y
    };
    tail.nextKnot = newKnot;
    tail = newKnot;
  }
  return head;
}

/**
 * Renders a states grid.
 * @returns The states display grid.
 */
function buildStateGrid (state: MapState, maxX: number, maxY: number, start: string, size: string): JSX.Element {
  const asString = Array.from(state.visited).slice(0, state.visitedIndex);
  const headString = state.headString;
  const tailStrings = state.tailStrings;
  const lines: JSX.Element[] = [];
  for (let i = maxY - 1; i >= 0; i--) {
    const line: JSX.Element[] = [];
    for (let j = 0; j < maxX; j++) {
      const s = `${j},${i}`;
      let char = '.';

      if (s === headString) {
        char = 'H';
      } else {
        const tsIndex = tailStrings.indexOf(s);
        if (tsIndex !== -1) {
          char = tailStrings.length === 1 ? 'T' : `${tsIndex + 1}`;
        } else if (s === start) {
          char = 'S';
        } else if (asString.includes(s)) {
          char = '#';
        } else {
          char = '.';
        }
      }
      line.push(<div key={s} className={`square ${size}`}>{char}</div>);
    }
    lines.push(<div className='line' key={i}>{line}</div>);
  }
  return (<div className='state-container'>
    <div className='state-grid'>
      {lines}
    </div>
  </div>
  );
}

interface AnimationProps {
  title: string
  states: MapState[]
  maxX: number
  maxY: number
  start: Point
}

function Animation ({ title, states, maxX, maxY, start }: AnimationProps): JSX.Element {
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

  const startString = `${start.x},${start.y}`;
  const max = Math.max(maxX, maxY);
  let size: string;
  if (max > 200) {
    size = 'xxtiny';
  } else if (max > 100) {
    size = 'xtiny';
  } else if (max > 50) {
    size = 'tiny';
  } else if (max > 25) {
    size = 'xxsmall';
  } else if (max > 12) {
    size = 'xsmall';
  } else {
    size = 'small';
  }

  return (<div className='animation'>
    <div className='subtitle'>{title}</div>
    <div className='timing'>
      <label htmlFor='freq'>update interval (ms)</label>
      <input id='freq' type="number" value={freq} onChange={(e) => setFreq(parseInt(e.target.value))}></input>
      <button disabled={command === states.length - 1} onClick={() => setPlaying(playing => !playing)}>{!playing ? 'Play' : 'Pause'}</button>
      <span>{`state: ${command}`}</span>
    </div>
    <input type="range" min={0} max={states.length - 1} value={command} className="slider" onChange={ e => setCommand(parseInt(e.target.value))}/>
    {buildStateGrid(states[command], maxX, maxY, startString, size)}
  </div>);
}

function getMaxXandY (input: Vector[]): MapParams {
  let x = 0;
  let y = 0;
  let minX = 0;
  let minY = 0;
  let maxX = 0;
  let maxY = 0;
  input.forEach((v) => {
    switch (v.direction) {
      case Direction.Up:
        y += v.distance;
        break;
      case Direction.Down:
        y -= v.distance;
        break;
      case Direction.Left:
        x -= v.distance;
        break;
      case Direction.Right:
        x += v.distance;
        break;
    }
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
  });
  return {
    x: -minX + maxX + 1,
    y: -minY + maxY + 1,
    start: {
      x: -minX,
      y: -minY
    }
  };
}

function Day (): JSX.Element {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [part1, setPart1] = useState<number | undefined>(undefined);
  const [part2, setPart2] = useState<number | undefined>(undefined);
  const [warning, setWarning] = useState<string>('');
  const [time, setTime] = useState<number | undefined>(undefined);
  const [animation1, setAnimation1] = useState<AnimationProps | undefined>(undefined);
  const [animation2, setAnimation2] = useState<AnimationProps | undefined>(undefined);

  useMemo(() => {
    setWarning('');
    setPart1(undefined);
    setPart2(undefined);
    setTime(undefined);
    setAnimation1(undefined);
    setAnimation1(undefined);
    if (value !== undefined && value.length > 1) {
      try {
        const st = window.performance.now();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const cleanData = prepare(value);
        const { x, y, start } = getMaxXandY(cleanData);
        const shortRopeStates: MapState[] = [];
        const longRopeStates: MapState[] = [];
        setPart1(runSimulation(cleanData, buildRope(2, start), shortRopeStates).length);
        setPart2(runSimulation(cleanData, buildRope(10, start), longRopeStates).length);
        setTime(window.performance.now() - st);
        setAnimation1({ title: 'rope 1', states: shortRopeStates, maxX: x, maxY: y, start });
        setAnimation2({ title: 'rope 2', states: longRopeStates, maxX: x, maxY: y, start });
      } catch (e) {
        if (typeof e === 'string') {
          setWarning(e.toUpperCase());
        } else if (e instanceof Error) {
          setWarning(e.message);
        }
      }
    }
  }, [value]);

  return <DayContainer day='9' inputCallback={setValue} part1={part1} part2={part2} time={time} warning={warning}>
    {animation1 !== undefined && <Animation title={animation1.title} states={animation1.states} maxX={animation1.maxX} maxY={animation1.maxY} start={animation1.start}></Animation>}
    {animation2 !== undefined && <Animation title={animation2.title} states={animation2.states} maxX={animation2.maxX} maxY={animation2.maxY} start={animation2.start}></Animation>}
  </DayContainer>;
}

export default Day;

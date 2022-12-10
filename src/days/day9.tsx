import { useMemo, useState } from 'react';
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

function runSimulation (input: Vector[], ropeHead: Knot): Point[] {
  const visited = new Set<String>();
  let currentKnot = ropeHead;
  visited.add(`${ropeHead.x},${ropeHead.y}`);
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
    }
  });
  return Array.from(visited).map((s) => {
    const [x, y] = s.split(',');
    return {
      x: parseInt(x),
      y: parseInt(y)
    };
  }); ;
}
function buildRope (length: number): Knot {
  const head = {
    x: 0, y: 0
  };
  let tail: Knot = head;
  for (let i = 1; i < length; i++) {
    const newKnot = {
      x: 0, y: 0
    };
    tail.nextKnot = newKnot;
    tail = newKnot;
  }
  return head;
}
function Day (): JSX.Element {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [part1, setPart1] = useState<number | undefined>(undefined);
  const [part2, setPart2] = useState<number | undefined>(undefined);
  const [warning, setWarning] = useState<string>('');
  const [time, setTime] = useState<number | undefined>(undefined);

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
        setPart1(runSimulation(cleanData, buildRope(2)).length);
        setPart2(runSimulation(cleanData, buildRope(10)).length);
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

  return <DayContainer day='9' inputCallback={setValue} part1={part1} part2={part2} time={time} warning={warning}></DayContainer>;
}

export default Day;

import { useMemo, useState } from 'react';
import DayContainer from '../components/DayContainer';

interface Tree {
  height: number
  blockedNorth: boolean
  sceneNorth: number
  blockedSouth: boolean
  sceneSouth: number
  blockedEast: boolean
  sceneEast: number
  blockedWest: boolean
  sceneWest: number
};

/**
 * Prepares the data for the challenge.
 * builds a map of trees checks for line of site blocks along the way.
 * @param input The input string from the textArea
 * @returns The cleaned data as required to complete the puzzle
 */
function prepare (input: string): Tree[][] {
  const map: Tree[][] = [];
  const rows = input.trim().split('\n');

  for (let i = 0; i < rows.length; i++) {
    const line = rows[i];
    const row: Tree[] = [];
    for (let j = 0; j < line.length; j++) {
      const height = parseInt(line.charAt(j));
      const newTree: Tree = {
        height,
        blockedNorth: false,
        blockedSouth: false,
        blockedEast: false,
        blockedWest: false,
        sceneNorth: 0,
        sceneSouth: 0,
        sceneEast: 0,
        sceneWest: 0
      };
      // Check trees blocked or blocking north/south
      for (let vertCheck = i - 1; vertCheck >= 0; vertCheck--) {
        if (!map[vertCheck][j].blockedSouth) {
          map[vertCheck][j].sceneSouth++;
        }
        if (!newTree.blockedNorth) {
          newTree.sceneNorth++;
        }
        if (height > map[vertCheck][j].height) {
          map[vertCheck][j].blockedSouth = true;
        } else if (height < map[vertCheck][j].height) {
          newTree.blockedNorth = true;
        } else {
          map[vertCheck][j].blockedSouth = true;
          newTree.blockedNorth = true;
        }
      }
      // Check trees blocked or blocking east/west
      for (let hozCheck = j - 1; hozCheck >= 0; hozCheck--) {
        if (!row[hozCheck].blockedEast) {
          row[hozCheck].sceneEast++;
        }
        if (!newTree.blockedWest) {
          newTree.sceneWest++;
        }
        if (height > row[hozCheck].height) {
          row[hozCheck].blockedEast = true;
        } else if (height < row[hozCheck].height) {
          newTree.blockedWest = true;
        } else {
          newTree.blockedWest = true;
          row[hozCheck].blockedEast = true;
        }
      }
      row.push(newTree);
    }
    map.push(row);
  }
  return map;
}

function getVisibleTrees (trees: Tree[][]): Tree[] {
  return trees.flatMap((row) => row.filter((tree) => !(tree.blockedNorth && tree.blockedSouth && tree.blockedEast && tree.blockedWest)));
}
function getHighestScenicScores (trees: Tree[][]): number {
  return Math.max(...trees.flatMap((row) => row.map((t) => t.sceneNorth * t.sceneSouth * t.sceneEast * t.sceneWest)));
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
        const trees = prepare(value);
        setPart1(getVisibleTrees(trees).length);
        setPart2(getHighestScenicScores(trees));
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

  return <DayContainer day='8' inputCallback={setValue} part1={part1} part2={part2} time={time} warning={warning}></DayContainer>;
}

export default Day;

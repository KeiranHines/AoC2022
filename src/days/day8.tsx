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
  scenic: number
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
        sceneWest: 0,
        scenic: 0
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
function calculateScenics (trees: Tree[][]): number {
  let max = 0;
  trees.map((row) => row.forEach((t) => {
    t.scenic = t.sceneNorth * t.sceneSouth * t.sceneEast * t.sceneWest;
    if (t.scenic > max) {
      max = t.scenic;
    }
  }));
  return max;
}

function buildHeightMap (trees: Tree[][], scenicMax: number): JSX.Element {
  const size = trees.length > 20 ? 'tiny' : 'small';
  const scenicLines: JSX.Element[] = [];
  for (let i = 0; i < trees.length; i++) {
    const line = trees[i];
    const scenicComp: JSX.Element[] = [];
    for (let j = 0; j < line.length; j++) {
      const height = line[j].height;
      const scenic = line[j].scenic;
      const heatmapOpacity = (height + 1) / 10;
      const green = 255 * heatmapOpacity;
      const scenicOpacity = scenic / scenicMax;
      const scenicColor = 255 * scenicOpacity;
      scenicComp.push((
        <div key={`${i},${j}`}className={`square ${size} tooltip`} style={{
          backgroundColor: `rgba(${scenicColor},${Math.max(green, scenicColor)},${scenicColor},1)`,
          border: `1px solid rgba(255, 0, 0, ${scenicOpacity})`
        }}>
          {height}
          <span className='content'>{`scenic: ${scenic}`}</span>
        </div>));
    }
    scenicLines.push(<div key={i} className='line'>
      {scenicComp}
    </div>);
  }
  return (<>
    <div className='scenicMap'>
      {scenicLines}
    </div>
  </>
  );
}

function Day (): JSX.Element {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [part1, setPart1] = useState<number | undefined>(undefined);
  const [part2, setPart2] = useState<number | undefined>(undefined);
  const [warning, setWarning] = useState<string>('');
  const [time, setTime] = useState<number | undefined>(undefined);
  const [heightMap, setHeightMap] = useState<JSX.Element | undefined>(undefined);

  useMemo(() => {
    setWarning('');
    setPart1(undefined);
    setPart2(undefined);
    setTime(undefined);
    if (value !== undefined && value.length > 1) {
      try {
        const st = window.performance.now();
        const trees = prepare(value);
        const scenic = calculateScenics(trees);
        setPart1(getVisibleTrees(trees).length);
        setPart2(scenic);
        setTime(window.performance.now() - st);
        setHeightMap(buildHeightMap(trees, scenic));
      } catch (e) {
        if (typeof e === 'string') {
          setWarning(e.toUpperCase());
        } else if (e instanceof Error) {
          setWarning(e.message);
        }
      }
    }
  }, [value]);

  return <DayContainer day='8' inputCallback={setValue} part1={part1} part2={part2} time={time} warning={warning}>
    {heightMap !== undefined && heightMap}
  </DayContainer>;
}

export default Day;

import { useMemo, useState } from 'react';
import DayContainer from '../components/DayContainer';

interface Directory {
  name: string
  parent?: Directory
  directories: { [name: string]: Directory }
  files: File[]
  size: number
}

interface File {
  name: string
  size: number
};

/**
 * Prepares the data for the challenge.
 * Builds out a directory structure and tracks the file system sizes for all directories.
 * @param input The input string from the textArea
 * @returns The cleaned data as required to complete the puzzle
 */
function prepare (input: string): Directory {
  const root: Directory = {
    name: '/',
    directories: {},
    files: [],
    size: 0
  };
  let activeDir: Directory = root;
  input.trim().split('\n').forEach((line) => {
    const parts = line.split(' ');
    if (parts[0] === '$') {
      // Process Command
      switch (parts[1]) {
        case 'cd':
          if (parts[2] === '..') {
            if (activeDir.parent === undefined) {
              activeDir = root;
            } else {
              activeDir = activeDir.parent;
            }
          } else if (parts[2] === '/') {
            activeDir = root;
          } else {
            activeDir = activeDir.directories[parts[2]];
          }
          break;
        default: // Treat ls as default as its handled below
          break;
      }
    } else {
      // Process Result
      if (parts[0] === 'dir') {
        if (activeDir.directories[parts[1]] === undefined) {
          activeDir.directories[parts[1]] = {
            name: parts[1],
            parent: activeDir,
            directories: {},
            files: [],
            size: 0
          };
        }
      } else {
        const size = parseInt(parts[0]);
        activeDir.files.push({
          name: parts[1],
          size
        });
        activeDir.size += size;
        let parent = activeDir.parent;
        // Add the size to all parents.
        while (parent !== undefined) {
          parent.size += size;
          parent = parent.parent;
        }
      }
    }
  });
  return root;
}

/**
 * Finds all directories smaller than or equal to n in size.
 * @param initial The initial directory to search from.
 * @param n The size the directories need to be smaller than.
 * @returns A list of directories smaller than n.
 */
function findDirectoriesSmallerThanN (initial: Directory, n: number): Directory[] {
  const toSearch: Directory[] = [];
  const smaller: Directory[] = [];
  toSearch.push(initial);
  while (toSearch.length > 0) {
    const current = toSearch.pop();
    if (current != null) {
      if (current.size <= n) {
        smaller.push(current);
      }
      toSearch.push(...Object.values(current.directories));
    }
  }
  return smaller;
}

/**
 * @param initial The initial directory to search.
 * @param n The size the directory needs to be greater than or equal to.
 * @returns The smallest directory that is greater than or equal to n.
 */
function findSmallestGreaterThanN (initial: Directory, n: number): Directory {
  const toSearch: Directory[] = [];
  let smaller = initial;
  toSearch.push(...Object.values(initial.directories));
  while (toSearch.length > 0) {
    const current = toSearch.pop();
    if (current != null) {
      if (current.size >= n && smaller.size > current.size) {
        smaller = current;
      }
      toSearch.push(...Object.values(current.directories));
    }
  }
  return smaller;
}

/**
 * Finds the optimal directory to delete to get the required free space.
 * @param initial The initial directory to search for deletion candidates from.
 * @param fsSize The total file system size
 * @param required The required free space
 * @returns The optimal directory to delete
 */
function getDeletionCandidate (initial: Directory, fsSize: number, required: number): Directory {
  const freeSpace = fsSize - initial.size;
  const requiredToRemove = required - freeSpace;
  return findSmallestGreaterThanN(initial, requiredToRemove);
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
        const tree = prepare(value);
        const smallerThan100k = findDirectoriesSmallerThanN(tree, 100000);
        const toDelete = getDeletionCandidate(tree, 70000000, 30000000);
        setPart1(smallerThan100k.map(d => d.size).reduce((sum, current) => sum + current, 0));
        setPart2(toDelete.size);
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

  return <DayContainer day='7' inputCallback={setValue} part1={part1} part2={part2} time={time} warning={warning}></DayContainer>;
}

export default Day;

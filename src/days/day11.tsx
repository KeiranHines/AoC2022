import { useMemo, useState } from 'react';
import DayContainer from '../components/DayContainer';

interface Monkey {
  startingItems: number[]
  operation: (old: number) => number
  testDivisor: number
  trueMonkey: number
  falseMonkey: number
  inspected: number
}

function buildOperation (modifier: string, magnitude: string): (old: number) => number {
  if (magnitude === 'old') {
    switch (modifier) {
      case '*':
        return (old: number) => old * old;
      case '/':
        return (old: number) => 0;
      case '-':
        return (old: number) => 1;
      case '+':
        return (old: number) => old + old;
    }
  } else {
    switch (modifier) {
      case '*':
        return (old: number) => old * parseInt(magnitude);
      case '/':
        return (old: number) => old / parseInt(magnitude);
      case '-':
        return (old: number) => old - parseInt(magnitude);
      case '+':
        return (old: number) => old + parseInt(magnitude);
    }
  }
  throw Error(`unknown magnitude (${magnitude}) or modifier (${modifier})`);
}

/**
 * Prepares the data for the challenge.
 * parses the input into an array of Monkeys
 * @param input The input string from the textArea
 * @returns The cleaned data as required to complete the puzzle
 */
function prepare (input: string): Map<number, Monkey> {
  const monkeys: Map<number, Monkey> = new Map();
  input.split('\n\n').forEach((monkeyString) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [idLine, startingLine, operationLine, testDescription, trueLine, falseLine] = monkeyString.split('\n');
    const id = parseInt(idLine.split(' ')[1].slice(0, -1));
    const startingItems = startingLine.replace('Starting items: ', '').split(', ').map(x => parseInt(x));
    const [modifier, magnitude] = operationLine.replace('Operation: new = old ', '').trim().split(' ');
    const operation = buildOperation(modifier, magnitude);
    const testDivisor = parseInt(testDescription.split(' ').slice(-1)[0]);
    const trueMonkey = parseInt(trueLine.split(' ').slice(-1)[0]);
    const falseMonkey = parseInt(falseLine.split(' ').slice(-1)[0]);
    monkeys.set(id, {
      startingItems,
      operation,
      testDivisor,
      trueMonkey,
      falseMonkey,
      inspected: 0
    });
  });
  return monkeys;
}

function processRound (monkeys: Map<number, Monkey>, reliefFunction: (worry: number) => number): void {
  monkeys.forEach((monkey, key) => {
    while (monkey.startingItems.length > 0) {
      let worry = monkey.startingItems.shift() as number;
      worry = monkey.operation(worry);
      worry = reliefFunction(worry);
      if (worry % monkey.testDivisor === 0) {
        monkeys.get(monkey.trueMonkey)?.startingItems.push(worry);
      } else {
        monkeys.get(monkey.falseMonkey)?.startingItems.push(worry);
      }
      monkey.inspected++;
    }
  });
}

function runRounds (monkeys: Map<number, Monkey>, rounds: number, reliefFunction: (worry: number) => number): void {
  for (let i = 0; i < rounds; i++) {
    processRound(monkeys, reliefFunction);
  }
}

function getMostActive (n: number, monkeys: Map<number, Monkey>): Monkey[] {
  return Array.from(monkeys.values()).sort((a, b) => a.inspected - b.inspected).slice(-1 * n);
}

function gcd (a: number, b: number): number {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
}

function findLcm (a: number[]): number {
  let ans = a[0];
  const num = a.length;
  for (let i = 1; i < num; i++) {
    ans = (((a[i] * ans)) /
  (gcd(a[i], ans)));
  }

  return ans;
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
        const monkeys1 = prepare(value);
        const monkeys2 = prepare(value);
        runRounds(monkeys1, 20, (worry) => Math.floor(worry / 3));
        const lcm = findLcm(Array.from(monkeys2.values()).map((m) => m.testDivisor));
        runRounds(monkeys2, 10000, (worry) => worry % lcm);
        const mostActive1 = getMostActive(2, monkeys1);
        const mostActive2 = getMostActive(2, monkeys2);
        console.log(Array.from(monkeys2.values()).map(m => m.inspected));
        setPart1(mostActive1.reduce((a, b) => a * b.inspected, 1));
        setPart2(mostActive2.reduce((a, b) => a * b.inspected, 1));
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

  return <DayContainer day='11' inputCallback={setValue} part1={part1} part2={part2} time={time} warning={warning}></DayContainer>;
}

export default Day;

import { useMemo, useState } from 'react';
import 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import type { ChartData } from 'chart.js';
import DayContainer from '../components/DayContainer';

function prepare (input: string): number[][] {
  return input.trim().split('\n\n').map((raw) => raw.split('\n').map((str) => parseInt(str)));
}

function reduce (input: number[][]): number[] {
  return input.map((calories) => calories.reduce((sum, a) => sum + a, 0));
}

function getTopN (input: number[], n: number): number[] {
  return [...input].sort((a, b) => a - b).slice(-1 * n);
}

function Day (): JSX.Element {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [part1, setPart1] = useState<number | undefined>(undefined);
  const [part2, setPart2] = useState<number | undefined>(undefined);
  const [warning, setWarning] = useState<string>('');
  const [time, setTime] = useState<number | undefined>(undefined);

  const [reduced, setReduced] = useState<number[] | undefined>(undefined);
  const [data, setData] = useState<ChartData<'bar'> | undefined>(undefined);
  useMemo(() => {
    setWarning('');
    setPart1(undefined);
    setPart2(undefined);
    setTime(undefined);
    if (value !== undefined && value.length > 1) {
      try {
        const st = window.performance.now();
        const napsacks = prepare(value);
        const r = reduce(napsacks);
        setReduced(r);
        setPart1(Math.max(...r));
        setPart2(getTopN(r, 3).reduce((x, a) => x + a, 0));
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

  useMemo(() => {
    if (reduced !== undefined) {
      const index: number[] = [];
      reduced.forEach((v, i) => {
        index.push(i);
      });

      const d = {
        labels: index,
        datasets: [
          {
            label: 'Calories',
            data: [...reduced]
          }
        ]
      };
      setData(d);
    }
  }, [reduced]);

  return (
    <DayContainer day='1' inputCallback={setValue} part1={part1} part2={part2} time={time} warning={warning}>
      {data !== undefined && <Bar id={'calories'} className="chart" data={data}></Bar> }
    </DayContainer>
  );
}

export default Day;

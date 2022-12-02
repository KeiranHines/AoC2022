import { useMemo, useState } from 'react';
import Part from '../components/part';
import 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import type { ChartData } from 'chart.js';

function prepare (input: string): number[][] {
  return input.trim().split('\n\n').map((raw) => raw.split('\n').map((str) => parseInt(str)));
}

function reduce (input: number[][]): number[] {
  return input.map((calories) => calories.reduce((sum, a) => sum + a, 0));
}

function getTopN (input: number[], n: number): number[] {
  return [...input].sort((a, b) => a - b).slice(-1 * n);
}

function App (): JSX.Element {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [reduced, setReduced] = useState<number[] | undefined>(undefined);
  const [part1, setPart1] = useState<number | undefined>(undefined);
  const [part2, setPart2] = useState<number | undefined>(undefined);
  const [data, setData] = useState<ChartData<'bar'> | undefined>(undefined);
  useMemo(() => {
    if (value !== undefined) {
      const napsacks = prepare(value);
      const r = reduce(napsacks);
      setReduced(r);
      setPart1(Math.max(...r));
      setPart2(getTopN(r, 3).reduce((x, a) => x + a, 0));
    }
  }, [value]);

  useMemo(() => {
    if (reduced !== undefined) {
      const index: number[] = [];
      reduced.forEach((v, i) => {
        index.push(i);
      });
      console.log(reduced);

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
    <div className="App">
      <div className={'input'}>
      <textarea className='max'
        placeholder='Enter input:'
        value = {value}
        onChange={e => { setValue(e.target.value); }}
        >
      </textarea>
        </div>
      {part1 !== undefined && <Part number={1} result={part1}></Part> }
      {part2 !== undefined && <Part number={2} result={part2}></Part> }
      {data !== undefined && <Bar id={'calories'} className="chart" data={data}></Bar> }
     </div>
  );
}

export default App;

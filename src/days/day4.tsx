import { useMemo, useState } from 'react';
import DayContainer from '../components/DayContainer';
import 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import type { ChartData } from 'chart.js';

/**
 * Prepares the data for the challenge.
 * @param input The input string from the textArea
 * @returns The cleaned data as required to complete the puzzle
 */
function prepare (input: string): string[][] {
  return input.trim().split('\n').map((line) => line.split(','));
}

function findCompleteOverlaps (assignments: string[][]): string[][] {
  return assignments.filter((pair) => {
    const [first, second] = pair;
    let temp = first.split('-');
    const firstStart = parseInt(temp[0]);
    const firstEnd = parseInt(temp[1]);
    temp = second.split('-');
    const secondStart = parseInt(temp[0]);
    const secondEnd = parseInt(temp[1]);
    return (firstStart <= secondStart && firstEnd >= secondEnd) || (secondStart <= firstStart && secondEnd >= firstEnd);
  });
}

function findAnyOverlaps (assignments: string[][]): string[][] {
  return assignments.filter((pair) => {
    const [first, second] = pair;
    let temp = first.split('-');
    const firstStart = parseInt(temp[0]);
    const firstEnd = parseInt(temp[1]);
    temp = second.split('-');
    const secondStart = parseInt(temp[0]);
    const secondEnd = parseInt(temp[1]);
    // 1-4 3-5
    // 3-5 1-4
    return (secondStart <= firstEnd && secondStart >= firstStart) || (firstStart <= secondEnd && firstStart >= secondStart);
  });
}

function buildVisualisation (assignments: string[][]): ChartData<'bar'> {
  const firsts: number[][] = [];
  const seconds: number[][] = [];
  assignments.forEach((pair) => {
    const [first, second] = pair;
    let temp = first.split('-');
    const firstStart = parseInt(temp[0]);
    const firstEnd = parseInt(temp[1]);
    temp = second.split('-');
    const secondStart = parseInt(temp[0]);
    const secondEnd = parseInt(temp[1]);
    firsts.push([firstStart, firstEnd]);
    seconds.push([secondStart, secondEnd]);
  });

  return {
    labels: assignments.map((v, i) => `Pair ${i}`),
    datasets: [
      {
        label: 'First schedule',
        // @ts-expect-error
        data: firsts
      }, {
        label: 'Second Schedule',
        // @ts-expect-error
        data: seconds
      }

    ]
  };
}

function Day (): JSX.Element {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [part1, setPart1] = useState<number | undefined>(undefined);
  const [part2, setPart2] = useState<number | undefined>(undefined);
  const [time, setTime] = useState<number | undefined>(undefined);

  const [data1, setData1] = useState<ChartData<'bar'> | undefined>(undefined);
  const [data2, setData2] = useState<ChartData<'bar'> | undefined>(undefined);
  useMemo(() => {
    if (value !== undefined) {
      const st = new Date();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const cleanData = prepare(value);
      const partOverlaps = findAnyOverlaps(cleanData);
      const fullOverlaps = findCompleteOverlaps(partOverlaps);
      setPart1(fullOverlaps.length);
      setPart2(partOverlaps.length);
      setTime(new Date().getTime() - st.getTime());
      setData1(buildVisualisation(fullOverlaps));
      setData2(buildVisualisation(partOverlaps));
    }
  }, [value]);

  return <DayContainer day='4' inputCallback={setValue} part1={part1} part2={part2} time={time}>
    {(data1 !== undefined) && <>
      <div className='subtitle'>Full Overlaps</div>
      <Bar id={'part1Visual'} className="chart" data={data1}></Bar>
    </>}
    {(data2 !== undefined) && <>
      <div className='subtitle'>Partial Overlaps</div>
      <Bar id={'part2Visual'} className="chart" data={data2}></Bar>
    </>
    }
  </DayContainer>;
}

export default Day;

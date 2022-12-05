// import { useState, useMemo } from 'react';
import Part from './part';

interface Props {
  day: string
  inputCallback: Function
  part1?: number | string
  part2?: number | string
  time?: number
  children?: React.ReactNode
}
function DayContainer ({ day, inputCallback, part1, part2, time, children }: Props): JSX.Element {
  return (
    <div className="App">
      <h1>{`Day ${day} solver`}</h1>
      <div className={'input'}>
        <textarea className='max'
          placeholder='Enter input:'
          onChange={e => { inputCallback(e.target.value); }}
        >
        </textarea>
      </div>
      {time !== undefined && <div className='subtitle'>{`Time taken: ${time}ms`}</div>}
      {part1 !== undefined && <Part number={1} result={part1}></Part> }
      {part2 !== undefined && <Part number={2} result={part2}></Part> }
      {children}
    </div>
  );
}

export default DayContainer;

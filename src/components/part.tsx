
interface Props {
  number: number
  result: number
}

export default function Part ({ number, result }: Props): JSX.Element {
  return (<div className='result'>
    <div className={'title'}>{`Part ${number}:`}</div>
    <code>{result}</code>
  </div>);
}

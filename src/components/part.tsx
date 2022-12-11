
interface Props {
  number: number
  result: number | string
}

export default function Part ({ number, result }: Props): JSX.Element {
  return (<>
    <div className={'title'}>{number}</div>
    <code>{result}</code>
  </>
  );
}

import { NavLink } from 'react-router-dom';

const ACTIVE = 'active';
interface Props {
  to: string
  children?: React.ReactNode

}

function NavWrapper ({ to, children }: Props): JSX.Element {
  return (<NavLink
    to={to}
    className={({ isActive }) =>
      isActive ? ACTIVE : undefined
    }>
    {children}
  </NavLink>);
}

function Header (): JSX.Element {
  return (
    <div className="header">
      <div className="padding"></div>
      <NavWrapper to="/day1">Day 1</NavWrapper>
      <NavWrapper to="/day2">Day 2</NavWrapper>
      <NavWrapper to="/day3">Day 3</NavWrapper>
      <NavWrapper to="/day4">Day 4</NavWrapper>
      <NavWrapper to="/day5">Day 5</NavWrapper>
      <NavWrapper to="/day6">Day 6</NavWrapper>
      <NavWrapper to="/day7">Day 7</NavWrapper>
      <div className="padding"></div>
    </div>
  );
}
export default Header;

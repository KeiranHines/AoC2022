import { NavLink } from 'react-router-dom';

const ACTIVE = 'active';
function Header (): JSX.Element {
  return (
    <div className="header">
      <div className="padding"></div>
      <NavLink
        to="/day1"
        className={({ isActive }) =>
          isActive ? ACTIVE : undefined
        }>
                Day 1
      </NavLink>
      <NavLink
        to="/day2"
        className={({ isActive }) =>
          isActive ? ACTIVE : undefined
        }>
                Day 2
      </NavLink>
      <NavLink
        to="/day3"
        className={({ isActive }) =>
          isActive ? ACTIVE : undefined
        }>
                Day 3
      </NavLink>
      <div className="padding"></div>
    </div>
  );
}
export default Header;

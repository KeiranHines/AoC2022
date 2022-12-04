import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import Header from './Header';
import Landing from './Landing';

import Day1 from './days/day1';
import Day2 from './days/day2';
import Day3 from './days/day3';
import Day4 from './days/day4';

function Main (): JSX.Element {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/day1" element={<Day1 />} />
        <Route path="/day2" element={<Day2 />} />
        <Route path="/day3" element={<Day3 />} />
        <Route path="/day4" element={<Day4 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Main;

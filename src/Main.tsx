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
import Day5 from './days/day5';
import Day6 from './days/day6';
import Day7 from './days/day7';
import Day8 from './days/day8';
import Day9 from './days/day9';

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
        <Route path="/day5" element={<Day5 />} />
        <Route path="/day6" element={<Day6 />} />
        <Route path="/day7" element={<Day7 />} />
        <Route path="/day8" element={<Day8 />} />
        <Route path="/day9" element={<Day9 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Main;

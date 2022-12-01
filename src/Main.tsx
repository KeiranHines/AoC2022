import './App.css';

import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import Header from './Header';
import Landing from './Landing';

import Day1 from './day1';

function Main (): JSX.Element {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/day1" element={<Day1 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Main;

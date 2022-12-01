import React from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Link
  } from "react-router-dom";
import Header from './Header';
import Landing from './Landing';

import Day1 from './day1';

const Main = () => {
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
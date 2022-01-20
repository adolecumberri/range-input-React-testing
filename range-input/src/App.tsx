import React from 'react';

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Navigation from './components/Navigation';
import RangeInput from './components/RangeInput';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        
        <BrowserRouter>
        <Navigation />
          <Routes>
            <Route path="/Exercice1" element={<RangeInput />} />
            <Route path="/Exercice2" element={<RangeInput />} />
          </ Routes>

        </BrowserRouter>,
      </header>
    </div>
  );
}

export default App;

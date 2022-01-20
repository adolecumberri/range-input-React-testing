import React from 'react';

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Navigation from './components/Navigation';
import RangeInput from './components/RangeInput';


function App() {

  const containerStyle = {
    padding: "16px"
  }





  return (
    <div className="App" style={{ height: '100%' }}>
      <header className="App-header">

        <BrowserRouter>
          <Navigation />
          <div style={containerStyle}>
            <Routes>
              <Route path="/Exercice1" element={<RangeInput />} />
              <Route path="/Exercice2" element={<RangeInput />} />
            </ Routes>

            

          </div>

        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;

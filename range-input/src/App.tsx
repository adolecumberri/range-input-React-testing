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
              <Route path="/Exercice1" element={<><RangeInput value={{ max: 30, min: 20 }} step={0.01} />
                <RangeInput value={{ max: 30, min: 20 }} step={0.1} />
                <RangeInput value={{ max: 30, min: 20 }} step={1} />

              </>} />
              <Route path="/Exercice2" element={<RangeInput value={[10.99, 12, 14.369, 16.52, 180]} labelsEnabled={false} />} />
            </ Routes>



          </div>

        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;

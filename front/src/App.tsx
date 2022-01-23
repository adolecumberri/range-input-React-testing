import React, { useEffect, useState } from 'react';

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Navigation from './components/Navigation';
import RangeInput from './components/RangeInput';
import { myFetch } from './utils';


function App() {
  const [range, setRange] = useState({
    min: 0, max: 1
  });
  const [valueRange, setValueRange] = useState<number[]>([0, 1]);


  /**
   * Calls the backend.
   */
  useEffect(() => {
    myFetch({
      path: "/range",
      method: "GET"
    }).then((value: any) => {
      setRange(value);
    });

    myFetch({
      path: `/values/${Math.floor(Math.random() * 150 + 5)}`,
      method: "GET"
    }).then(({ values }: any) => {
      console.log({ a: values });
      setValueRange(values);
    });
  }, []);

  return (
    <div className="App" style={{ height: '100%' }}>
      <header className="App-header">

        <BrowserRouter>
          <Navigation />
          <div style={{ padding: "16px" }}>
            <Routes>
              <Route path="/Exercice1" element={<><RangeInput value={range} step={0.01} />
                <RangeInput value={range} step={0.1} />
                <RangeInput value={range} step={1} />

              </>} />
              <Route path="/Exercice2" element={<RangeInput value={valueRange} range={range} labelsEnabled={false} />} />
            </ Routes>
          </div>

        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;

import React, { FC, useCallback, useEffect, useReducer, useState } from 'react';
import Bullet from './rangeInput/Bullet';
import Slider from './rangeInput/Slider';




interface IRangeInput {
  width?: number | string;
  height?: number | string;
}

const RangeInput: FC<IRangeInput> = ({ width = "80%" }) => {

  const height = 40;

  //Explicar por qué no uso UseReducer. (el estado sliderWidth....)
  const [X, setX] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);


  /**
 * 
 * @param {any} action - argument.
 */
  const xBulletHandler: (newValue: number) => void = useCallback((newValue) => {
    //lower than 0? then 0
    let solution = newValue < 0 ? 0 :
      //higher than the sliderWidth? then = sliderWdith
      newValue > sliderWidth ? sliderWidth :
        newValue;




    setX(solution);
  }, [sliderWidth]);




  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("Over");
    e.preventDefault();
    e.stopPropagation();
    console.log(e)
    xBulletHandler(e.pageX - (height / 2));
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("Drop");
    e.preventDefault();
    e.stopPropagation();
  };


  return (
    <div style={{ width, margin: height / 4 }}>
      <span>
        width: {sliderWidth}<br />
        X: {X}
      </span>
      <Slider
        height={height}
        sliderStatus={[sliderWidth, setSliderWidth]}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
      >
        <Bullet
          size={height}
          position={X}
        />


      </Slider>
    </div>
  );
}

export default RangeInput;

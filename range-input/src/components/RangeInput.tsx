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
  const [minBulletX, setMinBulletX] = useState(0);
  const [maxBulletX, setMaxBulletX] = useState(0);
  const [selectedBullet, setSelectedBullet] = useState<"min" | "max">("min");

  const [sliderWidth, setSliderWidth] = useState(0);

  //correction value parentSliderDiv.width - sliderDiv.
  const [sliderMargin, setSliderMargin] = useState(0);


  useEffect(() => {
    setMaxBulletX(sliderWidth);
  }, [sliderWidth]);

  /**
 * 
 * @param {any} action - argument.
 */
  const xBulletHandler: (newValue: number) => void = useCallback((newValue) => {

    let newValueCorrected = newValue - (height / 2);

    //lower than 0? then 0
    let solution = newValueCorrected - sliderMargin < 0 ? 0 :
      //higher than the sliderWidth? then = sliderWdith
      newValueCorrected - sliderMargin > sliderWidth ? sliderWidth :
        newValueCorrected - sliderMargin;


    if (selectedBullet === "max")
      debugger
    //min y lower that the maxBullet ?
    if (selectedBullet === "min") {
      if (solution < maxBulletX - height + 2) { //height - 2  hace referencia al otro bullet + margin
        //solution loaded with the margin correction.
        setMinBulletX(solution)
      }

    } else if (solution > (minBulletX + height - 2)) { //height - 2  hace referencia al otro bullet + margin
      setMaxBulletX(solution)
    }
  }, [sliderWidth, sliderMargin, maxBulletX, minBulletX, selectedBullet]);




  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    xBulletHandler(e.pageX);
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
        X min: {minBulletX} <br />
        X max: {maxBulletX}
      </span>
      <Slider
        height={height}
        sliderStatus={[sliderWidth, setSliderWidth]}
        sliderMarginStatus={[sliderMargin, setSliderMargin]}
        minBulletStatus={[minBulletX, setMinBulletX]}
        maxBulletStatus={[maxBulletX, setMaxBulletX]}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
      >
        <Bullet

          setSelectedBullet={setSelectedBullet}
          type={"min"}
          size={height}
          position={minBulletX}
          sliderMargin={sliderMargin}
        />
        <Bullet
          setSelectedBullet={setSelectedBullet}
          type={"max"}
          size={height}
          position={maxBulletX}
          sliderMargin={sliderMargin}
        />

      </Slider>
    </div>
  );
}

export default RangeInput;

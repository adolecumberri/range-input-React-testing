import React, { FC, useCallback, useEffect, useReducer, useState } from 'react';
import M from '../constants/messages';
import { RangeValue } from '../interfaces/RangeInput';
import Bullet from './rangeInput/Bullet';
import Slider from './rangeInput/Slider';

import "./rangeInput.css"


interface IRangeInput {
  width?: number | string;
  height?: number | string;
  value: RangeValue;
  step?: 0.01 | 0.1 | 1 | 0;
  labelsEnabled?: boolean;
}

const RangeInput: FC<IRangeInput> = ({ width = "80%", value, step = 0, labelsEnabled = true }) => {

  const height = 40;

  //Explicar por qué no uso UseReducer. (el estado sliderWidth....)
  const [minBulletX, setMinBulletX] = useState(0);
  const [minBulletPrice, setMinBulletPrice] = useState(0);
  const [maxBulletX, setMaxBulletX] = useState(0);
  const [maxBulletPrice, setMaxBulletPrice] = useState(1);
  const [selectedBullet, setSelectedBullet] = useState<"min" | "max">("min");

  //correction value parentSliderDiv.width - sliderDiv.
  const [sliderMargin, setSliderMargin] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);

  const [sliderValue, setSliderValue] = useState<{ min: number, max: number, value: RangeValue }>({
    min: 0,
    max: 1,
    value: { min: 0, max: 1 }
  });

  //Reference to what should multiply the final value to get the correct steps.
  // Not the best way to do it, but a working one.
  const [stepMultiplier, setStepMultiplier] = useState(1);


  useEffect(() => {
    const DICTIONARY = {
      "0.01": 100,
      "0.1": 10,
      "1": 1,
      "0": 100,
    }

    //defino el multiplicador con el que calcularé los steps.
    if (!Array.isArray(value) && step) {
      setStepMultiplier(DICTIONARY[step]);
    }

  }, [step]);

  //Defino el estado de los valores, independientemente de que tipo de input quiere, si libre o si concreto.
  useEffect(() => {
    if (Array.isArray(value)) {

      let newValue = value.sort((a, b) => a - b);
      setSliderValue({
        max: newValue[value.length - 1],
        min: newValue[0],
        value: newValue
      });
      setMaxBulletPrice(newValue[value.length - 1]);
      setMinBulletPrice(newValue[0]);
    } else {
      // Aqui es {max,min} 100%
      if (value.min >= value.max) throw new Error(M.max_min_error);
      setSliderValue({
        ...value,
        value
      });
      setMaxBulletPrice(value.max);
      setMinBulletPrice(value.min);
    }
  }, [value]);

  //EachTime sliderWidth changes, re-adjust maxBulletX
  useEffect(() => {
    setMaxBulletX(sliderWidth);

    //minBulletPrice
    //newValue in bounds 
    let newMinPricePercentage = minBulletPrice <= sliderValue.min ? sliderValue.min :
    minBulletPrice >= sliderValue.max ? sliderValue.max :
    minBulletPrice >= maxBulletPrice ? maxBulletPrice - step :
    minBulletPrice;

    //calc position using the % where current price is. (if price is the 20% of the value, position will be 20% too.)
    let minPricePercentage = (newMinPricePercentage - sliderValue.min) / (sliderValue.max - sliderValue.min);
    let minBulletPosition = minPricePercentage * sliderWidth;
    setMinBulletX(minBulletPosition)


    //newValue in bounds 
    let newMaxBulletPrice = maxBulletPrice <= sliderValue.min ? sliderValue.min :
    maxBulletPrice >= sliderValue.max ? sliderValue.max :   
    maxBulletPrice <= minBulletPrice ? minBulletPrice + step :
    maxBulletPrice;
    
    //calc position using the % where current price is. (if price is the 20% of the value, position will be 20% too.)
    let maxPricePercentage = (newMaxBulletPrice - sliderValue.min) / (sliderValue.max - sliderValue.min);
    let maBulletPosition = maxPricePercentage * sliderWidth;
    setMaxBulletX(maBulletPosition);

  }, [sliderWidth]);

  /**
 * 
 * @param {any} action - argument.
 */
  const pxBulletHandler: (newValue: number, bullet?: "min" | "max" ) => void = useCallback((newValue , bullet = selectedBullet) => {

    //height is the bullet width.
    let newValueCorrected = newValue - (height / 2);

    //solution is the pixel where the bullet is.
    //solution (px) in bounds. 0 - sliderWidth
    let solution = newValueCorrected - sliderMargin < 0 ? 0 :
      newValueCorrected - sliderMargin > sliderWidth ? sliderWidth :
        newValueCorrected - sliderMargin;


    //Calculando el precio final.
    let pxPercentage = solution / sliderWidth;  // Xpx - Apx / Bpx - Apx  --> A y B son extremos, X es el punto.
    let finalPrice = pxPercentage * (sliderValue.max - sliderValue.min) + sliderValue.min;
    //finalPrice Rounded


    finalPrice = Math.round(finalPrice * stepMultiplier) / stepMultiplier;


    //min y lower that the maxBullet ?
    if (bullet === "min") {
      if (solution < maxBulletX - height + 2) { //height - 2  hace referencia al otro bullet + margin 

        //If the price is the same, I take off the step value. being the minimal distance possible.
        let finalPriceCorrection = finalPrice === maxBulletPrice ? finalPrice - (step as number) : finalPrice;
        // if it's an array I will find the closest value.
        setMinBulletPrice( Array.isArray(value) ? searchClosest(finalPriceCorrection) as number : finalPriceCorrection);
        //solution loaded with the margin correction.
        setMinBulletX(solution);
      }

    } else if (solution > (minBulletX + height - 2)) { //height - 2  hace referencia al otro bullet + margin
      let finalPriceCorrection = finalPrice === minBulletPrice ? finalPrice + (step as number) : finalPrice;

      setMaxBulletPrice( Array.isArray(value) ? searchClosest(finalPriceCorrection) as number : finalPriceCorrection);
      setMaxBulletX(solution);
    }
  }, [sliderWidth, sliderMargin, maxBulletX, minBulletX, selectedBullet]);


  const priceBulletHandler: (newValue: number, bullet?: "min" | "max" ) => void = useCallback((newValue, bullet = selectedBullet) => {

    //newValue in bounds 
    // Lower than the min value?
    // Higher than the max value?
    // MinBullet higher than maxBulletPrice?
    // MaxBullet lower than min Bullet Price?
    // otherwise default value.
    let solution = newValue <= sliderValue.min ? sliderValue.min :
      newValue >= sliderValue.max ? sliderValue.max :
        (bullet === "min" && newValue >= maxBulletPrice) ? maxBulletPrice - step :
          (bullet === "max" && newValue <= minBulletPrice) ? minBulletPrice + step :
            newValue;

  //set solution decimals on the step bounds too.
  solution = Math.round(solution * stepMultiplier) / stepMultiplier;


  //Calculando el precio final.
  let pricePercentage = (solution - sliderValue.min) / (sliderValue.max - sliderValue.min);
  let finalPixelPosition = pricePercentage * sliderWidth;

    //min or max bullet?
    if (bullet === "min") {
      setMinBulletPrice(Array.isArray(value) ? searchClosest(solution) as number : solution);
      //solution loaded with the margin correction.
      setMinBulletX(finalPixelPosition);
    } else {
      setMaxBulletPrice(Array.isArray(value) ? searchClosest(solution) as number : solution);
      setMaxBulletX(finalPixelPosition);
    }


  }, [selectedBullet, maxBulletPrice, minBulletPrice, sliderValue.min, sliderValue.max]);


  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    pxBulletHandler(e.pageX);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("Drop");
    e.preventDefault();
    e.stopPropagation();
  };

  const searchClosest = (number: number) => {
    if(!Array.isArray(value)){
      return false;
    }


    return value.reduce( (prev, curr) => (Math.abs(curr - number) < Math.abs(prev - number) ? curr : prev)  );

}

  return (
    <div style={{ width, margin: height / 4 }}>
      <span>
        width: {sliderWidth}<br />
        X min: {minBulletX}  -  Price Min {minBulletPrice}    <br />
        X max: {maxBulletX}  -  Price Max {maxBulletPrice}
      </span>
      <Slider
        height={height}
        sliderStatus={[sliderWidth, setSliderWidth]}
        sliderMarginStatus={[sliderMargin, setSliderMargin]}
        minBulletXStatus={[minBulletX, setMinBulletX]}
        maxBulletXStatus={[maxBulletX, setMaxBulletX]}

        minBulletPriceStatus={[minBulletPrice, setMinBulletPrice]}
        maxBulletPriceStatus={[maxBulletPrice, setMaxBulletPrice]}

        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        priceBulletHandler={priceBulletHandler}

        setSelectedBullet={setSelectedBullet}

        labelsEnabled ={labelsEnabled}

      >
        <Bullet
          setSelectedBullet={setSelectedBullet}
          type={"min"}
          size={height}
          position={minBulletX}
          sliderMargin={sliderMargin}
          defaultValue={sliderValue.min} //!unused
        />
        <Bullet
          setSelectedBullet={setSelectedBullet}
          type={"max"}
          size={height}
          position={maxBulletX}
          sliderMargin={sliderMargin}
          defaultValue={sliderValue.max} //!unused
        />

      </Slider>
    </div>
  );
}

export default RangeInput;

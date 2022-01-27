/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useCallback, useEffect, useState } from 'react';
import M from '../constants/messages';
import { RangeValue } from '../interfaces/RangeInput';
import Bullet from './rangeInput/Bullet';
import Slider from './rangeInput/Slider';

import "./rangeInput.css"


interface IRangeInput {
  width?: number | string;
  height?: number;
  value: RangeValue;
  step?: 0.01 | 0.1 | 1 | 0;
  labelsEnabled?: boolean;
  range?: {min: number, max: number};
  testid?: string;
  onChange?: (newValue:  {max: number, min: number } ) => void;
}

const RangeInput: FC<IRangeInput> = ({ width = "80%", height = 40, value, step = 0, labelsEnabled = true, range= null, testid, onChange }) => {

  // const height = 40;

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


  /**
   * Created step Multiplier using a Dictionary as reference.
   */
  useEffect(() => {
    const DICTIONARY = {
      "0.01": 100,
      "0.1": 10,
      "1": 1,
      "0": 100,
    }

    //defino el multiplicador con el que calcularé los steps.
    if (!Array.isArray(value) && step) setStepMultiplier(DICTIONARY[step]);

  }, [step]);

  /**
   * Assign Bullets prices and sliderValues.
   * @param {func} effect - callback.
   * @param {value} deps - when value changes, it re-renders.
   */
  useEffect(() => {
    if (Array.isArray(value)) {
      if (!value.length) throw new Error(M.array_length_error);
      //array sorted.
      let newValue = value.sort((a, b) => a - b);
      //array in bounds
      if(range) newValue = newValue.filter( n => (n >= range.min || n <= range.max));

      //added slider values. and prices in bullets
      setSliderValue({
        max: newValue[value.length - 1],
        min: newValue[0],
        value: newValue
      });
      setMaxBulletPrice(newValue[value.length - 1]);
      setMinBulletPrice(newValue[0]);
    } else {
      // checking errors.
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
  /**
   * Readjust positions when slider width changes.
   * @param {func} effect - callback.
   * @param {value} deps - Just when slider Width changes, it re-renders.
   */
  useEffect(() => {

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

  useEffect( () => {
    onChange && onChange({
      min: minBulletPrice, 
      max: maxBulletPrice,
    });
  }, [minBulletPrice, maxBulletPrice]);

  /**
   * Handle bullet price and position by his pixel position.
   * @param {number} newValue - Pixel position.
   * @param {"min" | "max"} bullet - It's the selected bullet. you can override the default value.
   * @param {value} deps - the dependencies are just set knowing where shoult it be reconstructed.
   */
  const pxBulletHandler: (newValue: number, bullet?: "min" | "max") => void = useCallback((newValue, bullet = selectedBullet) => {
    //position minus the half of the bullet width. (visual correction)
    let newValueCorrected = newValue - (height / 2);

    //solution is the pixel where the bullet is.
    //solution (px) in bounds. [0 - sliderWidth]
    let solution = newValueCorrected - sliderMargin < 0 ? 0 :
      newValueCorrected - sliderMargin > sliderWidth ? sliderWidth :
        newValueCorrected - sliderMargin;


    //calculating final Price corrected by the steps.
    let pxPercentage = solution / sliderWidth;  // Xpx - Apx / Bpx - Apx  --> A y B son extremos, X es el punto.
    let finalPrice = pxPercentage * (sliderValue.max - sliderValue.min) + sliderValue.min;
    finalPrice = Math.round(finalPrice * stepMultiplier) / stepMultiplier;


    if (bullet === "min") {
      //check if it's not exactly in the same position than the max value bullet.
      if (solution < maxBulletX - height + 2) { //height - 2  hace referencia al otro bullet + margin 

        //If the price is the same, I take off the step value. being the "minimal" distance possible.
        let finalPriceCorrection = finalPrice === maxBulletPrice ? finalPrice - (step as number) : finalPrice;
        // if it's an array I will find the closest value. otherwhise it's okey.
        setMinBulletPrice(Array.isArray(value) ? searchClosest(finalPriceCorrection) as number : finalPriceCorrection);
        //solution loaded with the margin correction.
        setMinBulletX(solution);
      }

    } else if (solution > (minBulletX + height - 2)) { //height - 2  hace referencia al otro bullet + margin
      let finalPriceCorrection = finalPrice === minBulletPrice ? finalPrice + (step as number) : finalPrice;
      setMaxBulletPrice(Array.isArray(value) ? searchClosest(finalPriceCorrection) as number : finalPriceCorrection);
      setMaxBulletX(solution);
    }
  }, [sliderWidth, sliderMargin, maxBulletX, minBulletX, selectedBullet]);



 /**
   * Handle bullet price and position by his pixel position.
   * @param {number} newValue - Pixel position.
   * @param {"min" | "max"} bullet - It's the selected bullet. you can override the default value.
   * @param {value} deps - the dependencies are just set knowing where shoult it be reconstructed.
   */
  const priceBulletHandler: (newValue: number, bullet?: "min" | "max") => void = useCallback((newValue, bullet = selectedBullet) => {
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

  const searchClosest = (number: number) => {
    if (!Array.isArray(value)) return false;

    return value.reduce((prev, curr) => (Math.abs(curr - number) < Math.abs(prev - number) ? curr : prev));

  }

  return (
    <div data-testid={`${testid ? testid : "container"}`} style={{ width, margin: height / 4 }}>
      {/* <span>
        width: {sliderWidth}<br />
        X min: {minBulletX}  -  Price Min {minBulletPrice}    <br />
        X max: {maxBulletX}  -  Price Max {maxBulletPrice}
      </span> */}
      <Slider
        handleDragOver={handleDragOver}
        height={height}
        labelsEnabled={labelsEnabled}
        minBulletPriceStatus={[minBulletPrice, setMinBulletPrice]}
        minBulletXStatus={[minBulletX, setMinBulletX]}
        maxBulletPriceStatus={[maxBulletPrice, setMaxBulletPrice]}
        maxBulletXStatus={[maxBulletX, setMaxBulletX]}
        priceBulletHandler={priceBulletHandler}
        setSelectedBullet={setSelectedBullet}
        sliderStatus={[sliderWidth, setSliderWidth]}
        sliderMarginStatus={[sliderMargin, setSliderMargin]}
      >
        <Bullet
          position={minBulletX}
          setSelectedBullet={setSelectedBullet}
          size={height}
          sliderMargin={sliderMargin}
          type={"min"}
        />
        <Bullet
          position={maxBulletX}
          setSelectedBullet={setSelectedBullet}
          size={height}
          sliderMargin={sliderMargin}
          type={"max"}
        />

      </Slider>
    </div>
  );
}

export default RangeInput;

import React, { Dispatch, FC, ReactNode, SetStateAction, useEffect, useLayoutEffect, useRef, useState } from 'react';


interface ISlider {
    height?: number;
    children?: ReactNode;
    sliderStatus: [number, Dispatch<SetStateAction<number>>];
    sliderMarginStatus: [number, Dispatch<SetStateAction<number>>];
    handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDrop: (e: React.DragEvent<HTMLDivElement>) => void,
    minBulletXStatus: [number, Dispatch<SetStateAction<number>>];
    minBulletPriceStatus: [number, Dispatch<SetStateAction<number>>];
    maxBulletXStatus: [number, Dispatch<SetStateAction<number>>];
    maxBulletPriceStatus: [number, Dispatch<SetStateAction<number>>];
    priceBulletHandler: (newValue: number, bullet?: "min" | "max") => void;
    setSelectedBullet: Dispatch<SetStateAction<"min" | "max">>
}


const Slider: FC<ISlider> = ({
    height = 40,
    handleDragOver = () => { },
    handleDrop = () => { },
    sliderStatus: [sliderWidth, setSliderWidth],
    sliderMarginStatus: [sliderMargin, setSliderMargin],
    minBulletXStatus: [minBulletX, setMinBulletX],
    minBulletPriceStatus: [minBulletPrice, setMinBulletPrice],
    maxBulletXStatus: [maxBulletX, setMaxBulletX],
    maxBulletPriceStatus: [maxBulletPrice, setMaxBulletPrice],
    children,
    priceBulletHandler,
    setSelectedBullet,
}) => {

    const sliderColor = "#484848";
    const sliderDiv = useRef<HTMLDivElement>(null)


    /**
     * Actualizacion dinámica del slider Width.
     */
    useEffect(() => {
        function updateSize() {
            const slDiv = sliderDiv.current as HTMLDivElement;
            const slDivParent = slDiv.parentElement as HTMLDivElement;

            setSliderMargin((slDivParent.offsetWidth - slDiv.offsetWidth) / 2);
            setSliderWidth(slDiv.offsetWidth);
        }

        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize);
    }, []);


    return (
        <>
            <div style={{ display: "flex" }}>
                <input style={
                    { width: 40, height: 40, boxSizing: "border-box", textAlign: "center" }
                }
                    type="text"
                    value={minBulletPrice}
                    placeholder='Min'
                    onFocus={() => setSelectedBullet("min")}
                    onChange={({ target: { value } }) => {
                        if (!isNaN(value as unknown as number))
                            setMinBulletPrice(value as unknown as number);
                    }}
                    onBlur={(e) => {
                        priceBulletHandler(e.target.value as unknown as number);
                    }}

                />

                <div
                    id="slider"
                    ref={sliderDiv}
                    style={{
                        borderBottom: `${height}px solid ${sliderColor}`,
                        width: "100%",
                        position: "relative",
                        margin: `0px ${height}px`,
                    }}

                    onDrop={e => handleDrop(e)}
                    onDragOver={e => handleDragOver(e)}
                >
                    {children}
                </div>
                <input
                    style={
                        { width: 40, height: 40, boxSizing: "border-box", textAlign: "center" }
                    }
                    type="text"
                    value={maxBulletPrice}
                    placeholder='Max'
                    onFocus={() => setSelectedBullet("max")}
                    onChange={({ target: { value } }) => {
                        if (!isNaN(value as unknown as number))
                            setMaxBulletPrice(value as unknown as number);
                    }}
                    onBlur={(e) => {
                        priceBulletHandler(e.target.value as unknown as number);
                    }}
                />
            </div>

        </>

    );
}

export default Slider;

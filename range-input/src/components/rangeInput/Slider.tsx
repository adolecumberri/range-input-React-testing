import React, { Dispatch, FC, ReactNode, SetStateAction, useEffect, useLayoutEffect, useRef, useState } from 'react';


interface ISlider {
    height?: number;
    children?: ReactNode;
    sliderStatus: [number, Dispatch<SetStateAction<number>>];
    sliderMarginStatus: [number, Dispatch<SetStateAction<number>>];
    handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDrop: (e: React.DragEvent<HTMLDivElement>) => void,
    minBulletStatus: [number, Dispatch<SetStateAction<number>>];
    maxBulletStatus: [number, Dispatch<SetStateAction<number>>];
}


const Slider: FC<ISlider> = ({
    height = 40,
    handleDragOver = () => { },
    handleDrop = () => { },
    sliderStatus: [sliderWidth, setSliderWidth],
    sliderMarginStatus: [sliderMargin, setSliderMargin],
    minBulletStatus: [minBulletX, setMinBulletX],
    maxBulletStatus: [maxBulletX, setMaxBulletX],
    children,
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
                    value={minBulletX}
                    placeholder='Min'
                    onChange={(e) => {
                        setMinBulletX(e.target.value as unknown as number);
                    }}

                    onBlur={() => {
                        if (minBulletX > maxBulletX) {
                            setMinBulletX(maxBulletX);
                        }
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
                    value={maxBulletX}
                    placeholder='Max'
                    onChange={(e) => {

                        setMaxBulletX(e.target.value as unknown as number);
                    }}
                    onBlur={() => {
                        if (maxBulletX < minBulletX) {
                            setMaxBulletX(minBulletX);
                        }
                    }}
                />
            </div>

        </>

    );
}

export default Slider;

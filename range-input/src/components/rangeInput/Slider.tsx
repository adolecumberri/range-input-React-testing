import React, { Dispatch, FC, ReactNode, SetStateAction, useEffect, useLayoutEffect, useRef, useState } from 'react';


interface ISlider {
    height?: number;
    children?: ReactNode;
    sliderStatus:  [number, Dispatch<SetStateAction<number>>] ;
    handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDrop: (e: React.DragEvent<HTMLDivElement>) => void
}


const Slider: FC<ISlider> = ({
    height = 40,
    handleDragOver = () => {},
    handleDrop = () => {},
    sliderStatus: [sliderWidth, setSliderWidth],
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
            setSliderWidth(slDiv.offsetWidth);
        }

        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize);
    }, []);


    return (
        <>
        
            <div
                id="slider"
                ref={sliderDiv}
                style={{
                    borderBottom: `${height}px solid ${sliderColor}`,
                    width: "100%",
                    position: "relative"
                }}

                onDrop={e => handleDrop(e)}
                onDragOver={e => handleDragOver(e)}
            >
                {children}
            </div>
        </>

    );
}

export default Slider;

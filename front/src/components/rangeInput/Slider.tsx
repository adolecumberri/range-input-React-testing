import React, { Dispatch, FC, ReactNode, SetStateAction, useEffect, useRef } from 'react';


interface ISlider {
    children?: ReactNode;
    handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    height?: number;
    labelsEnabled: boolean;
    sliderStatus: [number, Dispatch<SetStateAction<number>>];
    sliderMarginStatus: [number, Dispatch<SetStateAction<number>>];
    maxBulletPriceStatus: [number, Dispatch<SetStateAction<number>>];
    maxBulletXStatus: [number, Dispatch<SetStateAction<number>>];
    minBulletPriceStatus: [number, Dispatch<SetStateAction<number>>];
    minBulletXStatus: [number, Dispatch<SetStateAction<number>>];
    priceBulletHandler: (newValue: number, bullet?: "min" | "max") => void;
    setSelectedBullet: Dispatch<SetStateAction<"min" | "max">>
}


const Slider: FC<ISlider> = ({
    children,
    handleDragOver = () => { },
    height = 40,
    labelsEnabled,
    sliderStatus: [sliderWidth, setSliderWidth],
    sliderMarginStatus: [sliderMargin, setSliderMargin],
    maxBulletPriceStatus: [maxBulletPrice, setMaxBulletPrice],
    maxBulletXStatus: [maxBulletX, setMaxBulletX],
    minBulletPriceStatus: [minBulletPrice, setMinBulletPrice],
    minBulletXStatus: [minBulletX, setMinBulletX],
    priceBulletHandler,
    setSelectedBullet,
}) => {

    const sliderColor = "#484848";
    const sliderDiv = useRef<HTMLDivElement>(null)

    /**
     * Actualizacion dinámica del slider Width.
     * al ser un evento de vanillaJS, no necesito array de dependencias activo.
     * La referencia al Setter del hook va a seguir siendo la misma. 
     * Hago referencias al DOM, por lo que seguira funcionando.
     * Si usase algún hook con algún estado simple etc, necesitaría actualizar esta funcion.
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
                        if (!isNaN(value as unknown as number) && labelsEnabled)
                            setMinBulletPrice(value as unknown as number);
                    }}
                    onBlur={(e) => {
                        priceBulletHandler(e.target.value as unknown as number);
                    }}
                    disabled={!labelsEnabled}
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
                        if (!isNaN(value as unknown as number) && labelsEnabled)
                            setMaxBulletPrice(value as unknown as number);
                    }}
                    onBlur={(e) => {
                        priceBulletHandler(e.target.value as unknown as number);
                    }}
                    disabled={!labelsEnabled}

                />
            </div>

        </>

    );
}

export default Slider;

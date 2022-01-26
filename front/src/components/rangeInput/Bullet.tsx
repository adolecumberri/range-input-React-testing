import React, { CSSProperties, FC } from 'react';

interface IBullet {
    size: number;
    position: number;
    [x: string]: any;

}

const Bullet: FC<IBullet> = ({ size, position, sliderMargin, setSelectedBullet, type }) => {

    const handleDragEnter = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedBullet(type);

    };

    const bulletStyle: CSSProperties = {
        border: "1px solid black",
        boxSizing: "border-box",
        position: "absolute",
    }

    return (<>
        <div
        data-testid={`bullet-${type}`}
            className="range-bullet range-bullet-hidden"
            style={{
                ...bulletStyle,
                width: size,
                height: size,
                marginLeft: position - (size / 2),
                opacity: 0,
                zIndex: 3,
            }}
            draggable
            onDragEnter={e => handleDragEnter(e)}
        >
        </div>

        <div
            className="range-bullet range-bullet-visible"
            style={{
                ...bulletStyle,
                width: size,
                height: size,
                marginLeft: position - (size / 2),
                backgroundColor: "white",
                zIndex: 2
            }}
            draggable
        >
        </div>

    </>
    );
}

export default Bullet;

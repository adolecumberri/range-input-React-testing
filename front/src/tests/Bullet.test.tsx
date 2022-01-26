import React, { useState } from "react";
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Bullet from '../components/rangeInput/Bullet';


describe('Bullet general test.', () => {
    it("renders correctly", () => {

        render(<Bullet
            position={0}
            setSelectedBullet={()=>{}}
            size={40}
            sliderMargin={0}
            type={"min"}

        />);

        expect(screen.getByTestId("bullet-min")).toBeTruthy();
    });
});



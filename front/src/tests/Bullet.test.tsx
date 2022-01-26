import React from "react";
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from "@testing-library/react";
import Bullet from '../components/rangeInput/Bullet';

import renderer from 'react-test-renderer';

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

    it("Bullet changes when hovered", () => {
        const component = renderer.create(<Bullet
            position={0}
            setSelectedBullet={()=>{}}
            size={40}
            sliderMargin={0}
            type={"min"}
        />);

        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

         // manually trigger the callback
         const data = {
           preventDefault: () => {},
           stopPropagation: () => {},
         };
        (tree as renderer.ReactTestRendererJSON[])[0].props.onDragEnter(data);

         // re-rendering
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();
        });
});


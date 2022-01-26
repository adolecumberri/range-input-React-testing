import React, { useState } from "react";
import '@testing-library/jest-dom/extend-expect';
import { act, render, screen } from "@testing-library/react";
import Range from '../components/Range';
import M from "../constants/messages";


describe('Navigation Renders', () => {

    test("Range input renders", () => {
        render(<Range testid='cents' step={0.01} value={{ max: 30, min: 20 }} />);
        expect(screen.getByTestId("cents")).toBeInTheDocument();

    });

    test("Range input without an array of values renders", () => {
        render(<Range
            testid='cents'
            value={[0.99, 1.99, 12.20, 22.40, 25.78, 99]}
            width={"80%"}
            labelsEnabled={true}
            range={{ max: 20, min: 30 }}
        />);
        expect(screen.getByTestId("cents")).toBeInTheDocument();
    });


    //!Test inacabado.
    test("Width update in the event.", () => {
        render(<Range step={0.01} value={{ max: 30, min: 20 }} />);
        window.resizeTo = jest.fn();
        act(() => {
            window.resizeTo(1024, 500);
        });

        expect(window.innerWidth).toBe(1024);
        // expect(screen.getByTestId("cents")).toBeInTheDocument();

        // act(() => {
        //     window.resizeTo(800, 500);
        // });

        // expect(window.innerWidth).toBe(800);
    });


    test("Range Input throw error by wrong values", () => {
        expect(() => render(<Range
            testid='cents' step={0.01} value={{ max: 20, min: 30 }}
        />)).toThrow(M.max_min_error);
        expect(() => render(<Range testid='cents' step={0.01} value={[]} />)).toThrow(M.array_length_error);
    });



});



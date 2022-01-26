import React from "react";
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen } from "@testing-library/react";

import userEvent from '@testing-library/user-event'

import { createMemoryHistory } from "history";
import { BrowserRouter } from "react-router-dom";
import { Router } from "react-router";

import Navigation from '../components/Navigation';


describe('Navigation Renders', () => {
    // const view = render(<BrowserRouter><Navigation /></BrowserRouter>);
    render(<BrowserRouter><Navigation /></BrowserRouter>);

    test("Navigation text is displayed", () => {

        // expect(view.container).toHaveTextContent("Exercice1");
        expect(screen.getAllByText(/exercice1/i)[0]).toBeTruthy();
        expect(screen.getAllByText(/exercice2/i)[0]).toBeTruthy();
    });


});

describe('Navigation clicks', () => {
    beforeEach(() => {
        //establezco la url inicial.
        global.window.location.pathname = "/";
    });

    test("clickeo exercice1 y cambia la url", () => {
        render(<BrowserRouter><Navigation /></BrowserRouter>);

        //get Element.
        expect(screen.getAllByText(/exercice1/i)[0]).toBeInTheDocument();
        //get link.
        const link1 = screen.getByText(/exercice1/i);
        //Click on link.
        userEvent.click(link1);
        //Check if url has changed.
        expect(global.window.location.pathname).toBe("/Exercice1");
    });


    test("clickeo exercice2 y cambia la url", () => {
        render(<BrowserRouter><Navigation /></BrowserRouter>);
        //get Element.
        expect(screen.getAllByText(/exercice2/i)[0]).toBeInTheDocument();
        //get link.
        const link = screen.getByText(/exercice2/i);
        //Click on link.
        userEvent.click(link);
        //Check if url has changed.
        expect(global.window.location.pathname).toBe("/Exercice2");
    });

});

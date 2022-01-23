import React from "react";
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen } from "@testing-library/react";


import { createMemoryHistory } from "history";
import { BrowserRouter } from "react-router-dom";
import { Router } from "react-router";

import Navigation from '../components/Navigation';
describe('Navigation Renders', () => {
    // const view = render(<BrowserRouter><Navigation /></BrowserRouter>);

    const view = render(<BrowserRouter><Navigation /></BrowserRouter>);
    test("Navigation text is displayed", () => {

        // expect(view.container).toHaveTextContent("Exercice1");
        screen.getByText("Exercice1");
        screen.getByText("Exercice2");
    });


});



 
describe('Navigation clicks', () => {
    test("clickeo exercice1", () => {
        const view = render(<BrowserRouter><Navigation /></BrowserRouter>);
    const history = createMemoryHistory();
       const link1 = screen.getByText("Exercice1");
        fireEvent.click(link1);
        expect(history.location.pathname).toBe("/Exercice1");
    });

    test("clickeo exercice2", () => {
        const view = render(<BrowserRouter><Navigation /></BrowserRouter>);
    const history = createMemoryHistory();
    
        const link2 = screen.getByText("Exercice2");
        fireEvent.click(link2);

        
        console.log(history.location.pathname);
        expect(history.location.pathname).toBe("/Exercice2");
    });
});

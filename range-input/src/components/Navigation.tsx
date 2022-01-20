import React, { FC } from 'react';

import { Link } from "react-router-dom";

const Navigation: FC = () => {
    return (
        
   <div> 
        <Link to="/Exercice1">Exercice1</Link> |{" "}
        <Link to="/Exercice2">Exercice2</Link>

   </div>
    );
}

export default Navigation;

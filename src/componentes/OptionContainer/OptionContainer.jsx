import React from "react";
import './OptionContainer.css'
import { Link } from 'react-router-dom'; 



function OptionContainer() {

    return (
        <div id="OptionContainer">
            <Link to="/guess" id="choose">
                <img src="https://i.postimg.cc/90rKgQqX/icon2.png" alt="olá" />
                <div id="container_text">
                    <p id="text">Guess the Character</p>
                </div>
            </Link>
        </div>
    )

}

export default OptionContainer
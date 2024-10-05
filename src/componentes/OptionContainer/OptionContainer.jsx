import React from "react";
import './OptionContainer.css'
import { Link } from 'react-router-dom'; 



function OptionContainer() {

    return (
        <div id="OptionContainer">
            <Link to="/guess" id="choose">
                <img src="https://cdn.discordapp.com/attachments/691418911580749835/1292110782376710144/icon2.png?ex=67028b70&is=670139f0&hm=d6f18787d25e2e39616d459872bc048c417bdfe364fc921598cb1ed773c2e990&" alt="olá" />
                <div id="container_text">
                    <p id="text">Guess the Character</p>
                </div>
            </Link>
        </div>
    )

}

export default OptionContainer
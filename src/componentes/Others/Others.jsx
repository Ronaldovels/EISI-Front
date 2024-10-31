import React from "react";
import './Others.css';

import { Link } from 'react-router-dom'; // Importar Link para navegação

function Others() {
    return (
        <main>
            <nav>
                <h1 id='home'>You may like too!</h1>
                <div id="links-container">
                    <Link to="https://kaijun8dle.vercel.app" id='link_sub'>
                        <p id='subtitle'>
                            <img src="https://res.cloudinary.com/dtnscijch/image/upload/v1730390271/icon_fpslvx.png" alt="" id="otherImg" />
                            KaijuN8dle
                        </p>
                    </Link>
                    <Link to="https://cotedle.vercel.app" id='link_sub'>
                        <p id='subtitle'>
                            <img src="https://res.cloudinary.com/dtnscijch/image/upload/v1730389710/icon_jbwaum.png" alt="" id="otherImg"/>
                            Cotedle
                        </p>
                    </Link>
                    <Link to="" id='link_sub'>
                        <p id='subtitle'>
                            <img src="https://res.cloudinary.com/dtnscijch/image/upload/v1730390665/icon_r563iz.png" alt="" id="otherImg"/>
                            BreakingBadle
                        </p>
                    </Link>
                </div>
            </nav>
        </main>
    )
}

export default Others
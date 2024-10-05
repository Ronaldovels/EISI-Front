import React from 'react';
import './HomeBanner.css'

import { Link } from 'react-router-dom'; // Importar Link para navegação


function Banner() {
    return (
            <main>
                <nav>
                    <Link to="/" id='link_title'>
                        <h1 id='home'>EMINENCEDLE</h1>
                    </Link>
                    <Link to="/" id='link_sub'>
                            <p id='subtitle'>In The Shadow, I Thrive</p>
                    </Link>
                    
                </nav>
                
            </main>
    )
}

export default Banner
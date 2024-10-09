
import React from 'react';
import './Home.css';
import Banner from '../../componentes/HomeBanner/HomeBanner'
import OptionContainer from '../../componentes/OptionContainer/OptionContainer';
import WelcomeMessage from '../../componentes/Disclaimer/Disclaimer';

function Home() {
  return (
    <div>
      <WelcomeMessage/>
      <Banner/>
      <section id='guessCharacter'>
        <OptionContainer/>
        </section>
    </div>
  )
}

export default Home;

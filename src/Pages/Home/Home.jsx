
import React from 'react';
import './Home.css';
import Banner from '../../componentes/HomeBanner/HomeBanner'
import OptionContainer from '../../componentes/OptionContainer/OptionContainer';
import WelcomeMessage from '../../componentes/Disclaimer/Disclaimer';
import Others from "../../componentes/Others/Others"

function Home() {
  return (
    <div>
      <WelcomeMessage/>
      <Banner/>
      <section id='guessCharacter'>
        <OptionContainer/>
        </section>
        <Others/>
    </div>
  )
}

export default Home;


import React from 'react';
import './Home.css';
import Banner from '../../componentes/HomeBanner/HomeBanner'
import OptionContainer from '../../componentes/OptionContainer/OptionContainer';

function Home() {
  return (
    <div>
      <Banner/>
      <section id='guessCharacter'>
        <OptionContainer/>
        </section>
    </div>
  )
}

export default Home;

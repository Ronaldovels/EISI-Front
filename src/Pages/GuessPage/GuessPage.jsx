import React from "react";
import './GuessPage.css'
import Banner from '../../componentes/HomeBanner/HomeBanner'
import GuessForm from '../../componentes/GuessForm/GuessForm'

function GuessPage() {
    
    return (
        <div id="bannerContaienr">
          <Banner/>
          <div id="guessFormContainer">
            <GuessForm/> 
          </div>
          
        </div>
      )

}

export default GuessPage
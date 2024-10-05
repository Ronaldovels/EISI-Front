
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home'
import GuessPage from './Pages/GuessPage/GuessPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/guess' element={<GuessPage/>}/>
      </Routes>
    </Router>
  )
}

export default App;

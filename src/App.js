// src/App.js
import React from 'react';
import Navbar from './components/Nav/NavBar';
import StickySide from './components/StickySide/StickySide';
import Main from './components/Main/Main';
import Landing from './components/Landing/Landing';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <div className="layout">
        <StickySide />
        <div className="content">
          <Main />
        </div>
      </div>
    </div>
  );
};

export default App;

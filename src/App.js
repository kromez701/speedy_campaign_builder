// src/App.js
import React from 'react';
import Navbar from './components/NavBar';
import StickySide from './components/StickySide';
import Main from './components/Main';
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

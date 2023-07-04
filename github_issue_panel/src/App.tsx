import React from 'react';
import './App.css';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Spinner from './components/Spinner';

function App() {
  return (
    <React.Fragment>
      <Header />
      <main>
        <MainContent />
      </main>
    </React.Fragment>
  );
}

export default App;

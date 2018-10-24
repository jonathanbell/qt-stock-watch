import React, { Component } from 'react';

import Navigation from './components/Navigation';
import PositionsList from './components/PositionsList';
import SearchBar from './components/SearchBar';

import './css/App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <h1>QT Stock Watch</h1>
        </header>
        <Navigation />
        <PositionsList />
        <SearchBar />
      </div>
    );
  }
}

export default App;

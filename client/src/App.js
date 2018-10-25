import React, { Component } from 'react';

import Navigation from './components/Navigation';
import SearchBar from './components/SearchBar';
import PositionsList from './components/PositionsList';
import WatchList from './components/WatchList';

import './css/App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <h1>QT Stock Watch</h1>
        </header>
        <Navigation />
        <SearchBar />
        <PositionsList />
        <WatchList />
      </div>
    );
  }
}

export default App;

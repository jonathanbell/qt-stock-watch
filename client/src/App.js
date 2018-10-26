import React, { Component } from 'react';

import Navigation from './components/Navigation';
import SearchBar from './components/SearchBar';
import PositionsList from './components/PositionsList';
import WatchList from './components/WatchList';

import './css/App.css';

class App extends Component {
  state = {
    watchlist: [],
    gettingWatchlist: false,
    watchListLoaded: false,
    apiError: false
  };

  getWatchlist = async () => {
    this.setState({ gettingWatchlist: true });
    const response = await fetch('/api/v1/watchlist').catch(err => {
      console.error(err);
      this.setState({
        apiError: true,
        gettingWatchlist: false,
        watchListLoaded: false
      });
    });
    const watchlist = await response.json();
    if (response.status !== 200) {
      throw Error(watchlist.message);
    }
    this.setState({
      gettingWatchlist: false,
      watchListLoaded: true,
      watchlist
    });
  };

  handleRemove = async symbolId => {
    const response = await fetch(`/api/v1/watchlist/remove/${symbolId}`, {
      method: 'delete'
    }).catch(err => console.error(err));
    const newWatchlist = await response.json();
    if (response.status !== 200) throw Error(newWatchlist.message);

    this.setState({
      watchlist: this.state.watchlist.filter(stock =>
        newWatchlist.includes(stock.symbolId.toString())
      )
    });
  };

  render() {
    return (
      <div className="App">
        <header>
          <h1>QT Stock Watch</h1>
        </header>
        <Navigation />
        <SearchBar
          watchlistState={this.state}
          getWatchlist={this.getWatchlist}
        />
        <PositionsList getWatchlist={this.getWatchlist} />
        <WatchList
          watchlistState={this.state}
          getWatchlist={this.getWatchlist}
          handleRemove={this.handleRemove}
        />
      </div>
    );
  }
}

export default App;

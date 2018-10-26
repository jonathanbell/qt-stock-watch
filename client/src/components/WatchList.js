import React, { Component } from 'react';
import { Alert, Button } from 'reactstrap';
import Stock from './Stock';

export default class WatchList extends Component {
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
      this.setState({ apiError: true });
      this.setState({ gettingWatchlist: false });
      this.setState({ watchListLoaded: false });
    });
    const watchlist = await response.json();
    if (response.status !== 200) {
      throw Error(watchlist.message);
    }
    this.setState({ gettingWatchlist: false });
    this.setState({ watchListLoaded: true });
    this.setState({ watchlist });
  };

  handleRemove = async symbolId => {
    // Make the API call to the server to remove the symbol from the watchlist
    const response = await fetch(`/api/v1/watchlist/remove/${symbolId}`, {
      method: 'delete'
    }).catch(err => console.error(err));
    const newWatchlist = await response.json();
    if (response.status !== 200) throw Error(newWatchlist.message);

    // Handle visually removing the "stock card"
    this.setState({
      watchlist: this.state.watchlist.filter(stock =>
        newWatchlist.includes(stock.symbolId.toString())
      )
    });
  };

  render() {
    const { watchlist } = this.state;
    return (
      <div>
        {!this.state.watchListLoaded &&
          !this.state.gettingWatchlist && (
            <Button onClick={this.getWatchlist} color="primary">
              Get Watchlist
            </Button>
          )}
        {this.state.gettingWatchlist && (
          <Alert color="info">
            Getting watchlist
            <img
              className="preload-icon"
              src="/img/preloader.gif"
              alt="preload icon"
            />
          </Alert>
        )}
        {this.state.apiError && (
          <Alert color="danger">
            There was an error while fetching the watchlist data. More details
            may be avaialble in the JavaScript console.
          </Alert>
        )}

        {this.state.watchListLoaded && <h2>Watch List</h2>}
        {this.state.watchListLoaded &&
          !watchlist.length && <p>Your watchlist is empty.</p>}
        <div className="search-results">
          {watchlist.map(stock => (
            <Stock
              key={stock.symbolId}
              handleRemove={this.handleRemove}
              watched={true}
              stock={stock}
            />
          ))}
        </div>
      </div>
    );
  }
}

import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import Stock from './Stock';

export default class WatchList extends Component {
  render() {
    console.log(this.props);
    const { watchlist } = this.props.watchlistState;
    return (
      <div>
        {this.props.watchlistState.gettingWatchlist && (
          <Alert color="info">
            Getting watchlist
            <img
              className="preload-icon"
              src="/img/preloader.gif"
              alt="preload icon"
            />
          </Alert>
        )}
        {this.props.watchlistState.apiError && (
          <Alert color="danger">
            There was an error while fetching the watchlist data. More details
            may be avaialble in the JavaScript console.
          </Alert>
        )}

        {this.props.watchlistState.watchListLoaded && (
          <h2 id="watch-list">Watch List</h2>
        )}
        {this.props.watchlistState.watchListLoaded &&
          !watchlist.length && <p>Your watchlist is empty.</p>}
        <div className="search-results">
          {watchlist.map(stock => (
            <Stock
              key={stock.symbolId}
              handleRemove={() => this.props.handleRemove(stock.symbolId)}
              watched={true}
              stock={stock}
            />
          ))}
        </div>
      </div>
    );
  }
}

import React, { Component } from 'react';
import { Alert, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import Stock from './Stock';

import '../css/SearchBar.css';

export default class SearchBar extends Component {
  state = {
    stockSymbolInput: '',
    stocks: [],
    searchResultsLoaded: false,
    searchResultsLoading: false,
    searchResults: 1
  };

  onStockSymbolSearchSubmit = async e => {
    e.preventDefault();
    const stocks = await this.getSearchResults(
      this.stockSymbolValue.value
    ).catch(err => console.error(err));
    this.setState({ stocks });
    this.setState({ searchResults: stocks.length });
  };

  getSearchResults = async prefix => {
    this.setState({ searchResultsLoading: true });
    const response = await fetch(`/api/v1/symbols/search/${prefix}`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    this.setState({ searchResultsLoading: false });
    this.setState({ searchResultsLoaded: true });
    return body;
  };

  // Controlled input for the stock search input
  updateInput = e => {
    this.setState({
      stockSymbolInput: e.target.value
        // no trailing whitespace
        //.trim()
        // limit of 12 chars
        .substring(0, 12)
        // all uppercase
        .toUpperCase()
    });
  };

  clearSearchResults = e => {
    this.setState({
      stockSymbolInput: '',
      stocks: [],
      searchResultsLoaded: false,
      searchResultsLoading: false,
      searchResults: 1
    });
  };

  handleAdd = async symbolId => {
    // Make the API call to the server to remove the symbol from the watchlist
    const response = await fetch(`/api/v1/watchlist/add/${symbolId}`, {
      method: 'post'
    }).catch(err => console.error(err));
    const newWatchlist = await response.json();
    if (response.status !== 200) throw Error(newWatchlist.message);

    // Handle visually removing the "stock card"
    // 1. Remove the card from the search results
    this.setState({
      stocks: this.state.stocks.filter(stock => stock.symbolId !== symbolId)
    });
    this.setState({ searchResults: this.state.stocks.length });
    // 2. Add the card to the watchlist by recalling `getWatchlist()`
    this.props.getWatchlist();
  };

  render() {
    const { stocks } = this.state;

    return (
      <div>
        <h2>Search for a Symbol</h2>
        <Form inline onSubmit={this.onStockSymbolSearchSubmit} className="mb-2">
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Label for="stockSymbolHardAss" className="mr-sm-2">
              Enter a stock symbol to search for:
            </Label>
            <Input
              innerRef={node => (this.stockSymbolValue = node)}
              value={this.state.stockSymbolInput}
              placeholder="STOCK.EX"
              id="stockSymbol"
              onChange={this.updateInput}
              type="text"
              name="stockSymbolHardAss"
            />
          </FormGroup>
          <Button className="ml-2" color="primary" type="submit">
            Submit
          </Button>
          {this.state.searchResultsLoaded &&
            !this.state.searchResultsLoading && (
              <Button
                className="ml-1"
                color="secondary"
                onClick={this.clearSearchResults}
              >
                Clear
              </Button>
            )}
        </Form>
        <div className="search-results">
          {this.state.searchResultsLoading && (
            <Alert className="alert" color="info">
              Getting data from Questrade
              <img
                className="preload-icon"
                src="/img/preloader.gif"
                alt="preload icon"
              />
            </Alert>
          )}
          {!this.state.searchResults &&
            !this.state.searchResultsLoading && (
              <Alert color="warning">No stocks found.</Alert>
            )}
          {stocks.map(stock => {
            if (stock.securityType === 'Stock') {
              let watched = false;
              this.props.watchlistState.watchlist.forEach(s => {
                if (s.symbolId.toString() === stock.symbolId.toString()) {
                  watched = 'watched';
                }
              });
              return (
                <Stock
                  key={stock.symbolId}
                  stock={stock}
                  watched={watched}
                  handleAdd={this.handleAdd}
                  getWatchlist={this.props.getWatchlist}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  }
}

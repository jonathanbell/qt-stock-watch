import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import '../css/SearchBar.css';

export default class SearchBar extends Component {
  state = {
    stockSymbolInput: ''
  };

  onStockSymbolSearchSubmit = e => {
    e.preventDefault();
    console.log(this.stockSymbolValue.value);
  };

  updateInput = e => {
    this.setState({
      stockSymbolInput: e.target.value
        .trim()
        .substring(0, 8)
        .toUpperCase()
    });
    console.log(e.target.value);
  };

  render() {
    return (
      <div>
        <h2>Search for a Symbol</h2>
        <Form inline onSubmit={this.onStockSymbolSearchSubmit}>
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
          <Button color="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

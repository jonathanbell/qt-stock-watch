import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

export default class SearchBar extends Component {
  render() {
    return (
      <Form inline>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <Label for="stockSymbol" className="mr-sm-2">
            Search for a stock
          </Label>
          <Input
            type="text"
            name="stockSymbol"
            id="stockSymbol"
            placeholder="STOCK.EX"
          />
        </FormGroup>
        <Button>Submit</Button>
      </Form>
    );
  }
}

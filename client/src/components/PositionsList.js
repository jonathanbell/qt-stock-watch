import React, { Component } from 'react';
import { Table } from 'reactstrap';
import PercentagesChart from './PercentagesChart';

export default class PositionsList extends Component {
  state = {
    positions: [],
    toggle: true
  };

  componentDidMount() {
    this.getPositions()
      .then(positions => {
        this.setState({ positions });
        console.log(positions);
      })
      .catch(err => console.error(err));
  }

  getPositions = async () => {
    const response = await fetch('/api/v1/positions');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  toggle = () => {
    this.setState({ toggle: !this.state.toggle });
  };

  render() {
    const { positions } = this.state;
    return (
      <div>
        <h2>Account Positions</h2>
        <Table responsive striped>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Quantity</th>
              <th>Purchase Price</th>
              <th>Current Price</th>
              <th>Dividend</th>
              <th>&#37; Profit/Loss</th>
              <th>&#36; Profit/Loss</th>
              <th>&#8693;</th>
              <th>Market</th>
            </tr>
          </thead>
          <tbody>
            {positions.map(position => (
              <tr
                key={position.symbolId}
                className={`${
                  position.averageEntryPrice >= position.currentPrice
                    ? 'text-danger'
                    : 'text-success'
                }`}
              >
                <td>{position.symbol}</td>
                <td>{position.openQuantity}</td>
                <td>${position.averageEntryPrice.toFixed(2)}</td>
                <td>${position.currentPrice.toFixed(2)}</td>
                <td>{position.dividend}</td>
                <td>{position.percentagePnl}</td>
                <td>
                  {`${position.openPnl > 0 ? '+' : ''}`}
                  {position.openPnl.toFixed(2)}
                </td>
                <td>
                  {position.averageEntryPrice >= position.currentPrice && (
                    <span>&darr;</span>
                  )}
                  {position.averageEntryPrice < position.currentPrice && (
                    <span>&uarr;</span>
                  )}
                </td>
                <td title={position.listingExchange}>
                  {position.currency === 'CAD' && (
                    <img src="/img/flag_canada.png" alt="Canadian flag" />
                  )}
                  {position.currency === 'USD' && (
                    <img src="/img/flag_usa.png" alt="American flag" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <PercentagesChart positions={this.state.positions} />
      </div>
    );
  }
}

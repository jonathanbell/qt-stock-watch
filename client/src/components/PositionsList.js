import React, { Component } from 'react';
import { Alert, Table } from 'reactstrap';
import PercentagesChart from './PercentagesChart';

export default class PositionsList extends Component {
  state = {
    positions: [],
    toggle: true,
    gettingQuesttradeData: true,
    questradeDataLoaded: false,
    apiError: false
  };

  async componentDidMount() {
    const positions = await this.getPositions().catch(err => {
      console.error(err);
      this.setState({ apiError: true });
      this.setState({ gettingQuesttradeData: false });
      this.setState({ questradeDataLoaded: false });
    });

    this.setState({ positions });
    this.props.getWatchlist();
  }

  getPositions = async () => {
    this.setState({ gettingQuesttradeData: true });
    const response = await fetch('/api/v1/positions');
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message);
    } else {
      this.setState({ gettingQuesttradeData: false });
      this.setState({ questradeDataLoaded: true });
    }
    return body;
  };

  render() {
    const { positions } = this.state;
    return (
      <div>
        <h2>Account Positions</h2>
        {this.state.gettingQuesttradeData && (
          <Alert color="info">
            Getting data from Questrade
            <img
              className="preload-icon"
              src="/img/preloader.gif"
              alt="preload icon"
            />
          </Alert>
        )}
        {this.state.apiError && (
          <Alert color="danger">
            There was an error while fetching the Questtrade data. More details
            may be avaialble in the JavaScript console.
          </Alert>
        )}
        {this.state.questradeDataLoaded && (
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
                  <td>
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href={`https://my.questrade.com/trading/quote/${
                        position.symbol
                      }`}
                    >
                      {position.symbol}
                    </a>
                  </td>
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
        )}
        {this.state.questradeDataLoaded && (
          <PercentagesChart positions={this.state.positions} />
        )}
      </div>
    );
  }
}

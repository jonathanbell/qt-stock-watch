import React, { Component } from 'react';

import '../css/PercentagesChart.css';

export default class PercentagesChart extends Component {
  render() {
    const positions = this.props.positions;
    return (
      <div className="percentage-graph mb-2 mt-2">
        {positions.map(position => (
          <div
            key={position.symbolId}
            style={{ width: `${position.percentageOfAccount.toFixed(3)}%` }}
            className="percentage-graph__data-point"
          >
            {position.symbol}
            <br />
            <span>({position.percentageOfAccount.toFixed(2)} %)</span>
          </div>
        ))}
      </div>
    );
  }
}

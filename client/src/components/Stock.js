import React, { Component } from 'react';
import { Card, CardHeader, CardBody, CardTitle, CardText } from 'reactstrap';

import '../css/Stock.css';

export default class Stock extends Component {
  render() {
    const { stock } = this.props;
    return (
      <Card>
        <CardHeader tag="h3">
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={`https://my.questrade.com/trading/quote/${stock.symbol}`}
          >
            {stock.symbol}
          </a>
        </CardHeader>
        {/* TODO: Add an image of the stock's history graph here via <CardImage></CardImage> */}
        <CardBody>
          {stock.prevDayClosePrice ? (
            <CardTitle>${stock.prevDayClosePrice.toFixed(2)}</CardTitle>
          ) : (
            <CardTitle>N/A</CardTitle>
          )}
          <CardText>{stock.description}</CardText>
          {stock.dividend > 0.5 && (
            <CardText>Dividend: {stock.dividend}</CardText>
          )}
          {stock.pe && (
            <CardText className={stock.pe < 5 ? 'text-success' : ''}>
              Price/Earnings Ratio: {stock.pe.toFixed(2)}
            </CardText>
          )}
          {stock.listingExchange && (
            <CardText>
              <small className="text-muted">
                Exchange: {stock.listingExchange}
              </small>
            </CardText>
          )}
        </CardBody>
      </Card>
    );
  }
}

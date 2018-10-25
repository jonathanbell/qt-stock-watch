import React, { Component } from 'react';
import { Card, CardBody, CardTitle, CardText, CardImg } from 'reactstrap';

import '../css/SearchResult.css';

export default class SearchResult extends Component {
  render() {
    const { stock } = this.props;
    const now = new Date();
    return (
      <Card>
        <CardImg
          top
          width="100%"
          //src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"
          src={`http://api.tradingphysics.com/getchart?type=pi&date=${now.getFullYear()}${(
            now.getMonth() + 1
          )
            .toString()
            .padStart(2, '0')}${(now.getDate() - 1)
            .toString()
            .padStart(
              2,
              '0'
            )}&indicators=MarketIndicator.$.Outstanding.Volume1&stock=${
            stock.symbol
          }&days=1`}
          alt={`Chart data for stock: ${stock.symbol}`}
        />
        <CardBody>
          <CardTitle>
            <a href="https://my.questrade.com/trading/quote/THC.CN">
              {stock.symbol}
            </a>
          </CardTitle>
          <CardText>{stock.description}</CardText>
          <CardText>Dividend: {stock.dividend}</CardText>
          <CardText>
            <small className="text-muted">fjaskdjflkds</small>
          </CardText>
        </CardBody>
      </Card>
    );
  }
}

// {
//   "symbol": "BMO",
//   "symbolId": 9292,
//   "prevDayClosePrice": 78.36,
//   "highPrice52": 84.71,
//   "lowPrice52": 73.79,
//   "averageVol3Months": 555230,
//   "averageVol20Days": 726672,
//   "outstandingShares": 640057000,
//   "eps": 6.143,
//   "pe": 12.79316,
//   "dividend": 0.74026,
//   "yield": 3.7696,
//   "exDate": "2018-10-31T00:00:00.000000-04:00",
//   "marketCap": 50276449400,
//   "tradeUnit": 1,
//   "optionType": null,
//   "optionDurationType": null,
//   "optionRoot": "",
//   "optionContractDeliverables": {
//   "underlyings": [],
//   "cashInLieu": 0
//   },
//   "optionExerciseType": null,
//   "listingExchange": "NYSE",
//   "description": "Bank Of Montreal ",
//   "securityType": "Stock",
//   "optionExpiryDate": null,
//   "dividendDate": "2018-11-27T00:00:00.000000-05:00",
//   "optionStrikePrice": null,
//   "isTradable": true,
//   "isQuotable": true,
//   "hasOptions": true,
//   "currency": "USD",
//   "minTicks": [
//   {
//   "pivot": 0,
//   "minTick": 0.0001
//   },
//   {
//   "pivot": 1,
//   "minTick": 0.01
//   }
//   ],
//   "industrySector": "FinancialServices",
//   "industryGroup": "Banks",
//   "industrySubgroup": "BanksGlobal"
//   }

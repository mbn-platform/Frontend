import React from 'react';
import { getOrderBook, getTicker} from '../api/bittrex/bittrex';
import { formatFloat } from '../generic/util';
import { Desktop } from '../generic/MediaQuery';
import {sortData, onColumnSort}  from '../generic/terminalSortFunctions';

class OrderBook extends React.Component {

  constructor(props) {
    super(props);
    this.state = {buy: [], sell: [], last: '', sort: {}};
    this.sortData = sortData.bind(this);
    this.onColumnSort = onColumnSort.bind(this);
    this.sortFunctions = {
      price: (a, b) => formatFloat(a.Rate, this.props.market.split('-')[0] === 'BTC') - formatFloat(b.Rate, this.props.market.split('-')[0] === 'BTC'),
      relativeSize: (a, b) => formatFloat(a.Rate * a.Quantity) - formatFloat(b.Rate * b.Quantity)
    };    
  }


  componentDidMount() {
    this.interval = setInterval(this.updateOrderBook.bind(this), 5000);
    this.updateOrderBook();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateOrderBook() {
    getOrderBook(this.props.market, 'both').then(json => {
      if(json.success) {
        let {buy, sell} = json.result;
        buy = buy.slice(0, 100);
        sell = sell.slice(0, 100);
        sell.reverse();
        const maxBuy = buy.reduce((accum, value) => Math.max(accum, value.Quantity), 0);
        const maxSell = sell.reduce((accum, value) => Math.max(accum,value.Quantity), 0);
        const minBuy = buy.reduce((accum, value) => Math.min(accum, value.Quantity), maxBuy);
        const minSell = sell.reduce((accum, value) => Math.min(accum, value.Quantity), maxSell);
        buy.forEach(order => order.relativeSize = relativeSize(minBuy, maxBuy, order.Quantity));
        sell.forEach(order => order.relativeSize = relativeSize(minSell, maxSell, order.Quantity));
        this.setState({buy, sell});
        if(this.tableSell.scrollTop == 0) {
          this.tableSell.scrollTop = this.tableSell.scrollHeight - 26.6;          
        }

      }
    }).catch(err => console.log('error updating order book', err));
    getTicker(this.props.market).then(json => {
      this.setState({last: json.result.Last});
    });
  }

  render() {
    console.log(this.props.market);
    const isBTC = this.props.market.split('-')[0] === 'BTC';
    console.log(isBTC);
    let sortedDataSell = [];
    let sortedDataBuy = [];
    if(this.state.sell.length) {
      sortedDataSell = this.sortData(this.state.sell);  
    }
    
    if(this.state.buy.length) {
      sortedDataBuy = this.sortData(this.state.buy);  
    }

    return (
      <div className="orderbook-table chart col-12 col-sm-6 col-md-12">
        <div className="chart__top justify-content-between row">
          <div className="chart-name">Order Book</div>
          <Desktop>
            <div className="chart-controls align-items-center justify-content-between row">
              <div className="control-resize"></div>
              <div className="control-dash"></div>
            </div>
          </Desktop>
        </div>
        <div className="orderbook-table-wrapper js-table-wrapper" ref={elem => this.tableSell = elem}>
          <table className="table red">
            <thead>
              <tr>
                <th onClick={() => this.onColumnSort('price')}>
                  <div>Price <span className="icon-dir icon-down-dir"></span></div>
                </th>
                <th onClick={() => this.onColumnSort('Quantity')}>
                  <div>Size <span className="icon-dir icon-down-dir"></span></div>
                </th>
                <th onClick={() => this.onColumnSort('relativeSize')}>
                  <div>Total <span className="icon-dir icon-down-dir"></span></div>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="tbody">
              {sortedDataSell.map((order, i) => (
                <BuyOrderCell
                  isBTC={isBTC}
                  key={i}
                  price={order.Rate}
                  size={order.Quantity}
                  relativeSize={order.relativeSize}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="value row up">
          <span>{formatFloat(this.state.last)}</span>
          <span className="icon icon-dir icon-up-dir"></span>
        </div>
        <div className="orderbook-table-wrapper js-table-wrapper">
          <table className="table green">
            <tbody>
              {sortedDataBuy.map((order, i) => (
                <BuyOrderCell
                  isBTC={isBTC}
                  key={i}
                  price={order.Rate}
                  size={order.Quantity}
                  relativeSize={order.relativeSize}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

    );
  }
}

function relativeSize(minSize, maxSize, size) {
  return Math.max((size - minSize) / (maxSize - minSize), 0.02);
}

const BuyOrderCell = ({price, size, relativeSize, isBTC} ) => {
  const sizeParts = formatFloat(size).split('.');
  return (
    <tr>
      <td>{formatFloat(price, isBTC)}</td>
      <td>
        <span className="white">{sizeParts[0]}.</span>
        <span>{sizeParts[1]}</span>
      </td>
      <td>
        {formatFloat(price * size)}
      </td>
      <td>
        <span className="dash" style={{width: relativeSize * 100 + '%'}}/>
      </td>
    </tr>
  );
};


export default OrderBook;

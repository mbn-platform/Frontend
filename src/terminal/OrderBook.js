import React from 'react';
import { getOrderBook, getTicker} from '../api/bittrex/bittrex';
import { formatFloat } from '../generic/util';
import { Desktop } from '../generic/MediaQuery';
import {sortData, onColumnSort, classNameForColumnHeader}  from '../generic/terminalSortFunctions';
import classNames from 'classnames';

class OrderBook extends React.Component {

  constructor(props) {
    super(props);
    this.state = {buy: [], sell: [], last: null, sort: {}, prelast: null, scroll: false};
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

  componentWillReceiveProps(nextProps) {
    if(nextProps.market !== this.props.market) {
      this.setState({prelast: null, last: null});
      clearInterval(this.interval);
      this.interval = setInterval(this.updateOrderBook.bind(this), 5000);
      this.updateOrderBook(nextProps.market);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.market === this.props.market && nextState === this.state) {
      return false;
    } else {
      return true;
    }
  }

  updateOrderBook(market) {
    market = market || this.props.market;
    getOrderBook(market, 'both').then(json => {
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
        if(this.tableSell.scrollTop == 0 && !this.state.scroll) {
          this.setState({scroll: true})
          this.tableSell.scrollTop = this.tableSell.scrollHeight - 26.6;
        }

      }
    }).catch(err => console.log('error updating order book', err));
    getTicker(this.props.market).then(json => {
      this.setState(state => {
        return {last: json.result.Last, prelast: state.last};
      });
    });
  }

  render() {
    const isBTC = this.props.market.split('-')[0] === 'BTC';
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
                  <div>Price <span className={classNameForColumnHeader(this.state, 'price')}></span></div>
                </th>
                <th onClick={() => this.onColumnSort('Quantity')}>
                  <div>Size <span className={classNameForColumnHeader(this.state, 'Quantity')}></span></div>
                </th>
                <th onClick={() => this.onColumnSort('relativeSize')}>
                  <div>Total <span className={classNameForColumnHeader(this.state, 'relativeSize')}></span></div>
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
        {this.renderLastPrice()}
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

  renderLastPrice(price) {
    let isUp;
    if(this.state.prelast && this.state.prelast > this.state.last) {
      isUp = false;
    } else {
      isUp = true;
    }
    return (
      <div className={classNames('value', 'row', isUp ? 'up' : 'down')}>
        <span>{formatFloat(this.state.last)}</span><span className={classNames('icon', 'icon-dir', isUp ? 'icon-up-dir' : 'icon-down-dir')}> </span>
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

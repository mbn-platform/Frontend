import React from 'react';
import { getOrderBook, getTicker} from '../api/bittrex/bittrex';
import { formatFloat } from '../generic/util';
import { Desktop } from '../generic/MediaQuery';
import {sortData, onColumnSort, classNameForColumnHeader}  from '../generic/terminalSortFunctions';
import classNames from 'classnames';

class OrderBook extends React.Component {

  constructor(props) {
    super(props);
    this.state = {last: null, sort: {}, prelast: null, scroll: false};
    this.sortData = sortData.bind(this);
    this.onColumnSort = onColumnSort.bind(this);
    this.fireOnScroll = this.fireOnScroll.bind(this);    
    this.sortFunctions = {
      price: (a, b) => formatFloat(a.Rate, this.props.market.split('-')[0] === 'BTC') - formatFloat(b.Rate, this.props.market.split('-')[0] === 'BTC'),
      relativeSize: (a, b) => formatFloat(a.Rate * a.Quantity) - formatFloat(b.Rate * b.Quantity)
    };
  }

  fireOnScroll() {
    this.setState({scroll: true})
    this.tableSell.removeEventListener('scroll', this.fireOnScroll);
  }

  componentDidMount() {
    this.tableSell.addEventListener('scroll', this.fireOnScroll);
  }

  componentDidUpdate() {
    if(this.tableSell && this.tableSell.scrollTop == 0 && !this.state.scroll) {
      this.tableSell.scrollTop = this.tableSell.scrollHeight - 26.6;
    }               

  }

  componentWillUnmount() {
    this.tableSell.removeEventListener('scroll', this.fireOnScroll);
    clearInterval(this.interval);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.market !== this.props.market) {
      this.setState({prelast: null});
    }
    if(nextProps.ticker !== this.props.ticker) {
      this.setState({prelast: this.props.ticker.last});
    }
    if(nextProps.orderBook !== this.props.orderBook) {
      const { sell, buy } = nextProps.orderBook;
      const maxBuy = buy.reduce((accum, value) => Math.max(accum, value.Quantity), 0);
      const maxSell = sell.reduce((accum, value) => Math.max(accum,value.Quantity), 0);
      const minBuy = buy.reduce((accum, value) => Math.min(accum, value.Quantity), maxBuy);
      const minSell = sell.reduce((accum, value) => Math.min(accum, value.Quantity), maxSell);
      buy.forEach(order => order.relativeSize = relativeSize(minBuy, maxBuy, order.Quantity));
      sell.forEach(order => order.relativeSize = relativeSize(minSell, maxSell, order.Quantity));    
    }
  }

  render() {
    const currency = this.props.market.split('-')[0];
    const isBTC = currency === 'BTC' || currency === 'ETH';
    let sortedDataSell = [];
    let sortedDataBuy = [];
    const { sell, buy } = this.props.orderBook;
    if(sell.length) {
      sortedDataSell = this.sortData(sell);
      if(sortedDataSell === sell) {
        sortedDataSell = sell.slice(0, 50).reverse();
      } else {
        sortedDataSell = sortedDataSell.slice(0, 50);
      }
    }

    if(buy.length) {
      sortedDataBuy = this.sortData(buy).slice(0, 50);
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
                  <div>Total ({currency}) <span className={classNameForColumnHeader(this.state, 'relativeSize')}></span></div>
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
    const last = this.props.ticker.last;
    const prelast = this.state.prelast;
    if(prelast && last && prelast > last) {
      isUp = false;
    } else {
      isUp = true;
    }
    return (
      <div className={classNames('value', 'row', isUp ? 'up' : 'down')}>
        <span>{formatFloat(last, true)}</span><span className={classNames('icon', 'icon-dir', isUp ? 'icon-up-dir' : 'icon-down-dir')}> </span>
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
        {formatFloat(price * size, isBTC)}
      </td>
      <td>
        <span className="dash" style={{width: relativeSize * 100 + '%'}}/>
      </td>
    </tr>
  );
};


export default OrderBook;

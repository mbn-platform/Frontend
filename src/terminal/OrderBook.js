import React from 'react';
import { getOrderBook } from '../api/bittrex/bittrex';

class OrderBook extends React.Component {

  constructor(props) {
    super(props);
    this.state = {buy: [], sell: []};
  }


  componentDidMount() {
    this.interval = setInterval(this.updateOrderBook.bind(this), 5000);
    this.updateOrderBook();
  }

  updateOrderBook() {
    getOrderBook(this.props.market, 'both').then(json => {
      if(json.success) {
        const {buy, sell} = json.result;
        this.setState({buy: buy.slice(0, 100), sell: sell.slice(0, 100)});
      }
    }).catch(err => console.log('error updating order book', err));
  }

  render() {
    return (
      <div className="orderbook-table chart col-12 col-sm-6 col-md-12">
        <div className="chart__top justify-content-between row">
          <div className="chart-name">Order Book</div>
          <div className="chart-controls align-items-center justify-content-between row">
            <div className="control-resize"></div>
            <div className="control-dash"></div>
          </div>
        </div>
        <div className="orderbook-table-wrapper js-table-wrapper">
          <table className="table red">
            <thead>
              <tr>
                <th>
                  <div>Price <span className="icon-dir icon-down-dir"></span></div>
                </th>
                <th>
                  <div>Size <span className="icon-dir icon-down-dir"></span></div>
                </th>
                <th>
                  <div>Total <span className="icon-dir icon-down-dir"></span></div>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="tbody">
              {this.state.buy.map((order, i) => (
                <BuyOrderCell
                  key={i}
                  price={order.Rate}
                  size={order.Quantity}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="value row up">
          <span>0.216</span>
          <span className="icon icon-dir icon-up-dir"></span>
        </div>
        <div className="orderbook-table-wrapper js-table-wrapper">
          <table className="table green">
            <tbody>
              {this.state.sell.map((order, i) => (
                <BuyOrderCell
                  key={i}
                  price={order.Rate}
                  size={order.Quantity}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

    );
  }
}

const BuyOrderCell = ({price, size} ) => {
  const sizeParts = size.toString().split('.');
  return (
    <tr>
      <td>{price}</td>
      <td>
        <span className="white">{sizeParts[0]}.</span>
        <span>{sizeParts[1]}</span>
      </td>
      <td>
        32161
      </td>
      <td>
        <span className="dash"></span>
      </td>
    </tr>
  );
};


export default OrderBook;

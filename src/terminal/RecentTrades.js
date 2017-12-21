import React from 'react';
import classNames from 'classnames';
import { getMarketHistory } from '../api/bittrex/bittrex';
import { formatFloat } from '../generic/util';
import { Desktop } from '../generic/MediaQuery';

class RecentTrades extends React.Component {

  constructor(props) {
    super(props);
    this.state = {history: []};
  }

  componentDidMount() {
    this.interval = setInterval(this.updateHistory.bind(this), 12000);
    this.updateHistory();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateHistory() {
    getMarketHistory(this.props.market).then(json => {
      if(json.success) {
        this.setState({history: json.result});
      }
    }).catch(err => console.log('error updating  history', err));
  }
  render() {
    return (
      <div className="trades-table chart col-12 col-sm-6 col-md-12">
        <div className="chart__top justify-content-between row">
          <div className="chart-name">Recent Trades</div>
          <Desktop>
            <div className="chart-controls align-items-center justify-content-between row">
              <div className="control-resize"></div>
              <div className="control-dash"></div>
            </div>
          </Desktop>
        </div>

        <div className="trades-table-wrapper js-table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>

                  <div>Price ({this.props.market.split('-')[0]}) <span className="icon-dir icon-down-dir"></span></div>
                </th>
                <th>
                  <div>Trade Size <span className="icon-dir icon-down-dir"></span></div>
                </th>
                <th >
                  <div>Time <span className="icon-dir icon-down-dir"></span></div>
                </th>
                <th>

                </th>
              </tr>
            </thead>
            <tbody className="tbody">
              {this.state.history.map((order, index) => (
                <OrderHistoryRow
                  key={order.Id}
                  price={order.Price}
                  size={order.Quantity}
                  type={order.OrderType}
                  date={new Date(order.TimeStamp)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const OrderHistoryRow = ({type, date, price, size}) => {
  const isSellOrder = type === 'SELL';
  return (
    <tr className={isSellOrder ? 'down' : 'up'}>
      <td>
        {formatFloat(price)} <span className={classNames('icon', 'icon-dir',
          isSellOrder ? 'icon-up-dir' : 'icon-down-dir')}></span>
      </td>
      <td>
        {formatFloat(size)}
      </td>
      <td>
        {date.toLocaleTimeString()}
      </td>
      <td>
        {isSellOrder ? 'S' : 'B'}
      </td>
    </tr>
  );
};

export default RecentTrades;

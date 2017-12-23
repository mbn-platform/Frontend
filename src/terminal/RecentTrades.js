import React from 'react';
import classNames from 'classnames';
import { getMarketHistory } from '../api/bittrex/bittrex';
import { formatFloat } from '../generic/util';
import { Desktop } from '../generic/MediaQuery';

class RecentTrades extends React.Component {

  constructor(props) {
    super(props);
    this.state = {history: [], currentSortColumn: '', direction: 'down', dateSort: false, currency: this.props.market.split('-')[0]};
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
        this.setState({history: json.result, currency: this.props.market.split('-')[0]})
        this.sortColumn()
      }
    }).catch(err => console.log('error updating  history', err));
  }
  sortColumn(e, type, dtSort) {
    let target = null;
    if(e && e.currentTarget) {
      target = e.currentTarget
    }
    this.setState(state => {
      const history = state.history;
      let currentSortColumn = type || state.currentSortColumn;
      let dateSort = state.dateSort || dtSort;
      if(!currentSortColumn) {
        return {history}
      } 
      let direction = state.direction     
      if(target) {
        target.className = target.className == '-sort-asc' ? '-sort-desc' : '-sort-asc';
        direction = target.className == '-sort-desc' ? 'up' : 'down';
      }
      if(dateSort) {
        history.sort((h1,h2) => direction ==  'down' ? new Date(h2[currentSortColumn]) - new Date(h1[currentSortColumn]) : new Date(h1[currentSortColumn]) - new Date(h2[currentSortColumn]))  

      } else {
        history.sort((h1,h2) => direction ==  'down' ? h2[currentSortColumn] - h1[currentSortColumn] : h1[currentSortColumn] - h2[currentSortColumn])  
        dateSort = false;
      }
      return {history, currentSortColumn, direction, dateSort};
    });
  }

  render() {
    const isBTC = this.state.currency === 'BTC';
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
                <th onClick={(e) => this.sortColumn(e, 'Price')} className='-sort-asc'>
                  <div>Price ({this.state.currency}) <span className="icon-dir"></span></div>
                </th>
                <th  onClick={e => this.sortColumn(e, 'Quantity')} className='-sort-asc'>
                  <div>Trade Size <span className="icon-dir"></span></div>

                </th>
                <th  onClick={(e) => this.sortColumn(e, 'TimeStamp', true)} className='-sort-asc'>
                  <div>Time <span className="icon-dir"></span></div>
                </th>
                <th>

                </th>
              </tr>
            </thead>
            <tbody className="tbody" ref= {ele => {this.tbody = ele}}>
              {this.state.history.map((order, index) => (
                <OrderHistoryRow

                  key={order.Id}
                  isBTC={isBTC}
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

const OrderHistoryRow = ({type, date, price, size, isBTC}) => {
  const isSellOrder = type === 'SELL';
  return (
    <tr className={isSellOrder ? 'down' : 'up'}>
      <td>
        {formatFloat(price, isBTC)} <span className={classNames('icon', 'icon-dir',
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

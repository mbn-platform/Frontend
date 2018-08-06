import React from 'react';
import classNames from 'classnames';
import { formatFloat } from '../../generic/util';
import { Desktop } from '../../generic/MediaQuery';
import {sortData, onColumnSort, classNameForColumnHeader}  from '../../generic/terminalSortFunctions';
import {BigNumber} from 'bignumber.js';
import { FormattedMessage } from 'react-intl';

class RecentTrades extends React.Component {

  constructor(props) {
    super(props);
    this.state = {history: [], sort: {}};
    this.sortData = sortData.bind(this);
    this.onColumnSort = onColumnSort.bind(this);
    this.sortFunctions = {};
  }


  render() {
    let sortedData = [];
    const history = this.props.history;
    if(history && history.length) {
      sortedData = this.sortData(history);
    }
    const [base, secondary] = this.props.market.split('-');
    return (
      <div className="trades-table chart col-12 col-sm-6 col-md-12">
        <div className="chart__top justify-content-between row">
          <div className="chart-name">
            <FormattedMessage id="terminal.recentTrades"
              defaultMessage="Recent Trades"/>
          </div>
          <Desktop>
            <div className="chart-controls align-items-center justify-content-between row">
            </div>
          </Desktop>
        </div>

        <div className="trades-table-wrapper js-table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th onClick={() => this.onColumnSort('Price')}>
                  <div><FormattedMessage id="terminal.priceRecent"
                    defaultMessage="Price ({base})" values={{base}}/>
                  <span className={classNameForColumnHeader(this.state, 'Price')}/></div>
                </th>
                <th onClick={() => this.onColumnSort('Quantity')}>
                  <div>
                    <FormattedMessage id="terminal.tradeSize"
                      defaultMessage="Trade Size ({secondary})" values={{secondary}}/>
                    <span className={classNameForColumnHeader(this.state, 'Quantity')}/></div>
                </th>
                <th  onClick={() => this.onColumnSort('TimeStamp')}>
                  <div>
                    <FormattedMessage id="terminal.time"
                      defaultMessage="Time" />
                    <span className={classNameForColumnHeader(this.state, 'TimeStamp')}/></div>
                </th>
                <th>

                </th>
              </tr>
            </thead>
            <tbody className="tbody">
              {sortedData.map(order => (
                <OrderHistoryRow
                  key={order.id}
                  price={order.price}
                  size={order.amount}
                  type={order.type}
                  date={new Date(order.dt)}
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
    <tr className={isSellOrder ? 'up' : 'down'}>
      <td>
        {BigNumber(price).toString(10)} <span className={classNames('icon', 'icon-dir',
          isSellOrder ? 'icon-down-dir' : 'icon-up-dir')}/>
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

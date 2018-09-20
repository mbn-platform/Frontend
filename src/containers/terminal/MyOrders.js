import React from 'react';
import classNames from 'classnames';
import $ from 'jquery';
import { Desktop } from '../../generic/MediaQuery';
import { OpenOrder, CompletedOrder } from '../../components/OrdersStatements';
import {sortData, onColumnSort, classNameForColumnHeader}  from '../../generic/terminalSortFunctions';
import { FormattedMessage } from 'react-intl';

const TAB_OPEN_ORDERS = 0;
const TAB_COMPLETED_ORDERS = 1;

class MyOrders extends React.Component {

  constructor(props) {
    super(props);
    this.state = {tab: TAB_OPEN_ORDERS, sort: {}};
    this.onTabClick = this.onTabClick.bind(this);
    this.onColumnSort = onColumnSort.bind(this);
    this.sortData = sortData.bind(this);
    this.sortFunctions = {};
  }

  onTabClick(tab) {
    if(this.state.tab !== tab) {
      this.setState({tab});
      $('.js-table-wrapper table').floatThead('reflow');
    }
  }

  render() {
    let data = this.state.tab === TAB_OPEN_ORDERS ? this.props.orders.open : this.props.orders.closed;
    data = data.filter(o => o.symbol === this.props.market);
    const sortedData = this.sortData(data);
    console.warn(this.state.tab === TAB_OPEN_ORDERS);

    return (
      <div className="orders-table chart col-12 col-sm-6 col-md-12 col-lg-6">
        <div className="orders-table__top justify-content-between row col-12">
          <div className="orders-table__switch-wrap ">
            <span
              onClick={() => this.onTabClick(TAB_OPEN_ORDERS)}
              className={classNames('orders-table__switch', 'orders-open', {active: this.state.tab === TAB_OPEN_ORDERS})}>
              <FormattedMessage id="terminal.openOrders" defaultMessage="Open Orders"/>
            </span>
            <span
              onClick={() => this.onTabClick(TAB_COMPLETED_ORDERS)}
              className={classNames('orders-table__switch', 'orders-completed', {active: this.state.tab === TAB_COMPLETED_ORDERS})}>
              <FormattedMessage id="terminal.completedOrders" defaultMessage="Completed orders"/>
            </span>
          </div>
          <Desktop>
            <div className="chart-controls align-items-center justify-content-between row">
            </div>
          </Desktop>
        </div>
        <div className="orders-table-tabs">
          {this.state.tab === TAB_OPEN_ORDERS ? (
            <div className={classNames('orders-table-tab', 'orders-open', 'active')}>
              <div className="orders-table-wrapper js-table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th onClick={() => this.onColumnSort('type')}>
                        <FormattedMessage id="terminal.type" defaultMessage="Type"/>
                        <span className={classNameForColumnHeader(this.state, 'type')}/></th>
                      <th onClick={() => this.onColumnSort('limit')}>
                        <FormattedMessage id="terminal.priceForTable" defaultMessage="Price"/>
                        <span className={classNameForColumnHeader(this.state, 'limit')}/></th>
                      <th onClick={() => this.onColumnSort('filled')}>
                        <FormattedMessage id="terminal.unitsFilled" defaultMessage="Units Filled"/>
                        <span className={classNameForColumnHeader(this.state, 'filled')}/></th>
                      <th onClick={() => this.onColumnSort('amount')}>
                        <FormattedMessage id="terminal.unitsTotal" defaultMessage="Units Total"/>
                        <span className={classNameForColumnHeader(this.state, 'amount')}/></th>
                      <th onClick={() => this.onColumnSort('price')}>
                        <span><FormattedMessage id="terminal.est" defaultMessage="Est."/></span>
                        <FormattedMessage id="terminal.total" defaultMessage="Total"/>
                        <span className={classNameForColumnHeader(this.state, 'price')}/></th>
                      <th/>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={''}>
                      {false ?
                        <td className="text-capitalize">
                          <span className="round"/>
                        </td> :
                        <td>
                          <div className="round-wrapper">
                            <span className="round center"/>
                          </div>
                        </td>
                      }
                      {false && <td>{new Date('Wed Sep 19 2018 15:20:43 GMT+0300')}</td>}
                      {false && <td>{'asd' + '/' + 'asd'}</td>}
                      <td>{1231231231231223}</td>
                      <td>{1232}</td>
                      <td>{219}</td>
                      <td className="ellipsis-cell">{0.0412}</td>
                      <td onClick={() => this.props.cancelOrder('asd')}><span className="remove"/></td>
                    </tr>
                    {sortedData.map(o => (
                      <OpenOrder
                        onOrderCancel={() => this.props.cancelOrder(o)}
                        key={o._id}
                        isFullScreen={false}
                        order={o}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          ) : (
            <div className={classNames('orders-table-tab', 'orders-completed', 'active')}>

              <div className="orders-table-wrapper js-table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th onClick={() => this.onColumnSort('type')}>
                        <FormattedMessage id="terminal.type" defaultMessage="Type"/>
                        <span className={classNameForColumnHeader(this.state, 'type')}/></th>
                      <th onClick={() => this.onColumnSort('limit')}>
                        <FormattedMessage id="terminal.priceForTable" defaultMessage="Price"/>
                        <span className={classNameForColumnHeader(this.state, 'limit')}/></th>
                      <th onClick={() => this.onColumnSort('filled')}>
                        <FormattedMessage id="terminal.unitsFilled" defaultMessage="Units Filled"/>
                        <span className={classNameForColumnHeader(this.state, 'filled')}/></th>
                      <th onClick={() => this.onColumnSort('amount')}><FormattedMessage id="terminal.unitsTotal" defaultMessage="Units Total"/>
                        <span className={classNameForColumnHeader(this.state, 'amount')}/></th>
                      <th onClick={() => this.onColumnSort('price')}>
                        <span><FormattedMessage id="terminal.est" defaultMessage="Est."/></span>
                        <FormattedMessage id="terminal.total" defaultMessage="Total"/>
                        <span className={classNameForColumnHeader(this.state, 'price')}/></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map(o => (
                      <CompletedOrder
                        key={o._id}
                        isFullScreen={false}
                        order={o}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}
        </div>

      </div>
    );
  }
}

export default MyOrders;

import React from 'react';
import classNames from 'classnames';
import ReactTable from '../../components/SelectableReactTable';
import { formatFloat } from '../../generic/util';
import { Desktop } from '../../generic/MediaQuery';
import {sortData, onColumnSort, classNameForColumnHeader}  from '../../generic/terminalSortFunctions';
import {BigNumber} from 'bignumber.js';
import { FormattedMessage, injectIntl } from 'react-intl';

class RecentTrades extends React.Component {

  constructor(props) {
    super(props);
    this.state = {history: [], sort: {}, tableHeight: 200};
    this.sortData = sortData.bind(this);
    this.onColumnSort = onColumnSort.bind(this);
    this.sortFunctions = {};
    this.tableWrapper = React.createRef();
  }

  componentDidMount() {
    this.setState({tableHeight: this.tableWrapper.current.offsetHeight + 130});
  }

  getColumns = () => {
    const [base, secondary] = this.props.market.split('-');
    return [
      {
        Header: <div onClick={() => this.onColumnSort('Price')}
          className="terminal__header-wrapper">
          <FormattedMessage id="terminal.priceRecent"
            defaultMessage="Price ({base})" values={{base}}/>
          <span className={classNameForColumnHeader(this.state, 'Price')}/>
        </div>,
        minWidth: 110,
        className: 'table_col_value upper table_bot_col_value',
        Cell: row => {
          const isSellOrder = row.original.type === 'SELL';
          return (<div className={isSellOrder ? 'up' : 'down'}>
            {BigNumber(row.original.price).toFixed(2).toString(10)}
            <span className={classNames('icon', 'icon-dir',
              isSellOrder ? 'icon-down-dir' : 'icon-up-dir')}/>
          </div>);
        }
      }, {
        Header:<div onClick={() => this.onColumnSort('Quantity')}
          className="terminal__header-wrapper">
          <FormattedMessage id="terminal.tradeSize"
            defaultMessage="Trade Size ({secondary})" values={{secondary}}/>
          <span className={classNameForColumnHeader(this.state, 'Quantity')}/>
        </div>,
        className: 'table_col_value upper table_bot_col_value',
        Cell: row => {
          const isSellOrder = row.original.type === 'SELL';
          return (<div className={`terminal__sub-cell ${isSellOrder ? 'up' : 'down'}`}>
            {formatFloat(row.original.amount)}
          </div>);
        },
        minWidth: 130,
        headerClassName: 'table_bot_header_value',
      }, {
        minWidth: 70,
        Header: <div onClick={() => this.onColumnSort('TimeStamp')}
          className="terminal__header-wrapper">
          <FormattedMessage id="terminal.time"
            defaultMessage="Time" />
          <span className={classNameForColumnHeader(this.state, 'TimeStamp')}/>
        </div>,
        headerClassName: 'table_bot_header_value',
        Cell: row => {
          const isSellOrder = row.original.type === 'SELL';
          return (
            <div className={`terminal__sub-cell ${isSellOrder ? 'up' : 'down'}`}>
              {new Date(row.original.dt).toLocaleTimeString()}
            </div>
          );
        },
        className: 'table_col_value table_bot_col_value',
      },
      {
        Header: '',
        minWidth: 24,
        className: 'table_col_value upper table_bot_col_value',
        Cell: row => {
          const isSellOrder = row.original.type === 'SELL';
          return (<div className={`terminal__sub-cell ${isSellOrder ? 'up' : 'down'}`}>
            {isSellOrder ? 'S' : 'B'}
          </div>);
        },
      }
    ];
  }

  render() {
    const { tableHeight } = this.state;
    let sortedData = [];
    const history = this.props.history;
    if(history && history.length) {
      sortedData = this.sortData(history);
    }
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
        <div ref={this.tableWrapper} className="trades-table-wrapper terminal__recent-table-wrapper">
          <ReactTable
            columns={this.getColumns()}
            data={sortedData}
            scrollBarHeight={tableHeight}
          />
        </div>
      </div>
    );
  }
}


export default injectIntl(RecentTrades);

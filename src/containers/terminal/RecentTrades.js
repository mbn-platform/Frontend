import React from 'react';
import { connect } from 'react-redux';
import { BigNumber } from 'bignumber.js';
import { FormattedMessage, injectIntl } from 'react-intl';
import classNames from 'classnames';

import ReactTable from 'components/SelectableReactTable';
import { formatFloat } from 'generic/util';
import { Desktop } from 'generic/MediaQuery';
import { sortData, onColumnSort, classNameForColumnHeader } from 'generic/terminalSortFunctions';
import { marketSelector, historySelector } from 'selectors/terminal';

class RecentTrades extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sort: {} };
    this.sortData = sortData.bind(this);
    this.sortFunctions = {};
    this.tableWrapper = React.createRef();
    this.columns = this.getColumns();
  }

  onColumnSort = (column) => () => {
    onColumnSort.call(this, column);
    this.columns = this.getColumns();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.history !== this.props.history) {
      return true;
    }
    if (nextState.sort !== this.state.sort) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.market !== this.props.market) {
      this.columns = this.getColumns();
      this.forceUpdate();
    }
  }

  getColumns = () => {
    const [base, secondary] = this.props.market.split('-');

    return [
      {
        Header: (
          <div onClick={this.onColumnSort('Price')}>
            <FormattedMessage id="terminal.price" defaultMessage="Price " />
            <span className="terminal__recent-table-header_color_white">
              <FormattedMessage
                id="terminal.secondary"
                defaultMessage="({secondary}) "
                values={{ secondary: base }}
              />
            </span>
            <span className={classNameForColumnHeader(this.state, 'Price')}/>
          </div>
        ),
        minWidth: 70,
        headerClassName: 'terminal__recent-table-header',
        className: 'table_col_value upper table_bot_col_value',
        Cell: ({ original: { type, price } }) => {
          const isSellOrder = type === 'SELL';

          return (
            <div className={isSellOrder ? 'up' : 'down'}>
              {BigNumber(price).toString(10)}
              <span className={classNames('icon', 'icon-dir', {
                'icon-down-dir': isSellOrder,
                'icon-up-dir': !isSellOrder,
              })}
              />
            </div>
          );
        }
      }, {
        Header: (
          <div onClick={this.onColumnSort('Quantity')}>
            <FormattedMessage id="terminal.size" defaultMessage="Size" values={{ secondary }} />
            <span className="terminal__recent-table-header_color_white">
              <FormattedMessage
                id="terminal.secondary"
                defaultMessage="({secondary}) "
                values={{ secondary }}
              />
            </span>
            <span className={classNameForColumnHeader(this.state, 'Quantity')}/>
          </div>
        ),
        className: 'table_col_value upper table_bot_col_value',
        headerClassName: 'table_bot_header_value terminal__recent-table-header',
        Cell: ({ original: { type, amount } }) => {
          const isSellOrder = type === 'SELL';

          return (
            <div className={classNames('terminal__sub-cell', {
              'up': isSellOrder,
              'down': !isSellOrder,
            })}
            >
              {formatFloat(amount)}
            </div>
          );
        },
        minWidth: 85,
      }, {
        minWidth: 60,
        Header: (
          <div onClick={this.onColumnSort('TimeStamp')}>
            <FormattedMessage id="terminal.time" defaultMessage="Time" />
            <span className={classNameForColumnHeader(this.state, 'TimeStamp')} />
          </div>
        ),
        headerClassName: 'table_bot_header_value terminal__recent-table-header',
        Cell: ({ original: { type, dt } }) => {
          const isSellOrder = type === 'SELL';

          return (
            <div className={classNames('terminal__sub-cell', {
              'up': isSellOrder,
              'down': !isSellOrder,
            })}
            >
              {new Date(dt).toLocaleTimeString()}
            </div>
          );
        },
        className: 'table_col_value table_bot_col_value',
      },
      {
        Header: '',
        minWidth: 24,
        headerClassName: 'table_bot_header_value terminal__recent-table-header',
        Cell: ({ original: { type } }) => {
          const isSellOrder = type === 'SELL';

          return (
            <div className={classNames('terminal__sub-cell', {
              'up': isSellOrder,
              'down': !isSellOrder,
            })}
            >
              {type === 'SELL' ? 'S' : 'B'}
            </div>
          );
        },
      }
    ];
  }

  render() {
    const { history } = this.props;

    return (
      <div className="trades-table chart col-12">
        <div className="chart__top justify-content-between row">
          <div className="chart-name">
            <FormattedMessage
              id="terminal.recentTrades"
              defaultMessage="Recent Trades"
            />
          </div>
          <Desktop>
            <div className="chart-controls align-items-center justify-content-between row" />
          </Desktop>
        </div>
        <div ref={this.tableWrapper} className="trades-table-wrapper terminal__recent-table-wrapper">
          {history.length > 0 && (
            <ReactTable
              columns={this.columns}
              data={this.sortData(history)}
              scrollBarHeight="100%"
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  market: marketSelector(state),
  history: historySelector(state),
});

export default injectIntl(connect(mapStateToProps)(RecentTrades));

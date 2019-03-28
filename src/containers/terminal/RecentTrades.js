import React from 'react';
import classNames from 'classnames';
import ReactTable from '../../components/SelectableReactTable';
import { connect } from 'react-redux';
import { formatFloat } from '../../generic/util';
import { Desktop } from '../../generic/MediaQuery';
import {sortData, onColumnSort, classNameForColumnHeader}  from '../../generic/terminalSortFunctions';
import {BigNumber} from 'bignumber.js';
import { FormattedMessage, injectIntl } from 'react-intl';
import createMqProvider, {querySchema} from '../../MediaQuery';

const { Screen} = createMqProvider(querySchema);

class RecentTrades extends React.Component {

  constructor(props) {
    super(props);
    this.state = {sort: {}, tableHeight: 200};
    this.sortData = sortData.bind(this);
    this.onColumnSort = onColumnSort.bind(this);
    this.sortFunctions = {};
    this.tableWrapper = React.createRef();
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

  componentDidMount() {
    this.setState({tableHeight: this.tableWrapper.current.offsetHeight });
  }

    getColumns = () => {
      const [base, secondary] = this.props.market.split('-');

      return [
        {
          Header: <div onClick={() => this.onColumnSort('Price')}>
            <FormattedMessage id="terminal.price"
              defaultMessage="Price " />
            <span className="terminal__recent-table-header_color_white">
              <FormattedMessage id="terminal.secondary"
                defaultMessage="({secondary}) " values={{secondary: base}}/>
            </span>
            <span className={classNameForColumnHeader(this.state, 'Price')}/>
          </div>,
          minWidth:  70,
          headerClassName: 'terminal__recent-table-header',
          className: 'table_col_value upper table_bot_col_value',
          Cell: row => {
            const isSellOrder = row.original.type === 'SELL';
            return (<div className={isSellOrder ? 'up' : 'down'}>
              {BigNumber(row.original.price).toString(10)}
              <span className={classNames('icon', 'icon-dir',
                isSellOrder ? 'icon-down-dir' : 'icon-up-dir')}/>
            </div>);
          }
        }, {
          Header:<div onClick={() => this.onColumnSort('Quantity')}>
            <FormattedMessage id="terminal.size"
              defaultMessage="Size" values={{secondary}}/>
            <span className="terminal__recent-table-header_color_white">
              <FormattedMessage id="terminal.secondary"
                defaultMessage="({secondary}) " values={{secondary}}/>
            </span>
            <span className={classNameForColumnHeader(this.state, 'Quantity')}/>
          </div>,
          className: 'table_col_value upper table_bot_col_value',
          headerClassName: 'table_bot_header_value terminal__recent-table-header',
          Cell: row => {
            const isSellOrder = row.original.type === 'SELL';
            return (<div className={`terminal__sub-cell ${isSellOrder ? 'up' : 'down'}`}>
              {formatFloat(row.original.amount)}
            </div>);
          },
          minWidth: 85,
        }, {
          minWidth: 60,
          Header: <div onClick={() => this.onColumnSort('TimeStamp')}>
            <FormattedMessage id="terminal.time"
              defaultMessage="Time" />
            <span className={classNameForColumnHeader(this.state, 'TimeStamp')}/>
          </div>,
          headerClassName: 'table_bot_header_value terminal__recent-table-header',
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
          headerClassName: 'table_bot_header_value terminal__recent-table-header',
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
      let sortedData = [];
      const history = this.props.history;
      if(history && history.length) {
        sortedData = this.sortData(history);
      }
      return (
        <div className="trades-table chart col-12">
          <Screen on={screenWidth => {
            return (
              <React.Fragment>
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
                    columns={this.getColumns(screenWidth)}
                    data={sortedData}
                    scrollBarHeight={'100%'}
                  />
                </div>
              </React.Fragment>
            );
          }} />
        </div>
      );
    }
}

const mapStateToProps = state => {
  const {market, history} = state.terminal;
  return {
    market,
    history,
  };
};

export default injectIntl(connect(mapStateToProps)(RecentTrades));

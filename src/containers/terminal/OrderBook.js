import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BigNumber } from 'bignumber.js';
import { ReactTableDefaults } from 'react-table';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { formatFloat, defaultFormatValue } from '../../generic/util';
import { Desktop } from '../../generic/MediaQuery';
import { sortData, onColumnSort, classNameForColumnHeader } from '../../generic/terminalSortFunctions';
import ReactTable from '../../components/SelectableReactTable';
import createMqProvider, { querySchema } from '../../MediaQuery';

const { Screen } = createMqProvider(querySchema);

class OrderBook extends React.Component {
  constructor(props) {
    super(props);
    this.sortData = sortData.bind(this);
    this.reset = this.reset.bind(this);
    this.onColumnSort = onColumnSort.bind(this);
    this.sortFunctions = {
      price: (a, b) => a.Rate - b.Rate,
      relativeSize: (a, b) => a.Rate * a.Quantity - b.Rate * b.Quantity,
    };
    this.state = { last: null, sort: {}, scroll: true };
    this.orderTable = React.createRef();
    this.scrollTable = React.createRef();
  }

  reset() {
    this.setState({ scroll: true, sort: {} });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.market !== this.props.market || nextProps.exchange !== this.props.exchange) {
      this.setState({ sort: {}, scroll: true });
    }
  }

  getColumns = (type, screenWidth) => {
    const { market, orderBook } = this.props;
    const [main, secondary] = market.split('-');
    const isSellTable = type === 'sell';

    return [
      {
        Header: isSellTable ?
          <div onClick={() => this.onColumnSort('price')}>
            <FormattedMessage id="terminal.ask" defaultMessage="Ask"/>
            <span className={classNameForColumnHeader(this.state, 'price')}/>
          </div> :
          '',
        minWidth: screenWidth === 'lg' ? 110 : 90,
        className: `${isSellTable ?
          'terminal__orderbook-table-cell_sell' :
          'terminal__orderbook-table-cell_buy'
        }
        terminal__orderbook-table-cell`,
        Cell: ({ original: { Rate } }) => BigNumber(Rate).toString(10),
        headerClassName: 'terminal__orderbook-table-header table__header-wrapper',
      },
      {
        Header: isSellTable ?
          <div onClick={() => this.onColumnSort('Quantity')}>
            <FormattedMessage id="terminal.size" defaultMessage="Size"/> ({secondary})<span
              className={classNameForColumnHeader(this.state, 'Quantity')}/>
          </div> :
          '',
        className: 'terminal__orderbook-table-cell',
        Cell: ({ original: { Quantity } }) => {
          const sizeParts = formatFloat(Quantity).split('.');
          return (
            <div><span className="terminal__orderbook-table-cell_color_white">{sizeParts[0]}.</span>
              <span>{sizeParts[1]}</span>
            </div>
          );
        },
        minWidth: screenWidth === 'lg' ? 80 : 70,
        headerClassName: 'terminal__orderbook-table-header table__header-wrapper',
      },
      {
        minWidth: screenWidth === 'lg' ? 70 : 60,
        Header: isSellTable ?
          <div onClick={() => this.onColumnSort('relativeSize')}>
            <FormattedMessage id="terminal.total" defaultMessage="Total "/>({main}) <span
              className={classNameForColumnHeader(this.state, 'relativeSize')}/></div> :
          '',
        headerClassName: 'terminal__orderbook-table-header table__header-wrapper',
        Cell: ({ original: { Rate, Quantity } }) => (
          <div>
            {defaultFormatValue(Rate * Quantity, main)}
          </div>
        ),
        className: 'terminal__orderbook-table-cell',
      },
      {
        Header: '',
        minWidth: 30,
        headerClassName: 'terminal__orderbook-table-header table__header-wrapper',
        Cell: row => {
          const relativeSize = this.relativeSize( isSellTable ?
            orderBook.minSell :
            orderBook.minBuy,
          isSellTable ?
            orderBook.maxSell :
            orderBook.maxBuy,
          row.original.Quantity * row.original.Rate);
          return  <span className={`
          terminal__orderbook-table-dash
          ${isSellTable ?
            'terminal__orderbook-table-dash_red' :
            'terminal__orderbook-table-dash_green'}`
          } style={{width: new BigNumber(relativeSize * 100 + 1).toFixed() + '%'}}/>;
        },
        className: 'terminal__orderbook-table-cell',
      }
    ];
  }

  onRowClick = (data) => {
    this.props.onOrderSelect(data.Rate.toString(10), data.Quantity.toString(10));
  }

  relativeSize = (minSize, maxSize, size) => Math.max((size - minSize) / (maxSize - minSize), 0.02);

  renderOrderBookTable = (data, type, screenWidth) => {
    return <ReactTable
      columns={this.getColumns(type, screenWidth)}
      data={data}
      scrollBarHeight={'100%'}
      scrollToBottom={type === 'sell'}
      getTrProps={(state, rowInfo) => {
        return {
          data: rowInfo.original,
          onClick: this.onRowClick,
        };
      }}
      TrComponent={MyTr}
    />;
  };

  render() {
    let sortedDataSell = [];
    let sortedDataBuy = [];
    const {sell, buy} = this.props.orderBook;
    if (sell.length) {
      sortedDataSell = this.sortData(sell);
      if (sortedDataSell === sell) {
        sortedDataSell = sell.slice(0, 50).reverse();
      } else {
        sortedDataSell = sortedDataSell.slice(0, 50);
      }
    }

    if (buy.length) {
      sortedDataBuy = this.sortData(buy).slice(0, 50);
    }
    return (
      <div ref={this.orderTable } className="orderbook-table chart col-12">
        <Screen on={screenWidth => (
          <React.Fragment>
            <div className="chart__top justify-content-between row">
              <div className="chart-name">
                <FormattedMessage id="terminal.orderBook" defaultMessage="Order Book"/>
              </div>
              <a role="button" className="reset-button text-muted" onClick={this.reset}>
                <FormattedMessage id="terminal.resetSort" defaultMessage="Reset sort"/>
              </a>
              <Desktop>
                <div className="chart-controls align-items-center justify-content-between row">
                </div>
              </Desktop>
            </div>
            <div className="terminal__orderbook-table-wrapper" ref={elem => this.tableSell = elem}>
              {this.renderOrderBookTable(sortedDataSell, 'sell', screenWidth)}
            </div>
            <LastPrice
              price={(this.props.ticker || {}).l}
              onClick={this.props.onOrderSelect}
            />
            <div className="terminal__orderbook-table-wrapper terminal__orderbook-table-wrapper_buy" ref={elem => this.tableBuy = elem}>
              {this.renderOrderBookTable(sortedDataBuy, 'buy', screenWidth)}
            </div>
          </React.Fragment>
        )} />
      </div>

    );
  }
}
class LastPrice extends React.Component {

  state = {
    isUp: false,
    previous: undefined,
  }

  static getDerivedStateFromProps(props, state) {
    if (state.previous !== props.price) {
      return {
        isUp: props.price > state.previous,
        previous: props.price,
      };
    } else {
      return state;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.price !== this.props.price) {
      return true;
    } else {
      return false;
    }
  }

  onClick = () => {
    if (this.props.price) {
      this.props.onClick(this.props.price.toString(10));
    }
  }

  render() {
    const { price } = this.props;
    const { isUp } = this.state;
    return (
      <div className={classNames('last-price', 'row', isUp ? 'up' : 'down')}>
        <div className={'bid-label'}>
          <FormattedMessage id="terminal.bid" defaultMessage="Bid"/>
        </div>
        <span onClick={this.onClick}>
          {price ? BigNumber(price).toString(10) : null}</span>
        <span className={classNames('icon', 'icon-dir', isUp ? 'icon-up-dir' : 'icon-down-dir')}> </span>
      </div>
    );
  }
}


const mapStateToProps = state => {
  const {orderBook, market, exchange, ticker = {}} = state.terminal;
  return {
    orderBook,
    market,
    exchange,
    ticker
  };
};

class MyTr extends React.Component {

  onClick = () => {
    if (this.props.data) {
      this.props.onClick(this.props.data);
    }
  }

  render() {
    return (
      <ReactTableDefaults.TrComponent {...this.props} onClick={this.onClick} />
    );
  }
}

class OrderBookPresenter extends React.PureComponent {

  render() {
    console.log('render order book presenter');
    return null;
  }
}

OrderBookPresenter.propTypes = {
  main: PropTypes.string.isRequired,
  secondary: PropTypes.string.isRequired,
  lastPrice: PropTypes.number,
  ask: PropTypes.array.isRequired,
  bid: PropTypes.array.isRequired,
};


export default connect(mapStateToProps)(OrderBook);

import React from 'react';
import {formatFloat, defaultFormatValue} from '../../generic/util';
import {Desktop} from '../../generic/MediaQuery';
import {sortData, onColumnSort, classNameForColumnHeader} from '../../generic/terminalSortFunctions';
import classNames from 'classnames';
import {BigNumber} from 'bignumber.js';
import ReactTable from '../../components/SelectableReactTable';
import { FormattedMessage } from 'react-intl';
import createMqProvider, {querySchema} from '../../MediaQuery';

const { Screen} = createMqProvider(querySchema);

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
    this.state = {last: null, sort: {}, prelast: null, scroll: true };
    this.lastPrice = React.createRef();
    this.orderTable = React.createRef();
    this.scrollTable = React.createRef();
  }

  reset() {
    this.setState({scroll: true, sort: {}});
  }

  componentDidMount() {
    const orderTableHeight = this.orderTable.current.offsetHeight;
    this.setState({ heightOfTable: orderTableHeight });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.orderBook.sell.length === 0 && this.props.orderBook.sell.length > 0 ) {
      //this.scrollToBottom();
    }

    if (this.orderTable.current.offsetHeight !== prevState.heightOfTable) {
      this.setState({ heightOfTable : this.orderTable.current.offsetHeight });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.market !== this.props.market || nextProps.exchange !== this.props.exchange) {
      this.setState({prelast: null, sort: {}, scroll: true});
    }
    if (nextProps.ticker !== this.props.ticker) {
      this.setState({prelast: this.props.ticker.l});
    }
    if (nextProps.orderBook !== this.props.orderBook) {
      const {sell, buy} = nextProps.orderBook;
      const maxBuy = buy.reduce((accum, value) => Math.max(accum, value.Quantity * value.Rate), 0);
      const maxSell = sell.reduce((accum, value) => Math.max(accum, value.Quantity * value.Rate), 0);
      const minBuy = buy.reduce((accum, value) => Math.min(accum, value.Quantity * value.Rate), maxBuy);
      const minSell = sell.reduce((accum, value) => Math.min(accum, value.Quantity * value.Rate), maxSell);
      this.setState({maxBuy, maxSell, minSell, minBuy});
    }
  }

  getColumns = (type, screenWidth)  => {
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
        Cell: row => BigNumber(row.original.Rate).toString(10),
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
        Cell: row => {
          const sizeParts = formatFloat(row.original.Quantity).split('.');
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
        Cell: row => {
          return (
            <div>
              {defaultFormatValue( row.original.Rate *  row.original.Quantity, main)}
            </div>
          );
        },
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

  onRowClick = (state, rowInfo) => {
    return {
      onClick: () => {
        this.props.onOrderSelect(parseFloat(rowInfo.original.Rate), rowInfo.original.Quantity);
      }
    };
  }

  relativeSize = (minSize, maxSize, size) => Math.max((size - minSize) / (maxSize - minSize), 0.02);

  renderOrderBookTable = (data, type, screenWidth) => {
    return <ReactTable
      getTrProps={this.onRowClick}
      columns={this.getColumns(type, screenWidth)}
      data={data}
      scrollBarHeight={'100%'}
      scrollToBottom={type === 'buy'}
    />;
  };

  scrollToBottom = () => {
    const tableScrollingElement = this.tableSell.getElementsByClassName('rt-tbody')[0];
    this.setState({openedScroll: true});
  }

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
      <div ref={this.orderTable } className="orderbook-table chart col-12 col-lg-6 col-sm-12 col-md-12">
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
            {this.renderLastPrice()}
            <div className="terminal__orderbook-table-wrapper terminal__orderbook-table-wrapper_buy" ref={elem => this.tableBuy = elem}>
              {this.renderOrderBookTable(sortedDataBuy, 'buy', screenWidth)}
            </div>
          </React.Fragment>
        )} />
      </div>

    );
  }

  renderLastPrice() {
    let isUp;
    const last = this.props.ticker.l;
    const prelast = this.state.prelast;
    if (prelast && last && prelast > last) {
      isUp = false;
    } else {
      isUp = true;
    }

    return (
      <div ref={this.lastPrice} className={classNames('value', 'last-price', 'row', isUp ? 'up' : 'down')}>
        <div className={'bid-label'}>
          <FormattedMessage id="terminal.bid" defaultMessage="Bid"/>
        </div>
        <span onClick={() => this.props.onOrderSelect(last)}>
          {last ? BigNumber(last).toString(10) : null}</span>
        <span className={classNames('icon', 'icon-dir', isUp ? 'icon-up-dir' : 'icon-down-dir')}> </span>
      </div>
    );
  }
}


export default OrderBook;

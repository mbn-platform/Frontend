import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import { isEmpty, map, prop, propEq, findIndex, propOr } from 'ramda';

import { uniqBaseMarkets } from '../../generic/util';
import { defaultFormatValue } from '../../generic/util';
import ReactTable from '../../components/SelectableReactTable';
import { sortData, onColumnSort, classNameForColumnHeader }  from '../../generic/terminalSortFunctions';
import { selectMarket } from '../../actions/terminal';
import createMqProvider, { querySchema } from '../../MediaQuery';

const { Screen} = createMqProvider(querySchema);

const STABLECOINS = ['USDT', 'BUSD', 'PAX', 'USDC', 'DAI', 'USD', 'TUSD', 'NUSD'];
const BTC = 'BTC';
const USD = 'USD';
const ALTS = 'ALTS';

class MarketSelectTable extends React.Component {
  constructor(props) {
    super(props);
    const [base] = props.market.split('-');
    const alts = props.markets.filter(m => ![...STABLECOINS, BTC].includes(m.base));
    const coins = map(prop('base'), props.markets);
    const usdCoins = STABLECOINS.filter(coin => coins.includes(coin));
    const baseCurrency = base === BTC ? base : STABLECOINS.includes(base) ? USD : ALTS;
    const subCoins = base === BTC ? [] : STABLECOINS.includes(base) ? usdCoins : uniqBaseMarkets(alts);
    const markets = props.markets.filter(m => m.base === base);
    const secondaryCurrency = props.markets.find(m => m.symbol === props.market);

    this.state = {
      baseCurrency,
      subCurrency: base,
      secondaryCurrency,
      subCoins,
      filter: '',
      markets,
      sort: {},
      hideZeros: false,
      dropDownHeight: 400,
    };
    this.sortData = sortData.bind(this);
    this.onColumnSort = onColumnSort.bind(this);
    this.sortFunctions = {
      volume: (a, b) => (a.volume * a.last) - (b.volume * b.last),
      Balance: (a, b) => {
        const first = this.props.balances.find(balance => balance.name === a.second);
        const bFirst = first ? (first.total || 0) : 0;
        const second = this.props.balances.find(balance => balance.name === b.second);
        const bSecond = second ? (second.total || 0) : 0;
        return bFirst * a.last - bSecond * b.last;
      },
    };
    this.dropDownWrapper = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.markets && prevState.markets.length === 0) {
      const {baseCurrency} = prevState;
      return {
        markets: nextProps.markets.filter(m => m.base === baseCurrency)
      };
    } else {
      return null;
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
    this.setState({dropDownHeight: this.dropDownWrapper.current.offsetHeight - 180});
  };

  onHideZeroClick = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.setState({ hideZeros: !this.state.hideZeros });
  }

  handleChange = ({ target: { value } }) => {
    const { markets } = this.props;
    const marketsFiltered = this.handleFilterTable(markets, value);

    this.setState({
      baseCurrency: null,
      subCurrency: null,
      markets: marketsFiltered,
      secondaryCurrency: marketsFiltered[0],
      filter: value,
      subCoins: [],
    });
  }

  handleFilterTable = (data, filter) => data.filter(m => m.second.toLowerCase().includes(filter.toLowerCase()));

  handleFilterBaseCurrency = (base) => (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    let markets = [];
    let subCoins = [];

    if (base === BTC) {
      markets = this.props.markets.filter(m => m.base === base);
    } else if (base === USD) {
      markets = this.props.markets.filter(m => STABLECOINS.includes(m.base));
      const coins = map(prop('base'), markets);
      subCoins = STABLECOINS.filter(coin => coins.includes(coin));
      markets = markets.filter(m => m.base === subCoins[0]);
    } else {
      markets = this.props.markets.filter(m => ![...STABLECOINS, BTC].includes(m.base));
      subCoins = uniqBaseMarkets(markets);
      markets = markets.filter(m => m.base === subCoins[0]);
    }

    this.setState({
      baseCurrency: base,
      subCurrency: isEmpty(subCoins) ? null : subCoins[0],
      markets,
      subCoins,
    });
  }

  handleFilterSubCurrency = (subCurrency) => () => {
    const markets = this.props.markets.filter(m => m.base === subCurrency);
    this.setState({ subCurrency, markets });
  }

  onSecondaryCurrencySelected = ({ symbol }) => (event) => {
    event.stopPropagation();

    if (symbol !== this.props.market) {
      this.props.selectMarket(symbol);
    }
  }

  handlePressEnter = (event) => {
    if (event.keyCode === 13 && event.shiftKey === false && !isEmpty(this.state.markets)) {
      event.preventDefault();

      this.props.selectMarket(this.state.secondaryCurrency.symbol);
      this.props.close();
    }
  }

  onKeyDown = (e) => {
    const data = this.sortData(this.state.markets);
    const index = findIndex(propEq('symbol', prop('symbol', this.state.secondaryCurrency)))(data);

    if (e.keyCode === 38) {
      e.preventDefault();
      this.setState(() => {
        return index >= 1 ? { secondaryCurrency: data[index - 1] } : null;
      });
      const selectedRow = document.getElementsByClassName('-selected')[0];
      selectedRow.scrollIntoViewIfNeeded();
    }
    if (e.keyCode === 40) {
      e.preventDefault();
      this.setState(() => {
        return index < data.length - 1 ? { secondaryCurrency: data[index + 1] } : null;
      });
      const selectedRow = document.getElementsByClassName('-selected')[0];
      selectedRow.scrollIntoViewIfNeeded();
    }

    if (e.keyCode === 13) {
      e.preventDefault();

      this.props.selectMarket(this.state.secondaryCurrency.symbol);
      this.props.close();
    }
  }

  getColumns = screenWidth => {
    const { baseCurrency } = this.state;
    const { balances, rates } = this.props;

    let balanceValue;

    function calculateChange(currentMarketValue) {
      if(balances) {
        let c;
        c = balances.find(m => m.name === currentMarketValue.second);
        balanceValue = (c && c.available) || 0;
        balanceValue = balanceValue * rates[currentMarketValue.symbol];
      }

      const val=rates[currentMarketValue.symbol] ? rates[currentMarketValue.symbol] : '';
      const prevDay = currentMarketValue.prevDay;
      return prevDay ? (val / prevDay * 100 - 100).toFixed(2) : null;
    }


    const marketColumns =  [
      {
        Header:
          <div onClick={() => this.onColumnSort('second')}>
            <FormattedMessage id="terminal.market" defaultMessage="Market"/>
            <span className={classNameForColumnHeader(this.state, 'second')}/>
          </div>,
        minWidth:  screenWidth === 'lg' ? 80 : 30,
        headerClassName: 'table__header-wrapper terminal__market-header-table',
        className: 'terminal__market-table-cell terminal__market-table-cell_color-white',
        Cell: row => (
          <div>
            {row.original.symbol.split('-').reverse().join('/')}
          </div>
        ),
      },
      {
        Header:   <div onClick={() => this.onColumnSort('last')}>
          <FormattedMessage id="terminal.price" defaultMessage="Price"/>
          <span className={classNameForColumnHeader(this.state, 'last')}/>
        </div>,
        className: 'terminal__market-table-cell',
        headerClassName: 'table__header-wrapper terminal__market-header-table',
        Cell: row => (
          <div>{defaultFormatValue(row.original.last, row.original.base)}</div>
        ),
        minWidth:  screenWidth === 'lg' ? 90 : 40,
      },
      {
        minWidth:  screenWidth === 'lg' ? 110 : 40,
        className: 'terminal__market-table-cell',
        headerClassName: 'table__header-wrapper terminal__market-header-table',
        Header: <div onClick={() => this.onColumnSort('volume')}>
          <FormattedMessage id="terminal.volumeCurrency" defaultMessage="Volume({baseCurrency})" values={{baseCurrency}}/>
          <span className={classNameForColumnHeader(this.state, 'volume')}/>
        </div>,
        Cell: row => Math.round(row.original.volume * row.original.last)
      },
      {
        Header: <div onClick={() => this.onColumnSort('change')}>
          <FormattedMessage id="terminal.change" defaultMessage="Change" values={{baseCurrency}}/>
          <span className={classNameForColumnHeader(this.state, 'change')}/>
        </div>,
        headerClassName: 'table__header-wrapper terminal__market-header-table',
        className: 'terminal__market-table-cell',
        minWidth:  screenWidth === 'lg' ? 70 : 30,
        Cell: row => {
          return (<div
            className={row.original.change >= 0 ? 'terminal__market-table-cell_up' : 'terminal__market-table-cell_down'}>
            {calculateChange(row.original) + '%'}
          </div>);
        }
      },
    ];

    return [
      ...marketColumns,
      ...(this.props.balances ? [
        {
          Header: <div onClick={() => this.onColumnSort('Balance')}>
            {screenWidth === 'lg' ?
              <FormattedMessage
                id="terminal.balance"
                defaultMessage="Balance ({baseCurrency}) "
                values={{baseCurrency}}/> :
              <FormattedMessage
                id="terminal.balance-mobile"
                defaultMessage="Balance"
                values={{baseCurrency}}/>
            }
            <span className={classNameForColumnHeader(this.state, 'Balance')}/><br/></div>,
          minWidth:  screenWidth === 'lg' ? 60 : 30,
          headerClassName: 'table__header-wrapper terminal__market-header-table',
          className: 'terminal__market-table-cell',
          Cell: row => (
            <div>{defaultFormatValue(balanceValue, row.original.base)}</div>
          )
        }
      ] : []),
    ];
  }

  onRowClick = (_, { original }) => ({
    onClick: this.onSecondaryCurrencySelected(original),
    className: prop('symbol', this.state.secondaryCurrency) === original.symbol ? '-selected' : '',
  });

  render() {
    const { baseCurrency, subCurrency, subCoins } = this.state;
    let sortedData = [];

    if (this.props.balances && this.state.hideZeros) {
      sortedData = this.state.markets.filter(m => {
        const c = this.props.balances.find(b => b.name === m.second);
        return c && c.total > 0;
      });
      sortedData = this.sortData(sortedData);
    } else {
      sortedData = this.sortData(this.state.markets);
    }

    return (
      <div
        onClick={e => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
        className="dropdown search"
        ref={this.dropDownWrapper}
      >
        <div onClick={this.props.close} className="dropdown__name">
          <span>{this.props.market}</span>
          <span>
            {
              this.props.balances !== null && <span className="hide_zeros" onClick={this.onHideZeroClick}>
                <FormattedMessage id="terminal.hideZeros" defaultMessage="Hide zeros "/>
                <div className={classNames('currency_status_checkbox', {selected: this.state.hideZeros})}/>
              </span>
            }
            <span className="arrow_down"/>
          </span>
        </div>
        <form action="" className="dropdown__form">
          <input
            autoComplete="off"
            value={this.state.filter}
            type="text"
            name="filter"
            onChange={this.handleChange}
            onKeyDown={this.handlePressEnter}
            className="input-search"
            placeholder={this.props.intl.messages['terminal.search']}
          />
        </form>
        <div className="dropdown__btn-wrap">
          <button
            onClick={this.handleFilterBaseCurrency(BTC)}
            className={classNames('dropdown__btn', {active: baseCurrency === BTC})}
          >{BTC}</button>
          <button
            onClick={this.handleFilterBaseCurrency(USD)}
            className={classNames('dropdown__btn', {active: baseCurrency === USD})}
          >{USD}Ⓢ</button>
          <button
            onClick={this.handleFilterBaseCurrency(ALTS)}
            className={classNames('dropdown__btn', {active: baseCurrency === ALTS})}
          >{ALTS}</button>
        </div>
        {!isEmpty(subCoins) && (
          <div className="dropdown__btn-wrap">
            {subCoins.map((item) => (
              <button
                key={item}
                onClick={this.handleFilterSubCurrency(item)}
                className={classNames('dropdown__btn sub', {active: subCurrency === item})}
              >
                {item}
              </button>
            ))}
          </div>
        )}
        <Screen on={screenWidth => (
          <div className="terminal__market-select-dropdown-container dropdown-table-wrapper js-dropdown-table-wrapper">
            <ReactTable
              getTrProps={this.onRowClick}
              columns={this.getColumns(screenWidth)}
              data={sortedData}
              selectedItem={this.state.secondaryCurrency}
              scrollBarHeight={this.state.dropDownHeight}
            />
          </div>
        )} />
      </div>
    );
  }
}

MarketSelectTable.propTypes = {
  balance: PropTypes.object,
  market: PropTypes.string.isRequired,
  markets: PropTypes.array.isRequired,
  rates: PropTypes.object.isRequired,
  selectMarket: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  const { exchange, market, fund } = state.terminal;
  const info = state.exchangesInfo[exchange];

  return {
    market,
    balances: propOr(null, 'balances', fund),
    rates: propOr({}, 'rates', info),
    markets: propOr([], 'markets', info),
  };
};

const mapDispatchToProps = {
  selectMarket,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(MarketSelectTable));

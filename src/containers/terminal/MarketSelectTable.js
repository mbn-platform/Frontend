import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import {FormattedMessage, injectIntl} from 'react-intl';
import { isEmpty } from 'ramda';

import { uniqBaseMarkets } from '../../generic/util';
import { defaultFormatValue } from '../../generic/util';
import ReactTable from '../../components/SelectableReactTable';
import {sortData, onColumnSort, classNameForColumnHeader}  from '../../generic/terminalSortFunctions';
import {selectMarket} from '../../actions/terminal';
import createMqProvider, {querySchema} from '../../MediaQuery';

const { Screen} = createMqProvider(querySchema);

const STABLECOINS = ['USDT', 'BUSD', 'PAX', 'USDC'];
const BTC = 'BTC';
const USD = 'USD';
const ALTS = 'ALTS';

class MarketSelectTable extends React.Component {
  constructor(props) {
    super(props);
    const [base] = props.market.split('-');

    let bs;
    let secondary;
    let subCoins = [];

    if (base === BTC) {
      bs = base;
    } else {
      secondary = props.markets.find(item => item.base === base).base;
      const alts = props.markets.filter(m => ![...STABLECOINS, BTC].includes(secondary));
      bs = STABLECOINS.includes(secondary) ? USD : ALTS;
      subCoins = STABLECOINS.includes(secondary) ? STABLECOINS : uniqBaseMarkets(alts);
    }

    this.state = {
      baseCurrency: bs,
      secondaryCurrency: secondary,
      subCoins,
      filter: '',
      markets: props.markets.filter(m => m.base === base),
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

  onHideZeroClick = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.setState({hideZeros: !this.state.hideZeros});
  }

  onChange = (e) => {
    this.setState({filter: e.target.value});
  }

  handleFilterBaseCurrency = (base) => (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    let markets = [];
    let subCoins = [];

    if (base === BTC) {
      markets = this.props.markets.filter(m => m.base === base);
    } else if (base === USD) {
      markets = this.props.markets.filter(m => STABLECOINS.includes(m.base));
      subCoins = STABLECOINS;
    } else {
      markets = this.props.markets.filter(m => ![...STABLECOINS, BTC].includes(m.base));
      subCoins = uniqBaseMarkets(markets);
    }

    this.setState({
      baseCurrency: base,
      secondaryCurrency: null,
      markets,
      subCoins,
    });
  }

  handleFilterSecondaryCurrency = (secondary) => () => {
    this.setState({
      secondaryCurrency: secondary,
      markets: this.props.markets.filter(m => m.base === secondary),
    });
  }

  onSecondaryCurrencySelected = (e, rowInfo) => {
    e.stopPropagation();
    const { symbol } = rowInfo.original;

    if(symbol !== this.props.market) {
      this.props.selectMarket(symbol);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  componentDidMount() {
    this.setState({dropDownHeight: this.dropDownWrapper.current.offsetHeight - 180});
  };


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
            <FormattedMessage id="terminal.currency" defaultMessage="Currency"/>
            <span className={classNameForColumnHeader(this.state, 'second')}/>
          </div>,
        minWidth:  screenWidth === 'lg' ? 80 : 30,
        headerClassName: 'table__header-wrapper terminal__market-header-table',
        className: 'terminal__market-table-cell terminal__market-table-cell_color-white',
        Cell: row =>  (
          <div>
            {row.original.second}
          </div>
        )
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

  onRowClick = (state, rowInfo) => {
    return {
      onClick: e => this.onSecondaryCurrencySelected(e, rowInfo)
    };
  }

  renderMarketTable = (data, screenWidth) => (
    <ReactTable
      getTrProps={this.onRowClick}
      columns={this.getColumns(screenWidth)}
      data={data}
      scrollBarHeight={this.state.dropDownHeight}
    />
  )

  render() {
    const { baseCurrency, secondaryCurrency, subCoins } = this.state;
    let sortedData = [];
    if(this.props.balances && this.state.hideZeros) {
      sortedData = this.state.markets.filter(m => {
        const c = this.props.balances.find(b => b.name === m.second);
        return c && c.total > 0;
      });
      sortedData = this.sortData(sortedData);
    } else {
      sortedData = this.sortData(this.state.markets);
    }

    return (
      <div onClick={e => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      }} className="dropdown search" ref={this.dropDownWrapper}>
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
          <input autoComplete="off" value={this.state.filter} type="text" name="filter" onChange={this.onChange}
            className="input-search" placeholder={this.props.intl.messages['terminal.search']}/>
        </form>
        <div className="dropdown__btn-wrap">
          <button
            onClick={this.handleFilterBaseCurrency(BTC)}
            className={classNames('dropdown__btn', {active: baseCurrency === BTC})}
          >{BTC}</button>
          <button
            onClick={this.handleFilterBaseCurrency(ALTS)}
            className={classNames('dropdown__btn', {active: baseCurrency === ALTS})}
          >{ALTS}</button>
          <button
            onClick={this.handleFilterBaseCurrency(USD)}
            className={classNames('dropdown__btn', {active: baseCurrency === USD})}
          >{USD}</button>
        </div>
        {!isEmpty(subCoins) && (
          <div className="dropdown__btn-wrap">
            {subCoins.map((item) => (
              <button
                key={item}
                onClick={this.handleFilterSecondaryCurrency(item)}
                className={classNames('dropdown__btn sub', {active: secondaryCurrency === item})}
              >
                {item}
              </button>
            ))}
          </div>
        )}
        <Screen on={screenWidth => (
          <div className="terminal__market-select-dropdown-container dropdown-table-wrapper js-dropdown-table-wrapper">
            {this.renderMarketTable(sortedData.filter(m => m.second.toLowerCase().indexOf(this.state.filter.toLowerCase()) >= 0), screenWidth)}
          </div>
        )}/>
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
  const exchange = state.terminal.exchange;
  const info = state.exchangesInfo[exchange];
  return {
    balances: state.terminal.fund ? state.terminal.fund.balances : null,
    market: state.terminal.market,
    rates: (info && info.rates) || {},
    markets: (info && info.markets) || [],
  };
};

const mapDispatchToProps = dispatch => ({
  selectMarket: market => dispatch(selectMarket(market)),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(MarketSelectTable));

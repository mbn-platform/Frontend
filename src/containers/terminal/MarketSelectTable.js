import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import classNames from 'classnames';
import { defaultFormatValue } from '../../generic/util';
import {sortData, onColumnSort, classNameForColumnHeader}  from '../../generic/terminalSortFunctions';
import {selectMarket} from '../../actions/terminal';
import { connect } from 'react-redux';
import {FormattedMessage, injectIntl} from 'react-intl';

class MarketSelectTable extends React.Component {
  constructor(props) {
    super(props);
    const [base, secondary] = props.market.split('-');
    this.state = {
      baseCurrency: base,
      secondaryCurrency: secondary,
      filter: '',
      markets: props.markets.filter(m => m.base === base),
      sort: {},
      hideZeros: false,
    };
    this.onBaseCurrencySelected = this.onBaseCurrencySelected.bind(this);
    this.onSecondaryCurrencySelected = this.onSecondaryCurrencySelected.bind(this);
    this.onChange = this.onChange.bind(this);
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
    this.onHideZeroClick = this.onHideZeroClick.bind(this);
    this.onResize = this.onResize.bind(this);
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

  onResize() {
    const total = this.getTableHeight();
    if(this.tableHeigth !== total) {
      this.tableHeight = total;
      this.forceUpdate();
    }
  }

  onHideZeroClick(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.setState({hideZeros: !this.state.hideZeros});
  }

  onChange(e) {
    this.setState({filter: e.target.value});
  }

  onBaseCurrencySelected(e, base) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.setState({
      baseCurrency: base, secondaryCurrency: null,
      markets: this.props.markets.filter(m => m.base === base),
    });
    $('.popover-body .js-dropdown-table-wrapper table').floatThead('reflow');
  }

  onSecondaryCurrencySelected(e) {
    e.stopPropagation();
    const currency = e.target.parentElement.dataset.currency;
    const market = this.state.baseCurrency + '-' + currency;
    if(market !== this.props.market) {
      this.props.selectMarket(this.state.baseCurrency + '-' + currency);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    const $table = $('.popover-body .js-dropdown-table-wrapper table');
    $table.on('reflowed', function(e, $floatContainer) {
      let headHeight = $('tr', this).first().height();

      $floatContainer.parent('.floatThead-wrapper').css('padding-top', headHeight);
      $(this).css('margin-top', -headHeight);
    });

    $table.floatThead({
      scrollContainer: function($table){
        let $container = $table.parents('.js-table-wrapper');

        if (!$container.length) {
          $container = $table.parents('.js-dropdown-table-wrapper');
        }

        return $container;
      },
      position: 'absolute',
      // debug: true
    });

  };

  getTableHeight() {
    const $controls = $('.row.dropdowns');
    const $md = $('.marketdepth-chart');
    const total = $md.offset().top + $md.outerHeight() - $controls.offset().top - 145;
    if(this.props.balance) {
      return total - 15;
    } else {
      return total;
    }
  }

  render() {
    if(!this.tableHeight) {
      this.tableHeight = this.getTableHeight();
    }
    const baseCurrency = this.state.baseCurrency;
    const isBTC = baseCurrency === 'BTC';
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
      }} className="dropdown search">
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
            onClick={e => this.onBaseCurrencySelected(e, 'BTC')}
            className={classNames('dropdown__btn', {active: baseCurrency === 'BTC'})}
          >BTC</button>
          <button
            onClick={e => this.onBaseCurrencySelected(e, 'ETH')}
            className={classNames('dropdown__btn', {active: baseCurrency === 'ETH'})}
          >ETH</button>
          <button
            onClick={e => this.onBaseCurrencySelected(e, 'USDT')}
            className={classNames('dropdown__btn', {active: baseCurrency === 'USDT'})}
          >USDT</button>
        </div>

        <div style={{height: this.tableHeight + 'px'}} className="dropdown-table-wrapper js-dropdown-table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th onClick={() => this.onColumnSort('second')}>
                  <FormattedMessage id="terminal.currency" defaultMessage="Currency"/>
                  <span className={classNameForColumnHeader(this.state, 'second')}/></th>
                <th onClick={() => this.onColumnSort('last')}>
                  <FormattedMessage id="terminal.price" defaultMessage="Price"/>
                  <span className={classNameForColumnHeader(this.state, 'last')}/></th>
                <th onClick={() => this.onColumnSort('volume')}>
                  <FormattedMessage id="terminal.volumeCurrency" defaultMessage="Volume({baseCurrency})" values={{baseCurrency}}/>
                  <span className={classNameForColumnHeader(this.state, 'volume')}/></th>
                <th onClick={() => this.onColumnSort('change')}>
                  <FormattedMessage id="terminal.change" defaultMessage="Change" values={{baseCurrency}}/>
                  <span className={classNameForColumnHeader(this.state, 'change')}/>
                </th>
                {this.props.balances ? (
                  <th onClick={() => this.onColumnSort('Balance')}>
                    <FormattedMessage id="terminal.balance" defaultMessage="Balance ({baseCurrency}) " values={{baseCurrency}}/>
                    <span className={classNameForColumnHeader(this.state, 'Balance')}/><br/></th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {
                sortedData
                  .filter(m => m.second.toLowerCase().indexOf(this.state.filter.toLowerCase()) >= 0)
                  .map(m => (
                    <MarketRow
                      rates={this.props.rates}
                      balances={this.props.balances}
                      isBTC={isBTC}
                      key={m.symbol}
                      onClick={this.onSecondaryCurrencySelected}
                      market={m}
                    />
                  ))
              }
            </tbody>
          </table>
        </div>
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

const MarketRow = ({balances, market, onClick, isBTC, rates}) => {
  let balanceValue;
  if(balances) {
    let c;
    c = balances.find(m => m.name === market.second);
    balanceValue = (c && c.available) || 0;
    balanceValue = balanceValue * rates[market.symbol];
  }
  const val=rates[market.symbol] ? rates[market.symbol] : '';
  const prevDay = market.prevDay;
  const change = prevDay ? (val / prevDay * 100 - 100) : 0;
  return (
    <tr onClick={onClick} data-currency={market.second} className={market.change >= 0 ? 'up' : 'down'}>
      <td>{market.second}</td>
      <td>{defaultFormatValue(market.last, market.base)}</td>
      <td>{Math.round(market.volume * market.last)}</td>
      <td>{change.toFixed(2) + '%'}</td>
      {balances ?  (<td>{defaultFormatValue(balanceValue, market.base)}</td>) : null}
    </tr>
  );
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

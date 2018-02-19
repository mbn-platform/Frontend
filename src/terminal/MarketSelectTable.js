import React from 'react';
import $ from 'jquery';
import classNames from 'classnames';
import { defaultFormatValue } from '../generic/util';
import {sortData, onColumnSort, classNameForColumnHeader}  from '../generic/terminalSortFunctions';

class MarketSelectTable extends React.Component {
  constructor(props) {
    super(props);
    const [base, secondary] = props.selectedMarket.split('-');
    this.state = {
      baseCurrency: base,
      secondaryCurrency: secondary,
      filter: '',
      markets: this.props.marketSummaries.filter(m => m.BaseCurrency === base),
      sort: {},
    };
    this.onBaseCurrencySelected = this.onBaseCurrencySelected.bind(this);
    this.onSecondaryCurrencySelected = this.onSecondaryCurrencySelected.bind(this);
    this.onChange = this.onChange.bind(this);
    this.sortData = sortData.bind(this);
    this.onColumnSort = onColumnSort.bind(this);
    this.sortFunctions = {
      Price: (a, b) => a.Price - b.Price,
      Volume: (a, b) => (a.Volume * a.Price) - (b.Volume * b.Price),
      Balance: (a, b) => {
        const first = this.props.selectedApiKey.currencies.find(c => c.name === a.MarketCurrency);
        const bFirst = first ? (first.totalBalance || 0) : 0;
        const second = this.props.selectedApiKey.currencies.find(c => c.name === b.MarketCurrency);
        const bSecond = second ? (second.totalBalance || 0) : 0;
        return bFirst * a.Price - bSecond * b.Price;
      },
    };
  }

  onChange(e) {
    this.setState({filter: e.target.value});
  }

  onBaseCurrencySelected(e, base) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.setState({
      baseCurrency: base, secondaryCurrency: null,
      markets: this.props.marketSummaries.filter(m => m.BaseCurrency === base),
    });
    $('.popover-body .js-dropdown-table-wrapper table').floatThead('reflow');
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.selectedApiKey && !this.props.selectedApiKey) {
      $('.popover-body .js-dropdown-table-wrapper table').floatThead('reflow');
    }
  }

  onSecondaryCurrencySelected(e) {
    e.stopPropagation();
    const currency = e.target.parentElement.dataset.currency;
    this.props.onMarketSelect(this.state.baseCurrency + '-' + currency);
  }

  componentDidMount() {
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

  render() {
    const baseCurrency = this.state.baseCurrency;
    const isBTC = baseCurrency === 'BTC';
    let sortedData = [];
    if(this.state.markets.length) {
      sortedData = this.sortData(this.state.markets);
    }
    return (
      <div onClick={e => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      }} className="dropdown search">
        <div onClick={this.props.close} className="dropdown__name">
          <span>{this.props.selectedMarket}</span>
          <span className="arrow_down"></span>
        </div>
        <form action="" className="dropdown__form">
          <input autoComplete="off" value={this.state.filter} type="text" name="filter" onChange={this.onChange} className="input-search" placeholder="Search..."/>
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

        <div className="dropdown-table-wrapper js-dropdown-table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th onClick={() => this.onColumnSort('MarketCurrency')}>Currency <span className={classNameForColumnHeader(this.state, 'MarketCurrency')}></span></th>
                <th onClick={() => this.onColumnSort('Price')}>Price <span className={classNameForColumnHeader(this.state, 'Price')}></span></th>
                <th onClick={() => this.onColumnSort('Volume')}>Volume({baseCurrency}) <span className={classNameForColumnHeader(this.state, 'Volume')}></span></th>
                <th onClick={() => this.onColumnSort('Change')}>Change <span className={classNameForColumnHeader(this.state, 'Change')}></span></th>
                {this.props.selectedApiKey ? (
                  <th onClick={() => this.onColumnSort('Balance')}>Balance ({baseCurrency}) <span className={classNameForColumnHeader(this.state, 'Balance')}></span></th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {
                sortedData
                  .filter(m => m.MarketCurrency.toLowerCase().indexOf(this.state.filter.toLowerCase()) >= 0)
                  .map(m => (
                    <MarketRow
                      rates={this.props.rates}
                      selectedApiKey={this.props.selectedApiKey}
                      isBTC={isBTC}
                      key={m.MarketName}
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

const MarketRow = ({selectedApiKey, market, onClick, isBTC, rates}) => {
  let balance;
  if(selectedApiKey) {
    const c = selectedApiKey.currencies.find(c => c.name === market.MarketCurrency);
    if(c) {
      balance = c.availableBalance;
    }
    balance = balance || 0;
    balance = balance * rates[market.BaseCurrency][market.MarketCurrency];
  }
  return (
    <tr onClick={onClick} data-currency={market.MarketCurrency} className={market.Change >= 0 ? 'up' : 'down'}>
      <td>{market.MarketCurrency}</td>
      <td>{defaultFormatValue(market.Price, market.BaseCurrency)}</td>
      <td>{Math.round(market.Volume * market.Price)}</td>
      <td>{market.Change.toFixed(2) + '%'}</td>
      {selectedApiKey ?  (<td>{defaultFormatValue(balance, market.BaseCurrency)}</td>) : null}
    </tr>
  );
};

export default MarketSelectTable;
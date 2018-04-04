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
      marketNames: this.props.marketNames,
      sort: {},
      hideZeros: false,
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
    this.onHideZeroClick = this.onHideZeroClick.bind(this);
    this.onResize = this.onResize.bind(this);
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
    if(this.props.selectedApiKey) {
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
    if(this.state.markets.length) {
      sortedData = this.sortData(this.state.markets);
    }
    if(this.props.selectedApiKey && this.state.hideZeros) {
      sortedData = sortedData.filter(m => {
        const c = this.props.selectedApiKey.currencies.find(c => c.name === m.MarketCurrency);
        return c && c.totalBalance > 0;
      });
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

        <div style={{height: this.tableHeight + 'px'}} className="dropdown-table-wrapper js-dropdown-table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th onClick={() => this.onColumnSort('MarketCurrency')}>Currency <span className={classNameForColumnHeader(this.state, 'MarketCurrency')}></span></th>
                <th onClick={() => this.onColumnSort('Price')}>Price <span className={classNameForColumnHeader(this.state, 'Price')}></span></th>
                <th onClick={() => this.onColumnSort('Volume')}>Volume({baseCurrency}) <span className={classNameForColumnHeader(this.state, 'Volume')}></span></th>
                <th onClick={() => this.onColumnSort('Change')}>Change <span className={classNameForColumnHeader(this.state, 'Change')}></span></th>
                {this.props.selectedApiKey ? (
                  <th onClick={() => this.onColumnSort('Balance')}>Balance ({baseCurrency}) <span className={classNameForColumnHeader(this.state, 'Balance')}></span><br/>
                    <div onClick={this.onHideZeroClick}>Hide zeros <div className={classNames('currency_status_checkbox', {selected: this.state.hideZeros})}/> 
                    </div>
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {
                sortedData
                  .filter((m) => {
                    return (m.MarketCurrency.toLowerCase().indexOf(this.state.filter.toLowerCase()) >= 0)
                    || (this.state.marketNames[m.MarketCurrency].toLowerCase().indexOf(this.state.filter.toLowerCase()) >= 0);
                  })
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
      balance = c.totalBalance;
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

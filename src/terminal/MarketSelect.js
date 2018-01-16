import React from 'react';
import { Popover } from 'reactstrap';
import classNames from 'classnames';
import { getMarketSummaries } from '../api/bittrex/bittrex';
import $ from 'jquery';
import { formatFloat } from '../generic/util';
import {sortData, onColumnSort, classNameForColumnHeader}  from '../generic/terminalSortFunctions';

class MarketSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {selected: this.props.selected, markets: [], isOpen: false};
    this.onItemSelect = this.onItemSelect.bind(this);
    this.onOutsideClick = this.onOutsideClick.bind(this);   
    this.updateMarketSummaries = this.updateMarketSummaries.bind(this);
  }

  onOutsideClick() {
    this.setState({isOpen: false});
  }

  onItemSelect(item) {
    this.setState({isOpen: false});
    this.props.onItemSelect(item);
  }

  updateMarketSummaries() {
    getMarketSummaries().then(json => {
      let markets = json.result;
      markets = markets.map(market => {
        const currencies = market.MarketName.split('-');
        return {
          MarketCurrency: currencies[1],
          BaseCurrency: currencies[0],
          Price: market.Last,
          MarketName: market.MarketName,
          Volume: market.Volume,
          Change: market.Last / market.PrevDay * 100 - 100,
        };
      });
      this.setState({markets});
    });
  }

  componentDidMount() {
    this.interval = setInterval(this.updateMarketSummaries, 5000);
    this.updateMarketSummaries();
  }

  componentDidUpdate(prevProps, prevState) {
    if(!prevState.isOpen && this.state.isOpen) {
      document.addEventListener('click', this.onOutsideClick);
    }
    if(prevState.isOpen && !this.state.isOpen) {
      document.removeEventListener('click', this.onOutsideClick);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onOutsideClick);
    clearInterval(this.interval);
  }

  render() {
    return(
      <div
        onClick={() => {
          this.setState({isOpen: !this.state.isOpen});
          this.updateMarketSummaries();
        }}
        id={this.props.targetId} className="dropdown-link-wrap"
      >
        <div className="dropdown-link">
          <span>{this.props.selected ? this.props.selected.replace('-', '/') : this.props.header} <span className="arrow_down"/></span>
        </div>
        <Popover
          container=".terminal.container-fluid"
          innerClassName="popover-body"
          isOpen={this.state.isOpen}
          target={this.props.targetId}
          placement="bottom-start"
          className="dropdown-popover"
        >
          <MarketTable
            markets={this.state.markets}
            market={this.props.selected}
            mainCurrency={this.props.selected.split('-')[0]}
            onMarketSelect={this.onItemSelect}
            close={e => this.setState({isOpen: false})}
          />
        </Popover>
      </div>
    );
  }
}


class MarketTable extends React.Component {
  constructor(props) {
    super(props);
    const baseCurrency = props.market.split('-')[0];
    this.state = {
      baseCurrency,
      secondaryCurrency: props.market.split('-')[1],
      filter: '',
      markets: this.props.markets.filter(m => m.BaseCurrency === baseCurrency),
      sort: {},
    };
    this.onBaseCurrencySelected = this.onBaseCurrencySelected.bind(this);
    this.onSecondaryCurrencySelected = this.onSecondaryCurrencySelected.bind(this);
    this.onChange = this.onChange.bind(this);
    this.sortData = sortData.bind(this);
    this.onColumnSort = onColumnSort.bind(this);
    this.sortFunctions = {
      Price: (a, b) => formatFloat(a.Price, this.state.baseCurrency === 'BTC') - formatFloat(b.Price, this.state.baseCurrency === 'BTC'),
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
      markets: this.props.markets.filter(m => m.BaseCurrency === base),
    });
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
        <div className="dropdown__name">
          <span>{this.props.market}</span>
          <span onClick={this.props.close} className="arrow_down"></span>
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
              </tr>
            </thead>
            <tbody>
              {
                sortedData
                  .filter(m => m.MarketCurrency.toLowerCase().indexOf(this.state.filter.toLowerCase()) >= 0)
                  .map(m => (
                    <MarketRow
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

const MarketRow = ({market, onClick, isBTC}) => {
  return (
    <tr onClick={onClick} data-currency={market.MarketCurrency} className={market.Change >= 0 ? 'up' : 'down'}>
      <td>{market.MarketCurrency}</td>
      <td>{formatFloat(market.Price, isBTC)}</td>
      <td>{Math.round(market.Volume * market.Price)}</td>
      <td>{market.Change.toFixed(2) + '%'}</td>
    </tr>
  );
};

export default MarketSelect;

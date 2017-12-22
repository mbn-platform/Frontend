import React from 'react';
import { Popover } from 'reactstrap';
import classNames from 'classnames';
import { getMarketSummaries } from '../api/bittrex/bittrex';
import $ from 'jquery';

class MarketSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {selected: this.props.selected, markets: [], isOpen: false};
    this.onItemSelect = this.onItemSelect.bind(this);
    this.onOutsideClick = this.onOutsideClick.bind(this);
  }

  onOutsideClick() {
    this.setState({isOpen: false});
  }

  onItemSelect(item) {
    this.setState({isOpen: false});
    this.props.onItemSelect(item);
  }

  componentDidMount() {
    getMarketSummaries().then(json => {
      let markets = json.result;
      markets = markets.map(market => {
        const currencies = market.MarketName.split('-');
        return {
          MarketCurrency: currencies[1],
          BaseCurrency: currencies[0],
          Price: market.Last,
          Volume: market.Volume,
        };
      });
      this.setState({markets});
    });
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
  }

  render() {
    return(
      <div onClick={() => this.setState({isOpen: !this.state.isOpen})} id={this.props.targetId} className="dropdown-link-wrap">
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
    };
    this.onBaseCurrencySelected = this.onBaseCurrencySelected.bind(this);
    this.onSecondaryCurrencySelected = this.onSecondaryCurrencySelected.bind(this);
    this.onChange = this.onChange.bind(this);
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

  onSecondaryCurrencySelected(e, currency) {
    e.stopPropagation();
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
                <th>Currency <span className="icon icon-dir icon-down-dir"></span></th>
                <th>Price <span className="icon icon-dir icon-down-dir"></span></th>
                <th>Volume <span className="icon icon-dir icon-down-dir"></span></th>
                <th>Change <span className="icon icon-dir icon-down-dir"></span></th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.markets
                  .filter(m => m.MarketCurrency.toLowerCase().indexOf(this.state.filter.toLowerCase()) >= 0)
                  .map(m => (
                    <MarketRow
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

const MarketRow = ({market, onClick}) => (
  <tr onClick={(e) => onClick(e, market.MarketCurrency)} className="down">
    <td>{market.MarketCurrency}</td>
    <td>{market.Price}</td>
    <td>{Math.round(market.Volume)}</td>
    <td>-1.12</td>
  </tr>
);

export default MarketSelect;

import React from 'react';
import { Popover } from 'reactstrap';
import classNames from 'classnames';
import { getMarkets } from '../api/bittrex/bittrex';
import $ from 'jquery';

class MarketSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {selected: this.props.selected, markets: [], isOpen: false};
    this.onItemSelect = this.onItemSelect.bind(this);
  }

  onItemSelect(item) {
    this.setState({isOpen: false});
    this.props.onItemSelect(item);
  }

  componentDidMount() {
    getMarkets().then(json => {
      const markets = json.result;
      this.setState({markets});
    });
  }

  render() {
    return(
      <div onClick={() => this.setState({isOpen: !this.state.isOpen})} id={this.props.targetId} className="dropdown-link-wrap">
        <div className="dropdown-link">
          <span>{this.props.selected ? this.props.selected : this.props.header} <span className="arrow_down"/></span>
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
    this.state = {
      baseCurrency: props.market.split('-')[0],
      secondaryCurrency: props.market.split('-')[1],
    };
    this.onBaseCurrencySelected = this.onBaseCurrencySelected.bind(this);
    this.onSecondaryCurrencySelected = this.onSecondaryCurrencySelected.bind(this);
  }

  onBaseCurrencySelected(e, base) {
    e.stopPropagation();
    this.setState({baseCurrency: base, secondaryCurrency: null});
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
    const secondaryCurrency = this.state.secondaryCurrency;
    return (
      <div className="dropdown search">
        <div className="dropdown__name">
          <span>{this.props.market}</span>
          <span onClick={this.props.close} className="arrow_down"></span>
        </div>
        <form action="" className="dropdown__form">
          <input type="text" name="" className="input-search" placeholder="Search..."/>
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
                this.props.markets
                  .filter(m => m.BaseCurrency === this.state.baseCurrency)
                  .map(m => (
                    <MarketRow
                      onClick={this.onSecondaryCurrencySelected}
                      key={m.MarketCurrency}
                      currency={m.MarketCurrency}
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

const MarketRow = ({currency, onClick}) => (
  <tr onClick={(e) => onClick(e, currency)} data-currency={currency} className="down">
    <td>{currency}</td>
    <td>0.14</td>
    <td>9843.86</td>
    <td>-1.12</td>
  </tr>
);

export default MarketSelect;

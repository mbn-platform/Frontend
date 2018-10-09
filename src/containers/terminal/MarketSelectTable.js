import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import classNames from 'classnames';
import { defaultFormatValue } from '../../generic/util';
import ReactTable from '../../components/SelectableReactTable';
import {sortData, onColumnSort, classNameForColumnHeader}  from '../../generic/terminalSortFunctions';
import {selectMarket} from '../../actions/terminal';
import { connect } from 'react-redux';
import {FormattedMessage, injectIntl} from 'react-intl';
import createMqProvider, {querySchema} from '../../MediaQuery';

const { Screen} = createMqProvider(querySchema);

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
      dropDownHeight: 400,
    };
    this.onBaseCurrencySelected = this.onBaseCurrencySelected.bind(this);
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

  onSecondaryCurrencySelected = (e, rowInfo) => {
    e.stopPropagation();
    const currency = rowInfo.original.second;
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
    });
    this.setState({dropDownHeight: this.dropDownWrapper.current.offsetHeight - 180});
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

  getColumns = screenWidth => {
    const { baseCurrency } = this.state;
    const { balances, rates } = this.props;

    let balanceValue;
    const isBTC = baseCurrency === 'BTC';



    function calculateChange(currentMarketValue) {
      if(balances) {
        let c;
        c = balances.find(m => m.name === currentMarketValue.second);
        balanceValue = (c && c.available) || 0;
        balanceValue = balanceValue * rates[currentMarketValue.symbol];
      }

      const val=rates[currentMarketValue.symbol] ? rates[currentMarketValue.symbol] : '';
      const prevDay = currentMarketValue.prevDay;
      return prevDay ? (val / prevDay * 100 - 100) : null;
    }


    const marketColumns =  [
      {
        Header:
          <div onClick={() => this.onColumnSort('second')} className="table__header-wrapper">
            <FormattedMessage id="terminal.currency" defaultMessage="Currency"/>
            <span className={classNameForColumnHeader(this.state, 'second')}/>
          </div>,
        minWidth:  screenWidth === 'lg' ? 100 : 40,
        className: 'terminal__market-table-cell terminal__market-table-cell_color-white',
        Cell: row =>  (
          <div>
            {row.original.second}
          </div>
        )
      },
      {
        Header:   <div onClick={() => this.onColumnSort('last')} className="table__header-wrapper">
          <FormattedMessage id="terminal.price" defaultMessage="Price"/>
          <span className={classNameForColumnHeader(this.state, 'last')}/>
        </div>,
        className: 'terminal__market-table-cell',
        Cell: row => (
          <div>{defaultFormatValue(row.original.last, row.original.base)}</div>
        ),
        minWidth:  screenWidth === 'lg' ? 90 : 40,
      },
      {
        minWidth:  screenWidth === 'lg' ? 120 : 60,
        className: 'terminal__market-table-cell',
        Header: <div onClick={() => this.onColumnSort('volume')} className="table__header-wrapper">
          <FormattedMessage id="terminal.volumeCurrency" defaultMessage="Volume({baseCurrency})" values={{baseCurrency}}/>
          <span className={classNameForColumnHeader(this.state, 'volume')}/>
        </div>,
        Cell: row => Math.round(row.original.volume * row.original.last)
      },
      {
        Header: <div onClick={() => this.onColumnSort('change')} className="table__header-wrapper">
          <FormattedMessage id="terminal.change" defaultMessage="Change" values={{baseCurrency}}/>
          <span className={classNameForColumnHeader(this.state, 'change')}/>
        </div>,
        className: 'terminal__market-table-cell',
        minWidth:  screenWidth === 'lg' ? 130 : 40,
        Cell: row =>
          <div className={row.original.change >= 0 ? 'terminal__market-table-cell_up' : 'terminal__market-table-cell_down'}>
            {calculateChange(row.original).toFixed(2) + '%'}
          </div>
      },
    ];

    return [
      ...marketColumns,
      ...(this.props.balances ? [
        {
          Header: <div onClick={() => this.onColumnSort('Balance')} className="table__header-wrapper">
            <FormattedMessage id="terminal.balance" defaultMessage="Balance ({baseCurrency}) " values={{baseCurrency}}/>
            <span className={classNameForColumnHeader(this.state, 'Balance')}/><br/></div>,
          minWidth: 80,
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
        <Screen on={screenWidth => (
          <div style={{height: this.tableHeight + 'px'}} className="dropdown-table-wrapper js-dropdown-table-wrapper">
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
  const change = prevDay ? (val / prevDay * 100 - 100) : null;
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

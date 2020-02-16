import React from 'react';
import { connect } from 'react-redux';
import BigNumber from 'bignumber.js';
import { injectIntl } from 'react-intl';
import { compose, isNil, prop } from 'ramda';

import { commissionPercent, floorBinance } from 'utils/terminal';
import { defaultFormatValue, setFundId } from 'generic/util';
import { showInfoModal } from 'actions/modal';
import { placeOrder, placeAlgoOrder } from 'actions/terminal';
import { PlaceOrder } from './PlaceOrder';
import { OrderType } from './PlaceOrderType';
import { TAB_BUY, TAB_SELL } from './BuySellSwitch';
import { loggedInSelector, profileSelector } from 'selectors/auth';
import * as selectors from 'selectors/terminal';

class PlaceOrderContainer extends React.Component {
  state = {
    selectedOrderType: OrderType.LIMIT,
    selectedTab: TAB_BUY,
    amount: '',
    price: '',
    stopPrice: '',
    total: '',
    tickerSet: false,
  }

  constructor(props) {
    super(props);
    this.state.marketInfo = props.markets.find(m => m.symbol === props.market);
  }

  componentDidUpdate(prevProps, prevState) {
    const { markets, market, ticker, price, size } = this.props;

    if (markets !== prevProps.markets) {
      this.setState({ marketInfo: markets.find(m => m.symbol === market) });
    }

    if (prevProps.ticker !== ticker && !prevState.price && !prevState.tickerSet && prop('l', ticker)) {
      this.setState({ price: prop('l', ticker).toString(), tickerSet: true });
      this.setAmount(prevState.amount);
    }

    if ((price && price !== prevProps.price) || (size && size !== prevProps.size)) {
      let price = this.props.price || this.state.price;
      // let amount = this.props.size || this.state.amount;
      this.setPrice(price);
    }
  }

  onBuySellClick = (tab) => {
    if (this.state.selectedTab !== tab) {
      const newState = {selectedTab: tab};
      const amount = parseFloat(this.state.amount);
      const price = parseFloat(this.state.price);
      if(amount >= 0 && price >= 0) {
        const total = amount * price * commissionPercent(tab, this.props.exchange);
        newState.total = defaultFormatValue(total);
      }
      this.setState(newState);
    }
  }

  onOrderTypeSelected = (type) => {
    if (this.state.selectedOrderType !== type) {
      this.setState({selectedOrderType: type});
    }
  }

  onChange = (e) => {
    const {name, value} = e.target;
    if(value >= 0 || value === '') {
      this.setNewValue(name, value);
    }
  }

  onPercentSelected = (p) => {
    const { fund, market } = this.props;
    if (!fund || !market) {
      return;
    }
    const { selectedTab } = this.state;
    const [main, secondary] = market.split('-');
    let balance;
    switch (selectedTab) {
      case TAB_BUY:
        balance = fund.balances.find(b => b.name === main);
        if (balance) {
          const total = balance.available * (p / 100);
          this.setTotal(total.toFixed(8), true);
        }
        break;
      case TAB_SELL:
        balance = fund.balances.find(b => b.name === secondary);
        if (balance) {
          const amount = balance.available * (p / 100);
          this.setAmount(amount.toFixed(8));
        }
        break;
      default:
        break;
    }
  }

  onPlaceOrderClick = (e) => {
    e.preventDefault();
    if(!this.props.fund) {;
      this.props.showInfoModal('terminal.selectFund');
      return;
    }
    if (!this.state.amount || !this.state.price) {
      return;
    }
    const params = {
      symbol: this.props.market,
      amount: parseFloat(this.state.amount),
      price: parseFloat(this.state.price),
      type: this.state.selectedTab,
      orderType: this.state.selectedOrderType,
    };
    switch (params.orderType) {
      case 'stop-limit': {
        params.stopPrice = parseFloat(this.state.stopPrice);
        if (!params.stopPrice) {
          alert('Set stop price');
          return;
        }
        if (this.props.ticker && this.props.ticker.l) {
          const { l } = this.props.ticker;
          const condition = {
            params: {
              price: params.stopPrice,
            },
            order: {
              exchange: this.props.fund.exchange,
              symbol: params.symbol,
              amount: params.amount,
              side: params.type,
              limit: params.price,
              type: 'limit',
            },
          };
          if (params.stopPrice > l) {
            condition.type = 'PRICE_HIGHER';
          } else {
            condition.type = 'PRICE_LOWER';
          }
          condition.index = 0;
          const body = {conditions: [condition]};
          setFundId(body, this.props.fund);
          this.props.placeAlgoOrder(body);
        }
        break;
      }
      case 'limit': {
        setFundId(params, this.props.fund);
        this.props.placeOrder(params);
        this.setState({total: '', amount: ''});
        break;
      }
      default:
        break;
    }
  }

  setNewValue = (name, value) => {
    const components = value.split('.');
    if(components[1] && components[1].length > 8) {
      return;
    }
    switch(name) {
      case 'amount':
        this.setAmount(value);
        break;
      case 'total':
        this.setTotal(value);
        break;
      case 'price':
        this.setPrice(value);
        break;
      default:
        this.setState({[name]: value});
    }
  };

  render = () => {
    const {
      exchange, market, fund, loggedIn, profile, groupId,
    } = this.props;

    return (
      <PlaceOrder
        exchange={exchange}
        market={market}
        fund={fund}
        loggedIn={loggedIn}
        profile={profile}
        active={!isNil(groupId)}
        onBuySellClick={this.onBuySellClick}
        onOrderTypeSelected={this.onOrderTypeSelected}
        onChange={this.onChange}
        onPercentSelected={this.onPercentSelected}
        onPlaceOrderClick={this.onPlaceOrderClick}
        {...this.state}
      />
    );
  };

  setAmount(amount) {
    if(!amount) {
      this.setState({ total: '', amount: '' });
      return;
    }
    switch(this.props.exchange) {
      case 'huobi':
      case 'binance': {
        const minTradeSize = this.state.marketInfo ? this.state.marketInfo.minTradeSize.toString() : '';
        const rounded = floorBinance(amount, minTradeSize);
        const newState = {amount: rounded.toString()};
        const price = parseFloat(this.state.price);
        const value = parseFloat(rounded);
        if(price >= 0) {
          const total = value * price;
          newState.total = defaultFormatValue(total);
        }
        this.setState(newState);
      }
        break;
      case 'kucoin': {
        const minTradeSize = this.state.marketInfo ? this.state.marketInfo.tradeStep.toString() : '';
        const rounded = floorBinance(amount, minTradeSize);
        const price = parseFloat(this.state.price);
        const newState = {amount: rounded.toString()};
        if (price > 0) {
          const tab = this.state.selectedTab;
          const total = rounded * price * commissionPercent(tab, this.props.exchange);
          newState.total = defaultFormatValue(total);
        }
        this.setState(newState);
        break;
      }
      default: {
        const value = parseFloat(amount);
        if(value >= 0) {
          const newState = {amount: value};
          const price = parseFloat(this.state.price);
          if(price >= 0) {
            const tab = this.state.selectedTab;
            const total = value * price * commissionPercent(tab, this.props.exchange);
            newState.total = defaultFormatValue(total);
          }
          this.setState(newState);
        }
      }
    }
  }

  setTotal(total, minimize = false) {
    if(!total) {
      this.setState({amount: '', total: ''});
      return;
    }
    switch(this.props.exchange) {
      case 'huobi':
      case 'binance': {
        const price = parseFloat(this.state.price);
        const value = parseFloat(total);
        if(price >= 0) {
          const newState = {};
          const minTradeSize = this.state.marketInfo ? this.state.marketInfo.minTradeSize.toString() : '';
          const maxOrderSize = value / price;
          const rounded = floorBinance(maxOrderSize.toString(), minTradeSize);
          newState.amount = rounded;
          if (minimize) {
            newState.total = new BigNumber(price).times(rounded).toFixed();
          } else {
            newState.total = total;
          }
          this.setState(newState);
        } else {
          this.setState({total});
        }
      }
        break;
      case 'kucoin': {
        const newState = {};
        const value = parseFloat(total);
        const price = parseFloat(this.state.price);
        if (price >= 0) {
          const minTradeSize = this.state.marketInfo ? this.state.marketInfo.tradeStep.toString() : '';
          const maxOrderSize = value / price / commissionPercent(this.state.selectedTab, this.props.exchange);
          const rounded = floorBinance(maxOrderSize.toString(), minTradeSize);
          newState.amount = rounded;
          newState.total = value.toString();
        } else {
          newState.total = total.toString();
        }
        this.setState(newState);
        break;
      }
      default: {
        const value = parseFloat(total);
        if(value >= 0) {
          const newState = {total};
          const price = parseFloat(this.state.price);
          if(price >= 0) {
            const tab = this.state.selectedTab;
            const amount = value / commissionPercent(tab, this.props.exchange) / price;
            newState.amount = defaultFormatValue(amount);
          }
          this.setState(newState);
        }
      }
    }
  }

  setPrice(price) {
    if (!price) {
      this.setState({price: '', total: ''});
      return;
    }
    switch(this.props.exchange) {
      case 'binance': {
        const priceStep = this.state.marketInfo ? this.state.marketInfo.priceStep.toString() : '';
        const rounded = floorBinance(price, priceStep.toString());
        const newState = {price: rounded};
        const amount = parseFloat(this.state.amount);
        if(amount) {
          const total = parseFloat(rounded) * amount;
          newState.total = defaultFormatValue(total);
        }
        this.setState(newState);
        break;
      }
      case 'kucoin': {
        const priceStep = this.state.marketInfo ? this.state.marketInfo.priceStep.toString() : '';
        const rounded = floorBinance(price, priceStep.toString());
        const newState = {price: rounded};
        const amount = parseFloat(this.state.amount);
        if (amount >= 0) {
          const tab = this.state.selectedTab;
          const total = rounded * amount * commissionPercent(tab, this.props.exchange);
          newState.total = defaultFormatValue(total);
        }
        this.setState(newState);
        break;
      }
      default: {
        const value = parseFloat(price);
        if(value >= 0) {
          const newState = {price};
          const amount = parseFloat(this.state.amount);
          if(amount >= 0) {
            const tab = this.state.selectedTab;
            const total = price * amount * commissionPercent(tab, this.props.exchange);
            newState.total = defaultFormatValue(total);
          }
          this.setState(newState);
        }
      }
    }
  }
}

const mapStateToProps = state => {
  const market = selectors.marketSelector(state);
  const exchange = selectors.exchangeSelector(state);

  return {
    key: `${market}${exchange}`,
    market,
    exchange,
    profile: profileSelector(state),
    loggedIn: loggedInSelector(state),
    fund: selectors.controlSelector(state),
    ticker: selectors.tickerSelector(state),
    groupId: selectors.groupIdSelector(state),
    markets: selectors.exchangeMarketsSelector(state),
  };
};

const mapDispatchToProps = {
  placeOrder,
  showInfoModal,
  placeAlgoOrder,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl,
)(PlaceOrderContainer);

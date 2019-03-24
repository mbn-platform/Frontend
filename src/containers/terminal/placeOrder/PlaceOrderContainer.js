import React from 'react';
import { injectIntl} from 'react-intl';
import { connect } from 'react-redux';
import { PlaceOrder } from './PlaceOrder';
import { OrderType } from './PlaceOrderType';
import { TAB_BUY, TAB_SELL } from './BuySellSwitch';
import { defaultFormatValue, setFundId } from '../../../generic/util';
import { showInfoModal } from '../../../actions/modal';
import { placeOrder, placeAlgoOrder } from '../../../actions/terminal';

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
    if(this.props.markets !== prevProps.markets) {
      this.setState({marketInfo: this.props.markets.find(m => m.symbol === this.props.market)});
    }
    if (prevProps.ticker !== this.props.ticker &&
      !prevState.price && !prevState.tickerSet && this.props.ticker.l) {
      this.setState({price: this.props.ticker.l.toString(), tickerSet: true});
      this.setAmount(prevState.amount);
    }
    if ((this.props.price && this.props.price !== prevProps.price) ||
      (this.props.size && this.props.size !== prevProps.size) ||
      (this.props.type && this.props.type !== prevProps.type)) {
      let price = this.props.price || this.state.price;
      let amount = this.props.size || this.state.amount;
      const newState = {price, amount, selectedTab: this.props.type};
      price = parseFloat(price);
      const os = parseFloat(amount);
      if (price >= 0 && os >= 0) {
        switch(this.props.exchange) {
          case 'bittrex': {
            const total = os * price * (this.props.type === TAB_BUY ? 1.0025 : 0.9975);
            newState.total = defaultFormatValue(total);
            break;
          }
          case 'binance': {
            const total = os * price;
            newState.total = defaultFormatValue(total);
            break;
          }
          default:
            break;
        }
      }
      this.setState(newState);
    }
  }

  onBuySellClick = (tab) => {
    if (this.state.selectedTab !== tab) {
      const newState = {selectedTab: tab};
      const amount = parseFloat(this.state.amount);
      const price = parseFloat(this.state.price);
      if(amount >= 0 && price >= 0) {
        const total = amount * price * commissionPercent(tab, this.props.exchange);
        newState.amount = defaultFormatValue(total);
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
      this.props.showModalWindow('terminal.selectFund');
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

  render() {
    return (
      <PlaceOrder
        exchange={this.props.exchange}
        market={this.props.market}
        fund={this.props.fund}

        selectedTab={this.state.selectedTab}
        selectedOrderType={this.state.selectedOrderType}

        amount={this.state.amount}
        price={this.state.price}
        stopPrice={this.state.stopPrice}
        total={this.state.total}

        marketInfo={this.state.marketInfo}

        onBuySellClick={this.onBuySellClick}
        onOrderTypeSelected={this.onOrderTypeSelected}
        onChange={this.onChange}
        onPercentSelected={this.onPercentSelected}
        onPlaceOrderClick={this.onPlaceOrderClick}
      />
    );
  }

  setAmount(amount) {
    if(!amount) {
      this.setState({total: '', amount: ''});
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
            newState.total = (price * parseFloat(rounded)).toString();
          } else {
            newState.total = total;
          }
          this.setState(newState);
        } else {
          this.setState({total});
        }
      }
        break;
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
      default: {
        const value = parseFloat(price);
        if(value >= 0) {
          const newState = {price};
          const amount = parseFloat(this.state.amount);
          if(amount >= 0) {
            const tab = this.state.selectedTab;
            const total = price * amount * this.commissionPercent(tab, this.props.exchange);
            newState.total = defaultFormatValue(total);
          }
          this.setState(newState);
        }
      }
    }
  }
}

const mapStateToProps = state => {
  const { exchangesInfo, terminal: {market, exchange, ticker, fund}} = state;
  return {
    key: market + exchange,
    markets: ( exchangesInfo[exchange] || {}).markets || [],
    ticker,
    exchange,
    market,
    fund,
  };
};


const mapDispatchToProps = dispatch => ({
  showModalWindow: text => dispatch(showInfoModal(text)),
  placeOrder: order => dispatch(placeOrder(order)),
  placeAlgoOrder: order => dispatch(placeAlgoOrder(order)),
});
function commissionPercent(exchange, orderSide) {
  switch(exchange) {
    case 'bittrex': {
      return orderSide === TAB_BUY ? 1.0025 : 0.9975;
    }
    case 'huobi':
    case 'binance': {
      return 1;
    }
    default:
      return 1;
  }
}
function floorBinance(string, step) {
  let afterComma;
  if(step.startsWith('1e')) {
    afterComma = parseInt(step.split('-')[1], 10);
  } else {
    afterComma = (step.toString().split('.')[1] || '').length;
  }
  const numberAfterComma = (string.split('.')[1] || '').length;
  if(afterComma === 0) {
    return Math.floor(parseFloat(string)).toString();
  } else if(numberAfterComma > afterComma) {
    return string.slice(0, afterComma - numberAfterComma);
  } else {
    return string;
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(PlaceOrderContainer));

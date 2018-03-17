import React from 'react';
import classNames from 'classnames';
import { defaultFormatValue, formatFloat, formatBTCValue } from '../generic/util';
import { Desktop } from '../generic/MediaQuery';

export const TAB_BUY = 'buy';
export const TAB_SELL = 'sell';

class PlaceOrder extends React.Component {

  constructor(props) {
    super(props);
    const [main, secondary] = props.market.split('-');
    let price = props.ticker.last || '';
    if(price) {
      price = main === 'USDT' ? price.toFixed(2) : price.toFixed(8);
    }
    this.state = {
      main,
      secondary,
      selectedTab: TAB_BUY,
      orderSize: '',
      amount: '',
      price,
      ask : props.ticker.ask || null,
      bid : props.ticker.bid || null,
    };
    this.onTabClick = this.onTabClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    if(!this.props.selectedApiKey) {
      alert('select api key');
      return;
    }
    const cur = this.props.selectedApiKey.currencies.find(c => c.name === this.state.secondary);
    if(!(cur && cur.enabled)) {
      alert('The key does not allow to trade this pair');
      return;
    }
    const keyId = this.props.selectedApiKey._id;
    const params = {
      market: this.props.market,
      quantity: parseFloat(this.state.orderSize),
      rate: parseFloat(this.state.price),
      keyId,
    };
    const marketInfo = this.props.exchangeInfo.markets[this.props.market];
    if(marketInfo.minTradeSize > params.quantity) {
      alert(`The minimal trade size for this pair is ${marketInfo.minTradeSize} ${this.props.market.split('-')[1]}`);
      return;
    }
    switch(this.state.selectedTab) {
      case TAB_BUY:
        this.props.placeOrder(params, 'buy');
        this.setState({amount: '', orderSize: ''});
        break;
      case TAB_SELL:
        this.props.placeOrder(params, 'sell');
        this.setState({amount: '', orderSize: ''});
        break;
      default:
        break;
    }
    return;
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.market !== nextProps.market) {
      const [main, secondary] = nextProps.market.split('-');
      this.setState({bid: null, ask: null, price: '', main, secondary});
    }
    if(!this.props.ticker.bid &&
      this.props.ticker !== nextProps.ticker) {
      let price = nextProps.ticker.last || 0;
      const isUSDT = nextProps.market.split('-')[0] === 'USDT';
      price = isUSDT ? price.toFixed(2) : price.toFixed(8);
      this.setState({bid: nextProps.ticker.bid, ask: nextProps.ticker.ask, price});
    }
    if(nextProps.price && nextProps.price !== this.props.price) {
      this.setPrice(defaultFormatValue(nextProps.price, this.state.main));
    }
    if(nextProps.size && nextProps.size !== this.props.size) {
      this.setOrderSize(nextProps.size);
    }
    if(nextProps.type && nextProps.type !== this.props.type) {
      this.setState({selectedTab: nextProps.type});
    }
  }


  setPrice(price) {
    if(!price) {
      this.setState({price: '', amount: ''});
      return;
    }
    const value = parseFloat(price);
    if(value >= 0) {
      const newState = {price};
      if(this.state.orderSize > 0) {
        newState.amount = this.state.orderSize * value;
      }
      this.setState(newState);
    }
  }

  setAmount(amount) {
    if(!amount) {
      this.setState({amount: '', orderSize: ''});
    }
    const value = parseFloat(amount);
    if(value >= 0) {
      const orderSize = formatBTCValue(value / this.state.price);
      this.setState({orderSize, amount: value});
    }
  }

  setOrderSize(orderSize) {
    if(!orderSize) {
      this.setState({amount: '', orderSize: ''});
    }
    const amountCurrency = this.state.main;
    const value = parseFloat(orderSize);
    if(value >= 0) {
      let amount;
      if(amountCurrency !== 'USDT') {
        amount = formatBTCValue(this.state.price * value);
      } else {
        amount = (this.state.price * value).toFixed(2);
      }
      this.setState({amount, orderSize: value});
    }
  }


  onChange(e) {
    const {name} = e.target;
    switch(name) {
      case 'price':
        this.setPrice(e.target.value);
        break;
      case 'ordersize':
        this.setOrderSize(e.target.value);
        break;
      case 'amount':
        this.setAmount(e.target.value);
        break;
      default:
        break;
    }
  }

  onTabClick(tab) {
    this.setState({
      selectedTab: tab,
    });
  }

  render() {
    let minTradeSize = '';
    if(this.props.exchangeInfo && this.props.exchangeInfo.markets) {
      const marketInfo = this.props.exchangeInfo.markets[this.props.market];
      minTradeSize = marketInfo ? marketInfo.minTradeSize : '';
    }
    const usdtMarket = this.state.main === 'USDT';
    return (
      <div className="buysell col-12 col-sm-6 col-md-12">
        <div className="buysell__top justify-content-between row col-12">
          <div className="buysell__switch-wrap ">
            <span onClick={() => this.onTabClick(TAB_BUY)}
              className={classNames('buysell__switch', 'switch-buy', {active: this.state.selectedTab === TAB_BUY})}
            >BUY</span>
            <span onClick={() => this.onTabClick(TAB_SELL)}
              className={classNames('buysell__switch', 'switch-sell', {active: this.state.selectedTab === TAB_SELL})}
            >SELL</span>
          </div>
          <Desktop>
            <div className="chart-controls align-items-center justify-content-between row">
            </div>
          </Desktop>
        </div>
        <div className="buysell__main">
          <div className={classNames('buysell__main-tab', 'active', this.state.selectedTab === TAB_SELL ? 'sell' : 'buy')}>
            <form className="buysell__form">
              <div className="buysell__form-row">
                <div className="buysell__form-input-wrap">
                  <label className="buysell__form-label">
                    Order size ({this.state.secondary})
                  </label>
                  <input onChange={this.onChange}
                    placeholder={'min ' + minTradeSize}
                    value={this.state.orderSize} type="number" name='ordersize' className="buysell__form-input"/>
                </div>
                <div className="buysell__form-input-wrap">
                  <label className="buysell__form-label">
                    Price
                  </label>
                  <input onChange={this.onChange} value={this.state.price} type="number" name="price" className="buysell__form-input"/>
                </div>
              </div>
              <div className="buysell__form-row">
                <div className="buysell__form-input-wrap">
                  <label className="buysell__form-label">
                    Amount ({this.state.main})
                  </label>
                  <input onChange={this.onChange} type="number" value={this.state.amount} name="amount" className="buysell__form-input"/>
                </div>
                <button type="submit" onClick={this.onSubmit} className="buysell__form-submit">
                  {this.state.selectedTab === TAB_SELL ? 'SELL' : 'BUY'}
                </button>
              </div>
            </form>
          </div>
          <Balances
            apiKey={this.props.selectedApiKey}
            main={this.state.main}
            onMainClick={e => this.setAmount(e.target.innerHTML)}
            secondary={this.state.secondary}
            onSecondaryClick={e => this.setOrderSize(e.target.innerHTML)}
          />

        </div>
      </div>
    );
  }
}

const Balances = ({apiKey, main, secondary, onMainClick, onSecondaryClick}) => {
  let value1, value2;
  if(apiKey) {
    value1 = apiKey.currencies.find(c => c.name === main);
    value1 = value1 ? value1.availableBalance || 0 : undefined;
    value2 = apiKey.currencies.find(c => c.name === secondary);
    value2 = value2 ? value2.availableBalance || 0 : undefined;
  }
  return (
    <div className="balance-wrap">
      <Balance onClick={onMainClick} name={main} value={value1} />
      <Balance onClick={onSecondaryClick} name={secondary} value={value2}/>
    </div>
  );
};
function formatBalance(value, name) {
  if(value === undefined) {
    return null;
  }
  if(name === 'USDT') {
    return (value || 0).toFixed(2);
  } else {
    return (value || 0).toFixed(8);
  }
}

const Balance = ({name, value, onClick}) => (
  <div className="balance row">
    <div className="balance-name">{name}:</div>
    <div onClick={onClick} className="balance-val">{formatBalance(value, name)}</div>
  </div>
);

export default PlaceOrder;

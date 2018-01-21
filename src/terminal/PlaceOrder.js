import React from 'react';
import classNames from 'classnames';
import { getTicker } from '../api/bittrex/bittrex';
import { formatFloat, formatBTCValue } from '../generic/util';
import { Desktop } from '../generic/MediaQuery';
import { apiPost } from '../generic/apiCall';

const TAB_BUY = 0;
const TAB_SELL = 1;

class PlaceOrder extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: TAB_BUY,
      price: '',
      orderSize: '',
      amount: '',
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
    const second = this.props.market.split('-')[1];
    const cur = this.props.selectedApiKey.currencies.find(c => c.name === second);
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
    console.log(params);
    switch(this.state.selectedTab) {
      case TAB_BUY:
        this.props.placeOrder(params, 'buy');
        break;
      case TAB_SELL:
        this.props.placeOrder(params, 'sell');
        break;
    }
    return;
  }

  onChange(e) {
    const {name} = e.target;
    switch(name) {
      case 'price': {
        const stringValue = e.target.value;
        if(!stringValue) {
          this.setState({price: '', amount: ''});
        }
        const value = parseFloat(e.target.value);
        if(value >= 0) {
          if(this.state.orderSize > 0) {
            const amount = this.state.orderSize * value;
            this.setState({amount, price: value});
          } else {
            this.setState({price: value});
          }
        }
        break;
      }
      case 'ordersize': {
        const stringValue = e.target.value;
        if(!stringValue) {
          this.setState({amount: '', orderSize: ''});
        }
        const value = parseFloat(e.target.value);
        if(value >= 0) {
          let amount;
          if(this.state.amountCurrency !== 'USDT') {
            amount = formatBTCValue(this.state.price * value);
          } else {
            amount = (this.state.price * value).toFixed(2);
          }
          this.setState({amount, orderSize: value});
        }
        break;
      }
      case 'amount': {
        const stringValue = e.target.value;
        if(!stringValue) {
          this.setState({amount: '', orderSize: ''});
        }
        const value = parseFloat(e.target.value);
        if(value >= 0) {
          const orderSize = formatBTCValue(value / this.state.price);
          this.setState({orderSize, amount: value});
        }
        break;
      }
      default:
        break;
    }
  }

  onTabClick(tab) {
    const price = tab === TAB_SELL ? this.props.ticker.bid : this.props.ticker.ask;
    const amount = this.state.orderSize > 0 ? this.state.orderSize * price : this.state.amount;
    this.setState({
      selectedTab: tab,
      price: formatFloat(price, true),
      amount,
    });
  }

  render() {
    const isBTC = this.state.amountCurrency === 'BTC';
    const amountCurrency = this.props.market.split('-')[0];
    const orderCurrency = this.props.market.split('-')[1];
    return (
      <div className="buysell col-12 col-sm-6 col-md-12">
        <div className="buysell__top justify-content-between row col-12">
          <div className="buysell__switch-wrap ">
            <span onClick={() => this.onTabClick(TAB_BUY)}
              className={classNames('buysell__switch', 'switch-buy', {active: this.state.selectedTab === TAB_BUY})}
            >BUY <span className="val">{formatFloat(this.props.ticker.ask, isBTC)}</span></span>
            <span onClick={() => this.onTabClick(TAB_SELL)}
              className={classNames('buysell__switch', 'switch-sell', {active: this.state.selectedTab === TAB_SELL})}
            >SELL <span className="val">{formatFloat(this.props.ticker.bid, isBTC)}</span></span>
          </div>
          <Desktop>
            <div className="chart-controls align-items-center justify-content-between row">
              <div className="control-resize"></div>
              <div className="control-dash"></div>
            </div>
          </Desktop>
        </div>
        <div className="buysell__main">
          <div className={classNames('buysell__main-tab', 'active', this.state.selectedTab === TAB_SELL ? 'sell' : 'buy')}>
            <form onChange={this.onChange} className="buysell__form">
              <div className="buysell__form-row">
                <div className="buysell__form-input-wrap">
                  <label className="buysell__form-label">
                    Order size ({orderCurrency})
                  </label>
                  <input value={this.state.orderSize} type="number" name='ordersize' className="buysell__form-input"/>
                </div>
                <div className="buysell__form-input-wrap">
                  <label className="buysell__form-label">
                    Price
                  </label>
                  <input value={this.state.price} type="number" name="price" className="buysell__form-input"/>
                </div>
              </div>
              <div className="buysell__form-row">
                <div className="buysell__form-input-wrap">
                  <label className="buysell__form-label">
                    Amount ({amountCurrency})
                  </label>
                  <input type="number" value={this.state.amount} name="amount" className="buysell__form-input"/>
                </div>
                <button type="submit" onClick={this.onSubmit} className="buysell__form-submit"> Place order</button>
              </div>
            </form>
          </div>

        </div>
      </div>
    );
  }
}

export default PlaceOrder;

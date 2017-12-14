import React from 'react';
import classNames from 'classnames';
import { getTicker } from '../api/bittrex/bittrex';
import { formatFloat } from '../generic/util';

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
      bid: '',
      ask: '',
      amountCurrency: this.props.market.split('-')[0],
      orderCurrency: this.props.market.split('-')[1],
    };
    this.onTabClick = this.onTabClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.updateTicker = this.updateTicker.bind(this);
  }

  updateTicker() {
    getTicker(this.props.market)
      .then(json => {
        if(json.success) {
          const {Bid: bid, Ask: ask} = json.result;
          this.setState({bid, ask});
        }
      })
      .catch(err => console.log(err));
  }

  componentDidMount() {
    const interval = setInterval(this.updateTicker, 5000);
    this.interval = interval;
    this.updateTicker();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onSubmit(e) {
    e.preventDefault();
    switch(this.state.selectedTab) {
      case TAB_BUY:
        console.log('placing buy order');
        break;
      case TAB_SELL:
        console.log('placing sell order');
        break;
      default:
        break;
    }
  }

  onChange(e) {
    const {name} = e.target;
    switch(name) {
      case 'price': {
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
        const value = parseFloat(e.target.value);
        console.log(value);
        if(value >= 0) {
          const amount = this.state.price * value;
          this.setState({amount, orderSize: value});
        }
        break;
      }
      case 'amount': {
        const value = parseFloat(e.target.value);
        if(value >= 0) {
          const orderSize = value / this.state.price;
          this.setState({orderSize, amount: value});
        }
        break;
      }
      default:
        break;
    }
  }

  onTabClick(tab) {
    const price = tab === TAB_SELL ? this.state.bid : this.state.ask;
    const amount = this.state.orderSize > 0 ? this.state.orderSize * price : this.state.amount;
    this.setState({
      selectedTab: tab,
      price: formatFloat(price),
      amount,
    });
  }

  render() {
    return (
      <div className="buysell col-12 col-sm-6 col-md-12">
        <div className="buysell__top justify-content-between row col-12">
          <div className="buysell__switch-wrap ">
            <span onClick={() => this.onTabClick(TAB_BUY)}
              className={classNames('buysell__switch', 'switch-buy', {active: this.state.selectedTab === TAB_BUY})}
            >BUY <span className="val">{formatFloat(this.state.ask)}</span></span>
            <span onClick={() => this.onTabClick(TAB_SELL)}
              className={classNames('buysell__switch', 'switch-sell', {active: this.state.selectedTab === TAB_SELL})}
            >SELL <span className="val">{formatFloat(this.state.bid)}</span></span>
          </div>
          <div className="chart-controls align-items-center justify-content-between row">
            <div className="control-resize"></div>
            <div className="control-dash"></div>
          </div>
        </div>
        <div className="buysell__main">
          <div className={classNames('buysell__main-tab', 'active', this.state.selectedTab === TAB_SELL ? 'sell' : 'buy')}>
            <form onChange={this.onChange} onSubmit={this.onSubmit} className="buysell__form">
              <div className="buysell__form-row">
                <div className="buysell__form-input-wrap">
                  <label className="buysell__form-label">
                    Order size ({this.state.orderCurrency})
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
                    Amount ({this.state.amountCurrency})
                  </label>
                  <input type="number" value={this.state.amount} name="amount" className="buysell__form-input"/>
                </div>
                <button type="submit" className="buysell__form-submit"> Place order</button>
              </div>
            </form>
          </div>

        </div>
      </div>
    );
  }
}

export default PlaceOrder;

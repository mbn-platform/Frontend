import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import BigNumber from 'bignumber.js';
import {defaultFormatValue, setFundId} from '../../generic/util';
import { Desktop } from '../../generic/MediaQuery';
import {FormattedMessage, injectIntl} from 'react-intl';
import {connect} from 'react-redux';
import {showInfoModal} from '../../actions/modal';

export const TAB_BUY = 'buy';
export const TAB_SELL = 'sell';

class PlaceOrder extends React.Component {

  constructor(props) {
    super(props);
    const [main, secondary] = props.market.split('-');
    let price = props.ticker.last || '';
    if(price) {
      price = price.toString(10);
    }
    this.state = {
      main,
      secondary,
      selectedTab: TAB_BUY,
      orderSize: '',
      amount: '',
      price,
      tickerSet: false,
      marketInfo: props.markets.find(m => m.symbol === props.market),
    };
    this.onTabClick = this.onTabClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    if(!this.props.fund) {;
      this.props.showModalWindow('terminal.selectFund')
      return;
    }
    let params = {
      symbol: this.props.market,
      amount: parseFloat(this.state.orderSize),
      price: parseFloat(this.state.price),
    };
    params = setFundId(params, this.props.fund);
    switch(this.state.selectedTab) {
      case TAB_BUY:
        params.type = 'buy';
        break;
      case TAB_SELL:
        params.type = 'sell';
        break;
      default:
        break;
    }
    this.props.placeOrder(params);
    this.setState({amount: '', orderSize: ''});
    return;
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.markets !== nextProps.markets) {
      this.setState({marketInfo: nextProps.markets.find(m => m.symbol === nextProps.market)});
    }
    if(this.props.ticker !== nextProps.ticker &&
      !this.state.price && !this.state.tickerSet && nextProps.ticker.l) {
      this.setState({price: nextProps.ticker.l, tickerSet: true});
      this.setOrderSize(this.state.orderSize);
    }
    if((nextProps.price && nextProps.price !== this.props.price) ||
      (nextProps.size && nextProps.size !== this.props.size) ||
      (nextProps.type && nextProps.type !== this.props.type)) {
      let price = nextProps.price || this.state.price;
      let orderSize = nextProps.size || this.state.orderSize;
      price = new BigNumber(price).toString(10);
      const os = new BigNumber(orderSize).toString(10);
      const newState = {price, orderSize, selectedTab: nextProps.type};
      if(price >= 0 && os >= 0) {
        switch(this.props.exchange) {
          case 'bittrex': {
            const amount = os * price * (nextProps.type === TAB_BUY ? 1.0025 : 0.9975);
            newState.amount = defaultFormatValue(amount);
            break;
          }
          case 'binance': {
            const amount = os * price;
            newState.amount = defaultFormatValue(amount);
            break;
          }
          default:
            break;
        }
      }
      this.setState(newState);
    }
  }


  setPrice(price) {
    if(!price) {
      this.setState({price: '', amount: ''});
      return;
    }
    switch(this.props.exchange) {
      case 'binance': {
        const minPriceSize = this.state.marketInfo ? this.state.marketInfo.minPriceSize.toString() : '';
        const rounded = this.floorBinance(price, new BigNumber(minPriceSize));
        const newState = {price: rounded};
        const orderSize = new BigNumber(this.state.orderSize).toString(10);
        if(orderSize) {
          const amount = new BigNumber(rounded).multipliedBy(orderSize).toString(10);
          newState.amount = defaultFormatValue(amount);
        }
        this.setState(newState);
        break;
      }
      default: {
        const value = new BigNumber(price).toString(10);
        if(value >= 0) {
          const newState = {price};
          const orderSize = new BigNumber(this.state.orderSize).toString(10);
          if(orderSize >= 0) {
            const amount = price * orderSize * this.commissionPercent(this.props.type);
            newState.amount = defaultFormatValue(amount);
          }
          this.setState(newState);
        }
      }
    }
  }

  setAmount(amount) {
    if(!amount) {
      this.setState({amount: '', orderSize: ''});
      return;
    }
    switch(this.props.exchange) {
      case 'binance': {
        const price = new BigNumber(this.state.price).toString(10);
        const value = new BigNumber(amount).toString(10);
        if(price >= 0) {
          const minTradeSize = this.state.marketInfo ? new BigNumber(this.state.marketInfo.minTradeSize).toString(10) : '';
          const maxOrderSize = value / price;
          const rounded = this.floorBinance(new BigNumber(maxOrderSize).toString(10), minTradeSize);
          this.setState({orderSize: rounded, amount});
        } else {
          this.setState({amount});
        }
      }
        break;
      default: {
        const value = new BigNumber(amount).toString(10);
        if(value >= 0) {
          const newState = {amount};
          const price = new BigNumber(this.state.price).toString(10);
          if(price >= 0) {
            const orderSize = value / this.commissionPercent(this.props.type) / price;
            newState.orderSize = defaultFormatValue(orderSize);
          }
          this.setState(newState);
        }
      }
    }
  }

  setOrderSize(orderSize) {
    if(!orderSize) {
      this.setState({amount: '', orderSize: ''});
      return;
    }
    switch(this.props.exchange) {
      case 'binance': {
        const minTradeSize = this.state.marketInfo ? new BigNumber(this.state.marketInfo.minTradeSize).toString(10) : '';
        const rounded = this.floorBinance(orderSize, minTradeSize);
        const newState = {orderSize: new BigNumber(rounded).toString(10)};
        const price = new BigNumber(this.state.price).toString(10);
        const value = new BigNumber(rounded).toString(10);
        if(price >= 0) {
          const amount = value * price;
          newState.amount = defaultFormatValue(amount);
        }
        this.setState(newState);
      }
        break;
      default: {
        const value = new BigNumber(orderSize).toString(10);
        if(value >= 0) {
          const newState = {orderSize: value};
          const price = new BigNumber(this.state.price).toString(10);
          if(price >= 0) {
            const amount = value * price * this.commissionPercent(this.props.type);
            newState.amount = defaultFormatValue(amount);
          }
          this.setState(newState);
        }
      }
    }
  }

  floorBinance(string, step) {
    let afterComma;
    if(step.startsWith('1e')) {
      afterComma = parseInt(step.split('-')[1], 10);
    } else {
      afterComma = new BigNumber(step).decimalPlaces();
    }
    const numberAfterComma = new BigNumber(string).decimalPlaces();
    if(afterComma === 0) {
      return Math.floor(new BigNumber(string).toString(10));
    } else if(numberAfterComma > afterComma) {
      return new BigNumber(string.slice(0, afterComma - numberAfterComma)).toString(10);
    } else {
      return string;
    }
  }

  commissionPercent(orderSide) {
    switch(this.props.exchange) {
      case 'bittrex': {
        return orderSide === TAB_BUY ? 1.0025 : 0.9975;
      }
      case 'binance': {
        return 1;
      }
      default:
        return 1;
    }
  }

  setNewValue = (name, value) => {
    switch(name) {
      case 'price':
        this.setPrice(value);
        break;
      case 'ordersize':
        this.setOrderSize(value);
        break;
      case 'amount':
        this.setAmount(value);
        break;
      default:
        break;
    }
  };

  onChange(e) {
    const {name, value} = e.target;
    const components = value.split('.');
    if(components[1] && components[1].length > 8) {
      return;
    }
    if(value >= 0 || value === '') {
      this.setNewValue(name, value);
    }
  }

  onTabClick(tab) {
    const newState = {selectedTab: tab};
    const orderSize = new BigNumber(this.state.orderSize).toString(10);
    const price = new BigNumber(this.state.price).toString(10);
    if(orderSize >= 0 && price >= 0) {
      const amount = orderSize * price * this.commissionPercent(tab);
      newState.amount = defaultFormatValue(amount);
    }
    this.setState(newState);
  }

  render() {
    const minTradeSize = this.state.marketInfo ? this.state.marketInfo.minTradeSize : '';
    return (
      <div className="buysell col-12 col-sm-6 col-md-12">
        <div className="buysell__top justify-content-between row col-12">
          <div className="buysell__switch-wrap ">
            <span onClick={() => this.onTabClick(TAB_BUY)}
              className={classNames('buysell__switch', 'switch-buy', {active: this.state.selectedTab === TAB_BUY})}>
              <FormattedMessage id="terminal.buy" defaultMessage="BUY"/>
            </span>
            <span onClick={() => this.onTabClick(TAB_SELL)}
              className={classNames('buysell__switch', 'switch-sell', {active: this.state.selectedTab === TAB_SELL})}
            >
              <FormattedMessage id="terminal.sell" defaultMessage="SELL"/>
            </span>
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
                    <FormattedMessage id="terminal.orderSize"
                      defaultMessage="Order size ({secondary})"
                      values={{secondary: this.state.secondary}}/>
                  </label>
                  <input onChange={this.onChange}
                    placeholder={'min ' + minTradeSize}
                    value={this.state.orderSize} type="number" name='ordersize' className="buysell__form-input"/>
                </div>
                <div className="buysell__form-input-wrap">
                  <label className="buysell__form-label">
                    <FormattedMessage id="terminal.price"
                      defaultMessage="Price"/>
                  </label>
                  <input onChange={this.onChange} value={this.state.price} type="number" name="price" className="buysell__form-input"/>
                </div>
              </div>
              <div className="buysell__form-row">
                <div className="buysell__form-input-wrap">
                  <label className="buysell__form-label">
                    <FormattedMessage id="terminal.amountLabel"
                      defaultMessage="Amount ({amount})" values={{amount: this.state.main}}/>
                  </label>
                  <input onChange={this.onChange} type="number" value={this.state.amount} name="amount" className="buysell__form-input"/>
                </div>
                <button type="submit" onClick={this.onSubmit} className="buysell__form-submit">
                  {this.state.selectedTab === TAB_SELL ? this.props.intl.messages['terminal.sell'] : this.props.intl.messages['terminal.buy']}
                </button>
              </div>
            </form>
          </div>
          <Balances
            fund={this.props.fund}
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

PlaceOrder.propTypes = {
  market: PropTypes.string.isRequired,
  markets: PropTypes.array.isRequired,
  placeOrder: PropTypes.func.isRequired,
};

const Balances = ({fund, main, secondary, onMainClick, onSecondaryClick}) => {
  let value1, value2;
  if(fund) {
    const balances = fund.balances;
    value1 = balances.find(b => b.name === main);
    value1 = (value1 && value1.available) || 0;
    value2 = balances.find(b => b.name === secondary);
    value2 = (value2 && value2.available) || 0;
  }
  return (
    <div className="balance-wrap">
      <Balance onClick={onMainClick} name={main} value={value1} />
      <Balance onClick={onSecondaryClick} name={secondary} value={value2}/>
    </div>
  );
};
function formatBalance(value) {
  if(value === undefined) {
    return null;
  }
  return defaultFormatValue(value);
}

const Balance = ({name, value, onClick}) => (
  <div className="balance row">
    <div className="balance-name">{name}:</div>
    <div onClick={onClick} className="balance-val">{formatBalance(value, name)}</div>
  </div>
);

const mapDispatchToProps = dispatch => ({
  showModalWindow: text => dispatch(showInfoModal(text)),
});

export default injectIntl(connect(state => state, mapDispatchToProps)(PlaceOrder));
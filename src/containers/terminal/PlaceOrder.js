import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {defaultFormatValue, setFundId} from '../../generic/util';
import {FormattedMessage, injectIntl} from 'react-intl';
import {connect} from 'react-redux';
import {showInfoModal} from '../../actions/modal';
import {placeOrder} from '../../actions/terminal';
import { Col, Row, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export const TAB_BUY = 'buy';
export const TAB_SELL = 'sell';

const OrderType = {
  LIMIT: 'limit',
  STOP_LOSS_LIMIT: 'stop_loss_limit',
  TAKE_PROFIT_LIMIT: 'take_profit_limit',
};

const OrderTypeSelectOptions = {
  TRIGGER: 'TRIGGER',
  LIMIT: 'LIMIT',
};

class PlaceOrder extends React.Component {

  constructor(props) {
    super(props);
    const [main, secondary] = props.market.split('-');
    let price = (props.ticker || {}).last || '';
    if(price) {
      price = price.toString();
    }
    this.state = {
      orderType: OrderTypeSelectOptions.LIMIT,
      main,
      secondary,
      selectedTab: TAB_BUY,
      orderSize: '',
      amount: '',
      price,
      stopPrice: '',
      tickerSet: false,
      marketInfo: props.markets.find(m => m.symbol === props.market),
    };
    this.onTabClick = this.onTabClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onOrderTypeSelect = (orderType) => this.setState({orderType})

  onSubmit(e) {
    e.preventDefault();
    if(!this.props.fund) {;
      this.props.showModalWindow('terminal.selectFund');
      return;
    }
    let params = {
      symbol: this.props.market,
      amount: parseFloat(this.state.orderSize),
      price: parseFloat(this.state.price),
    };
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
    switch(this.state.orderType) {
      case OrderTypeSelectOptions.LIMIT:
        params.orderType = OrderType.LIMIT;
        break;
      case OrderTypeSelectOptions.TRIGGER:
        if (!this.props.ticker) {
          return;
        }
        const stopPrice = parseFloat(this.state.stopPrice);
        if (!stopPrice) {
          return;
        }
        params.orderType = getOrderType(stopPrice, this.props.ticker.l, params.type);
        params.stopPrice = stopPrice;
        break;
      default:
        break;
    }
    if (this.state.stopPrice) {
      if (!this.props.ticker) {
        return;
      }
      const stopPrice = parseFloat(this.state.stopPrice);
      params.stopPrice = stopPrice;
      params.orderType = getOrderType(stopPrice, this.props.ticker.l, params.type);
    } else {
      params.orderType = OrderType.LIMIT;
    }
    params = setFundId(params, this.props.fund);
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
      price = parseFloat(price);
      const os = parseFloat(orderSize);
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
        const priceStep = this.state.marketInfo ? this.state.marketInfo.priceStep.toString() : '';
        const rounded = this.floorBinance(price, priceStep.toString());
        const newState = {price: rounded};
        const orderSize = parseFloat(this.state.orderSize);
        if(orderSize) {
          const amount = parseFloat(rounded) * orderSize;
          newState.amount = defaultFormatValue(amount);
        }
        this.setState(newState);
        break;
      }
      default: {
        const value = parseFloat(price);
        if(value >= 0) {
          const newState = {price};
          const orderSize = parseFloat(this.state.orderSize);
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
      case 'huobi':
      case 'binance': {
        const price = parseFloat(this.state.price);
        const value = parseFloat(amount);
        if(price >= 0) {
          const minTradeSize = this.state.marketInfo ? this.state.marketInfo.minTradeSize.toString() : '';
          const maxOrderSize = value / price;
          const rounded = this.floorBinance(maxOrderSize.toString(), minTradeSize);
          this.setState({orderSize: rounded, amount});
        } else {
          this.setState({amount});
        }
      }
        break;
      default: {
        const value = parseFloat(amount);
        if(value >= 0) {
          const newState = {amount};
          const price = parseFloat(this.state.price);
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
      case 'huobi':
      case 'binance': {
        const minTradeSize = this.state.marketInfo ? this.state.marketInfo.minTradeSize.toString() : '';
        const rounded = this.floorBinance(orderSize, minTradeSize);
        const newState = {orderSize: rounded.toString()};
        const price = parseFloat(this.state.price);
        const value = parseFloat(rounded);
        if(price >= 0) {
          const amount = value * price;
          newState.amount = defaultFormatValue(amount);
        }
        this.setState(newState);
      }
        break;
      default: {
        const value = parseFloat(orderSize);
        if(value >= 0) {
          const newState = {orderSize: value};
          const price = parseFloat(this.state.price);
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
      afterComma = (step.toString().split('.')[1] || '').length;
    }
    const numberAfterComma = (string.split('.')[1] || '').length;
    if(afterComma === 0) {
      return Math.floor(parseFloat(string)).toString();
    } else if(numberAfterComma > afterComma) {
      return parseFloat(string.slice(0, afterComma - numberAfterComma));
    } else {
      return string;
    }
  }

  commissionPercent(orderSide) {
    switch(this.props.exchange) {
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
      case 'stopPrice':
        this.setState({[name]: value});
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
    const orderSize = parseFloat(this.state.orderSize);
    const price = parseFloat(this.state.price);
    if(orderSize >= 0 && price >= 0) {
      const amount = orderSize * price * this.commissionPercent(tab);
      newState.amount = defaultFormatValue(amount);
    }
    this.setState(newState);
  }

  render() {
    const minTradeSize = this.state.marketInfo ? this.state.marketInfo.minTradeSize : '';
    return (
      <Col className="buysell" sm="12" md="12" lg="4">
        <Row>
          <Col xs="6">
            <BuySellSwitch selectedTab={this.state.selectedTab} onTabClick={this.onTabClick} />
          </Col>
          <Col xs="6">
            <OrderTypeSelect
              onTypeSelected={this.onOrderTypeSelect}
              selectedItem={this.state.orderType}
            />
          </Col>
        </Row>
        <Row>
          <Col xs="6">
            <PlaceOrderInput
              message={(
                <FormattedMessage id="terminal.orderSize"
                  defaultMessage="Order size ({secondary})"
                  values={{secondary: this.state.secondary}}
                />
              )}
              placeholder={'min ' + minTradeSize}
              onChange={this.onChange}
              value={this.state.orderSize}
              name="ordersize"
            />
          </Col>

          <Col xs="6">
            <PlaceOrderInput
              message={(
                <FormattedMessage
                  id="terminal.price"
                  defaultMessage="Price"
                />
              )}
              onChange={this.onChange}
              value={this.state.price}
              name="price"
            />
          </Col>

        </Row>
        <Row>
          <Col xs="6">
            <PlaceOrderInput
              message={(
                <FormattedMessage id="terminal.amountLabel"
                  defaultMessage="Amount ({amount})" values={{amount: this.state.main}}/>
              )}
              onChange={this.onChange}
              value={this.state.amount}
              name="amount"
            />
          </Col>
          {this.state.orderType === 'LIMIT' ? null : (
            <Col xs="6">
              <PlaceOrderInput
                onChange={this.onChange}
                name="stopPrice"
                message={(
                  <FormattedMessage id="terminal.triggerPrice"
                    defaultMessage="Trigger price"
                  />
                )}
                value={this.state.stopPrice}
              />
            </Col>
          )}

        </Row>
        <Row>
          <Col xs="6">
            <Balances
              fund={this.props.fund}
              main={this.state.main}
              onMainClick={e => this.setAmount(e.target.innerHTML)}
              secondary={this.state.secondary}
              onSecondaryClick={e => this.setOrderSize(e.target.innerHTML)}
            />
          </Col>
          <Col xs="6" className="align-items-center d-flex">
            <button type="submit" onClick={this.onSubmit} className="buysell__form-submit">
              {this.state.selectedTab === TAB_SELL ? this.props.intl.messages['terminal.sell'] : this.props.intl.messages['terminal.buy']}
            </button>
          </Col>
        </Row>
      </Col>
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

class BuySellSwitch extends React.PureComponent {
  render() {
    const {selectedTab, onTabClick} = this.props;
    return (
      <div className="buysell__switch-wrap ">
        <span onClick={() => onTabClick(TAB_BUY)}
          className={classNames('buysell__switch', 'switch-buy', {active: selectedTab === TAB_BUY})}>
          <FormattedMessage id="terminal.buy" defaultMessage="BUY"/>
        </span>
        <span onClick={() => onTabClick(TAB_SELL)}
          className={classNames('buysell__switch', 'switch-sell', {active: selectedTab === TAB_SELL})}
        >
          <FormattedMessage id="terminal.sell" defaultMessage="SELL"/>
        </span>
      </div>
    );
  }
}

class PlaceOrderInput extends React.PureComponent {
  render() {
    const { message, onChange, placeholder, value, name } = this.props;
    return (
      <div>
        <label className="buysell__form-label">
          {message}
        </label>
        <input onChange={onChange}
          placeholder={placeholder}
          value={value} type="number" name={name} className="buysell__form-input"/>
      </div>
    );
  }
}

class OrderTypeSelect extends React.PureComponent {

  state = {
    isOpen: false,
  };

  toggle = () => {
    this.setState({isOpen: !this.state.isOpen});
  }
  render() {
    const {selectedItem, onTypeSelected} = this.props;
    return (
      <div>
        <label className="buysell__form-label">
          <FormattedMessage id="terminal.orderType"
            defaultMessage="Order type"
          />

        </label>
        <Dropdown group={true} isOpen={this.state.isOpen} toggle={this.toggle}>
          <DropdownToggle tag="div" caret>
            {selectedItem}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              onClick={(e) => onTypeSelected(OrderTypeSelectOptions.LIMIT)}
              active={selectedItem === OrderTypeSelectOptions.LIMIT}
            >
              <FormattedMessage id="terminal.orderTypeLimit"
                defaultMessage="Limit"
              />
            </DropdownItem>
            <DropdownItem
              onClick={(e) => onTypeSelected(OrderTypeSelectOptions.TRIGGER)}
              active={selectedItem === OrderTypeSelectOptions.TRIGGER}
            >
              <FormattedMessage id="terminal.orderTypeTrigger"
                defaultMessage="Trigger Limit"
              />
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}


function getOrderType(stopPrice, lastPrice, side) {
  if ((stopPrice > lastPrice && side === TAB_BUY)
    || (stopPrice < lastPrice && side === TAB_SELL)) {
    return OrderType.STOP_LOSS_LIMIT;
  } else {
    return OrderType.TAKE_PROFIT_LIMIT;
  }
}


const mapDispatchToProps = dispatch => ({
  showModalWindow: text => dispatch(showInfoModal(text)),
  placeOrder: order => dispatch(placeOrder(order)),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(PlaceOrder));

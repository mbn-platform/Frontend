import BigNumber from 'bignumber.js';
import React from 'react';
import { connect } from 'react-redux';
import { PlaceOrder } from './PlaceOrder';
import { OrderType } from './PlaceOrderType';
import { TAB_BUY, TAB_SELL } from './BuySellSwitch';
import { setFundId } from '../../../generic/util';
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
      this.setState({price: BigNumber(this.props.ticker.l).toFixed(), tickerSet: true});
      this.setAmount(prevState.amount);
    }
    if ((this.props.price && this.props.price !== prevProps.price) ||
      (this.props.size && this.props.size !== prevProps.size)) {
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
        const total = getTotalForExchange(new BigNumber(amount), new BigNumber(price),
          this.props.exchange, tab);
        newState.total = total.toFixed();
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
    switch (name) {
      case 'amount': {
        this.setAmount(value);
        break;
      }
      case 'price': {
        this.setPrice(value);
        break;
      }
      case 'total': {
        this.setTotal(value);
        break;
      }
      case 'stopPrice': {
        this.setStopPrice(value);
        break;
      }
      default:
        break;
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

  render() {
    return (
      <PlaceOrder
        exchange={this.props.exchange}
        market={this.props.market}
        fund={this.props.fund}
        auth={this.props.auth}
        assetGroup={this.props.assetGroup}

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
    if (amount === '') {
      this.setState({
        total: '',
        amount: '',
      });
    } else {
      const bn = new BigNumber(amount);
      if (bn.isNaN()) {
        return;
      } else if (bn.eq(0)) {
        this.setState({
          total: '0',
          amount,
        });
      } else if (bn.eq(this.state.amount)) {
        this.setState({
          amount,
        });
      } else {
        let tradeStep;
        if (this.props.exchange === 'bittrex') {
          tradeStep = new BigNumber(1e-8);
        } else {
          tradeStep = new BigNumber(this.state.marketInfo ?
            this.state.marketInfo.tradeStep : 1e-8);
        }
        const formattedAmount = floorWithStep(bn, tradeStep);
        const newState = {amount: formattedAmount.toFixed()};
        const price = new BigNumber(this.state.price);
        if (!price.isNaN() && price.gt(0)) {
          const total = getTotalForExchange(formattedAmount, price,
            this.props.exchange, this.state.selectedTab);
          newState.total = total.toFixed();
        }
        this.setState(newState);
      }
    }
    return;
  }

  setTotal(total, minimize = false) {
    if (total === '') {
      this.setState({amount: '', total: ''});
      return;
    }
    const bnTotal = new BigNumber(total);
    if (bnTotal.isNaN()) {
      return;
    }
    if (bnTotal.eq(this.state.total)) {
      this.setState({
        total,
      });
      return;
    }
    const flooredTotal = floorWithStep(bnTotal, new BigNumber(1e-8));
    const price = new BigNumber(this.state.price);
    const newState = {total: flooredTotal.toFixed()};
    if (!price.isNaN() && price.gt(0)) {
      let tradeStep;
      if (this.props.exchange === 'bittrex') {
        tradeStep = new BigNumber(1e-8);
      } else {
        tradeStep = new BigNumber(this.state.marketInfo ?
          this.state.marketInfo.tradeStep : 1e-8);
      }
      const amount = getAmountForExchange(flooredTotal, price,
        this.props.exchange, this.state.selectedTab);
      const flooredAmount = floorWithStep(amount, tradeStep);
      newState.amount = flooredAmount.toFixed();
    }
    this.setState(newState);
  }

  setPrice(price) {
    if (price === '') {
      this.setState({price: '', total: ''});
      return;
    }
    const bnPrice = new BigNumber(price);
    if (bnPrice.isNaN()) {
      return;
    }
    if (bnPrice.eq(this.state.price)) {
      this.setState({
        price,
      });
      return;
    }
    let priceStep;
    if (this.props.exchange === 'bittrex') {
      priceStep = new BigNumber(1e-8);
    } else {
      priceStep = new BigNumber(this.state.marketInfo ?
        this.state.marketInfo.priceStep : 1e-8);
    }
    const flooredPrice = floorWithStep(bnPrice, priceStep);
    const newState = {price: flooredPrice.toFixed()};
    const amount = new BigNumber(this.state.amount);
    if (!amount.isNaN() && amount.gt(0)) {
      const total = getTotalForExchange(amount, flooredPrice,
        this.props.exchange, this.state.selectedTab);
      newState.total = total.toFixed();
    }
    this.setState(newState);
  }

  setStopPrice(price) {
    if (price === '') {
      this.setState({stopPrice: ''});
      return;
    }
    const bnPrice = new BigNumber(price);
    if (bnPrice.isNaN()){
      return;
    }
    if (bnPrice.eq(this.state.stopPrice)) {
      this.setState({
        stopPrice: price,
      });
      return;
    }
    let priceStep;
    if (this.props.exchange === 'bittrex') {
      priceStep = new BigNumber(1e-8);
    } else {
      priceStep = new BigNumber(this.state.marketInfo ?
        this.state.marketInfo.priceStep : 1e-8);
    }
    const flooredPrice = floorWithStep(bnPrice, priceStep);
    this.setState({stopPrice: flooredPrice.toFixed()});
  }
}

const mapStateToProps = state => {
  const {
    exchangesInfo,
    terminal: { market, exchange, ticker, fund, assetGroup },
    auth,
  } = state;

  return {
    key: market + exchange,
    markets: ( exchangesInfo[exchange] || {}).markets || [],
    ticker,
    exchange,
    market,
    fund: fund || assetGroup,
    auth,
    assetGroup,
  };
};

const mapDispatchToProps = {
  showModalWindow: showInfoModal,
  placeOrder,
  placeAlgoOrder,
};

function getTotalForExchange(amount, price, exchange, orderSide) {
  switch (exchange) {
    case 'binance':
    case 'huobi': {
      return amount.times(price).dp(8, BigNumber.ROUND_UP);
    }
    case 'bittrex':
    case 'kucoin': {
      const percent = commissionPercent(orderSide, exchange);
      const total = amount.times(price).times(percent);
      return total.dp(8, BigNumber.ROUND_UP);

    }
    default:
      break;
  }
}

function getAmountForExchange(total, price, exchange, orderSide) {
  switch (exchange) {
    case 'binance':
    case 'huobi': {
      return total.div(price);
    }
    default: {
      return total.div(commissionPercent).div(price);
    }
  }
}
function commissionPercent(orderSide, exchange) {
  switch(exchange) {
    case 'bittrex': {
      return orderSide === TAB_BUY ? 1.0025 : 0.9975;
    }
    case 'kucoin': {
      return orderSide === TAB_BUY ? 1.001 : 0.999;
    }
    case 'huobi':
    case 'binance': {
      return 1;
    }
    default:
      return 1;
  }
}

function floorWithStep(bnValue, bnStep) {
  return bnValue.dp(bnStep.dp(), BigNumber.ROUND_DOWN);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaceOrderContainer);

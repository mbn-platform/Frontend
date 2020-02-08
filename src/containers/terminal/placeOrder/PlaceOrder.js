import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import classNames from 'classnames';

import { BuySellSwitch } from './BuySellSwitch';
import { Balances } from './Balances';
import { PlaceOrderButton } from './PlaceOrderButton';
import { AmountPercentSelector } from './AmountPercentSelector';
import { PlaceOrderInput } from './PlaceOrderInput';
import { PlaceOrderHeader } from './PlaceOrderHeader';
import LockButton from '../../../components/LockButton';

export const ORDER_TYPE_LIMIT = 'limit';
export const ORDER_TYPE_MARKET = 'market';
export const ORDER_TYPE_STOP_LIMIT = 'stop_limit';
export const ORDER_TYPE_STOP_MARKET = 'stop_market';

export class PlaceOrder extends React.PureComponent {

  static defaultProps = {
    percents: [25, 50, 75, 100],
  }

  constructor(props) {
    super(props);
    const [main, secondary] = props.market.split('-');
    this.state = {
      main,
      secondary,
    };
  }

  render() {
    const minTradeSize = this.props.marketInfo ? this.props.marketInfo.minTradeSize : '';
    return (
      <Col sm="12" md="12" lg="4">
        <div className={classNames('buysell', { active: this.props.active })}>
          <PlaceOrderHeader selectedTab={this.props.selectedOrderType} onClick={this.props.onOrderTypeSelected} />
          <Row>
            <Col>
              <BuySellSwitch
                selectedTab={this.props.selectedTab}
                onTabClick={this.props.onBuySellClick}
                currency={this.state.secondary}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Balances
                fund={this.props.fund}
                main={this.state.main}
                onMainClick={e => this.setAmount(e.target.innerHTML)}
                secondary={this.state.secondary}
                onSecondaryClick={e => this.setOrderSize(e.target.innerHTML)}
              />
            </Col>
          </Row>

          <Row>
            <Col className="buysell__inputs">
              <PlaceOrderInput
                message="terminal.placeOrder.amount"
                placeholder={'min ' + minTradeSize}
                onChange={this.props.onChange}
                value={this.props.amount}
                name="amount"
                currency={this.state.secondary}
              />
              <AmountPercentSelector
                percents={this.props.percents}
                onClick={this.props.onPercentSelected}
              />
              <PlaceOrderInput
                message="terminal.placeOrder.price"
                onChange={this.props.onChange}
                value={this.props.price}
                name="price"
                currency={this.state.main}
              />
              {
                this.props.selectedOrderType === 'stop-limit' ? (
                  <PlaceOrderInput
                    message="terminal.placeOrder.stopPrice"
                    onChange={this.props.onChange}
                    value={this.props.stopPrice}
                    name="stopPrice"
                    currency={this.state.main}
                  />
                ) : null
              }
              <PlaceOrderInput
                message="terminal.placeOrder.total"
                onChange={this.props.onChange}
                value={this.props.total}
                name="total"
                currency={this.state.main}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              {this.props.selectedOrderType === 'stop-limit' && this.props.loggedIn ? (
                <LockButton
                  offsetTop="10px"
                  offsetLeft="-25px"
                  placement="right"
                  {...this.props.profile.billing.algoOrders}
                >
                  <PlaceOrderButton
                    onClick={this.props.onPlaceOrderClick}
                    amount={this.props.amount}
                    currency={this.state.secondary}
                    tab={this.props.selectedTab}
                    price={this.props.price}
                  />
                </LockButton>
              ) : (
                <PlaceOrderButton
                  onClick={this.props.onPlaceOrderClick}
                  amount={this.props.amount}
                  currency={this.state.secondary}
                  tab={this.props.selectedTab}
                  price={this.props.price}
                />
              )}
            </Col>
          </Row>
        </div>
      </Col>
    );
  }
}

PlaceOrder.propTypes = {
  exchange: PropTypes.string.isRequired,
  market: PropTypes.string.isRequired,
  fund: PropTypes.object,

  selectedTab: PropTypes.string.isRequired,

  amount: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  total: PropTypes.string.isRequired,
  stopPrice: PropTypes.string.isRequired,

  marketInfo: PropTypes.object,

  onPlaceOrderClick: PropTypes.func.isRequired,
  onPercentSelected: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onBuySellClick: PropTypes.func.isRequired,
};

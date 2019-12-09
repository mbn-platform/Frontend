import classNames from 'classnames';
import React from 'react';
import { Col, Row, Container } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import qs from 'qs';
import BigNumber from 'bignumber.js';
import copy from 'copy-to-clipboard';

import Header from './components/Header';

class Tariffs extends React.PureComponent {
  state = {
    selectedTariff: 'pro',
    payment: null
  };

  data = {
    trading: [{ _id: 'free', access: true }, { _id: 'premium', access: true }, { _id: 'pro', access: true }],
    proofOfTrade: [{ _id: 'free', access: true }, { _id: 'premium', access: true }, { _id: 'pro', access: true }],
    statusIcon: [{ _id: 'free', access: false }, { _id: 'premium', access: false }, { _id: 'pro', access: true }],
  }

  componentDidUpdate(prevProps) {
    if (prevProps.paymentRequest !== this.props.paymentRequest) {
      this.setState({payment: this.props.paymentRequest});
    }
  }

  componentDidMount = () => {
    const search = this.props.location.search;
    if (search) {
      const { tariff } = qs.parse(search.slice(1));
      if (tariff && (tariff === 'free' || tariff === 'premium' || tariff === 'pro')) {
        this.props.history.replace({
          pathname: '/tariffs',
          search: `tariff=${tariff}`,
        });
        this.setState({selectedTariff: tariff});
      }
    } else {
      this.props.history.replace({
        pathname: '/tariffs',
        search: 'tariff=pro',
      });
    }
    this.props.fetchTariffs();
    this.createPaymentRequest(this.state.selectedTariff);

    this.timeInterval = setInterval(() => {
      this.props.fetchTariffs();
      this.createPaymentRequest(this.state.selectedTariff);
    }, 60000);
  }

  createPaymentRequest = (tariff) => {
    const { loggedIn, billing } = this.props;
    if (!loggedIn || tariff === 'free'
      || tariff === billing.tariff
      || billing.tariff === 'pro') {
      return;
    }
    this.props.createPaymentRequest(tariff);
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
  }

  onSelectTariff = (tariff) => () => {
    this.props.history.replace({
      pathname: '/tariffs',
      search: `tariff=${tariff}`,
    });
    this.setState({ selectedTariff: tariff });
    this.createPaymentRequest(tariff);
  }

  onBuyWithEth = async () => {
    const { payment } = this.state;
    if (!payment) {
      return;
    }
    window.ethTransfer(payment.address, payment.amountETH)();
  }

  onBuyWithMbn = async () => {
    const { payment } = this.state;
    if (!payment) {
      return;
    }
    window.mbnTransfer(payment.address, payment.amountMBN);
  }

  onLogIn = () => {
    const redirectTo = this.props.location.pathname + this.props.location.search;
    const query = {
      redirectTo,
    };
    this.props.history.push('/login?' + qs.stringify(query));
  };

  render = () => {
    const { tariffs, billing, loggedIn } = this.props;
    const tariff = billing && billing.tariff;
    const { selectedTariff } = this.state;
    const isButtonDisabled = (loggedIn && tariff !== 'free');

    return tariffs.length > 0 ? (
      <Container className="tariffs__container">
        <Row>
          <Col></Col>
          {tariffs.map(({ _id }) => (
            <Col key={_id}>
              <Header
                label={_id}
                selectable={loggedIn}
                active={_id === selectedTariff}
                onClick={this.onSelectTariff(_id)}
              />
            </Col>
          ))}
        </Row>
        <Row>
          <Col>MONTHLY PRICE</Col>
          {tariffs.map(({ _id, tokenPrice, price, ethPrice, priceForEth }) => (
            <Col
              key={_id}
              className={classNames('text-center', _id === selectedTariff ? 'active' : '')}
            >
              {tokenPrice === 0 ? 'FREE' : (
                <div className="tariffs__container-header-col">
                  <span>{tokenPrice} MBN (${price}) or&nbsp;</span>
                  <span>{ethPrice} ETH (${priceForEth})</span>
                </div>
              )}
            </Col>
          ))}
        </Row>
        <Row>
          <Col>TRADING</Col>
          {this.data.trading.map(({ _id, access }) => (
            <Col
              key={_id}
              className={_id === selectedTariff ? 'active' : ''}
            >
              {access ? <span className="icon-checkmark" /> : <span className="icon-cross" />}
            </Col>
          ))}
        </Row>
        <Row>
          <Col>API exchange</Col>
          {tariffs.map(({ _id, numberOfApiKeys }) => (
            <Col
              key={_id}
              className={_id === selectedTariff ? 'active' : ''}
            >
              {numberOfApiKeys === -1
                ? 'NO LIMITS'
                : numberOfApiKeys === 0
                  ? <span className="icon-cross" />
                  : numberOfApiKeys}
            </Col>
          ))}
        </Row>
        <Row>
          <Col>ORDERS: STOP, OCO, NO-LOCK</Col>
          {tariffs.map(({ _id, numberOfAlgoOrders }) => (
            <Col
              key={_id}
              className={_id === selectedTariff ? 'active' : ''}
            >
              {numberOfAlgoOrders === -1
                ? 'NO LIMITS'
                : numberOfAlgoOrders === 0
                  ? <span className="icon-cross" />
                  : numberOfAlgoOrders}
            </Col>
          ))}
        </Row>
        <Row>
          <Col>PROOF-OF-TRADE</Col>
          {this.data.proofOfTrade.map(({ _id, access }) => (
            <Col
              key={_id}
              className={_id === selectedTariff ? 'active' : ''}
            >
              {access ? <span className="icon-checkmark" /> : <span className="icon-cross" />}
            </Col>
          ))}
        </Row>
        <Row>
          <Col>ASSETS UNDER MANAGEMENT</Col>
          {tariffs.map(({ _id, trustManagementSum }) => (
            <Col
              key={_id}
              className={_id === selectedTariff ? 'active' : ''}
            >
              {trustManagementSum === -1
                ? 'NO LIMITS'
                : trustManagementSum === 0
                  ? <span className="icon-cross" />
                  : `UP TO $${trustManagementSum}`}
            </Col>
          ))}
        </Row>
        <Row>
          <Col>TELEGRAM NOTIFICATIONS</Col>
          {tariffs.map(({ _id, notifications }) => (
            <Col
              key={_id}
              className={_id === selectedTariff ? 'active' : ''}
            >
              {notifications ? <span className="icon-checkmark" /> : <span className="icon-cross" />}
            </Col>
          ))}
        </Row>
        <Row>
          <Col>STATUS ICON</Col>
          {this.data.statusIcon.map(({ _id, access }) => (
            <Col
              key={_id}
              className={_id === selectedTariff ? 'active' : ''}
            >
              {access ? <span className="icon-checkmark" /> : <span className="icon-cross" />}
            </Col>
          ))}
        </Row>
        <BuyDescription payment={this.state.payment} tariff={selectedTariff} />
        {!loggedIn ? (
          <div className="tariffs__container-button-wrapper">
            <button
              className="btn active non-logged-in"
              type="button"
              disabled={loggedIn && isButtonDisabled}
              onClick={this.onLogIn}
            >
              <FormattedMessage id="tariffs.buyNow" />
            </button>
          </div>

        ) : null}
        <BuyButtons
          payment={this.state.payment}
          loggedIn={loggedIn}
          billing={billing}
          tariff={selectedTariff}
          onBuyWithEth={this.onBuyWithEth}
          onBuyWithMbn={this.onBuyWithMbn}
        />
        <ExpireInfo billing={billing} />
      </Container>
    ) : null;
  };
}

const BuyDescription = ({payment, tariff}) => {
  if (!payment || tariff === 'free') {
    return null;
  } else {
    const ethAmount = BigNumber(payment.amountETH).div(1e18).toFixed();
    const mbnAmount = BigNumber(payment.amountMBN).div(1e18).toFixed();
    return (
      <div className="tariffs__container-description">
        Choose a service plan and click "BUY NOW" button.
        <br/>
          The payment can be done from your active ERC-20 wallet or thought a direct transaction:
        <br/>
        send {ethAmount} ETH or {mbnAmount} MBN directly to {payment.address}
        <button
          title="Copy address"
          onClick={() => copy(payment.address)}
          className="copy-address"
        />
        <br/>
        The service plan fee based on the current market price. After payment, the service plan is activated for 30 days
      </div>
    );
  }
};

const BuyButtons = ({ loggedIn, tariff, payment, billing, onBuyWithMbn, onBuyWithEth}) => {
  if (loggedIn && tariff !== billing.tariff
    && tariff !== 'free' && billing.tariff !== 'pro'
    && payment) {
    return (
      <Row className="buy-buttons">
        <div className="tariffs__container-button-wrapper space-evenly">
          <button
            className="btn active"
            type="button"
            onClick={onBuyWithMbn}
          >
          BUY WITH MBN
          </button>
          <button
            className="btn active"
            type="button"
            onClick={onBuyWithEth}
          >
          BUY WITH ETH
          </button>
        </div>
      </Row>
    );
  } else {
    return null;
  }
};

const ExpireInfo = ({billing}) => {
  if (!billing) {
    return null;
  } else {
    return (
      <Row className="tariff-expire">
        <Col>You have activated <b>{billing.tariff}</b> service plan.{ billing.end && ` It will be active for ${remainingDays(new Date(billing.end))} days`}</Col>
      </Row>
    );
  }
};

function remainingDays(billingEnd) {
  const now = new Date();
  const remaining = billingEnd - now;
  const remainingDays = Math.round(remaining / (86400 * 1000));
  return remainingDays;
}

export default Tariffs;

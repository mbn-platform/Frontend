import React from 'react';
import { Col, Row, Container } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import qs from 'qs';

import Header from './components/Header';

class Tariffs extends React.PureComponent {
  state = {
    selectedTariff: this.props.billing && this.props.billing.tariff,
  };

  data = {
    trading: [{ _id: 'free', access: true }, { _id: 'premium', access: true }, { _id: 'pro', access: true }],
    proofOfTrade: [{ _id: 'free', access: true }, { _id: 'premium', access: true }, { _id: 'pro', access: true }],
    statusIcon: [{ _id: 'free', access: false }, { _id: 'premium', access: false }, { _id: 'pro', access: true }],
  }

  componentDidMount = () => {
    this.props.fetchTariffs();

    this.timeInterval = setInterval(() => {
      this.props.fetchTariffs();
    }, 60000);
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
  }

  onSelectTariff = (tariff) => () => {
    const { loggedIn } = this.props;
    if (!loggedIn) {
      return;
    }

    this.setState({ selectedTariff: tariff });
  }

  onBuyNow = async () => {
    const { selectedTariff } = this.state;

    await this.props.createPaymentRequest(selectedTariff);
    const params = qs.stringify({ tariff: selectedTariff });
    this.props.history.push(`/payments/?${params}`);
  }

  onLogIn = () => {
    this.props.history.push('/login');
  };

  render = () => {
    const { tariffs, billing, loggedIn } = this.props;
    const tariff = billing && billing.tariff;
    const { selectedTariff } = this.state;
    const isActivated = tariff === selectedTariff && loggedIn;
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
          {tariffs.map(({ _id, tokenPrice, price }) => (
            <Col
              key={_id}
              className={_id === selectedTariff ? 'active' : ''}
            >
              {tokenPrice === 0 ? 'FREE' : `${tokenPrice} MBN ($${price})`}
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
        <div className="tariffs__container-description">
          Choose a service plan and click "BUY NOW" button.
          The payment can be done from your active ERC-20 wallet or thought a direct transaction.

          The service plan fee is paid in MBN tokens, based on the market price.
          After payment, the service plan is activated for 30 days.
        </div>
        <div className="tariffs__container-button-wrapper">
          <button
            className="btn active"
            type="button"
            disabled={loggedIn && isButtonDisabled}
            onClick={loggedIn ? this.onBuyNow : this.onLogIn}
          >
            {isActivated
              ? <FormattedMessage id="tariffs.activated" />
              : <FormattedMessage id="tariffs.buyNow" />}
          </button>
        </div>
        <ExpireInfo billing={billing} />
      </Container>
    ) : null;
  };
}

const ExpireInfo = ({billing}) => {
  if (!billing || !billing.end) {
    return null;
  } else {
    console.log(billing.end);
    const now = new Date();
    const remaining = new Date(billing.end) - now;  
    const remainingDays = Math.round(remaining / (86400 * 1000));
    return (
      <Row className="tariff-expire">
        <Col>You have activated <b>{billing.tariff}</b> service plan. It will be active for {remainingDays} days</Col>
      </Row>
    );
  }
};

export default Tariffs;

import React from 'react';
import { Col, Row, Container } from 'reactstrap';
import { FormattedMessage } from 'react-intl';

import Header from './components/Header';

class Tariffs extends React.PureComponent {
  state = {
    selectedTariff: this.props.auth.profile.billing.tariff,
  }

  data = {
    trading: [{ _id: 'free', access: true }, { _id: 'premium', access: true }, { _id: 'pro', access: true }],
    proofOfTrade: [{ _id: 'free', access: true }, { _id: 'premium', access: true }, { _id: 'pro', access: true }],
    telegramNotifications: [{ _id: 'free', access: false }, { _id: 'premium', access: true }, { _id: 'pro', access: true }],
    statusIcon: [{ _id: 'free', access: false }, { _id: 'premium', access: false }, { _id: 'pro', access: true }],
  }

  componentDidMount = () => {
    this.props.fetchTariffs();
  }

  onSelectTariff = (tariff) => () => {
    this.props.getTariffById(tariff);
    this.setState({ selectedTariff: tariff });
  }

  onBuyNow = () => {
    const { selectedTariff } = this.state;
    this.props.paymentRequest(selectedTariff);
  }

  render = () => {
    const { tariffs } = this.props;
    const { selectedTariff } = this.state;

    return tariffs.length > 0 ? (
      <Container className="tariffs__container">
        <Row>
          <Col></Col>
          {tariffs.map(({ _id }) => (
            <Col key={_id}>
              <Header
                label={_id}
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
              {tokenPrice === 0 ? tokenPrice : `${tokenPrice} MBN ($${price})`}
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
              {numberOfApiKeys === -1 ? 'NO LIMITS' : numberOfApiKeys}
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
              {numberOfAlgoOrders === -1 ? 'NO LIMITS' : numberOfAlgoOrders}
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
          <Col>TRUST MANAGEMENT</Col>
          {tariffs.map(({ _id, trustManagementSum }) => (
            <Col
              key={_id}
              className={_id === selectedTariff ? 'active' : ''}
            >
              {
                trustManagementSum === 0
                ? <span className="icon-checkmark" />
                : trustManagementSum === -1 ? 'NO LIMITS' : `UP TO $${trustManagementSum}`
              }
            </Col>
          ))}
        </Row>
        <Row>
          <Col>TELEGRAM NOTIFICATIONS</Col>
          {this.data.telegramNotifications.map(({ _id, access }) => (
            <Col
              key={_id}
              className={_id === selectedTariff ? 'active' : ''}
            >
              {access ? <span className="icon-checkmark" /> : <span className="icon-cross" />}
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
          The payment is done from your active ERC-20 wallet or thought a direct transaction.
          Choose what is more convenient for you. The service plan fee is paid in MBN tokens,
          based on the market price available at coinmarketcap. After payment, the service plan is activated for 20 days.
        </div>
        <div className="tariffs__container-button-wrapper">
          <button onClick={this.onBuyNow} type="button" className="btn active">
            <FormattedMessage id="tariffs.buyNow" />
          </button>
        </div>
      </Container>
    ) : null
  };
}

export default Tariffs;

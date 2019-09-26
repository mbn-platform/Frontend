import React from 'react';
import { Col, Row, Container } from 'reactstrap';
import { FormattedMessage } from 'react-intl';

import Header from './components/Header';

class Tariffs extends React.PureComponent {
  state = {
    selectedTariff: this.props.auth.profile.billing.tariff,
  }

  data = {
    tariffs: ['free', 'premium', 'pro'],
    monthlyPrice: [{ tariff: 'free', value: '0' }, { tariff: 'premium', value: '1000 MBN ($10)' }, { tariff: 'pro', value: '2500 MBN ($25)' }],
    trading: [{ tariff: 'free', value: 'V' }, { tariff: 'premium', value: 'V' }, { tariff: 'pro', value: 'V' }],
    apiExchange: [{ tariff: 'free', value: '3' }, { tariff: 'premium', value: '25' }, { tariff: 'pro', value: 'NO LIMITS' }],
    orders: [{ tariff: 'free', value: '25' }, { tariff: 'premium', value: '100' }, { tariff: 'pro', value: 'NO LIMITS' }],
    proofOfTrade: [{ tariff: 'free', value: 'V' }, { tariff: 'premium', value: 'V' }, { tariff: 'pro', value: 'V' }],
    trustManagement: [{ tariff: 'free', value: 'X' }, { tariff: 'premium', value: 'UP TO $5000' }, { tariff: 'pro', value: 'NO LIMITS' }],
    telegramNotifications: [{ tariff: 'free', value: 'X' }, { tariff: 'premium', value: 'V' }, { tariff: 'pro', value: 'V' }],
    statusIcon: [{ tariff: 'free', value: 'X' }, { tariff: 'premium', value: 'X' }, { tariff: 'pro', value: 'V' }],
  }

  onSelectTariff = (tariff) => () => {
    this.setState({ selectedTariff: tariff });
  }

  render = () => (
    <Container className="tariffs__container">
      <Row>
        <Col></Col>
        {this.data.tariffs.map(tariff => (
          <Col>
            <Header
              label={tariff}
              active={tariff === this.state.selectedTariff}
              onClick={this.onSelectTariff(tariff)}
            />
          </Col>
        ))}
      </Row>
      <Row>
        <Col>MONTHLY PRICE</Col>
        {this.data.monthlyPrice.map(({ tariff, value }) => (
          <Col className={tariff === this.state.selectedTariff && 'active'}>{value}</Col>
        ))}
      </Row>
      <Row>
        <Col>TRADING</Col>
        {this.data.trading.map(({ tariff, value }) => (
          <Col className={tariff === this.state.selectedTariff && 'active'}>{value}</Col>
        ))}
      </Row>
      <Row>
        <Col>API exchange</Col>
        {this.data.apiExchange.map(({ tariff, value }) => (
          <Col className={tariff === this.state.selectedTariff && 'active'}>{value}</Col>
        ))}
      </Row>
      <Row>
        <Col>ORDERS: STOP, OCO, NO-LOCK</Col>
        {this.data.orders.map(({ tariff, value }) => (
          <Col className={tariff === this.state.selectedTariff && 'active'}>{value}</Col>
        ))}
      </Row>
      <Row>
        <Col>PROOF-OF-TRADE</Col>
        {this.data.proofOfTrade.map(({ tariff, value }) => (
          <Col className={tariff === this.state.selectedTariff && 'active'}>{value}</Col>
        ))}
      </Row>
      <Row>
        <Col>TRUST MANAGEMENT</Col>
        {this.data.trustManagement.map(({ tariff, value }) => (
          <Col className={tariff === this.state.selectedTariff && 'active'}>{value}</Col>
        ))}
      </Row>
      <Row>
        <Col>TELEGRAM NOTIFICATIONS</Col>
        {this.data.telegramNotifications.map(({ tariff, value }) => (
          <Col className={tariff === this.state.selectedTariff && 'active'}>{value}</Col>
        ))}
      </Row>
      <Row>
        <Col>STATUS ICON</Col>
        {this.data.statusIcon.map(({ tariff, value }) => (
          <Col className={tariff === this.state.selectedTariff && 'active'}>{value}</Col>
        ))}
      </Row>
      <div className="tariffs__container-description">
        Choose a service plan and click "BUY NOW" button.
        The payment is done from your active ERC-20 wallet or thought a direct transaction.
        Choose what is more convenient for you. The service plan fee is paid in MBN tokens,
        based on the market price available at coinmarketcap. After payment, the service plan is activated for 20 days.
      </div>
      <div className="tariffs__container-button-wrapper">
        <button onClick={() => {}} type="button" className="btn active">
          <FormattedMessage id="tariffs.buyNow" />
        </button>
      </div>
    </Container>
  );
}

export default Tariffs;

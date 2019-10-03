import React from 'react';
import { Container } from 'reactstrap';
import qs from 'qs';

class Payments extends React.Component {
  componentDidMount() {
    const { getMbnAddress, fetchTariffs } = this.props;

    fetchTariffs();
    getMbnAddress();

    this.timeInterval = setInterval(() => {
      fetchTariffs();
    }, 60000);
  };

  handleGenerateAddress = () => {
    this.props.createMbnAddress();
  }

  render = () => {
    const { tariffs, location } = this.props;
    const { tariff } = qs.parse(location.search.slice(1));
    const { tokenPrice } = tariffs.length > 0 && tariffs.filter(({ _id }) => _id === tariff)[0];

    return (
      <Container className="payments__container">
        <h1 className="payments__title">Choose purchase method</h1>
        <div className="payments__purchase active">
          {/* <span className="icon-checkmark" /> */}
          <div className="payments__subtitle">Purchase by sending MBN tokens</div>
          <div className="payments__step-container">
            <p className="payments__step">1 step</p>
            <div>
              Click
              <button onClick={this.handleGenerateAddress} className="payments-generate-button">GENERATE</button>
              for creating individual ERC-20 address
            </div>
          </div>
          {this.props.address && (
            <div className="payments__step-container">
              <p className="payments__step">2 step</p>
              <div>
                Send {tokenPrice} MBN to
                <button onClick={this.props.mbnTransfer} className="payments-generate-button">{this.props.address}</button>
              </div>
            </div>
          )}
          <div className="payments__description">
            Service plan to be activated after 4 confirmation.<br />
            It takes up to the 20 minutes, depends on Ethereum blockchain.<br />
            You will get notification via Telegram (if it was added) and in the appearing form.
          </div>
        </div>
    {/*
        <div className="payments__purchase">
          <div className="payments__subtitle">Purchase by buying MBN tokens</div>
          <div className="payments__step-container">
            <p className="payments__step">1 step</p>
            <div>Click BUY NOW for executing purchase via Metamask, Trustwallet or other stuff.</div>
          </div>
          <div className="payments__step-container">
            <p className="payments__step">2 step</p>
            <div>Buy 1000 MBN. Your exchange ratio is ETH/MBN 0,00065. This price freezed for 60 min.</div>
          </div>
        </div> */}
      </Container>
    );
  }
}

export default Payments;

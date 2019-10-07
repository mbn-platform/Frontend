import React from 'react';
import { Redirect } from 'react-router-dom';
import { Container } from 'reactstrap';
import BigNumber from 'bignumber.js';
import copy from 'copy-to-clipboard';

class Payments extends React.Component {

  state = {
    showPaymentDetails: false,
  }

  handleGenerateAddress = () => {
    this.props.createMbnAddress();
  }

  copyAddress = () => {
    const { address } = this.props.paymentRequest;
    copy(address);
  }

  onDirectTransactionClick = () => {
    this.setState({showPaymentDetails: !this.state.showPaymentDetails});
  }

  render = () => {
    if (!this.props.paymentRequest) {
      return <Redirect to="/tariffs" />;
    }

    const { paymentRequest } = this.props;
    const amount = new BigNumber(paymentRequest.amount).div(1e18).toFixed();

    return (
      <Container className="payments__container">
        <h1 className="payments__title">Choose purchase method</h1>
        <div className="payments__purchase active">
          <div className="payments__subtitle top">
            Current rate of <b>{amount}</b> MBN tokens is active for 15 minutes.
            Choose the payment method and follow the steps provided.
            <br/>
            <br/>
            After the payment service plan will be activated after 4 confirmations.
            Add your Telegram account in the Profile menu to receive notification when service plan is upgraded.
          </div>
          <div className="payments__step-container">
            <div className="payments__subtitle">
              You can pay with your ERC-20 wallet by clicking the "WALLET" button
            </div>
            <div className="tariffs__container-button-wrapper">
              <button
                className="btn active"
                type="button"
                onClick={this.props.mbnTransfer}>
                Wallet
              </button>
            </div>
            <div className="payments__subtitle">
              You can pay with direct transaction by clicking the "GENERATE ADDRESS" button and sending MBN tokens to the address provided.
            </div>
            <div className="tariffs__container-button-wrapper">
              <button
                className="btn active"
                type="button"
                onClick={this.onDirectTransactionClick}>
                Generate address
              </button>
            </div>
          </div>
          <DirectTransactionDetails
            show={this.state.showPaymentDetails}
            address={paymentRequest.address}
            amount={amount}
            onCopyClick={this.copyAddress}
          />
        </div>
      </Container>
    );
  }

}

const DirectTransactionDetails = ({address, amount, show, onCopyClick}) => {
  if (show) {
    return (
      <div className="payments__description">
        To pay via direct transaction - send <b>{amount}</b> MBN to <b>{address}</b>
        <button
          title="Copy adress"
          onClick={onCopyClick}
          className="copy-address"
        />
        <div>
          If wrong amount of tokens is transferred, funds will be returned in 24 hours
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default Payments;

import React from 'react';
import { Container } from 'reactstrap';

const Payments = () => (
  <Container className="payments__container">
    <h1 className="payments__title">Choose purchase method</h1>

    <div className="payments__purchase active">
      <span className="icon-checkmark" />
      <div className="payments__subtitle">Purchase by sending MBN tokens</div>
      <div className="payments__step-container">
        <p className="payments__step">1 step</p>
        <div>
          Click
          <button onClick={() => {}} className="payments-generate-button">GENERATE</button>
          for creating individual ERC-20 address
        </div>
      </div>
      <div className="payments__step-container">
        <p className="payments__step">2 step</p>
        <div>Send 1000 MBN to `address`</div>   {/*  add address dynamically */}
      </div>
      <div className="payments__description">
        Service plan to be activated after 4 confirmation.<br />
        It takes up to the 20 minutes, depends on Ethereum blockchain.<br />
        You will get notification via Telegram (if it was added) and in the appearing form.
      </div>
    </div>

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
    </div>
  </Container>
);

export default Payments;

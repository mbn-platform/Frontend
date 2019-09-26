import React from 'react';
import { Container } from 'reactstrap';

const Payments = () => (
  <Container className="payments__container">
    <h1 className="payments__container-title">Choose purchase method</h1>
    <div>Purchase by sending MBN tokens</div>
    <div>
      <p>1 step</p>
      <div>Click GENERATE for creating individual ERC-20 address</div>
    </div>
    <div>
      <p>2 step</p>
      <div>Send 1000 MBN to `address`</div>   {/*  add address dynamically */}
    </div>
    <div>
      Service plan to be activated after 4 confirmation.
      It takes up to the 20 minutes, depends on Ethereum blockchain.
      You will get notification via Telegram (if it was added) and in the appearing form.
    </div>
    <div>Purchase by buying MBN tokens</div>
    <div>
      <p>1 step</p>
      <div>Click BUY NOW for executing purchase via Metamask, Trustwallet or other stuff.</div>
    </div>
    <div>
      <p>2 step</p>
      <div>Buy 1000 MBN. Your exchange ratio is ETH/MBN 0,00065. This price freezed for 60 min.</div>
    </div>
  </Container>
);

export default Payments;

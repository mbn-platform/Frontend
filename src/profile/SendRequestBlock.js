import React from 'react';
import ContractDetails from './ContractDetails';
import SelectApiKey from './SelectApiKey';
import ContractSent from './ContractSent';

const SEND_REQUEST_BLOCK_DETAILS = 0;
const SEND_REQUEST_BLOCK_SELECT_API = 1;
const SEND_REQUEST_BLOCK_SENT = 2;

class SendRequestBlock extends React.Component {

  constructor(props) {
    super(props);
    this.state = {visibleBlock: SEND_REQUEST_BLOCK_DETAILS, selectedApiKey: null};
    this.showApiKeys = this.setState.bind(this, {visibleBlock: SEND_REQUEST_BLOCK_SELECT_API});
    this.showDetails = this.setState.bind(this, {visibleBlock: SEND_REQUEST_BLOCK_DETAILS});
    this.showRequestSent = this.setState.bind(this, {visibleBlock: SEND_REQUEST_BLOCK_SENT});
    this.onApiKeySelected = apiKey => this.setState({selectedApiKey: apiKey});
    this.onSendOfferClick = this.onSendOfferClick.bind(this);
  }

  onSendOfferClick() {
    if(!this.state.selectedApiKey) {
      alert('select api key first');
      return;
    }
    this.showRequestSent();
  }

  render() {
    switch(this.state.visibleBlock) {
      case SEND_REQUEST_BLOCK_DETAILS: {
        return (
          <ContractDetails
            onOfferSendClick={this.showApiKeys}
            duration={this.props.duration}
            amount={this.props.minAmount}
            currency={this.props.minAmountCurrency}
            maxLoss={this.props.maxLoss}
            fee={this.props.fee}
          />
        );
      }
      case SEND_REQUEST_BLOCK_SELECT_API: {
        return (
          <SelectApiKey
            onOfferSendClick={this.onOfferSendClick}
            exchanges={this.props.exchanges}
            apiKeys={this.props.apiKeys}
            selectedApiKey={this.state.selectedApiKey}
            onCancelClick={this.showDetails}
            onSendOfferClick={this.onSendOfferClick}
            onApiKeySelected={this.onApiKeySelected}
          />
        );
      }
      case SEND_REQUEST_BLOCK_SENT: {
        return (
          <ContractSent
            onButtonClick={this.showDetails}
          />
        );
      }
      default:
        return null;
    }
  }
}

export default SendRequestBlock;

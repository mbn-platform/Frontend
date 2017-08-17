import React from 'react';
import ApiKeys from './ApiKeys';
import AddApiKey from './AddApiKey';
import ApiKeyInfo from './ApiKeyInfo';
import Contracts from './Contracts';
import Offers from './Offers';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selectedContract: null, selectedApiKey: null, selectedOffer: null};
    this.onKeySelected = this.onKeySelected.bind(this);
    this.onOfferSelected = this.onOfferSelected.bind(this);
    this.onContractSelected = this.onContractSelected.bind(this);
  }
  componentDidMount() {
    this.props.onDashboardMounted();
  }

  render() {
    return (
      <div>
        <h1>Dashboard</h1>
        <Offers
          onOfferCanceled={this.props.onOfferCanceled}
          onOfferRejected={this.props.onOfferRejected}
          onOfferAccepted={this.props.onOfferAccepted}

          offers={this.props.offers}
          selectedOffer={this.state.selectedOffer}
          onOfferSelected={this.onOfferSelected}
        />
        <ApiKeys
          apiKeys={this.props.apiKeys}
          selectedApiKey={this.state.selectedApiKey}
          onKeySelected={this.onKeySelected}
          onKeyDeleteClick={this.props.onKeyDeleteClick}
        />
        <AddApiKey />
        <ApiKeyInfo apiKey={this.state.selectedApiKey} />
        <Contracts
          contracts={this.props.contracts}
          selectedContract={this.state.selectedContract}
          onContractSelected={this.onContractSelected}
        />
      </div>
    );
  }

  onKeySelected(apiKey) {
    if(this.state.selectedApiKey !== apiKey) {
      const offer = this.props.offers.find(o => o.keyId === apiKey.keyId);
      const contract = this.props.contracts.find(c => c.keyId === apiKey.keyId);
      this.setState({selectedApiKey: apiKey, selectedOffer: offer, selectedContract: contract});
    }
  }

  onOfferSelected(offer) {
    if(this.state.selectedOffer !== offer) {
      const key = this.props.apiKeys.find(k => k.keyId === offer.keyId);
      this.setState({
        selectedOffer: offer,
        selectedApiKey: key,
        selectedContract: null
      });
    }
  }

  onContractSelected(contract) {
    if(this.state.selectedContract !== contract) {
      const key = this.props.apiKeys.find(k => k.keyId === contract.keyId);
      this.setState({
        selectedContract: contract,
        selectedApiKey: key,
        selectedOffer: null
      });
    }
  }
}

export default Dashboard;

import React from 'react';
import ApiKeys from './ApiKeys';
import AddApiKey from './AddApiKey';
import ApiKeyInfo from './ApiKeyInfo';
import CurrentContracts from './CurrentContracts';
import Offers from './Offers';
import { connect } from 'react-redux';

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
        <CurrentContracts
          contracts={this.props.currentContracts}
          selectedContract={this.state.selectedContract}
          onContractSelected={this.onContractSelected}
        />
      </div>
    );
  }

  onKeySelected(apiKey) {
    if(this.state.selectedApiKey !== apiKey) {
      const offer = this.props.offers.find(o => o.keyId === apiKey.keyId);
      const contract = this.props.currentContracts.find(c => c.keyId === apiKey.keyId);
      console.log(contract);
      console.log(offer);
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
      console.log(key);
      this.setState({
        selectedContract: contract,
        selectedApiKey: key,
        selectedOffer: null
      });
    }
  }
}

export default Dashboard;


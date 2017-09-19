import React from 'react';
import ApiKeys from './ApiKeys';
import AddApiKey from './AddApiKey';
import ApiKeyInfo from './ApiKeyInfo';
import Contracts from './Contracts';
import Offers from './Offers';
import SelectedContractInfo from './SelectedContractInfo';
import TradersChart from './TradersChart';
import ContractsChart from './ContractsChart';
import ContractInfo from './ContractInfo';
import './Dashboard.css';

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
      <div className="dashboard_wrapper">
        <div className="keys_tables_wrapper table_wrapper">
        <ApiKeys 
          userId={this.props.userId}
          apiKeys={this.props.apiKeys}
          selectedApiKey={this.state.selectedApiKey}
          onKeySelected={this.onKeySelected}
          onKeyDeleteClick={this.props.onKeyDeleteClick}
        />
        <ApiKeyInfo
          apiKey={this.state.selectedApiKey}
          exchanges={this.props.exchanges}
          onKeyUpdateClick={this.props.onKeyUpdateClick}
        />
        <AddApiKey />
      </div>
      <div className="table_wrapper requests_table_wrapper">
        <Offers
          onOfferCanceled={this.props.onOfferCanceled}
          onOfferRejected={this.props.onOfferRejected}
          onOfferAccepted={this.props.onOfferAccepted}

          offers={this.props.offers}
          selectedOffer={this.state.selectedOffer}
          onOfferSelected={this.onOfferSelected}
        />
      </div>
        <Contracts
          contracts={this.props.contracts}
          selectedContract={this.state.selectedContract}
          onContractSelected={this.onContractSelected}
        />
        <SelectedContractInfo contract={this.state.selectedContract} />
        <ContractInfo
          contract={this.state.selectedContract}
        />
        <TradersChart />
        <ContractsChart />
      </div>
    );
  }

  onKeySelected(apiKey) {
    if(this.state.selectedApiKey !== apiKey) {
      const { incoming, outgoing } = this.props.offers;
      const findFunction = elem => elem.keyId === apiKey._id;
      const offer = incoming.find(findFunction) || outgoing.find(findFunction);
      const contract = this.props.contracts.find(c => c._id === apiKey._id);
      this.setState({selectedApiKey: apiKey, selectedOffer: offer, selectedContract: contract});
    }
  }

  onOfferSelected(offer) {
    if(this.state.selectedOffer !== offer) {
      const key = this.props.apiKeys.find(k => k._id === offer.keyId);
      this.setState({
        selectedOffer: offer,
        selectedApiKey: key,
        selectedContract: null
      });
    }
  }

  onContractSelected(contract) {
    if(this.state.selectedContract !== contract) {
      const key = this.props.apiKeys.find(k => k._id === contract._id);
      this.setState({
        selectedContract: contract,
        selectedApiKey: key,
        selectedOffer: null
      });
    }
  }
}

export default Dashboard;

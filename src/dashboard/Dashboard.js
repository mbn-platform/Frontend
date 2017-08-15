import React from 'react';
import ApiKeys from './ApiKeys';
import AddApiKey from './AddApiKey';
import ApiKeyInfo from './ApiKeyInfo';
import CurrentContracts from './CurrentContracts';
import Offers from './Offers';
import { connect } from 'react-redux';
import { fetchDashboardData } from '../actions/dashboard';
import { deleteApiKey } from '../actions/apiKeys';
const CONTRACTS = [{name: 'Trader', link: '/trader', id: '1', info: 'Contract Info'}];

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selectedContract: null, selectedApiKey: null, selectedOffer: null};
    this.onKeySelected = this.onKeySelected.bind(this);
    this.onOfferSelected = this.onOfferSelected.bind(this);
    this.onContractSelected = this.onContractSelected.bind(this);
  }
  componentDidMount() {
    this.props.dispatch(fetchDashboardData());
  }

  render() {
    return (
      <div>
        <h1>Dashboard</h1>
        <Offers
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
      this.setState({selectedApiKey: apiKey, selectedOffer: offer});
    }
  }

  onOfferSelected(offer) {
    if(this.state.selectedOffer !== offer) {
      const key = this.props.apiKeys.find(k => k.keyId === offer.keyId);
      this.setState({selectedOffer: offer, selectedApiKey: key});
    }
  }

  onContractSelected(contract) {
    if(this.state.selectedContract !== contract) {
      this.setState({selectedContract: contract});
    }
  }
}

const mapStateToProps = state => {
  return {
    apiKeys: state.apiKeys,
    offers: state.offers,
    currentContracts: state.currentContracts
  };
};


const mapDispatchToProps = dispatch => {
  return {
    onKeyDeleteClick: apiKey => {
      console.log('on key delete click');
      if(apiKey.inUse) {
        alert('cannot delete key - key is in use');
      } else {
        dispatch(deleteApiKey(apiKey));
      }
    },
    dispatch: dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

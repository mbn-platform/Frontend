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
  }
  componentDidMount() {
    this.props.dispatch(fetchDashboardData());
  }
  componentWillReceiveProps(nextProps) {
    console.log('dashboard will receive props');
  }
  render() {
    console.log('render dashboard');
    return (
      <div>
        <h1>Dashboard</h1>
        <ApiKeys apiKeys={this.props.apiKeys} selectedApiKey={this.state.selectedApiKey} 
          onKeySelected={this.onKeySelected}
          onKeyDeleteClick={this.props.onKeyDeleteClick} />
        <AddApiKey />
        <ApiKeyInfo apiKey={this.state.selectedApiKey} />
        <CurrentContracts contracts={this.props.currentContracts} selectedContract={this.state.selectedContract}/>
        <Offers offers={this.props.offers} selectedOffer={this.state.selectedOffer} />
      </div>
      );
  }

  onKeySelected(apiKey) {
    if(this.state.selectedApiKey !== apiKey) {
      this.setState({selectedApiKey: apiKey});
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

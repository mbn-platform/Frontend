import React from 'react';
import ApiKeys from './ApiKeys';
import AddApiKey from './AddApiKey';
import CurrentContracts from './CurrentContracts';
import Offers from './Offers';
import { connect } from 'react-redux';
import { fetchDashboardData } from '../actions/dashboard';
const CONTRACTS = [{name: 'Trader', link: '/trader', id: '1', info: 'Contract Info'}];

class Dashboard extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchDashboardData());
  }
  render() {
    return (
      <div>
        <h1>Dashboard</h1>
        <ApiKeys />
        <AddApiKey />
        <CurrentContracts />
        <Offers />
      </div>
    );
  }
}

export default connect()(Dashboard);

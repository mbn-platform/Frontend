import React from 'react';
import ApiKeys from './ApiKeys';
import AddApiKey from './AddApiKey';
import CurrentContracts from './CurrentContracts';
const CONTRACTS = [{name: 'Trader', link: '/trader', id: '1', info: 'Contract Info'}];

const Dashboard = () => (
  <div>
    <h1>Dashboard</h1>
    <ApiKeys />
    <AddApiKey />
    <CurrentContracts contracts={CONTRACTS}/>
  </div>
);






export default Dashboard;

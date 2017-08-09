import React from 'react';
import ApiKeys from './ApiKeys';
import CurrentContracts from './CurrentContracts';
//const KEYS = [{name: 'key1', stock: 'bitrex', id: '123'}];
const KEYS = [{name: 'first key', keyValue: 'Acx123123DFdf', stock: 'Some Stock', key: 'Acx123123DFdf', inUse: false}];
const CONTRACTS = [{name: 'Trader', link: '/trader', id: '1', info: 'Contract Info'}];

const Dashboard = () => (
  <div>
    <h1>Dashboard</h1>
    <ApiKeys keys={KEYS}/>
    <CurrentContracts contracts={CONTRACTS}/>
  </div>
);






export default Dashboard;

import React from 'react';
import ContractInfo from './ContractInfo';
import ContractFeedback from './ContractFeedback';

const SelectedContractInfo = ({ contract }) => {
  if(!contract) {
    return null;
  } else {
    if(contract.status === 'completed') {
      return (<ContractFeedback contract={contract}/>);
    } else {
      return (<ContractInfo contract={contract}/>);
    }
  }
};

export default SelectedContractInfo;

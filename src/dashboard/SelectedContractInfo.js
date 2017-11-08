import React from 'react';
import ContractInfo from './ContractInfo';
import ContractFeedback from './ContractFeedback';

const SelectedContractInfo = ({ contract, onContractRate }) => {
  if(!contract) {
    return null;
  } else {
    if(contract.state === 'FINISHED') {
      return (
        <ContractFeedback
          onContractRate={onContractRate}
          contract={contract}
        />);
    } else {
      return (<ContractInfo contract={contract}/>);
    }
  }
};

export default SelectedContractInfo;

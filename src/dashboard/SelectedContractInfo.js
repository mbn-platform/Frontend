import React from 'react';
import ContractInfo from './ContractInfo';
import ContractFeedback from './ContractFeedback';
import ProfileFeedbacks from './ProfileFeedbacks';

const SelectedContractInfo = ({ contract, onContractRate }) => {
  if(!contract) {
    return null;
  } else {
    if(contract.state === 'FINISHED') {
      if(contract.feedbacks && contract.feedbacks.length > 1) {
        return (<ProfileFeedbacks
          comments={contract.feedbacks}
        />);
      } else {
        return (

          <ContractFeedback
            onContractRate={onContractRate}
            contract={contract}
          />);        
      }

    } else {
      return (<ContractInfo contract={contract}/>);
    }
  }
};

export default SelectedContractInfo;

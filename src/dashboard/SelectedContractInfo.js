import React from 'react';
import ContractInfo from './ContractInfo';
import ContractFeedback from './ContractFeedback';
import ProfileFeedbacks from './ProfileFeedbacks';

const SelectedContractInfo = ({ contract, onContractRate }) => {
  if(!contract) {
    return null;
  } else {
    if(contract.state === 'FINISHED') {
        return (<ProfileFeedbacks
          comments={contract.feedbacks}
        />);
    } else {
      return (<ContractInfo contract={contract}/>);
    }
  }
};

export default SelectedContractInfo;

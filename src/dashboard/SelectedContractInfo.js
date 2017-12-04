import React from 'react';
import ContractInfo from './ContractInfo';
import ContractInfoEmpty from './ContractInfoEmpty';
import ContractFeedback from './ContractFeedback';
import ProfileFeedbacks from './ProfileFeedbacks';
import { CONTRACT_STATE_FINISHED, CONTRACT_STATE_HALTED } from '../constants';

const SelectedContractInfo = ({ contract, onContractRate }) => {
  if(!contract) {
    let dateNow = Date.now();
    let contractDefault = {}
    return (<ContractInfoEmpty/>);
  } else {
    if(contract.state === CONTRACT_STATE_FINISHED || contract.state === CONTRACT_STATE_HALTED) {
      if(contract.feedbacks && contract.feedbacks.length) {
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

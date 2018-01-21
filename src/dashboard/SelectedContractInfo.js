import React from 'react';
import ContractInfo from './ContractInfo';
import ContractInfoEmpty from './ContractInfoEmpty';
import ContractFeedback from './ContractFeedback';
import ProfileFeedbacks from './ProfileFeedbacks';
import { Desktop, Mobile } from '../generic/MediaQuery';
import { CONTRACT_STATE_FINISHED, CONTRACT_STATE_HALTED } from '../constants';

const SelectedContractInfo = ({ contract, onContractRate, time }) => {
  if(!contract) {
    let dateNow = Date.now();
    let contractDefault = {}
    return (
      <Desktop>
        <ContractInfoEmpty/>
      </Desktop>
      );
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
      return (<ContractInfo time={time} contract={contract}/>);
    }
  }
};

export default SelectedContractInfo;

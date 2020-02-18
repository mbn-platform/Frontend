import React from 'react';
import { connect } from 'react-redux';

import { Desktop } from 'generic/MediaQuery';
import { CONTRACT_STATE_FINISHED, CONTRACT_STATE_HALTED } from '../../constants';
import ContractInfo from './ContractInfo';
import ContractInfoEmpty from './ContractInfoEmpty';
import ContractFeedback from './ContractFeedback';
import ProfileFeedbacks from './ProfileFeedbacks';
import { rateContract } from 'actions/contracts';
import { profileIdSelector } from 'selectors/auth';
import { timeSelector } from 'selectors/time';

const SelectedContractInfo = ({ contract, time, userId, userName, rateContract }) => {
  const onContractRate = (feedback) => {
    rateContract(feedback, userName, time);
  };

  if(!contract) {
    return (
      <Desktop>
        <ContractInfoEmpty />
      </Desktop>
    );
  } else {
    if(contract.state === CONTRACT_STATE_FINISHED || contract.state === CONTRACT_STATE_HALTED) {
      if(canLeaveFeedback(contract, userId)) {
        return (
          <ContractFeedback
            contract={contract}
            onContractRate={onContractRate}
          />
        );
      } else {
        return (<ProfileFeedbacks
          comments={contract.feedbacks}
        />
        );
      }
    } else {
      return (<ContractInfo time={time} contract={contract}/>);
    }
  }
};

function canLeaveFeedback(contract, userId) {
  const feedback = contract.feedbacks.find(f => f.from._id === userId);
  return !feedback;
}

const mapStateToProps = (state) => ({
  userId: profileIdSelector(state),
  time: timeSelector(state),
});

const mapDispatchToProps = {
  rateContract,
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectedContractInfo);

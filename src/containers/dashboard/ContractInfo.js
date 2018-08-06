import React from 'react';
import PropTypes from 'prop-types';
import TimeLeft from '../../components/TimeLeft';
import ProfitLeft from '../../components/ProfitLeft';
import ProgressBar from '../../components/ProgressBar';

const ContractInfo = ({ contract, time }) => {
  const startDate = new Date(contract.dt);
  const expireDate = new Date(startDate.getTime() + contract.contractSettings.duration * 86400000);
  const progress = (expireDate - time) / (expireDate - startDate) * 100;
  const currentBalance = contract.totalInBTC / 100000000;
  const startBalance = contract.contractSettings.sum;
  const minBalance = startBalance * (1 - contract.contractSettings.maxLoss / 100);
  const maxBalance = contract.contractSettings.targetBalance / 100000000;
  let left = null, profitProgress = null;
  if(currentBalance) {
    left = maxBalance - currentBalance;
    profitProgress = (currentBalance - minBalance) / (maxBalance - minBalance) * 100;
  }
  return (
    <div>
      <div className="profit_time_wrapper_block">
        <div className="profit_time_block">
          <div className="time_left">
            <div className="time_left_wrapper">
              <TimeLeft startDate={startDate} expireDate={expireDate} time={time} progress={progress}/>
              <ProgressBar progress={progress} />
            </div>
          </div>
          <div className="profit_left">
            <ProfitLeft left={left} currency={contract.contractSettings.currency} progress={profitProgress}/>
            <ProgressBar progress={profitProgress} />
          </div>
        </div>
      </div>
    </div>
  );
};

ContractInfo.propTypes = {
  contract: PropTypes.object,
};

export default ContractInfo;



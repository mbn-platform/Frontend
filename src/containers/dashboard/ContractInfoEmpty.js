import React from 'react';
import TimeLeft from '../../components/TimeLeft';
import ProfitLeft from '../../components/ProfitLeft';
import ProgressBar from '../../components/ProgressBar';

class ContractInfoEmpty extends React.Component {
  render() {
    return (
      <div>
        <div className="profit_time_wrapper_block">
          <div className="profit_time_block">
            <div className="time_left">
              <div className="time_left_wrapper">
                <TimeLeft/>
                <ProgressBar/>
              </div>
            </div>
            <div className="profit_left">
              <ProfitLeft/>
              <ProgressBar/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ContractInfoEmpty;



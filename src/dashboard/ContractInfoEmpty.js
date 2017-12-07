import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './ContractInfo.css';

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

class TimeLeft extends React.Component {
  render() {
    return (
      <div className="time_profit_left_border">
        <div className="time_left_wrapper clearfix">
          <div className="time_left_title_wr">
            <div className="time_left_title">time left to complete:</div>
          </div>
        </div>
      </div>
    );
  }
}

const ProfitLeft = () => (
  <div className="time_profit_left_border">
    <div className="profit_left_wrapper clearfix">
      <div className="time_left_title_wr">
        <div className="time_left_title">profit left to complete:</div>
      </div>
      <div className="time_left_counts_wrapper">
        <div className="profit_left_count_wr">
          <div className={classNames('profit_left_count', 'green')}></div>
        </div>
      </div>
    </div>
  </div>
);

const ProgressBar = () => {
  return (
    <div className="progress_bar_wrapper clearfix">
    </div>
  );
}

export default ContractInfoEmpty;



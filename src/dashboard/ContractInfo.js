import React from 'react';
import PropTypes from 'prop-types';
import './ContractInfo.css';

class ContractInfo extends React.Component {

  render() {
    return (
      <div>
        <div className="time_left">
          <div className="time_left_wrapper">
            <TimeLeft />
            <ProgressBar progress={50} />
          </div>
        </div>
        <div className="profit_left">
          <ProfitLeft />
          <ProgressBar progress={30} />
        </div>
      <div className="table_rewind_page">
        <div className="table_rewind_page_wrapper">
          <div className="table_prev_page">
            <div className="table_prev_page--button"></div>
          </div>
          <div className="table_next_page">
            <div className="table_next_page--button"></div>
          </div>
        </div>
      </div>        
      </div>
    );
  }
}

const TimeLeft = () => (
  <div className="time_profit_left_border">
    <div className="time_left_wrapper clearfix">
      <div className="time_left_title_wr">
        <div className="time_left_title">time left to complete:</div>
      </div>
      <div className="time_left_counts_wrapper">
        <div className="time_left_count_wrapper days">
          <div className="time_left_count_big green">45</div>
          <div className="time_left_count_small">days</div>
        </div>
        <div className="time_left_count_wrapper dots"><span className="dots_couple green">:</span></div>
        <div className="time_left_count_wrapper hours">
          <div className="time_left_count_big green">4</div>
          <div className="time_left_count_small">hours</div>
        </div>
        <div className="time_left_count_wrapper dots-second"><span className="dots_couple green">:</span></div>
        <div className="time_left_count_wrapper min">
          <div className="time_left_count_big green">21</div>
          <div className="time_left_count_small">min</div>
        </div>
      </div>
    </div>    
  </div>
);

const ProfitLeft = () => (
  <div className="time_profit_left_border">
    <div className="profit_left_wrapper clearfix">
      <div className="time_left_title_wr">
        <div className="time_left_title">profit left to complete:</div>
      </div>
      <div className="time_left_counts_wrapper">
        <div className="profit_left_count_wr">
          <div className="profit_left_count">
            <span className="profit_left_count_value red">5,764</span> <span className="profit_left_count_valute red">btc</span></div>
        </div>
      </div>
    </div>
  </div>
);

const ProgressBar = ({ progress }) => {
  let className;
  if(progress > 66) {
    className = 'progress_bar green';
  } else if(progress > 33) {
    className = 'progress_bar yellow';
  } else {
    className = 'progress_bar red';
  }
  return (
    <div className="progress_bar_wrapper clearfix">
      <div className={className} style={{width: progress + '%'}}></div>
    </div>
  );
}

ContractInfo.propTypes = {
  contract: PropTypes.object,
  onCommentLeft: PropTypes.func.isRequired
};


export default ContractInfo;



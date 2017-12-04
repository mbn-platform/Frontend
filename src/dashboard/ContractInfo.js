import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './ContractInfo.css';

class ContractInfo extends React.Component {

  render() {
    const now = Date.now();
    const expireDate = this.props.contract.expireDate;
    const startDate = this.props.contract.startDate;
    const progress = (expireDate - now) / (expireDate - startDate) * 100;
    const { startBalance, currentBalance, left} = this.props.contract;
    const profitProgress = currentBalance > startBalance ? (1 - left / (left + currentBalance)) * 100 : 0;
    return (
      <div>
        <div className="profit_time_wrapper_block">
          <div className="profit_time_block">
            <div className="time_left">
              <div className="time_left_wrapper">
                <TimeLeft startDate={this.props.contract.startDate} expireDate={this.props.contract.expireDate} progress={progress}/>
                <ProgressBar progress={progress} />
              </div>
            </div>
            <div className="profit_left">
              <ProfitLeft {...this.props.contract} progress={profitProgress}/>
              <ProgressBar progress={profitProgress} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class TimeLeft extends React.Component {
  render() {
    console.log(this.props);
    const {expireDate} = this.props;
    const difference = expireDate - Date.now();
    const days = Math.floor(difference / 86400000);
    const hours = Math.floor(difference % 86400000 / 3600000);
    const minutes = Math.floor(difference % 60000 / 1000);
    const progress = this.props.progress;
    console.log('progress', progress)
    const color = getColor(progress);
    console.log(color);
    return (
      <div className="time_profit_left_border">
        <div className="time_left_wrapper clearfix">
          <div className="time_left_title_wr">
            <div className="time_left_title">time left to complete:</div>
          </div>
          <div className={classNames('time_left_counts_wrapper', color)}>
            <div className="time_left_count_wrapper days">
              <div className="time_left_count_big">{isNaN(days) ? 0 : days}</div>
              <div className="time_left_count_small">days</div>
            </div>
            <div className="time_left_count_wrapper dots"><span className="dots_couple">:</span></div>
            <div className="time_left_count_wrapper hours">
              <div className="time_left_count_big">{isNaN(hours) ? 0 : hours}</div>
              <div className="time_left_count_small">hours</div>
            </div>
            <div className="time_left_count_wrapper dots-second"><span className="dots_couple">:</span></div>
            <div className="time_left_count_wrapper min">
              <div className="time_left_count_big">{isNaN(minutes) ? 0 : minutes}</div>
              <div className="time_left_count_small">min</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function getColor(progress) {
  if(progress > 66 || isNaN(progress)) {
    return 'green';
  } else if(progress > 33) {
    return 'yellow';
  } else {
    return 'red';
  }
}

const ProfitLeft = ({left, currency, progress}) => (
  <div className="time_profit_left_border">
    <div className="profit_left_wrapper clearfix">
      <div className="time_left_title_wr">
        <div className="time_left_title">profit left to complete:</div>
      </div>
      <div className="time_left_counts_wrapper">
        <div className="profit_left_count_wr">
          <div className={classNames('profit_left_count', getColor(progress))}>
            <span className="profit_left_count_value">{left}</span> <span className="profit_left_count_valute">{currency}</span></div>
        </div>
      </div>
    </div>
  </div>
);

const ProgressBar = ({ progress }) => {
  if(progress < 1) {
    progress = 1;
  }
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
};

ContractInfo.propTypes = {
  contract: PropTypes.object,
  onCommentLeft: PropTypes.func.isRequired
};


export default ContractInfo;



import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class ContractInfo extends React.Component {

  render() {
    const {contract} = this.props;
    const startDate = new Date(contract.dt);
    const expireDate = new Date(startDate.getTime() + contract.contractSettings.duration * 86400000);
    const progress = (expireDate - this.props.time) / (expireDate - startDate) * 100;
    const currentBalance = contract.currentBalance;
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
                <TimeLeft startDate={startDate} expireDate={expireDate} time={this.props.time} progress={progress}/>
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
  }
}

class TimeLeft extends React.Component {
  render() {
    const {expireDate} = this.props;
    let difference = expireDate - this.props.time;
    if(difference < 0) {
      difference = 0;
    }
    const days = Math.floor(difference / 86400000);
    const hours = Math.floor(difference % 86400000 / 3600000);
    const minutes = Math.floor(difference % 3600000 / 60000);
    const progress = this.props.progress;
    const color = getColor(progress);
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
          {left == null ? (
            <div className={classNames('profit_left_count', 'green')}></div>
          ) : (
            <div className={classNames('profit_left_count', getColor(progress))}>
              <span className="profit_left_count_value">{formatBalance(left, currency)}</span> <span className="profit_left_count_valute">{currency}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

const ProgressBar = ({ progress }) => {
  if(progress === null) {
    return (
      <div className="progress_bar_wrapper clearfix">
      </div>
    );
  }
  if(progress < 1) {
    progress = 1;
  } else if(progress > 100) {
    progress = 100;
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
};
function formatBalance(value, name) {
  if(name === 'USDT') {
    return (value || 0).toFixed(2);
  } else {
    return (value || 0).toFixed(8);
  }
}


export default ContractInfo;



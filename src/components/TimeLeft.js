import React from 'react';
import classNames from 'classnames';
import { getColor } from '../generic/util';

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
          {
            progress && (<div className={classNames('time_left_counts_wrapper', color)}>
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
            </div>)
          }
        </div>
      </div>
    );
  }
}

export default TimeLeft;
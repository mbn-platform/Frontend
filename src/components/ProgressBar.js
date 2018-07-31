import React from 'react';

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

export default ProgressBar;
import BigNumber from 'bignumber.js';
import React from 'react';
import ProgressBar from '../../components/ProgressBar';

export const EarlyPoolProgress = ({ total, endJoin, limit }) => {
  const percent = new BigNumber(total).div(limit).times(100);
  let status;
  if (new Date(endJoin).getTime() <  Date.now()) {
    status = 'closed';
  } else if (total === limit) {
    status = 'filled';
  } else {
    status = 'open';
  }
  return (
    <div>
      Current status of the Early Adopters pool: {status}, {percent.toFixed(2)}%
      <ProgressBar progress={percent.toNumber()} />
    </div>
  );
};


import React from 'react';
import BigNumber from 'bignumber.js';

import ProgressBar from 'components/ProgressBar';

export const EarlyPoolProgress = ({ total, endJoin, limit }) => {
  let status;
  const percent = new BigNumber(total).div(limit).times(100);

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


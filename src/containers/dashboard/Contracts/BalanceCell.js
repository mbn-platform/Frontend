import BigNumber from 'bignumber.js';

export const BalanceCell = ({ value }) => BigNumber(value).toFixed();

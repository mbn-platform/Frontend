import { createSelector } from 'reselect';
import * as R from 'ramda';

import { currentContractsSelector } from './contracts';
import { ownKeysSelector } from './apiKeys';
import { profileSelector } from './auth';

const terminalSelector = R.prop('terminal');

export const groupSelector = createSelector(
  terminalSelector,
  R.prop('assetGroup'),
);

export const exchangeSelector = createSelector(
  terminalSelector,
  R.prop('exchange'),
);

export const fundSelector = createSelector(
  terminalSelector,
  R.prop('fund'),
);

export const marketSelector = createSelector(
  terminalSelector,
  R.prop('market'),
);

export const intervalSelector = createSelector(
  terminalSelector,
  R.prop('interval'),
);

export const assetGroupSelector = createSelector(
  terminalSelector,
  R.prop('assetGroup'),
);

export const fundsSelector = createSelector(
  currentContractsSelector,
  ownKeysSelector,
  groupSelector,
  profileSelector,
  (contracts, apiKeys, assetGroup, profile) => {
    let funds;

    if (assetGroup) {
      funds = contracts.filter((c) => assetGroup.contracts.includes(c._id));
    } else {
      funds = apiKeys.concat(contracts.filter(contract => contract.to._id === profile._id));
    }

    return funds;
  },
);

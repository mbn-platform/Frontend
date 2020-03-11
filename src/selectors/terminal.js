import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';
import * as R from 'ramda';
import isEqual from 'lodash/isEqual';

import { currentContractsSelector } from './contracts';
import { assetGroupsSelector } from './assetGroups';
import { ownKeysSelector } from './apiKeys';
import { profileSelector } from './auth';
import { exchangesInfoSelector } from './exchangesInfo';

const terminalSelector = R.prop('terminal');
export const groupIdSelector = R.path(['terminal', 'groupId']);
export const fundIdSelector = R.path(['terminal', 'fundId']);

export const exchangeSelector = createSelector(
  terminalSelector,
  R.prop('exchange'),
);

export const ordersSelector = createSelector(
  terminalSelector,
  R.prop('orders'),
);

export const marketSelector = createSelector(
  terminalSelector,
  R.prop('market'),
);

export const intervalSelector = createSelector(
  terminalSelector,
  R.prop('interval'),
);

export const orderBookSelector = createSelector(
  terminalSelector,
  R.prop('orderBook'),
);

export const historySelector = createSelector(
  terminalSelector,
  R.prop('history'),
);

export const tickerSelector = createSelector(
  terminalSelector,
  R.prop('ticker'),
);

export const isValidUrlSelector = createSelector(
  terminalSelector,
  R.prop('isValidUrl'),
);

export const assetGroupSelector = createSelector(
  assetGroupsSelector,
  groupIdSelector,
  (groups, id) => groups.find(group => group._id === id),
);

export const exchangesByExchangeSelector = createSelector(
  exchangesInfoSelector,
  exchangeSelector,
  (exchangesInfo, exchange) => R.propOr({}, exchange, exchangesInfo),
);

export const exchangeRatesSelector = createSelector(
  exchangesByExchangeSelector,
  R.propOr({}, 'rates'),
);

export const exchangeMarketsSelector = createSelector(
  exchangesByExchangeSelector,
  R.propOr([], 'markets'),
);

const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual,
);

export const fundsSelector = createDeepEqualSelector(
  currentContractsSelector,
  assetGroupSelector,
  ownKeysSelector,
  profileSelector,
  (contracts, assetGroup, apiKeys, profile) => {
    let funds = [];

    if (assetGroup) {
      funds = contracts.filter((c) => assetGroup.contracts.includes(c._id));
    } else {
      funds = apiKeys.concat(contracts.filter(contract => contract.to._id === profile._id));
    }

    return funds;
  },
);

export const fundSelector = createSelector(
  fundsSelector,
  fundIdSelector,
  (funds, id) => funds.find(fund => fund._id === id),
);

export const controlSelector = createSelector(
  fundSelector,
  assetGroupSelector,
  (fund, group) => fund || group,
);

export const fundBalancesSelector = createSelector(
  fundSelector,
  R.propOr(null, 'balances'),
);

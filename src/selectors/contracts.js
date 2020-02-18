import { createSelector } from 'reselect';
import * as R from 'ramda';

export const contractsSelector = R.prop('contracts');

export const currentContractsSelector = createSelector(
  contractsSelector,
  R.prop('current'),
);

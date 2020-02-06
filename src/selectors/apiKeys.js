import { createSelector } from 'reselect';
import * as R from 'ramda';

const apiKeysSelector = R.prop('apiKeys');

export const ownKeysSelector = createSelector(
  apiKeysSelector,
  R.prop('ownKeys'),
);

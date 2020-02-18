import { createSelector } from 'reselect';
import * as R from 'ramda';

export const apiKeysSelector = R.prop('apiKeys');

export const ownKeysSelector = createSelector(
  apiKeysSelector,
  R.prop('ownKeys'),
);

export const botKeysSelector = createSelector(
  apiKeysSelector,
  R.prop('botKeys'),
);

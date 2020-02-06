import { createSelector } from 'reselect';
import * as R from 'ramda';

const exchangesInfoSelector = R.prop('exchangesInfo');

export const exchangesSelector = createSelector(
  exchangesInfoSelector,
  R.propOr([], 'exchanges'),
);

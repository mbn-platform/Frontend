import { createSelector } from 'reselect';
import * as R from 'ramda';

const authSelector = R.prop('auth');

export const loggedInSelector = createSelector(
  authSelector,
  R.prop('loggedIn'),
);

export const profileSelector = createSelector(
  authSelector,
  R.prop('profile'),
);

export const profileIdSelector = createSelector(
  profileSelector,
  R.prop('_id'),
);

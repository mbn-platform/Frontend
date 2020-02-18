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

export const mfaEnabledSelector = createSelector(
  profileSelector,
  R.prop('mfaEnabled'),
);

export const billingSelector = createSelector(
  profileSelector,
  R.prop('billing'),
);


export const profileNameSelector = createSelector(
  profileSelector,
  R.prop('name'),
);

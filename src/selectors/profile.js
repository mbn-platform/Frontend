import { createSelector } from 'reselect';
import * as R from 'ramda';

export const profileSelector = R.prop('profile');

export const contactsSelector = createSelector(
  profileSelector,
  R.prop('contacts'),
);

export const notificationSettingsSelector = createSelector(
  profileSelector,
  R.prop('notificationSettings'),
);

export const infoSelector = createSelector(
  profileSelector,
  R.prop('info'),
);

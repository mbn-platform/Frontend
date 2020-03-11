import { createSelector } from 'reselect';
import * as R from 'ramda';

const paymentsSelector = R.prop('payments');

export const paymentRequestSelector = createSelector(
  paymentsSelector,
  R.prop('paymentRequest'),
);

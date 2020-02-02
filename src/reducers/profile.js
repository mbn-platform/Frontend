import { reducerCreator } from 'generic/util';
import {
  GET_PROFILE, UPDATE_PROFILE_AVAILABLE, UPDATE_PROFILE,
  TRADES_FOR_USER, GET_FEEDBACKS, STATS_FOR_USER,
} from 'actions/profile';

const reducerList = {
  [GET_PROFILE]: (_, { profile }) => ({
    ...profile, trades: [], feedbacks: [], stats: [],
  }),
  [GET_FEEDBACKS]: (state, { name, feedbacks }) => (
    name === state.name
      ? { ...state, feedbacks }
      : state
  ),
  [UPDATE_PROFILE_AVAILABLE]: (state, { profile }) => {
    const { available, contractSettings, currencies } = profile;
    return { ...state, available, contractSettings, currencies };
  },
  [UPDATE_PROFILE]: (state, { profile }) => ({ ...state, profile }),
  [TRADES_FOR_USER]: (state, { name, trades }) => (
    name === state.name
      ? { ...state, trades: trades.filter(ff).map(mf).sort(sf), }
      : state
  ),
  [STATS_FOR_USER]: (state, { name, stats, summary }) => (
    name === state.name
      ? { ...state, stats, summary }
      : state
  ),
};

const mf = t => {
  const [main, secondary] = t.symbol.split('-');
  return {
    date: t.dt,
    amountCurrency: secondary,
    mainCurrency: main,
    price: t.price / t.filled,
    amount: t.filled,
    total: t.price,
    type: t.type,
  };
};

const ff = t => t.filled > 0;
const sf = (t1, t2) => t2.dt - t1.dt;

export default reducerCreator({}, reducerList);

import { GET_PROFILE, UPDATE_PROFILE, TRADES_FOR_USER } from '../actions/profile';

export default function(state = {}, action) {
  switch(action.type) {
    case GET_PROFILE:
      if(state.name === action.profile.name) {
        action.profile.trades = state.trades;
      }
      return action.profile;
    case UPDATE_PROFILE:
      const {availableForOffers, fee, minAmount, roi, minAmountCurrency, duration, maxLoss, currencies} = action.profile;
      return {...state, availableForOffers, fee, minAmount, roi, minAmountCurrency, duration, maxLoss, currencies};
    case TRADES_FOR_USER: {
      if(action.name === state.name) {
        const {asInvestor, asTrader} = action.trades;
        const trades = {};
        trades.asInvestor = asInvestor.filter(ff).map(mf).sort(sf);
        trades.asTrader = asTrader.filter(ff).map(mf).sort(sf);
        return {...state, trades};
      } else {
        return state;
      }
    }
    default:
      return state;
  }
}

const mf = t => {
  const [main, secondary] = t.market.split('-');
  return {
    date: t.dt,
    amountCurrency: secondary,
    mainCurrency: main,
    price: t.rate,
    amount: t.filled,
    total: t.filled * t.rate,
    type: t.type,
  };
};

const ff = t => t.filled > 0;
const sf = (t1, t2) => t2.date - t1.date;

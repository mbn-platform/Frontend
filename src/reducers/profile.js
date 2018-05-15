import {GET_PROFILE, UPDATE_PROFILE, TRADES_FOR_USER, GET_FEEDBACKS} from '../actions/profile';

export default function(state = {}, action) {
  switch(action.type) {
    case GET_PROFILE:
      if(state.name === action.profile.name) {
        action.profile.trades = state.trades;
      }
      return {...state, ...action.profile};
    case GET_FEEDBACKS:
      return {...state, feedbacks: action.feedbacks}
    case UPDATE_PROFILE:
      const {available, contractSettings, currencies} = action.profile;
      return {...state, available, contractSettings, currencies};
    case TRADES_FOR_USER: {
      if(action.name === state.name) {
        let trades = action.trades;
        trades = trades.filter(ff).map(mf).sort(sf);
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
  const [main, secondary] = t.symbol.split('-');
  return {
    date: t.dt,
    amountCurrency: secondary,
    mainCurrency: main,
    price: t.limit,
    amount: t.filled,
    total: t.price,
    type: t.type,
  };
};

const ff = t => t.filled > 0;
const sf = (t1, t2) => t2.dt - t1.dt;

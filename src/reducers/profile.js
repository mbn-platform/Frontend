import {GET_PROFILE, UPDATE_PROFILE_AVAILABLE, UPDATE_PROFILE, TRADES_FOR_USER, GET_FEEDBACKS, STATS_FOR_USER} from '../actions/profile';

export default function(state = {}, action) {
  switch(action.type) {
    case GET_PROFILE:
      return {...action.profile, trades: [], feedbacks: [], stats: []};
    case GET_FEEDBACKS:
      if(action.name === state.name) {
        return {...state, feedbacks: action.feedbacks};
      } else {
        return state;
      }
    case UPDATE_PROFILE_AVAILABLE:
      const {available, contractSettings, currencies} = action.profile;
      return {...state, available, contractSettings, currencies};

    case UPDATE_PROFILE:
      return {...state, ...action.profile};

    case TRADES_FOR_USER: {
      if(action.name === state.name) {
        const trades = action.trades.filter(ff).map(mf).sort(sf);
        return {...state, trades};
      } else {
        return state;
      }
    }
    case STATS_FOR_USER: {
      if (action.name === state.name) {
        return {...state, stats: action.stats, summary: action.summary};
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
    price: t.price / t.filled,
    amount: t.filled,
    total: t.price,
    type: t.type,
  };
};

const ff = t => t.filled > 0;
const sf = (t1, t2) => t2.dt - t1.dt;

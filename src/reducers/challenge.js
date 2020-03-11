import { reducerCreator } from 'generic/util';
import { UPDATE_CHALLENGE, NEXT_STATUS, NEXT_PARTICIPATE } from 'actions/challenge';
import { PROFIT_CALCULATION } from 'actions/profile';

const reducerList = {
  [NEXT_STATUS]: (state, { next }) => ({ ...(state || {}), next }),
  [UPDATE_CHALLENGE]: (state, { challenge }) => ({ ...state, ...challenge }),
  [NEXT_PARTICIPATE]: (state) => ({ ...state, nextRound: true }),
  [PROFIT_CALCULATION]: (state, { info }) => ({ ...state, calculation: info }),
};

export default reducerCreator(null, reducerList);

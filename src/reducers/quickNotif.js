import { reducerCreator } from 'generic/util';
import { ADD_QUICK_NOTIF, REMOVE_QUICK_NOTIF } from 'actions/quickNotif';

const reducerList = {
  [ADD_QUICK_NOTIF]: (state, { quickNotif }) => (
    Array.isArray(quickNotif)
      ? [...quickNotif, ...state]
      : [quickNotif, ...state]
  ),
  [REMOVE_QUICK_NOTIF]: (state, { quickNotif }) => (
    state.filter(qn => qn.object._id !== quickNotif.object._id)
  ),
};

export default reducerCreator([], reducerList);

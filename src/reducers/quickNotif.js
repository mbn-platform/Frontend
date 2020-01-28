import { ADD_QUICK_NOTIF, REMOVE_QUICK_NOTIF } from '../actions/quickNotif';

export default function(state = [], action) {
  switch (action.type) {
    case ADD_QUICK_NOTIF:
      if (Array.isArray((action.quickNotif))) {
        return [...action.quickNotif, ...state];
      } else {
        return [action.quickNotif, ...state];
      }
    case REMOVE_QUICK_NOTIF:
      return state.filter((quickNotif) => quickNotif.object._id !== action.quickNotif.object._id);
    default:
      return state;
  }
}

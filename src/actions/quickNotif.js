export const ADD_QUICK_NOTIF = 'ADD_QUICK_NOTIF';
export const REMOVE_QUICK_NOTIF = 'REMOVE_QUICK_NOTIF';

export function addQuickNotif(not) {
  return ({
    type: ADD_QUICK_NOTIF,
    quickNotif: not,
  });
}

export function removeQuickNotif(not) {
  return ({
    type: REMOVE_QUICK_NOTIF,
    quickNotif: not,
  });
}

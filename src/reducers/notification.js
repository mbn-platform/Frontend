import { reducerCreator } from 'generic/util';
import { SHOW_NOTIFICATION, CLOSE_NOTIFICATION } from 'actions/notification';

const initialState = {
  notificationType : 'info',
  message: '',
  url: '',
  notificationID: null,
  isVisible: false,
};

const reducerList = {
  [SHOW_NOTIFICATION]: (state, { notificationType, notificationID, message, url }) => ({
    ...state,
    notificationType,
    notificationID,
    message,
    url,
    isVisible: true,
  }),
  [CLOSE_NOTIFICATION]: (state) => ({ ...state, isVisible: false }),
};

export default reducerCreator(initialState, reducerList);

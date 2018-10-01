import { SHOW_NOTIFICATION, CLOSE_NOTIFICATION } from '../actions/notification';

export default function(state = {
  notificationType : 'info',
  message: '',
  url: '',
  notificationID: null,
  isVisible: false
},
{
  notificationType,
  notificationID,
  message,
  url,
  type
}) {
  switch(type) {
    case SHOW_NOTIFICATION:
      return {
        ...state,
        notificationType,
        notificationID,
        message,
        url,
        isVisible: true,
      };
    case CLOSE_NOTIFICATION:
      return {
        ...state,
        isVisible: false,
      };
    default:
      return state;
  }
}

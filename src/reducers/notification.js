import { SHOW_NOTIFICATION, CLOSE_NOTIFICATION } from '../actions/notification';

export default function(state = {
  notificationType : 'info',
  message:'',
  url: '',
  isVisible: false
},
{
  notificationType,
  message,
  url,
  type
}) {
  switch(type) {
    case SHOW_NOTIFICATION:
      return {
        ...state,
        notificationType: notificationType,
        message: message,
        url: url,
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

import { ACCEPT_OFFER, REJECT_OFFER, CANCEL_OFFER } from '../actions/offers';
const OFFERS = [
  {owned: true, link: '/profile/some', created: Date.now(), id: 'abc123', keyId: 2} ,
  {owned: false, link: '/profile/other', created: Date.now(), id: 'asd123', keyId: 1}
];

export default function(state = OFFERS, action) {
  switch(action.type) {
    case REJECT_OFFER:
    case CANCEL_OFFER:
    case ACCEPT_OFFER:
      return state.filter(o => o.id !== action.offer.id);
    default:
      return state;
  }
}

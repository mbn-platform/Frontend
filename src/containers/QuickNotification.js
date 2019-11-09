import BN from 'bignumber.js';
import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'reactstrap';
import { removeQuickNotif } from '../actions/quickNotif';
import './QuickNotification.css';

class QuickNotification extends React.Component {

  static defaultProps = {
    maxCount: 2,
  }

  onEventClick = (event) => {
    this.props.removeQuickNotif(event);
  }

  render() {
    if (this.props.events.length === 0) {
      return null;
    }
    const style = {
      fontSize: '14px',
      position: 'fixed',
      bottom: 0,
      right: 0,
      padding: '20px',
      maxWidth: '100%',
    };
    return (
      <div style={style}>
        {this.props.events.map((e, i) => {
          if (i >= this.props.maxCount) {
            return null;
          } else {
            switch (e.type) {
              case 'order_closed': {
                return <OrderNotification event={e} onClick={this.onEventClick} key={e.object._id} />;
              }
              case 'request_timed_out':
              case 'request_created':
              case 'request_accepted':
              case 'request_canceled':
              case 'request_verified':
              case 'request_rejected': {
                return <RequestNotification event={e} onClick={this.onEventClick} key={e.object._id} />;
              }
              default:
                return null;
            }
          }
        })}
      </div>
    );
  }
}

function RequestNotification({event, onClick}) {
  const contract = event.object;
  return (
    <Card className="quick-notif" onClick={() => onClick(event)}>
      <div className="top-block">
        <span className="time">{formatDate(new Date())}</span>
        <span className="close-notif" />
      </div>
      <div className="title">
        {requestNotifTitle(event.type)}
      </div>
      <div>{contract.contractSettings.sum} {contract.contractSettings.currency}</div>
    </Card>
  );
}

function requestNotifTitle(event) {
  switch (event) {
    case 'request_rejected':
      return 'Contract request rejected';
    case 'request_created':
      return 'New contract request';
    case 'request_canceled':
      return 'Contract request canceled';
    case 'request_accepted': {
      return 'Contract request accepted';
    }
    case 'request_verified': {
      return 'Contract verified';
    }
    case 'request_timed_out': {
      return 'Contract request expired';
    }
    default:
      return '';
  }
}

function OrderNotification({event, onClick}) {
  const order = event.object;
  const [main, secondary] = order.symbol.split('-');
  let message;
  if (order.canceledAt) {
    message = 'Order canceled';
  } else if (order.state === 'CLOSED') {
    message = 'Order executed';
  }
  let price;
  if (order.filled > 0) {
    price = new BN(order.price / order.filled).dp(8).toString();
  } else {
    price = '0';
  }

  return (
    <Card className="quick-notif" onClick={() => onClick(event)}>
      <div className="top-block">
        <span className="time">{formatDate(new Date(order.dtClose))}</span>
        <span className="close-notif" />
      </div>
      <div className="title">
        {message}
      </div>
      <div>Filled: {order.filled} {secondary}</div>
      <div>Price: {price} {main}</div>
      <div>Total: {order.price} {main}</div>
    </Card>
  );
}

const mapStateToProps = (state) => ({events: state.quickNotif});
const mapDispatchToProps = (dispatch) => ({
  removeQuickNotif: (event) => dispatch(removeQuickNotif(event)),
});
export default connect(mapStateToProps, mapDispatchToProps)(QuickNotification);

// function PriceChange({value, interval}) {
//   if (value) {
//     return <span>Price change: <b>{formatPercentValueWithSign(value.percent)} / {formatTimeInterval(interval)}</b></span>;
//   } else {
//     return null;
//   }
// }
function formatDate(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`;
}

function padTime(value) {
  return value < 10 ? '0' + value : value;
}
// function VolumeChange({value, interval}) {
//   if (value) {
//     return <span>Volume change: <b>{formatPercentValueWithSign(value.percent)} / {formatTimeInterval(interval)}</b></span>;
//   } else {
//     return null;
//   }
// }

// function formatPercentValueWithSign(value) {
//   const sign = value >= 0 ? '+' : '';
//   return `${sign}${value.toFixed(2)}%`;
// }

// function formatTimeInterval(interval) {
//   switch (interval) {
//     case 5:
//     case 15:
//       return `${interval} min`;
//     case 60:
//       return '1 h';
//     case 120:
//       return '2 h';
//     case 240:
//       return '4 h';
//     case 1440:
//       return '1 d';
//     case 3 * 1440:
//       return '3 d';
//     case 7 * 1440:
//       return '7 d';
//     case 30 * 1440:
//       return '1 month';
//     default:
//       return `${interval}`;
//   }
// }


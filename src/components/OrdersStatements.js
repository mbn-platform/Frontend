import React from 'react';

function padDate(number) {
  return number < 10 ? '0' + number : number;
};

function formatDate(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  year = padDate(year);
  month = padDate(month);
  day = padDate(day);
  return day + '.' + month + '.' + year;
}

export const OpenOrder = ({order, onOrderCancel, isFullScreen}) => {
  const [main, secondary] = isFullScreen ? order.symbol.split('-') : null;
  return (
    <tr className={order.type}>
      {isFullScreen ?
        <td className="text-capitalize">
          <span className="round"/>
        </td> :
        <td>
          <div className="round-wrapper">
            <span className="round center"/>
          </div>
        </td>
      }
      {isFullScreen && <td>{formatDate(new Date(order.dt))}</td>}
      {isFullScreen && <td>{secondary + '/' + main}</td>}
      <td>{order.limit}</td>
      <td>{order.filled}</td>
      <td>{order.amount}</td>
      <td className="ellipsis-cell">{order.price}</td>
      <td onClick={() => onOrderCancel(order)}><span className="remove"/></td>
    </tr>
  );
};

export const CompletedOrder = ({order, isFullScreen}) => {
  const [main, secondary] = isFullScreen ? order.symbol.split('-') : null;
  return (
    <tr className={order.type}>
      { isFullScreen ?
        <td className="text-capitalize">
          <span className="round"/>
        </td> :
        <td>
          <div className="round-wrapper">
            <span className="round center"/>
          </div>
        </td>
      }
      {isFullScreen && <td>{formatDate(new Date(order.dt))}</td>}
      {isFullScreen && <td>{secondary + '/' + main}</td>}
      <td>{order.price ? (order.price / order.filled).toFixed(8) : order.limit}</td>
      <td>{order.filled}</td>
      <td>{order.amount}</td>
      <td className="ellipsis-cell">{order.price}</td>
    </tr>
  );
};
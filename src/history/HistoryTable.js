import React from 'react';

class HistoryTable extends React.Component {

  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className="history-main__block">
        <div className="table-wrap js-table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Market <span className="icon-dir icon-down-dir"></span></th>
                <th>Type <span className="icon-dir icon-down-dir"></span></th>
                <th>Price<span className="hide-mobile">/Share</span> <span className="icon-dir icon-down-dir"></span></th>
                <th>Amount <span className="icon-dir icon-down-dir"></span></th>
                <th>Total <span className="icon-dir icon-down-dir"></span></th>
                <th><span className="hide-mobile">Transacton</span> Date <span className="icon-dir icon-down-dir"></span></th>
              </tr>
            </thead>
            <tbody>
                    {this.props.history.map(o => (
                      <OpenHistory
                        key={o._id}
                        history={o}
                      />
                    ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
};


const OpenHistory = ({history}) => (
  <tr className={history.type}>

    <td>{history.market}</td>
    <td className="text-capitalize">
      <span className="round"></span> {history.type}
    </td>    
    <td>{history.price}</td>    
    <td>{history.amount}</td>    
    <td>{history.total}</td>    
    <td>{formatDate(new Date(history.dateOpened))}</td>
  </tr>
);

function formatDate(date) {
    console.log(typeof date);
    console.log(date);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = padDate(date.getHours());
    let minute = padDate(date.getMinutes());
    let second = padDate(date.getSeconds());
    year = padDate(year);
    month = padDate(month);
    day = padDate(day);
    return day + '.' + month + '.' + year + ' ' + hour + ':' + minute + ':' + second;
}


function padDate(number) {
  return number < 10 ? '0' + number : number;
};

export default HistoryTable;

import React from 'react';
import { defaultFormatValue } from '../generic/util';
import {sortData, onColumnSort, classNameForColumnHeader}  from '../generic/terminalSortFunctions';

class HistoryTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {sort: {}};
    this.sortData = sortData.bind(this);
    this.onColumnSort = onColumnSort.bind(this);
    this.sortFunctions = {};    
  }


  render() {
    const data = (this.props.history || []).filter(h => h.filled > 0);
    const sortedData = this.sortData(data);
    return (
      <div className="history-main__block">
        <div className="table-wrap js-table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th onClick={() => this.onColumnSort('type')}><br className="show-mobile"/><span className={classNameForColumnHeader(this.state, 'type')}></span></th>
                <th onClick={() => this.onColumnSort('market')}>Market <span className={classNameForColumnHeader(this.state, 'market')}></span></th>                      
                <th onClick={() => this.onColumnSort('price')}>Price <span className={classNameForColumnHeader(this.state, 'price')}></span></th>
                <th onClick={() => this.onColumnSort('amount')}>Amount <span className={classNameForColumnHeader(this.state, 'amount')}></span></th>
                <th onClick={() => this.onColumnSort('total')}>Total <span className={classNameForColumnHeader(this.state, 'total')}></span></th>
                <th onClick={() => this.onColumnSort('dateOpened')}><span className="hide-mobile">Transacton</span> Date <span className={classNameForColumnHeader(this.state, 'dateOpened')}></span></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map(h => (
                <History
                  key={h._id}
                  history={h}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const History = ({history}) => {
  const [first] = history.market.split('-');
  return (
    <tr className={history.type}>
      <td className="text-capitalize">
        <span className="round"></span>
      </td>
      <td>{history.market}</td>
      <td>{defaultFormatValue(history.rate, first)}</td>
      <td>{history.filled}</td>
      <td>{defaultFormatValue(history.filled * history.rate, first) + ' ' + first}</td>
      <td>{formatDate(new Date(history.dt))}</td>
    </tr>
  );
};

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

export default HistoryTable;

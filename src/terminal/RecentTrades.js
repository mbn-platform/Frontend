import React from 'react';

class RecentTrades extends React.Component {
  render() {
    return (
      <div className="trades-table chart col-12 col-sm-6 col-md-12">
        <div className="chart__top justify-content-between row">
          <div className="chart-name">Recent Trades</div>
          <div className="chart-controls align-items-center justify-content-between row">
            <div className="control-resize"></div>
            <div className="control-dash"></div>
          </div>
        </div>

        <div className="trades-table-wrapper js-table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>

                  <div>Price (ETH) <span className="icon-dir icon-down-dir"></span></div>
                </th>
                <th>
                  <div>Trade Size <span className="icon-dir icon-down-dir"></span></div>
                </th>
                <th >
                  <div>Time <span className="icon-dir icon-down-dir"></span></div>
                </th>
                <th>

                </th>
              </tr>
            </thead>
            <tbody className="tbody">
              <tr className="up">
                <td>
                  4086.4
                  <span className="icon icon-dir icon-up-dir"></span>
                </td>
                <td>
                  250
                </td>
                <td>
                  8:46:41 PM
                </td>
                <td>
                  B
                </td>
              </tr>
              <tr className="down">
                <td>
                  4086.3
                  <span className="icon icon-dir icon-down-dir"></span>
                </td>
                <td>
                  40
                </td>
                <td>
                  8:46:32 PM
                </td>
                <td>
                  S
                </td>
              </tr>
              <tr className="up">
                <td>
                  4086.4
                  <span className="icon icon-dir icon-up-dir"></span>
                </td>
                <td>
                  250
                </td>
                <td>
                  8:46:41 PM
                </td>
                <td>
                  B
                </td>
              </tr>
              <tr className="down">
                <td>
                  4086.3
                  <span className="icon icon-dir icon-down-dir"></span>
                </td>
                <td>
                  40
                </td>
                <td>
                  8:46:32 PM
                </td>
                <td>
                  S
                </td>
              </tr>
              <tr className="up">
                <td>
                  4086.4
                </td>
                <td>
                  250
                </td>
                <td>
                  8:46:41 PM
                </td>
                <td>
                  B
                </td>
              </tr>
              <tr className="up">
                <td>
                  4086.4
                </td>
                <td>
                  250
                </td>
                <td>
                  8:46:41 PM
                </td>
                <td>
                  B
                </td>
              </tr>
              <tr className="up">
                <td>
                  4086.4
                </td>
                <td>
                  250
                </td>
                <td>
                  8:46:41 PM
                </td>
                <td>
                  B
                </td>
              </tr>
              <tr className="up">
                <td>
                  4086.4
                </td>
                <td>
                  250
                </td>
                <td>
                  8:46:41 PM
                </td>
                <td>
                  B
                </td>
              </tr>
              <tr className="up">
                <td>
                  4086.4
                </td>
                <td>
                  250
                </td>
                <td>
                  8:46:41 PM
                </td>
                <td>
                  B
                </td>
              </tr>

              <tr className="down">
                <td>
                  4086.3
                </td>
                <td>
                  1996
                </td>
                <td>
                  8:46:32 PM
                </td>
                <td>
                  S
                </td>
              </tr>
              <tr className="down">
                <td>
                  4086.3
                </td>
                <td>
                  40
                </td>
                <td>
                  8:46:32 PM
                </td>
                <td>
                  S
                </td>
              </tr>
              <tr className="down">
                <td>
                  4086.3
                </td>
                <td>
                  40
                </td>
                <td>
                  8:46:32 PM
                </td>
                <td>
                  S
                </td>
              </tr>
              <tr className="down">
                <td>
                  4086.3
                </td>
                <td>
                  40
                </td>
                <td>
                  8:46:32 PM
                </td>
                <td>
                  S
                </td>
              </tr>

              <tr className="up">
                <td>
                  4086.4
                  <span className="icon icon-dir icon-up-dir"></span>
                </td>
                <td>
                  250
                </td>
                <td>
                  8:46:41 PM
                </td>
                <td>
                  B
                </td>
              </tr>
              <tr className="down">
                <td>
                  4086.3
                  <span className="icon icon-dir icon-down-dir"></span>
                </td>
                <td>
                  40
                </td>
                <td>
                  8:46:32 PM
                </td>
                <td>
                  S
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default RecentTrades;

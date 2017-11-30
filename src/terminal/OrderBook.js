import React from 'react';

class OrderBook extends React.Component {
  render() {
    return (
      <div className="orderbook-table chart col-12 col-sm-6 col-md-12">
        <div className="chart__top justify-content-between row">
          <div className="chart-name">Order Book</div>
          <div className="chart-controls align-items-center justify-content-between row">
            <div className="control-resize"></div>
            <div className="control-dash"></div>
          </div>
        </div>
        <div className="orderbook-table-wrapper js-table-wrapper">
          <table className="table red">
            <thead>
              <tr>
                <th>
                  <div>Price <span className="icon-dir icon-down-dir"></span></div>
                </th>
                <th>
                  <div>Size <span className="icon-dir icon-down-dir"></span></div>
                </th>
                <th>
                  <div>Total <span className="icon-dir icon-down-dir"></span></div>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="tbody">
              <tr className="sz-100">
                <td>
                  0.290
                </td>
                <td>
                  <span className="white">4.</span>
                  <span>04994</span>
                </td>
                <td>
                  32161
                </td>
                <td>
                  <span className="dash"></span>
                </td>
              </tr>
              <tr className="sz-75">
                <td>
                  0.290
                </td>
                <td>
                  <span className="white">3.</span>
                  <span>04994</span>
                </td>
                <td>
                  32161
                </td>
                <td>
                  <span className="dash"></span>
                </td>
              </tr>
              <tr className="sz-50">
                <td>
                  0.290
                </td>
                <td>
                  <span className="white">2.</span>
                  <span>04994</span>
                </td>
                <td>
                  32161
                </td>
                <td>
                  <span className="dash"></span>
                </td>
              </tr>
              <tr className="sz-25">
                <td>
                  0.290
                </td>
                <td>
                  <span className="white">1.</span>
                  <span>04994</span>
                </td>
                <td>
                  32161
                </td>
                <td>
                  <span className="dash"></span>
                </td>
              </tr>
              <tr>
                <td>
                  0.290
                </td>
                <td>
                  <span className="white">4.</span>
                  <span>04994</span>
                </td>
                <td>
                  32161
                </td>
                <td>
                  <span className="dash"></span>
                </td>
              </tr>
              <tr>
                <td>
                  0.290
                </td>
                <td>
                  <span className="white">4.</span>
                  <span>04994</span>
                </td>
                <td>
                  32161
                </td>
                <td>
                  <span className="dash"></span>
                </td>
              </tr>
              <tr>
                <td>
                  0.290
                </td>
                <td>
                  <span className="white">4.</span>
                  <span>04994</span>
                </td>
                <td>
                  32161
                </td>
                <td>
                  <span className="dash"></span>
                </td>
              </tr>
              <tr>
                <td>
                  0.290
                </td>
                <td>
                  <span className="white">4.</span>
                  <span>04994</span>
                </td>
                <td>
                  32161
                </td>
                <td>
                  <span className="dash"></span>
                </td>
              </tr>

      </tbody>
    </table>
  </div>
  <div className="value row up">
    <span>0.216</span>
    <span className="icon icon-dir icon-up-dir"></span>
  </div>
  <div className="orderbook-table-wrapper js-table-wrapper">
    <table className="table green">
      <tbody>
        <tr className="sz-100">
          <td>
            0.290
          </td>
          <td>
            <span className="white">4.</span>
            <span>04994</span>
          </td>
          <td>
            32161
          </td>
          <td>
            <span className="dash"></span>
          </td>
        </tr>
        <tr className="sz-100">
          <td>
            0.290
          </td>
          <td>
            <span className="white">4.</span>
            <span>04994</span>
          </td>
          <td>
            32161
          </td>
          <td>
            <span className="dash"></span>
          </td>
        </tr>
        <tr className="sz-75">
          <td>
            0.290
          </td>
          <td>
            <span className="white">3.</span>
            <span>04994</span>
          </td>
          <td>
            32161
          </td>
          <td>
            <span className="dash"></span>
          </td>
        </tr>
        <tr className="sz-25">
          <td>
            0.290
          </td>
          <td>
            <span className="white">1.</span>
            <span>04994</span>
          </td>
          <td>
            32161
          </td>
          <td>
            <span className="dash"></span>
          </td>
        </tr>

        <tr className="sz-100">
          <td>
            0.290
          </td>
          <td>
            <span className="white">4.</span>
            <span>04994</span>
          </td>
          <td>
            32161
          </td>
          <td>
            <span className="dash"></span>
          </td>
        </tr>
        <tr className="sz-50">
          <td>
            0.290
          </td>
          <td>
            <span className="white">2.</span>
            <span>04994</span>
          </td>
          <td>
            32161
          </td>
          <td>
            <span className="dash"></span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

    );
  }
}

export default OrderBook;

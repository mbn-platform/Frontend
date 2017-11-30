import React from 'react';

class OrdersTable extends React.Component {
  render() {
    return (
      <div className="orders-main__block">
        <div className="block__top">
          <div className="block__top-switch-wrap">
            <a href='#' className="block__top-switch orders-open active">
              Open Orders
            </a>
            <a href='#' className="block__top-switch orders-completed">
              Completed orders
            </a>
          </div>
        </div>
        <div className="orders-tabs">
          <div className="orders-tab orders-open active">
            <div className="orders-table-wrap js-table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Type <span className="icon-dir icon-down-dir"></span></th>
                    <th>Opened <span className="hide-mobile">Date</span> <span className="icon-dir icon-down-dir"></span></th>
                    <th>Market <span className="icon-dir icon-down-dir"></span></th>
                    <th>Price <span className="icon-dir icon-down-dir"></span></th>
                    <th>Units Filed <span className="icon-dir icon-down-dir"></span></th>
                    <th>Units Total <span className="icon-dir icon-down-dir"></span></th>
                    <th><span className="hide-mobile">Estimated</span><span className="show-mobile">Est.</span> Total <span className="icon-dir icon-down-dir"></span></th>
                    <th className="hide-mobile"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>
                  <tr className='sell'>
                    <td>
                      <span className="round"></span>
                      Sell
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.15646245</td>
                    <td>0.00</td>
                    <td>3200.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>
                  <tr className='sell'>
                    <td>
                      <span className="round"></span>
                      Sell
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.15646245</td>
                    <td>0.00</td>
                    <td>3200.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>
                  <tr className='sell'>
                    <td>
                      <span className="round"></span>
                      Sell
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.15646245</td>
                    <td>0.00</td>
                    <td>3200.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>
                  <tr className='sell'>
                    <td>
                      <span className="round"></span>
                      Sell
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.15646245</td>
                    <td>0.00</td>
                    <td>3200.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>
                  <tr className='sell'>
                    <td>
                      <span className="round"></span>
                      Sell
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.15646245</td>
                    <td>0.00</td>
                    <td>3200.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>
                  <tr className='sell'>
                    <td>
                      <span className="round"></span>
                      Sell
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.15646245</td>
                    <td>0.00</td>
                    <td>3200.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>
                  <tr className='sell'>
                    <td>
                      <span className="round"></span>
                      Sell
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.15646245</td>
                    <td>0.00</td>
                    <td>3200.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>
                  <tr className='sell'>
                    <td>
                      <span className="round"></span>
                      Sell
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.15646245</td>
                    <td>0.00</td>
                    <td>3200.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>
                  <tr className='sell'>
                    <td>
                      <span className="round"></span>
                      Sell
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.15646245</td>
                    <td>0.00</td>
                    <td>3200.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td className="ellipsis-cell">12.0249235</td>
                    <td className="hide-mobile"><span className="remove"></span></td>
                  </tr>



                </tbody>
              </table>
            </div>
          </div>
          <div className="orders-tab orders-completed">
            <div className="orders-table-wrap js-table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Type <span className="icon-dir icon-down-dir"></span>
                    </th>
                    <th>Opened <span className="hide-mobile">Date</span>
                      <span className="icon-dir icon-down-dir"></span>
                    </th>
                    <th>Market <span className="icon-dir icon-down-dir"></span>
                    </th>
                    <th>Price <span className="icon-dir icon-down-dir"></span>
                    </th>
                    <th>Units Total <span className="icon-dir icon-down-dir"></span>
                    </th>
                    <th>Units Filed
                      <span className="icon-dir icon-down-dir"></span></th>
                    <th><span className="hide-mobile">Estimated</span><span className="show-mobile">Est.</span> Total <span className="icon-dir icon-down-dir"></span></th>

                  </tr>
                </thead>
                <tbody>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='sell'>
                    <td>
                      <span className="round"></span>
                      Sell
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='sell'>
                    <td>
                      <span className="round"></span>
                      Sell
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='sell'>
                    <td>
                      <span className="round"></span>
                      Sell
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='sell'>
                    <td>
                      <span className="round"></span>
                      Sell
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='sell'>
                    <td>
                      <span className="round"></span>
                      Sell
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='sell'>
                    <td>
                      <span className="round"></span>
                      Sell
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='sell'>
                    <td>
                      <span className="round"></span>
                      Sell
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='sell'>
                    <td>
                      <span className="round"></span>
                      Sell
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='sell'>
                    <td>
                      <span className="round"></span>
                      Sell
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='sell'>
                    <td>
                      <span className="round"></span>
                      Sell
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='sell'>
                    <td>
                      <span className="round"></span>
                      Sell
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='sell'>
                    <td>
                      <span className="round"></span>
                      Sell
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='sell'>
                    <td>
                      <span className="round"></span>
                      Sell
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='buy'>
                    <td>
                      <span className="round"></span>
                      Buy
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>
                  <tr className='sell'>
                    <td>
                      <span className="round"></span>
                      Sell
                    </td>
                    <td>11.21.2017</td>
                    <td>ETH/BTC</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                    <td className="ellipsis-cell">12.0249235</td>
                  </tr>



                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OrdersTable;

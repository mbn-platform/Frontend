import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import HeaderStatus from '../terminal/HeaderStatus';

class Orders extends React.Component {

  render() {
    return (
      <Container fluid className="orders">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <HeaderStatus />
            <div className="orders-main" dangerouslySetInnerHTML={{__html: html}} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Orders;

const html = `
<div class="orders-main__top">
  <div class="row  align-items-center dropdowns">
    <div class="orders-main__title"> Orders</div>

    <div class="dropdown-link-wrap">
      <a href="#" class="dropdown-link">BITTREX <span class="arrow_down"></span></a>
      <div class="dropdown exchange">
        <div class="dropdown__name">
          <span>BITTREX</span>
          <span class="arrow_down"></span>
        </div>
        <div class="exchange__switch">Poloniex</div>
        <div class="exchange__switch">Bitfinex</div>
        <div class="exchange__switch active">BITTREX</div>
      </div>
    </div>
    <div class="dropdown-link-wrap ml-auto">
      <a href="#" class="dropdown-link">API KEY: rsogojrpej593yh3jh059hu <span class="arrow_down"></span></a>
      <div class="dropdown keys">
        <div class="dropdown__name">
          <span>API KEY</span>
          <span class="arrow_down"></span>
        </div>
        <div class="key">234hgerhg7y924rt318r1t2</div>
        <div class="key active">rsogojrpej593yh3jh059hu</div>
        <div class="key">dfpjg934t0g9g3j3pvd;kg3</div>
      </div>
    </div>
  </div>
</div>
<div class="orders-main__block">
  <div class="block__top">
    <div class="block__top-switch-wrap">
      <a href='#' class="block__top-switch orders-open active">
        Open Orders
      </a>
      <a href='#' class="block__top-switch orders-completed">
        Completed orders
      </a>
    </div>
  </div>
  <div class="orders-tabs">
    <div class="orders-tab orders-open active">
      <div class="orders-table-wrap">
        <table class="table">
                <thead>
                  <tr>
                    <th>Type <span class="icon-dir icon-down-dir"></span></th>
                    <th>Opened Date <span class="icon-dir icon-down-dir"></span></th>
                    <th>Price <span class="icon-dir icon-down-dir"></span></th>
                    <th>Units Filed <span class="icon-dir icon-down-dir"></span></th>
                    <th>Units Total <span class="icon-dir icon-down-dir"></span></th>
                    <th>Estimated Total <span class="icon-dir icon-down-dir"></span></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>
                  <tr class='sell'>
                    <td>
                      <span class="round"></span>
                      Sell(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.15646245</td>
                    <td>0.00</td>
                    <td>3200.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>
                  <tr class='sell'>
                    <td>
                      <span class="round"></span>
                      Sell(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.15646245</td>
                    <td>0.00</td>
                    <td>3200.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>
                  <tr class='sell'>
                    <td>
                      <span class="round"></span>
                      Sell(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.15646245</td>
                    <td>0.00</td>
                    <td>3200.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>
                  <tr class='sell'>
                    <td>
                      <span class="round"></span>
                      Sell(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.15646245</td>
                    <td>0.00</td>
                    <td>3200.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>
                  <tr class='sell'>
                    <td>
                      <span class="round"></span>
                      Sell(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.15646245</td>
                    <td>0.00</td>
                    <td>3200.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>
                  <tr class='sell'>
                    <td>
                      <span class="round"></span>
                      Sell(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.15646245</td>
                    <td>0.00</td>
                    <td>3200.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>
                  <tr class='sell'>
                    <td>
                      <span class="round"></span>
                      Sell(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.15646245</td>
                    <td>0.00</td>
                    <td>3200.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>
                  <tr class='sell'>
                    <td>
                      <span class="round"></span>
                      Sell(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.15646245</td>
                    <td>0.00</td>
                    <td>3200.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>
                  <tr class='sell'>
                    <td>
                      <span class="round"></span>
                      Sell(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.15646245</td>
                    <td>0.00</td>
                    <td>3200.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>0.00</td>
                    <td>12.0249235</td>
                    <td>12.0249235</td>
                    <td><span class="remove"></span></td>
                  </tr>



                </tbody>
              </table>
      </div>
    </div>
    <div class="orders-tab orders-completed">
      <div class="orders-table-wrap">
        <table class="table">
                <thead>
                  <tr>
                    <th>Type <span class="icon-dir icon-down-dir"></span>
                    </th>
                    <th>Opened Date
                      <span class="icon-dir icon-down-dir"></span>
                    </th>
                    <th>Price <span class="icon-dir icon-down-dir"></span>
                    </th>
                    <th>Units Total <span class="icon-dir icon-down-dir"></span>
                    </th>
                    <th>Units Filed
                    <span class="icon-dir icon-down-dir"></span></th>

                  </tr>
                </thead>
                <tbody>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='sell'>
                    <td>
                      <span class="round"></span>
                      Sell(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='sell'>
                    <td>
                      <span class="round"></span>
                      Sell(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='sell'>
                    <td>
                      <span class="round"></span>
                      Sell(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='sell'>
                    <td>
                      <span class="round"></span>
                      Sell(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='sell'>
                    <td>
                      <span class="round"></span>
                      Sell(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='sell'>
                    <td>
                      <span class="round"></span>
                      Sell(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='sell'>
                    <td>
                      <span class="round"></span>
                      Sell(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='sell'>
                    <td>
                      <span class="round"></span>
                      Sell(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='sell'>
                    <td>
                      <span class="round"></span>
                      Sell(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='sell'>
                    <td>
                      <span class="round"></span>
                      Sell(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='sell'>
                    <td>
                      <span class="round"></span>
                      Sell(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='sell'>
                    <td>
                      <span class="round"></span>
                      Sell(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='sell'>
                    <td>
                      <span class="round"></span>
                      Sell(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='buy'>
                    <td>
                      <span class="round"></span>
                      Buy(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.156</td>
                    <td>12.0249235</td>
                    <td>0.00</td>
                  </tr>
                  <tr class='sell'>
                    <td>
                      <span class="round"></span>
                      Sell(LO)
                    </td>
                    <td>11.21.2017</td>
                    <td>0.15646245</td>
                    <td>3200.0249235</td>
                    <td>0.00</td>
                  </tr>




                </tbody>
              </table>
      </div>
    </div>
  </div>
`;

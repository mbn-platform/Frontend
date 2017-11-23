import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import HeaderStatus from '../terminal/HeaderStatus';

class History extends React.Component {

  render() {
    return (
      <Container fluid className="history">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <HeaderStatus />
            <div className="history-main" dangerouslySetInnerHTML={{__html: html}} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default History;

const html = `
<div class="history-main__top">
  <div class="row  align-items-center">
    <div class="history-main__title"> History</div>
  </div>
  <div class="row dropdowns pt-2">
    <div class="dropdown-link-wrap mr-3">
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
  </div>
</div>
<div class="history-main__block">
  <div class="table-wrap js-table-wrapper">
    <table class="table">
      <thead>
        <tr>
          <th>Market <span class="icon-dir icon-down-dir"></span></th>
          <th>Type <span class="icon-dir icon-down-dir"></span></th>
          <th>Price<span class="hide-mobile">/Share</span> <span class="icon-dir icon-down-dir"></span></th>
          <th>Amount <span class="icon-dir icon-down-dir"></span></th>
          <th>Total <span class="icon-dir icon-down-dir"></span></th>
          <th><span class="hide-mobile">Transacton</span> Date <span class="icon-dir icon-down-dir"></span></th>
        </tr>
      </thead>
      <tbody>
        <tr class='buy'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Buy <span class="hide-mobile">(LO)</span></td>
          <td>0.000112349</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>0.000112349</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>—</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='buy'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Buy <span class="hide-mobile">(LO)</span></td>
          <td>0.000112349</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>0.000112349</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>—</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='buy'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Buy <span class="hide-mobile">(LO)</span></td>
          <td>0.000112349</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>0.000112349</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>—</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>—</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>—</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>—</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>—</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>—</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>—</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>—</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>—</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>—</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>—</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>—</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>—</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>—</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>—</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>—</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>—</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>—</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>—</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>—</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>—</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
        <tr class='sell'>
          <td>ETH/BTC</td>
          <td><span class="round"></span> Sell <span class="hide-mobile">(LO)</span></td>

          <td>—</td>
          <td>21433.57356766</td>
          <td>12.0249235 BTC</td>
          <td>11.21.2017 13:48:23</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
<div class="table-rewind hide-desktop">
  <button class="table-rewind__button table-rewind__button--prev"><span class="arrow"></span></button>
  <button class="table-rewind__button table-rewind__button--next"><span class="arrow"></span></button>
</div>
`

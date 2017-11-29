import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import HeaderStatus from '../terminal/HeaderStatus';

class Ratings extends React.Component {

  render() {
    return (
      <Container fluid className="ratings">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <div className="ratings-main" dangerouslySetInnerHTML={{__html: html}} />
          </Col>
        </Row>
      </Container>
    );
  }
  componentDidMount() {
    window.customize();
  }

  componentWillUnmount() {
    window.uncustomize();
  }
}

export default Ratings;

const html = `
<div class="ratings-main__title"> RATINGS</div>
<div class="ratings-main__block">
  <div class="block__top">
    <div class="block__top-switch-wrap">
      <a href='#' class="block__top-switch ratings-traders active">
        Traders
      </a>
      <a href='#' class="block__top-switch ratings-investors">
        Investors
      </a>
    </div>
  </div>
  <div class="ratings-tabs">
    <div class="ratings-tab ratings-traders active">
      <div class="ratings-table-wrap js-table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th class="fav">
                <span class="star"></span>
              </th>
              <th class="name">
                <span>Name</span><span class="icon-dir icon-down-dir"></span>
              </th>
              <th class="rank">
                <span>Rank</span><span class="icon-dir icon-down-dir"></span>
              </th>
              <th>
                <span>ROI,&nbsp;%</span><span class="icon-dir icon-down-dir"></span>
              </th>
              <th>
                <span>Since opened</span><span class="icon-dir icon-down-dir"></span>
              </th>
              <th>
                <span>Min contract<br>amount</span><span class="icon-dir icon-down-dir"></span>
              </th>
              <th>
                <span>Duration of the contract</span><span class="icon-dir icon-down-dir"></span>
              </th>
              <th>
                <span>Fee, %</span><span class="icon-dir icon-down-dir"></span>
              </th>
              <th>
                <span>Money in management</span><span class="icon-dir icon-down-dir"></span>
              </th>
              <th>
                <span>Max&nbsp;loss,&nbsp;%</span><span class="icon-dir icon-down-dir"></span>
              </th>
            </tr>

            <tr>
              <th></th>
              <th>
                <div>
                  <input type="text" class="input_search" placeholder="Search" />
                </div>
              </th>
              <th>
                <div class="help" data-toggle="ratings-help-popover" data-placement="bottom" data-total="The total amount of contracts" data-success="The amount of successfully finished contracts">?</div>
              </th>
              <th>
                <div class="all-time">
                  All time <span class="arrow_down"></span>
                </div>
                <div class="all-time_dropdown">
                  <a href="#" class="all-time_dropdown-link">1 week</a>
                  <a href="#" class="all-time_dropdown-link">1 month</a>
                  <a href="#" class="all-time_dropdown-link">3 months</a>
                  <a href="#" class="all-time_dropdown-link">6 months</a>
                  <a href="#" class="all-time_dropdown-link">12 months</a>
                  <a href="#" class="all-time_dropdown-link active">All time</a>
                </div>
              </th>
              <th></th>
              <th>
                <div class="buttons-wrap">
                  <button class="btn btn-active">BTC</button>
                  <button class="btn">USD</button>
                </div>
              </th>
              <th></th>
              <th></th>
              <th>
                <div class="buttons-wrap">
                  <button class="btn btn-active">BTC</button>
                  <button class="btn">USD</button>
                </div>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span class="star"></span>
              </td>
              <td>
                <div class="nickname">@COINTRADERGUY</div>
              </td>
              <td>
                <span class="rank">1</span>
                <span class="total">7</span>
                <span class="total">/</span>
                <span class="success">8</span>
              </td>
              <td>
                <span>-34.7</span>
                <span class="graph"></span>
              </td>
              <td>
                1 yr 2 mth
              </td>
              <td>
                10
              </td>
              <td>
                30 days
              </td>
              <td>
                15
              </td>
              <td>
                10
              </td>
              <td>
                15
              </td>
            </tr>
            <tr>
              <td>
                <span class="star"></span>
              </td>
              <td>
                <div class="nickname">@COINTRADERGUY</div>
              </td>
              <td>
                <span class="rank">1</span>
                <span class="total">7</span>
                <span class="total">/</span>
                <span class="success">8</span>
              </td>
              <td>
                <span>-34.7</span>
                <span class="graph"></span>
              </td>
              <td>
                1 yr 2 mth
              </td>
              <td>
                10
              </td>
              <td>
                30 days
              </td>
              <td>
                15
              </td>
              <td>
                10
              </td>
              <td>
                15
              </td>
            </tr>
            <tr>
              <td>
                <span class="star"></span>
              </td>
              <td>
                <div class="nickname">@COINTRADERGUY</div>
              </td>
              <td>
                <span class="rank">1</span>
                <span class="total">7</span>
                <span class="total">/</span>
                <span class="success">8</span>
              </td>
              <td>
                <span>-34.7</span>
                <span class="graph"></span>
              </td>
              <td>
                1 yr 2 mth
              </td>
              <td>
                10
              </td>
              <td>
                30 days
              </td>
              <td>
                15
              </td>
              <td>
                10
              </td>
              <td>
                15
              </td>
            </tr>
            <tr>
              <td>
                <span class="star"></span>
              </td>
              <td>
                <div class="nickname">@COINTRADERGUY</div>
              </td>
              <td>
                <span class="rank">1</span>
                <span class="total">7</span>
                <span class="total">/</span>
                <span class="success">8</span>
              </td>
              <td>
                <span>-34.7</span>
                <span class="graph"></span>
              </td>
              <td>
                1 yr 2 mth
              </td>
              <td>
                10
              </td>
              <td>
                30 days
              </td>
              <td>
                15
              </td>
              <td>
                10
              </td>
              <td>
                15
              </td>
            </tr>
            <tr>
              <td>
                <span class="star"></span>
              </td>
              <td>
                <div class="nickname">@COINTRADERGUY</div>
              </td>
              <td>
                <span class="rank">1</span>
                <span class="total">7</span>
                <span class="total">/</span>
                <span class="success">8</span>
              </td>
              <td>
                <span>-34.7</span>
                <span class="graph"></span>
              </td>
              <td>
                1 yr 2 mth
              </td>
              <td>
                10
              </td>
              <td>
                30 days
              </td>
              <td>
                15
              </td>
              <td>
                10
              </td>
              <td>
                15
              </td>
            </tr>
            <tr>
              <td>
                <span class="star"></span>
              </td>
              <td>
                <div class="nickname">@COINTRADERGUY</div>
              </td>
              <td>
                <span class="rank">1</span>
                <span class="total">7</span>
                <span class="total">/</span>
                <span class="success">8</span>
              </td>
              <td>
                <span>-34.7</span>
                <span class="graph"></span>
              </td>
              <td>
                1 yr 2 mth
              </td>
              <td>
                10
              </td>
              <td>
                30 days
              </td>
              <td>
                15
              </td>
              <td>
                10
              </td>
              <td>
                15
              </td>
            </tr>
            <tr>
              <td>
                <span class="star"></span>
              </td>
              <td>
                <div class="nickname">@COINTRADERGUY</div>
              </td>
              <td>
                <span class="rank">1</span>
                <span class="total">7</span>
                <span class="total">/</span>
                <span class="success">8</span>
              </td>
              <td>
                <span>-34.7</span>
                <span class="graph"></span>
              </td>
              <td>
                1 yr 2 mth
              </td>
              <td>
                10
              </td>
              <td>
                30 days
              </td>
              <td>
                15
              </td>
              <td>
                10
              </td>
              <td>
                15
              </td>
            </tr>
            <tr>
              <td>
                <span class="star"></span>
              </td>
              <td>
                <div class="nickname">@COINTRADERGUY</div>
              </td>
              <td>
                <span class="rank">1</span>
                <span class="total">7</span>
                <span class="total">/</span>
                <span class="success">8</span>
              </td>
              <td>
                <span>-34.7</span>
                <span class="graph"></span>
              </td>
              <td>
                1 yr 2 mth
              </td>
              <td>
                10
              </td>
              <td>
                30 days
              </td>
              <td>
                15
              </td>
              <td>
                10
              </td>
              <td>
                15
              </td>
            </tr>
            <tr>
              <td>
                <span class="star"></span>
              </td>
              <td>
                <div class="nickname">@COINTRADERGUY</div>
              </td>
              <td>
                <span class="rank">1</span>
                <span class="total">7</span>
                <span class="total">/</span>
                <span class="success">8</span>
              </td>
              <td>
                <span>-34.7</span>
                <span class="graph"></span>
              </td>
              <td>
                1 yr 2 mth
              </td>
              <td>
                10
              </td>
              <td>
                30 days
              </td>
              <td>
                15
              </td>
              <td>
                10
              </td>
              <td>
                15
              </td>
            </tr>
            <tr>
              <td>
                <span class="star"></span>
              </td>
              <td>
                <div class="nickname">@COINTRADERGUY</div>
              </td>
              <td>
                <span class="rank">1</span>
                <span class="total">7</span>
                <span class="total">/</span>
                <span class="success">8</span>
              </td>
              <td>
                <span>-34.7</span>
                <span class="graph"></span>
              </td>
              <td>
                1 yr 2 mth
              </td>
              <td>
                10
              </td>
              <td>
                30 days
              </td>
              <td>
                15
              </td>
              <td>
                10
              </td>
              <td>
                15
              </td>
            </tr>
            <tr>
              <td>
                <span class="star"></span>
              </td>
              <td>
                <div class="nickname">@COINTRADERGUY</div>
              </td>
              <td>
                <span class="rank">1</span>
                <span class="total">7</span>
                <span class="total">/</span>
                <span class="success">8</span>
              </td>
              <td>
                <span>-34.7</span>
                <span class="graph"></span>
              </td>
              <td>
                1 yr 2 mth
              </td>
              <td>
                10
              </td>
              <td>
                30 days
              </td>
              <td>
                15
              </td>
              <td>
                10
              </td>
              <td>
                15
              </td>
            </tr>
            <tr>
              <td>
                <span class="star"></span>
              </td>
              <td>
                <div class="nickname">@COINTRADERGUY</div>
              </td>
              <td>
                <span class="rank">1</span>
                <span class="total">7</span>
                <span class="total">/</span>
                <span class="success">8</span>
              </td>
              <td>
                <span>-34.7</span>
                <span class="graph"></span>
              </td>
              <td>
                1 yr 2 mth
              </td>
              <td>
                10
              </td>
              <td>
                30 days
              </td>
              <td>
                15
              </td>
              <td>
                10
              </td>
              <td>
                15
              </td>
            </tr>

            <tr class='fav'>
              <td>
                <span class="star"></span>
              </td>
              <td>
                <div class="nickname">@COINTRADERGUY</div>
              </td>
              <td>
                <span class="rank">1</span>
                <span class="total">7</span>
                <span class="total">/</span>
                <span class="success">8</span>
              </td>
              <td>
                <span>-34.7</span>
                <span class="graph"></span>
              </td>
              <td>
                1 yr 2 mth
              </td>
              <td>
                10
              </td>
              <td>
                30 days
              </td>
              <td>
                15
              </td>
              <td>
                10
              </td>
              <td>
                15
              </td>
            </tr>
            <tr>
              <td>
                <span class="star"></span>
              </td>
              <td>
                <div class="nickname">@COINTRADERGUY</div>
              </td>
              <td>
                <span class="rank">1</span>
                <span class="total">7</span>
                <span class="total">/</span>
                <span class="success">8</span>
              </td>
              <td>
                <span>-34.7</span>
                <span class="graph"></span>
              </td>
              <td>
                1 yr 2 mth
              </td>
              <td>
                10
              </td>
              <td>
                30 days
              </td>
              <td>
                15
              </td>
              <td>
                10
              </td>
              <td>
                15
              </td>
            </tr>
            <tr class='fav'>
              <td>
                <span class="star"></span>
              </td>
              <td>
                <div class="nickname">@COINTRADERGUY</div>
              </td>
              <td>
                <span class="rank">1</span>
                <span class="total">7</span>
                <span class="total">/</span>
                <span class="success">8</span>
              </td>
              <td>
                <span>-34.7</span>
                <span class="graph"></span>
              </td>
              <td>
                1 yr 2 mth
              </td>
              <td>
                10
              </td>
              <td>
                30 days
              </td>
              <td>
                15
              </td>
              <td>
                10
              </td>
              <td>
                15
              </td>
            </tr>
            <tr>
              <td>
                <span class="star"></span>
              </td>
              <td>
                <div class="nickname">@COINTRADERGUY</div>
              </td>
              <td>
                <span class="rank">1</span>
                <span class="total">7</span>
                <span class="total">/</span>
                <span class="success">8</span>
              </td>
              <td>
                <span>-34.7</span>
                <span class="graph"></span>
              </td>
              <td>
                1 yr 2 mth
              </td>
              <td>
                10
              </td>
              <td>
                30 days
              </td>
              <td>
                15
              </td>
              <td>
                10
              </td>
              <td>
                15
              </td>
            </tr>
            <tr>
              <td>
                <span class="star"></span>
              </td>
              <td>
                <div class="nickname">@COINTRADERGUY</div>
              </td>
              <td>
                <span class="rank">1</span>
                <span class="total">7</span>
                <span class="total">/</span>
                <span class="success">8</span>
              </td>
              <td>
                <span>-34.7</span>
                <span class="graph"></span>
              </td>
              <td>
                1 yr 2 mth
              </td>
              <td>
                10
              </td>
              <td>
                30 days
              </td>
              <td>
                15
              </td>
              <td>
                10
              </td>
              <td>
                15
              </td>
            </tr>
            <tr>
              <td>
                <span class="star"></span>
              </td>
              <td>
                <div class="nickname">@COINTRADERGUY</div>
              </td>
              <td>
                <span class="rank">1</span>
                <span class="total">7</span>
                <span class="total">/</span>
                <span class="success">8</span>
              </td>
              <td>
                <span>-34.7</span>
                <span class="graph"></span>
              </td>
              <td>
                1 yr 2 mth
              </td>
              <td>
                10
              </td>
              <td>
                30 days
              </td>
              <td>
                15
              </td>
              <td>
                10
              </td>
              <td>
                15
              </td>
            </tr>

          </tbody>
        </table>
      </div>
      <div class="table-rewind table-rewind--dark hide-desktop">
        <button class="table-rewind__button table-rewind__button--prev"><span class="arrow"></span></button>
        <button class="table-rewind__button table-rewind__button--next"><span class="arrow"></span></button>
      </div>
      <div class="ratings__best">
        <ul class="ratings__best-list">
          <li class="ratings__best-item best_alltime">
            <div class="ratings__best-top">
                <div class="time">All the time best trader</div>
                <div class="nickname">@COINTRADERGUY</div>
              </div>
              <div class="ratings__best-bottom">
                <div class="value">28,912</div>
                <span class="text">ROI, %</span>
              </div>
          </li>
          <li class="dash"></li>
          <li class="ratings__best-item best_year">
            <div class="ratings__best-top">
                <div class="time">Best trader of <span class="year">2017</span></div>
                <div class="nickname">@CRYPTOGOD</div>
            </div>
            <div class="ratings__best-bottom">
              <div class="value">17,397</div>
              <span class="text">ROI, %</span>
            </div>

          </li>
          <li class="dash"></li>
          <li class="ratings__best-item best_quart">
            <div class="ratings__best-top">
              <div class="time">Best trader of quart</div>
              <div class="nickname">@LOOMDART</div>
            </div>
            <div class="ratings__best-bottom">
              <div class="value">9,254</div>
              <span class="text">ROI, %</span>
            </div>

          </li>
          <li class="dash"></li>
          <li class="ratings__best-item best_month">
            <div class="ratings__best-top">
              <div class="time">
                Best trader of
                <span class="month">November</span>
              </div>
              <div class="nickname">@COINTRADERGUY</div>
            </div>
            <div class="ratings__best-bottom">
              <div class="value">31,568</div>
              <span class="text">ROI, %</span>
            </div>

          </li>
        </ul>
      </div>
    </div>
    <div class="ratings-tab ratings-investors">
      <div class="ratings-table-wrap js-table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th class='fav'>
                <span class="star"></span>
              </th>
              <th class='name'>
                <span>Name</span><span class="icon-dir icon-down-dir"></span>
              </th>
              <th class='rank active'>
                <span>Rank</span><span class="icon-dir icon-down-dir"></span>
              </th>
              <th>
                <span>ROI,&nbsp;%</span><span class="icon-dir icon-down-dir"></span>
              </th>
              <th>
                <span>Since opened</span><span class="icon-dir icon-down-dir"></span>
              </th>
              <th>
                <span>Paid excess<br>profit</span><span class="icon-dir icon-down-dir"></span>
              </th>
              <th>
                <span>Amount of paid invoices</span><span class="icon-dir icon-down-dir"></span>
              </th>
            </tr>

            <tr>
              <th></th>
              <th>
                <div>
                  <input type="text" class="input_search" placeholder="Search" />
                </div>
              </th>
              <th>
                <div class="help" data-toggle="ratings-help-popover" data-placement="bottom" data-total="The total amount of contracts" data-success="The amount of successfully finished contracts">?</div>
              </th>
              <th>
                <div  class="all-time">
                  All time
                  <span class="arrow_down"></span>
                  <div class="all-time_dropdown">
                    <a href="#" class="all-time_dropdown-link">1 week</a>
                    <a href="#" class="all-time_dropdown-link">1 month</a>
                    <a href="#" class="all-time_dropdown-link">3 months</a>
                    <a href="#" class="all-time_dropdown-link">6 months</a>
                    <a href="#" class="all-time_dropdown-link">12 months</a>
                    <a href="#" class="all-time_dropdown-link active">All time</a>
                  </div>
                </div>
              </th>
              <th></th>
              <th>
                <div class="buttons-wrap">
                  <button class="btn btn-active">BTC</button>
                  <button class="btn">USD</button>
                </div>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span class="star"></span>
              </td>
              <td>
                <div class="nickname">@COINTRADERGUY</div>
              </td>
              <td>
                <span class="rank">1</span>
                <span class="total">7</span>
                <span class="total">/</span>
                <span class="success">8</span>
              </td>
              <td>
                <span>-34.7</span>
                <span class="graph"></span>
              </td>
              <td>
                1 yr 2 mth
              </td>
              <td>
                10
              </td>
              <td>
                15
              </td>
            </tr>
            <tr>
              <td>
                <span class="star"></span>
              </td>
              <td>
                <div class="nickname">@COINTRADERGUY</div>
              </td>
              <td>
                <span class="rank">1</span>
                <span class="total">7</span>
                <span class="total">/</span>
                <span class="success">8</span>
              </td>
              <td>
                <span>-34.7</span>
                <span class="graph"></span>
              </td>
              <td>
                1 yr 2 mth
              </td>
              <td>
                10
              </td>
              <td>
                15
              </td>
            </tr>
            <tr>
              <td>
                <span class="star"></span>
              </td>
              <td>
                <div class="nickname">@COINTRADERGUY</div>
              </td>
              <td>
                <span class="rank">1</span>
                <span class="total">7</span>
                <span class="total">/</span>
                <span class="success">8</span>
              </td>
              <td>
                <span>-34.7</span>
                <span class="graph"></span>
              </td>
              <td>
                1 yr 2 mth
              </td>
              <td>
                10
              </td>
              <td>
                15
              </td>
            </tr>
            <tr>
              <td>
                <span class="star"></span>
              </td>
              <td>
                <div class="nickname">@COINTRADERGUY</div>
              </td>
              <td>
                <span class="rank">1</span>
                <span class="total">7</span>
                <span class="total">/</span>
                <span class="success">8</span>
              </td>
              <td>
                <span>-34.7</span>
                <span class="graph"></span>
              </td>
              <td>
                1 yr 2 mth
              </td>
              <td>
                10
              </td>
              <td>
                15
              </td>
            </tr>
            <tr>
              <td>
                <span class="star"></span>
              </td>
              <td>
                <div class="nickname">@COINTRADERGUY</div>
              </td>
              <td>
                <span class="rank">1</span>
                <span class="total">7</span>
                <span class="total">/</span>
                <span class="success">8</span>
              </td>
              <td>
                <span>-34.7</span>
                <span class="graph"></span>
              </td>
              <td>
                1 yr 2 mth
              </td>
              <td>
                10
              </td>
              <td>
                15
              </td>
            </tr>
            <tr>
              <td>
                <span class="star"></span>
              </td>
              <td>
                <div class="nickname">@COINTRADERGUY</div>
              </td>
              <td>
                <span class="rank">1</span>
                <span class="total">7</span>
                <span class="total">/</span>
                <span class="success">8</span>
              </td>
              <td>
                <span>-34.7</span>
                <span class="graph"></span>
              </td>
              <td>
                1 yr 2 mth
              </td>
              <td>
                10
              </td>
              <td>
                15
              </td>
            </tr>

          </tbody>
        </table>
      </div>
      <div class="table-rewind table-rewind--dark hide-desktop">
        <button class="table-rewind__button table-rewind__button--prev"><span class="arrow"></span></button>
        <button class="table-rewind__button table-rewind__button--next"><span class="arrow"></span></button>
      </div>
      <div class="ratings__best">
        <ul class="ratings__best-list">
          <li class="ratings__best-item best_alltime">
            <div class="ratings__best-top">
                <div class="time">All the time best investor</div>
                <div class="nickname">@COINTRADERGUY</div>
              </div>
              <div class="ratings__best-bottom">
                <div class="value">28,912</div>
                <span class="text">ROI, %</span>
              </div>
          </li>
          <li class="dash"></li>
          <li class="ratings__best-item best_year">
            <div class="ratings__best-top">
                <div class="time">Best investor of <span class="year">2017</span></div>
                <div class="nickname">@CRYPTOGOD</div>
            </div>
            <div class="ratings__best-bottom">
              <div class="value">17,397</div>
              <span class="text">ROI, %</span>
            </div>

          </li>
          <li class="dash"></li>
          <li class="ratings__best-item best_quart">
            <div class="ratings__best-top">
              <div class="time">Best investor of quart</div>
              <div class="nickname">@LOOMDART</div>
            </div>
            <div class="ratings__best-bottom">
              <div class="value">9,254</div>
              <span class="text">ROI, %</span>
            </div>

          </li>
          <li class="dash"></li>
          <li class="ratings__best-item best_month">
            <div class="ratings__best-top">
              <div class="time">
                Best investor of
                <span class="month">November</span>
              </div>
              <div class="nickname">@COINTRADERGUY</div>
            </div>
            <div class="ratings__best-bottom">
              <div class="value">31,568</div>
              <span class="text">ROI, %</span>
            </div>

          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
`;

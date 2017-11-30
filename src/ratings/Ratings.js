import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import BestTraders from './BestTraders';
import BestInvestors from './BestInvestors';

class Ratings extends React.Component {

  render() {
    return (
      <Container fluid className="ratings">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <div className="ratings-main">
              <div className="ratings-main__title"> RATINGS</div>
              <div className="ratings-main__block">
                <div className="block__top">
                  <div className="block__top-switch-wrap">
                    <a href='#' className="block__top-switch ratings-traders active">
                      Traders
                    </a>
                    <a href='#' className="block__top-switch ratings-investors">
                      Investors
                    </a>
                  </div>
                </div>
                <div className="ratings-tabs">
                  <div className="ratings-tab ratings-traders active">
                    <div className="ratings-table-wrap js-table-wrapper">
                      <table className="table">
                        <thead>
                          <tr>
                            <th className="fav">
                              <span className="star"></span>
                            </th>
                            <th className="name">
                              <span>Name</span><span className="icon-dir icon-down-dir"></span>
                            </th>
                            <th className="rank">
                              <span>Rank</span><span className="icon-dir icon-down-dir"></span>
                            </th>
                            <th>
                              <span>ROI,&nbsp;%</span><span className="icon-dir icon-down-dir"></span>
                            </th>
                            <th>
                              <span>Since opened</span><span className="icon-dir icon-down-dir"></span>
                            </th>
                            <th>
                              <span>Min contract<br/>amount</span><span className="icon-dir icon-down-dir"></span>
                            </th>
                            <th>
                              <span>Duration of the contract</span><span className="icon-dir icon-down-dir"></span>
                            </th>
                            <th>
                              <span>Fee, %</span><span className="icon-dir icon-down-dir"></span>
                            </th>
                            <th>
                              <span>Money in management</span><span className="icon-dir icon-down-dir"></span>
                            </th>
                            <th>
                              <span>Max&nbsp;loss,&nbsp;%</span><span className="icon-dir icon-down-dir"></span>
                            </th>
                          </tr>

                          <tr>
                            <th></th>
                            <th>
                              <div>
                                <input type="text" className="input_search" placeholder="Search" />
                              </div>
                            </th>
                            <th>
                              <div className="help" data-toggle="ratings-help-popover" data-placement="bottom" data-total="The total amount of contracts" data-success="The amount of successfully finished contracts">?</div>
                            </th>
                            <th>
                              <div className="all-time">
                                All time <span className="arrow_down"></span>
                              </div>
                              <div className="all-time_dropdown">
                                <a href="#" className="all-time_dropdown-link">1 week</a>
                                <a href="#" className="all-time_dropdown-link">1 month</a>
                                <a href="#" className="all-time_dropdown-link">3 months</a>
                                <a href="#" className="all-time_dropdown-link">6 months</a>
                                <a href="#" className="all-time_dropdown-link">12 months</a>
                                <a href="#" className="all-time_dropdown-link active">All time</a>
                              </div>
                            </th>
                            <th></th>
                            <th>
                              <div className="buttons-wrap">
                                <button className="btn btn-active">BTC</button>
                                <button className="btn">USD</button>
                              </div>
                            </th>
                            <th></th>
                            <th></th>
                            <th>
                              <div className="buttons-wrap">
                                <button className="btn btn-active">BTC</button>
                                <button className="btn">USD</button>
                              </div>
                            </th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {fakeDataTraders().map(rating => <TraderRatingRow {...rating} />)}
                        </tbody>
                      </table>
                    </div>
                    <div className="table-rewind table-rewind--dark hide-desktop">
                      <button className="table-rewind__button table-rewind__button--prev"><span className="arrow"></span></button>
                      <button className="table-rewind__button table-rewind__button--next"><span className="arrow"></span></button>
                    </div>
                    <BestTraders />
                  </div>
                  <div className="ratings-tab ratings-investors">
                    <div className="ratings-table-wrap js-table-wrapper">
                      <table className="table">
                        <thead>
                          <tr>
                            <th className='fav'>
                              <span className="star"></span>
                            </th>
                            <th className='name'>
                              <span>Name</span><span className="icon-dir icon-down-dir"></span>
                            </th>
                            <th className='rank active'>
                              <span>Rank</span><span className="icon-dir icon-down-dir"></span>
                            </th>
                            <th>
                              <span>ROI,&nbsp;%</span><span className="icon-dir icon-down-dir"></span>
                            </th>
                            <th>
                              <span>Since opened</span><span className="icon-dir icon-down-dir"></span>
                            </th>
                            <th>
                              <span>Paid excess<br/>profit</span><span className="icon-dir icon-down-dir"></span>
                            </th>
                            <th>
                              <span>Amount of paid invoices</span><span className="icon-dir icon-down-dir"></span>
                            </th>
                          </tr>

                          <tr>
                            <th></th>
                            <th>
                              <div>
                                <input type="text" className="input_search" placeholder="Search" />
                              </div>
                            </th>
                            <th>
                              <div className="help" data-toggle="ratings-help-popover" data-placement="bottom" data-total="The total amount of contracts" data-success="The amount of successfully finished contracts">?</div>
                            </th>
                            <th>
                              <div  className="all-time">
                                All time
                                <span className="arrow_down"></span>
                                <div className="all-time_dropdown">
                                  <a href="#" className="all-time_dropdown-link">1 week</a>
                                  <a href="#" className="all-time_dropdown-link">1 month</a>
                                  <a href="#" className="all-time_dropdown-link">3 months</a>
                                  <a href="#" className="all-time_dropdown-link">6 months</a>
                                  <a href="#" className="all-time_dropdown-link">12 months</a>
                                  <a href="#" className="all-time_dropdown-link active">All time</a>
                                </div>
                              </div>
                            </th>
                            <th></th>
                            <th>
                              <div className="buttons-wrap">
                                <button className="btn btn-active">BTC</button>
                                <button className="btn">USD</button>
                              </div>
                            </th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {fakeDataInvestors().map(d => <InvestorRatingRow {...d} />)}
                        </tbody>
                      </table>
                    </div>
                    <div className="table-rewind table-rewind--dark hide-desktop">
                      <button className="table-rewind__button table-rewind__button--prev"><span className="arrow"></span></button>
                      <button className="table-rewind__button table-rewind__button--next"><span className="arrow"></span></button>
                    </div>
                    <BestInvestors />
                  </div>
                </div>
              </div>
            </div>
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

function fakeDataTraders() {
  let ratings = [];
  for(let i = 0; i < 18; i++) {
    const rating = {};
    rating.name = 'COINTRADERGUY';
    rating.rank = 1;
    rating.totalContracts = 7;
    rating.successContracts = 8;
    rating.roi = -34.7;
    ratings.push(rating);
  }
  return ratings;
}
function fakeDataInvestors() {
  let ratings = [];
  for(let i = 0; i < 6; i++) {
    const rating = {};
    rating.name = 'COINTRADERGUY';
    rating.rank = 1;
    rating.totalContracts = 7;
    rating.successContracts = 8;
    rating.roi = -34.7;
    ratings.push(rating);
  }
  return ratings;
}

const TraderRatingRow = (props) => (
  <tr>
    <td>
      <span className="star"></span>
    </td>
    <td>
      <div className="nickname">@{props.name}</div>
    </td>
    <td>
      <span className="rank">{props.rank}</span>
      <span className="total">{props.totalContracts}</span>
      <span className="total">/</span>
      <span className="success">{props.successContracts}</span>
    </td>
    <td>
      <span>{props.roi}</span>
      <span className="graph"></span>
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
);

const InvestorRatingRow = (props) => (
  <tr>
    <td>
      <span className="star"></span>
    </td>
    <td>
      <div className="nickname">@COINTRADERGUY</div>
    </td>
    <td>
      <span className="rank">1</span>
      <span className="total">7</span>
      <span className="total">/</span>
      <span className="success">8</span>
    </td>
    <td>
      <span>-34.7</span>
      <span className="graph"></span>
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
);


export default Ratings;

import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import BestTraders from './BestTraders';
import BestInvestors from './BestInvestors';
import { Popover } from 'reactstrap';
import classNames from 'classnames';
import { generateRatings } from '../demoData/ratings';
import $ from 'jquery';

const TAB_TRADERS = 0;
const TAB_INVESTORS = 1;

class Ratings extends React.Component {

  constructor(props) {
    super(props);
    this.onNameFilterChange = this.onNameFilterChange.bind(this);
    this.onTabClick = this.onTabClick.bind(this);
    let ratings = localStorage.getItem('ratings');
    if(!ratings) {
      ratings = generateRatings();
      localStorage.setItem('ratings', JSON.stringify(ratings));
    } else {
      try {
        ratings = JSON.parse(ratings);
      } catch(e) {
        ratings = generateRatings();
        localStorage.setItem('ratings', JSON.stringify(ratings));
      }
    }
    this.state = {
      roiIntervalOpen: false,
      nameFilter: '',
      tab: TAB_TRADERS,
      ratings,
    };
  }

  onTabClick(tab) {
    this.setState({tab});
    $('.js-table-wrapper table').floatThead('reflow');
  }


  onNameFilterChange(e) {
    this.setState({nameFilter: e.target.value});
  }

  render() {
    let data = this.state.tab === TAB_TRADERS ? this.state.ratings.traders : this.state.ratings.investors;
    data = data.filter(profile => {
      return profile.name.toLowerCase().indexOf(this.state.nameFilter.toLowerCase()) >= 0;
    });
    return (
      <Container fluid className="ratings">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <div className="ratings-main">
              <div className="ratings-main__title"> RATINGS</div>
              <div className="ratings-main__block">
                <div className="block__top">
                  <div className="block__top-switch-wrap">
                    <span
                      onClick={() => this.onTabClick(TAB_TRADERS)}
                      className={classNames('block__top-switch', 'ratings-traders', {active: this.state.tab === TAB_TRADERS})}>
                      Traders
                    </span>
                    <span
                      onClick={() => this.onTabClick(TAB_INVESTORS)}
                      className={classNames('block__top-switch', 'ratings-investors', {active: this.state.tab === TAB_INVESTORS})}>
                      Investors
                    </span>
                  </div>
                </div>
                <div className="ratings-tabs">
                  {this.state.tab === TAB_TRADERS ? (
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
                                  <input value={this.state.nameFilter} onChange={this.onNameFilterChange} type="text" className="input_search" placeholder="Search" />
                                </div>
                              </th>
                              <th>
                                <div className="help" data-toggle="ratings-help-popover" data-placement="bottom" data-total="The total amount of contracts" data-success="The amount of successfully finished contracts">?</div>
                              </th>
                              <th>
                                <div onClick={() => this.setState({roiIntervalOpen: !this.state.roiIntervalOpen})} id="roi-time"className="all-time">
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
                            {data.map(rating => <TraderRatingRow {...rating} />)}
                          </tbody>
                        </table>
                      </div>
                      <div className="table-rewind table-rewind--dark hide-desktop">
                        <button className="table-rewind__button table-rewind__button--prev"><span className="arrow"></span></button>
                        <button className="table-rewind__button table-rewind__button--next"><span className="arrow"></span></button>
                      </div>
                      <BestTraders />
                    </div>
                  ) : (
                    <div className="ratings-tab ratings-investors active">
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
                                  <input value={this.state.nameFilter} onChange={this.onNameFilterChange} type="text" className="input_search" placeholder="Search" />
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
                            {data.map(d => <InvestorRatingRow {...d} />)}
                          </tbody>
                        </table>
                      </div>
                      <div className="table-rewind table-rewind--dark hide-desktop">
                        <button className="table-rewind__button table-rewind__button--prev"><span className="arrow"></span></button>
                        <button className="table-rewind__button table-rewind__button--next"><span className="arrow"></span></button>
                      </div>
                      <BestInvestors />
                    </div>
                  )}
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
      <a style={{color: 'white', textTransform: 'uppercase'}} href={'/' + props.name}><div className="nickname">@{props.name}</div></a>
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
      {formatDate(new Date(props.dateCreated))}
    </td>
    <td>
      {props.minAmount + ' ' + props.minAmountCurrency}
    </td>
    <td>
      {props.duration}
    </td>
    <td>
      {props.fee}
    </td>
    <td>
      {props.moneyInManagement}
    </td>
    <td>
      {props.maxLoss}
    </td>
  </tr>
);

const InvestorRatingRow = (props) => (
  <tr>
    <td>
      <span className="star"></span>
    </td>
    <td>
      <a style={{color: 'white', textTransform: 'uppercase'}} href={'/' + props.name}><div className="nickname">@{props.name}</div></a>
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
      {formatDate(new Date(props.dateCreated))}
    </td>
    <td>
      {props.paidExcessProfit}
    </td>
    <td>
      {props.paidInvoices}
    </td>
  </tr>
);

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

export default Ratings;

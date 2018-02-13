import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import BestTraders from './BestTraders';
import BestInvestors from './BestInvestors';
import classNames from 'classnames';
import DropdownSelect from '../terminal/DropdownSelect';
import $ from 'jquery';
import {sortData, onColumnSort, classNameForColumnHeader}  from '../generic/terminalSortFunctions';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateRatings } from '../actions/terminal';

const TAB_TRADERS = 0;
const TAB_INVESTORS = 1;
const TIME_RANGE_OPTIONS = ['1 week', '1 month', '3 months', '6 months', '12 months', 'All time'];

class Ratings extends React.Component {

  constructor(props) {
    super(props);
    this.onNameFilterChange = this.onNameFilterChange.bind(this);
    this.onTabClick = this.onTabClick.bind(this);
    this.sortData = sortData.bind(this);
    this.onColumnSort = onColumnSort.bind(this);
    this.sortFunctions = {
      dateCreated: (a, b) => (new Date(a.dateCreated)) - (new Date(b.dateCreated)),
    };
    this.state = {
      roiIntervalOpen: false,
      nameFilter: '',
      tab: TAB_TRADERS,
      selectedPeriod: 'All time',
      sort: {}
    };
  }

  componentDidUpdate() {
    $('.all-time').popover({
      trigger: 'click',
      container: $('.ratings-main'),
      html: true,
      animation: false,
      placement: 'bottom',
      template: `
      <div class="popover dropdown-popover dropdown-popover--select">
        <div class="popover-body"></div>
      </div>`,
      content: function() {
        return $(this).next('.all-time_dropdown')[0].outerHTML;
      },
      offset: '50%p - ' + (($('.all-time').width() / 2) + 8).toString() + 'px, 0'
    });
  }

  onTabClick(tab) {
    this.setState({tab});
    $('.js-table-wrapper table').floatThead('reflow');
  }


  onNameFilterChange(e) {
    this.setState({nameFilter: e.target.value});
  }

  render() {
    let data = this.props.ratings;
    let period = this.state.selectedPeriod;
    data = data.filter(profile => {
      return profile.name.toLowerCase().indexOf(this.state.nameFilter.toLowerCase()) >= 0;
    });
    const sortedData = this.sortData(data);
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
                              <th onClick={() => this.onColumnSort('name')} className="name">
                                <span>Name</span><span className={classNameForColumnHeader(this.state, 'name')}></span>
                              </th>
                              <th onClick={() => this.onColumnSort('rank')} className="rank">
                                <span>Rank</span><span className={classNameForColumnHeader(this.state, 'rank')}></span>
                              </th>
                              <th onClick={() => this.onColumnSort('roi')}>
                                <span>ROI,&nbsp;%</span><span className={classNameForColumnHeader(this.state, 'roi')}></span>
                              </th>
                              <th onClick={() => this.onColumnSort('availableForOffers')}>
                                <span>Accepting request</span><span className={classNameForColumnHeader(this.state, 'availableForOffers')}></span>
                              </th>                              
                              <th onClick={() => this.onColumnSort('dateCreated')}>
                                <span>Started since</span><span className={classNameForColumnHeader(this.state, 'dateCreated')}></span>
                              </th>
                              <th onClick={() => this.onColumnSort('minAmount')}>
                                <span>Min contract<br/>amount</span><span className={classNameForColumnHeader(this.state, 'minAmount')}></span>
                              </th>
                              <th onClick={() => this.onColumnSort('duration')}>
                                <span className="show-mobile">Dur.,</span>
                                <span className='hide-mobile'>Duration of the contract,<br/></span>
                                <span>days</span>
                                <span className={classNameForColumnHeader(this.state, 'duration')}></span>
                              </th>
                              <th onClick={() => this.onColumnSort('fee')}>
                                <span>Fee, %</span><span className={classNameForColumnHeader(this.state, 'fee')}></span>
                              </th>
                              <th onClick={() => this.onColumnSort('inManagement')}>
                                <span>Money in management</span><span className={classNameForColumnHeader(this.state, 'inManagement')}></span>
                              </th>
                              <th onClick={() => this.onColumnSort('maxLoss')}>
                                <span>Max loss,&nbsp;%</span><span className={classNameForColumnHeader(this.state, 'maxLoss')}></span>
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
                                <DropdownSelect
                                  selected={this.state.selectedPeriod}
                                  items={TIME_RANGE_OPTIONS}
                                  targetId="time_select"
                                  elementClassName="time__switch"
                                  dropdownClassName="roi"
                                  onItemSelect={item => this.setState({selectedPeriod: item})}
                                />
                              </th>                              
                              <th></th>
                              <th>
                              </th>
                              <th></th>
                              <th></th>
                              <th>
                              </th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedData.map(rating => <TraderRatingRow {...rating} />)}
                          </tbody>
                        </table>
                      </div>
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
                              <th onClick={() => this.onColumnSort('name')} className='name'>
                                <span>Name</span><span className="icon-dir icon-down-dir"></span>
                              </th>
                              <th onClick={() => this.onColumnSort('rank')} className='rank'>
                                <span>Rank</span><span className="icon-dir icon-down-dir"></span>
                              </th>
                              <th onClick={() => this.onColumnSort('roi')}>
                                <span>ROI,&nbsp;%</span><span className="icon-dir icon-down-dir"></span>
                              </th>
                              <th onClick={() => this.onColumnSort('dateCreated')}>
                                <span>Started since</span><span className="icon-dir icon-down-dir"></span>
                              </th>
                              <th onClick={() => this.onColumnSort('paidExcessProfit')}>
                                <span>Paid excess<br/>profit</span><span className="icon-dir icon-down-dir"></span>
                              </th>
                              <th onClick={() => this.onColumnSort('paidInvoices')}>
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
                                <DropdownSelect
                                  selected={this.state.selectedPeriod}
                                  items={TIME_RANGE_OPTIONS}
                                  targetId="time_select"
                                  elementClassName="time__switch"
                                  dropdownClassName="roi"
                                  onItemSelect={item => this.setState({selectedPeriod: item})}
                                />
                              </th>
                              <th></th>
                              <th>
                              </th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedData.map(d => <InvestorRatingRow {...d} />)}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="ratings-best__block">
                {this.state.tab === TAB_TRADERS ? <BestTraders /> : <BestInvestors />}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
  componentDidMount() {
    window.customize();
    $('.all-time').popover({
      trigger: 'click',
      container: $('.ratings-main'),
      html: true,
      animation: false,
      placement: 'bottom',
      template: `
      <div class="popover dropdown-popover dropdown-popover--select">
        <div class="popover-body"></div>
      </div>`,
      content: function() {
        return $(this).next('.all-time_dropdown')[0].outerHTML;
      },
      offset: '50%p - ' + (($('.all-time').width() / 2) + 8).toString() + 'px, 0'
    });
    console.log(this.props);
    this.props.updateRatings();
  }

  componentWillUnmount() {
    window.uncustomize();
  }
}

const TraderRatingRow = (props) => (
  <tr>
    <td>
      <span className="star"></span>
    </td>
    <td>
      <Link style={{color: 'white', textTransform: 'uppercase'}} to={'/' + props.name}><div className="nickname">@{props.name}</div></Link>
    </td>
    <td>
      <span className="rank">{props.rank}</span>
      <span className="total">{props.totalContracts || 0}</span>
      <span className="total">/</span>
      <span className="success">{props.successContracts || 0}</span>
    </td>
    <td>
      <span>{0}</span>
    </td>
    <td>
      {props.availableForOffers ?
        <span className='accept'/> :
        <span className='empty'/> }
    </td>    
    <td>
      {formatDate(new Date(props.dt || Date.now()))}
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
      {(props.inManagement || 0).toFixed(2) + ' USDT'}
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
      <Link style={{color: 'white', textTransform: 'uppercase'}} to={'/' + props.name}><div className="nickname">@{props.name}</div></Link>
    </td>
    <td>
      <span className="rank">{props.rank}</span>
      <span className="total">{props.totalContracts}</span>
      <span className="total">/</span>
      <span className="success">{props.successContracts}</span>
    </td>
    <td>
      <span>{0}</span>
    </td>
    <td>
      {formatDate(new Date(props.dt || Date.now()))}
    </td>
    <td>
      {props.paidExcessProfit || 0}
    </td>
    <td>
      {props.paidInvoices || 0}
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

export default connect(
  state => ({ratings: state.terminal.ratings}),
  dispatch => ({updateRatings: () => dispatch(updateRatings())}),
)(Ratings);

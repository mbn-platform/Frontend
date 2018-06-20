import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import $ from 'jquery';
import classNames from 'classnames';
import {sortData, onColumnSort, classNameForColumnHeader, defaultSortFunction} from '../generic/terminalSortFunctions';
import {apiGet} from '../generic/apiCall';

class Leaderbord extends React.Component {

  constructor(props) {
    super(props);
    this.onNameFilterChange = this.onNameFilterChange.bind(this);
    this.onTabClick = this.onTabClick.bind(this);
    this.sortData = sortData.bind(this);
    this.onColumnSort = onColumnSort.bind(this);
    this.sortFunctions = {
      name: (a, b) => defaultSortFunction(a.name.toLowerCase(), b.name.toLowerCase(),),
    };
    this.state = {
      rounds: [],
      nameFilter: '',
      sort: {}
    };
    this.onRowClick = this.onRowClick.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
  }

  onInputBlur(e) {
    this.shouldFocus = true;
  }

  onRowClick(e) {
    const name = e.currentTarget.dataset.name;
    this.props.history.push(`/${name}`);
  }

  onTabClick(tab) {
    this.setState({tab});
    $('.js-table-wrapper table').floatThead('reflow');
  }

  onNameFilterChange(e) {
    this.setState({nameFilter: e.target.value});
  }

  render() {
    let data = [];
    if(this.state.rounds[0]) {
      data = this.state.rounds[0].results;
    }
    data = data.filter(profile => {
      return profile.name.toLowerCase().indexOf(this.state.nameFilter.toLowerCase()) >= 0;
    });
    const sortedData = this.sortData(data);
    return (
      <Container fluid className="ratings">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <div className="ratings-main">
              <div className="ratings-main__title"> LEADERBORD</div>
              <div className="ratings-main__block">
                <div className="block__top">
                  <div className="block__top-switch-wrap">
                    <span
                      className={classNames('block__top-switch', 'ratings-traders', {active: true})}>
                      ROUND 1
                    </span>
                  </div>
                </div>
                {this.renderRound()}
                <div className="ratings-tabs">
                  <div className="ratings-tab ratings-traders active">
                    <div className="ratings-table-wrap js-table-wrapper">
                      <table className="table">
                        <thead>
                          <tr>
                            <th onClick={() => this.onColumnSort('place')} className="place">
                              <span>Place</span><span className={classNameForColumnHeader(this.state, 'place')}></span>
                            </th>
                            <th onClick={() => this.onColumnSort('name')} className="name">
                              <span>Name</span><span className={classNameForColumnHeader(this.state, 'name')}></span>
                            </th>
                            <th onClick={() => this.onColumnSort('balance')}>
                              <span>Balance (USDT)</span><span className={classNameForColumnHeader(this.state, 'balance')}></span>
                            </th>
                          </tr>

                          <tr>
                            <th></th>
                            <th>
                              <div>
                                <input onBlur={this.onInputBlur} value={this.state.nameFilter} onChange={this.onNameFilterChange} type="text" className="input_search" placeholder="Search" />
                              </div>
                            </th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedData.map(rating => <RatingRow key={rating.name} {...rating} onClick={this.onRowClick} />)}
                        </tbody>
                      </table>
                    </div>
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
    const $table = $('.js-table-wrapper .table');
    $table.on('reflowed', (e, $container) => {
      if(this.shouldFocus) {
        $($container).find('input').focus();
        this.shouldFocus = false;
      }
    });
    apiGet('/challenge/1')
      .then(json => {
        this.setState({rounds: [json]});
      })
      .catch(e => {
        this.setState({rounds: []});
      });
  }

  componentWillUnmount() {
    const $table = $('js-table-wrapper table');
    $table.off();
    window.uncustomize();
  }

  renderRound() {
    if(this.state.rounds[0]) {
      const round = this.state.rounds[0];
      return (
        <div className="round_info">
          <div>{formatDate(new Date(round.dtStart))} - {formatDate(new Date(round.dtEnd))}</div>
          <div>{round.state}</div>
        </div>
      );
    } else {
      return null;
    }
  }
}

function formatDate(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  year = padDate(year);
  month = padDate(month);
  day = padDate(day);
  return day + '.' + month + '.' + year;
}
function padDate(number) {
  return number < 10 ? '0' + number : number;
};

const RatingRow = (props) => (
  <tr data-name={props.name} onClick={props.onClick}>
    <td>
      <span className="place">{props.place}</span>
    </td>
    <td>
      <div className="name nickname">@{props.name}</div>
    </td>
    <td>
      <div className="balance">{(props.balance || 0).toFixed(2)}</div>
    </td>
  </tr>
);

export default Leaderbord;

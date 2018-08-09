import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import $ from 'jquery';
import classNames from 'classnames';
import {sortData, onColumnSort, classNameForColumnHeader, defaultSortFunction} from '../../generic/terminalSortFunctions';
import { injectIntl } from 'react-intl';
import { FormattedMessage } from 'react-intl';
import {updateChallenge} from '../../actions/challenge';
import {connect} from 'react-redux';


const NUMBER_OF_ROUNDS = 4,
  infoPlaces= ['1', '2', '3', '4', '5', '6-10', '11-20', '21-50', '51-100', '101+'],
  infoPoints= ['100', '75', '50', '35', '25', '15', '10', '5', '3', '1'];

class Leaderboard extends React.Component {

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
      selectedRound: 0,
      round: null,
      nameFilter: '',
      sort: {},
    };
    this.inputRef = React.createRef();
    this.onRowClick = this.onRowClick.bind(this);
    this.selectRound = this.selectRound.bind(this);
  }

  componentDidMount() {
    window.customize();
    const $table = $('.js-table-wrapper .table');
    $table.on('reflowed', (e, $container) => {
      if(this.shouldFocus) {
        $($container).find('input').focus();
      }
    });
    this.selectRound(0);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.challenge !== prevState.challenge) {
      return {round: nextProps.challenge};
    } else {
      return null;
    }
  }

  selectRound(number) {
    const { updateChallenge, challenge } = this.props;
    clearInterval(this.interval);
    updateChallenge(number);
    this.setState({selectedRound: number, round: challenge})
    this.interval = setInterval(() => updateChallenge(number), 30000);
  }

  onRowClick(e) {
    if(e.target.tagName === 'A') {
      return;
    }
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
    if(this.inputRef.current && document.activeElement === this.inputRef.current) {
      this.shouldFocus = true;
    } else {
      this.shouldFocus = false;
    }
    let data = [];
    if(this.state.round) {
      data = this.state.round.results;
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
              <div className="ratings-main__title">
                <FormattedMessage
                  id="leaderboard.title"
                  defaultMessage="LEADERBOARD"
                />
              </div>
              <div className="ratings-main__block">
                <div className="block__top">
                  <div className="block__top-switch-wrap">
                    <span
                      onClick={() => this.selectRound(0)}
                      className={classNames('block__top-switch', 'ratings-traders', {active: this.state.selectedRound === 0})}>
                      <FormattedMessage
                        id="leaderboard.global"
                        defaultMessage="GLOBAL"
                      />
                    </span>
                    {this.renderRoundsBlocks()}
                  </div>
                </div>
                {this.renderRound()}
                <div className="ratings-tabs">
                  <div className="ratings-tab ratings-traders active">
                    <div className="ratings-table-wrap js-table-wrapper">
                      {this.state.selectedRound === 0 ? this.renderGlobalBoard(sortedData) : this.renderRoundBoard(sortedData)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="leaderboard__info">
                {this.renderInfoBoard()}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  renderRoundsBlocks() {
    const rounds = [];
    for(let i = 1; i <= NUMBER_OF_ROUNDS; i++) {
      rounds.push(
        <span
          key={i}
          onClick={() => this.selectRound(i)}
          className={classNames('block__top-switch', 'ratings-traders', {active: this.state.selectedRound === i})}>
          <FormattedMessage
            id="leaderboard.round"
            defaultMessage="ROUND {count}"
            values={{count: i}}
          />
        </span>
      );
    }
    return rounds;
  }

  componentWillUnmount() {
    const $table = $('js-table-wrapper table');
    $table.off();
    window.uncustomize();
    clearInterval(this.interval);
  }

  renderRound() {
    if(this.state.round && !this.state.round.global) {
      const round = this.state.round;
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

  renderInfoBoard = () => (
    <div>
      <div className="leaderboard__title">
        <FormattedMessage id="leaderboard.infoTitle" defaultMessage="Point Info"/>
      </div>
      <div className="leaderboard__annotation">
        <FormattedMessage
          id="leaderboard.annotationInfo"
          defaultMessage="After each round of the competition, every participant is receiving Tournament Points according the their weekly ratings. The exact amount of points is shown in the table below. After all rounds of competition those Points will be converted into MBN tokens."
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th className="place">
              <span>
                <FormattedMessage
                  id="leaderboard.placeInRating"
                  defaultMessage="Place In Rating"
                />
              </span>
            </th>
            <th onClick={() => this.onColumnSort('points')}>
              <span>
                <FormattedMessage
                  id="leaderboard.pointCount"
                  defaultMessage="Point Count"
                />
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {infoPlaces.map((infoItem, index) => (
            <tr>
              <th className="place">
                <span>
                  {infoPlaces[index]}
                </span>
              </th>
              <th onClick={() => this.onColumnSort('points')}>
                <span>
                  {infoPoints[index]}
                </span>
              </th>
            </tr>
          ))
          }
        </tbody>
      </table>
    </div>
  )

  renderGlobalBoard(data) {
    return (
      <table className="table">
        <thead>
          <tr>
            <th onClick={() => this.onColumnSort('place')} className="place">
              <span>
                <FormattedMessage
                  id="leaderboard.place"
                  defaultMessage="Place"
                />
              </span><span className={classNameForColumnHeader(this.state, 'place')}/>
            </th>
            <th onClick={() => this.onColumnSort('name')} className="name">
              <span>
                <FormattedMessage
                  id="leaderboard.name"
                  defaultMessage="Name"
                />
              </span><span className={classNameForColumnHeader(this.state, 'name')}/>
            </th>
            <th onClick={() => this.onColumnSort('points')}>
              <span>
                <FormattedMessage
                  id="leaderboard.points"
                  defaultMessage="Points"
                /></span><span className={classNameForColumnHeader(this.state, 'points')}/>
            </th>
          </tr>

          <tr>
            <th/>
            <th>
              <div>
                <input ref={this.inputRef} value={this.state.nameFilter} onChange={this.onNameFilterChange} type="text" className="input_search" placeholder={this.props.intl.messages['leaderboard.searchPlaceholder']}
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map(rating => <RatingRow key={rating.place} {...rating} onClick={this.onRowClick} round={this.state.round} />)}
        </tbody>
      </table>
    );
  }

  renderRoundBoard(data) {
    return (
      <table className="table">
        <thead>
          <tr>
            <th onClick={() => this.onColumnSort('place')} className="place">
              <span>
                <FormattedMessage
                  id="leaderboard.place"
                  defaultMessage="Place"
                />
              </span><span className={classNameForColumnHeader(this.state, 'place')}/>
            </th>
            <th onClick={() => this.onColumnSort('name')} className="name">
              <span>
                <FormattedMessage
                  id="leaderboard.name"
                  defaultMessage="Name"
                />
              </span><span className={classNameForColumnHeader(this.state, 'name')}/>
            </th>
            <th onClick={() => this.onColumnSort('profit')}>
              <span>
                <FormattedMessage
                  id="leaderboard.profitUsd"
                  defaultMessage="Profit (USDT)"
                />
              </span><span className={classNameForColumnHeader(this.state, 'profit')}/>
            </th>
            {(this.state.round && !this.state.round.global) ? (
              <th onClick={() => this.onColumnSort('percent')}>
                <span>
                  <FormattedMessage
                    id="leaderboard.profitPercent"
                    defaultMessage="Profit, %"
                  />
                </span><span className={classNameForColumnHeader(this.state, 'percent')}/>
              </th>
            ) : null
            }

          </tr>

          <tr>
            <th/>
            <th>
              <div>
                <input ref={this.inputRef} value={this.state.nameFilter} onChange={this.onNameFilterChange} type="text" className="input_search" placeholder={this.props.intl.messages['leaderboard.searchPlaceholder']} />
              </div>
            </th>
            {(this.state.round && !this.state.round.global) ? (<th/>) : null}
          </tr>
        </thead>
        <tbody>
          {data.map(rating => <RatingRow key={rating.place} {...rating} onClick={this.onRowClick} round={this.state.round} />)}
        </tbody>
      </table>
    );
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
      {props.round.global ? (
        <ProfitCell profit={props.points} />
      ) : (
        <ProfitCell {...props} />
      )}
    </td>
    {props.round.global ? null : (
      <td>
        <div className="percent">{(props.percent || 0).toFixed(2)}</div>
      </td>
    )}
  </tr>
);

const ProfitCell = ({profit, tx}) => {
  profit = (profit || 0).toFixed(2);
  if(tx) {
    return (
      <div className="profit">{profit} <a className="tx_link" target="_blank" href={'https://etherscan.io/tx/' + tx} />
      </div>
    );
  } else {
    return (
      <div className="profit">{profit}</div>
    );
  }
};

export default injectIntl(connect(
  state => ({challenge: state.challenge}),
  dispatch => ({updateChallenge: number => dispatch(updateChallenge(number))}),
)(Leaderboard));


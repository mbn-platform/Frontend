import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import $ from 'jquery';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import times from 'lodash.times';
import qs from 'qs';
import {sortData, onColumnSort, classNameForColumnHeader, defaultSortFunction} from '../../generic/terminalSortFunctions';
import { injectIntl } from 'react-intl';
import { FormattedMessage } from 'react-intl';
import {updateChallenge} from '../../actions/challenge';
import {connect} from 'react-redux';
import RoundSelect from './RoundSelect';


const infoPlaces= ['1', '2', '3', '4', '5', '6-10', '11-20', '21-50', '51-100', '101+'];
const infoPoints = ['100', '75', '50', '35', '25', '15', '10', '5', '3', '1'];

class Leaderboard extends React.Component {
  static propTypes = {
    maxDisplayedTabs: PropTypes.number,
  };

  static defaultProps = {
    maxDisplayedTabs: 4,
  };


  constructor(props) {
    super(props);
    this.onNameFilterChange = this.onNameFilterChange.bind(this);
    this.sortData = sortData.bind(this);
    this.onColumnSort = onColumnSort.bind(this);
    this.sortFunctions = {
      name: (a, b) => defaultSortFunction(a.name.toLowerCase(), b.name.toLowerCase(),),
    };
    this.state = {
      selectedRound: 0,
      nameFilter: '',
      sort: {},
    };
    this.inputRef = React.createRef();
    this.onRowClick = this.onRowClick.bind(this);
    this.selectRound = this.selectRound.bind(this);
  }

  componentDidMount() {
    window.customize();
    const { round } = qs.parse(this.props.location.search.slice(1));
    const $table = $('.js-table-wrapper .table');
    $table.on('reflowed', (e, $container) => {
      if(this.shouldFocus) {
        $($container).find('input').focus();
      }
    });
    if (round && round.match(/^[0-9]+$/)) {
      this.selectRound(parseInt(round, 10));
    }
    else {
      this.selectRound(0);
    }
  }

  selectRound(number) {
    const { updateChallenge } = this.props;
    this.props.history.replace({
      pathname: '/leaderboard',
      search: number > 0 ? `round=${number}` : '',
    });
    clearInterval(this.interval);
    updateChallenge(number);
    this.setState({selectedRound: number});
    this.interval = setInterval(() => updateChallenge(number), 30000);
  }

  onRowClick(e) {
    if(e.target.tagName === 'A') {
      return;
    }
    const name = e.currentTarget.dataset.name;
    this.props.history.push(`/${name}`);
  }

  onNameFilterChange(e) {
    this.setState({nameFilter: e.target.value});
  }

  render() {
    const { selectedRound } = this.state;
    if(this.inputRef.current && document.activeElement === this.inputRef.current) {
      this.shouldFocus = true;
    } else {
      this.shouldFocus = false;
    }
    let roundInfo = null;
    let results = [];
    let count = 0;
    const {challenge} = this.props;
    if(challenge) {
      count = challenge.count;
      if(challenge.global && selectedRound === 0) {
        roundInfo = null;
        results = challenge.results;
      } else if(
        challenge.roundInfo &&
        challenge.roundInfo.number === this.state.selectedRound
      ) {

        roundInfo = challenge.roundInfo;
        results = challenge.results;
      }
    }
    const nameFilter = this.state.nameFilter.toLowerCase();
    results = results.filter(({name}) => name.toLowerCase().includes(nameFilter));
    const isSelectedRoundExist = count >= selectedRound;
    const sortedData = this.sortData(results);
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
                    <a
                      href={'/leaderboard'}
                      onClick={e => {e.preventDefault();this.selectRound(0)}}
                      className={classNames('block__top-switch', 'ratings-traders', {active: this.state.selectedRound === 0})}>
                      <FormattedMessage
                        id="leaderboard.global"
                        defaultMessage="GLOBAL"
                      />
                    </a>
                    {this.renderRoundsBlocks(count)}
                  </div>
                </div>
                {this.renderBoard(sortedData, roundInfo, isSelectedRoundExist)}
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

  renderBoard(sortedData, roundInfo, isSelectedRoundExists) {
    if (!isSelectedRoundExists) {
      return this.renderMissingRoundNotice();
    }
    else if (sortedData) {
      return this.renderMainBoard(sortedData, roundInfo);
    }
    else {
      return null;
    }
  }

  renderRoundsBlocks(count) {
    const rounds = [];
    const {maxDisplayedTabs, location: {pathname : path} } = this.props;
    const {selectedRound } = this.state;
    for(let i = count; i >= 1; i--) {
      if ( i > (count - maxDisplayedTabs)) {
        rounds.push(
          <a
            href={`${path}?round=${i}`}
            key={i}
            onClick={e => {e.preventDefault(); this.selectRound(i);}}
            className={classNames('block__top-switch', 'ratings-traders', {active: selectedRound === i})}>
            <FormattedMessage
              id="leaderboard.round"
              defaultMessage="ROUND {count}"
              values={{count: i}}
            />
          </a>
        );
      }
    }
    if (count > maxDisplayedTabs) {
      rounds.push(
        <RoundSelect key="dropdown" onSelectClick={RoundNumber => this.selectRound(RoundNumber)}
          currentValue={selectedRound <= count - maxDisplayedTabs && selectedRound !== 0 ? selectedRound : null}
          rounds={times(count - maxDisplayedTabs, (i) => 1 + i).reverse()} />
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

  renderMainBoard = (sortedData, roundInfo) =>  this.state.selectedRound === 0 ?
    this.renderGlobalBoard(sortedData)  :
    this.renderRoundBoard(sortedData, roundInfo)

  renderRound(info) {
    if(info) {
      return (
        <div className="round_info">
          <div>{formatDate(new Date(info.dtStart))} - {formatDate(new Date(info.dtEnd))}</div>
          <div>{info.state}</div>
        </div>
      );
    } else {
      return null;
    }
  }

  renderMissingRoundNotice = () => (
    <div className="ratings-tabs">
      <div className="ratings-tab ratings-traders active">
        <div className="ratings-table-wrap js-table-wrapper">
          <div className="ratings-empty-data">
            <FormattedMessage
              id="leaderboard.roundIsNotStartedYet"
              defaultMessage="Round {round} is not started yet"
              values={{
                round: this.state.selectedRound
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )

  renderInfoBoard = () => (
    <div>
      <div className="leaderboard__title">
        <FormattedMessage id="leaderboard.infoTitle" defaultMessage="How many tokens I will earn from postions at the Leaderboard"/>
      </div>
      <div className="leaderboard__annotation">
        <FormattedMessage
          id="leaderboard.annotationInfo"
          defaultMessage="After each round of the competition, every participant receives Tournament Points according the their weekly ratings. The exact amount of points is shown in the table below. After all rounds of competition those Points will be converted into MBN tokens in rate 1/1000.{br}For example, Alice took 1st position at weekly round. She will earn 100*1000 = 100 000 tokens. {dashedTokens}"
          values={{br: <br/>,
            dashedTokens: <span
              title={this.props.intl.messages['leaderboard.ifHardcapWillReached']}
              style={{borderBottom: '1px dashed'}}>
              <FormattedMessage
                id="leaderboard.dashedTokens"
                defaultMessage="1000 tokens = $15"
              />
            </span>,
          }}
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th className="place">
              <FormattedMessage
                id="leaderboard.placeInRating"
                defaultMessage="Place In Rating"
              />
            </th>
            <th onClick={() => this.onColumnSort('points')}>
              <FormattedMessage
                id="leaderboard.pointCount"
                defaultMessage="Point Count"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {infoPlaces.map((infoItem, index) => (
            <tr key={index}>
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
          {data.map(rating => <RatingRow key={rating.place} {...rating} onClick={this.onRowClick} global={true} />)}
        </tbody>
      </table>
    );
  }

  renderRoundBoard(data, info) {
    return (
      <table className="table">
        <thead>
          <tr>
            <th onClick={() => this.onColumnSort('place')} className="table-header place">
              <span>
                <FormattedMessage
                  id="leaderboard.place"
                  defaultMessage="Place"
                />
              </span><span className={classNameForColumnHeader(this.state, 'place')}/>
            </th>
            <th onClick={() => this.onColumnSort('name')} className="table-header name">
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
            {info ? (
              <th onClick={() => this.onColumnSort('percent')}>
                <span>
                  <FormattedMessage
                    id="leaderboard.points"
                    defaultMessage="Points"
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
            <th/>
          </tr>
        </thead>
        <tbody>
          {data.map(rating => <RatingRow key={rating.place} {...rating} onClick={this.onRowClick} global={false} />)}
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
      {props.global ? (
        <ProfitCell profit={props.points} />
      ) : (
        <ProfitCell {...props} />
      )}
    </td>
    {props.global ? null : (
      <td>
        <div className="percent">{(props.points || '')}</div>
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


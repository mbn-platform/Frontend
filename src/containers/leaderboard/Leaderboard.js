import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import $ from 'jquery';
import PropTypes from 'prop-types';
import times from 'lodash.times';
import qs from 'qs';
import {sortData, onColumnSort, classNameForColumnHeader, defaultSortFunction} from '../../generic/terminalSortFunctions';
import { injectIntl } from 'react-intl';
import { FormattedMessage } from 'react-intl';
import {updateChallenge} from '../../actions/challenge';
import {connect} from 'react-redux';
import RoundSelect from './RoundSelect';
import ReactTable from '../../components/SelectableReactTable';


const infoTableData= [
  {
    place:'1',
    point: '100'
  },{
    place:'2',
    point: '75'
  },{
    place:'3',
    point: '50'
  },{
    place:'4',
    point: '35'
  },{
    place:'5',
    point: '25'
  },{
    place:'6-10',
    point: '15'
  },{
    place:'11-20',
    point: '10'
  },{
    place:'21-50',
    point: '5'
  },{
    place:'51-100',
    point: '3'
  },{
    place:'101+',
    point: '1'
  }];


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

  onRowClick = (state, rowInfo) => {
    return {
      onClick: e => {
        if(e.target.tagName === 'A') {
          return;
        }
        const name = rowInfo.original.name;
        this.props.history.push(`/${name}`);
      }
    };
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
    //TODO check with real data
    //const sortedData = this.sortData(results);
    const sortedData = [{'points':349,'profit':139.85,'name':'taonow','place':1},{'points':333,'profit':87.03,'name':'radix','place':2},{'points':307,'profit':72.62,'name':'gennevieve1995','place':3},{'points':226,'profit':22.31,'name':'ogweedz','place':4},{'points':224,'profit':69.41,'name':'cornerstone','place':5},{'points':201,'profit':63.92,'name':'rob007','place':6},{'points':176,'profit':66.86,'name':'amitrajkhanna7','place':7},{'points':166,'profit':39.8,'name':'gelliada','place':8},{'points':163,'profit':6.26,'name':'magisterelk','place':9},{'points':151,'profit':30.41,'name':'get_l0st','place':10},{'points':151,'profit':69.46,'name':'melanoide1','place':11},{'points':149,'profit':45.75,'name':'saamiam','place':12},{'points':146,'profit':45.96,'name':'derad','place':13},{'points':144,'profit':41.19,'name':'ovidiubuzatu','place':14},{'points':144,'profit':48.92,'name':'derad6709','place':15},{'points':107,'profit':43.51,'name':'alenatrader','place':16},{'points':98,'profit':16.95,'name':'emmi','place':17},{'points':93,'profit':10.72,'name':'v1ncent','place':18},{'points':92,'profit':0.09,'name':'idgatchalian08','place':19},{'points':92,'profit':28.49,'name':'patz22','place':20},{'points':87,'profit':18.24,'name':'orel730','place':21},{'points':85,'profit':13.74,'name':'mattp490','place':22},{'points':84,'profit':11.51,'name':'svennk','place':23},{'points':83,'profit':16.95,'name':'alexkolesov','place':24},{'points':83,'profit':16.95,'name':'btc_center','place':25},{'points':82,'profit':16.95,'name':'tbily_weely','place':26},{'points':81,'profit':16.95,'name':'vitalkess','place':27},{'points':79,'profit':0.51,'name':'vasek','place':28},{'points':73,'profit':0,'name':'adalfino','place':29},{'points':69,'profit':16.95,'name':'abdulbee','place':30},{'points':69,'profit':16.95,'name':'rumble','place':31},{'points':64,'profit':0,'name':'pharamoana','place':32},{'points':63,'profit':17.24,'name':'cypriotic0918','place':33},{'points':62,'profit':0,'name':'elky1101','place':34},{'points':61,'profit':0,'name':'iamhussain','place':35},{'points':60,'profit':10.29,'name':'euforiel','place':36},{'points':59,'profit':0,'name':'nimibofa','place':37},{'points':58,'profit':0,'name':'boomer','place':38},{'points':58,'profit':7.59,'name':'civi','place':39},{'points':57,'profit':8.89,'name':'thuanhm','place':40},{'points':57,'profit':0,'name':'ultrakaya','place':41},{'points':56,'profit':14.59,'name':'demartini','place':42},{'points':56,'profit':0,'name':'mark','place':43},{'points':55,'profit':0.07,'name':'pradeepsi','place':44},{'points':55,'profit':14.67,'name':'ksosef','place':45},{'points':54,'profit':0,'name':'baduchief','place':46},{'points':54,'profit':0,'name':'meridiocrypto','place':47},{'points':54,'profit':13.32,'name':'valv','place':48},{'points':54,'profit':7.58,'name':'salim','place':49},{'points':53,'profit':0,'name':'andreikan','place':50},{'points':53,'profit':0,'name':'alexflowz','place':51},{'points':53,'profit':0,'name':'raypaka','place':52},{'points':52,'profit':6.38,'name':'swissmister','place':53},{'points':52,'profit':4.39,'name':'bhatta703','place':54},{'points':51,'profit':0,'name':'malibu','place':55},{'points':51,'profit':0,'name':'aotearoanz','place':56},{'points':50,'profit':11.93,'name':'zgegus','place':57},{'points':50,'profit':6.8,'name':'hungdo1992','place':58},{'points':48,'profit':0,'name':'davebit','place':59},{'points':48,'profit':14.36,'name':'vicky','place':60},{'points':46,'profit':0,'name':'acyclovir','place':61},{'points':46,'profit':0,'name':'lemoor','place':62},{'points':42,'profit':2.27,'name':'gbenga88','place':63},{'points':41,'profit':0,'name':'akosuamary','place':64},{'points':39,'profit':14.79,'name':'stievoo','place':65},{'points':38,'profit':8.64,'name':'abulijahpisces','place':66},{'points':38,'profit':10.89,'name':'willempiee','place':67},{'points':34,'profit':17.29,'name':'killahtm','place':68},{'points':33,'profit':2.42,'name':'malchikhin','place':69},{'points':33,'profit':0,'name':'jnash01','place':70},{'points':33,'profit':0,'name':'yurko','place':71},{'points':33,'profit':0,'name':'antes','place':72},{'points':33,'profit':0,'name':'dante','place':73},{'points':33,'profit':0,'name':'cranders1','place':74},{'points':30,'profit':15.21,'name':'johny','place':75},{'points':28,'profit':6.62,'name':'gregorygak','place':76},{'points':27,'profit':5.45,'name':'abrg1','place':77},{'points':26,'profit':2.54,'name':'frims13','place':78},{'points':25,'profit':0.08,'name':'vychinas','place':79},{'points':24,'profit':0,'name':'rafaturik','place':80},{'points':22,'profit':3.69,'name':'david','place':81},{'points':20,'profit':0,'name':'cryptojunk','place':82},{'points':19,'profit':0,'name':'xruwar','place':83},{'points':18,'profit':1.7,'name':'pencarirezeki','place':84},{'points':16,'profit':0,'name':'alexflow','place':85},{'points':16,'profit':3.54,'name':'amykaza','place':86},{'points':15,'profit':6.52,'name':'lostwood','place':87},{'points':12,'profit':0,'name':'yaroslav__s','place':88},{'points':11,'profit':0,'name':'pian','place':89},{'points':11,'profit':0,'name':'jens','place':90},{'points':10,'profit':2.41,'name':'haviv','place':91},{'points':10,'profit':0,'name':'vazquezvk','place':92},{'points':8,'profit':0.03,'name':'joenstronger','place':93},{'points':8,'profit':0,'name':'yodajpn','place':94},{'points':7,'profit':0,'name':'eric5','place':95},{'points':7,'profit':0,'name':'giuseppe','place':96},{'points':6,'profit':0,'name':'gbengus','place':97},{'points':5,'profit':0,'name':'raisemax','place':98},{'points':4,'profit':0,'name':'haviv1','place':99},{'points':3,'profit':0,'name':'alex545','place':100},{'points':3,'profit':0,'name':'don4yk','place':101}];
    const isGlobal = true;
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
                    {this.renderRoundsBlocks(count)}
                  </div>
                </div>
                {this.renderBoard(sortedData, roundInfo, isSelectedRoundExist, isGlobal)}
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

  renderBoard(sortedData, roundInfo, isSelectedRoundExists, isGlobalRound) {

    if (!isSelectedRoundExists) {
      return this.renderMissingRoundNotice();
    }
    else if (sortedData) {
      return this.renderMainBoard(sortedData, roundInfo, isGlobalRound);
    }
    else {
      return null;
    }
  }

  renderRoundsBlocks(count) {
    const {location: {pathname : path}} = this.props;
    const {selectedRound } = this.state;
    return  <RoundSelect
      key="dropdown"
      path={path}
      onSelectClick={RoundNumber => this.selectRound(RoundNumber)}
      currentValue={selectedRound}
      rounds={times(count, (i) => 1 + i).reverse()}
      targetId="leaderboard__select"
      elementClassName="leaderboard__select-list-item"
      dropdownClassName="leaderboard__select-wrapper"
    />;
  }

  componentWillUnmount() {
    const $table = $('js-table-wrapper table');
    $table.off();
    window.uncustomize();
    clearInterval(this.interval);
  }

  getGlobalBoardColumns = isGlobal => {
    const globalTableColumns =  [
      {
        Header: <div onClick={() => this.onColumnSort('place') }
          className="table__header-wrapper">
          <span>
            <FormattedMessage
              id="leaderboard.place"
              defaultMessage="Place"
            />
          </span><span className={classNameForColumnHeader(this.state, 'place')}/>
        </div>,
        minWidth: 110,
        className: 'ratings__table-cell',
        Cell: row => {
          return (<div onClick={this.onRowClick}>
            {row.original.place}
          </div>);
        }
      }, {
        Header:<div className="table__header-wrapper" onClick={() => this.onColumnSort('name')}>
          <div className="rating__header-title-wrapper">
            <FormattedMessage
              id="leaderboard.name"
              defaultMessage="Name"
            />
            <span className={classNameForColumnHeader(this.state, 'name')}/>
          </div>
          <div>
            <input ref={this.inputRef}
              value={this.state.nameFilter}
              onChange={this.onNameFilterChange}
              type="text"
              className="ratings__input-search"
              placeholder={this.props.intl.messages['leaderboard.searchPlaceholder']} />
          </div>
        </div>,
        className: 'ratings__table-cell',
        Cell: row => {
          return <div onClick={this.onRowClick} className="name nickname">@{row.original.name}</div>;
        },
      }, {
        Header: <div onClick={() => this.onColumnSort('points')}
          className="table__header-wrapper">
          <div className="rating__header-title-wrapper">
            <FormattedMessage
              id="leaderboard.points"
              defaultMessage="Points"
            />
            <span className={classNameForColumnHeader(this.state, 'points')}/>
          </div>
        </div>,
        Cell: row => {
          return row.original.global ? (
            <ProfitCell onClick={this.onRowClick} profit={row.original.points} />
          ) : (
            <ProfitCell onClick={this.onRowClick} {...row.original} />
          );
        },
        className: 'ratings__table-cell',
      },
    ];
    return [
      ...globalTableColumns,
      ...(isGlobal ?
        [] :
        [{
          Header: '',
          minWidth: 20,
          Cell: row =>  (
            <div className="percent" onClick={this.onRowClick} >{(row.origin.points || '')}</div>
          )
        }])
    ];
  }

  renderMainBoard = (sortedData, roundInfo, isGlobal) =>  this.state.selectedRound === 0 ?
    this.renderGlobalBoard(sortedData, isGlobal)  :
    this.renderRoundBoard(sortedData, roundInfo, isGlobal)

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
      <ReactTable
        columns={[
          {
            Header: <div onClick={() => this.onColumnSort('place ')}
              className="table__header-wrapper">
              <FormattedMessage
                id="leaderboard.placeInRating"
                defaultMessage="Place In Rating"
              />
            </div>,
            className: 'ratings__table-cell',
            accessor: 'place',
          },
          {
            Header: <div onClick={() => this.onColumnSort('points') }
              className="table__header-wrapper">
              <FormattedMessage
                id="leaderboard.pointCount"
                defaultMessage="Point Count"
              />
            </div>,
            accessor: 'point',
            className: 'ratings__table-cell',
          }
        ]}
        data={infoTableData}
        scrollBarHeight={300}
      />
    </div>
  )

  renderGlobalBoard = (data, isGlobal) => {
    return (
      <ReactTable
        columns={this.getGlobalBoardColumns(isGlobal)}
        data={data}
        scrollBarHeight={300}
        getTrProps={this.onRowClick}
      />
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

const ProfitCell = ({profit, tx}) => {
  profit = (profit || 0).toFixed(2);
  if(tx) {
    return (
      <div className="profit">{profit}
      <a className="tx_link" target="_blank" href={'https://etherscan.io/tx/' + tx} // eslint-disable-line
        />
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


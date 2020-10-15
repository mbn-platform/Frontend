import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import ReactTable from 'react-table';
import Calculator from './Calculator';
import { PaginationWithPageRight } from '../../components/PaginationWithPage';
import createMqProvider, {ratingSchema} from '../../MediaQuery';
import { ShowVerifiedTooltip } from '../../components/ProfileBlock';
import ProIcon from '../../assets/svg/vip.svg';

const { MediaQuery, Screen} = createMqProvider(ratingSchema);


class Rating extends React.Component {

  Screen = Screen
  MediaQuery = MediaQuery

  state = {
    selectedTrader: '',
    traders: [],
    nameFilter: '',
    showVerified: true,
  }

  componentDidMount() {
    this.props.updateChallenge(0);
    this.props.updateRatings();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.selectedTrader) {
      if (this.props.ratings && this.props.ratings.length) {
        this.setState({selectedTrader: this.props.ratings[0].name});
      }
    }

    if (prevProps.ratings !== this.props.ratings && this.props.ratings) {
      const traders = this.props.ratings.map((t) => t.name);
      this.setState({traders});
    }
  }

  onTraderSelect = (name) => {
    this.setState({selectedTrader: name});
  }

  render() {
    let results = this.props.ratings;
    return (
      <div>
        <Calculator
          calculation={this.props.challenge && this.props.challenge.calculation}
          trader={this.state.selectedTrader}
          onTraderSelect={this.onTraderSelect}
          traders={this.state.traders}
          calculateTraderProfit={this.props.calculateTraderProfit} />
        <div className="ratings-main__title">
          Traders
        </div>
        <div className="ratings-main__block">
          <div>
            <span style={{
              marginRight: '10px',
            }}>
              <input
                style={{
                  verticalAlign: 'middle',
                }}
                value={this.state.nameFilter}
                onChange={this.onNameFilterChange}
                type="text"
                className="ratings__input-search"
                placeholder='Search'
                spellCheck='false'
              />
            </span>
            <label className="rating-checkbox" style={{fontSize: '12px', color: '#7e8190'}}
            >
              <input
                style={{verticalAlign: 'middle', marginRight: '5px'}}
                onChange={this.onShowVerifiedToggle}
                type="checkbox"
                checked={this.state.showVerified}
              />
                Show only verified traders
            </label>
            <ShowVerifiedTooltip />
          </div>
          <this.MediaQuery>
            <this.Screen on={(size) => (
              <RatingTable
                nameFilter={this.state.nameFilter}
                showVerified={this.state.showVerified}
                data={results}
                screenWidth={size}
                onTraderSelect={this.onTraderSelect}
              />
            )} />
          </this.MediaQuery>
        </div>
      </div>
    );
  }

  onNameFilterChange = (e) => {
    this.setState({nameFilter: e.target.value.toLowerCase()});
  }

  onShowVerifiedToggle = (e) => {
    this.setState({showVerified: !this.state.showVerified});
  }
}

class RatingTable extends React.PureComponent {

  state = {
    page: 0,
    nameFilter: '',
  }

  getColumns = (screenWidth) => {
    let showInfo = true;
    let showBTC = true;
    let showUSDT = true;
    let showStats = true;
    let showContractStats = true;
    switch (screenWidth) {
      case 'small':
        showStats = false;
        // fallthrough
      case 'mobile':
        showContractStats = false;
        // fallthrough
      case 'sm':
        showUSDT = false;
        // fallthrough
      case 'xs':
        showBTC = false;
        // fallthrough
      case 'md':
        showInfo = false;
        // fallthrough
        break;
      default:
        break;
    }
    let isSmallFont = false;
    switch (screenWidth) {
      case 'sm':
      case 'small':
      case 'mobile':
        isSmallFont = true;
        break;
      default: break;
    }
    return [
      {
        Header:<div className="table__header-wrapper">
          <div>
            <FormattedMessage
              id="leaderboard.name"
              defaultMessage="Name"
            />
          </div>
        </div>,
        minWIdth: 100,
        className: 'ratings__table-cell',
        Cell: row => {
          return <div className="name nickname">
            {row.original.pro &&
              <img className="status-icon" alt="" src={ProIcon}/>} @{row.value}</div>;
        },
        accessor: 'name',
      }, {
        Header: <div
          className="table__header-wrapper">
          <div className="rating__header-title-wrapper">
            <FormattedMessage
              id="leaderboard.intro"
              defaultMessage="Description"
            />
          </div>
        </div>,
        sortable: false,
        width: 300,
        className: 'ratings__table-cell user-info',
        show: showInfo,
        accessor: 'info',
      }, {
        Header: <div
          className="table__header-wrapper">
          <div className="rating__header-title-wrapper">
            <FormattedMessage
              id="leaderboard.lastSevenUSDT"
              defaultMessage="Balance chart 7d, USDT"
            />
          </div>
        </div>,
        minWidth: 200,
        sortable: false,
        Cell: row => <img src={`/api/static/${row.value}_stat_usdt.png`} alt="" />,
        className: 'ratings__table-cell',
        accessor: 'name',
        show: showUSDT,
      }, {
        Header: <div
          className="table__header-wrapper">
          <div className="rating__header-title-wrapper">
            <FormattedMessage
              id="leaderboard.lastSevenBTC"
              defaultMessage="Balance chart 7d, BTC"
            />
          </div>
        </div>,
        minWidth: 200,
        sortable: false,
        Cell: row => <img src={`/api/static/${row.value}_stat_btc.png`} alt="" />,
        className: 'ratings__table-cell',
        accessor: 'name',
        show: showBTC,
      }, {
        id: 'balanceStat',
        Header: (
          <div className="table__header-wrapper">
            <div className="rating__header-title-wrapper">Balance Under Management</div>
          </div>
        ),
        minWidth: 180,
        sortable: false,
        Cell: ({original: value}) => (
          <div>
            <div>Current USDT: <span className='usdt'>{value.ltusdt.current.toFixed(2)}</span></div>
            <div>Change USDT (7d): <span className='usdt'>{value.ltusdt.change.toFixed(2)}%</span></div>
            <br />
            <div>Current BTC: <span className='btc'>{value.ltbtc.current.toFixed(2)}</span></div>
            <div>Change BTC (7d): <span className='btc'>{value.ltbtc.change.toFixed(2)}%</span></div>
          </div>
        ),
        show: showStats,
        className: 'ratings__table-cell balance-stat',
      }, {
        Header: (
          <div className="table__header-wrapper">
            <div className="rating__header-title-wrapper">Contract Stats</div>
          </div>
        ),
        minWidth: 100,
        sortable: false,
        Cell: ({value}) => (
          <div>
            <div>Positive: {value.positive}</div>
            <div>Negative: {value.negative}</div>
            <br/>
            <br/>
            <br/>
          </div>
        ),
        show: showContractStats,
        className: 'ratings__table-cell contract-stat',
        accessor: 'contractStat',
      }, {
        Header:<div className="table__header-wrapper">
          <div>
            Average Contract ROI
          </div>
        </div>,
        minWidth: 50,
        className: 'ratings__table-cell',
        Cell: row => {
          return <div className="name nickname">{row.value.toFixed(2)}%</div>;
        },
        accessor: 'contractStat.avg6',
      }, {
        Header: (
          <div className="table__header-wrapper">
            <div className="rating__header-title-wrapper">Contract settings</div>
          </div>
        ),
        minWidth: isSmallFont ? 90 : 110,
        sortable: false,
        Cell: ({value}) => (
          <div>
            <div>Target: {value.roi}%</div>
            <div>Max loss: {value.maxLoss}%</div>
            <div>Duration: {value.duration} days</div>
            <div>Fee: {value.fee}%</div>
            <div>Currency: {value.currency}</div>
            <div>Min amount: {value.minAmount}</div>
          </div>
        ),
        className: 'ratings__table-cell contract-settings',
        accessor: 'contractSettings',
      }, {
        Header: '',
        className: 'ratings__table-cell justify-content-center invest-now-button',
        filterMethod: (filter, row) => {
          return !filter.value || row.verified;
        },
        minWidth: 90,
        Cell: row => {
          return (
            <Link to={'/' + row.original.name}>
              <button style={{verticalAlign: 'text-top', width: 'unset'}} className="leaderboard__form-submit">DETAILS</button>
            </Link>
          );
        },
        accessor: 'verified',
        sortable: false,
      }
    ];
  }

  getTrProps = (state, rowInfo) => {
    if (rowInfo) {
      const name = rowInfo.original.name;
      return {
        onClick: () => this.props.onTraderSelect(name),
      };
    } else {
      return {};
    }
  }

  render() {
    return (
      <ReactTable
        className='rating-table'
        columns={this.getColumns(this.props.screenWidth)}
        data={this.props.data}
        filtered={[{id: 'name', value: this.props.nameFilter}, {id: 'verified', value: this.props.showVerified}]}
        getTrProps={this.getTrProps}
        minRows={10}
        resizable={false}
        noDataText=""
        showPagination={true}
        PaginationComponent={PaginationWithPageRight}
      />
    );
  }
}

export default Rating;

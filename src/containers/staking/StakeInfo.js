import React from 'react';
import BigNumber from 'bignumber.js';
import { Col, Button, Row } from 'reactstrap';
import ReactTable from '../../components/SelectableReactTable';
import PaginationWithPage from '../../components/PaginationWithPage';
import { FormattedDate } from 'react-intl';

class StakeInfo extends React.Component {

  state = {
    email: '',
  }

  onEmailInput = (e) => {
    this.setState({email: e.target.value});
  }

  onVerifyEmailClick = () => {
    const email = this.state.email;
    if (!email) {
      return;
    }
    this.props.verifyEmail(email);
  }

  componentDidMount() {
    const {getPage, trs : {page, pageSize}} = this.props;
    getPage(page, pageSize);
  }

  renderTable() {
    const {
      trs: {list, count, page, pageSize},
      setPage,
      setPageSize,
      getPage,
    } = this.props;
    return (
      <ReactTable
        data={list}
        columns={this.columns}
        pages={Math.ceil(count/pageSize)}
        page={page}
        defaultPageSize={pageSize}
        pageSize={pageSize}
        showPagination={true}
        showPaginationBottom={true}
        manual
        paginationPageDispatcher={(p, ps) => {
          setPage(p);
          getPage(p, ps);
        }}
        paginationPageSizeDispatcher={ps => {
          setPageSize(ps);
        }}
        onItemSelected={() => {}}
        PaginationComponent={PaginationWithPage}
      />
    );
  }

  columns = [
    {
      Header: 'Time',
      className: 'table_col_value hashlog__table-cell hashlog__table-cell-time',
      headerClassName: 'hashlog__table-header-title',
      maxWidth: 300,
      Cell: row => (
        <div>
          <FormattedDate
            value={new Date(row.value)}
            year='numeric'
            month='2-digit'
            day='2-digit'
            hour="numeric"
            minute="numeric"
          />
        </div>
      ),
      accessor: 'date',
    },
    {
      Header: 'Bonus, MBN',
      className: 'table_col_value hashlog__table-cell hashlog__table-cell_hash-value pair',
      headerClassName: 'hashlog__table-header-title',
      Cell: row => BigNumber(row.value).div(1e18).toFixed(2),
      accessor: 'amount',
    },
  ]

  renderInfo() {
    const info = this.props.info;
    return (
      <div className='info'>
        <Row>
          <Col xs="12" md="6">
            <div>Staking is on</div>
            <div>Started: <FormattedDate
              value={new Date(info.createdAt)}
              year='numeric'
              month='2-digit'
              day='2-digit'
              hour="numeric"
              minute="numeric"
            />
            </div>
            <div style={{wordBreak: 'break-word'}}>Address: {info.address}</div>
            <div>Balance: {BigNumber(info.balance).div(1e18).toFixed(8)} MBN</div>
            <div>Total Bonus: {BigNumber(info.totalBonus).div(1e18).toFixed(8)} MBN</div>
            <div>Current level: {info.level}. {this.renderLevelInfo(info)}</div>
            <a href="https://abcc.com/en/active/ieo/mbn" target="_blank" rel="noopener noreferrer">
              <Button style={{width: 100}}>BUY MBN</Button>
            </a>
          </Col>
          {this.renderEmailVerification()}
        </Row>
      </div>
    );
  }

  renderEmailVerification() {
    if (!this.props.email) {
      const style = {
        marginTop: '10px',
        backgroundColor: 'inherit',
        border: '1px solid #44464a',
        borderRadius: '3px',
        paddingLeft: '17px',
        textAlign: 'left',
        color: '#7c7c7d',
        height: '26px',
      };
      return (
        <Col xs="12" md="6">
          <div>Only for pre-sale participants</div>
          <div>
            <input placeholder="example@mail.com" style={style} type="email" name="email"
              value={this.state.email}
              onChange={this.onEmailInput} />
          </div>
          <Button onClick={this.onVerifyEmailClick}>OK</Button>
          <div>Fill in email from your dashboard <a href="https://sale.membrana.io">sale.membrana.io</a> to receive staking.</div>
        </Col>
      );
    } else {
      return null;
    }
  }

  getNextLevelRequired(info) {
    const currentValue = BigNumber(info.balance).div(1e18);
    let required;
    if (info.level === 0) {
      required = BigNumber(500).div(info.tokenPrice).toFixed();
    }
    if (info.level === 1) {
      required = BigNumber(6000).div(info.tokenPrice).toFixed();
    }
    const toNextLevel = BigNumber(required).minus(currentValue).toFixed(8);
    return toNextLevel;
  }

  renderLevelInfo(info) {
    switch (info.level) {
      case 2:
        return null;
      case 1:
      case 0:
        return (
          <span style={{color: '#346255'}}>You need {this.getNextLevelRequired(info)} MBN to level {info.level + 1}</span>
        );
      default:
        throw new Error();
    }
  }

  render() {
    return (
      <div>
        {this.renderInfo()}
        <br/>
        <h6>Staking Rewards</h6>
        <Col xs="12" md="6">
          {this.renderTable()}
        </Col>
      </div>
    );
  }
}

export default StakeInfo;

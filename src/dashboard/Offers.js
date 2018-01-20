import React from 'react';
import { Link } from 'react-router-dom';
import SegmentedControl from '../generic/SegmentedControl';
import ReactTable from '../generic/SelectableReactTable';
import classNames from 'classnames';
import { Desktop, Mobile } from '../generic/MediaQuery';
import Pagination from '../generic/Pagination';
import { CONTRACT_STATE_INIT, CONTRACT_STATE_ACCEPTED } from '../constants';
import { calculateKeyBalance } from '../generic/util';


const TAB_INBOX = 0;
const TAB_OUTBOX = 1;

class Offers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: TAB_INBOX,
      selectedOfferTab: TAB_INBOX,
    };
    this.onTabChange = this.onTabChange.bind(this);
    this.onOfferPayClick = this.onOfferPayClick.bind(this);
  }

  onOfferPayClick(offer) {
    this.props.onOfferPay(offer);
  }

  componentWillReceiveProps(nextProps) {
    if(!nextProps.selectedOffer) {
      return;
    }
    if(this.props.offers.incoming.find(o => o._id === nextProps.selectedOffer._id)) {
      this.setState({selectedTab: TAB_INBOX, selectedOfferTab: TAB_INBOX});
    } else if(this.props.offers.outgoing.find(o => o._id === nextProps.selectedOffer._id)) {
      this.setState({selectedTab: TAB_OUTBOX, selectedOfferTab: TAB_OUTBOX});
    }
  }


  onTabChange(index) {
    this.setState({selectedTab: index});
  }

  render() {
    const segments = ['INBOX', 'OUTBOX'];
    return (
      <div className="requests_table table">
        <div className="table_title_wrapper clearfix">
          <div className="table_title">Request list</div>
          <SegmentedControl selectedIndex={this.state.selectedTab}
            onChange={this.onTabChange}
            segments={segments}
          />
        </div>
        {this.renderContent()}
        {this.renderForm()}
      </div>
    );
  }

  renderForm() {
    if(!this.props.selectedOffer ||
      this.state.selectedTab !== this.state.selectedOfferTab ||
      this.props.selectedOffer.state !== CONTRACT_STATE_INIT) {
      return null;
    } else {
      switch(this.state.selectedTab) {
        case TAB_INBOX: {
        const onAcceptClick = e => {
          e.preventDefault();
          this.props.onOfferAccepted(this.props.selectedOffer);
        };
        const onRejectClick = e => {
          e.preventDefault();
          this.props.onOfferRejected(this.props.selectedOffer);
        };
        return (
          <div className="table_requests_control_wr clearfix">
            <div className="table_requests_control_text">accept this request?</div>
            <div className="table_requests_control_btns">
              <a onClick={onAcceptClick}
                className="table_requests_yes table_requests_btn" href="">Yes</a>
              <a onClick={onRejectClick}
                className="table_requests_no table_requests_btn" href="">No</a>
            </div>
          </div>
        );
        }
        case TAB_OUTBOX: {
        const onClick = e => {
          e.preventDefault();
          this.props.onOfferCanceled(this.props.selectedOffer);
        };
        return (
          <div className="table_requests_control_wr clearfix">
            <div className="table_requests_control_text">Cancel this request?</div>
            <div className="table_requests_control_btns">
              <a
                onClick={onClick}
                className="table_requests_yes table_requests_btn" href="">Yes</a>
            </div>
          </div>
        );
        }
        default:
          throw new Error('invalid state');
      }
    }
  }

  getColumns() {
    return [{
      Header: SortHeader(this.state.selectedTab === TAB_INBOX ? 'From' : 'To'),
      id: 'name',
      accessor: o => this.state.selectedTab == TAB_INBOX ? o.fromUser[0].name : o.toUser[0].name,
      Cell: row => (<div className="contractor_link">@<Link className="table_col_value_a" to={'/' + row.value}>{row.value}</Link></div>),
      className: 'table_col_value'
    }, {
      id: '_id',
      Header: SortHeader('Time'),
      className: 'table_col_value',
      accessor: offer => {
        const date = new Date(offer.date);
        return this.props.time - date.getTime();
      },
      Cell: OfferCell(this.onOfferPayClick, this.state.selectedTab)
    }, {
      Header: SortHeader('Sum'),
      className: 'table_col_value',
      id: 'amount',
      accessor: offer => {
        if(offer.state === CONTRACT_STATE_INIT) {
          return formatBalance(offer.balance, offer.currency) + ' ' + offer.currency;
        } else {
          return formatBalance(offer.startBalance / 100000000, offer.currency) + ' ' + offer.currency;
        }
      },
    }];


  }

  renderContent() {
    const data = this.state.selectedTab ? this.props.offers.outgoing : this.props.offers.incoming;
    const style={height: 364};
    return (
      <div>
        <Desktop>
          <ReactTable
            style={style}
            data={data}
            columns={this.getColumns()}
            selectedItem={this.props.selectedOffer}
            onItemSelected={this.props.onOfferSelected}
            scrollBarHeight={319}
          />
        </Desktop>
        <Mobile>
          <ReactTable
            data={data}
            columns={this.getColumns()}
            selectedItem={this.props.selectedOffer}
            onItemSelected={this.props.onOfferSelected}
            minRows={5}
            showPagination={true}
            defaultPageSize={5}
            PaginationComponent={Pagination}
          />
        </Mobile>
      </div>
    );
  }

}

const SortHeader = header => (
  <div className="table_header_wrapper" style={{height: 30}}>
    <span className="table_header">{header}</span>
    <div className="sort_icon_wrapper">
      <div className="green_arrow"></div>
    </div>
  </div>
);

const OfferCell = (onPayClick, selectedTab) => {
  return rowInfo => {
    let ratio = Math.abs((1 - rowInfo.value / 86400000) * 100);
    ratio = ratio > 100 ? 3 : ratio;
    const style = {width: Math.floor(ratio) + '%'};
    const progressColor = getColorClass(ratio);
    if(rowInfo.original.state === CONTRACT_STATE_ACCEPTED) {
      if(selectedTab === TAB_INBOX) {
        return (
          <div className="request_progress_txt"><div>awaiting payment</div>
            <div className="request_progress_wr">
              <div className={classNames('request_progress', progressColor)} style={style}></div>
            </div>
          </div>
        );
      } else {
        const onClick = e => {
          e.stopPropagation();
          onPayClick(rowInfo.original);
        };
        return (
          <div onClick={onClick}
            className="pay_request_wrapper">
            <span className="pay_request_btn_txt">pay</span>
            <div className="request_progress_wr">
              <div className={classNames('request_progress', progressColor)} style={style}></div>
            </div>
          </div>
        );
      }
    } else {
      return (
        <div className="request_progress_txt"><div>{formatTime(rowInfo.value)}</div>
          <div className="request_progress_wr">
            <div className={classNames('request_progress', progressColor)} style={style}></div>
          </div>
        </div>
      );
    }
  };
};

function getColorClass(progress) {
  if(progress > 66) {
    return 'green-m';
  } else if(progress > 33) {
    return 'yellow-m';
  } else {
    return 'red-m';
  }
}



export default Offers;


function formatTime(difference){
  const left = 86400000 - difference;
  const hours = Math.floor(left / 1000 / 3600);
  const minutes = Math.floor(left / 1000 % 3600 / 60);
  return `${hours} h ${minutes} m`;
}
function formatBalance(value, name) {
  if(name === 'USDT') {
    return (value || 0).toFixed(2);
  } else {
    return (value || 0).toFixed(8);
  }
}

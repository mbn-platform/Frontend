import React from 'react';
import { Link } from 'react-router-dom';
import SegmentedControl from '../generic/SegmentedControl';
import ReactTable from '../generic/SelectableReactTable';
import './Offers.css';

class Offers extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0
    };
    this.onTabChange = this.onTabChange.bind(this);
  }

  onTabChange(index) {
    this.setState({selectedTab: index});
  }

  render() {
    return (
      <div className="requests_table table">
        <div className="table_title_wrapper clearfix">
          <div className="table_title">Request list</div>
          <SegmentedControl segments={['INBOX', 'OUTBOX']} onChange={this.onTabChange}/>
        </div>
        {this.renderContent()}
      </div>
    );
  }

  renderContent() {
    const columns = [{
      Header: 'From',
      accessor: 'from',
      className: 'table_col_value'
    }, {
      id: '_id',
      Header: 'Time',
      className: 'table_col_value',
      accessor: offer => {
        const date = new Date(offer.date);
        const current = Date.now();
        return formatTime(current - date.getTime());
      },
    }, {
      Header: 'Sum',
      className: 'table_col_value',
      accessor: 'amount'
    }];
    const data = this.state.selectedTab ? this.props.offers.outgoing : this.props.offers.incoming;
    return (
      <ReactTable
        style={{height: '352px'}}
        data={data}
        columns={columns}
        onItemSelected={() => {}}
      />
    );


    if(this.props.offers.length === 0) {
      return (<div>No pending offers</div>);
    } else {
      const offers = this.state.selectedTab ? this.props.offers.incoming : this.props.offers.outgoing;
      return (
      <ul>
        {offers.map(o => <Offer offer={o} key={o._id}
          owned={!this.state.selectedTab}
          selected={this.props.selectedOffer === o}
          onOfferSelected={this.props.onOfferSelected}
          onCancelClick={this.props.onOfferCanceled}
          onRejectClick={this.props.onOfferRejected}
          onAcceptClick={this.props.onOfferAccepted} />)}
      </ul>
      );
    }
  }

}

class Offer extends React.Component {

  constructor(props) {
    super(props);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onAcceptClick = this.onAcceptClick.bind(this);
    this.onRejectClick = this.onRejectClick.bind(this);
  }

  onCancelClick(event) {
    event.stopPropagation();
    this.props.onCancelClick(this.props.offer);
  }
  onRejectClick(event) {
    event.stopPropagation();
    this.props.onRejectClick(this.props.offer);
  }
  onAcceptClick(event) {
    event.stopPropagation();
    this.props.onAcceptClick(this.props.offer);
  }

  renderButtons() {
    if(this.props.owned) {
      return (<button onClick={this.onCancelClick}>Cancel</button>);
    } else {
      return [
        <button key="accept" onClick={this.onAcceptClick}>Accept</button>,
        <button key="reject" onClick={this.onRejectClick}>Reject</button>,
      ];
    }
  }

  render() {
    return (
      <li style={this.props.selected ? {backgroundColor: 'red'} : {}}
        onClick={() => this.props.onOfferSelected(this.props.offer)}>
        {this.props.offer.state} {this.props.offer.amount} {this.props.offer.currency}
        <Link to={this.props.offer.to}>{this.props.offer.link}</Link>
        {this.renderButtons()}
      </li>
    );
  }
}


export default Offers;


function formatTime(difference){
  const hours = Math.floor(difference / 1000 / 3600);
  const minutes = Math.floor(difference / 1000 % 3600 / 60); 
  return `${hours} h ${minutes} m`;
}

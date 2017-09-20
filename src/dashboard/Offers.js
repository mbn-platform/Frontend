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

  componentWillReceiveProps(nextProps) {
    if(!nextProps.selectedOffer) { 
      return;
    }
    if(this.props.offers.incoming.find(o => o._id === nextProps.selectedOffer._id)
      && this.state.selectedTab !== 0) {

      this.setState({selectedTab: 0});
    } else if(this.props.offers.outgoing.find(o => o._id === nextProps.selectedOffer._id) &&
              this.state.selectedTab !== 1) {
      this.setState({selectedTab: 1});
    }
  }


  onTabChange(index) {
    this.setState({selectedTab: index});
  }

  render() {
    return (
      <div className="requests_table table">
        <div className="table_title_wrapper clearfix">
          <div className="table_title">Request list</div>
          <SegmentedControl selectedIndex={this.state.selectedTab} segments={['INBOX', 'OUTBOX']} onChange={this.onTabChange}/>
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
        selectedItem={this.props.selectedOffer}
        onItemSelected={this.props.onOfferSelected}
      />
    );
  }

}



export default Offers;


function formatTime(difference){
  const hours = Math.floor(difference / 1000 / 3600);
  const minutes = Math.floor(difference / 1000 % 3600 / 60);
  return `${hours} h ${minutes} m`;
}

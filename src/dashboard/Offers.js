import React from 'react';
import { Link } from 'react-router-dom';

class Offers extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0
    };
  }

  render() {
    return (
      <div>
        <h2 style={{display: 'inline'}}>Offers</h2>
        <button onClick={() => this.setState({selectedTab: 0})}>Sent ({this.props.offers.outgoing.length})</button>
        <button onClick={() => this.setState({selectedTab: 1})}>Received ({this.props.offers.incoming.length})</button>
        {this.renderContent()}
      </div>
    );
  }

  renderContent() {
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


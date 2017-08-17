import React from 'react';
import { Link } from 'react-router-dom';

class Offers extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
      ownOffers: this.props.offers.filter(o => o.owned),
      incomingOffers: this.props.offers.filter(o => !o.owned)
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.offers !== this.props.offers) {
      this.setState({
        ownOffers: nextProps.offers.filter(o => o.owned),
        incomingOffers: nextProps.offers.filter(o => !o.owned)
      });
    }
  }

  render() {
    return (
      <div>
        <h2 style={{display: 'inline'}}>Offers</h2>
        <button onClick={() => this.setState({selectedTab: 0})}>Sent ({this.state.ownOffers.length})</button>
        <button onClick={() => this.setState({selectedTab: 1})}>Received ({this.state.incomingOffers.length})</button>
        {this.renderContent()}
      </div>
    );
  }

  renderContent() {
    if(this.props.offers.length === 0) {
      return (<div>No pending offers</div>);
    } else {
      const offers = this.state.selectedTab ? this.state.incomingOffers : this.state.ownOffers;
      return (
      <ul>
        {offers.map(o => <Offer offer={o} key={o.id}
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
    if(this.props.offer.owned) {
      return (<button onClick={this.onCancelClick}>Cancel</button>);
    } else {
      return [
        <button onClick={this.onAcceptClick}>Accept</button>,
        <button onClick={this.onRejectClick}>Reject</button>,
      ];
    }
  }






  render() {
    return (
      <li style={this.props.selected ? {backgroundColor: 'red'} : {}}
        onClick={() => this.props.onOfferSelected(this.props.offer)}>
        <Link to={this.props.offer.link}>{this.props.offer.link}</Link>
        {this.renderButtons()}
      </li>
    );
  }
}


export default Offers;


import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { acceptOffer, cancelOffer, rejectOffer } from '../actions/offers';

class Offers extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
      ownOffers: this.props.offers.filter(o => o.owned),
      incomingOffers: this.props.offers.filter(o => !o.owned)
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
            selected={this.props.selectedOffer == o}
            onOfferSelected={this.props.onOfferSelected}
            onCancelClick={this.props.onCancelClick}
            onRejectClick={this.props.onRejectClick}
            onAcceptClick={this.props.onAcceptClick} />)}
        </ul>
      );
    }
  }

}

class Offer extends React.Component {

  renderButtons() {
    if(this.props.offer.owned) {
      const {offer, onCancelClick} = this.props;
      return (<button onClick={() => onCancelClick(offer)}>Cancel</button>);
    } else {
      const {offer, onRejectClick, onAcceptClick} = this.props;
      return [
        <button onClick={() => onAcceptClick(offer)}>Accept</button>,
        <button onClick={() => onRejectClick(offer)}>Reject</button>,
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


const mapDispatchToProps = dispatch => {
  return {
    onCancelClick: offer => dispatch(cancelOffer(offer)),
    onRejectClick: offer => dispatch(rejectOffer(offer)),
    onAcceptClick: offer => dispatch(acceptOffer(offer))
  };
};

const mapStateToProps = state => {
  return {};
};

//export default connect(mapStateToProps, mapDispatchToProps)(Offers);
export default Offers;


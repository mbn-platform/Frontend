import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { acceptOffer, cancelOffer, rejectOffer } from '../actions/offers';

class Offers extends React.Component {
  render() {
    return (
      <div>
        <h2>Offers</h2>
        {this.renderContent()}
      </div>
    );
  }

  renderContent() {
    if(this.props.offers.length === 0) {
      return (<div>No pending offers</div>);
    } else {
      return (
        <ul>
          {this.props.offers.map(o => <Offer offer={o} key={o.id} 
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
      <li>
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
  return {offers: state.offers};
};

export default connect(mapStateToProps, mapDispatchToProps)(Offers);


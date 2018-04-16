import React from 'react';
import RatingBar from '../generic/RatingBar';
import Scrollbars from 'react-custom-scrollbars';

const ContractFeedback = ({contract, onContractRate}) => {
  return (
    <div className="table">
      <div className="table_title_wrapper clearfix">
        <div className="table_title center">Rate the contract</div>
      </div>
      <LeaveComment
        onContractRate={onContractRate}
        id={contract._id}
      />
    </div>
  );
};

class LeaveComment extends React.Component {

  constructor(props) {
    super(props);
    this.state = {comment: '', rate: null};
    this.onClick = this.onClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.id !== this.props.id) {
      this.setState({comment: '', rate: null});
    }
  }

  onClick(e) {
    if(this.state.rate === null) {
      alert('rate first');
      return;
    }
    if(this.state.comment.length < 10) {
      alert('comment must me at least 10 characters long');
      return;
    }
    const feedback = {
      contract: this.props.id,
      rate: this.state.rate,
      text: this.state.comment
    };
    this.props.onContractRate(feedback);
  }

  render() {
    return (
      <div className="table_content">
        <div className="rate_field_wrapper">
          <RatingBar className="rate_scale" rating={this.state.rate || 0}
            onRatingSelected={rate => this.setState({rate})}/>
          <textarea value={this.state.comment}
            onChange={e => this.setState({comment: e.target.value})}
            className="rate_field" placeholder="Type your feedback here..."/>
        </div>
        <div className="rate_button_wrapper">
          <input onClick={this.onClick} className="send_rate_btn" type="submit" value="Submit" name=""/>
        </div>
      </div>
    );
  }
}

const LeftComment = ({text, rating}) => (
  <div className="table_content clearfix">
    <div className="rate_text_wrapper">
      <Scrollbars style={{height: '105px'}}>
        <div className="rate_text">{text}</div>
      </Scrollbars>
    </div>
    <div className="rate_scale_wrapper">
      <RatingBar rating={rating} selectable={false} />
    </div>
  </div>
);

export default ContractFeedback;

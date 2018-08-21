import React from 'react';
import RatingBar from '../../components/RatingBar';
import {FormattedMessage, injectIntl} from 'react-intl';
import ModalWindow from '../../components/Modal';

const ContractFeedback = ({contract, onContractRate, intl}) => {
  return (
    <div className="table">
      <div className="table_title_wrapper clearfix">
        <div className="table_title center">
          <FormattedMessage
            id="dashboard.rateTheContract"
            defaultMessage="Rate the contract"
          />
        </div>
      </div>
      <LeaveComment
        onContractRate={onContractRate}
        id={contract._id}
        intl={intl}
      />
    </div>
  );
};

class LeaveComment extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      comment: '',
      informModalIsOpen: false,
      rate: null
    };
    this.onClick = this.onClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.id !== this.props.id) {
      this.setState({comment: '', rate: null});
    }
  }

  onClick(e) {
    if(this.state.rate === null) {
      console.warn(this.props);
      this.setState({
        informModalIsOpen: true,
        currentInformModelText: this.props.intl.messages['dashboard.rateFirst']
      });
      return;
    }
    if(this.state.comment.length < 10) {
      this.setState({
        informModalIsOpen: true,
        currentInformModelText: this.props.intl.messages['dashboard.commentMustBeOver']
      });
      return;
    }
    const feedback = {
      contract: this.props.id,
      rate: this.state.rate,
      text: this.state.comment
    };
    this.props.onContractRate(feedback);
  }

  renderInformModel = () => {
    const { informModalIsOpen, currentInformModelText } = this.state;
    return (
      <ModalWindow
        modalIsOpen={informModalIsOpen}
        onClose={() => this.setState({informModalIsOpen: false })}
        title={currentInformModelText}
        content={
          <div>
            <button className="modal__button btn" onClick={() => this.setState({informModalIsOpen: false})}>
              <FormattedMessage
                id="ok"
                defaultMessage="Ok"
              />
            </button>
          </div>
        }
      />
    );
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
        {this.renderInformModel()}
      </div>
    );
  }
}

// const LeftComment = ({text, rating}) => (
//   <div className="table_content clearfix">
//     <div className="rate_text_wrapper">
//       <Scrollbars style={{height: '105px'}}>
//         <div className="rate_text">{text}</div>
//       </Scrollbars>
//     </div>
//     <div className="rate_scale_wrapper">
//       <RatingBar rating={rating} selectable={false} />
//     </div>
//   </div>
// );

export default injectIntl(ContractFeedback);

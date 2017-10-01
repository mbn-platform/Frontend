import React from 'react';
import RatingBar from '../generic/RatingBar';
import Scrollbars from 'react-custom-scrollbars';
import './ContractFeedback.css';


const ContractFeedback = ({contract}) => {
  return (
    <div className="table">
      <div className="table_title_wrapper clearfix">
        <div className="table_title center">Rate the contract</div>
      </div>
      {contract.comment ? (<LeftComment {...contract.comment} />) : (<LeaveComment />)}
    </div>
  );
};

const LeaveComment = () => (
  <div className="table_content">
    <div className="rate_field_wrapper">
      <textarea className="rate_field" placeholder="Type your feedback here..."></textarea>
    </div>
    <div className="rate_bottom_str_wrapper clearfix">
      <div className="send_rate_btn_wr">
        <input className="send_rate_btn" type="submit" value="Submit" name=""/>
      </div>
      <div className="rate_scale_wrapper rate_scale_form">
        <RatingBar className="rate_scale"/>
      </div>
    </div>
  </div>
);

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

const text = 'When trusting a bitcoin exchange with your money, you want to ensure that the security measures are top of the line. Almost every bitcoin exchange uses two-factor authentication at the least to protect your account from hijacking, but some exchanges go above and beyond to ensure client privacy and security. Everything from advanced encryption methods to offline, unhackable ledgers, to strict hiring procedures can help make a bitcoin exchange more secure.When trusting a bitcoin exchange with your money, you want to ensure that the security measures are top of the line. Almost every bitcoin exchange uses two-factor authentication at the least to protect your account from hijacking, but some exchanges go above and beyond to ensure client privacy and security. Everything from advanced encryption methods to offline, unhackable ledgers, to strict hiring procedures can help make a bitcoin exchange more secure.When trusting a bitcoin exchange with your money, you want to ensure that the security measures are top of the line. Almost every bitcoin exchange uses two-factor authentication at the least to protect your account from hijacking, but some exchanges go above and beyond to ensure client privacy and security. Everything from advanced encryption methods to offline, unhackable ledgers, to strict hiring procedures can help make a bitcoin exchange more secure.';




export default ContractFeedback;

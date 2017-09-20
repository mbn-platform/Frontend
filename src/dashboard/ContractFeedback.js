import React from 'react';
import RatingBar from '../generic/RatingBar';
import './ContractFeedback.css';


const ContractFeedback = ({contract}) => {
  return (
    <div className="table">
      <div className="table_title_wrapper clearfix">
        <div className="table_title">Rate the contract</div>
      </div>
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
    </div>
  );
};




export default ContractFeedback;

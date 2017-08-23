import React from 'react';
import PropTypes from 'prop-types';

class ContractInfo extends React.Component {

  render() {
    if(!this.props.contract) {
      return (<div>No contract selected</div>);
    }
    return this.props.contract.finished ? (
      <ContractComment
        contract={this.props.contract}
        onCommentLeft={this.props.onCommentLeft}
      />
    ) : (
      <ContractChart contract={this.props.contract}/>
    );
  }
}

const ContractComment = contract => (
  <div>Leave comment</div>
);

const ContractChart = contract => (
  <div>
    <div>Time left to complete</div>
    <div>Profit left to complete</div>
  </div>
);

ContractInfo.propTypes = {
  contract: PropTypes.object,
  onCommentLeft: PropTypes.func.isRequired
};


export default ContractInfo;



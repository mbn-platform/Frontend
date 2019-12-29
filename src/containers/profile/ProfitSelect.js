import React from 'react';
import { Popover } from 'reactstrap';
import PropTypes from 'prop-types';

import OutsideClick from '../../components/OutsideClick';

class ProfitSelect extends React.Component {
  state = { isOpen: false }

  onItemSelect = item => () => {
    this.props.onItemSelect(item);
    this.onClose();
  }

  onClose = () => {
    this.setState({ isOpen: false });
  }

  onOpenClick = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  render = () => {
    const {
      profits,
      targetId,
      selectedProfit,
    } = this.props;
    const { isOpen } = this.state;

    return(
      <div
        id={targetId}
        onClick={this.onOpenClick}
        className="dropdown-link-wrap"
      >
        <div className="dropdown-link">
          <div>
            {`${selectedProfit.sum} ${selectedProfit.currency}`}
            <span className="arrow_down" />
          </div>
        </div>
        <Popover
          innerClassName="popover-body"
          isOpen={isOpen}
          target={targetId}
          placement="bottom-start"
          className="dropdown-popover"
        >
          <OutsideClick
            onOutsideClick={this.onClose}
          >
            <div
              className="dropdown"
            >
              <div className="dropdown__name" onClick={this.onClose}>
                <span>{`${selectedProfit.sum} ${selectedProfit.currency}`}</span>
                <span className="arrow_down" />
              </div>
              {profits.map((profit, index) => (
                <div
                  key={index}
                  onClick={this.onItemSelect(profit)}
                >
                  {`${profit.sum} ${profit.currency}`}
                </div>
              ))}
            </div>
          </OutsideClick>
        </Popover>
      </div>
    );
  }
}

ProfitSelect.propTypes = {
  selectedProfit: PropTypes.shape().isRequired,
  targetId: PropTypes.string.isRequired,
  onItemSelect: PropTypes.func.isRequired,
};

export default ProfitSelect;

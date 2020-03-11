import React from 'react';
import { Popover } from 'reactstrap';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import OutsideClick from './OutsideClick';

class GroupSelect extends React.PureComponent {
  state = { isOpen: false }

  onItemSelect = groupId => () => {
    this.setState({ isOpen: false });
    this.props.onItemSelect(groupId);
  }

  onClose = () => {
    this.setState({ isOpen: false });
  }

  onOpenClick = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  render = () => {
    const {
      selectedGroup,
      targetId,
      elementClassName,
      dropdownClassName,
      className,
      switcherClassName,
      assetGroups,
    } = this.props;
    const { isOpen } = this.state;

    return(
      <div
        id={targetId}
        onClick={this.onOpenClick}
        className={classNames('dropdown-link-wrap', switcherClassName)}
      >
        <div className="dropdown-link">
          <div>
            {selectedGroup.name}
            <span className="arrow_down" />
          </div>
        </div>
        <Popover
          innerClassName="popover-body"
          isOpen={isOpen}
          target={targetId}
          placement="bottom-start"
          className={classNames('dropdown-popover', className)}
        >
          <OutsideClick
            onOutsideClick={this.onClose}
          >
            <div
              className={classNames('dropdown', dropdownClassName)}
            >
              <div className="dropdown__name" onClick={this.onClose}>
                <span>{selectedGroup.name}</span>
                <span className="arrow_down" />
              </div>
              {assetGroups.map(group => (
                <div
                  key={group._id}
                  onClick={this.onItemSelect(group._id)}
                  className={classNames(elementClassName, {
                    active: group._id === selectedGroup._id
                  })}
                >
                  {group.name}
                </div>
              ))}
            </div>
          </OutsideClick>
        </Popover>
      </div>
    );
  }
}

GroupSelect.defaultProps = {
  className: '',
  elementClassName: '',
  dropdownClassName: '',
  switcherClassName: '',
};

GroupSelect.propTypes = {
  className: PropTypes.string,
  elementClassName: PropTypes.string,
  dropdownClassName: PropTypes.string,
  switcherClassName: PropTypes.string,
  selectedGroup: PropTypes.shape().isRequired,
  targetId: PropTypes.string.isRequired,
  onItemSelect: PropTypes.func.isRequired,
};

export default GroupSelect;

import React from 'react';
import { Popover } from 'reactstrap';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import OutsideClick from './OutsideClick';

class DropdownSelect extends React.Component {

  state = {
    filter: '',
    isOpen: false,
  }

  onItemSelect = (e, item) => {
    this.setState({isOpen: false});
    this.props.onItemSelect(item);
  }

  close = () => {
    this.setState({isOpen: false, filter: ''});
  }

  onKeyDown = (e) => {
    const char = String.fromCharCode(e.keyCode);
    if (/[a-zA-Z0-9-_ ]/.test(char)) {
      this.setState({filter: this.state.filter + char});
    } else if (e.keyCode === 8) {
      this.setState({filter: this.state.filter.substring(0, this.state.filter.length - 1)});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(!prevState.isOpen && this.state.isOpen && this.props.filterable) {
      document.addEventListener('keydown', this.onKeyDown);
    }
    if(prevState.isOpen && !this.state.isOpen && this.props.filterable) {
      document.removeEventListener('keydown', this.onKeyDown);
    }
  }


  onOpenClick = () => {
    this.setState({isOpen: !this.state.isOpen, filter: ''});
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  render() {
    const {
      selected,
      targetId,
      elementClassName,
      dropdownClassName,
      className,
      switcherClassName,
    } = this.props;
    const { isOpen } = this.state;
    let items = this.props.items;
    let { filter } = this.state;
    if (filter) {
      filter = filter.toUpperCase();
      items = items.filter((item) => item.toUpperCase().includes(filter));
    }
    let header = this.props.header;
    if (filter) {
      header = filter;
    } else {
      header = selected ? selected : header;
    }
    return(
      <div onClick={this.onOpenClick} id={targetId}
        className={classNames('dropdown-link-wrap', switcherClassName)}>
        <div className="dropdown-link">
          <div>{this.props.selected ? this.props.selected : this.props.header} <span className="arrow_down"/></div>
        </div>
        <Popover
          innerClassName="popover-body"
          isOpen={isOpen}
          target={targetId}
          placement="bottom-start"
          className={classNames('dropdown-popover', className)}
        >
          <OutsideClick
            onOutsideClick={this.close}
          >
            <div
              className={classNames('dropdown', dropdownClassName)}
            >
              <div className="dropdown__name" onClick={this.close}>
                <span>{header}</span><span className="arrow_down"/>
              </div>
              {items.map(item => (
                <div
                  key={item}
                  onClick={e => this.onItemSelect(e, item)}
                  className={classNames(elementClassName, {active: item === selected})}
                >
                  {item}
                </div>
              ))}
            </div>
          </OutsideClick>
        </Popover>
      </div>
    );
  }
}

DropdownSelect.propTypes = {
  selected: PropTypes.string.isRequired,
  targetId: PropTypes.string.isRequired,
  onItemSelect: PropTypes.func.isRequired,
  filterable: PropTypes.bool,
  elementClassName: PropTypes.string,
  dropdownClassName: PropTypes.string,
  className: PropTypes.string,
  switcherClassName: PropTypes.string,
};

DropdownSelect.defaultProps = {
  filterable: false,
};



export default DropdownSelect;



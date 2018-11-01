import React from 'react';
import { Popover } from 'reactstrap';
import classNames from 'classnames';

class DropdownSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {selected: this.props.selected};
    this.onItemSelect = this.onItemSelect.bind(this);
    this.onOutsideClick = this.onOutsideClick.bind(this);
  }

  onOutsideClick() {
    this.setState({isOpen: false});
  }

  componentDidUpdate(prevProps, prevState) {
    if(!prevState.isOpen && this.state.isOpen) {
      document.addEventListener('click', this.onOutsideClick);
    }
    if(prevState.isOpen && !this.state.isOpen) {
      document.removeEventListener('click', this.onOutsideClick);
    }
  }

  onItemSelect(e, item) {
    this.setState({isOpen: false});
    this.props.onItemSelect(item);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onOutsideClick);
  }

  render() {
    const {
      selected,
      items,
      header,
      targetId,
      elementClassName,
      dropdownClassName,
      switcherClassName=''
    } = this.props;
    const { isOpen } = this.state;
    return(
      <div onClick={() => this.setState({isOpen: !this.state.isOpen})} id={targetId}
        className={classNames('dropdown-link-wrap', switcherClassName)}>
        <div className="dropdown-link">
          <div>{this.props.selected ? this.props.selected : this.props.header} <span className="arrow_down"/></div>
        </div>
        <Popover
          onClick={this.onOutsideClick}
          innerClassName="popover-body"
          isOpen={isOpen}
          target={targetId}
          placement="bottom-start"
          className="dropdown-popover"
        >
          <div
            onClick={e => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
            className={classNames('dropdown', dropdownClassName)}>
            <div className="dropdown__name" onClick={this.onOutsideClick}>
              <span>{selected ? selected : header}</span><span className="arrow_down"/>
            </div>
            {items.map(item => (
              <div
                key={item}
                onClick={e => this.onItemSelect(e, item)}
                className={classNames(elementClassName, {active: item === selected})}
              >{item}</div>
            ))}
          </div>
        </Popover>
      </div>
    );
  }
}

export default DropdownSelect;


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
    return(
      <div onClick={() => this.setState({isOpen: !this.state.isOpen})} id={this.props.targetId} className="dropdown-link-wrap">
        <div className="dropdown-link">
          <span>{this.props.selected ? this.props.selected : this.props.header} <span className="arrow_down"/></span>
        </div>
        <Popover
          onClick={() => this.setState({isOpen: false})}
          innerClassName="popover-body"
          isOpen={this.state.isOpen}
          target={this.props.targetId}
          placement="bottom-start"
          className="dropdown-popover"
        >
          <div
            onClick={e => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
            className={classNames('dropdown', this.props.dropdownClassName)}>
            <div className="dropdown__name">
              <span>{this.props.selected ? this.props.selected : this.props.header}</span><span class="arrow_down"></span>
            </div>
            {this.props.items.map(item => (
              <div
                key="item"
                onClick={e => this.onItemSelect(e, item)}
                className={classNames(this.props.elementClassName, {active: item === this.props.selected})}
              >{item}</div>
            ))}
          </div>
        </Popover>
      </div>
    );
  }
}

export default DropdownSelect;


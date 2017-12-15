import React from 'react';
import { Popover } from 'reactstrap';
import classNames from 'classnames';

class ApiKeySelect extends React.Component {


  constructor(props) {
    super(props);
    this.state = {isOpen: false};
    this.onKeySelect = this.onKeySelect.bind(this);
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

  componentWillUnmount() {
    document.removeEventListener('click', this.onOutsideClick);
  }

  onKeySelect(e, key) {
    e.stopPropagation();
    this.setState({isOpen: false});
    this.props.onApiKeySelect(key);
  }

  render() {
    return (
      <div onClick={() => this.setState({isOpen: !this.state.isOpen})} id="popover1" className="dropdown-link-wrap">
        {this.renderSelectedApiKey()}
        <Popover
          onClick={() => this.setState({isOpen: false})}
          className="dropdown-popover"
          container={this.props.container}
          placement="bottom-start"
          target="popover1"
          isOpen={this.state.isOpen}
          innerClassName="popover-body"
        >
          <div
            onClick={e => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
            className="dropdown keys">
            <div className="dropdown__name">
              <span>API KEY</span><span className="arrow_down"></span>
            </div>
            {this.props.keys.slice(0, 5).map(key => (
              <div
                key={key._id}
                onClick={e => this.onKeySelect(e, key)}
                className={classNames('key', {active: this.props.selectedKey && this.props.selectedKey._id === key._id})}>
                {key.name}
              </div>
            ))}
          </div>
        </Popover>
      </div>
    );
  }

  renderSelectedApiKey() {
    return (
      <span className="dropdown-link">
        API KEY{this.props.selectedKey ? ': ' + this.props.selectedKey.name + ' ' : ' '}<span className="arrow_down"/>
      </span>
    );
  }
}

export default ApiKeySelect;

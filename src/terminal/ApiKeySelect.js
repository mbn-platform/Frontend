import React from 'react';
import { Popover } from 'reactstrap';
import classNames from 'classnames';

class ApiKeySelect extends React.Component {


  constructor(props) {
    super(props);
    this.state = {isOpen: false};
    this.onKeySelect = this.onKeySelect.bind(this);
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
          <div className="dropdown keys">
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

import React from 'react';
import { Popover } from 'reactstrap';
import classNames from 'classnames';

class ApiKeySelect extends React.Component {


  constructor(props) {
    super(props);
    this.state = {isOpen: false, selectedKey: null};
    this.onKeySelect = this.onKeySelect.bind(this);
  }

  onKeySelect(e, key) {
    this.setState({selectedKey: key, isOpen: false});
    //this.props.onKeySelected(key._id);
  }

  render() {
    return (
      <div onClick={() => this.setState({isOpen: !this.state.isOpen})} id="popover1" className="dropdown-link-wrap">
        {this.renderSelectedApiKey()}
        <Popover
          onClick={this.onKeySelect}
          className="dropdown-popover"
          container=".terminal.container-fluid"
          placement="bottom-start"
          target="popover1"
          isOpen={this.state.isOpen}
          innerClassName="popover-body"
        >
          <div className="dropdown keys">
            <div class="dropdown__name">
              <span>API KEY</span><span class="arrow_down"></span>
            </div>
            {this.props.keys.map(key => (
              <div
                key={key._id}
                onClick={e => this.onKeySelect(e, key)}
                className={classNames('key', {active: this.state.selectedKey && this.state.selectedKey._id === key._id})}>
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
        API KEY{this.state.selectedKey ? ': ' + this.state.selectedKey.name + ' ' : ' '}<span className="arrow_down"/>
      </span>
    );
  }
}

export default ApiKeySelect;

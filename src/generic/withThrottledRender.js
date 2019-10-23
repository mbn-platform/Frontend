import React from 'react';
import throttle from 'lodash/throttle';

const withThrottledRender = (ComponentToThrottle, ...args) => {
  class ThrottledContainer extends React.Component {
    updateThrottled = throttle(this.forceUpdate, ...args);

    shouldComponentUpdate = () => {
      this.updateThrottled();
      return false;
    }

    componentWillUnmount = () => {
      this.updateThrottled.cancel();
    }

    render = () => <ComponentToThrottle {...this.props} />;
  }

  return ThrottledContainer;
};

export default withThrottledRender;

import {Component} from 'react';
import PropTypes from 'prop-types';

export const querySchema = {
  sm: '(max-width: 1023px)',
  lg: '(min-width: 1024px)',
};

export const ordersSchema = {
  mobileXXs: '(max-width: 389.98px)',
  mobileXs: '(max-width: 464.98px)',
  mobileSm: '(max-width: 519.98px)',
  mobileMd: '(max-width: 629.98px)',
  mobileLg: '(max-width: 1027.98px)',
  sm: '(max-width: 1100px)',
  md: '(max-width: 1399.98px)',
  lg: '(min-width: 1400px)',
};

export const ratingSchema = {
  xs: '(max-width: 1199.98px)',
  sm: '(max-width: 1349.98px)',
  md: '(max-width: 1699.98px)',
  lg: '(min-width: 1700px)',
};


function unwrapQueries(sizes) {
  const mq = [];

  for (const [size, query] of Object.entries(sizes)) {
    mq.push({
      size,
      query,
    });
  }

  return mq;
}

function getMatchedSize(queries) {
  for (const {size, query} of queries) {
    if (window.matchMedia(query).matches) {
      return size;
    }
  }
}

export default function createMediaQueryProvider(queryObject) {
  let subscriptions = [];
  const queries = unwrapQueries(queryObject);
  let currentSize = getMatchedSize(queries);

  class MqProvider extends Component {

    componentDidMount() {
      this.onResize();

      window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.onResize);
    }

    onResize = () => {
      const size = getMatchedSize(queries);

      if (size === currentSize) {
        return;
      }

      for (const sub of subscriptions) {
        sub(size, currentSize);
      }

      currentSize = size;
    }

    render() {
      return this.props.children || null;
    }
  }

  class MqConsumer extends Component {
    static propTypes = {
      on: PropTypes.func.isRequired,
    };

    state = {
      size: currentSize,
    }

    componentDidMount() {
      subscriptions = [...subscriptions, this.redraw];
    }

    componentWillUnmount() {
      subscriptions = subscriptions.filter((sub) => sub !== this.redraw);
    }

    redraw = (newSize) => {
      this.setState({size: newSize});
    }

    render() {
      return this.props.on(this.state.size);
    }
  }

  return {
    MediaQuery: MqProvider,
    Screen: MqConsumer,
  };
}

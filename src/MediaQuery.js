import {Component} from 'react';
import PropTypes from 'prop-types';

export const querySchema = {
  sm: '(max-width: 1023px)',
  lg: '(min-width: 1024px)',
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
      currentSize = getMatchedSize(queries);

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

      console.warn(subscriptions);

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
      console.warn(newSize);
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

export const { Screen } = createMediaQueryProvider(querySchema);
export const { MediaQuery } = createMediaQueryProvider(querySchema);


import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StringContent from '../components/string-content';
import { withRedis } from '../contexts/redis-context';

class StringContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    redis: PropTypes.object.isRequired
  };

  state = {
    value: ''
  };

  save = value => {
    const { keyName, redis } = this.props;

    return redis.set(keyName, value);
  };

  async componentDidMount() {
    // TODO show loader
    const { keyName, redis } = this.props;
    const value = await redis.get(keyName);

    this.setState({ value });
  }

  render() {
    return (
      <StringContent
        keyName={this.props.keyName}
        value={this.state.value}
        save={this.save}
      />
    );
  }
}

export default withRedis(StringContentContainer);

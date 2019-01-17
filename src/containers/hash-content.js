import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRedis } from '../contexts/redis-context';
import HashContent from '../components/hash-content';
import theme from '../theme';

class HashContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    redis: PropTypes.object.isRequired
  };

  state = { value: {} };

  async componentDidMount() {
    const { redis, keyName } = this.props;
    const value = await redis.hgetall(keyName);

    this.setState({ value });
  }

  render() {
    return (
      <HashContent
        keyName={this.props.keyName}
        value={this.state.value}
        theme={theme}
      />
    );
  }
}

export default withRedis(HashContentContainer);

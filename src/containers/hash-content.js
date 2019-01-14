import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRedis } from '../contexts/redis-context';

const HashContent = ({ value }) => <text content={JSON.stringify(value)}></text>;

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
      <HashContent value={this.state.value} />
    );
  }
}

export default withRedis(HashContentContainer);

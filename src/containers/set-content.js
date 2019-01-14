import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRedis } from '../contexts/redis-context';

const SetContent = ({ value }) => <text content={JSON.stringify(value)}></text>;

class SetContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    redis: PropTypes.object.isRequired
  };

  state = { value: [] };

  async componentDidMount() {
    const { redis, keyName } = this.props;
    const value = await redis.smembers(keyName);

    this.setState({ value });
  }

  render() {
    return (
      <SetContent value={this.state.value} />
    );
  }
}

export default withRedis(SetContentContainer);


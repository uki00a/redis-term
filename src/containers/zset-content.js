import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRedis } from '../contexts/redis-context';

const ZsetContent = ({ value }) => <text content={JSON.stringify(value)}></text>;

class ZsetContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    redis: PropTypes.object.isRequired
  };

  state = { value: [] };

  async componentDidMount() {
    const { redis, keyName } = this.props;
    const value =  await redis.zrange(keyName, 0, -1);

    this.setState({ value });
  }

  render() {
    return (
      <ZsetContent value={this.state.value} />
    );
  }
}

export default withRedis(ZsetContentContainer);

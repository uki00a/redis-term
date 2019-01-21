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

  _addRow = async ({ key, value }) => {
    const { redis, keyName } = this.props;

    await redis.hset(keyName, key, value);
    this.setState({
      value: {
        ...this.state.value,
        [key]: value
      }
    });
  };

  _loadHash = async () => {
    const { redis, keyName } = this.props;
    const value = await redis.hgetall(keyName);

    this.setState({ value });
  };

  componentDidMount() {
    this._loadHash();
  }

  render() {
    return (
      <HashContent
        keyName={this.props.keyName}
        value={this.state.value}
        theme={theme}
        addRow={this._addRow}
        reload={this._loadHash}
      />
    );
  }
}

export default withRedis(HashContentContainer);

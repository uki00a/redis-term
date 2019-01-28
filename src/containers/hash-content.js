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
    this._updateField(key, value);
  };

  _loadHash = async () => {
    const { redis, keyName } = this.props;
    const value = await redis.hgetall(keyName);

    this.setState({ value });
  };

  _saveField = async (field, newValue) => {
    const { redis, keyName } = this.props;

    await redis.hset(keyName, field, newValue);
    this._updateField(field, newValue);
  };

  _updateField(field, value) {
    const newHash = {
      ...this.state.value,
      [field]: value
    };

    this.setState({ value: newHash });
  }

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
        saveField={this._saveField}
        reload={this._loadHash}
      />
    );
  }
}

export default withRedis(HashContentContainer);

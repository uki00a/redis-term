import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRedis } from '../contexts/redis-context';
import SetContent from '../components/set-content';
import theme from '../theme';

class SetContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    redis: PropTypes.object.isRequired
  };

  state = { value: [] };

  async componentDidMount() {
    this._loadSet();
  }

  _addRow = async value => {
    if (!value) {
      return;
    }

    const { keyName, redis } = this.props;

    await redis.sadd(keyName, value);
    this.setState({
      value: [value].concat(this.state.value)
    });
  };

  _loadSet = async () => {
    const { redis, keyName } = this.props;
    const value = await redis.smembers(keyName);

    this.setState({ value });
  };

  _saveElement = async (oldValue, newValue) => {
    const { redis, keyName } = this.props;
    const newValueExists = await redis.sismember(keyName, newValue);

    if (newValueExists) {
      return;
    }

    await redis
      .multi()
      .srem(keyName, oldValue)
      .sadd(keyName, newValue)
      .exec();

    const oldValueIndex = this.state.value.indexOf(oldValue);
    const newMembers = this.state.value.map((x, index) => index === oldValueIndex
        ? newValue
        : x
    );

    this.setState({ value: newMembers });
  };

  render() {
    return (
      <SetContent
        keyName={this.props.keyName}
        value={this.state.value}
        theme={theme}
        addRow={this._addRow}
        reload={this._loadSet}
        saveElement={this._saveElement}
      />
    );
  }
}

export default withRedis(SetContentContainer);


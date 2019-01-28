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

  state = { members: [] };

  async componentDidMount() {
    this._loadSet();
  }

  _addMember = newMember => {
    const newMembers = [newMember].concat(this.state.members);

    this.setState({ members: newMembers });
  };

  _addRow = async newMember => {
    if (!newMember) {
      return;
    }

    const { keyName, redis } = this.props;

    await redis.sadd(keyName, newMember);
    this._addMember(newMember);
  };

  _loadSet = async () => {
    const { redis, keyName } = this.props;
    const members = await redis.smembers(keyName);

    this.setState({ members });
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

    const oldValueIndex = this.state.members.indexOf(oldValue);
    const newMembers = this.state.members.map((x, index) => index === oldValueIndex
        ? newValue
        : x
    );

    this.setState({ members: newMembers });
  };

  render() {
    return (
      <SetContent
        keyName={this.props.keyName}
        members={this.state.members}
        theme={theme}
        addRow={this._addRow}
        reload={this._loadSet}
        saveElement={this._saveElement}
      />
    );
  }
}

export default withRedis(SetContentContainer);


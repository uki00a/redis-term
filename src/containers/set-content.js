import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRedis } from '../contexts/redis-context';
import SetContent from '../components/set-content';

class SetContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    redis: PropTypes.object.isRequired
  };

  state = { members: [] };

  _addMember = async newMember => {
    if (!newMember) {
      return;
    }

    await this._addMemberToDb(newMember);
    this._addMemberToState(newMember);
  };

  async _addMemberToDb(newMember) {
    const { keyName, redis } = this.props;

    await redis.sadd(keyName, newMember);
  }

  _addMemberToState = newMember => {
    const newMembers = [newMember].concat(this.state.members);

    this.setState({ members: newMembers });
  };

  _loadSet = async () => {
    const { redis, keyName } = this.props;
    const members = await redis.smembers(keyName);

    this.setState({ members });
  };

  _saveElement = async (oldValue, newValue) => {
    if (await this._checkIfValueExistsInDb(newValue)) {
      return;
    }

    await this._applyChangesToDb(oldValue, newValue);
    this._applyChangesToState(oldValue, newValue);
  };

  async _checkIfValueExistsInDb(value) {
    const { redis, keyName } = this.props;
    return await redis.sismember(keyName, value);
  }

  async _applyChangesToDb(oldValue, newValue) {
    const { redis, keyName } = this.props;

    await redis
      .multi()
      .srem(keyName, oldValue)
      .sadd(keyName, newValue)
      .exec();
  }

  _applyChangesToState(oldValue, newValue) {
    const oldValueIndex = this.state.members.indexOf(oldValue);
    const newMembers = this._updateMemberAt(oldValueIndex, newValue);

    this.setState({ members: newMembers });
  }

  _updateMemberAt(index, newValue) {
    const newMembers = this.state.members.slice(0);
    newMembers[index] = newValue;
    return newMembers;
  }

  async componentDidMount() {
    this._loadSet();
  }

  render() {
    return (
      <SetContent
        keyName={this.props.keyName}
        members={this.state.members}
        addRow={this._addMember}
        reload={this._loadSet}
        saveElement={this._saveElement}
      />
    );
  }
}

export default withRedis(SetContentContainer);


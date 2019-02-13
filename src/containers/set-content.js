import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRedis } from '../contexts/redis-context';
import SetContent from '../components/set-content';
import Loader from '../components/loader';

class SetContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    redis: PropTypes.object.isRequired
  };

  state = { members: [], isLoading: false, lastPattern: '' };

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

  _saveMember = async (oldValue, newValue) => {
    if (await this._checkIfValueExistsInDb(newValue)) {
      return;
    }

    await this._saveChangesToDb(oldValue, newValue);
    this._saveChangesToState(oldValue, newValue);
  };

  async _checkIfValueExistsInDb(value) {
    const { redis, keyName } = this.props;
    return await redis.sismember(keyName, value);
  }

  async _saveChangesToDb(oldValue, newValue) {
    const { redis, keyName } = this.props;

    await redis
      .multi()
      .srem(keyName, oldValue)
      .sadd(keyName, newValue)
      .exec();
  }

  _saveChangesToState(oldValue, newValue) {
    const oldValueIndex = this.state.members.indexOf(oldValue);
    const newMembers = this._updateMemberAt(oldValueIndex, newValue);

    this.setState({ members: newMembers });
  }

  _updateMemberAt(index, newValue) {
    const newMembers = this.state.members.slice(0);
    newMembers[index] = newValue;
    return newMembers;
  }

  _removeMember = async memberToRemove => {
    await this._deleteMemberFromDb(memberToRemove); 
    this._removeMemberFromState(memberToRemove);
  };

  async _deleteMemberFromDb(memberToDelete) {
    const { redis, keyName } = this.props;
    await redis.srem(keyName, memberToDelete);
  }

  _removeMemberFromState(memberToRemove) {
    const index = this.state.members.indexOf(memberToRemove);
    const newMembers = this.state.members.slice(0);
    newMembers.splice(index, 1);
    this.setState({ members: newMembers });
  }

  async _scanMembersStartWith(pattern) {
    const { redis, keyName } = this.props;
    const cursor = 0;
    const count = 1000;
    const [newCursor, members] = await redis.sscan(
      keyName,
      cursor,
      'MATCH',
      pattern.endsWith('*') ? pattern : `${pattern}*`,
      'COUNT',
      count
    );
    return members;
  }

  _filterMembers = pattern => this._withLoader(async () => {
    const members = await this._scanMembersStartWith(pattern);  
    this.setState({ members, lastPattern: pattern });
  });

  _loadSet = () => this._withLoader(async () => {
    const members = await this._scanMembersStartWith('*');
    this.setState({ members });
  });

  async _withLoader(func) {
    this._showLoader();
    await func();
    this._hideLoader();
  }

  _showLoader() {
    this.setState({ isLoading: true });
  }

  _hideLoader() {
    this.setState({ isLoading: false });
  }

  async componentDidMount() {
    this._loadSet();
  }

  render() {
    if (this.state.isLoading) {
      return <Loader />;
    } else {
      return (
        <SetContent
          keyName={this.props.keyName}
          members={this.state.members}
          addRow={this._addMember}
          reload={this._loadSet}
          filterMembers={this._filterMembers}
          saveMember={this._saveMember}
          removeRow={this._removeMember}
          lastPattern={this.state.lastPattern}
        />
      );
    }
  }
}

export default withRedis(SetContentContainer);


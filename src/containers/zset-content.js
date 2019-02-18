import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRedis } from '../contexts/redis-context';
import ZsetContent from '../components/zset-content';
import Loader from '../components/loader';
import { partitionByParity } from '../modules/utils';

class ZsetContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    redis: PropTypes.object.isRequired
  };

  state = {
    members: [],
    scores: [],
    isLoading: false,
    lastPattern: ''
  };

  _saveMember = async (oldValue, newValue, newScore) => {
    await this._saveChangesToDb(oldValue, newValue, newScore);
    this._saveChangesToState(oldValue, newValue, newScore);
  };

  _addMember = async (score, value) => {
    await this._addMemberToDb(score, value);     
    this._addMemberToState(score, value);
  };

  _removeMember = async memberToRemove => {
    await this._deleteMemberFromDb(memberToRemove);
    this._removeMemberFromState(memberToRemove);
  };

  async _addMemberToDb(score, value) {
    const { redis, keyName } = this.props;
    await redis.zadd(keyName, score, value);
  }

  // TODO refactor
  _addMemberToState(score, value) {
    const index = this.state.members.indexOf(value);
    if (index !== -1) {
      const newScores = this._updateScoreAt(index, score);
      this.setState({ scores: newScores });
    } else {
      const newMembers = [value].concat(this.state.members);
      const newScores = [score].concat(this.state.scores);
      this.setState({ members: newMembers, scores: newScores });
    }
  }

  async _saveChangesToDb(oldValue, newValue, newScore) {
    const { redis, keyName } = this.props;

    await redis.multi()
      .zrem(keyName, oldValue)
      .zadd(keyName, newScore, newValue)
      .exec();
  }

  _saveChangesToState(oldValue, newValue, newScore) {
    const oldValueIndex = this.state.members.indexOf(oldValue);
    const newMembers = this._updateMemberAt(oldValueIndex, newValue);
    const newScores = this._updateScoreAt(oldValueIndex, newScore);
    this.setState({ members: newMembers, scores: newScores });
  }

  async _deleteMemberFromDb(memberToDelete) {
    const { redis, keyName } = this.props;
    await redis.zrem(keyName, memberToDelete);
  }

  _removeMemberFromState(memberToRemove) {
    const index = this.state.members.indexOf(memberToRemove);
    const newMembers = this._removeMemberAt(index);
    const newScores = this._removeScoreAt(index);
    this.setState({ members: newMembers, scores: newScores });
  }

  _updateMemberAt(index, newValue) {
    const members = this.state.members.slice(0);
    members[index] = newValue;
    return members;
  }

  _updateScoreAt(index, newScore) {
    const scores = this.state.scores.slice(0);
    scores[index] = newScore;
    return scores;
  }

  _removeMemberAt(index) {
    const members = this.state.members.slice(0);
    members.splice(index, 1);
    return members;
  }

  _removeScoreAt(index) {
    const scores = this.state.scores.slice(0);
    scores.splice(index, 1);
    return scores;
  }

  _loadZset = () => this._filterMembers();

  _filterMembers = async (pattern = '') => {
    this._showLoader();
    try {
      const [members, scores] = await this._scanMembersStartWith(pattern);
      this.setState({
        members,
        scores,
        lastPattern: pattern
      });
    } finally {
      this._hideLoader();
    }
  };

  async _scanMembersStartWith(pattern) {
    const { redis, keyName } = this.props;
    const cursor = 0;
    const count = 1000;
    const [newCursor, values] = await redis.zscan(
      keyName,
      cursor,
      'MATCH',
      pattern.endsWith('*') ? pattern : `${pattern}*`,
      'COUNT',
      count
    );
    return partitionByParity(values);
  }

  _showLoader() {
    this.setState({ isLoading: true });
  }

  _hideLoader() {
    this.setState({ isLoading: false });
  }

  async componentDidMount() {
    this._loadZset();
  }

  render() {
    if (this.state.isLoading) {
      return <Loader />;
    } else {
      return (
        <ZsetContent
          keyName={this.props.keyName}
          members={this.state.members}
          scores={this.state.scores}
          reload={this._loadZset}
          filterMembers={this._filterMembers}
          addRow={this._addMember}
          removeRow={this._removeMember}
          saveMember={this._saveMember}
          lastPattern={this.state.lastPattern}
        />
      );
    }
  }
}

export default withRedis(ZsetContentContainer);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRedis } from '../contexts/redis-context';
import ZsetContent from '../components/zset-content';
import Loader from '../components/loader';

class ZsetContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    redis: PropTypes.object.isRequired
  };

  state = {
    members: [],
    scores: [],
    isLoading: false
  };

  _saveMember = async (oldValue, newValue, newScore) => {
    await this._saveChangesToDb(oldValue, newValue, newScore);
    this._saveChangesToState(oldValue, newValue, newScore);
  };

  _addMember = async (score, value) => {
    await this._addMemberToDb(score, value);     
    this._addMemberToState(score, value);
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

  _loadZset = async () => {
    this._showLoader();

    const { redis, keyName } = this.props;
    const values =  await redis.zrange(keyName, 0, -1, 'WITHSCORES');
    const isEven = x => (x % 2) === 0;

    this.setState({
      members: values.filter((_, index) => isEven(index)),
      scores: values.filter((_, index) => !isEven(index))
    });
    this._hideLoader();
  };

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
          addRow={this._addMember}
          saveMember={this._saveMember}
        />
      );
    }
  }
}

export default withRedis(ZsetContentContainer);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRedis } from '../contexts/redis-context';
import ZsetContent from '../components/zset-content';
import theme from '../theme';

class ZsetContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    redis: PropTypes.object.isRequired
  };

  state = {
    members: [],
    scores: []
  };

  // TODO refactor
  _saveMember = async (oldValue, newValue, newScore) => {
    const { redis, keyName } = this.props;

    await redis.multi()
      .zrem(keyName, oldValue)
      .zadd(keyName, newScore, newValue)
      .exec();

    const oldValueIndex = this.state.members.indexOf(oldValue);
    const newMembers = this.state.members.map((x, index) => index === oldValue
      ? newValue
      : x
    );
    const newScores = this.state.scores.map((x, index) => index === oldValue
      ? newScore
      : x
    );
    this.setState({ members: newMembers, scores: newScores });
  };

  _loadZset = async () => {
    const { redis, keyName } = this.props;
    const values =  await redis.zrange(keyName, 0, -1, 'WITHSCORES');
    const isEven = x => (x % 2) === 0;

    this.setState({
      members: values.filter((_, index) => isEven(index)),
      scores: values.filter((_, index) => !isEven(index))
    });
  };

  async componentDidMount() {
    this._loadZset();
  }

  render() {
    return (
      <ZsetContent
        keyName={this.props.keyName}
        members={this.state.members}
        scores={this.state.scores}
        theme={theme}
        reload={this._loadZset}
        saveMember={this._saveMember}
      />
    );
  }
}

export default withRedis(ZsetContentContainer);

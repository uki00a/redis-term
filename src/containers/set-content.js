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

  _loadSet = async () => {
    const { redis, keyName } = this.props;
    const value = await redis.smembers(keyName);

    this.setState({ value });
  };

  render() {
    return (
      <SetContent
        keyName={this.props.keyName}
        value={this.state.value}
        theme={theme}
        reload={this._loadSet}
      />
    );
  }
}

export default withRedis(SetContentContainer);


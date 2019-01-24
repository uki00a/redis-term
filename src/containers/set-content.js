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

  render() {
    return (
      <SetContent
        keyName={this.props.keyName}
        value={this.state.value}
        theme={theme}
        addRow={this._addRow}
        reload={this._loadSet}
      />
    );
  }
}

export default withRedis(SetContentContainer);


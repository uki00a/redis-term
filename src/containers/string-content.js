import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StringContent from '../components/string-content';
import { withRedis } from '../contexts/redis-context';

class StringContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    redis: PropTypes.object.isRequired
  };

  state = {
    value: ''
  };

  _save = value => {
    const { keyName, redis } = this.props;

    return redis.set(keyName, value);
  };

  _loadString = async () => {
    // TODO show loader
    const { keyName, redis } = this.props;
    const value = await redis.get(keyName);

    this.setState({ value });
  };

  componentDidMount() {
    this._loadString();
  }

  render() {
    return (
      <StringContent
        keyName={this.props.keyName}
        value={this.state.value}
        save={this._save}
        reload={this._loadString}
      />
    );
  }
}

export default withRedis(StringContentContainer);

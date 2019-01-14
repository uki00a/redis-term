import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRedis } from '../contexts/redis-context';
import KeyList from '../components/key-list';
import KeyContent from '../containers/key-content';
import theme from '../theme';

class Database extends Component {
  static propTypes = {
    redis: PropTypes.object.isRequired
  };

  state = {
    keys: [],
    keyContent: {}
  };

  onKeySelected = async (item, keyIndex) => {
    const key = this.state.keys[keyIndex];
    const [type, value] = await this._getTypeAndValue(key);

    this.setState({
      keyContent: {
        key,
        type,
        value
      }
    });
  };

  async _getTypeAndValue(key) {
    const { redis } = this.props;
    const type = await redis.type(key);
    const value = await this._getValueByKeyAndType(key, type);

    return [type, value];
  }

  // FIXME
  async _getValueByKeyAndType(key, type) {
    const { redis } = this.props;
    switch (type) {
    case 'hash':
      return await redis.hgetall(key);
    case 'string':
      return await redis.get(key);
    case 'list':
      return await redis.lrange(key, 0, -1); 
    case 'set': 
      return await redis.smembers(key);
    case 'zset':
      return await redis.zrange(key, 0, -1);
    default:
      throw new Error('not implemented');
    }
  }

  _scanKeys({
    cursor = 0,
    pattern = '*',
    count = 100
  } = {}) {
    const { redis } = this.props;

    return redis.scan(cursor, 'MATCH', pattern, 'COUNT', count);   
  }

  async componentDidMount() {
    const [newCursor, keys] = await this._scanKeys();

    this.setState({ keys });
    this.refs.keyList.focus();
  }

  render() {
    // FIXME
    return (
      <box position={{ top: 1, left: 1, bottom: 2, right: 3 }}>
        <box position={{ left: 0, top: 0, bottom: 0, width: 30 }}>
          <KeyList
            ref='keyList'
            keys={this.state.keys}
            theme={theme}
            onSelect={this.onKeySelected}>
          </KeyList>
        </box>
        <box position={{ left: 30, top: 0, right: 0 }}>
          <KeyContent
            keyName={this.state.keyContent.key}
            type={this.state.keyContent.type}
            value={this.state.keyContent.value}
            theme={theme}>
          </KeyContent>
        </box>
      </box>
    );
  }
}

export default withRedis(Database);

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
    selectedKey: null,
    selectedKeyType: null
  };

  onKeySelected = async (item, keyIndex) => {
    const { redis } = this.props;
    const key = this.state.keys[keyIndex];
    const type = await redis.type(key);

    this.setState({
      selectedKey: key,
      selectedKeyType: type
    });
  };

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
            keyName={this.state.selectedKey}
            type={this.state.selectedKeyType}
            theme={theme}>
          </KeyContent>
        </box>
      </box>
    );
  }
}

export default withRedis(Database);

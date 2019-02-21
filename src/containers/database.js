import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRedis } from '../contexts/redis-context';
import KeyContent from './/key-content';
import KeyList from '../components/key-list';
import Textbox from '../components/textbox';
import FilterableList from '../components/filterable-list';

class Database extends Component {
  static propTypes = {
    redis: PropTypes.object.isRequired
  };

  state = {
    keys: [],
    selectedKey: null,
    selectedKeyType: null
  };

  _onKeySelected = async (item, keyIndex) => {
    const key = this.state.keys[keyIndex];
    const type = await this._typeOf(key);

    this.setState({
      selectedKey: key,
      selectedKeyType: type
    });
  };

  async _typeOf(key) {
    const { redis } = this.props;
    const type = await redis.type(key);
    return type;
  }

  _loadKeys = async () => {
    const [newCursor, keys] = await this._scanKeys();
    this.setState({ keys });
  };

  _filterKeys = async pattern => {
    const [newCursor, keys] = await this._scanKeysStartWith(pattern);
    this.setState({ keys });
  };

  _scanKeysStartWith(pattern) {
    return this._scanKeys({
      pattern: pattern.endsWith('*') ? pattern : `${pattern}*`
    });
  }

  _scanKeys({
    cursor = 0,
    pattern = '*',
    count = 1000
  } = {}) {
    const { redis } = this.props;

    return redis.scan(cursor, 'MATCH', pattern, 'COUNT', count);   
  }

  _renderList() {
    return (
      <KeyList
        label='keys'
        ref='keyList'
        keys={this.state.keys}
        onSelect={this._onKeySelected} />
    );
  };

  async componentDidMount() {
    await this._loadKeys();
    this.refs.keyList.focus();
  }

  render() {
    const keyList = this._renderList();
    return (
      <box position={{ top: 1, left: 1, bottom: 2, right: 3 }}>
        <FilterableList
          position={{ left: 0, top: 0, bottom: 0, width: 30 }}
          List={keyList}
          filterList={this._filterKeys}
        />
        <box position={{ left: 30, top: 0, right: 0 }}>
          <KeyContent
            keyName={this.state.selectedKey}
            type={this.state.selectedKeyType}>
          </KeyContent>
        </box>
      </box>
    );
  }
}

export default withRedis(Database);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRedis } from '../contexts/redis-context';
import KeyContent from './key-content';
import KeyboardBindings from './keyboard-bindings';
import KeyList from '../components/key-list';
import FilterableList from '../components/filterable-list';
import AddNewKeyDialog from '../components/add-new-key-dialog';

class Database extends Component {
  static propTypes = {
    redis: PropTypes.object.isRequired
  };

  state = {
    keys: [],
    selectedKey: null,
    selectedKeyType: null
  };

  _handleKeySelect = async (item, keyIndex) => {
    const key = this.state.keys[keyIndex];
    const type = await this._typeOf(key);

    this.setState({
      selectedKey: key,
      selectedKeyType: type
    });
  };

  _addNewKeyIfNotExists = async (keyName, type) => {
    const { redis } = this.props;
    const keyExists = await redis.exists(keyName);
    if (!keyExists) {
      this._addNewKey(keyName, type);
    } else {
      // TODO handle error
    }
  };

  async _addNewKey(keyName, type) {
    await this._addNewKeyToDB(keyName, type);
    this._addNewKeyToState(keyName);
  }

  async _addNewKeyToDB(keyName, type) {
    const { redis } = this.props;
    switch (type) {
    case 'string':
      return redis.set(keyName, 'New String');
    case 'list':
      return redis.lpush(keyName, 'New Element');
    case 'hash':
      return redis.hset(keyName, 'New Key', 'New Value');
    case 'set':
      return redis.sadd(keyName, 'New Member');
    case 'zset':
      return redis.zadd(keyName, 0, 'New Member');
    }
  }

  _addNewKeyToState(newKey) {
    const newKeys = this.state.keys.concat(newKey);
    this.setState({ keys: newKeys });
  }

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

  _renderKeyList() {
    const keyboardBindings = [
      { key: 'f5', handler: this._loadKeys, description: 'Reload Keys' },
      { key: 'C-r', handler: this._loadKeys, description: 'Reload Keys' },
      { key: 'C-n', handler: this._openAddNewKeyDialog, description: 'Add New Key' }
    ];
    const hoverText = makeHoverText(keyboardBindings);
    return (
      <KeyboardBindings bindings={keyboardBindings}>
        <KeyList
          hoverText={hoverText}
          label='keys'
          ref='keyList'
          keys={this.state.keys}
          onSelect={this._handleKeySelect} />
      </KeyboardBindings>
    );
  }
  
  _openAddNewKeyDialog = () => this.refs.addNewKeyDialog.open();

  async componentDidMount() {
    this.refs.keyList.focus();
    await this._loadKeys();
  }

  render() {
    const keyList = this._renderKeyList();
    return (
      <box position={{ top: 1, left: 1, bottom: 2, right: 3 }}>
        <FilterableList 
          position={{left: 0, top: 0, bottom: 0, width: 30}}
          List={keyList}
          filterList={this._filterKeys}
          { ...this.props }
        />
        <box position={{ left: 30, top: 0, right: 0 }}>
          <KeyContent
            keyName={this.state.selectedKey}
            type={this.state.selectedKeyType}>
          </KeyContent>
        </box>
        <AddNewKeyDialog
          ref='addNewKeyDialog'
          onOk={this._addNewKeyIfNotExists} 
        />
      </box>
    );
  }
}

const makeHoverText = bindings => {
  return bindings.map(x => `${x.key}: ${x.description}`).join('\n');
};

export default withRedis(Database);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import KeyList from '../components/key-list';
import FilterableList from '../components/filterable-list';
import { withRedis } from '../contexts/redis-context';

class KeyListContainer extends Component {
  static propTypes = {
    handleKeySelect: PropTypes.func.isRequired,
    redis: PropTypes.object.isRequired
  };

  state = { keys: [] };

  _onKeySelected = (item, keyIndex) => {
    const selectedKey = this.state.keys[keyIndex];
    this.props.handleKeySelect(selectedKey);
  };

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
  focus() {
    this.refs.keyList.focus();
  }

  async componentDidMount() {
    this._loadKeys();
  }

  render() {
    const keyList = (
      <KeyList
        label='keys'
        ref='keyList'
        keys={this.state.keys}
        onSelect={this._onKeySelected} />
    );

    return (
      <FilterableList
        List={keyList}
        filterList={this._filterKeys}
        { ...this.props }
      />
    );
  }
}

export default withRedis(KeyListContainer);

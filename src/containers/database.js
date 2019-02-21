import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRedis } from '../contexts/redis-context';
import KeyContent from './/key-content';
import KeyList from './key-list';
import Textbox from '../components/textbox';
import FilterableList from '../components/filterable-list';

class Database extends Component {
  static propTypes = {
    redis: PropTypes.object.isRequired
  };

  state = {
    selectedKey: null,
    selectedKeyType: null
  };

  _handleKeySelect = async key => {
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

  componentDidMount() {
    this.refs.keyList.focus();
  }

  render() {
    return (
      <box position={{ top: 1, left: 1, bottom: 2, right: 3 }}>
        <KeyList
          handleKeySelect={this._handleKeySelect}
          position={{ left: 0, top: 0, bottom: 0, width: 30 }}
          ref='keyList'
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class KeyList extends Component {
  static propTypes = {
    keys: PropTypes.array.isRequired,
    theme: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired
  };

  focus() {
    this.refs.keyList.focus();
  }

  render() {
    const { keys, theme, onSelect } = this.props;

    return (
      <list
        ref='keyList'
        vi
        keys
        mouse
        scrollbar
        border='line'
        label='Keys'
        style={theme.list}
        items={keys}
        onSelect={onSelect}>
      </list>
    );
  }
}

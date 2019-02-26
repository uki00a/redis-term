import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme-context';
import List from './list';

class KeyList extends Component {
  static propTypes = {
    keys: PropTypes.array.isRequired,
    theme: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired
  };

  selected() {
    return this.refs.keyList.selected;
  }

  focus() {
    this.refs.keyList.focus();
  }

  render() {
    const { keys, theme, onSelect, ...restProps } = this.props;

    return (
      <List
        ref='keyList'
        items={keys}
        onSelect={onSelect}
        {...restProps}
      />
    );
  }
}

export default withTheme(KeyList);

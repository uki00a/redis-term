import React, { forwardRef, Component } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme-context';

class List extends Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    items: PropTypes.array
  };

  selected() {
    return this.refs.list.selected;
  }

  focus() {
    this.refs.list.focus();
  }

  render() {
    const { items = [], theme, ...restProps } = this.props;;

    return (
      <list
        ref='list'
        clickable
        mouse
        scrollbar
        scrollable
        alwaysScroll
        keys
        vi
        border='line'
        items={items}
        style={theme.list}
        {...restProps}
      />
    );
  }
}

export default withTheme(List);

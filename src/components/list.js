import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme-context';

/**
 * @this {never}
 */
const List = forwardRef(({
  items = [],
  theme,
  ...restProps
}, ref) => {
  const list = useRef(null)

  useImperativeHandle(ref, () => ({
    selected() {
      return list.current.selected;
    },
    focus() {
      list.current.focus();
    }
  }));

  return (
    <list
      ref={list}
      clickable
      mouse
      scrollbar
      scrollable
      alwaysScroll
      keys
      keyable
      vi
      border='line'
      items={items}
      style={theme.list}
      {...restProps}
    />
  );
});

List.propTypes = {
  theme: PropTypes.object.isRequired,
  items: PropTypes.array
};

export default withTheme(List);

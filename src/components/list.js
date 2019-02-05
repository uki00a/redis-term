import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme-context';

const List = forwardRef(({
  items = [],
  theme,
  ...restProps
}, ref) => (
  <list
    ref={ref}
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
));

List.propTypes = {
  theme: PropTypes.object.isRequired,
  items: PropTypes.array
};

export default withTheme(List);

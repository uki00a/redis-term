import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme-context';

const List = ({
  items = [],
  theme,
  ...restProps
}) => (
  <list
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

List.propTypes = {
  theme: PropTypes.object.isRequired,
  items: PropTypes.array
};

export default withTheme(List);

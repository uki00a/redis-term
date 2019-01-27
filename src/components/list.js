import React from 'react';
import PropTypes from 'prop-types';

const List = ({
  items = [],
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
    {...restProps}
  />
);

List.propTypes = {
  items: PropTypes.array
};

export default List;

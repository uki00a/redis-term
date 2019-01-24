import React from 'react';
import PropTypes from 'prop-types';

const Table = ({
  data = [],
  ...restProps
}) => (
  <listtable
    data={data}
    border='line'
    alwaysScroll
    scrollbar
    scrollable
    mouse
    clickable
    keys
    vi
    {...restProps}
  />
);

Table.propTypes = { data: PropTypes.array };

export default Table;

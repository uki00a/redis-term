import React from 'react';

/**
 * @param {string[]} keys
 */
const KeyList = ({ keys, theme }) => (
  <list
    keys
    mouse
    scrollbar
    border='line'
    label='Keys'
    style={Object.assign({}, theme.box, theme.box.focus)}
    items={keys}>
  </list>
);

export default KeyList;

import React from 'react';

/**
 * @param {object} param0
 * @param {string[]} param0.keys
 * @param {object} param0.theme
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

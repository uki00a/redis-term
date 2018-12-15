import React from 'react';

const KeyContent = ({ value, type, theme }) => (
  <box
    content={value}
    style={theme.box.normal}
    border='line'>
  </box>
);

export default KeyContent;

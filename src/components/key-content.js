import React from 'react';
import PropTypes from 'prop-types';

const KeyContent = ({ value, type, theme }) => (
  <box
    content={value}
    style={theme.box.normal}
    border='line'>
  </box>
);

KeyContent.propTypes = {
  value: PropTypes.any,
  type: PropTypes.string,
  theme: PropTypes.object.isRequired
};

export default KeyContent;

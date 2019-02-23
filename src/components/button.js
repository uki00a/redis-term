import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ disabled, onClick, ...restProps }) => (
  <button
    keys
    position={{ top: 9, height: 1, left: 2, width: 6 }}
    mouse
    clickable
    onClick={disabled ? null : onClick}
    {...restProps}
  />
);

Button.propTypes = { disabled: PropTypes.bool };

export default Button;

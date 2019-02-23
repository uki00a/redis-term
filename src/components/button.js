import React from 'react';
import PropTypes from 'prop-types';


const Button = ({ disabled, onClick, style, ...restProps }) => {
  const props = {
    keys: true,
    mouse: true,
    clickable: true,
    onClick: disabled ? null : onClick,
    ...restProps
  };

  return (
    <button
      style={Object.assign({ transparent: Boolean(disabled) }, style)}
      {...props}
    />
  );
};

Button.propTypes = { disabled: PropTypes.bool };

export default Button;

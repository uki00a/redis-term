import React, { useImperativeHandle, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * @this {never}
 */
const Button = forwardRef(({
  disabled,
  onClick,
  style,
  ...restProps
}, ref) => {
  const props = {
    keys: true,
    mouse: true,
    clickable: true,
    onClick: disabled ? null : onClick,
    ...restProps
  };

  const button = useRef(null);

  const handleKeypress = (ch, key) => {
    if (key.full === 'enter') {
      button.current.emit('click');
    }
  };

  useImperativeHandle(ref, () => ({
    click() {
      button.current.emit('click');
    },
    focus() {
      button.current.focus();
    }
  }));

  return (
    <button
      onKeypress={handleKeypress}
      ref={button}
      style={Object.assign({ transparent: Boolean(disabled) }, style)}
      {...props}
    />
  );
});

Button.propTypes = { disabled: PropTypes.bool };

export default Button;

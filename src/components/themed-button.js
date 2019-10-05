import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme-context';
import Button from './button';

/** @this {never} */
const ThemedButton = forwardRef(({
  theme,
  ...restProps
}, ref) => {
  const button = useRef(null);

  useImperativeHandle(ref, () => ({
    click() {
      button.current.press();
    },
    focus() {
      button.current.focus();
    }
  }));

  return (
    <Button
      ref={button}
      style={theme.button}
      {...restProps}
    />
  );
});

ThemedButton.propTypes = {
  theme: PropTypes.object.isRequired
};

export default withTheme(ThemedButton);

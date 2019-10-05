import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * @this {never}
 */
const TextboxLike = forwardRef(({
  onFocus,
  onBlur,
  onKeypress,
  children,
  disabled,
  style,
  defaultValue,
  ...restProps
}, ref) => {
  const textbox = useRef(null);

  // FIXME: Workaround for TypeError when inputOnFocus is set.
  // `TypeError: done is not a function`
  const handleFocus = () => {
    if (disabled) {
      return;
    }

    if (textbox.current) {
      textbox.current.readInput();
    }

    if (onFocus) {
      onFocus();
    }
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur();
    }
  };

  const handleKeypress = (ch, key) => {
    if (key.full === 'tab') {
      textbox.current.cancel();
      return false;
    } else if (onKeypress) {
      return onKeypress(ch, key); 
    } else {
      return false;
    }
  };

  const setValue = value => {
    if (textbox.current) {
      textbox.current.setValue(value);
    }
  };

  useImperativeHandle(ref, () => ({
    focus() {
      textbox.current.focus();
    },
    setValue,
    value() {
      return textbox.current.value;
    }
  }))

  useEffect(() => {
    if (defaultValue) {
      // FIXME
      // Workaround for: `TypeError: Cannot read property 'height' of null`
      // `<textarea ... value={this.state.value} />`
      setValue(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    const ref = textbox.current;

    return () => {
      ref.removeAllListeners('keypress');
    };
  }, []);

  const props = ({
    style: Object.assign({ transparent: Boolean(disabled) }, style),
    keyable: true,
    clickable: false,
    keys: !disabled,
    mouse: true,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onKeypress: handleKeypress,
    ref: textbox,
    ...restProps
  });

  return children(props);
});

TextboxLike.propTypes = { 
  defaultValue: PropTypes.string,
  children: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  onKeypress: PropTypes.func
};

export default TextboxLike;
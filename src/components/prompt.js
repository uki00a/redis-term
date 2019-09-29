import React, { useImperativeHandle, useState, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import Dialog from './dialog';
import ThemedButton from './themed-button';
import Textbox from './textbox';
import { withTheme } from '../contexts/theme-context';

/**
 * @this {never}
 */
const Prompt = forwardRef(({
  title,
  onOk,
  onCancel,
  theme,
  ...restProps
}, ref) => {
  const [isOpened, setOpened] = useState(false);
  const input = useRef(null);

  const handleOk = () => {
    const value = input.current.value();

    onOk(value);
    close();
  };

  const handleCancel = () => {
    close(() => onCancel());
  };

  const open = () => {
    setOpened(true);
  };

  const close = callback => {
    setOpened(false);
    if (callback) setImmediate(callback);
  };

  useImperativeHandle(ref, () => ({
    open,
    close
  }));

  return (
    <Dialog
      isOpened={isOpened}
      title={title}
      { ...restProps }>
      <Textbox
        style={theme.textbox}
        position={{ top: 3, height: 1, left: 2, right: 2 }}
        bg='black'
        hoverBg='blue'
        ref={input}
      />
      <ThemedButton
        position={{ top: 5, height: 1, left: 2, width: 6 }}
        content='OK'
        align='center'
        onClick={handleOk}
      />
      <ThemedButton
        position={{ top: 5, height: 1, left: 10, width: 8 }}
        content='Cancel'
        align='center'
        onClick={handleCancel}
      />
    </Dialog>
  );
});

Prompt.propTypes = {
  title: PropTypes.string,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
};

export default withTheme(Prompt);

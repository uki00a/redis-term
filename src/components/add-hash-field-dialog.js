import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';
import Textbox from './textbox';
import ThemedButton from './themed-button';
import Dialog from './dialog';
import { withTheme } from '../contexts/theme-context';

/**
 * @this {never}
 */
const AddHashFieldDialog = forwardRef(({
  onOk,
  onCancel,
  theme,
  title,
  ...restProps
}, ref) => {
  const [isOpened, setOpened] = useState(false);
  const keyInput = useRef(null);
  const valueInput = useRef(null);

  const handleOk = () => {
    const key = keyInput.current.value();
    const value = valueInput.current.value();

    onOk(key, value);
    close();
  };
  const handleCancel = () => close(() => onCancel());

  const close = (callback) => {
    setOpened(false);
    // TODO
    if (callback) setImmediate(callback);
  };

  useImperativeHandle(ref, () => ({
    open() {
      setOpened(true);
    }
  }));

  return (
    <Dialog
      title={title}
      isOpened={isOpened}
      { ...restProps }>
      <text
        content='Key:'
        style={theme.box}
        position={{ top: 3, height: 1, left: 2, right: 2 }}
      />
      <Textbox
        style={theme.textbox}
        position={{ top: 4, height: 1, left: 2, right: 2 }}
        name='keyInput'
        bg='black'
        hoverBg='blue'
        ref={keyInput}
      />
      <text
        content='Value:'
        style={theme.box}
        position={{ top: 6, height: 1, left: 2, right: 2 }}
      />
      <Textbox
        style={theme.textbox}
        position={{ top: 7, height: 1, left: 2, right: 2 }}
        name='valueInput'
        bg='black'
        hoverBg='blue'
        ref={valueInput}
      />
      <ThemedButton
        position={{ top: 9, height: 1, left: 2, width: 6 }}
        content='OK'
        align='center'
        onClick={handleOk}
      />
      <ThemedButton
        position={{ top: 9, height: 1, left: 10, width: 8 }}
        content='Cancel'
        align='center'
        onClick={handleCancel}
      />
    </Dialog>
  );
});

AddHashFieldDialog.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  title: PropTypes.string
};

export default withTheme(AddHashFieldDialog);

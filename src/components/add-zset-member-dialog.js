import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';
import Textbox from './textbox';
import Dialog from './dialog';
import ThemedButton from './themed-button';
import { withTheme } from '../contexts/theme-context';

/**
 * @this {never}
 */
const AddZsetMemberDialog = forwardRef(({
  title,
  theme,
  onOk,
  onCancel,
  ...restProps
}, ref) => {
  const [isOpened, setOpened] = useState(false);
  const scoreInput = useRef(null);
  const valueInput = useRef(null);

  const handleOk = () => {
    const score = scoreInput.current.value();
    const value = valueInput.current.value();
    onOk(score, value);
    close();
  };

  const handleCancel = () => {
    close(() => {
      onCancel();
    });
  };

  const close = callback => {
    setOpened(false);
    // TODO
    if (callback) {
      setImmediate(callback);
    }
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
        content='Score:'
        style={theme.box}
        position={{ top: 3, height: 1, left: 2, right: 2 }}
      />
      <Textbox
        style={theme.textbox}
        position={{ top: 4, height: 1, left: 2, right: 2 }}
        name='scoreInput'
        bg='black'
        hoverBg='blue'
        ref={scoreInput}
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

AddZsetMemberDialog.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
};

export default withTheme(AddZsetMemberDialog);

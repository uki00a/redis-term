// @ts-check
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';
import Dialog from './dialog';
import ThemedButton from './themed-button';
import { withTheme } from '../contexts/theme-context';

/**
 * @this {never}
 */
const ConfirmationDialog = forwardRef(({
  text,
  position = {},
  theme,
  onOk,
  onCancel,
  ...restProps
}, ref) => {
  const [isOpened, setOpened] = useState(false);
  const lineHeight = text.split('\n').length + 1;
  const boxOffset = 2;
  const buttonOffset = lineHeight + boxOffset;
  const dialogHeight = buttonOffset * 2;
  const dialogPosition = { height: dialogHeight, ...position };

  const handleOk = () => {
    onOk();
    close();
  };

  const close = () => {
    setOpened(false);
    setImmediate(() => onCancel());
  };

  useImperativeHandle(ref, () => ({
    open() {
      setOpened(true);
    }
  }));

  return (
    <Dialog
      isOpened={isOpened}
      position={dialogPosition}
      {...restProps}>
      <box
        style={theme.box}
        position={{ top: boxOffset, height: lineHeight, left: 2, right: 2 }}
        content={text}
        tags
      />
      <ThemedButton
        position={{ top: buttonOffset, height: 1, left: 2, width: 6 }}
        content='OK'
        align='center'
        onClick={handleOk}
      />
      <ThemedButton
        position={{ top: buttonOffset, height: 1, left: 10, width: 8 }}
        content='Cancel'
        align='center'
        onClick={close}
      />
    </Dialog>
  );
});

ConfirmationDialog.propTypes = {
  text: PropTypes.string.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default withTheme(ConfirmationDialog);

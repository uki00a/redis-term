import React, { useState, useImperativeHandle, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import Dialog from './dialog';
import ThemedButton from './themed-button';
import { withTheme } from '../contexts/theme-context';

/**
 * @this {never}
 */
const MessageDialog = forwardRef(({
  text,
  position = {},
  theme,
  onHide,
  ...restProps
}, ref) => {
  const [isOpened, setOpened] = useState(false);
  const okButton = useRef(null);
  const dialogPosition = { height: 'shrink', ...position };

  const open = () => {
    setOpened(true);
    setImmediate(() => okButton.current.focus());
  };

  const close = () => {
    setOpened(false);
    _handleMessageDialogHidden();
  };

  const _onHide = () => {
    setOpened(false);
    _handleMessageDialogHidden();
  };

  const _handleMessageDialogHidden = () => {
    if (onHide) {
      onHide();
    }
  };

  useImperativeHandle(ref, () => ({
    open,
    close
  }));

  return (
    <Dialog
      isOpened={isOpened && Boolean(text)}
      position={dialogPosition}
      onHide={_onHide}
      {...restProps}>
      <box
        style={theme.box}
        position={{ top: 2, left: 2, right: 2 }}
        content={text}
        tags
      />
      <ThemedButton
        ref={okButton}
        position={{ bottom: 1, height: 1, right: 2, width: 4 }}
        content='OK'
        align='center'
        onClick={close}
      />
    </Dialog>
  );
});

MessageDialog.propTypes = {
  text: PropTypes.string,
  theme: PropTypes.object.isRequired,
  onHide: PropTypes.func
};

export default withTheme(MessageDialog);

import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme-context';
import Form from './form';

/**
 * @this {never}
 */
const Dialog = forwardRef((props, ref) => {
  const {
    isOpened,
    theme,
    title,
    children,
    ...restProps
  } = props;

  const dialog = useRef(null);

  const handleKeypress = (ch, key) => {
    if (key.full === 'escape') {
      dialog.current.hide();
    }
  };

  const focus = () => {
    dialog.current.focusNext();
  };

  const focusFirstElement = () => {
    dialog.current.focus();
    focus();
  };

  useImperativeHandle(ref, () => ({ focus }));

  useEffect(() => {
    if (isOpened) {
      dialog.current.setFront();
      dialog.current.setIndex(2000);
      focusFirstElement();
    } else {
      dialog.current.setBack();
    }
  }, [isOpened]);

  return (
    <Form
      onKeypress={handleKeypress}
      ref={dialog}
      hidden={!isOpened}
      style={theme.dialog}
      content={title}
      border='line'
      tags
      {...restProps}>
      {
        children
      }
    </Form>
  );
});

Dialog.propTypes = {
  isOpened: PropTypes.bool.isRequired,
  theme: PropTypes.object.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default withTheme(Dialog);

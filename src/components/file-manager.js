import React, { useState, useRef, useImperativeHandle, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme-context';

/**
 * @this {never}
 */
const FileManager = forwardRef((props, ref) => {
  const [isOpened, setOpened] = useState(false);
  const fileManager = useRef(null);
 
  const onFile = file => {
    props.onFile(file);
    close();
  };

  const prepareFileManager = () => {
    fileManager.current.refresh(() => {
      fileManager.current.setFront();
      fileManager.current.focus();
    });
  };

  const open = () => {
    setOpened(true);
    setImmediate(prepareFileManager);
  };

  const close = () => {
    setOpened(false);
    setImmediate(() => {
      fileManager.current.setBack(); 

      // FIXME Workaround for onHide does not work
      if (props.onHide) {
        props.onHide();
      }
    });
  };

  useImperativeHandle(ref, () => ({
    open,
    close
  }));

  useEffect(() => {
    const handleKeypress = (ch, key) => {
      if (key.full === 'escape') {
        close();
      }
      return false;
    };

    const fm = fileManager.current;
    fm.on('keypress', handleKeypress);

    return () => {
      fm.removeListener('keypress', handleKeypress);
    };
  }, []); // eslint-disable-line

  return (
    <filemanager
      border='line'
      style={props.theme.box}
      { ...props }
      keys
      clickable
      keyable
      mouse
      vi
      onFile={onFile}
      hidden={!isOpened}
      ref={fileManager} 
    />
  );
});

FileManager.propTypes = {
  theme: PropTypes.object.isRequired,
  cwd: PropTypes.string,
  onFile: PropTypes.func.isRequired
};

export default withTheme(FileManager);

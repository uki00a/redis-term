import React, { forwardRef, useState, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import Textbox from './textbox';
import ThemedButton from './themed-button';
import Dialog from './dialog';
import { withTheme } from '../contexts/theme-context';

/**
 * @this {never}
 */
const AddNewKeyDialog = forwardRef(({ theme, onOk, onCancel }, ref) => {
  const [isOpened, setOpened] = useState(false);
  const keyInput = useRef(null);
  const types = useRef(null);
  const handleOk = () => {
    const keyName = keyInput.current.value();
    const type = _checkedType();
    onOk(keyName, type);
    close();
  };

  const handleCancel = () => {
    close(() => onCancel());
  };

  const close = (callback) => {
    setOpened(false);
    // TODO
    if (callback) {
      setImmediate(callback);
    }
  };

  const _checkedType = () => {
    const type = types.current.children.find(x => x.checked);
    return type && type.name;
  };


  useImperativeHandle(ref, () => ({
    open() {
      setOpened(true);
    }
  }));

  return (
    <Dialog
      title='Add New Key'
      isOpened={isOpened}>
      <text
        style={theme.box}
        content='Key:'
        position={{ top: 3, height: 1, left: 2, right: 2 }}
      />
      <Textbox
        style={theme.textbox}
        name='keyName'
        position={{ top: 4, height: 1, left: 2, right: 2 }}
        name='keyInput'
        bg='black'
        hoverBg='blue'
        ref={keyInput}
      />
      <text
        style={theme.box}
        content='Type:'
        position={{ top: 5, height: 1, left: 2, right: 2}}
      />
      <radioset
        style={theme.box}
        ref={types}
        position={{ top: 6, height: 2, left: 2, right: 2 }}>
        {
          ['string', 'list', 'hash', 'set', 'zset'].map((type, i) => (
            <radiobutton 
              style={theme.box}
              key={type}
              keys
              clickable
              mouse
              name={type}
              position={{ top: 0, left: 12 * i }}
              checked={i === 0}
              content={type}
            />
          ))
        }
      </radioset>
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

AddNewKeyDialog.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
};

export default withTheme(AddNewKeyDialog);

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme-context';
import List from './list';

/**
 * @this {never}
 */
const KeyList = forwardRef(({
  keys,
  onSelect,
  ...restProps
}, ref) => {
  const keyList = useRef(null);

  useImperativeHandle(ref, () => ({
    selected() {
      return keyList.current.selected();
    },
    focus() {
      keyList.current.focus();
    }
  }));

  return (
    <List
      ref={keyList}
      items={keys}
      onSelect={onSelect}
      {...restProps}
    />
  );
});

KeyList.propTypes = {
  keys: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default withTheme(KeyList);

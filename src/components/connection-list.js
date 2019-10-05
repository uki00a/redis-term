import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';
import ScrollableBox from './scrollable-box';
import List from './list';

/**
 * @this {never}
 */
const ConnectionList = forwardRef(({ connections, ...restProps }, ref) => {
  const list = useRef(null);

  useImperativeHandle(ref, () => ({
    focus() {
      list.current.focus();
    },
    selected() {
      return list.current.selected();
    }
  }));

  return (
    <ScrollableBox position={{ left: 'center', top: 'center', height: 32 }}>
      <List
        ref={list}
        items={connections.map(x => x.name)}
        { ...restProps }
      />
    </ScrollableBox>
  );
});

ConnectionList.propTypes = {
  connections: PropTypes.array.isRequired
};

export default ConnectionList;
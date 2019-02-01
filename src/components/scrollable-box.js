import React from 'react';
import PropTypes from 'prop-types';

const ScrollableBox = ({
  children,
  ...restProps
}) => (
  <box
    keys
    mouse
    vi
    keyable
    clickable
    scrollable
    scrollbar
    alwaysScroll
    {...restProps}>
    {
      children
    }
  </box>
);

ScrollableBox.propTypes = {
  children: PropTypes.node.isRequired
};

export default ScrollableBox;

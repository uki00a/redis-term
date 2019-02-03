import React from 'react';
import PropTypes from 'prop-types';

const defaultStyle = {
  scrollbar: { bg: '#e7e7e7' }
};

const ScrollableBox = ({
  children,
  style = defaultStyle,
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
    style={style}
    {...restProps}>
    {
      children
    }
  </box>
);

ScrollableBox.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object
};

export default ScrollableBox;

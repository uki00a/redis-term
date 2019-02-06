import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme-context';

const Dialog = ({
  isOpened,
  theme,
  title,
  children,
  ...restProps
}) => (
  <box
    hidden={!isOpened}
    style={theme.dialog}
    content={title}
    border='line'
    draggable
    {...restProps}>
    {
      children
    }
  </box>
);

Dialog.propTypes = {
  isOpened: PropTypes.bool.isRequired,
  theme: PropTypes.object.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default withTheme(Dialog);

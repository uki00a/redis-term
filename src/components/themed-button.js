import React from 'react';
import { withTheme } from '../contexts/theme-context';

const ThemedButton = withTheme(({
  theme,
  ...restProps
}) => (
  <button
    keys
    style={theme.button}
    position={{ top: 9, height: 1, left: 2, width: 6 }}
    mouse
    clickable
    {...restProps}
  />
));

export default ThemedButton;

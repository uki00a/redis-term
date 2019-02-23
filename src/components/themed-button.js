import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme-context';
import Button from './button';

const ThemedButton = withTheme(({ theme, ...restProps }) => (
  <Button
    style={theme.button}
    {...restProps}
  />
));

ThemedButton.propTypes = { theme: PropTypes.object.isRequired };

export default ThemedButton;

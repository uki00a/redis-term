import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme-context';
import { isEmptyArray } from '../modules/utils';

const ActiveKeyboardBindings = ({ keyboardBindings = [], theme }) => isEmptyArray(keyboardBindings)
  ? null
  : (
    <text
      tags
      position={{ bottom: 0, width: '100%' }}
      style={theme.activeKeyboardBindings}
      content={formatKeyboardBindings(keyboardBindings)}>
    </text>
  );

ActiveKeyboardBindings.propTypes = {
  keyboardBindings: PropTypes.array,
  theme: PropTypes.object.isRequired
};

const formatKeyboardBindings = keyboardBindings => {
  return keyboardBindings.map(x => `{bold}${x.key}{/bold}-${x.description}`).join(' ');
};

export default withTheme(ActiveKeyboardBindings);
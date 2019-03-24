import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme-context';
import TextboxLike from './textbox-like';

const Editor = forwardRef((props, ref) => (
  <TextboxLike
    ref={ref}
    style={Object.assign({}, props.theme.editor, props.disabled ? props.theme.editor.disabled : null)}
    border='line'
    input
    { ...props }>
    {props => <textarea {...props} />}
  </TextboxLike>
));

Editor.propTypes = {
  theme: PropTypes.object.isRequired,
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool
};

export default withTheme(Editor);

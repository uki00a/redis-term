import React, { Component, forwardRef } from 'react';
import PropTypes from 'prop-types';
import TextboxLike from './textbox-like';

const Textbox = forwardRef((props, ref) => (
  <TextboxLike
    ref={ref}
    { ...props }>
    {props => <textbox { ...props } />}
  </TextboxLike>
));

Textbox.propTypes = {
  defaultValue: PropTypes.string
};

export default Textbox;
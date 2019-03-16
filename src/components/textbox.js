import React, { Component, forwardRef } from 'react';
import PropTypes from 'prop-types';
import TextboxLike from './textbox-like';

const Textbox = forwardRef((props, ref) => (
  <TextboxLike
    ref={ref}
    renderElement={props => <textbox { ...props } />}
    { ...props }
  />
));

Textbox.propTypes = {
  defaultValue: PropTypes.string
};

export default Textbox;
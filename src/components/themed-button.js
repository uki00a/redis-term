import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme-context';
import Button from './button';

class ThemedButton extends Component {
  static propTypes = { theme: PropTypes.object.isRequired }

  click() {
    this.refs.button.press();
  }

  focus() {
    this.refs.button.focus();
  }

  render () {
    const { theme, ...restProps } = this.props;

    return (
      <Button
        ref='button'
        style={theme.button}
        {...restProps}
      />
    );
  }
}

export default withTheme(ThemedButton);

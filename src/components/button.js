import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Button extends Component {
  static propTypes = { disabled: PropTypes.bool };

  click() {
    this.refs.button.emit('click');
  }

  focus() {
    this.refs.button.focus();
  }

  _handleKeypress = (ch, key) => {
    if (key.full === 'enter') {
      this.click();
    }
  };

  render() {
    const { disabled, onClick, style, ...restProps } = this.props;
    const props = {
      keys: true,
      mouse: true,
      clickable: true,
      onClick: disabled ? null : onClick,
      ...restProps
    };

    return (
      <button
        onKeypress={this._handleKeypress}
        ref='button'
        style={Object.assign({ transparent: Boolean(disabled) }, style)}
        {...props}
      />
    );
  }
}

export default Button;

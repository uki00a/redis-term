import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { noop } from '../modules/utils';

class KeyboardBindings extends Component {
  static propTypes = {
    bindings: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired, 
      handler: PropTypes.func.isRequired
    })).isRequired,
    children: PropTypes.node
  };

  _handleFocus = () => {
    this._focused = true;
  };

  _handleBlur = () => {
    this._focused = false;
  };

  _handleKeypressIfFocused = (ch, key) => {
    if (!this._focused) return;
    this._handleKeypress(ch, key);
  };

  _handleKeypress(ch, key) {
    const handler = this._findHandlerFor(key) || noop;
    handler();
  }

  _findHandlerFor(key) {
    return this.props.bindings.find(binding => key.full === binding);   
  }

  render() {
    return cloneElement(this.props.children, {
      onFocus: this._handleFocus,
      onBlur: this._handleBlur,
      onKeypress: this._handleKeypressIfFocused
    });
  }
}

export default KeyboardBindings;

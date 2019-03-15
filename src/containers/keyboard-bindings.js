import React, { Component, cloneElement } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { noop } from '../modules/utils';
import { actions } from '../modules/redux/keyboard-bindings';

class KeyboardBindings extends Component {
  static propTypes = {
    bindings: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired, 
      handler: PropTypes.func.isRequired
    })).isRequired,
    children: PropTypes.node,
    enableKeyboardBindings: PropTypes.func.isRequired,
    disableKeyboardBindings: PropTypes.func.isRequired
  };

  _handleFocus = () => {
    this._focused = true;
    this.props.enableKeyboardBindings(this.props.bindings);
  };

  _handleBlur = () => {
    this._focused = false;
    this.props.disableKeyboardBindings(this.props.bindings);
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
    const found = this.props.bindings.find(binding => key.full === binding.key);   
    return found && found.handler;
  }

  render() {
    return cloneElement(this.props.children, {
      onFocus: this._handleFocus,
      onBlur: this._handleBlur,
      onKeypress: this._handleKeypressIfFocused
    });
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {
  enableKeyboardBindings: actions.enableKeyboardBindings,
  disableKeyboardBindings: actions.disableKeyboardBindings
};

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(KeyboardBindings);

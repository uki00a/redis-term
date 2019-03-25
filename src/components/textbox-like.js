import React, { Component, forwardRef } from 'react';
import PropTypes from 'prop-types';

class TextboxLike extends Component {
  static propTypes = { 
    defaultValue: PropTypes.string,
    children: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  };
  // FIXME: Workaround for TypeError when inputOnFocus is set.
  // `TypeError: done is not a function`
  _onFocus = () => {
    if (this.props.disabled) {
      return;
    }

    this.refs.textbox.readInput();
    

    if (this.props.onFocus) {
      this.props.onFocus();
    }
  };

  _onBlur = () => {
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  };

  _onKeypress = (ch, key) => {
    if (key.full === 'tab') {
      this.refs.textbox.screen.focusNext();
      this.refs.textbox.cancel();
    } else {
      return false;
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.defaultValue !== this.props.defaultValue) {
      // FIXME
      // Workaround for: `TypeError: Cannot read property 'height' of null`
      // `<textarea ... value={this.state.value} />`
      this.setValue(this.props.defaultValue);
    }
  }

  componentDidMount() {
    if (this.props.defaultValue) {
      // FIXME
      // Workaround for: `TypeError: Cannot read property 'height' of null`
      // `<textarea ... value={this.state.value} />`
      this.setValue(this.props.defaultValue);
    }
  }

  componentWillUnmount() {
    this.refs.textbox.removeAllListeners('keypress');
  }

  focus() {
    this.refs.textbox.focus();
  }

  setValue(value) {
    if (this.refs.textbox) {
      this.refs.textbox.setValue(value);
    }
  }

  value() {
    return this.refs.textbox.value;
  }

  render() {
    const { onFocus, onBlur, onKeypress, children, disabled, style, ...restProps } = this.props;

    const props = ({
      style: Object.assign({ transparent: Boolean(disabled) }, style),
      keyable: true,
      clickable: false,
      keys: !disabled,
      mouse: true,
      onFocus: this._onFocus,
      onBlur: this._onBlur,
      onKeypress: this._onKeypress,
      ref: 'textbox',
      ...restProps
    });

    return children(props);
  }
}

export default TextboxLike;
import React, { Component, forwardRef } from 'react';
import PropTypes from 'prop-types';

class TextboxLike extends Component {
  static propTypes = { 
    defaultValue: PropTypes.string,
    renderElement: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  };
  // FIXME: Workaround for TypeError when inputOnFocus is set.
  // `TypeError: done is not a function`
  _onFocus = () => {
    if (this.props.disabled) {
      return;
    }
    setImmediate(() => this.refs.textbox.readInput());
  };

  componentDidUpdate(prevProps) {
    if (prevProps.defaultValue !== this.props.defaultValue) {
      // FIXME
      // Workaround for: `TypeError: Cannot read property 'height' of null`
      // `<textarea ... value={this.state.value} />`
      this.refs.textbox.setValue(this.props.defaultValue);
    }
  }

  componentDidMount() {
    if (this.props.defaultValue) {
      // FIXME
      // Workaround for: `TypeError: Cannot read property 'height' of null`
      // `<textarea ... value={this.state.value} />`
      this.refs.textbox.setValue(this.props.defaultValue);
    }

    this.refs.textbox.on('keypress', (ch, key) => {
      if (key.full === 'tab') {
        this.refs.textbox.screen.focusNext();
      }
    });
  }

  componentWillUnmount() {
    this.refs.textbox.removeAllListeners('keypress');
  }

  focus() {
    this.refs.textbox.focus();
  }

  setValue(value) {
    this.refs.textbox.setValue(value);
  }

  value() {
    return this.refs.textbox.value;
  }

  render() {
    const { onFocus, renderElement, disabled, style, ...props } = this.props;

    return renderElement({
      style: Object.assign({ transparent: Boolean(disabled) }, style),
      keyable: true,
      clickable: true,
      keys: true,
      mouse: true,
      onFocus: this._onFocus,
      ref: 'textbox',
      ...props
    });
  }
}

export default TextboxLike;
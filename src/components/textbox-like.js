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
    setImmediate(() => {
      if (this.refs.textbox) { // TypeError: Cannot read property 'readInput' of undefined
        this.refs.textbox.readInput();
      }
    });
  };

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
    if (this.refs.textbox) {
      this.refs.textbox.setValue(value);
    }
  }

  value() {
    return this.refs.textbox.value;
  }

  render() {
    const { onFocus, children, disabled, style, ...restProps } = this.props;

    const props = ({
      style: Object.assign({ transparent: Boolean(disabled) }, style),
      keyable: true,
      clickable: false, // FIXME when set this to true, `TypeError: done is not a function` occurred
      keys: !disabled,
      mouse: true,
      onFocus: this._onFocus,
      ref: 'textbox',
      ...restProps
    });

    return children(props);
  }
}

export default TextboxLike;